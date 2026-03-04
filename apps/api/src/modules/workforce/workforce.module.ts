import { Module } from '@nestjs/common';
import { WorkforceService } from './workforce.service';
import { WorkforceResolver } from './workforce.resolver';
import { WorkforceRepository } from './workforce.repository';

@Module({
  providers: [WorkforceService, WorkforceResolver, WorkforceRepository],
  exports: [WorkforceService],
})
export class WorkforceModule {}
