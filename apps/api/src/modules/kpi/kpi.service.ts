import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../../shared/database/prisma.service';
import { KPI_DEFINITIONS } from './entities/kpi-definition.entity';
import { formatPeriod, startOfMonth, endOfMonth } from '../../shared/utils/date';
import { NotificationService } from '../notification/notification.service';

interface KpiThreshold {
  warningMin?: number;
  warningMax?: number;
  dangerMin?: number;
  dangerMax?: number;
}

const KPI_THRESHOLDS: Record<string, KpiThreshold> = {
  turnover_rate: { warningMax: 15, dangerMax: 20 },
  retention_rate: { warningMin: 85, dangerMin: 80 },
  time_to_hire: { warningMax: 45, dangerMax: 60 },
  offer_acceptance_rate: { warningMin: 70, dangerMin: 50 },
  engagement_score: { warningMin: 3.5, dangerMin: 3.0 },
  headcount_growth: { warningMin: -2, dangerMin: -5 },
};

const RATING_VALUES: Record<string, number> = {
  EXCEPTIONAL: 5,
  EXCEEDS_EXPECTATIONS: 4,
  MEETS_EXPECTATIONS: 3,
  NEEDS_IMPROVEMENT: 2,
  UNSATISFACTORY: 1,
};

@Injectable()
export class KpiService {
  private readonly logger = new Logger(KpiService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly notificationService: NotificationService,
  ) {}

  async getSnapshots(kpiId?: string, moduleType?: string, period?: string) {
    return this.prisma.kpiSnapshot.findMany({
      where: {
        ...(kpiId ? { kpiId } : {}),
        ...(moduleType ? { moduleType: moduleType as any } : {}),
        ...(period ? { period } : {}),
      },
      orderBy: [{ period: 'desc' }, { kpiId: 'asc' }],
    });
  }

  async getLatestKpis(moduleType?: string) {
    const currentPeriod = formatPeriod(new Date());

    // Try current period first, fallback to latest available
    let snapshots = await this.prisma.kpiSnapshot.findMany({
      where: {
        period: currentPeriod,
        ...(moduleType ? { moduleType: moduleType as any } : {}),
      },
      orderBy: { kpiId: 'asc' },
    });

    if (snapshots.length === 0) {
      const latestSnapshot = await this.prisma.kpiSnapshot.findFirst({
        orderBy: { calculatedAt: 'desc' },
        select: { period: true },
      });
      if (latestSnapshot) {
        snapshots = await this.prisma.kpiSnapshot.findMany({
          where: {
            period: latestSnapshot.period,
            ...(moduleType ? { moduleType: moduleType as any } : {}),
          },
          orderBy: { kpiId: 'asc' },
        });
      }
    }

    return snapshots;
  }

  async calculateAndStore(): Promise<void> {
    this.logger.log('Starting KPI calculation...');
    const period = formatPeriod(new Date());
    const alerts: Array<{ kpiId: string; value: number; signal: string }> = [];

    for (const def of KPI_DEFINITIONS) {
      try {
        const value = await this.calculateKpi(def.id);
        const previous = await this.prisma.kpiSnapshot.findFirst({
          where: { kpiId: def.id, period: { not: period } },
          orderBy: { calculatedAt: 'desc' },
        });

        const target = this.getTarget(def.id);
        const signal = this.determineSignal(def.id, value);

        await this.prisma.kpiSnapshot.upsert({
          where: { kpiId_period: { kpiId: def.id, period } },
          create: {
            kpiId: def.id,
            moduleType: def.moduleType,
            value,
            previousValue: previous?.value,
            target,
            unit: def.unit,
            period,
          },
          update: {
            value,
            previousValue: previous?.value,
            target,
            calculatedAt: new Date(),
          },
        });

        if (signal === 'warning' || signal === 'negative') {
          alerts.push({ kpiId: def.id, value, signal });
        }

        this.logger.debug(`KPI ${def.id}: ${value} (${signal})`);
      } catch (error) {
        this.logger.error(`Failed to calculate KPI: ${def.id}`, error);
      }
    }

    // Send alert notifications for warning/danger KPIs
    if (alerts.length > 0) {
      await this.sendKpiAlerts(alerts);
    }

    this.logger.log(`KPI calculation completed: ${KPI_DEFINITIONS.length} KPIs processed, ${alerts.length} alerts`);
  }

  // ─── KPI Calculators ─────────────────────────────────

  private async calculateKpi(kpiId: string): Promise<number> {
    const now = new Date();
    const monthStart = startOfMonth(now);
    const monthEnd = endOfMonth(now);

    switch (kpiId) {
      case 'headcount_total':
        return this.prisma.employee.count({ where: { status: 'ACTIVE' } });

      case 'headcount_growth': {
        const currentCount = await this.prisma.employee.count({ where: { status: 'ACTIVE' } });
        const prevMonthEnd = new Date(now.getFullYear(), now.getMonth(), 0);
        const prevCount = await this.prisma.employee.count({
          where: {
            hireDate: { lte: prevMonthEnd },
            OR: [{ terminationDate: null }, { terminationDate: { gt: prevMonthEnd } }],
          },
        });
        return prevCount > 0 ? Math.round(((currentCount - prevCount) / prevCount) * 10000) / 100 : 0;
      }

      case 'turnover_rate': {
        const totalActive = await this.prisma.employee.count({ where: { status: 'ACTIVE' } });
        const yearStart = new Date(now.getFullYear(), 0, 1);
        const terminated = await this.prisma.employee.count({
          where: { status: 'TERMINATED', terminationDate: { gte: yearStart, lte: now } },
        });
        const annualized = totalActive > 0 ? (terminated / totalActive) * 100 : 0;
        return Math.round(annualized * 100) / 100;
      }

      case 'retention_rate': {
        const turnover = await this.calculateKpi('turnover_rate');
        return Math.round((100 - turnover) * 100) / 100;
      }

      case 'avg_tenure': {
        const employees = await this.prisma.employee.findMany({
          where: { status: 'ACTIVE' },
          select: { hireDate: true },
        });
        if (employees.length === 0) return 0;
        const totalMonths = employees.reduce((sum, e) => {
          return sum + (now.getTime() - e.hireDate.getTime()) / (30.44 * 24 * 60 * 60 * 1000);
        }, 0);
        return Math.round((totalMonths / employees.length) * 10) / 10;
      }

      case 'time_to_hire': {
        const hiredApps = await this.prisma.application.findMany({
          where: {
            stage: 'HIRED',
            updatedAt: { gte: new Date(now.getFullYear(), now.getMonth() - 3, 1) },
          },
          include: { requisition: { select: { openDate: true } } },
        });
        if (hiredApps.length === 0) return 0;
        const totalDays = hiredApps
          .filter((a) => a.requisition.openDate)
          .reduce((sum, a) => {
            const days = (a.updatedAt.getTime() - a.requisition.openDate!.getTime()) / (24 * 60 * 60 * 1000);
            return sum + Math.max(0, days);
          }, 0);
        const validCount = hiredApps.filter((a) => a.requisition.openDate).length;
        return validCount > 0 ? Math.round(totalDays / validCount) : 0;
      }

      case 'offer_acceptance_rate': {
        const threeMonthsAgo = new Date(now.getFullYear(), now.getMonth() - 3, 1);
        const offers = await this.prisma.application.count({
          where: { stage: { in: ['OFFER', 'HIRED'] }, updatedAt: { gte: threeMonthsAgo } },
        });
        const accepted = await this.prisma.application.count({
          where: { stage: 'HIRED', updatedAt: { gte: threeMonthsAgo } },
        });
        return offers > 0 ? Math.round((accepted / offers) * 10000) / 100 : 0;
      }

      case 'training_hours': {
        const completedEnrollments = await this.prisma.trainingEnrollment.findMany({
          where: { status: 'COMPLETED', completedAt: { gte: new Date(now.getFullYear(), 0, 1) } },
          include: { program: { select: { duration: true } } },
        });
        const activeEmpCount = await this.prisma.employee.count({ where: { status: 'ACTIVE' } });
        const totalHours = completedEnrollments.reduce((sum, e) => sum + (e.program.duration || 0), 0);
        return activeEmpCount > 0 ? Math.round((totalHours / activeEmpCount) * 10) / 10 : 0;
      }

      case 'engagement_score': {
        const latestPulse = await this.prisma.survey.findFirst({
          where: { type: 'PULSE', status: 'CLOSED' },
          orderBy: { endDate: 'desc' },
          include: { responses: { select: { score: true } } },
        });
        if (!latestPulse || latestPulse.responses.length === 0) return 0;
        const scores = latestPulse.responses.filter((r) => r.score !== null).map((r) => Number(r.score));
        return scores.length > 0 ? Math.round((scores.reduce((a, b) => a + b, 0) / scores.length) * 100) / 100 : 0;
      }

      case 'dei_ratio': {
        const latestMetrics = await this.prisma.deiMetric.findMany({
          where: { dimension: 'gender' },
          orderBy: { period: 'desc' },
          take: 10,
        });
        if (latestMetrics.length === 0) return 0;
        const avgValue = latestMetrics.reduce((sum, m) => sum + Number(m.value), 0) / latestMetrics.length;
        return Math.round(avgValue * 100) / 100;
      }

      default:
        return 0;
    }
  }

  // ─── Signal / Threshold Logic ────────────────────────

  private determineSignal(kpiId: string, value: number): string {
    const threshold = KPI_THRESHOLDS[kpiId];
    if (!threshold) return 'neutral';

    // Check danger levels first
    if (threshold.dangerMax !== undefined && value > threshold.dangerMax) return 'negative';
    if (threshold.dangerMin !== undefined && value < threshold.dangerMin) return 'negative';

    // Then warning levels
    if (threshold.warningMax !== undefined && value > threshold.warningMax) return 'warning';
    if (threshold.warningMin !== undefined && value < threshold.warningMin) return 'warning';

    return 'positive';
  }

  private getTarget(kpiId: string): number | undefined {
    const targets: Record<string, number> = {
      turnover_rate: 10,
      retention_rate: 90,
      time_to_hire: 30,
      offer_acceptance_rate: 85,
      engagement_score: 4.0,
      training_hours: 40,
      headcount_growth: 5,
    };
    return targets[kpiId];
  }

  // ─── Alerts ──────────────────────────────────────────

  private async sendKpiAlerts(alerts: Array<{ kpiId: string; value: number; signal: string }>) {
    // Find admin users to notify
    const adminUsers = await this.prisma.userAccount.findMany({
      where: {
        isActive: true,
        userRoles: { some: { role: { name: { in: ['ADMIN', 'HR_SPECIALIST', 'EXECUTIVE'] } } } },
      },
      select: { id: true },
    });

    for (const admin of adminUsers) {
      for (const alert of alerts) {
        const def = KPI_DEFINITIONS.find((d) => d.id === alert.kpiId);
        const type = alert.signal === 'negative' ? 'WARNING' as const : 'INFO' as const;

        await this.notificationService.send({
          userId: admin.id,
          type,
          title: `KPI Alert: ${def?.label || alert.kpiId}`,
          message: `${def?.label || alert.kpiId} is at ${alert.value}${def?.unit || ''} (${alert.signal})`,
          link: '/dashboard/kpi',
        });
      }
    }

    this.logger.log(`Sent ${alerts.length} KPI alerts to ${adminUsers.length} admins`);
  }
}
