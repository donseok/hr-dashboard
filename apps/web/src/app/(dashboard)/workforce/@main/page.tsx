'use client';

import { TreemapChart } from '@/components/charts/TreemapChart';
import { WaterfallChart } from '@/components/charts/WaterfallChart';
import { StackedBarChart } from '@/components/charts/StackedBarChart';
import { LineWithBandChart } from '@/components/charts/LineWithBandChart';
import { SankeyDiagram } from '@/components/charts/d3/SankeyDiagram';
import { useDrilldown } from '@/hooks/useDrilldown';
import {
  orgTreemapData,
  headcountWaterfallData,
  positionCompositionData,
  turnoverTrendData,
  talentFlowNodes,
  talentFlowLinks,
} from '@/mocks/workforce';

export default function WorkforceMainSlot() {
  const { drillDown } = useDrilldown();

  return (
    <div className="space-y-6">
      <TreemapChart
        title="조직 인력 구조"
        subtitle="본부 · 팀 단위 인력 분포"
        data={orgTreemapData}
        height={380}
        onDataClick={(node, path) =>
          drillDown('org-unit', path.join('/'), `${node.name} 상세`)
        }
      />

      <WaterfallChart
        title="분기별 인원 변동"
        subtitle="입/퇴사 및 내부 이동 포함"
        data={headcountWaterfallData}
        height={320}
        onDataClick={(item) =>
          drillDown('headcount-change', item.name, `${item.name} 상세`)
        }
      />

      <div className="grid grid-cols-1 tablet:grid-cols-2 gap-6">
        <StackedBarChart
          title="직급별 인력 구성"
          subtitle="본부별 직급 분포"
          categories={positionCompositionData.categories}
          series={positionCompositionData.series}
          height={320}
          onDataClick={(category, seriesName) =>
            drillDown('position-grade', `${category}-${seriesName}`, `${category} ${seriesName} 상세`)
          }
        />
        <LineWithBandChart
          title="이직률 트렌드"
          subtitle="95% 신뢰구간 포함"
          series={turnoverTrendData}
          referenceLine={{ name: '목표', value: 10.0, color: '#22C55E' }}
          height={320}
          yAxisLabel="%"
        />
      </div>

      <SankeyDiagram
        title="부서간 인재 이동"
        subtitle="최근 분기 내부 전환 현황"
        nodes={talentFlowNodes}
        links={talentFlowLinks}
        height={380}
        onDataClick={(type, data) => {
          if (type === 'node') {
            drillDown('dept-flow', (data as any).id, `${(data as any).name} 이동 상세`);
          }
        }}
      />
    </div>
  );
}
