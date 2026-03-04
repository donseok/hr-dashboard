import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { KpiService } from './kpi.service';
import { KpiResolver } from './kpi.resolver';
import { KpiScheduler } from './kpi.scheduler';
import { NotificationModule } from '../notification/notification.module';

@Module({
  imports: [ScheduleModule.forRoot(), NotificationModule],
  providers: [KpiService, KpiResolver, KpiScheduler],
  exports: [KpiService],
})
export class KpiModule {}
