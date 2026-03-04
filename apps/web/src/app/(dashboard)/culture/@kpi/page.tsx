'use client';

import { KpiCard } from '@/components/kpi/KpiCard';
import { KpiGrid } from '@/components/kpi/KpiGrid';
import { cultureKpis } from '@/mocks/culture';

export default function CultureKpiSlot() {
  const kpis = cultureKpis;

  return (
    <KpiGrid columns={4}>
      <KpiCard {...kpis.engagement} />
      <KpiCard {...kpis.eNPS} />
      <KpiCard {...kpis.cultureHealth} />
      <KpiCard {...kpis.surveyParticipation} />
    </KpiGrid>
  );
}
