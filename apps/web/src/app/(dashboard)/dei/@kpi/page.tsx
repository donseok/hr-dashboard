'use client';

import { KpiCard } from '@/components/kpi/KpiCard';
import { KpiGrid } from '@/components/kpi/KpiGrid';
import { deiKpis } from '@/mocks/dei';

export default function DeiKpiSlot() {
  const kpis = deiKpis;

  return (
    <KpiGrid columns={4}>
      <KpiCard {...kpis.genderDiversity} />
      <KpiCard {...kpis.disabilityRate} />
      <KpiCard {...kpis.payEquity} />
      <KpiCard {...kpis.inclusionScore} />
    </KpiGrid>
  );
}
