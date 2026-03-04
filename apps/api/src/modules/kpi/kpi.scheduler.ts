import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { KpiService } from './kpi.service';

@Injectable()
export class KpiScheduler {
  private readonly logger = new Logger(KpiScheduler.name);

  constructor(private readonly kpiService: KpiService) {}

  @Cron(CronExpression.EVERY_HOUR)
  async handleKpiCalculation() {
    this.logger.log('Scheduled KPI calculation triggered');
    await this.kpiService.calculateAndStore();
  }
}
