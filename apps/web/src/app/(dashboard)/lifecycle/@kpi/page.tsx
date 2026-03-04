'use client';

import { KpiCard } from '@/components/kpi/KpiCard';
import { KpiGrid } from '@/components/kpi/KpiGrid';
import { lifecycleKpis } from '@/mocks/lifecycle';

export default function LifecycleKpiSlot() {
  const kpis = lifecycleKpis;

  return (
    <KpiGrid columns={4}>
      <KpiCard {...kpis.recruitment} />
      <KpiCard {...kpis.workforce} />
      <KpiCard {...kpis.performance} />
      <KpiCard {...kpis.culture} />
      <KpiCard {...kpis.development} />
      <KpiCard {...kpis.dei} />
      <KpiCard {...kpis.overall} />
    </KpiGrid>
  );
}
