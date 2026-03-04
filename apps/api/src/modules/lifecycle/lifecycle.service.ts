import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../../shared/database/prisma.service';
import { monthsBetween } from '../../shared/utils/date';

const RATING_VALUES: Record<string, number> = {
  EXCEPTIONAL: 5,
  EXCEEDS_EXPECTATIONS: 4,
  MEETS_EXPECTATIONS: 3,
  NEEDS_IMPROVEMENT: 2,
  UNSATISFACTORY: 1,
};

@Injectable()
export class LifecycleService {
  private readonly logger = new Logger(LifecycleService.name);

  constructor(private readonly prisma: PrismaService) {}

  // ─── Dashboard ───────────────────────────────────────

  async getDashboard() {
    const [
      employeeJourney,
      crossModuleInsights,
      attritionCorrelation,
      moduleKpiSummary,
    ] = await Promise.all([
      this.getEmployeeJourneyStages(),
      this.getCrossModuleAnalysis(),
      this.getAttritionCorrelation(),
      this.getModuleKpiSummary(),
    ]);

    const now = new Date();
    const yearStart = new Date(now.getFullYear(), 0, 1);
    const turnoverRate = await this.getTurnoverRate(yearStart, now);
    const retentionRate = await this.getRetentionRate(yearStart, now);
    const avgTenure = await this.getAverageTenure();
    const newHires = await this.getNewHires(yearStart, now);

    const kpis = [
      this.buildKpiCard('turnover_rate', 'Turnover Rate', turnoverRate, 0, '%', 'percent'),
      this.buildKpiCard('retention_rate', 'Retention Rate', retentionRate, 0, '%', 'percent'),
      this.buildKpiCard('avg_tenure', 'Avg Tenure', avgTenure, 0, 'mo', 'duration'),
      this.buildKpiCard('new_hires_ytd', 'New Hires (YTD)', newHires, 0, '', 'number'),
    ];

    return {
      kpis,
      employeeJourney,
      crossModuleInsights,
      attritionCorrelation,
      moduleKpiSummary,
    };
  }

  // ─── Journey Stages ──────────────────────────────────

  async getEmployeeJourneyStages() {
    const now = new Date();
    const yearStart = new Date(now.getFullYear(), 0, 1);

    // Recruitment → Onboarding → Active → Development → Performance → Transition/Exit
    const applied = await this.prisma.application.count({
      where: { appliedAt: { gte: yearStart } },
    });
    const hired = await this.prisma.application.count({
      where: { stage: 'HIRED', updatedAt: { gte: yearStart } },
    });
    const activeEmployees = await this.prisma.employee.count({
      where: { status: 'ACTIVE' },
    });
    const inTraining = await this.prisma.trainingEnrollment.count({
      where: { status: { in: ['ENROLLED', 'IN_PROGRESS'] } },
    });
    const reviewed = await this.prisma.performanceReview.count({
      where: { submittedAt: { not: null } },
    });
    const terminated = await this.prisma.employee.count({
      where: { status: 'TERMINATED', terminationDate: { gte: yearStart } },
    });

    return [
      { stage: 'Applied', avgDuration: 0, count: applied, conversionRate: applied > 0 ? Math.round((hired / applied) * 10000) / 100 : 0 },
      { stage: 'Hired', avgDuration: 30, count: hired, conversionRate: 100 },
      { stage: 'Active', avgDuration: 0, count: activeEmployees, conversionRate: 100 },
      { stage: 'In Training', avgDuration: 0, count: inTraining, conversionRate: activeEmployees > 0 ? Math.round((inTraining / activeEmployees) * 10000) / 100 : 0 },
      { stage: 'Reviewed', avgDuration: 0, count: reviewed, conversionRate: activeEmployees > 0 ? Math.round((reviewed / activeEmployees) * 10000) / 100 : 0 },
      { stage: 'Exited', avgDuration: 0, count: terminated, conversionRate: activeEmployees > 0 ? Math.round((terminated / activeEmployees) * 10000) / 100 : 0 },
    ];
  }

  async getEmployeeJourney(employeeId: string) {
    const employee = await this.prisma.employee.findUnique({
      where: { id: employeeId },
      include: {
        trainingEnrollments: { include: { program: true } },
        performanceReviews: { include: { cycle: true } },
        surveyResponses: true,
      },
    });

    if (!employee) return [];

    const now = new Date();
    const stages = [
      {
        stage: 'Hired',
        avgDuration: 0,
        count: 1,
        conversionRate: 100,
      },
      {
        stage: 'Onboarding',
        avgDuration: 3,
        count: 1,
        conversionRate: 100,
      },
      {
        stage: 'Training',
        avgDuration: monthsBetween(employee.hireDate, now),
        count: employee.trainingEnrollments.length,
        conversionRate: employee.trainingEnrollments.length > 0 ? 100 : 0,
      },
      {
        stage: 'Performance Review',
        avgDuration: 0,
        count: employee.performanceReviews.length,
        conversionRate: employee.performanceReviews.length > 0 ? 100 : 0,
      },
    ];

    if (employee.status === 'TERMINATED') {
      stages.push({
        stage: 'Exit',
        avgDuration: monthsBetween(employee.hireDate, employee.terminationDate || now),
        count: 1,
        conversionRate: 100,
      });
    }

    return stages;
  }

  // ─── Cross-Module Analysis ───────────────────────────

  async getCrossModuleAnalysis() {
    const insights: Array<{
      title: string;
      description: string;
      sourceModule: string;
      targetModule: string;
      correlationStrength: number;
      insight: string;
    }> = [];

    // 1. Recruitment Channel → Performance Rating
    const hiredApps = await this.prisma.application.findMany({
      where: { stage: 'HIRED' },
      include: {
        candidate: { select: { source: true } },
        requisition: { select: { departmentId: true } },
      },
    });

    // Find employees who were hired and have performance reviews
    const hiredEmails = await this.prisma.employee.findMany({
      where: { status: 'ACTIVE' },
      include: {
        performanceReviews: {
          where: { rating: { not: null } },
          select: { rating: true },
          take: 1,
          orderBy: { createdAt: 'desc' },
        },
      },
    });

    const withReviews = hiredEmails.filter((e) => e.performanceReviews.length > 0);
    if (withReviews.length > 5) {
      const avgRating = withReviews.reduce((sum, e) => {
        return sum + (RATING_VALUES[e.performanceReviews[0].rating!] || 3);
      }, 0) / withReviews.length;

      insights.push({
        title: 'Hiring Quality → Performance',
        description: 'Correlation between recruitment source and subsequent performance rating',
        sourceModule: 'RECRUITMENT',
        targetModule: 'PERFORMANCE',
        correlationStrength: Math.min(avgRating / 5, 1),
        insight: avgRating >= 3.5
          ? 'Current hiring sources produce above-average performers'
          : 'Consider diversifying recruitment channels to improve hire quality',
      });
    }

    // 2. Training Completion → Promotion/Performance
    const trainedEmployees = await this.prisma.employee.findMany({
      where: {
        status: 'ACTIVE',
        trainingEnrollments: { some: { status: 'COMPLETED' } },
      },
      include: {
        trainingEnrollments: { where: { status: 'COMPLETED' }, select: { id: true } },
        performanceReviews: {
          where: { rating: { not: null } },
          select: { rating: true },
          take: 1,
          orderBy: { createdAt: 'desc' },
        },
      },
    });

    const untrainedEmployees = await this.prisma.employee.findMany({
      where: {
        status: 'ACTIVE',
        trainingEnrollments: { none: { status: 'COMPLETED' } },
      },
      include: {
        performanceReviews: {
          where: { rating: { not: null } },
          select: { rating: true },
          take: 1,
          orderBy: { createdAt: 'desc' },
        },
      },
    });

    const trainedWithReviews = trainedEmployees.filter((e) => e.performanceReviews.length > 0);
    const untrainedWithReviews = untrainedEmployees.filter((e) => e.performanceReviews.length > 0);

    if (trainedWithReviews.length > 0 && untrainedWithReviews.length > 0) {
      const trainedAvg = trainedWithReviews.reduce((sum, e) => sum + (RATING_VALUES[e.performanceReviews[0].rating!] || 3), 0) / trainedWithReviews.length;
      const untrainedAvg = untrainedWithReviews.reduce((sum, e) => sum + (RATING_VALUES[e.performanceReviews[0].rating!] || 3), 0) / untrainedWithReviews.length;

      insights.push({
        title: 'Training → Performance Impact',
        description: 'Effect of training completion on performance ratings',
        sourceModule: 'DEVELOPMENT',
        targetModule: 'PERFORMANCE',
        correlationStrength: Math.abs(trainedAvg - untrainedAvg) / 5,
        insight: trainedAvg > untrainedAvg
          ? `Trained employees score ${(trainedAvg - untrainedAvg).toFixed(1)} points higher on average`
          : 'Training impact on performance needs review',
      });
    }

    // 3. Engagement Score → Turnover
    const now = new Date();
    const recentTerminations = await this.prisma.employee.count({
      where: {
        status: 'TERMINATED',
        terminationDate: { gte: new Date(now.getFullYear(), 0, 1) },
      },
    });
    const totalActive = await this.prisma.employee.count({ where: { status: 'ACTIVE' } });
    const turnoverRate = totalActive > 0 ? (recentTerminations / totalActive) * 100 : 0;

    const latestPulse = await this.prisma.survey.findFirst({
      where: { type: 'PULSE', status: 'CLOSED' },
      orderBy: { endDate: 'desc' },
      include: { responses: { select: { score: true } } },
    });

    if (latestPulse && latestPulse.responses.length > 0) {
      const scores = latestPulse.responses.filter((r) => r.score !== null).map((r) => Number(r.score));
      const avgEngagement = scores.reduce((a, b) => a + b, 0) / scores.length;

      insights.push({
        title: 'Engagement → Retention',
        description: 'Relationship between employee engagement and voluntary turnover',
        sourceModule: 'CULTURE',
        targetModule: 'LIFECYCLE',
        correlationStrength: avgEngagement >= 3.5 && turnoverRate < 15 ? 0.7 : 0.4,
        insight: avgEngagement >= 3.5
          ? 'High engagement correlates with low turnover — maintain culture initiatives'
          : 'Low engagement detected — risk of increased attrition',
      });
    }

    return insights;
  }

  // ─── Attrition Correlation ───────────────────────────

  async getAttritionCorrelation() {
    const now = new Date();
    const yearStart = new Date(now.getFullYear(), 0, 1);

    const terminatedEmployees = await this.prisma.employee.findMany({
      where: {
        status: 'TERMINATED',
        terminationDate: { gte: yearStart },
      },
      include: {
        trainingEnrollments: { select: { status: true } },
        performanceReviews: { select: { rating: true }, take: 1, orderBy: { createdAt: 'desc' } },
        surveyResponses: { select: { score: true }, take: 1, orderBy: { submittedAt: 'desc' } },
      },
    });

    const activeEmployees = await this.prisma.employee.findMany({
      where: { status: 'ACTIVE' },
      include: {
        trainingEnrollments: { select: { status: true } },
        performanceReviews: { select: { rating: true }, take: 1, orderBy: { createdAt: 'desc' } },
        surveyResponses: { select: { score: true }, take: 1, orderBy: { submittedAt: 'desc' } },
      },
    });

    const factors: Array<{
      factor: string;
      correlationWithAttrition: number;
      sampleSize: number;
      significance: string;
    }> = [];

    // Factor 1: Low performance rating
    const termLowPerf = terminatedEmployees.filter((e) =>
      e.performanceReviews.length > 0 && (RATING_VALUES[e.performanceReviews[0].rating!] || 3) <= 2,
    ).length;
    const activeLowPerf = activeEmployees.filter((e) =>
      e.performanceReviews.length > 0 && (RATING_VALUES[e.performanceReviews[0].rating!] || 3) <= 2,
    ).length;
    const totalWithPerf = terminatedEmployees.filter((e) => e.performanceReviews.length > 0).length +
      activeEmployees.filter((e) => e.performanceReviews.length > 0).length;

    if (totalWithPerf > 0) {
      const correlation = totalWithPerf > 5
        ? (termLowPerf / (terminatedEmployees.length || 1)) - (activeLowPerf / (activeEmployees.length || 1))
        : 0;
      factors.push({
        factor: 'Low Performance Rating',
        correlationWithAttrition: Math.round(Math.min(Math.max(correlation, -1), 1) * 100) / 100,
        sampleSize: totalWithPerf,
        significance: totalWithPerf > 20 ? 'high' : totalWithPerf > 10 ? 'medium' : 'low',
      });
    }

    // Factor 2: No training completed
    const termNoTraining = terminatedEmployees.filter((e) =>
      !e.trainingEnrollments.some((t) => t.status === 'COMPLETED'),
    ).length;
    const activeNoTraining = activeEmployees.filter((e) =>
      !e.trainingEnrollments.some((t) => t.status === 'COMPLETED'),
    ).length;
    const totalSample = terminatedEmployees.length + activeEmployees.length;

    if (totalSample > 0) {
      const correlation = (termNoTraining / (terminatedEmployees.length || 1)) - (activeNoTraining / (activeEmployees.length || 1));
      factors.push({
        factor: 'No Training Completed',
        correlationWithAttrition: Math.round(Math.min(Math.max(correlation, -1), 1) * 100) / 100,
        sampleSize: totalSample,
        significance: totalSample > 20 ? 'high' : totalSample > 10 ? 'medium' : 'low',
      });
    }

    // Factor 3: Low engagement score
    const termLowEngagement = terminatedEmployees.filter((e) =>
      e.surveyResponses.length > 0 && Number(e.surveyResponses[0].score) <= 2,
    ).length;
    const activeLowEngagement = activeEmployees.filter((e) =>
      e.surveyResponses.length > 0 && Number(e.surveyResponses[0].score) <= 2,
    ).length;
    const totalWithSurvey = terminatedEmployees.filter((e) => e.surveyResponses.length > 0).length +
      activeEmployees.filter((e) => e.surveyResponses.length > 0).length;

    if (totalWithSurvey > 0) {
      const correlation = (termLowEngagement / (terminatedEmployees.length || 1)) - (activeLowEngagement / (activeEmployees.length || 1));
      factors.push({
        factor: 'Low Engagement Score',
        correlationWithAttrition: Math.round(Math.min(Math.max(correlation, -1), 1) * 100) / 100,
        sampleSize: totalWithSurvey,
        significance: totalWithSurvey > 20 ? 'high' : totalWithSurvey > 10 ? 'medium' : 'low',
      });
    }

    // Factor 4: Short tenure
    const termShortTenure = terminatedEmployees.filter((e) => {
      const tenure = monthsBetween(e.hireDate, e.terminationDate || now);
      return tenure < 12;
    }).length;

    factors.push({
      factor: 'Short Tenure (<1 year)',
      correlationWithAttrition: terminatedEmployees.length > 0
        ? Math.round((termShortTenure / terminatedEmployees.length) * 100) / 100
        : 0,
      sampleSize: terminatedEmployees.length,
      significance: terminatedEmployees.length > 10 ? 'high' : terminatedEmployees.length > 5 ? 'medium' : 'low',
    });

    return factors.sort((a, b) => Math.abs(b.correlationWithAttrition) - Math.abs(a.correlationWithAttrition));
  }

  // ─── Module KPI Summary ──────────────────────────────

  async getModuleKpiSummary() {
    const snapshots = await this.prisma.kpiSnapshot.findMany({
      orderBy: { calculatedAt: 'desc' },
    });

    // Group by module
    const moduleMap = new Map<string, Array<{ kpiId: string; value: number; unit: string | null; target: number | null }>>();
    const seenKpis = new Set<string>();

    for (const snap of snapshots) {
      const key = `${snap.moduleType}-${snap.kpiId}`;
      if (seenKpis.has(key)) continue;
      seenKpis.add(key);

      if (!moduleMap.has(snap.moduleType)) moduleMap.set(snap.moduleType, []);
      moduleMap.get(snap.moduleType)!.push({
        kpiId: snap.kpiId,
        value: Number(snap.value),
        unit: snap.unit,
        target: snap.target ? Number(snap.target) : null,
      });
    }

    return Array.from(moduleMap.entries()).map(([mod, kpis]) => {
      const kpiCards = kpis.map((k) => ({
        kpiId: k.kpiId,
        label: k.kpiId.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase()),
        value: k.value,
        previousValue: 0,
        changePercent: 0,
        trend: 'stable' as const,
        signal: 'neutral',
        unit: k.unit || '',
        format: k.unit === '%' ? 'percent' : 'number',
      }));

      const signals = kpiCards.map((k) => k.signal);
      const overallSignal = signals.includes('negative') ? 'negative'
        : signals.includes('warning') ? 'warning'
        : signals.includes('positive') ? 'positive'
        : 'neutral';

      return {
        module: mod,
        kpis: kpiCards,
        overallSignal,
      };
    });
  }

  // ─── Base Lifecycle Metrics ──────────────────────────

  async getTurnoverRate(startDate: Date, endDate: Date) {
    const terminated = await this.prisma.employee.count({
      where: {
        status: 'TERMINATED',
        terminationDate: { gte: startDate, lte: endDate },
      },
    });

    const avgHeadcount = await this.prisma.employee.count({
      where: { hireDate: { lte: endDate } },
    });

    return avgHeadcount > 0 ? Math.round((terminated / avgHeadcount) * 10000) / 100 : 0;
  }

  async getRetentionRate(startDate: Date, endDate: Date) {
    const hiredBefore = await this.prisma.employee.count({
      where: { hireDate: { lte: startDate }, status: 'ACTIVE' },
    });

    const stillActive = await this.prisma.employee.count({
      where: {
        hireDate: { lte: startDate },
        status: 'ACTIVE',
        OR: [{ terminationDate: null }, { terminationDate: { gt: endDate } }],
      },
    });

    return hiredBefore > 0 ? Math.round((stillActive / hiredBefore) * 10000) / 100 : 0;
  }

  async getAverageTenure() {
    const employees = await this.prisma.employee.findMany({
      where: { status: 'ACTIVE' },
      select: { hireDate: true },
    });

    if (employees.length === 0) return 0;

    const now = new Date();
    const totalMonths = employees.reduce(
      (sum, e) => sum + monthsBetween(e.hireDate, now),
      0,
    );

    return Math.round((totalMonths / employees.length) * 10) / 10;
  }

  async getNewHires(startDate: Date, endDate: Date) {
    return this.prisma.employee.count({
      where: { hireDate: { gte: startDate, lte: endDate } },
    });
  }

  // ─── Helpers ─────────────────────────────────────────

  private buildKpiCard(kpiId: string, label: string, value: number, previousValue: number, unit: string, format: string) {
    const change = previousValue > 0 ? ((value - previousValue) / previousValue) * 100 : 0;
    const changeRounded = Math.round(change * 100) / 100;
    return {
      kpiId,
      label,
      value,
      previousValue,
      changePercent: changeRounded,
      trend: changeRounded > 0 ? 'up' : changeRounded < 0 ? 'down' : 'stable',
      signal: this.determineSignal(kpiId, value),
      unit,
      format,
    };
  }

  private determineSignal(kpiId: string, value: number): string {
    switch (kpiId) {
      case 'turnover_rate':
        return value <= 10 ? 'positive' : value <= 15 ? 'neutral' : value <= 20 ? 'warning' : 'negative';
      case 'retention_rate':
        return value >= 90 ? 'positive' : value >= 85 ? 'neutral' : value >= 80 ? 'warning' : 'negative';
      case 'avg_tenure':
        return value >= 24 ? 'positive' : value >= 12 ? 'neutral' : 'warning';
      default:
        return 'neutral';
    }
  }
}
