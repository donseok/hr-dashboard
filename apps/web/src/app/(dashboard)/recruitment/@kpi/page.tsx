'use client';

import { KpiCard } from '@/components/kpi/KpiCard';
import { KpiGrid } from '@/components/kpi/KpiGrid';
import { recruitmentKpis } from '@/mocks/recruitment';

export default function RecruitmentKpiSlot() {
  const kpis = recruitmentKpis;

  return (
    <KpiGrid columns={4}>
      <KpiCard {...kpis.timeToHire} />
      <KpiCard {...kpis.conversionRate} />
      <KpiCard {...kpis.channelEfficiency} />
      <KpiCard {...kpis.offerAcceptRate} />
      <KpiCard {...kpis.costPerHire} />
      <KpiCard {...kpis.earlyTurnover} />
      <KpiCard {...kpis.pipeline} />
      <KpiCard {...kpis.diversity} />
    </KpiGrid>
  );
}
