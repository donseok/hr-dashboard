'use client';

import { KpiCard } from '@/components/kpi/KpiCard';
import { KpiGrid } from '@/components/kpi/KpiGrid';
import { workforceKpis } from '@/mocks/workforce';

export default function WorkforceKpiSlot() {
  const kpis = workforceKpis;

  return (
    <KpiGrid columns={3}>
      <KpiCard {...kpis.turnoverRate} />
      <KpiCard {...kpis.keyTalentRetention} />
      <KpiCard {...kpis.fillDays} />
      <KpiCard {...kpis.revenuePerHead} />
      <KpiCard {...kpis.laborCostRatio} />
    </KpiGrid>
  );
}
