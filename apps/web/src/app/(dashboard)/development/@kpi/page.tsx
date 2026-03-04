'use client';

import { KpiCard } from '@/components/kpi/KpiCard';
import { KpiGrid } from '@/components/kpi/KpiGrid';
import { developmentKpis } from '@/mocks/development';

export default function DevelopmentKpiSlot() {
  const kpis = developmentKpis;

  return (
    <KpiGrid columns={4}>
      <KpiCard {...kpis.learningParticipation} />
      <KpiCard {...kpis.trainingHoursPerHead} />
      <KpiCard {...kpis.internalMobility} />
      <KpiCard {...kpis.leadershipPipeline} />
    </KpiGrid>
  );
}
