'use client';

import { useMemo } from 'react';
import { EChartsBase } from './echarts/EChartsBase';
import { ChartContainer } from './ChartContainer';
import { chartColorPalette, colors } from '@hr-dashboard/design-tokens';
import type { EChartsOption } from 'echarts';

export interface StackedBarSeries {
  name: string;
  data: number[];
  color?: string;
}

export interface StackedBarChartProps {
  title: string;
  subtitle?: string;
  categories: string[];
  series: StackedBarSeries[];
  horizontal?: boolean;
  showPercentage?: boolean;
  height?: number;
  isLoading?: boolean;
  error?: string | null;
  onDataClick?: (category: string, seriesName: string, value: number) => void;
  className?: string;
}

export function StackedBarChart({
  title,
  subtitle,
  categories,
  series,
  horizontal = false,
  showPercentage = false,
  height = 350,
  isLoading = false,
  error = null,
  onDataClick,
  className,
}: StackedBarChartProps) {
  const option = useMemo<EChartsOption>(() => {
    const categoryAxis: any = {
      type: 'category',
      data: categories,
      axisLabel: { fontSize: 11, color: colors.neutral[500] },
      axisLine: { lineStyle: { color: colors.neutral[200] } },
    };
    const valueAxis: any = {
      type: 'value',
      axisLabel: {
        fontSize: 11,
        color: colors.neutral[500],
        formatter: showPercentage ? '{value}%' : undefined,
      },
      splitLine: { lineStyle: { color: colors.neutral[100] } },
      max: showPercentage ? 100 : undefined,
    };

    let processedSeries = series;
    if (showPercentage) {
      const totals = categories.map((_, ci) =>
        series.reduce((sum, s) => sum + (s.data[ci] || 0), 0),
      );
      processedSeries = series.map((s) => ({
        ...s,
        data: s.data.map((v, i) => (totals[i] > 0 ? (v / totals[i]) * 100 : 0)),
      }));
    }

    return {
      tooltip: {
        trigger: 'axis',
        axisPointer: { type: 'shadow' },
        formatter: (params: any) => {
          let html = `<strong>${params[0].axisValue}</strong><br/>`;
          params.forEach((p: any) => {
            const origSeries = series.find((s) => s.name === p.seriesName);
            const origVal = origSeries?.data[p.dataIndex] ?? p.value;
            html += `<span style="display:inline-block;margin-right:4px;border-radius:50%;width:8px;height:8px;background:${p.color}"></span>${p.seriesName}: ${showPercentage ? `${p.value.toFixed(1)}% (${origVal})` : origVal.toLocaleString()}<br/>`;
          });
          return html;
        },
      },
      legend: {
        data: series.map((s) => s.name),
        bottom: 0,
        textStyle: { fontSize: 11, color: colors.neutral[500] },
      },
      grid: { left: '3%', right: '4%', bottom: '12%', top: '5%', containLabel: true },
      xAxis: horizontal ? valueAxis : categoryAxis,
      yAxis: horizontal ? categoryAxis : valueAxis,
      series: processedSeries.map((s, i) => ({
        name: s.name,
        type: 'bar',
        stack: 'total',
        data: s.data,
        barWidth: '50%',
        itemStyle: {
          color: s.color || chartColorPalette[i % chartColorPalette.length],
          borderRadius: i === processedSeries.length - 1 ? [2, 2, 0, 0] : 0,
        },
        emphasis: { focus: 'series' },
      })),
    };
  }, [categories, series, horizontal, showPercentage]);

  const events = useMemo(
    () =>
      onDataClick
        ? {
            click: (params: any) => {
              onDataClick(categories[params.dataIndex], params.seriesName, params.value);
            },
          }
        : undefined,
    [onDataClick, categories],
  );

  return (
    <ChartContainer
      title={title}
      subtitle={subtitle}
      isLoading={isLoading}
      error={error}
      isEmpty={series.length === 0}
      className={className}
    >
      <EChartsBase option={option} height={height} onEvents={events} />
    </ChartContainer>
  );
}
