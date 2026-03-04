import { Module } from '@nestjs/common';
import { DefaultAtsAdapter } from './adapters/ats.adapter';
import { DefaultHrisAdapter } from './adapters/hris.adapter';
import { DefaultLmsAdapter } from './adapters/lms.adapter';
import { DefaultSurveyAdapter } from './adapters/survey.adapter';
import { DataSyncService } from './sync/data-sync.service';

@Module({
  providers: [
    DefaultAtsAdapter,
    DefaultHrisAdapter,
    DefaultLmsAdapter,
    DefaultSurveyAdapter,
    DataSyncService,
  ],
  exports: [DataSyncService, DefaultAtsAdapter, DefaultHrisAdapter, DefaultLmsAdapter, DefaultSurveyAdapter],
})
export class IntegrationModule {}
