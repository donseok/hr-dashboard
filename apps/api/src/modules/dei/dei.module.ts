import { Module } from '@nestjs/common';
import { DeiService } from './dei.service';
import { DeiResolver } from './dei.resolver';
import { DeiRepository } from './dei.repository';

@Module({
  providers: [DeiService, DeiResolver, DeiRepository],
  exports: [DeiService],
})
export class DeiModule {}
