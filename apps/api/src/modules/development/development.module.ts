import { Module } from '@nestjs/common';
import { DevelopmentService } from './development.service';
import { DevelopmentResolver } from './development.resolver';
import { DevelopmentRepository } from './development.repository';

@Module({
  providers: [DevelopmentService, DevelopmentResolver, DevelopmentRepository],
  exports: [DevelopmentService],
})
export class DevelopmentModule {}
