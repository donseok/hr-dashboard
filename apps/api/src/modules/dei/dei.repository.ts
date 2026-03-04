import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../shared/database/prisma.service';

@Injectable()
export class DeiRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findMetrics(dimension?: string, period?: string) {
    return this.prisma.deiMetric.findMany({
      where: {
        ...(dimension ? { dimension } : {}),
        ...(period ? { period } : {}),
      },
      orderBy: [{ period: 'desc' }, { dimension: 'asc' }],
    });
  }

  async getLatestMetrics() {
    const latestPeriod = await this.prisma.deiMetric.findFirst({
      orderBy: { period: 'desc' },
      select: { period: true },
    });
    if (!latestPeriod) return [];
    return this.prisma.deiMetric.findMany({
      where: { period: latestPeriod.period },
    });
  }

  async recordMetric(data: {
    period: string;
    dimension: string;
    category: string;
    value: number;
    benchmark?: number;
  }) {
    return this.prisma.deiMetric.upsert({
      where: {
        period_dimension_category: {
          period: data.period,
          dimension: data.dimension,
          category: data.category,
        },
      },
      create: {
        period: data.period,
        dimension: data.dimension,
        category: data.category,
        value: data.value,
        benchmark: data.benchmark,
      },
      update: {
        value: data.value,
        benchmark: data.benchmark,
      },
    });
  }

  async getGenderDistribution() {
    // Use DEI metrics for gender dimension
    const metrics = await this.prisma.deiMetric.findMany({
      where: { dimension: 'gender' },
      orderBy: { period: 'desc' },
    });

    // Get latest period only
    if (metrics.length === 0) return [];
    const latestPeriod = metrics[0].period;
    const latest = metrics.filter((m) => m.period === latestPeriod);

    const total = latest.reduce((sum, m) => sum + Number(m.value), 0);
    return latest.map((m) => ({
      label: m.category,
      value: Number(m.value),
      count: Math.round(Number(m.value)),
      percentage: total > 0 ? Math.round((Number(m.value) / total) * 10000) / 100 : 0,
      color: null,
    }));
  }

  async getPayEquityAnalysis(grade?: string) {
    // Analyze salary data by gender per grade
    const employees = await this.prisma.employee.findMany({
      where: {
        status: 'ACTIVE',
        salary: { not: null },
        ...(grade ? { grade } : {}),
      },
      select: {
        grade: true,
        salary: true,
        metadata: true,
      },
    });

    // Group by grade, then calculate avg salary per gender from metadata
    const gradeMap = new Map<string, { male: number[]; female: number[]; other: number[] }>();

    for (const emp of employees) {
      const g = emp.grade || 'Unknown';
      if (!gradeMap.has(g)) gradeMap.set(g, { male: [], female: [], other: [] });
      const entry = gradeMap.get(g)!;
      const salary = Number(emp.salary || 0);
      const gender = (emp.metadata as any)?.gender || 'other';

      if (gender === 'male') entry.male.push(salary);
      else if (gender === 'female') entry.female.push(salary);
      else entry.other.push(salary);
    }

    return Array.from(gradeMap.entries()).map(([gradeKey, data]) => {
      const avgMale = data.male.length > 0 ? data.male.reduce((a, b) => a + b, 0) / data.male.length : 0;
      const avgFemale = data.female.length > 0 ? data.female.reduce((a, b) => a + b, 0) / data.female.length : 0;
      const gap = avgMale > 0 ? Math.round(((avgMale - avgFemale) / avgMale) * 10000) / 100 : 0;

      return {
        grade: gradeKey,
        category: 'gender',
        avgSalaryMale: Math.round(avgMale),
        avgSalaryFemale: Math.round(avgFemale),
        gapPercent: gap,
        employeeCount: data.male.length + data.female.length + data.other.length,
      };
    });
  }

  async getDeiTrend(months: number) {
    const now = new Date();
    const result: Array<{ date: string; value: number; label: string | null }> = [];

    for (let i = months - 1; i >= 0; i--) {
      const period = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const periodStr = `${period.getFullYear()}-${String(period.getMonth() + 1).padStart(2, '0')}`;

      const metrics = await this.prisma.deiMetric.findMany({
        where: { period: periodStr },
      });

      const avgValue = metrics.length > 0
        ? metrics.reduce((sum, m) => sum + Number(m.value), 0) / metrics.length
        : 0;

      result.push({
        date: periodStr,
        value: Math.round(avgValue * 100) / 100,
        label: null,
      });
    }

    return result;
  }

  async getInclusionScore() {
    // Calculate from DEI metrics — inclusion dimension
    const inclusionMetrics = await this.prisma.deiMetric.findMany({
      where: { dimension: 'inclusion' },
      orderBy: { period: 'desc' },
      take: 10,
    });

    if (inclusionMetrics.length === 0) return 0;
    const avg = inclusionMetrics.reduce((sum, m) => sum + Number(m.value), 0) / inclusionMetrics.length;
    return Math.round(avg * 100) / 100;
  }

  async getDiversityByDepartment() {
    const departments = await this.prisma.department.findMany({
      where: { isActive: true },
      select: { id: true, name: true },
    });

    const employees = await this.prisma.employee.findMany({
      where: { status: 'ACTIVE' },
      select: { departmentId: true, metadata: true },
    });

    const deptMap = new Map<string, { total: number; genders: Map<string, number> }>();
    for (const dept of departments) {
      deptMap.set(dept.id, { total: 0, genders: new Map() });
    }

    for (const emp of employees) {
      const entry = deptMap.get(emp.departmentId);
      if (entry) {
        entry.total++;
        const gender = (emp.metadata as any)?.gender || 'unknown';
        entry.genders.set(gender, (entry.genders.get(gender) || 0) + 1);
      }
    }

    return departments.map((dept) => {
      const data = deptMap.get(dept.id)!;
      const femaleCount = data.genders.get('female') || 0;
      const genderRatio = data.total > 0 ? Math.round((femaleCount / data.total) * 10000) / 100 : 0;
      const uniqueGenders = data.genders.size;
      const diversityScore = Math.min(uniqueGenders * 25, 100);

      return {
        departmentId: dept.id,
        departmentName: dept.name,
        diversityScore,
        genderRatio,
        employeeCount: data.total,
      };
    });
  }
}
