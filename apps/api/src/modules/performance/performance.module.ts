import { Module } from '@nestjs/common';
import { PerformanceService } from './performance.service';
import { PerformanceResolver } from './performance.resolver';
import { PerformanceRepository } from './performance.repository';
import { CalibrationService } from './calibration/calibration.service';
import { CalibrationResolver } from './calibration/calibration.resolver';

@Module({
  providers: [
    PerformanceService,
    PerformanceResolver,
    PerformanceRepository,
    CalibrationService,
    CalibrationResolver,
  ],
  exports: [PerformanceService],
})
export class PerformanceModule {}
