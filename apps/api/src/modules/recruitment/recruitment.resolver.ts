import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { RecruitmentService } from './recruitment.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RbacGuard } from '../auth/guards/rbac.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import type { CurrentUserData } from '../auth/decorators/current-user.decorator';

@UseGuards(JwtAuthGuard, RbacGuard)
@Resolver()
export class RecruitmentResolver {
  constructor(private readonly recruitmentService: RecruitmentService) {}

  // ─── Queries ─────────────────────────────────────────

  @Query('recruitmentDashboard')
  async getRecruitmentDashboard(
    @Args('dateRange') dateRange?: { start: string; end: string },
  ) {
    const range = dateRange ? { start: new Date(dateRange.start), end: new Date(dateRange.end) } : undefined;
    return this.recruitmentService.getDashboard(range);
  }

  @Query('requisitions')
  async getRequisitions(
    @Args('filter') filter?: { departmentIds?: string[]; statuses?: string[]; search?: string },
    @Args('pagination') pagination?: { page?: number; limit?: number },
  ) {
    return this.recruitmentService.getRequisitions(filter, pagination);
  }

  @Query('requisition')
  async getRequisition(@Args('id') id: string) {
    return this.recruitmentService.getRequisitionById(id);
  }

  @Query('candidates')
  async getCandidates(@Args('pagination') pagination?: { page?: number; limit?: number }) {
    return this.recruitmentService.getCandidates(pagination);
  }

  @Query('candidate')
  async getCandidate(@Args('id') id: string) {
    return this.recruitmentService.getCandidateById(id);
  }

  @Query('recruitmentFunnel')
  async getRecruitmentFunnel(
    @Args('requisitionId') requisitionId?: string,
    @Args('dateRange') dateRange?: { start: string; end: string },
  ) {
    const range = dateRange ? { start: new Date(dateRange.start), end: new Date(dateRange.end) } : undefined;
    return this.recruitmentService.getFunnel(requisitionId ?? undefined, range);
  }

  @Query('channelEfficiency')
  async getChannelEfficiency(
    @Args('dateRange') dateRange?: { start: string; end: string },
  ) {
    const range = dateRange ? { start: new Date(dateRange.start), end: new Date(dateRange.end) } : undefined;
    return this.recruitmentService.getChannelEfficiency(range);
  }

  @Query('timeToHireTrend')
  async getTimeToHireTrend(@Args('months') months?: number) {
    return this.recruitmentService.getTimeToHireTrend(months || 12);
  }

  // ─── Mutations ───────────────────────────────────────

  @Roles('HR_SPECIALIST', 'ADMIN', 'MANAGER')
  @Mutation('createRequisition')
  async createRequisition(
    @Args('input') input: { title: string; description?: string; departmentId: string },
    @CurrentUser() user: CurrentUserData,
  ) {
    return this.recruitmentService.createRequisition(input, user.id);
  }

  @Roles('HR_SPECIALIST', 'ADMIN')
  @Mutation('updateRequisitionStatus')
  async updateRequisitionStatus(
    @Args('id') id: string,
    @Args('status') status: string,
    @CurrentUser() user: CurrentUserData,
  ) {
    return this.recruitmentService.updateRequisitionStatus(id, status, user.id);
  }

  @Roles('HR_SPECIALIST', 'ADMIN')
  @Mutation('updateApplication')
  async updateApplication(
    @Args('input') input: { applicationId: string; stage?: string; status?: string; score?: number; notes?: string },
    @CurrentUser() user: CurrentUserData,
  ) {
    return this.recruitmentService.updateApplication(input, user.id);
  }

  @Roles('HR_SPECIALIST', 'ADMIN', 'MANAGER')
  @Mutation('scheduleInterview')
  async scheduleInterview(
    @Args('input') input: {
      applicationId: string;
      interviewerId: string;
      type: string;
      scheduledAt: string;
      duration?: number;
      location?: string;
      meetingUrl?: string;
    },
    @CurrentUser() user: CurrentUserData,
  ) {
    return this.recruitmentService.scheduleInterview(input, user.id);
  }

  @Roles('HR_SPECIALIST', 'ADMIN')
  @Mutation('makeOffer')
  async makeOffer(
    @Args('input') input: { applicationId: string; salary: number; startDate: string; notes?: string },
    @CurrentUser() user: CurrentUserData,
  ) {
    return this.recruitmentService.makeOffer(input, user.id);
  }
}
