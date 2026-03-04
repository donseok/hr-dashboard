import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../../../shared/database/prisma.service';

export interface CalibrationSummary {
  cycleId: string;
  totalReviews: number;
  ratingDistribution: Record<string, number>;
  averageByDepartment: Array<{ departmentId: string; average: number; count: number }>;
}

@Injectable()
export class CalibrationService {
  private readonly logger = new Logger(CalibrationService.name);

  constructor(private readonly prisma: PrismaService) {}

  async getCalibrationSummary(cycleId: string): Promise<CalibrationSummary> {
    const reviews = await this.prisma.performanceReview.findMany({
      where: { cycleId, submittedAt: { not: null } },
      include: { employee: { select: { departmentId: true } } },
    });

    const ratingDistribution: Record<string, number> = {};
    const deptMap = new Map<string, { total: number; count: number }>();

    const ratingValues: Record<string, number> = {
      EXCEPTIONAL: 5,
      EXCEEDS_EXPECTATIONS: 4,
      MEETS_EXPECTATIONS: 3,
      NEEDS_IMPROVEMENT: 2,
      UNSATISFACTORY: 1,
    };

    for (const review of reviews) {
      if (review.rating) {
        ratingDistribution[review.rating] = (ratingDistribution[review.rating] || 0) + 1;
        const deptId = review.employee.departmentId;
        const existing = deptMap.get(deptId) || { total: 0, count: 0 };
        existing.total += ratingValues[review.rating] || 0;
        existing.count += 1;
        deptMap.set(deptId, existing);
      }
    }

    return {
      cycleId,
      totalReviews: reviews.length,
      ratingDistribution,
      averageByDepartment: Array.from(deptMap.entries()).map(([departmentId, { total, count }]) => ({
        departmentId,
        average: count > 0 ? total / count : 0,
        count,
      })),
    };
  }
}
