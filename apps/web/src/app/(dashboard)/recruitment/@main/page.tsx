'use client';

import { FunnelChart } from '@/components/charts/FunnelChart';
import { DonutChart } from '@/components/charts/DonutChart';
import { LineWithBandChart } from '@/components/charts/LineWithBandChart';
import { HeatmapChart } from '@/components/charts/HeatmapChart';
import { GanttChart } from '@/components/charts/GanttChart';
import { useDrilldown } from '@/hooks/useDrilldown';
import {
  recruitmentFunnelData,
  recruitmentChannelData,
  timeToHireTrendData,
  recruitmentHeatmapData,
  recruitmentGanttData,
} from '@/mocks/recruitment';

export default function RecruitmentMainSlot() {
  const { drillDown } = useDrilldown();

  return (
    <div className="space-y-6">
      <FunnelChart
        title="채용 퍼널"
        subtitle="지원 → 입사 전환 현황"
        stages={recruitmentFunnelData}
        height={320}
        showConversionRate
        onDataClick={(stage) =>
          drillDown('funnel-stage', stage.name, `${stage.name} 단계 상세`)
        }
      />

      <div className="grid grid-cols-1 tablet:grid-cols-2 gap-6">
        <DonutChart
          title="채용 채널 비율"
          subtitle="채널별 지원자 분포"
          data={recruitmentChannelData}
          centerLabel="전체 지원"
          centerValue="2,450"
          height={280}
          onDataClick={(segment) =>
            drillDown('channel', segment.name, `${segment.name} 채널 상세`)
          }
        />
        <LineWithBandChart
          title="채용 소요일 트렌드"
          subtitle="95% 신뢰구간 포함"
          series={timeToHireTrendData}
          referenceLine={{ name: '업계 평균', value: 28, color: '#94A3B8' }}
          height={280}
          yAxisLabel="일"
        />
      </div>

      <HeatmapChart
        title="월별 · 부서별 채용 현황"
        subtitle="부서/월 교차 채용 건수"
        data={recruitmentHeatmapData.data}
        xLabels={recruitmentHeatmapData.xLabels}
        yLabels={recruitmentHeatmapData.yLabels}
        height={320}
        valueFormatter={(v) => `${Math.round(v)}건`}
        onDataClick={(point, xLabel, yLabel) =>
          drillDown('heatmap-cell', `${yLabel}-${xLabel}`, `${yLabel} ${xLabel} 채용 상세`)
        }
      />

      <GanttChart
        title="진행 중인 채용 타임라인"
        subtitle="현재 오픈 포지션"
        tasks={recruitmentGanttData}
        onDataClick={(task) =>
          drillDown('position', task.id, `${task.name} 상세`)
        }
      />
    </div>
  );
}
