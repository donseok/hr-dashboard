import { Injectable, NotFoundException, Logger } from '@nestjs/common';
import { PerformanceRepository } from './performance.repository';
import { AuditService } from '../../shared/audit/audit.service';

@Injectable()
export class PerformanceService {
  private readonly logger = new Logger(PerformanceService.name);

  constructor(
    private readonly repository: PerformanceRepository,
    private readonly auditService: AuditService,
  ) {}

  // ─── Queries ─────────────────────────────────────────

  async getCycles() {
    return this.repository.findCycles();
  }

  async getCycleById(id: string) {
    const cycle = await this.repository.findCycleById(id);
    if (!cycle) throw new NotFoundException(`Performance cycle ${id} not found`);
    return cycle;
  }

  async getReviews(cycleId: string, employeeId?: string) {
    return this.repository.findReviews(cycleId, employeeId);
  }

  async getRatingDistribution(cycleId: string) {
    return this.repository.getRatingDistribution(cycleId);
  }

  async getNineBoxData(cycleId: string) {
    return this.repository.getNineBoxData(cycleId);
  }

  async getCalibrationData(cycleId: string) {
    const cycle = await this.getCycleById(cycleId);
    const [ratingDistribution, departmentAverages] = await Promise.all([
      this.repository.getRatingDistribution(cycleId),
      this.repository.getDepartmentPerformance(cycleId),
    ]);

    // Find outlier reviews (unusually high/low relative to department avg)
    const reviews = await this.repository.findReviews(cycleId);
    const RATING_VALUES: Record<string, number> = {
      EXCEPTIONAL: 5, EXCEEDS_EXPECTATIONS: 4, MEETS_EXPECTATIONS: 3, NEEDS_IMPROVEMENT: 2, UNSATISFACTORY: 1,
    };

    const outliers = reviews.filter((r) => {
      if (!r.rating) return false;
      const ratingVal = RATING_VALUES[r.rating] || 3;
      const deptAvg = departmentAverages.find((d) => d.departmentId === (r.employee as any).departmentId);
      if (!deptAvg || deptAvg.averageRating === 0) return false;
      return Math.abs(ratingVal - deptAvg.averageRating) >= 1.5;
    });

    return {
      cycleId,
      totalReviews: cycle.totalReviews,
      completedReviews: cycle.completedReviews,
      ratingDistribution,
      departmentAverages,
      outliers,
    };
  }

  // ─── Dashboard ───────────────────────────────────────

  async getDashboard(cycleId?: string) {
    const activeCycle = cycleId
      ? await this.getCycleById(cycleId)
      : await this.repository.getActiveCycle();

    const targetCycleId = activeCycle?.id;

    const [ratingDistribution, departmentPerformance, goalAchievementRate] = targetCycleId
      ? await Promise.all([
          this.repository.getRatingDistribution(targetCycleId),
          this.repository.getDepartmentPerformance(targetCycleId),
          this.repository.getGoalAchievementRate(targetCycleId),
        ])
      : [[], [], 0];

    const kpis = this.buildDashboardKpis(activeCycle, goalAchievementRate, ratingDistribution);

    return {
      kpis,
      activeCycle,
      ratingDistribution,
      departmentPerformance,
      completionTrend: [],
      goalAchievementRate,
    };
  }

  private buildDashboardKpis(
    cycle: Awaited<ReturnType<typeof this.repository.getActiveCycle>>,
    goalAchievementRate: number,
    ratingDistribution: Array<{ rating: string; count: number; percentage: number }>,
  ) {
    const completionRate = cycle?.completionRate || 0;
    const totalReviews = cycle?.totalReviews || 0;
    const completedReviews = cycle?.completedReviews || 0;

    // Performance-compensation alignment (simplified: % of high performers)
    const highPerformerPct = ratingDistribution
      .filter((r) => r.rating === 'EXCEPTIONAL' || r.rating === 'EXCEEDS_EXPECTATIONS')
      .reduce((sum, r) => sum + r.percentage, 0);

    return [
      this.buildKpiCard('review_completion', 'Review Completion', completionRate, 0, '%', 'percent'),
      this.buildKpiCard('goal_achievement', 'Goal Achievement', goalAchievementRate, 0, '%', 'percent'),
      this.buildKpiCard('high_performers', 'High Performers', Math.round(highPerformerPct * 100) / 100, 0, '%', 'percent'),
      this.buildKpiCard('total_reviews', 'Total Reviews', totalReviews, 0, '', 'number'),
      this.buildKpiCard('completed_reviews', 'Completed', completedReviews, 0, '', 'number'),
    ];
  }

  // ─── Mutations ───────────────────────────────────────

  async createCycle(input: { name: string; description?: string; startDate: string; endDate: string }, userId?: string) {
    const cycle = await this.repository.createCycle({
      name: input.name,
      description: input.description,
      startDate: new Date(input.startDate),
      endDate: new Date(input.endDate),
      status: 'DRAFT',
    });

    await this.auditService.log({
      userId,
      action: 'CREATE_CYCLE',
      entity: 'PerformanceCycle',
      entityId: cycle.id,
      newValue: { name: input.name },
    });

    this.logger.log(`Performance cycle created: ${cycle.id}`);
    return { ...cycle, totalReviews: 0, completedReviews: 0, completionRate: 0 };
  }

  async submitReview(reviewId: string, rating: string, comments?: string, userId?: string) {
    const review = await this.repository.submitReview(reviewId, rating, comments);

    await this.auditService.log({
      userId,
      action: 'SUBMIT_REVIEW',
      entity: 'PerformanceReview',
      entityId: reviewId,
      newValue: { rating, comments },
    });

    return review;
  }

  async calibrateRatings(input: {
    cycleId: string;
    adjustments: Array<{ reviewId: string; newRating: string; reason?: string }>;
  }, userId?: string) {
    for (const adj of input.adjustments) {
      await this.repository.updateReview(adj.reviewId, {
        rating: adj.newRating as any,
      });

      await this.auditService.log({
        userId,
        action: 'CALIBRATE_RATING',
        entity: 'PerformanceReview',
        entityId: adj.reviewId,
        newValue: { newRating: adj.newRating, reason: adj.reason },
      });
    }

    this.logger.log(`Calibrated ${input.adjustments.length} ratings for cycle ${input.cycleId}`);
    return this.getCalibrationData(input.cycleId);
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
      case 'review_completion':
        return value >= 90 ? 'positive' : value >= 70 ? 'neutral' : value >= 50 ? 'warning' : 'negative';
      case 'goal_achievement':
        return value >= 80 ? 'positive' : value >= 60 ? 'neutral' : value >= 40 ? 'warning' : 'negative';
      case 'high_performers':
        return value >= 25 ? 'positive' : value >= 15 ? 'neutral' : 'warning';
      default:
        return 'neutral';
    }
  }
}
