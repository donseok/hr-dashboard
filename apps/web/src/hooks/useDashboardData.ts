'use client';

import { useRecruitmentDashboard } from '@/queries/useRecruitmentDashboard';
import { useWorkforceDashboard } from '@/queries/useWorkforceDashboard';
import { usePerformanceDashboard } from '@/queries/usePerformanceDashboard';
import { useCultureDashboard } from '@/queries/useCultureDashboard';
import { useDevelopmentDashboard } from '@/queries/useDevelopmentDashboard';
import { useDeiDashboard } from '@/queries/useDeiDashboard';
import { useLifecycleDashboard } from '@/queries/useLifecycleDashboard';

export type ModuleType =
  | 'recruitment'
  | 'workforce'
  | 'performance'
  | 'culture'
  | 'development'
  | 'dei'
  | 'lifecycle';

/**
 * Unified dashboard data hook.
 * Internally delegates to the correct module hook.
 * Each hook handles mock/API toggle via NEXT_PUBLIC_USE_MOCK.
 *
 * Usage:
 *   const { data, isLoading, error } = useDashboardData('recruitment');
 */
export function useDashboardData(module: ModuleType) {
  // We must call all hooks unconditionally (React rules of hooks),
  // but only the matching one will be used.
  const recruitment = useRecruitmentDashboard();
  const workforce = useWorkforceDashboard();
  const performance = usePerformanceDashboard();
  const culture = useCultureDashboard();
  const development = useDevelopmentDashboard();
  const dei = useDeiDashboard();
  const lifecycle = useLifecycleDashboard();

  const hookMap = {
    recruitment,
    workforce,
    performance,
    culture,
    development,
    dei,
    lifecycle,
  } as const;

  return hookMap[module];
}
