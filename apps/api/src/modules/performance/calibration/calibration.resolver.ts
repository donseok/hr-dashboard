import { Resolver, Query, Args } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { CalibrationService } from './calibration.service';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { Roles } from '../../auth/decorators/roles.decorator';
import { RbacGuard } from '../../auth/guards/rbac.guard';

@UseGuards(JwtAuthGuard, RbacGuard)
@Resolver()
export class CalibrationResolver {
  constructor(private readonly calibrationService: CalibrationService) {}

  @Roles('HR_SPECIALIST', 'ADMIN', 'EXECUTIVE')
  @Query('performanceCycle')
  async getCalibrationSummary(@Args('id') cycleId: string) {
    return this.calibrationService.getCalibrationSummary(cycleId);
  }
}
