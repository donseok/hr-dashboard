'use client';

import { KpiCard } from '@/components/kpi/KpiCard';
import { KpiGrid } from '@/components/kpi/KpiGrid';
import { performanceKpis } from '@/mocks/performance';

export default function PerformanceKpiSlot() {
  const kpis = performanceKpis;

  return (
    <KpiGrid columns={3}>
      <KpiCard {...kpis.goalAchievement} />
      <KpiCard {...kpis.gradeDistribution} />
      <KpiCard {...kpis.compAlignment} />
    </KpiGrid>
  );
}
