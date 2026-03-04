'use client';

import { useEffect } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { onSocketEvent, type KpiUpdateEvent } from '@/lib/socket-client';
import { queryKeys } from './query-keys';

/**
 * Hook that listens for real-time KPI updates via WebSocket
 * and invalidates relevant dashboard queries.
 */
export function useKpiRealtime() {
  const queryClient = useQueryClient();

  useEffect(() => {
    const unsub = onSocketEvent('kpi-updated', (data: KpiUpdateEvent) => {
      // Invalidate the specific module dashboard
      const moduleKey = moduleToQueryKey(data.module);
      if (moduleKey) {
        queryClient.invalidateQueries({ queryKey: [moduleKey] });
      }

      // Always invalidate KPI snapshots
      queryClient.invalidateQueries({ queryKey: queryKeys.kpi.all });

      // Invalidate lifecycle since it aggregates all modules
      queryClient.invalidateQueries({ queryKey: queryKeys.lifecycle.all });
    });

    return unsub;
  }, [queryClient]);
}

function moduleToQueryKey(module: string): string | null {
  const map: Record<string, string> = {
    recruitment: 'recruitment',
    workforce: 'workforce',
    performance: 'performance',
    culture: 'culture',
    development: 'development',
    dei: 'dei',
    lifecycle: 'lifecycle',
  };
  return map[module] ?? null;
}
