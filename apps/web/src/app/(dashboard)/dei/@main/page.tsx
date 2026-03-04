'use client';

import { StackedBarChart } from '@/components/charts/StackedBarChart';
import { BubbleChart } from '@/components/charts/BubbleChart';
import { DonutChart } from '@/components/charts/DonutChart';
import { LineWithBandChart } from '@/components/charts/LineWithBandChart';
import { HeatmapChart } from '@/components/charts/HeatmapChart';
import { useDrilldown } from '@/hooks/useDrilldown';
import {
  genderByGradeData,
  payEquityBubbleData,
  ageDistributionData,
  deiTrendData,
  deiHeatmapData,
} from '@/mocks/dei';

export default function DeiMainSlot() {
  const { drillDown } = useDrilldown();

  return (
    <div className="space-y-6">
      <StackedBarChart
        title="직급별 성별 분포"
        subtitle="직급별 남성/여성 인원수"
        categories={genderByGradeData.categories}
        series={genderByGradeData.series}
        height={320}
        onDataClick={(category, seriesName) =>
          drillDown('gender-grade', `${category}-${seriesName}`, `${category} ${seriesName} 상세`)
        }
      />

      <div className="grid grid-cols-1 tablet:grid-cols-2 gap-6">
        <BubbleChart
          title="직급-급여 성별 비교"
          subtitle="버블 크기 = 인원수"
          data={payEquityBubbleData}
          height={320}
          xAxisLabel="직급"
          yAxisLabel="평균 급여(만원)"
          onDataClick={(point) =>
            drillDown('pay-equity', point.name, `${point.name} 급여 상세`)
          }
        />
        <DonutChart
          title="연령대별 구성"
          subtitle="전사 연령 분포"
          data={ageDistributionData}
          centerLabel="전체"
          centerValue="1,247명"
          height={320}
          onDataClick={(segment) =>
            drillDown('age-group', segment.name, `${segment.name} 상세`)
          }
        />
      </div>

      <LineWithBandChart
        title="DEI 지표 트렌드"
        subtitle="분기별 여성 비율 · 급여 형평성 추이"
        series={deiTrendData}
        height={300}
        yAxisLabel="%"
      />

      <HeatmapChart
        title="부서별 다양성 히트맵"
        subtitle="부서 × DEI 차원 교차 분석"
        data={deiHeatmapData.data}
        xLabels={deiHeatmapData.xLabels}
        yLabels={deiHeatmapData.yLabels}
        height={320}
        valueFormatter={(v) => (v < 10 ? v.toFixed(1) : `${Math.round(v)}`)}
        onDataClick={(point, xLabel, yLabel) =>
          drillDown('dei-cell', `${yLabel}-${xLabel}`, `${yLabel} ${xLabel} 상세`)
        }
      />
    </div>
  );
}
