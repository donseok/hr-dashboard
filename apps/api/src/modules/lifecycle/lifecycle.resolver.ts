import { Resolver, Query, Args } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { LifecycleService } from './lifecycle.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RbacGuard } from '../auth/guards/rbac.guard';
import { Roles } from '../auth/decorators/roles.decorator';

@UseGuards(JwtAuthGuard, RbacGuard)
@Resolver()
export class LifecycleResolver {
  constructor(private readonly lifecycleService: LifecycleService) {}

  @Query('lifecycleDashboard')
  @Roles('HR_SPECIALIST', 'ADMIN', 'EXECUTIVE')
  async getLifecycleDashboard() {
    return this.lifecycleService.getDashboard();
  }

  @Query('employeeJourney')
  async getEmployeeJourney(@Args('employeeId') employeeId: string) {
    return this.lifecycleService.getEmployeeJourney(employeeId);
  }

  @Query('crossModuleAnalysis')
  @Roles('HR_SPECIALIST', 'ADMIN', 'EXECUTIVE')
  async getCrossModuleAnalysis() {
    return this.lifecycleService.getCrossModuleAnalysis();
  }

  @Query('attritionCorrelation')
  @Roles('HR_SPECIALIST', 'ADMIN', 'EXECUTIVE')
  async getAttritionCorrelation() {
    return this.lifecycleService.getAttritionCorrelation();
  }
}
