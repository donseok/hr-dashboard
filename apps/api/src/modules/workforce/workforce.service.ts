import { Injectable, NotFoundException, Logger } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { WorkforceRepository } from './workforce.repository';
import { EmployeeFilterDto } from './dto/employee-filter.dto';
import { AuditService } from '../../shared/audit/audit.service';
import { parsePagination, buildPaginatedResult, PaginationArgs } from '../../shared/utils/pagination';
import { startOfMonth, endOfMonth } from '../../shared/utils/date';

@Injectable()
export class WorkforceService {
  private readonly logger = new Logger(WorkforceService.name);

  constructor(
    private readonly repository: WorkforceRepository,
    private readonly auditService: AuditService,
  ) {}

  // ─── Queries ─────────────────────────────────────────

  async getEmployees(filter?: EmployeeFilterDto, pagination?: PaginationArgs, departmentScope?: string) {
    const { page, limit, skip } = parsePagination(pagination || {});
    const where: Prisma.EmployeeWhereInput = {};

    if (departmentScope) {
      where.departmentId = departmentScope;
    } else if (filter?.departmentIds?.length) {
      where.departmentId = { in: filter.departmentIds };
    }

    if (filter?.statuses?.length) {
      where.status = { in: filter.statuses as Prisma.EnumEmployeeStatusFilter['in'] };
    }
    if (filter?.employmentTypes?.length) {
      where.employmentType = { in: filter.employmentTypes as Prisma.EnumEmploymentTypeFilter['in'] };
    }
    if (filter?.locations?.length) {
      where.location = { in: filter.locations };
    }
    if (filter?.search) {
      where.OR = [
        { firstName: { contains: filter.search, mode: 'insensitive' } },
        { lastName: { contains: filter.search, mode: 'insensitive' } },
        { email: { contains: filter.search, mode: 'insensitive' } },
        { employeeNumber: { contains: filter.search, mode: 'insensitive' } },
      ];
    }

    const { data, total } = await this.repository.findEmployees({
      where,
      skip,
      take: limit,
      orderBy: { lastName: 'asc' },
    });

    return buildPaginatedResult(data, total, page, limit);
  }

  async getEmployeeById(id: string) {
    const employee = await this.repository.findEmployeeById(id);
    if (!employee) throw new NotFoundException(`Employee ${id} not found`);
    return employee;
  }

  async getDepartments() {
    return this.repository.findDepartments();
  }

  async getDepartmentById(id: string) {
    const department = await this.repository.findDepartmentById(id);
    if (!department) throw new NotFoundException(`Department ${id} not found`);
    return department;
  }

  // ─── Dashboard ───────────────────────────────────────

  async getDashboard(dateRange?: { start: Date; end: Date }) {
    const range = dateRange || { start: startOfMonth(), end: endOfMonth() };

    const [
      kpis,
      headcountTrend,
      headcountByDepartment,
      turnoverAnalysis,
      employmentTypeDistribution,
      tenureDistribution,
      newHiresCount,
      terminationsCount,
    ] = await Promise.all([
      this.calculateKpis(range),
      this.getHeadcountTrend(12),
      this.repository.getHeadcountByDepartment(),
      this.getTurnoverAnalysis(range),
      this.repository.getEmploymentTypeDistribution(),
      this.repository.getTenureDistribution(),
      this.repository.getNewHires(range.start, range.end),
      this.repository.getTerminations(range.start, range.end),
    ]);

    return {
      kpis,
      headcountTrend,
      headcountByDepartment,
      turnoverAnalysis,
      employmentTypeDistribution,
      tenureDistribution,
      newHiresCount,
      terminationsCount,
    };
  }

  async getHeadcountTrend(months: number) {
    const data = await this.repository.getMonthlyHeadcount(months);
    return data.map((d) => ({ date: d.date, value: d.value, label: null }));
  }

  async getTurnoverAnalysis(dateRange: { start: Date; end: Date }) {
    const terminations = await this.repository.getTerminations(dateRange.start, dateRange.end);
    const totalHeadcount = await this.repository.getHeadcount();
    const activeEmployees = await this.repository.getActiveEmployees();

    const now = new Date();
    const totalTenureMonths = activeEmployees.reduce((sum, emp) => {
      return sum + ((now.getTime() - emp.hireDate.getTime()) / (30.44 * 24 * 60 * 60 * 1000));
    }, 0);
    const avgTenure = activeEmployees.length > 0
      ? Math.round((totalTenureMonths / activeEmployees.length) * 10) / 10
      : 0;

    const turnoverRate = totalHeadcount > 0
      ? Math.round((terminations / totalHeadcount) * 10000) / 100
      : 0;
    const retentionRate = Math.round((100 - turnoverRate) * 100) / 100;

    const period = `${dateRange.start.toISOString().slice(0, 7)} ~ ${dateRange.end.toISOString().slice(0, 7)}`;

    return {
      period,
      totalTerminations: terminations,
      voluntaryCount: Math.round(terminations * 0.65),
      involuntaryCount: Math.round(terminations * 0.35),
      turnoverRate,
      retentionRate,
      avgTenureMonths: avgTenure,
    };
  }

  async getOrgStructure(departmentId?: string) {
    const employees = await this.repository.getOrgStructure(departmentId);
    return employees.map((e) => ({
      id: e.id,
      name: `${e.firstName} ${e.lastName}`,
      position: e.position,
      departmentId: e.departmentId,
      departmentName: e.department.name,
      managerId: e.managerId,
      directReportCount: e._count.directReports,
    }));
  }

  // ─── KPI Calculations ────────────────────────────────

  async calculateKpis(dateRange: { start: Date; end: Date }) {
    const totalHeadcount = await this.repository.getHeadcount();
    const terminations = await this.repository.getTerminations(dateRange.start, dateRange.end);
    const newHires = await this.repository.getNewHires(dateRange.start, dateRange.end);
    const activeEmployees = await this.repository.getActiveEmployees();

    const turnoverRate = totalHeadcount > 0 ? Math.round((terminations / totalHeadcount) * 10000) / 100 : 0;
    const retentionRate = Math.round((100 - turnoverRate) * 100) / 100;

    const now = new Date();
    const totalTenure = activeEmployees.reduce((sum, e) =>
      sum + (now.getTime() - e.hireDate.getTime()) / (30.44 * 24 * 60 * 60 * 1000), 0);
    const avgTenure = activeEmployees.length > 0
      ? Math.round((totalTenure / activeEmployees.length) * 10) / 10
      : 0;

    const headcountGrowth = totalHeadcount > 0
      ? Math.round(((newHires - terminations) / totalHeadcount) * 10000) / 100
      : 0;

    return [
      this.buildKpiCard('headcount_total', 'Total Headcount', totalHeadcount, 0, '', 'number'),
      this.buildKpiCard('headcount_growth', 'Headcount Growth', headcountGrowth, 0, '%', 'percent'),
      this.buildKpiCard('turnover_rate', 'Turnover Rate', turnoverRate, 0, '%', 'percent'),
      this.buildKpiCard('retention_rate', 'Retention Rate', retentionRate, 0, '%', 'percent'),
      this.buildKpiCard('avg_tenure', 'Avg Tenure', avgTenure, 0, 'mo', 'duration'),
    ];
  }

  // ─── Mutations ───────────────────────────────────────

  async updateEmployee(id: string, input: {
    firstName?: string; lastName?: string; position?: string; grade?: string;
    location?: string; status?: string; employmentType?: string;
  }, userId?: string) {
    const existing = await this.getEmployeeById(id);
    const data: Prisma.EmployeeUpdateInput = {};
    if (input.firstName) data.firstName = input.firstName;
    if (input.lastName) data.lastName = input.lastName;
    if (input.position) data.position = input.position;
    if (input.grade !== undefined) data.grade = input.grade;
    if (input.location !== undefined) data.location = input.location;
    if (input.status) data.status = input.status as any;
    if (input.employmentType) data.employmentType = input.employmentType as any;

    if (input.status === 'TERMINATED') {
      data.terminationDate = new Date();
    }

    const updated = await this.repository.updateEmployee(id, data);

    await this.auditService.log({
      userId,
      action: 'UPDATE_EMPLOYEE',
      entity: 'Employee',
      entityId: id,
      oldValue: { position: existing.position, status: existing.status },
      newValue: input,
    });

    return updated;
  }

  async transferEmployee(input: {
    employeeId: string;
    newDepartmentId: string;
    newPosition?: string;
    newManagerId?: string;
    effectiveDate: string;
    reason?: string;
  }, userId?: string) {
    const existing = await this.getEmployeeById(input.employeeId);

    const data: Prisma.EmployeeUpdateInput = {
      department: { connect: { id: input.newDepartmentId } },
    };
    if (input.newPosition) data.position = input.newPosition;
    if (input.newManagerId) data.manager = { connect: { id: input.newManagerId } };

    const updated = await this.repository.updateEmployee(input.employeeId, data);

    await this.auditService.log({
      userId,
      action: 'TRANSFER_EMPLOYEE',
      entity: 'Employee',
      entityId: input.employeeId,
      oldValue: { departmentId: existing.departmentId, position: existing.position },
      newValue: { departmentId: input.newDepartmentId, position: input.newPosition, reason: input.reason },
    });

    this.logger.log(`Employee ${input.employeeId} transferred to department ${input.newDepartmentId}`);
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
      case 'turnover_rate':
        return value <= 10 ? 'positive' : value <= 15 ? 'neutral' : value <= 20 ? 'warning' : 'negative';
      case 'retention_rate':
        return value >= 90 ? 'positive' : value >= 85 ? 'neutral' : value >= 80 ? 'warning' : 'negative';
      case 'headcount_growth':
        return value > 0 ? 'positive' : value === 0 ? 'neutral' : 'warning';
      default:
        return 'neutral';
    }
  }
}
