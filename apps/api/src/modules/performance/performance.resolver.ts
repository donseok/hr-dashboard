import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { PerformanceService } from './performance.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RbacGuard } from '../auth/guards/rbac.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import type { CurrentUserData } from '../auth/decorators/current-user.decorator';

@UseGuards(JwtAuthGuard, RbacGuard)
@Resolver()
export class PerformanceResolver {
  constructor(private readonly performanceService: PerformanceService) {}

  // ─── Queries ─────────────────────────────────────────

  @Query('performanceDashboard')
  async getPerformanceDashboard(@Args('cycleId') cycleId?: string) {
    return this.performanceService.getDashboard(cycleId ?? undefined);
  }

  @Query('performanceCycles')
  async getPerformanceCycles() {
    return this.performanceService.getCycles();
  }

  @Query('performanceCycle')
  async getPerformanceCycle(@Args('id') id: string) {
    return this.performanceService.getCycleById(id);
  }

  @Query('performanceReviews')
  async getPerformanceReviews(
    @Args('cycleId') cycleId: string,
    @Args('employeeId') employeeId?: string,
  ) {
    return this.performanceService.getReviews(cycleId, employeeId ?? undefined);
  }

  @Query('ratingDistribution')
  async getRatingDistribution(@Args('cycleId') cycleId: string) {
    return this.performanceService.getRatingDistribution(cycleId);
  }

  @Query('nineBoxData')
  async getNineBoxData(@Args('cycleId') cycleId: string) {
    return this.performanceService.getNineBoxData(cycleId);
  }

  @Roles('HR_SPECIALIST', 'ADMIN', 'EXECUTIVE')
  @Query('calibrationData')
  async getCalibrationData(@Args('cycleId') cycleId: string) {
    return this.performanceService.getCalibrationData(cycleId);
  }

  // ─── Mutations ───────────────────────────────────────

  @Roles('HR_SPECIALIST', 'ADMIN')
  @Mutation('createCycle')
  async createCycle(
    @Args('input') input: { name: string; description?: string; startDate: string; endDate: string },
    @CurrentUser() user: CurrentUserData,
  ) {
    return this.performanceService.createCycle(input, user.id);
  }

  @Mutation('submitReview')
  async submitReview(
    @Args('reviewId') reviewId: string,
    @Args('rating') rating: string,
    @Args('comments') comments: string,
    @CurrentUser() user: CurrentUserData,
  ) {
    return this.performanceService.submitReview(reviewId, rating, comments, user.id);
  }

  @Roles('HR_SPECIALIST', 'ADMIN')
  @Mutation('calibrateRatings')
  async calibrateRatings(
    @Args('input') input: {
      cycleId: string;
      adjustments: Array<{ reviewId: string; newRating: string; reason?: string }>;
    },
    @CurrentUser() user: CurrentUserData,
  ) {
    return this.performanceService.calibrateRatings(input, user.id);
  }
}
