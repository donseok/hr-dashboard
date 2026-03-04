import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../../shared/database/prisma.service';

const RATING_VALUES: Record<string, number> = {
  EXCEPTIONAL: 5,
  EXCEEDS_EXPECTATIONS: 4,
  MEETS_EXPECTATIONS: 3,
  NEEDS_IMPROVEMENT: 2,
  UNSATISFACTORY: 1,
};

@Injectable()
export class PerformanceRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findCycles() {
    const cycles = await this.prisma.performanceCycle.findMany({
      include: {
        _count: { select: { reviews: true } },
        reviews: { where: { submittedAt: { not: null } }, select: { id: true } },
      },
      orderBy: { startDate: 'desc' },
    });
    return cycles.map((c) => ({
      ...c,
      totalReviews: c._count.reviews,
      completedReviews: c.reviews.length,
      completionRate: c._count.reviews > 0
        ? Math.round((c.reviews.length / c._count.reviews) * 10000) / 100
        : 0,
    }));
  }

  async findCycleById(id: string) {
    const cycle = await this.prisma.performanceCycle.findUnique({
      where: { id },
      include: {
        reviews: {
          include: {
            employee: {
              select: { id: true, firstName: true, lastName: true, position: true, departmentId: true, department: { select: { name: true } } },
            },
            reviewer: { select: { id: true, firstName: true, lastName: true } },
          },
        },
        _count: { select: { reviews: true } },
      },
    });
    if (!cycle) return null;

    const completedReviews = cycle.reviews.filter((r) => r.submittedAt !== null).length;
    return {
      ...cycle,
      totalReviews: cycle._count.reviews,
      completedReviews,
      completionRate: cycle._count.reviews > 0
        ? Math.round((completedReviews / cycle._count.reviews) * 10000) / 100
        : 0,
    };
  }

  async findReviews(cycleId: string, employeeId?: string) {
    return this.prisma.performanceReview.findMany({
      where: { cycleId, ...(employeeId ? { employeeId } : {}) },
      include: {
        cycle: true,
        employee: { select: { id: true, firstName: true, lastName: true, position: true, departmentId: true, department: { select: { name: true } } } },
        reviewer: { select: { id: true, firstName: true, lastName: true } },
      },
    });
  }

  async submitReview(reviewId: string, rating: string, comments?: string) {
    return this.prisma.performanceReview.update({
      where: { id: reviewId },
      data: { rating: rating as any, comments, submittedAt: new Date() },
      include: { cycle: true, employee: true, reviewer: true },
    });
  }

  async createCycle(data: Prisma.PerformanceCycleCreateInput) {
    return this.prisma.performanceCycle.create({ data });
  }

  async updateReview(id: string, data: Prisma.PerformanceReviewUpdateInput) {
    return this.prisma.performanceReview.update({
      where: { id },
      data,
      include: { cycle: true, employee: true, reviewer: true },
    });
  }

  // ─── Aggregation queries ─────────────────────────────

  async getRatingDistribution(cycleId: string) {
    const reviews = await this.prisma.performanceReview.findMany({
      where: { cycleId, submittedAt: { not: null }, rating: { not: null } },
      select: { rating: true },
    });

    const ratings = ['EXCEPTIONAL', 'EXCEEDS_EXPECTATIONS', 'MEETS_EXPECTATIONS', 'NEEDS_IMPROVEMENT', 'UNSATISFACTORY'];
    const counts = new Map<string, number>();
    for (const r of ratings) counts.set(r, 0);
    for (const review of reviews) {
      if (review.rating) counts.set(review.rating, (counts.get(review.rating) || 0) + 1);
    }

    const total = reviews.length;
    return ratings.map((r) => ({
      rating: r,
      count: counts.get(r) || 0,
      percentage: total > 0 ? Math.round(((counts.get(r) || 0) / total) * 10000) / 100 : 0,
    }));
  }

  async getDepartmentPerformance(cycleId: string) {
    const reviews = await this.prisma.performanceReview.findMany({
      where: { cycleId, submittedAt: { not: null }, rating: { not: null } },
      include: {
        employee: { select: { departmentId: true, department: { select: { name: true } } } },
      },
    });

    const allReviews = await this.prisma.performanceReview.findMany({
      where: { cycleId },
      include: { employee: { select: { departmentId: true } } },
    });

    const deptMap = new Map<string, { name: string; totalRating: number; completed: number; total: number }>();

    for (const review of allReviews) {
      const deptId = review.employee.departmentId;
      if (!deptMap.has(deptId)) {
        deptMap.set(deptId, { name: '', totalRating: 0, completed: 0, total: 0 });
      }
      deptMap.get(deptId)!.total++;
    }

    for (const review of reviews) {
      const deptId = review.employee.departmentId;
      const entry = deptMap.get(deptId)!;
      entry.name = review.employee.department.name;
      entry.totalRating += RATING_VALUES[review.rating!] || 0;
      entry.completed++;
    }

    return Array.from(deptMap.entries()).map(([departmentId, data]) => ({
      departmentId,
      departmentName: data.name,
      averageRating: data.completed > 0 ? Math.round((data.totalRating / data.completed) * 100) / 100 : 0,
      reviewCount: data.completed,
      completionRate: data.total > 0 ? Math.round((data.completed / data.total) * 10000) / 100 : 0,
    }));
  }

  async getNineBoxData(cycleId: string) {
    const reviews = await this.prisma.performanceReview.findMany({
      where: { cycleId, submittedAt: { not: null }, rating: { not: null } },
      include: {
        employee: { select: { id: true, firstName: true, lastName: true, position: true, department: { select: { name: true } } } },
      },
    });

    const performanceLevels = ['Low', 'Medium', 'High'];
    const potentialLevels = ['Low', 'Medium', 'High'];
    const cells: Array<{ performance: string; potential: string; count: number; employees: Array<{ id: string; firstName: string; lastName: string; position: string; department: string; rating: string | null }> }> = [];

    for (const perf of performanceLevels) {
      for (const pot of potentialLevels) {
        cells.push({ performance: perf, potential: pot, count: 0, employees: [] });
      }
    }

    for (const review of reviews) {
      const ratingVal = RATING_VALUES[review.rating!] || 3;
      const perfLevel = ratingVal >= 4 ? 'High' : ratingVal >= 3 ? 'Medium' : 'Low';
      // Estimate potential from rating + tenure (simplified)
      const potLevel = ratingVal >= 4 ? 'High' : ratingVal >= 2 ? 'Medium' : 'Low';

      const cell = cells.find((c) => c.performance === perfLevel && c.potential === potLevel);
      if (cell) {
        cell.count++;
        cell.employees.push({
          id: review.employee.id,
          firstName: review.employee.firstName,
          lastName: review.employee.lastName,
          position: review.employee.position,
          department: review.employee.department.name,
          rating: review.rating,
        });
      }
    }

    return cells;
  }

  async getActiveCycle() {
    const cycle = await this.prisma.performanceCycle.findFirst({
      where: { status: 'ACTIVE' },
      include: {
        _count: { select: { reviews: true } },
        reviews: { where: { submittedAt: { not: null } }, select: { id: true } },
      },
      orderBy: { startDate: 'desc' },
    });
    if (!cycle) return null;
    return {
      ...cycle,
      totalReviews: cycle._count.reviews,
      completedReviews: cycle.reviews.length,
      completionRate: cycle._count.reviews > 0
        ? Math.round((cycle.reviews.length / cycle._count.reviews) * 10000) / 100
        : 0,
    };
  }

  async getGoalAchievementRate(cycleId: string): Promise<number> {
    const reviews = await this.prisma.performanceReview.findMany({
      where: { cycleId, submittedAt: { not: null }, rating: { not: null } },
      select: { rating: true },
    });
    if (reviews.length === 0) return 0;

    const achievers = reviews.filter((r) =>
      r.rating === 'MEETS_EXPECTATIONS' || r.rating === 'EXCEEDS_EXPECTATIONS' || r.rating === 'EXCEPTIONAL'
    ).length;

    return Math.round((achievers / reviews.length) * 10000) / 100;
  }
}
