'use client';

import { SankeyDiagram } from '@/components/charts/d3/SankeyDiagram';
import { CohortHeatmap } from '@/components/charts/d3/CohortHeatmap';
import { BubbleChart } from '@/components/charts/BubbleChart';
import { LineWithBandChart } from '@/components/charts/LineWithBandChart';
import { useDrilldown } from '@/hooks/useDrilldown';
import {
  lifecycleFlowNodes,
  lifecycleFlowLinks,
  cohortRetentionData,
  cohortPeriodLabels,
  moduleCorrelationData,
  integratedTrendData,
} from '@/mocks/lifecycle';

export default function LifecycleMainSlot() {
  const { drillDown } = useDrilldown();

  return (
    <div className="space-y-6">
      <SankeyDiagram
        title="인재 라이프사이클 흐름"
        subtitle="채용 → 성장 → 전환 → 이탈 경로"
        nodes={lifecycleFlowNodes}
        links={lifecycleFlowLinks}
        height={400}
      />

      <CohortHeatmap
        title="입사 기수별 잔존율"
        subtitle="코호트별 반기 잔존율 추적"
        data={cohortRetentionData}
        periodLabels={cohortPeriodLabels}
        height={360}
        valueFormatter={(v) => (v === 0 ? '-' : `${v}%`)}
      />

      <BubbleChart
        title="모듈간 상관관계"
        subtitle="HR 모듈 지표 간 교차 상관 분석"
        data={moduleCorrelationData}
        height={360}
        onDataClick={(point) =>
          drillDown('correlation', point.name, `${point.name} 상관 분석`)
        }
      />

      <LineWithBandChart
        title="통합 트렌드"
        subtitle="인재 유지율 · 전체 건강도 추이"
        series={integratedTrendData}
        height={300}
        yAxisLabel="%"
      />
    </div>
  );
}
