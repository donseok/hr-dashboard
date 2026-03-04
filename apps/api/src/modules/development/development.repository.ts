import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../shared/database/prisma.service';

@Injectable()
export class DevelopmentRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findPrograms(category?: string) {
    return this.prisma.trainingProgram.findMany({
      where: {
        isActive: true,
        ...(category ? { category } : {}),
      },
      orderBy: { title: 'asc' },
    });
  }

  async findProgramById(id: string) {
    return this.prisma.trainingProgram.findUnique({
      where: { id },
      include: {
        enrollments: {
          include: { employee: { select: { id: true, firstName: true, lastName: true } } },
        },
      },
    });
  }

  async findEnrollmentsByEmployee(employeeId: string) {
    return this.prisma.trainingEnrollment.findMany({
      where: { employeeId },
      include: { program: true },
      orderBy: { enrolledAt: 'desc' },
    });
  }

  async getEnrollmentCount(programId: string) {
    return this.prisma.trainingEnrollment.count({ where: { programId } });
  }

  async createProgram(data: {
    title: string;
    description?: string;
    category: string;
    provider?: string;
    format?: string;
    duration?: number;
    maxCapacity?: number;
    cost?: number;
  }) {
    return this.prisma.trainingProgram.create({
      data: {
        title: data.title,
        description: data.description,
        category: data.category,
        provider: data.provider,
        format: data.format,
        duration: data.duration,
        maxCapacity: data.maxCapacity,
        cost: data.cost,
      },
    });
  }

  async enrollEmployee(programId: string, employeeId: string) {
    return this.prisma.trainingEnrollment.create({
      data: { programId, employeeId, status: 'ENROLLED' },
      include: { program: true, employee: { select: { id: true, firstName: true, lastName: true } } },
    });
  }

  async completeTraining(enrollmentId: string, score?: number) {
    return this.prisma.trainingEnrollment.update({
      where: { id: enrollmentId },
      data: {
        status: 'COMPLETED',
        completedAt: new Date(),
        score,
      },
      include: { program: true, employee: { select: { id: true, firstName: true, lastName: true } } },
    });
  }

  async getProgramsByCategory() {
    const programs = await this.prisma.trainingProgram.groupBy({
      by: ['category'],
      where: { isActive: true },
      _count: true,
    });

    const total = programs.reduce((sum, p) => sum + p._count, 0);

    return programs.map((p) => ({
      label: p.category,
      value: p._count,
      count: p._count,
      percentage: total > 0 ? Math.round((p._count / total) * 10000) / 100 : 0,
      color: null,
    }));
  }

  async getEnrollmentTrend(months: number) {
    const now = new Date();
    const result: Array<{ date: string; value: number; label: string | null }> = [];

    for (let i = months - 1; i >= 0; i--) {
      const start = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const end = new Date(now.getFullYear(), now.getMonth() - i + 1, 0);
      const count = await this.prisma.trainingEnrollment.count({
        where: { enrolledAt: { gte: start, lte: end } },
      });
      result.push({
        date: `${start.getFullYear()}-${String(start.getMonth() + 1).padStart(2, '0')}`,
        value: count,
        label: null,
      });
    }

    return result;
  }

  async getCompletionRate() {
    const total = await this.prisma.trainingEnrollment.count();
    const completed = await this.prisma.trainingEnrollment.count({ where: { status: 'COMPLETED' } });
    return total > 0 ? Math.round((completed / total) * 10000) / 100 : 0;
  }

  async getTopPrograms(limit: number) {
    const programs = await this.prisma.trainingProgram.findMany({
      where: { isActive: true },
      include: { _count: { select: { enrollments: true } } },
      orderBy: { enrollments: { _count: 'desc' } },
      take: limit,
    });

    return programs.map((p) => ({
      ...p,
      enrollmentCount: p._count.enrollments,
    }));
  }

  async getInternalMobilityRate() {
    const now = new Date();
    const yearStart = new Date(now.getFullYear(), 0, 1);

    // Count employees who changed departments this year (simplified: look at audit logs)
    const transfers = await this.prisma.auditLog.count({
      where: {
        action: 'TRANSFER_EMPLOYEE',
        createdAt: { gte: yearStart },
      },
    });

    const activeEmployees = await this.prisma.employee.count({ where: { status: 'ACTIVE' } });
    return activeEmployees > 0 ? Math.round((transfers / activeEmployees) * 10000) / 100 : 0;
  }

  async getLeadershipPipelineRatio() {
    const totalActive = await this.prisma.employee.count({ where: { status: 'ACTIVE' } });
    const leaders = await this.prisma.employee.count({
      where: {
        status: 'ACTIVE',
        grade: { in: ['L7', 'L8', 'L9', 'L10'] },
      },
    });
    return totalActive > 0 ? Math.round((leaders / totalActive) * 10000) / 100 : 0;
  }

  async getAvgTrainingHoursPerEmployee() {
    const completedEnrollments = await this.prisma.trainingEnrollment.findMany({
      where: { status: 'COMPLETED' },
      include: { program: { select: { duration: true } } },
    });
    const activeEmpCount = await this.prisma.employee.count({ where: { status: 'ACTIVE' } });
    const totalHours = completedEnrollments.reduce((sum, e) => sum + (e.program.duration || 0), 0);
    return activeEmpCount > 0 ? Math.round((totalHours / activeEmpCount) * 10) / 10 : 0;
  }
}
