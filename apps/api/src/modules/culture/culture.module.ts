import { Module } from '@nestjs/common';
import { CultureService } from './culture.service';
import { CultureResolver } from './culture.resolver';
import { CultureRepository } from './culture.repository';
import { PulseService } from './pulse/pulse.service';
import { PulseResolver } from './pulse/pulse.resolver';

@Module({
  providers: [CultureService, CultureResolver, CultureRepository, PulseService, PulseResolver],
  exports: [CultureService, PulseService],
})
export class CultureModule {}
