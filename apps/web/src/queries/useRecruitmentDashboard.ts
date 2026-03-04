'use client';

import { useQuery } from '@tanstack/react-query';
import { gqlRequest } from '@/lib/graphql-client';
import { queryKeys } from './query-keys';
import { USE_MOCK } from './use-mock';
import { RECRUITMENT_DASHBOARD_QUERY } from '@/graphql/queries/recruitment';
import { useFilterStore } from '@/stores/filterStore';

// Mock data imports
import * as mockData from '@/mocks/recruitment';

interface RecruitmentDashboardData {
  recruitmentDashboard: {
    kpis: Array<{
      kpiId: string;
      label: string;
      value: number;
      changePercent: number;
      trend: string;
      signal: string;
      unit: string;
      format: string;
    }>;
    funnel: Array<{
      stage: string;
      count: number;
      conversionRate: number;
      avgDaysInStage: number;
    }>;
    channelEfficiency: Array<{
      source: string;
      applicants: number;
      hires: number;
      conversionRate: number;
      avgTimeToHire: number;
      costPerHire: number | null;
    }>;
    timeToHireTrend: Array<{ date: string; value: number }>;
    openRequisitions: number;
    activeApplications: number;
    interviewsThisWeek: number;
    offersExtended: number;
  };
}

function getMockRecruitmentDashboard() {
  return {
    kpis: mockData.recruitmentKpis,
    funnel: mockData.recruitmentFunnelData,
    channels: mockData.recruitmentChannelData,
    trend: mockData.timeToHireTrendData,
    heatmap: mockData.recruitmentHeatmapData,
    gantt: mockData.recruitmentGanttData,
    insights: mockData.recruitmentInsights,
  };
}

export function useRecruitmentDashboard() {
  const { dateRange, departments: deptFilter } = useFilterStore();

  const filters = {
    dateRange: { start: dateRange.start, end: dateRange.end },
    departmentIds: deptFilter.length > 0 ? deptFilter : undefined,
  };

  return useQuery({
    queryKey: queryKeys.recruitment.dashboard(filters),
    queryFn: async () => {
      if (USE_MOCK) return getMockRecruitmentDashboard();

      const data = await gqlRequest<RecruitmentDashboardData>(
        RECRUITMENT_DASHBOARD_QUERY,
        { dateRange: filters.dateRange },
      );
      return data.recruitmentDashboard;
    },
    staleTime: 2 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
}
