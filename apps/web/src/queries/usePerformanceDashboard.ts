'use client';

import { useQuery } from '@tanstack/react-query';
import { gqlRequest } from '@/lib/graphql-client';
import { queryKeys } from './query-keys';
import { USE_MOCK } from './use-mock';
import { PERFORMANCE_DASHBOARD_QUERY } from '@/graphql/queries/performance';

import * as mockData from '@/mocks/performance';

interface PerformanceDashboardData {
  performanceDashboard: {
    kpis: Array<Record<string, unknown>>;
    activeCycle: Record<string, unknown> | null;
    ratingDistribution: Array<{
      rating: string;
      count: number;
      percentage: number;
    }>;
    departmentPerformance: Array<Record<string, unknown>>;
    completionTrend: Array<{ date: string; value: number }>;
    goalAchievementRate: number;
  };
}

function getMockPerformanceDashboard() {
  return {
    kpis: mockData.performanceKpis,
    nineBox: mockData.nineBoxEmployees,
    gradeDistribution: mockData.gradeDistributionData,
    radar: {
      indicators: mockData.teamPerformanceIndicators,
      series: mockData.teamPerformanceSeries,
    },
    bubble: mockData.performanceCorrelationData,
    insights: mockData.performanceInsights,
  };
}

export function usePerformanceDashboard(cycleId?: string) {
  return useQuery({
    queryKey: queryKeys.performance.dashboard(cycleId),
    queryFn: async () => {
      if (USE_MOCK) return getMockPerformanceDashboard();

      const data = await gqlRequest<PerformanceDashboardData>(
        PERFORMANCE_DASHBOARD_QUERY,
        cycleId ? { cycleId } : undefined,
      );
      return data.performanceDashboard;
    },
    staleTime: 2 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
}
