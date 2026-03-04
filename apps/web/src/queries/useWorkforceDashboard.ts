'use client';

import { useQuery } from '@tanstack/react-query';
import { gqlRequest } from '@/lib/graphql-client';
import { queryKeys } from './query-keys';
import { USE_MOCK } from './use-mock';
import { WORKFORCE_DASHBOARD_QUERY } from '@/graphql/queries/workforce';
import { useFilterStore } from '@/stores/filterStore';

import * as mockData from '@/mocks/workforce';

interface WorkforceDashboardData {
  workforceDashboard: {
    kpis: Array<Record<string, unknown>>;
    headcountTrend: Array<{ date: string; value: number }>;
    headcountByDepartment: Array<{
      departmentId: string;
      departmentName: string;
      count: number;
      percentage: number;
    }>;
    turnoverAnalysis: Record<string, unknown>;
    employmentTypeDistribution: Array<Record<string, unknown>>;
    tenureDistribution: Array<Record<string, unknown>>;
    newHiresCount: number;
    terminationsCount: number;
  };
}

function getMockWorkforceDashboard() {
  return {
    kpis: mockData.workforceKpis,
    treemap: mockData.headcountTreemapData,
    waterfall: mockData.headcountWaterfallData,
    stackedBar: mockData.tenureDistributionData,
    trend: mockData.turnoverTrendData,
    sankey: {
      nodes: mockData.attritionFlowNodes,
      links: mockData.attritionFlowLinks,
    },
    insights: mockData.workforceInsights,
  };
}

export function useWorkforceDashboard() {
  const { dateRange, departments: deptFilter } = useFilterStore();

  const filters = {
    dateRange: { start: dateRange.start, end: dateRange.end },
    departmentIds: deptFilter.length > 0 ? deptFilter : undefined,
  };

  return useQuery({
    queryKey: queryKeys.workforce.dashboard(filters),
    queryFn: async () => {
      if (USE_MOCK) return getMockWorkforceDashboard();

      const data = await gqlRequest<WorkforceDashboardData>(
        WORKFORCE_DASHBOARD_QUERY,
        { dateRange: filters.dateRange },
      );
      return data.workforceDashboard;
    },
    staleTime: 2 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
}
