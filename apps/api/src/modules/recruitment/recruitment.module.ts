import { Module } from '@nestjs/common';
import { RecruitmentService } from './recruitment.service';
import { RecruitmentResolver } from './recruitment.resolver';
import { RecruitmentRepository } from './recruitment.repository';

@Module({
  providers: [RecruitmentService, RecruitmentResolver, RecruitmentRepository],
  exports: [RecruitmentService],
})
export class RecruitmentModule {}
