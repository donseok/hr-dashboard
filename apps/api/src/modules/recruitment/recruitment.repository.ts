import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../../shared/database/prisma.service';

@Injectable()
export class RecruitmentRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findRequisitions(params: {
    where?: Prisma.JobRequisitionWhereInput;
    skip?: number;
    take?: number;
    orderBy?: Prisma.JobRequisitionOrderByWithRelationInput;
  }) {
    const [data, total] = await this.prisma.$transaction([
      this.prisma.jobRequisition.findMany({
        ...params,
        include: {
          department: true,
          applications: { include: { candidate: true } },
          _count: { select: { applications: true } },
        },
      }),
      this.prisma.jobRequisition.count({ where: params.where }),
    ]);
    return {
      data: data.map((r) => ({ ...r, applicationCount: r._count.applications })),
      total,
    };
  }

  async findRequisitionById(id: string) {
    return this.prisma.jobRequisition.findUnique({
      where: { id },
      include: {
        department: true,
        applications: {
          include: {
            candidate: true,
            interviews: { include: { interviewer: true } },
          },
          orderBy: { appliedAt: 'desc' },
        },
        _count: { select: { applications: true } },
      },
    });
  }

  async createRequisition(data: Prisma.JobRequisitionCreateInput) {
    return this.prisma.jobRequisition.create({
      data,
      include: { department: true, _count: { select: { applications: true } } },
    });
  }

  async updateRequisition(id: string, data: Prisma.JobRequisitionUpdateInput) {
    return this.prisma.jobRequisition.update({
      where: { id },
      data,
      include: { department: true, _count: { select: { applications: true } } },
    });
  }

  async findCandidates(params: { skip?: number; take?: number }) {
    return this.prisma.candidate.findMany({
      ...params,
      include: { applications: { include: { requisition: true } } },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findCandidateById(id: string) {
    return this.prisma.candidate.findUnique({
      where: { id },
      include: {
        applications: {
          include: { requisition: true, interviews: true },
        },
      },
    });
  }

  async updateApplication(id: string, data: Prisma.ApplicationUpdateInput) {
    return this.prisma.application.update({
      where: { id },
      data,
      include: { candidate: true, requisition: true, interviews: true },
    });
  }

  async createInterview(data: Prisma.InterviewCreateInput) {
    return this.prisma.interview.create({
      data,
      include: { application: { include: { candidate: true, requisition: true } }, interviewer: true },
    });
  }

  // ─── Aggregation queries ─────────────────────────────

  async getFunnelData(where: Prisma.ApplicationWhereInput) {
    const stages = ['APPLIED', 'SCREENING', 'PHONE_INTERVIEW', 'TECHNICAL_INTERVIEW', 'ONSITE_INTERVIEW', 'OFFER', 'HIRED'];
    const result: Array<{ stage: string; count: number; avgDays: number }> = [];

    for (const stage of stages) {
      const count = await this.prisma.application.count({
        where: { ...where, stage: { in: stages.slice(stages.indexOf(stage)) as any } },
      });
      result.push({ stage, count, avgDays: 0 });
    }
    return result;
  }

  async getApplicationsBySource(where: Prisma.ApplicationWhereInput) {
    const apps = await this.prisma.application.findMany({
      where,
      include: { candidate: { select: { source: true } } },
    });
    const grouped = new Map<string, { total: number; hired: number }>();
    for (const app of apps) {
      const source = app.candidate.source || 'Unknown';
      const entry = grouped.get(source) || { total: 0, hired: 0 };
      entry.total++;
      if (app.stage === 'HIRED') entry.hired++;
      grouped.set(source, entry);
    }
    return grouped;
  }

  async getOpenRequisitionCount() {
    return this.prisma.jobRequisition.count({ where: { status: 'OPEN' } });
  }

  async getActiveApplicationCount() {
    return this.prisma.application.count({ where: { status: 'ACTIVE' } });
  }

  async getInterviewsThisWeek() {
    const now = new Date();
    const startOfWeek = new Date(now);
    startOfWeek.setDate(now.getDate() - now.getDay());
    startOfWeek.setHours(0, 0, 0, 0);
    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(startOfWeek.getDate() + 7);

    return this.prisma.interview.count({
      where: { scheduledAt: { gte: startOfWeek, lt: endOfWeek } },
    });
  }

  async getOffersExtended(dateRange?: { start: Date; end: Date }) {
    return this.prisma.application.count({
      where: {
        stage: 'OFFER',
        ...(dateRange ? { updatedAt: { gte: dateRange.start, lte: dateRange.end } } : {}),
      },
    });
  }

  async getHiredApplicationsWithDates(dateRange?: { start: Date; end: Date }) {
    return this.prisma.application.findMany({
      where: {
        stage: 'HIRED',
        ...(dateRange ? { updatedAt: { gte: dateRange.start, lte: dateRange.end } } : {}),
      },
      include: {
        requisition: { select: { openDate: true, closedDate: true } },
      },
    });
  }

  async getMonthlyHires(months: number) {
    const results: Array<{ date: string; count: number }> = [];
    const now = new Date();
    for (let i = months - 1; i >= 0; i--) {
      const start = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const end = new Date(now.getFullYear(), now.getMonth() - i + 1, 0, 23, 59, 59);
      const count = await this.prisma.application.count({
        where: { stage: 'HIRED', updatedAt: { gte: start, lte: end } },
      });
      results.push({
        date: `${start.getFullYear()}-${String(start.getMonth() + 1).padStart(2, '0')}`,
        count,
      });
    }
    return results;
  }
}
