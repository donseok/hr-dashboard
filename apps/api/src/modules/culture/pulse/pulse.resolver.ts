import { Resolver } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { PulseService } from './pulse.service';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';

@UseGuards(JwtAuthGuard)
@Resolver()
export class PulseResolver {
  constructor(private readonly pulseService: PulseService) {}
}
