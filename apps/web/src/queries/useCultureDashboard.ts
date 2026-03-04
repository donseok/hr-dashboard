'use client';

import { useQuery } from '@tanstack/react-query';
import { gqlRequest } from '@/lib/graphql-client';
import { queryKeys } from './query-keys';
import { USE_MOCK } from './use-mock';
import { CULTURE_DASHBOARD_QUERY } from '@/graphql/queries/culture';

import * as mockData from '@/mocks/culture';

interface CultureDashboardData {
  cultureDashboard: {
    kpis: Array<Record<string, unknown>>;
    engagementTrend: Array<{ date: string; value: number }>;
    eNPS: number;
    surveyParticipationRate: number;
    sentimentAnalysis: {
      positive: number;
      neutral: number;
      negative: number;
      topKeywords: Array<{
        keyword: string;
        count: number;
        sentiment: string;
      }>;
    };
    departmentEngagement: Array<{
      departmentId: string;
      departmentName: string;
      score: number;
      responseRate: number;
      trend: string;
    }>;
    activeSurveyCount: number;
    totalResponseCount: number;
  };
}

function getMockCultureDashboard() {
  return {
    kpis: mockData.cultureKpis,
    eNPS: mockData.eNPSValue,
    engagementTrend: mockData.engagementTrendData,
    radar: {
      indicators: mockData.cultureRadarIndicators,
      series: mockData.cultureRadarSeries,
    },
    heatmap: mockData.engagementHeatmapData,
    wordCloud: mockData.surveyKeywords,
    insights: mockData.cultureInsights,
  };
}

export function useCultureDashboard() {
  return useQuery({
    queryKey: queryKeys.culture.dashboard(),
    queryFn: async () => {
      if (USE_MOCK) return getMockCultureDashboard();

      const data = await gqlRequest<CultureDashboardData>(
        CULTURE_DASHBOARD_QUERY,
      );
      return data.cultureDashboard;
    },
    staleTime: 2 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
}
