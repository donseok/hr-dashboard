'use client';

import { StackedBarChart } from '@/components/charts/StackedBarChart';
import { LineWithBandChart } from '@/components/charts/LineWithBandChart';
import { RadarChart } from '@/components/charts/RadarChart';
import { InteractiveTimeline } from '@/components/charts/d3/InteractiveTimeline';
import { DonutChart } from '@/components/charts/DonutChart';
import { useDrilldown } from '@/hooks/useDrilldown';
import {
  trainingCategoryData,
  trainingHoursTrendData,
  teamCompetencyIndicators,
  teamCompetencySeries,
  growthJourneyEvents,
  trainingTypeData,
} from '@/mocks/development';

export default function DevelopmentMainSlot() {
  const { drillDown } = useDrilldown();

  return (
    <div className="space-y-6">
      <StackedBarChart
        title="부서별 교육 참여 현황"
        subtitle="카테고리별 참여 시간(시간)"
        categories={trainingCategoryData.categories}
        series={trainingCategoryData.series}
        height={320}
        onDataClick={(category, seriesName) =>
          drillDown('training-category', `${category}-${seriesName}`, `${category} ${seriesName} 상세`)
        }
      />

      <div className="grid grid-cols-1 tablet:grid-cols-2 gap-6">
        <LineWithBandChart
          title="월별 1인당 교육시간 트렌드"
          subtitle="95% 신뢰구간 포함"
          series={trainingHoursTrendData}
          height={280}
          yAxisLabel="시간"
        />
        <DonutChart
          title="교육 유형별 비율"
          subtitle="전체 교육시간 기준"
          data={trainingTypeData}
          centerLabel="전체"
          centerValue="9,870h"
          height={280}
          onDataClick={(segment) =>
            drillDown('training-type', segment.name, `${segment.name} 상세`)
          }
        />
      </div>

      <RadarChart
        title="팀별 역량 프로파일"
        subtitle="6대 핵심 역량 비교"
        indicators={teamCompetencyIndicators}
        series={teamCompetencySeries}
        height={360}
      />

      <InteractiveTimeline
        title="성장 여정 타임라인"
        subtitle="주요 교육 및 이동 이벤트"
        events={growthJourneyEvents}
        height={280}
      />
    </div>
  );
}
