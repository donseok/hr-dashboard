import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../../../shared/database/prisma.service';

export interface PulseScore {
  period: string;
  averageScore: number;
  responseRate: number;
  trendVsPrevious: number;
}

@Injectable()
export class PulseService {
  private readonly logger = new Logger(PulseService.name);

  constructor(private readonly prisma: PrismaService) {}

  async getLatestPulseScore(): Promise<PulseScore | null> {
    const latestPulse = await this.prisma.survey.findFirst({
      where: { type: 'PULSE', status: 'CLOSED' },
      orderBy: { endDate: 'desc' },
      include: { responses: true },
    });

    if (!latestPulse) return null;

    const scores = latestPulse.responses
      .filter((r) => r.score !== null)
      .map((r) => Number(r.score));

    const average = scores.length > 0 ? scores.reduce((a, b) => a + b, 0) / scores.length : 0;

    return {
      period: latestPulse.endDate?.toISOString().slice(0, 7) || '',
      averageScore: Math.round(average * 100) / 100,
      responseRate: 0,
      trendVsPrevious: 0,
    };
  }
}
