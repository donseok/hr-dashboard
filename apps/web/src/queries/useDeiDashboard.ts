'use client';

import { useQuery } from '@tanstack/react-query';
import { gqlRequest } from '@/lib/graphql-client';
import { queryKeys } from './query-keys';
import { USE_MOCK } from './use-mock';
import { DEI_DASHBOARD_QUERY } from '@/graphql/queries/dei';

import * as mockData from '@/mocks/dei';

interface DeiDashboardData {
  deiDashboard: {
    kpis: Array<Record<string, unknown>>;
    genderDistribution: Array<Record<string, unknown>>;
    payEquityAnalysis: Array<{
      grade: string;
      category: string;
      avgSalaryMale: number;
      avgSalaryFemale: number;
      gapPercent: number;
      employeeCount: number;
    }>;
    deiTrend: Array<{ date: string; value: number }>;
    inclusionScore: number;
    diversityByDepartment: Array<{
      departmentId: string;
      departmentName: string;
      diversityScore: number;
      genderRatio: number;
      employeeCount: number;
    }>;
  };
}

function getMockDeiDashboard() {
  return {
    kpis: mockData.deiKpis,
    genderByGrade: mockData.genderByGradeData,
    payEquityBubble: mockData.payEquityBubbleData,
    ageDistribution: mockData.ageDistributionData,
    trend: mockData.deiTrendData,
    heatmap: mockData.deiHeatmapData,
    insights: mockData.deiInsights,
  };
}

export function useDeiDashboard() {
  return useQuery({
    queryKey: queryKeys.dei.dashboard(),
    queryFn: async () => {
      if (USE_MOCK) return getMockDeiDashboard();

      const data = await gqlRequest<DeiDashboardData>(DEI_DASHBOARD_QUERY);
      return data.deiDashboard;
    },
    staleTime: 2 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
}
