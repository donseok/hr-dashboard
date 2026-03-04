'use client';

import { GaugeChart } from '@/components/charts/GaugeChart';
import { LineWithBandChart } from '@/components/charts/LineWithBandChart';
import { RadarChart } from '@/components/charts/RadarChart';
import { HeatmapChart } from '@/components/charts/HeatmapChart';
import { WordCloud } from '@/components/charts/WordCloud';
import { useDrilldown } from '@/hooks/useDrilldown';
import {
  eNPSValue,
  engagementTrendData,
  cultureRadarIndicators,
  cultureRadarSeries,
  engagementHeatmapData,
  surveyKeywords,
} from '@/mocks/culture';

export default function CultureMainSlot() {
  const { drillDown } = useDrilldown();

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 tablet:grid-cols-2 gap-6">
        <GaugeChart
          title="eNPS 점수"
          subtitle="직원 순추천 지수"
          value={eNPSValue}
          min={-100}
          max={100}
          unit="점"
          thresholds={[
            { value: 0, color: '#EF4444' },
            { value: 20, color: '#F59E0B' },
            { value: 50, color: '#10B981' },
          ]}
          height={280}
        />
        <LineWithBandChart
          title="몰입도 분기별 트렌드"
          subtitle="95% 신뢰구간 포함"
          series={engagementTrendData}
          height={280}
          yAxisLabel="점수"
        />
      </div>

      <RadarChart
        title="문화 건강도 6차원"
        subtitle="현재 · 목표 · 업계 평균 비교"
        indicators={cultureRadarIndicators}
        series={cultureRadarSeries}
        height={360}
      />

      <HeatmapChart
        title="부서별 몰입도 히트맵"
        subtitle="부서 × 문화 차원 교차 분석"
        data={engagementHeatmapData.data}
        xLabels={engagementHeatmapData.xLabels}
        yLabels={engagementHeatmapData.yLabels}
        height={320}
        valueFormatter={(v) => v.toFixed(1)}
        onDataClick={(point, xLabel, yLabel) =>
          drillDown('culture-cell', `${yLabel}-${xLabel}`, `${yLabel} ${xLabel} 상세`)
        }
      />

      <WordCloud
        title="서베이 주요 키워드"
        subtitle="최근 분기 응답 기반"
        words={surveyKeywords}
        height={300}
        colorBySentiment
      />
    </div>
  );
}
