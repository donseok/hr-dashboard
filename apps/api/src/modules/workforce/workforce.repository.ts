import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../../shared/database/prisma.service';

@Injectable()
export class WorkforceRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findEmployees(params: {
    where?: Prisma.EmployeeWhereInput;
    skip?: number;
    take?: number;
    orderBy?: Prisma.EmployeeOrderByWithRelationInput;
  }) {
    const [data, total] = await this.prisma.$transaction([
      this.prisma.employee.findMany({
        ...params,
        include: { department: true, manager: true },
      }),
      this.prisma.employee.count({ where: params.where }),
    ]);
    return { data, total };
  }

  async findEmployeeById(id: string) {
    return this.prisma.employee.findUnique({
      where: { id },
      include: {
        department: true,
        manager: true,
        directReports: { select: { id: true, firstName: true, lastName: true, position: true } },
      },
    });
  }

  async updateEmployee(id: string, data: Prisma.EmployeeUpdateInput) {
    return this.prisma.employee.update({
      where: { id },
      data,
      include: { department: true, manager: true },
    });
  }

  async findDepartments() {
    return this.prisma.department.findMany({
      where: { isActive: true },
      include: { parent: true, children: true },
      orderBy: { name: 'asc' },
    });
  }

  async findDepartmentById(id: string) {
    return this.prisma.department.findUnique({
      where: { id },
      include: {
        parent: true,
        children: true,
        employees: { where: { status: 'ACTIVE' }, take: 50 },
      },
    });
  }

  // ─── Aggregation queries ─────────────────────────────

  async getHeadcount(where?: Prisma.EmployeeWhereInput) {
    return this.prisma.employee.count({ where: { status: 'ACTIVE', ...where } });
  }

  async getHeadcountByDepartment() {
    const departments = await this.prisma.department.findMany({
      where: { isActive: true },
      select: { id: true, name: true },
    });
    const counts = await this.prisma.employee.groupBy({
      by: ['departmentId'],
      where: { status: 'ACTIVE' },
      _count: true,
    });

    const total = counts.reduce((sum, c) => sum + c._count, 0);
    return counts.map((c) => {
      const dept = departments.find((d) => d.id === c.departmentId);
      return {
        departmentId: c.departmentId,
        departmentName: dept?.name || 'Unknown',
        count: c._count,
        percentage: total > 0 ? Math.round((c._count / total) * 10000) / 100 : 0,
      };
    });
  }

  async getEmploymentTypeDistribution() {
    const counts = await this.prisma.employee.groupBy({
      by: ['employmentType'],
      where: { status: 'ACTIVE' },
      _count: true,
    });
    const total = counts.reduce((sum, c) => sum + c._count, 0);
    return counts.map((c) => ({
      label: c.employmentType,
      count: c._count,
      value: c._count,
      percentage: total > 0 ? Math.round((c._count / total) * 10000) / 100 : 0,
    }));
  }

  async getMonthlyHeadcount(months: number) {
    const results: Array<{ date: string; value: number }> = [];
    const now = new Date();
    for (let i = months - 1; i >= 0; i--) {
      const end = new Date(now.getFullYear(), now.getMonth() - i + 1, 0, 23, 59, 59);
      const count = await this.prisma.employee.count({
        where: {
          hireDate: { lte: end },
          OR: [{ terminationDate: null }, { terminationDate: { gt: end } }],
        },
      });
      results.push({
        date: `${end.getFullYear()}-${String(end.getMonth() + 1).padStart(2, '0')}`,
        value: count,
      });
    }
    return results;
  }

  async getTerminations(startDate: Date, endDate: Date) {
    return this.prisma.employee.count({
      where: {
        status: 'TERMINATED',
        terminationDate: { gte: startDate, lte: endDate },
      },
    });
  }

  async getNewHires(startDate: Date, endDate: Date) {
    return this.prisma.employee.count({
      where: { hireDate: { gte: startDate, lte: endDate } },
    });
  }

  async getActiveEmployees() {
    return this.prisma.employee.findMany({
      where: { status: 'ACTIVE' },
      select: { id: true, hireDate: true },
    });
  }

  async getTenureDistribution() {
    const employees = await this.prisma.employee.findMany({
      where: { status: 'ACTIVE' },
      select: { hireDate: true },
    });

    const now = new Date();
    const buckets = new Map<string, number>([
      ['< 1 year', 0],
      ['1-2 years', 0],
      ['2-5 years', 0],
      ['5-10 years', 0],
      ['10+ years', 0],
    ]);

    for (const emp of employees) {
      const years = (now.getTime() - emp.hireDate.getTime()) / (365.25 * 24 * 60 * 60 * 1000);
      if (years < 1) buckets.set('< 1 year', (buckets.get('< 1 year') || 0) + 1);
      else if (years < 2) buckets.set('1-2 years', (buckets.get('1-2 years') || 0) + 1);
      else if (years < 5) buckets.set('2-5 years', (buckets.get('2-5 years') || 0) + 1);
      else if (years < 10) buckets.set('5-10 years', (buckets.get('5-10 years') || 0) + 1);
      else buckets.set('10+ years', (buckets.get('10+ years') || 0) + 1);
    }

    const total = employees.length;
    return Array.from(buckets.entries()).map(([label, count]) => ({
      label,
      count,
      value: count,
      percentage: total > 0 ? Math.round((count / total) * 10000) / 100 : 0,
    }));
  }

  async getOrgStructure(departmentId?: string) {
    const where: Prisma.EmployeeWhereInput = { status: 'ACTIVE' };
    if (departmentId) where.departmentId = departmentId;

    return this.prisma.employee.findMany({
      where,
      select: {
        id: true,
        firstName: true,
        lastName: true,
        position: true,
        departmentId: true,
        managerId: true,
        department: { select: { name: true } },
        _count: { select: { directReports: true } },
      },
      orderBy: [{ department: { name: 'asc' } }, { lastName: 'asc' }],
    });
  }
}
