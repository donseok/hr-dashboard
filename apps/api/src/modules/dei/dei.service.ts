import { Injectable, Logger } from '@nestjs/common';
import { DeiRepository } from './dei.repository';
import { AuditService } from '../../shared/audit/audit.service';

@Injectable()
export class DeiService {
  private readonly logger = new Logger(DeiService.name);

  constructor(
    private readonly repository: DeiRepository,
    private readonly auditService: AuditService,
  ) {}

  // ─── Queries ─────────────────────────────────────────

  async getMetrics(dimension?: string, period?: string) {
    return this.repository.findMetrics(dimension, period);
  }

  async getLatestMetrics() {
    return this.repository.getLatestMetrics();
  }

  async getDashboard() {
    const [
      genderDistribution,
      payEquityAnalysis,
      deiTrend,
      inclusionScore,
      diversityByDepartment,
      recentMetrics,
    ] = await Promise.all([
      this.repository.getGenderDistribution(),
      this.repository.getPayEquityAnalysis(),
      this.repository.getDeiTrend(12),
      this.repository.getInclusionScore(),
      this.repository.getDiversityByDepartment(),
      this.repository.getLatestMetrics(),
    ]);

    // Calculate overall diversity index
    const avgGenderRatio = diversityByDepartment.length > 0
      ? diversityByDepartment.reduce((sum, d) => sum + d.genderRatio, 0) / diversityByDepartment.length
      : 0;

    const avgPayGap = payEquityAnalysis.length > 0
      ? payEquityAnalysis.reduce((sum, p) => sum + Math.abs(p.gapPercent), 0) / payEquityAnalysis.length
      : 0;

    const kpis = [
      this.buildKpiCard('gender_diversity', 'Gender Diversity', avgGenderRatio, 0, '%', 'percent'),
      this.buildKpiCard('pay_equity', 'Pay Equity Gap', avgPayGap, 0, '%', 'percent'),
      this.buildKpiCard('inclusion_score', 'Inclusion Score', inclusionScore, 0, '', 'number'),
      this.buildKpiCard('dei_index', 'DEI Index', this.calculateDeiIndex(avgGenderRatio, avgPayGap, inclusionScore), 0, '', 'number'),
    ];

    return {
      kpis,
      genderDistribution,
      payEquityAnalysis,
      deiTrend,
      inclusionScore,
      diversityByDepartment,
      recentMetrics,
    };
  }

  async getPayEquityAnalysis(grade?: string) {
    return this.repository.getPayEquityAnalysis(grade);
  }

  async getDeiTrend(months?: number) {
    return this.repository.getDeiTrend(months || 12);
  }

  // ─── Mutations ───────────────────────────────────────

  async recordMetric(input: {
    period: string;
    dimension: string;
    category: string;
    value: number;
    benchmark?: number;
  }, userId?: string) {
    const metric = await this.repository.recordMetric(input);

    await this.auditService.log({
      userId,
      action: 'RECORD_DEI_METRIC',
      entity: 'DeiMetric',
      entityId: metric.id,
      newValue: { dimension: input.dimension, category: input.category, value: input.value },
    });

    this.logger.log(`DEI metric recorded: ${input.dimension}/${input.category} = ${input.value}`);
    return metric;
  }

  // ─── Helpers ─────────────────────────────────────────

  private calculateDeiIndex(genderRatio: number, payGap: number, inclusionScore: number): number {
    // Composite index: gender balance (target 50%) + pay equity + inclusion
    const genderScore = 100 - Math.abs(50 - genderRatio) * 2; // max 100 at 50%
    const equityScore = Math.max(0, 100 - payGap * 10); // penalize large gaps
    const inclusionNormalized = inclusionScore * 20; // scale 0-5 to 0-100

    const index = (genderScore * 0.3 + equityScore * 0.3 + inclusionNormalized * 0.4) / 100;
    return Math.round(index * 100) / 100;
  }

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
      case 'gender_diversity':
        return Math.abs(50 - value) <= 10 ? 'positive' : Math.abs(50 - value) <= 20 ? 'neutral' : 'warning';
      case 'pay_equity':
        return value <= 3 ? 'positive' : value <= 7 ? 'neutral' : value <= 15 ? 'warning' : 'negative';
      case 'inclusion_score':
        return value >= 4 ? 'positive' : value >= 3 ? 'neutral' : value >= 2 ? 'warning' : 'negative';
      case 'dei_index':
        return value >= 3.5 ? 'positive' : value >= 2.5 ? 'neutral' : value >= 1.5 ? 'warning' : 'negative';
      default:
        return 'neutral';
    }
  }
}
