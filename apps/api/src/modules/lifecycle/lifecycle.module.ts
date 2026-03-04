import { Module } from '@nestjs/common';
import { LifecycleService } from './lifecycle.service';
import { LifecycleResolver } from './lifecycle.resolver';

@Module({
  providers: [LifecycleService, LifecycleResolver],
  exports: [LifecycleService],
})
export class LifecycleModule {}
