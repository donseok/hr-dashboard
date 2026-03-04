import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../shared/database/prisma.service';

@Injectable()
export class CultureRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findSurveys(type?: string) {
    return this.prisma.survey.findMany({
      where: type ? { type: type as any } : {},
      orderBy: { createdAt: 'desc' },
    });
  }

  async findSurveyById(id: string) {
    return this.prisma.survey.findUnique({
      where: { id },
      include: { responses: true },
    });
  }

  async getSurveyResponseCount(surveyId: string) {
    return this.prisma.surveyResponse.count({ where: { surveyId } });
  }

  async createSurvey(data: {
    title: string;
    description?: string;
    type: string;
    isAnonymous?: boolean;
    startDate?: Date;
    endDate?: Date;
    questions?: any;
  }) {
    return this.prisma.survey.create({
      data: {
        title: data.title,
        description: data.description,
        type: data.type as any,
        isAnonymous: data.isAnonymous ?? true,
        startDate: data.startDate,
        endDate: data.endDate,
        questions: data.questions,
        status: data.startDate && data.startDate <= new Date() ? 'ACTIVE' : 'DRAFT',
      },
    });
  }

  async submitResponse(data: { surveyId: string; employeeId?: string; responses: any; score?: number }) {
    return this.prisma.surveyResponse.create({
      data: {
        surveyId: data.surveyId,
        employeeId: data.employeeId,
        responses: data.responses,
        score: data.score,
      },
      include: { survey: true },
    });
  }

  async getEngagementTrend(months: number) {
    const surveys = await this.prisma.survey.findMany({
      where: { type: 'PULSE', status: 'CLOSED' },
      orderBy: { endDate: 'desc' },
      take: months,
      include: {
        responses: { select: { score: true } },
      },
    });

    return surveys
      .filter((s) => s.endDate)
      .map((s) => {
        const scores = s.responses.filter((r) => r.score !== null).map((r) => Number(r.score));
        const avg = scores.length > 0 ? scores.reduce((a, b) => a + b, 0) / scores.length : 0;
        return {
          date: s.endDate!.toISOString().slice(0, 7),
          value: Math.round(avg * 100) / 100,
          label: s.title,
        };
      })
      .reverse();
  }

  async getENPS() {
    const latestPulse = await this.prisma.survey.findFirst({
      where: { type: 'PULSE', status: 'CLOSED' },
      orderBy: { endDate: 'desc' },
      include: { responses: { select: { score: true } } },
    });

    if (!latestPulse || latestPulse.responses.length === 0) return 0;

    const scores = latestPulse.responses.filter((r) => r.score !== null).map((r) => Number(r.score));
    if (scores.length === 0) return 0;

    // eNPS: score 1-5 → promoters (4-5), passives (3), detractors (1-2)
    const promoters = scores.filter((s) => s >= 4).length;
    const detractors = scores.filter((s) => s <= 2).length;
    return Math.round(((promoters - detractors) / scores.length) * 10000) / 100;
  }

  async getDepartmentEngagement() {
    const departments = await this.prisma.department.findMany({
      where: { isActive: true },
      select: { id: true, name: true },
    });

    const latestPulse = await this.prisma.survey.findFirst({
      where: { type: 'PULSE', status: 'CLOSED' },
      orderBy: { endDate: 'desc' },
      include: {
        responses: {
          where: { score: { not: null } },
          include: { employee: { select: { departmentId: true } } },
        },
      },
    });

    if (!latestPulse) {
      return departments.map((d) => ({
        departmentId: d.id,
        departmentName: d.name,
        score: 0,
        responseRate: 0,
        trend: 'stable',
      }));
    }

    const deptScores = new Map<string, number[]>();
    for (const resp of latestPulse.responses) {
      if (resp.employee?.departmentId) {
        const deptId = resp.employee.departmentId;
        if (!deptScores.has(deptId)) deptScores.set(deptId, []);
        deptScores.get(deptId)!.push(Number(resp.score));
      }
    }

    const deptCounts = await this.prisma.employee.groupBy({
      by: ['departmentId'],
      where: { status: 'ACTIVE' },
      _count: true,
    });
    const countMap = new Map(deptCounts.map((d) => [d.departmentId, d._count]));

    return departments.map((d) => {
      const scores = deptScores.get(d.id) || [];
      const avg = scores.length > 0 ? scores.reduce((a, b) => a + b, 0) / scores.length : 0;
      const total = countMap.get(d.id) || 0;
      return {
        departmentId: d.id,
        departmentName: d.name,
        score: Math.round(avg * 100) / 100,
        responseRate: total > 0 ? Math.round((scores.length / total) * 10000) / 100 : 0,
        trend: avg >= 3.5 ? 'up' : avg >= 3 ? 'stable' : 'down',
      };
    });
  }

  async getActiveSurveyCount() {
    return this.prisma.survey.count({ where: { status: 'ACTIVE' } });
  }

  async getTotalResponseCount() {
    return this.prisma.surveyResponse.count();
  }

  async getSurveyParticipationRate() {
    const activeSurveys = await this.prisma.survey.findMany({
      where: { status: { in: ['ACTIVE', 'CLOSED'] } },
      include: { _count: { select: { responses: true } } },
    });

    const activeEmployees = await this.prisma.employee.count({ where: { status: 'ACTIVE' } });
    if (activeSurveys.length === 0 || activeEmployees === 0) return 0;

    const latestSurvey = activeSurveys[0];
    return Math.round((latestSurvey._count.responses / activeEmployees) * 10000) / 100;
  }

  async getSentimentFromResponses(surveyId?: string) {
    const where = surveyId ? { surveyId } : {};
    const responses = await this.prisma.surveyResponse.findMany({
      where,
      select: { score: true, responses: true },
      take: 500,
      orderBy: { submittedAt: 'desc' },
    });

    if (responses.length === 0) {
      return { positive: 0, neutral: 0, negative: 0, topKeywords: [] };
    }

    const scores = responses.filter((r) => r.score !== null).map((r) => Number(r.score));
    const total = scores.length || 1;

    const positive = scores.filter((s) => s >= 4).length;
    const neutral = scores.filter((s) => s === 3).length;
    const negative = scores.filter((s) => s <= 2).length;

    // Simplified keyword extraction from response JSON
    const keywordMap = new Map<string, { count: number; totalScore: number }>();
    const commonKeywords = ['teamwork', 'leadership', 'communication', 'growth', 'workload', 'culture', 'management', 'flexibility', 'recognition', 'benefits'];

    for (const resp of responses) {
      const text = JSON.stringify(resp.responses).toLowerCase();
      for (const kw of commonKeywords) {
        if (text.includes(kw)) {
          const entry = keywordMap.get(kw) || { count: 0, totalScore: 0 };
          entry.count++;
          entry.totalScore += resp.score ? Number(resp.score) : 3;
          keywordMap.set(kw, entry);
        }
      }
    }

    const topKeywords = Array.from(keywordMap.entries())
      .map(([keyword, data]) => ({
        keyword,
        count: data.count,
        sentiment: data.totalScore / data.count >= 3.5 ? 'positive' : data.totalScore / data.count >= 2.5 ? 'neutral' : 'negative',
      }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10);

    return {
      positive: Math.round((positive / total) * 10000) / 100,
      neutral: Math.round((neutral / total) * 10000) / 100,
      negative: Math.round((negative / total) * 10000) / 100,
      topKeywords,
    };
  }
}
