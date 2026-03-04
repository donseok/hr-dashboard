import { Resolver, Query, Args } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { KpiService } from './kpi.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@UseGuards(JwtAuthGuard)
@Resolver()
export class KpiResolver {
  constructor(private readonly kpiService: KpiService) {}

  @Query('kpiSnapshots')
  async getKpiSnapshots(
    @Args('kpiId') kpiId?: string,
    @Args('moduleType') moduleType?: string,
    @Args('period') period?: string,
  ) {
    return this.kpiService.getSnapshots(kpiId, moduleType, period);
  }

  @Query('latestKpis')
  async getLatestKpis(@Args('moduleType') moduleType?: string) {
    return this.kpiService.getLatestKpis(moduleType);
  }
}
