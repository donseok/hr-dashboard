'use client';

import { NineBoxGrid } from '@/components/charts/d3/NineBoxGrid';
import { StackedBarChart } from '@/components/charts/StackedBarChart';
import { RadarChart } from '@/components/charts/RadarChart';
import { BubbleChart } from '@/components/charts/BubbleChart';
import { useDrilldown } from '@/hooks/useDrilldown';
import {
  nineBoxData,
  gradeDistributionData,
  competencyRadarIndicators,
  competencyRadarSeries,
  perfPotentialBubbleData,
} from '@/mocks/performance';

export default function PerformanceMainSlot() {
  const { drillDown } = useDrilldown();

  return (
    <div className="space-y-6">
      <NineBoxGrid
        title="9-Box Grid"
        subtitle="성과 vs 잠재력 인재 매트릭스"
        employees={nineBoxData}
        height={420}
        onDataClick={(employee) =>
          drillDown('nine-box', `${employee.performance}-${employee.potential}`, `9-Box 셀 상세`)
        }
      />

      <StackedBarChart
        title="성과 등급 분포"
        subtitle="본부별 S~D 등급 분포"
        categories={gradeDistributionData.categories}
        series={gradeDistributionData.series}
        height={320}
        showPercentage
        onDataClick={(category, seriesName) =>
          drillDown('grade', `${category}-${seriesName}`, `${category} ${seriesName} 상세`)
        }
      />

      <div className="grid grid-cols-1 tablet:grid-cols-2 gap-6">
        <RadarChart
          title="역량 평가 비교"
          subtitle="본부별 6대 역량 비교"
          indicators={competencyRadarIndicators}
          series={competencyRadarSeries}
          height={320}
          shape="polygon"
        />
        <BubbleChart
          title="팀별 성과-잠재력 분포"
          subtitle="버블 크기 = 팀 인원수"
          data={perfPotentialBubbleData}
          xAxisLabel="성과 점수"
          yAxisLabel="잠재력 점수"
          sizeLabel="인원"
          height={320}
          quadrants={{
            labels: ['높은 잠재력 · 낮은 성과', '높은 잠재력 · 높은 성과', '낮은 잠재력 · 낮은 성과', '낮은 잠재력 · 높은 성과'],
          }}
          onDataClick={(point) =>
            drillDown('team-perf', point.name, `${point.name} 상세`)
          }
        />
      </div>
    </div>
  );
}
