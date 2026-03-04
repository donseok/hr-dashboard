import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { DeiService } from './dei.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RbacGuard } from '../auth/guards/rbac.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import type { CurrentUserData } from '../auth/decorators/current-user.decorator';

@UseGuards(JwtAuthGuard, RbacGuard)
@Resolver()
export class DeiResolver {
  constructor(private readonly deiService: DeiService) {}

  @Query('deiMetrics')
  async getDeiMetrics(
    @Args('dimension') dimension?: string,
    @Args('period') period?: string,
  ) {
    return this.deiService.getMetrics(dimension, period);
  }

  @Query('deiDashboard')
  @Roles('HR_SPECIALIST', 'ADMIN', 'EXECUTIVE')
  async getDeiDashboard() {
    return this.deiService.getDashboard();
  }

  @Query('payEquityAnalysis')
  @Roles('HR_SPECIALIST', 'ADMIN', 'EXECUTIVE')
  async getPayEquityAnalysis(@Args('grade') grade?: string) {
    return this.deiService.getPayEquityAnalysis(grade);
  }

  @Query('deiTrend')
  @Roles('HR_SPECIALIST', 'ADMIN', 'EXECUTIVE')
  async getDeiTrend(@Args('months') months?: number) {
    return this.deiService.getDeiTrend(months);
  }

  @Mutation('recordDeiMetric')
  @Roles('HR_SPECIALIST', 'ADMIN')
  async recordDeiMetric(
    @Args('input') input: any,
    @CurrentUser() user: CurrentUserData,
  ) {
    return this.deiService.recordMetric(input, user.userId);
  }
}
