'use client';

import { useQuery } from '@tanstack/react-query';
import { gqlRequest } from '@/lib/graphql-client';
import { queryKeys } from './query-keys';
import { USE_MOCK } from './use-mock';
import { LIFECYCLE_DASHBOARD_QUERY } from '@/graphql/queries/lifecycle';

import * as mockData from '@/mocks/lifecycle';

interface LifecycleDashboardData {
  lifecycleDashboard: {
    kpis: Array<Record<string, unknown>>;
    employeeJourney: Array<{
      stage: string;
      avgDuration: number;
      count: number;
      conversionRate: number;
    }>;
    crossModuleInsights: Array<{
      title: string;
      description: string;
      sourceModule: string;
      targetModule: string;
      correlationStrength: number;
      insight: string;
    }>;
    attritionCorrelation: Array<{
      factor: string;
      correlationWithAttrition: number;
      sampleSize: number;
      significance: string;
    }>;
    moduleKpiSummary: Array<{
      module: string;
      kpis: Array<Record<string, unknown>>;
      overallSignal: string;
    }>;
  };
}

function getMockLifecycleDashboard() {
  return {
    kpis: mockData.lifecycleKpis,
    sankey: {
      nodes: mockData.lifecycleFlowNodes,
      links: mockData.lifecycleFlowLinks,
    },
    cohort: {
      data: mockData.cohortRetentionData,
      periodLabels: mockData.cohortPeriodLabels,
    },
    correlation: mockData.moduleCorrelationData,
    trend: mockData.integratedTrendData,
    insights: mockData.lifecycleInsights,
  };
}

export function useLifecycleDashboard() {
  return useQuery({
    queryKey: queryKeys.lifecycle.dashboard(),
    queryFn: async () => {
      if (USE_MOCK) return getMockLifecycleDashboard();

      const data = await gqlRequest<LifecycleDashboardData>(
        LIFECYCLE_DASHBOARD_QUERY,
      );
      return data.lifecycleDashboard;
    },
    staleTime: 2 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
}
