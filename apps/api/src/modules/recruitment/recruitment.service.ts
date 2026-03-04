import { Injectable, NotFoundException, BadRequestException, Logger } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { RecruitmentRepository } from './recruitment.repository';
import { CreateRequisitionDto } from './dto/create-requisition.dto';
import { RecruitmentFilterDto } from './dto/recruitment-filter.dto';
import { AuditService } from '../../shared/audit/audit.service';
import { parsePagination, buildPaginatedResult, PaginationArgs } from '../../shared/utils/pagination';

@Injectable()
export class RecruitmentService {
  private readonly logger = new Logger(RecruitmentService.name);

  constructor(
    private readonly repository: RecruitmentRepository,
    private readonly auditService: AuditService,
  ) {}

  // ─── Queries ─────────────────────────────────────────

  async getRequisitions(filter?: RecruitmentFilterDto, pagination?: PaginationArgs) {
    const { page, limit, skip } = parsePagination(pagination || {});
    const where: Prisma.JobRequisitionWhereInput = {};

    if (filter?.departmentIds?.length) {
      where.departmentId = { in: filter.departmentIds };
    }
    if (filter?.statuses?.length) {
      where.status = { in: filter.statuses as Prisma.EnumRequisitionStatusFilter['in'] };
    }
    if (filter?.search) {
      where.OR = [
        { title: { contains: filter.search, mode: 'insensitive' } },
        { description: { contains: filter.search, mode: 'insensitive' } },
      ];
    }
    if (filter?.startDate && filter?.endDate) {
      where.openDate = { gte: new Date(filter.startDate), lte: new Date(filter.endDate) };
    }

    const { data, total } = await this.repository.findRequisitions({
      where,
      skip,
      take: limit,
      orderBy: { createdAt: 'desc' },
    });

    return buildPaginatedResult(data, total, page, limit);
  }

  async getRequisitionById(id: string) {
    const requisition = await this.repository.findRequisitionById(id);
    if (!requisition) throw new NotFoundException(`Requisition ${id} not found`);
    return { ...requisition, applicationCount: requisition._count.applications };
  }

  async getCandidates(pagination?: PaginationArgs) {
    const { skip, limit } = parsePagination(pagination || {});
    return this.repository.findCandidates({ skip, take: limit });
  }

  async getCandidateById(id: string) {
    const candidate = await this.repository.findCandidateById(id);
    if (!candidate) throw new NotFoundException(`Candidate ${id} not found`);
    return candidate;
  }

  // ─── Dashboard ───────────────────────────────────────

  async getDashboard(dateRange?: { start: Date; end: Date }) {
    const kpis = await this.calculateKpis(dateRange);
    const funnel = await this.getFunnel(undefined, dateRange);
    const channelEfficiency = await this.getChannelEfficiency(dateRange);
    const timeToHireTrend = await this.getTimeToHireTrend(12);

    const [openRequisitions, activeApplications, interviewsThisWeek, offersExtended] =
      await Promise.all([
        this.repository.getOpenRequisitionCount(),
        this.repository.getActiveApplicationCount(),
        this.repository.getInterviewsThisWeek(),
        this.repository.getOffersExtended(dateRange),
      ]);

    return {
      kpis,
      funnel,
      channelEfficiency,
      timeToHireTrend,
      openRequisitions,
      activeApplications,
      interviewsThisWeek,
      offersExtended,
    };
  }

  async getFunnel(requisitionId?: string, dateRange?: { start: Date; end: Date }) {
    const where: Prisma.ApplicationWhereInput = { status: 'ACTIVE' };
    if (requisitionId) where.requisitionId = requisitionId;
    if (dateRange) where.appliedAt = { gte: dateRange.start, lte: dateRange.end };

    const raw = await this.repository.getFunnelData(where);
    const firstCount = raw[0]?.count || 1;

    return raw.map((stage, i) => ({
      stage: stage.stage,
      count: stage.count,
      conversionRate: i === 0 ? 100 : firstCount > 0 ? Math.round((stage.count / firstCount) * 10000) / 100 : 0,
      avgDaysInStage: stage.avgDays,
    }));
  }

  async getChannelEfficiency(dateRange?: { start: Date; end: Date }) {
    const where: Prisma.ApplicationWhereInput = {};
    if (dateRange) where.appliedAt = { gte: dateRange.start, lte: dateRange.end };

    const grouped = await this.repository.getApplicationsBySource(where);
    return Array.from(grouped.entries()).map(([source, data]) => ({
      source,
      applicants: data.total,
      hires: data.hired,
      conversionRate: data.total > 0 ? Math.round((data.hired / data.total) * 10000) / 100 : 0,
      avgTimeToHire: 0,
      costPerHire: null,
    }));
  }

  async getTimeToHireTrend(months: number) {
    const data = await this.repository.getMonthlyHires(months);
    return data.map((d) => ({
      date: d.date,
      value: d.count,
      label: null,
    }));
  }

  // ─── KPI Calculations ────────────────────────────────

  async calculateKpis(dateRange?: { start: Date; end: Date }) {
    const hiredApps = await this.repository.getHiredApplicationsWithDates(dateRange);

    // Time to hire (days from req open to hire)
    const hireDurations = hiredApps
      .filter((a) => a.requisition.openDate)
      .map((a) => {
        const open = a.requisition.openDate!.getTime();
        const hired = a.updatedAt.getTime();
        return Math.round((hired - open) / (1000 * 60 * 60 * 24));
      });
    const avgTimeToHire = hireDurations.length > 0
      ? Math.round(hireDurations.reduce((a, b) => a + b, 0) / hireDurations.length)
      : 0;

    // Offer acceptance rate
    const [offersExtended, offersAccepted] = await Promise.all([
      this.repository.getOffersExtended(dateRange),
      this.repository.getHiredApplicationsWithDates(dateRange).then((a) => a.length),
    ]);
    const offerAcceptanceRate = offersExtended > 0
      ? Math.round((offersAccepted / offersExtended) * 10000) / 100
      : 0;

    const openReqs = await this.repository.getOpenRequisitionCount();
    const activeApps = await this.repository.getActiveApplicationCount();

    return [
      this.buildKpiCard('time_to_hire', 'Time to Hire', avgTimeToHire, 0, 'days', 'duration'),
      this.buildKpiCard('offer_acceptance_rate', 'Offer Acceptance', offerAcceptanceRate, 0, '%', 'percent'),
      this.buildKpiCard('open_requisitions', 'Open Positions', openReqs, 0, '', 'number'),
      this.buildKpiCard('active_pipeline', 'Active Pipeline', activeApps, 0, '', 'number'),
      this.buildKpiCard('total_hires', 'Total Hires', hiredApps.length, 0, '', 'number'),
      this.buildKpiCard('funnel_conversion', 'Funnel Conversion', offersExtended > 0 ? Math.round((hiredApps.length / Math.max(activeApps, 1)) * 10000) / 100 : 0, 0, '%', 'percent'),
    ];
  }

  // ─── Mutations ───────────────────────────────────────

  async createRequisition(dto: CreateRequisitionDto, userId?: string) {
    const requisition = await this.repository.createRequisition({
      title: dto.title,
      description: dto.description,
      department: { connect: { id: dto.departmentId } },
      grade: dto.grade,
      minSalary: dto.minSalary,
      maxSalary: dto.maxSalary,
      headcount: dto.headcount || 1,
      priority: dto.priority,
      location: dto.location,
      targetDate: dto.targetDate ? new Date(dto.targetDate) : undefined,
      status: 'DRAFT',
    });

    await this.auditService.log({
      userId,
      action: 'CREATE',
      entity: 'JobRequisition',
      entityId: requisition.id,
      newValue: { title: dto.title, departmentId: dto.departmentId },
    });

    this.logger.log(`Requisition created: ${requisition.id}`);
    return { ...requisition, applicationCount: requisition._count.applications };
  }

  async updateRequisitionStatus(id: string, status: string, userId?: string) {
    const existing = await this.getRequisitionById(id);
    const updated = await this.repository.updateRequisition(id, {
      status: status as Prisma.EnumRequisitionStatusFieldUpdateOperationsInput['set'],
      ...(status === 'OPEN' && !existing.openDate ? { openDate: new Date() } : {}),
      ...(status === 'CLOSED' ? { closedDate: new Date() } : {}),
    });

    await this.auditService.log({
      userId,
      action: 'UPDATE_STATUS',
      entity: 'JobRequisition',
      entityId: id,
      oldValue: { status: existing.status },
      newValue: { status },
    });

    return { ...updated, applicationCount: updated._count.applications };
  }

  async updateApplication(input: { applicationId: string; stage?: string; status?: string; score?: number; notes?: string }, userId?: string) {
    const data: Prisma.ApplicationUpdateInput = {};
    if (input.stage) data.stage = input.stage as any;
    if (input.status) data.status = input.status as any;
    if (input.score !== undefined) data.score = input.score;
    if (input.notes !== undefined) data.notes = input.notes;

    const updated = await this.repository.updateApplication(input.applicationId, data);

    await this.auditService.log({
      userId,
      action: 'UPDATE_APPLICATION',
      entity: 'Application',
      entityId: input.applicationId,
      newValue: input,
    });

    return updated;
  }

  async scheduleInterview(input: {
    applicationId: string;
    interviewerId: string;
    type: string;
    scheduledAt: string;
    duration?: number;
    location?: string;
    meetingUrl?: string;
  }, userId?: string) {
    const interview = await this.repository.createInterview({
      application: { connect: { id: input.applicationId } },
      interviewer: { connect: { id: input.interviewerId } },
      type: input.type,
      scheduledAt: new Date(input.scheduledAt),
      duration: input.duration,
      location: input.location,
      meetingUrl: input.meetingUrl,
    });

    await this.auditService.log({
      userId,
      action: 'SCHEDULE_INTERVIEW',
      entity: 'Interview',
      entityId: interview.id,
      newValue: { applicationId: input.applicationId, scheduledAt: input.scheduledAt },
    });

    return interview;
  }

  async makeOffer(input: { applicationId: string; salary: number; startDate: string; notes?: string }, userId?: string) {
    const updated = await this.repository.updateApplication(input.applicationId, {
      stage: 'OFFER',
      notes: input.notes ? `Offer: $${input.salary}, Start: ${input.startDate}. ${input.notes}` : `Offer: $${input.salary}, Start: ${input.startDate}`,
    });

    await this.auditService.log({
      userId,
      action: 'MAKE_OFFER',
      entity: 'Application',
      entityId: input.applicationId,
      newValue: { salary: input.salary, startDate: input.startDate },
    });

    return updated;
  }

  // ─── Helpers ─────────────────────────────────────────

  private buildKpiCard(kpiId: string, label: string, value: number, previousValue: number, unit: string, format: string) {
    const change = previousValue > 0 ? ((value - previousValue) / previousValue) * 100 : 0;
    const changeRounded = Math.round(change * 100) / 100;
    return {
      kpiId,
      label,
      value,
      previousValue,
      changePercent: changeRounded,
      trend: changeRounded > 0 ? 'up' : changeRounded < 0 ? 'down' : 'stable',
      signal: this.determineSignal(kpiId, value),
      unit,
      format,
    };
  }

  private determineSignal(kpiId: string, value: number): string {
    switch (kpiId) {
      case 'time_to_hire':
        return value <= 30 ? 'positive' : value <= 45 ? 'neutral' : value <= 60 ? 'warning' : 'negative';
      case 'offer_acceptance_rate':
        return value >= 85 ? 'positive' : value >= 70 ? 'neutral' : value >= 50 ? 'warning' : 'negative';
      case 'funnel_conversion':
        return value >= 10 ? 'positive' : value >= 5 ? 'neutral' : 'warning';
      default:
        return 'neutral';
    }
  }
}
