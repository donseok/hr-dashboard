import { Injectable, NotFoundException, Logger } from '@nestjs/common';
import { DevelopmentRepository } from './development.repository';
import { AuditService } from '../../shared/audit/audit.service';

@Injectable()
export class DevelopmentService {
  private readonly logger = new Logger(DevelopmentService.name);

  constructor(
    private readonly repository: DevelopmentRepository,
    private readonly auditService: AuditService,
  ) {}

  // ─── Queries ─────────────────────────────────────────

  async getPrograms(category?: string) {
    const programs = await this.repository.findPrograms(category);
    return Promise.all(
      programs.map(async (p) => ({
        ...p,
        enrollmentCount: await this.repository.getEnrollmentCount(p.id),
      })),
    );
  }

  async getProgramById(id: string) {
    const program = await this.repository.findProgramById(id);
    if (!program) throw new NotFoundException(`Training program ${id} not found`);
    return {
      ...program,
      enrollmentCount: program.enrollments.length,
    };
  }

  async getMyEnrollments(employeeId: string) {
    return this.repository.findEnrollmentsByEmployee(employeeId);
  }

  async getDashboard() {
    const [
      programsByCategory,
      enrollmentTrend,
      completionRate,
      topPrograms,
      internalMobilityRate,
      leadershipPipelineRatio,
      avgTrainingHours,
    ] = await Promise.all([
      this.repository.getProgramsByCategory(),
      this.repository.getEnrollmentTrend(12),
      this.repository.getCompletionRate(),
      this.repository.getTopPrograms(5),
      this.repository.getInternalMobilityRate(),
      this.repository.getLeadershipPipelineRatio(),
      this.repository.getAvgTrainingHoursPerEmployee(),
    ]);

    // Simplified skill gap analysis
    const skillGapAnalysis = await this.getSkillGapAnalysis();

    const kpis = [
      this.buildKpiCard('training_hours', 'Avg Training Hours', avgTrainingHours, 0, 'hrs', 'number'),
      this.buildKpiCard('completion_rate', 'Completion Rate', completionRate, 0, '%', 'percent'),
      this.buildKpiCard('internal_mobility', 'Internal Mobility', internalMobilityRate, 0, '%', 'percent'),
      this.buildKpiCard('leadership_pipeline', 'Leadership Pipeline', leadershipPipelineRatio, 0, '%', 'percent'),
    ];

    return {
      kpis,
      programsByCategory,
      enrollmentTrend,
      completionRate,
      topPrograms,
      skillGapAnalysis,
      internalMobilityRate,
      leadershipPipelineRatio,
    };
  }

  async getSkillGapAnalysis() {
    // Simplified: analyze training program categories vs completion rates
    const categories = await this.repository.getProgramsByCategory();
    return categories.map((cat) => ({
      skill: cat.label,
      currentLevel: Math.min(cat.count * 0.8, 5),
      requiredLevel: 4.0,
      gap: Math.max(0, 4.0 - Math.min(cat.count * 0.8, 5)),
      employeeCount: cat.count,
    }));
  }

  async getInternalMobilityRate() {
    return this.repository.getInternalMobilityRate();
  }

  // ─── Mutations ───────────────────────────────────────

  async createProgram(input: {
    title: string;
    description?: string;
    category: string;
    provider?: string;
    format?: string;
    duration?: number;
    maxCapacity?: number;
    cost?: number;
  }, userId?: string) {
    const program = await this.repository.createProgram(input);

    await this.auditService.log({
      userId,
      action: 'CREATE_PROGRAM',
      entity: 'TrainingProgram',
      entityId: program.id,
      newValue: { title: input.title, category: input.category },
    });

    this.logger.log(`Training program created: ${program.id}`);
    return { ...program, enrollmentCount: 0 };
  }

  async enrollEmployee(input: { programId: string; employeeId: string }, userId?: string) {
    const enrollment = await this.repository.enrollEmployee(input.programId, input.employeeId);

    await this.auditService.log({
      userId,
      action: 'ENROLL_EMPLOYEE',
      entity: 'TrainingEnrollment',
      entityId: enrollment.id,
      newValue: { programId: input.programId, employeeId: input.employeeId },
    });

    this.logger.log(`Employee ${input.employeeId} enrolled in program ${input.programId}`);
    return enrollment;
  }

  async completeTraining(enrollmentId: string, score?: number, userId?: string) {
    const enrollment = await this.repository.completeTraining(enrollmentId, score);

    await this.auditService.log({
      userId,
      action: 'COMPLETE_TRAINING',
      entity: 'TrainingEnrollment',
      entityId: enrollmentId,
      newValue: { status: 'COMPLETED', score },
    });

    this.logger.log(`Training enrollment ${enrollmentId} completed`);
    return enrollment;
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
      case 'training_hours':
        return value >= 40 ? 'positive' : value >= 20 ? 'neutral' : value >= 10 ? 'warning' : 'negative';
      case 'completion_rate':
        return value >= 80 ? 'positive' : value >= 60 ? 'neutral' : value >= 40 ? 'warning' : 'negative';
      case 'internal_mobility':
        return value >= 10 ? 'positive' : value >= 5 ? 'neutral' : 'warning';
      case 'leadership_pipeline':
        return value >= 15 ? 'positive' : value >= 10 ? 'neutral' : 'warning';
      default:
        return 'neutral';
    }
  }
}
