'use client';

import { KpiCard } from '@/components/kpi/KpiCard';
import { KpiGrid } from '@/components/kpi/KpiGrid';
import { ChartContainer } from '@/components/charts/ChartContainer';
import { EChartsBase } from '@/components/charts/echarts/EChartsBase';
import { FilterPanel } from '@/components/filters/FilterPanel';
import { DateRangePicker } from '@/components/filters/DateRangePicker';
import { DepartmentSelect } from '@/components/filters/DepartmentSelect';
import { FilterChips } from '@/components/filters/FilterChips';
import { useFilterState } from '@/hooks/useFilterState';
import { KPI_TOOLTIPS, CHART_TOOLTIPS } from '@/constants/tooltips';

const mockKpis = [
  { title: '총 인원', value: '1,247', changePercent: 3.2, trend: 'up' as const, signal: 'positive' as const, sparklineData: [1180, 1195, 1200, 1210, 1225, 1230, 1240, 1247], unit: '명', tooltipKey: 'totalHeadcount' as const },
  { title: '이직률', value: '8.5', changePercent: -1.2, trend: 'down' as const, signal: 'positive' as const, sparklineData: [12, 11, 10.5, 9.8, 9.2, 8.8, 8.5], unit: '%', tooltipKey: 'turnoverRate' as const },
  { title: '채용 소요일', value: '32', changePercent: 5.1, trend: 'up' as const, signal: 'warning' as const, sparklineData: [28, 29, 30, 31, 33, 32, 32], unit: '일', tooltipKey: 'timeToHire' as const },
  { title: '직원 만족도', value: '4.2', changePercent: 0.3, trend: 'up' as const, signal: 'positive' as const, sparklineData: [3.8, 3.9, 4.0, 4.0, 4.1, 4.1, 4.2], unit: '/5.0', tooltipKey: 'satisfaction' as const },
];

const headcountChartOption = {
  tooltip: { trigger: 'axis' as const },
  grid: { left: '3%', right: '4%', bottom: '3%', containLabel: true },
  xAxis: {
    type: 'category' as const,
    data: ['1월', '2월', '3월', '4월', '5월', '6월', '7월', '8월', '9월', '10월', '11월', '12월'],
    axisLabel: { fontSize: 11, color: '#64748B' },
  },
  yAxis: {
    type: 'value' as const,
    axisLabel: { fontSize: 11, color: '#64748B' },
  },
  series: [
    {
      name: '입사',
      type: 'bar' as const,
      stack: 'total',
      data: [15, 12, 18, 20, 14, 16, 22, 19, 17, 21, 13, 25],
      itemStyle: { color: '#22C55E' },
      barWidth: '40%',
    },
    {
      name: '퇴사',
      type: 'bar' as const,
      stack: 'total',
      data: [-8, -10, -7, -9, -11, -6, -8, -12, -9, -7, -10, -8],
      itemStyle: { color: '#EF4444' },
    },
  ],
};

const trendChartOption = {
  tooltip: { trigger: 'axis' as const },
  grid: { left: '3%', right: '4%', bottom: '3%', containLabel: true },
  xAxis: {
    type: 'category' as const,
    data: ['Q1 \'24', 'Q2 \'24', 'Q3 \'24', 'Q4 \'24', 'Q1 \'25', 'Q2 \'25'],
    axisLabel: { fontSize: 11, color: '#64748B' },
  },
  yAxis: { type: 'value' as const, axisLabel: { fontSize: 11, color: '#64748B' } },
  series: [
    {
      name: '이직률',
      type: 'line' as const,
      data: [12, 11, 10.5, 9.8, 9.2, 8.5],
      smooth: true,
      lineStyle: { color: '#2563EB', width: 2 },
      itemStyle: { color: '#2563EB' },
      areaStyle: { color: { type: 'linear' as const, x: 0, y: 0, x2: 0, y2: 1, colorStops: [{ offset: 0, color: 'rgba(37,99,235,0.15)' }, { offset: 1, color: 'rgba(37,99,235,0)' }] } },
    },
    {
      name: '업계 평균',
      type: 'line' as const,
      data: [13, 12.5, 12, 11.8, 11.5, 11],
      smooth: true,
      lineStyle: { color: '#94A3B8', width: 1.5, type: 'dashed' as const },
      itemStyle: { color: '#94A3B8' },
    },
  ],
};

export default function OverviewPage() {
  const {
    dateRange,
    departments,
    setDateRange,
    setDepartments,
    activeFilters,
    removeFilter,
    resetFilters,
  } = useFilterState();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-neutral-900 dark:text-neutral-100">HR 개요</h1>
        <p className="text-sm text-neutral-500 dark:text-neutral-400 mt-1">조직 현황을 한눈에 파악하세요</p>
      </div>

      <FilterPanel onReset={resetFilters}>
        <DateRangePicker
          startDate={dateRange.start}
          endDate={dateRange.end}
          onChange={(s, e) => setDateRange(s, e)}
        />
        <DepartmentSelect value={departments} onChange={setDepartments} />
      </FilterPanel>

      <FilterChips
        filters={activeFilters}
        onRemove={removeFilter}
        onClearAll={resetFilters}
      />

      <KpiGrid columns={4}>
        {mockKpis.map(({ tooltipKey, ...kpi }) => (
          <KpiCard key={kpi.title} {...kpi} tooltip={KPI_TOOLTIPS[tooltipKey]} />
        ))}
      </KpiGrid>

      <div className="grid grid-cols-1 desktop:grid-cols-2 gap-6">
        <ChartContainer title="인력 변동 추이" subtitle="월별 입사/퇴사 현황" tooltip={CHART_TOOLTIPS.headcountTrend}>
          <EChartsBase option={headcountChartOption} height={300} />
        </ChartContainer>
        <ChartContainer title="이직률 트렌드" subtitle="분기별 이직률 vs 업계 평균" tooltip={CHART_TOOLTIPS.turnoverTrend}>
          <EChartsBase option={trendChartOption} height={300} />
        </ChartContainer>
      </div>
    </div>
  );
}
