import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { WorkforceService } from './workforce.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RbacGuard } from '../auth/guards/rbac.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import type { CurrentUserData } from '../auth/decorators/current-user.decorator';

@UseGuards(JwtAuthGuard, RbacGuard)
@Resolver()
export class WorkforceResolver {
  constructor(private readonly workforceService: WorkforceService) {}

  // ─── Queries ─────────────────────────────────────────

  @Query('workforceDashboard')
  async getWorkforceDashboard(
    @Args('dateRange') dateRange?: { start: string; end: string },
  ) {
    const range = dateRange ? { start: new Date(dateRange.start), end: new Date(dateRange.end) } : undefined;
    return this.workforceService.getDashboard(range);
  }

  @Query('employees')
  async getEmployees(
    @Args('filter') filter?: { departmentIds?: string[]; statuses?: string[]; search?: string },
    @Args('pagination') pagination?: { page?: number; limit?: number },
    @CurrentUser() user?: CurrentUserData,
  ) {
    const departmentScope = user?.roles?.includes('MANAGER') && !user?.roles?.includes('HR_SPECIALIST')
      ? user.departmentId ?? undefined
      : undefined;
    return this.workforceService.getEmployees(filter, pagination, departmentScope);
  }

  @Query('employee')
  async getEmployee(@Args('id') id: string) {
    return this.workforceService.getEmployeeById(id);
  }

  @Query('departments')
  async getDepartments() {
    return this.workforceService.getDepartments();
  }

  @Query('department')
  async getDepartment(@Args('id') id: string) {
    return this.workforceService.getDepartmentById(id);
  }

  @Query('headcountTrend')
  async getHeadcountTrend(@Args('months') months?: number) {
    return this.workforceService.getHeadcountTrend(months || 12);
  }

  @Query('turnoverAnalysis')
  async getTurnoverAnalysis(
    @Args('dateRange') dateRange?: { start: string; end: string },
  ) {
    const now = new Date();
    const range = dateRange
      ? { start: new Date(dateRange.start), end: new Date(dateRange.end) }
      : { start: new Date(now.getFullYear(), 0, 1), end: now };
    return this.workforceService.getTurnoverAnalysis(range);
  }

  @Query('orgStructure')
  async getOrgStructure(@Args('departmentId') departmentId?: string) {
    return this.workforceService.getOrgStructure(departmentId ?? undefined);
  }

  // ─── Mutations ───────────────────────────────────────

  @Roles('HR_SPECIALIST', 'ADMIN')
  @Mutation('updateEmployee')
  async updateEmployee(
    @Args('id') id: string,
    @Args('input') input: { firstName?: string; lastName?: string; position?: string; grade?: string; location?: string; status?: string },
    @CurrentUser() user: CurrentUserData,
  ) {
    return this.workforceService.updateEmployee(id, input, user.id);
  }

  @Roles('HR_SPECIALIST', 'ADMIN')
  @Mutation('transferEmployee')
  async transferEmployee(
    @Args('input') input: {
      employeeId: string;
      newDepartmentId: string;
      newPosition?: string;
      newManagerId?: string;
      effectiveDate: string;
      reason?: string;
    },
    @CurrentUser() user: CurrentUserData,
  ) {
    return this.workforceService.transferEmployee(input, user.id);
  }
}
