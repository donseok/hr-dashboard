'use client';

import { useQuery } from '@tanstack/react-query';
import { gqlRequest } from '@/lib/graphql-client';
import { queryKeys } from './query-keys';
import { USE_MOCK } from './use-mock';
import { DEVELOPMENT_DASHBOARD_QUERY } from '@/graphql/queries/development';

import * as mockData from '@/mocks/development';

interface DevelopmentDashboardData {
  developmentDashboard: {
    kpis: Array<Record<string, unknown>>;
    programsByCategory: Array<Record<string, unknown>>;
    enrollmentTrend: Array<{ date: string; value: number }>;
    completionRate: number;
    topPrograms: Array<Record<string, unknown>>;
    skillGapAnalysis: Array<{
      skill: string;
      currentLevel: number;
      requiredLevel: number;
      gap: number;
      employeeCount: number;
    }>;
    internalMobilityRate: number;
    leadershipPipelineRatio: number;
  };
}

function getMockDevelopmentDashboard() {
  return {
    kpis: mockData.developmentKpis,
    trainingCategory: mockData.trainingCategoryData,
    trainingHoursTrend: mockData.trainingHoursTrendData,
    radar: {
      indicators: mockData.teamCompetencyIndicators,
      series: mockData.teamCompetencySeries,
    },
    timeline: mockData.growthJourneyEvents,
    trainingType: mockData.trainingTypeData,
    insights: mockData.developmentInsights,
  };
}

export function useDevelopmentDashboard() {
  return useQuery({
    queryKey: queryKeys.development.dashboard(),
    queryFn: async () => {
      if (USE_MOCK) return getMockDevelopmentDashboard();

      const data = await gqlRequest<DevelopmentDashboardData>(
        DEVELOPMENT_DASHBOARD_QUERY,
      );
      return data.developmentDashboard;
    },
    staleTime: 2 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
}
