import { Injectable, NotFoundException, Logger } from '@nestjs/common';
import { CultureRepository } from './culture.repository';
import { AuditService } from '../../shared/audit/audit.service';

@Injectable()
export class CultureService {
  private readonly logger = new Logger(CultureService.name);

  constructor(
    private readonly repository: CultureRepository,
    private readonly auditService: AuditService,
  ) {}

  // ─── Queries ─────────────────────────────────────────

  async getSurveys(type?: string) {
    const surveys = await this.repository.findSurveys(type);
    return Promise.all(
      surveys.map(async (s) => ({
        ...s,
        responseCount: await this.repository.getSurveyResponseCount(s.id),
      })),
    );
  }

  async getSurveyById(id: string) {
    const survey = await this.repository.findSurveyById(id);
    if (!survey) throw new NotFoundException(`Survey ${id} not found`);
    return {
      ...survey,
      responseCount: survey.responses.length,
    };
  }

  async getDashboard() {
    const [
      engagementTrend,
      eNPS,
      surveyParticipationRate,
      sentimentAnalysis,
      departmentEngagement,
      recentSurveys,
      activeSurveyCount,
      totalResponseCount,
    ] = await Promise.all([
      this.repository.getEngagementTrend(12),
      this.repository.getENPS(),
      this.repository.getSurveyParticipationRate(),
      this.repository.getSentimentFromResponses(),
      this.repository.getDepartmentEngagement(),
      this.getSurveys(),
      this.repository.getActiveSurveyCount(),
      this.repository.getTotalResponseCount(),
    ]);

    const latestScore = engagementTrend.length > 0 ? engagementTrend[engagementTrend.length - 1].value : 0;
    const previousScore = engagementTrend.length > 1 ? engagementTrend[engagementTrend.length - 2].value : 0;

    const kpis = [
      this.buildKpiCard('engagement_score', 'Engagement Score', latestScore, previousScore, '', 'number'),
      this.buildKpiCard('enps', 'eNPS', eNPS, 0, '', 'number'),
      this.buildKpiCard('survey_participation', 'Survey Participation', surveyParticipationRate, 0, '%', 'percent'),
      this.buildKpiCard('culture_health', 'Culture Health', sentimentAnalysis.positive, 0, '%', 'percent'),
    ];

    return {
      kpis,
      engagementTrend,
      eNPS,
      surveyParticipationRate,
      sentimentAnalysis,
      departmentEngagement,
      recentSurveys: recentSurveys.slice(0, 5),
      activeSurveyCount,
      totalResponseCount,
    };
  }

  async getEngagementTrend(months?: number) {
    return this.repository.getEngagementTrend(months || 12);
  }

  async getENPSScore() {
    return this.repository.getENPS();
  }

  async getSentimentAnalysis(surveyId?: string) {
    return this.repository.getSentimentFromResponses(surveyId);
  }

  // ─── Mutations ───────────────────────────────────────

  async createSurvey(input: {
    title: string;
    description?: string;
    type: string;
    isAnonymous?: boolean;
    startDate?: string;
    endDate?: string;
    questions?: any;
  }, userId?: string) {
    const survey = await this.repository.createSurvey({
      ...input,
      startDate: input.startDate ? new Date(input.startDate) : undefined,
      endDate: input.endDate ? new Date(input.endDate) : undefined,
    });

    await this.auditService.log({
      userId,
      action: 'CREATE_SURVEY',
      entity: 'Survey',
      entityId: survey.id,
      newValue: { title: input.title, type: input.type },
    });

    this.logger.log(`Survey created: ${survey.id}`);
    return { ...survey, responseCount: 0 };
  }

  async submitResponse(input: {
    surveyId: string;
    responses: any;
    score?: number;
  }, employeeId?: string) {
    const survey = await this.repository.findSurveyById(input.surveyId);
    if (!survey) throw new NotFoundException(`Survey ${input.surveyId} not found`);

    return this.repository.submitResponse({
      surveyId: input.surveyId,
      employeeId: survey.isAnonymous ? undefined : employeeId,
      responses: input.responses,
      score: input.score,
    });
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
      case 'engagement_score':
        return value >= 4 ? 'positive' : value >= 3.5 ? 'neutral' : value >= 3 ? 'warning' : 'negative';
      case 'enps':
        return value >= 30 ? 'positive' : value >= 0 ? 'neutral' : value >= -20 ? 'warning' : 'negative';
      case 'survey_participation':
        return value >= 80 ? 'positive' : value >= 60 ? 'neutral' : value >= 40 ? 'warning' : 'negative';
      case 'culture_health':
        return value >= 60 ? 'positive' : value >= 40 ? 'neutral' : value >= 20 ? 'warning' : 'negative';
      default:
        return 'neutral';
    }
  }
}
