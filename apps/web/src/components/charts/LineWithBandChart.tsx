'use client';

import { useMemo } from 'react';
import { EChartsBase } from './echarts/EChartsBase';
import { ChartContainer } from './ChartContainer';
import { colors } from '@hr-dashboard/design-tokens';
import type { EChartsOption } from 'echarts';

export interface LineWithBandDataPoint {
  date: string;
  value: number;
  upper: number;
  lower: number;
}

export interface LineWithBandSeries {
  name: string;
  data: LineWithBandDataPoint[];
  color?: string;
}

export interface LineWithBandChartProps {
  title: string;
  subtitle?: string;
  series: LineWithBandSeries[];
  referenceLine?: { name: string; value: number; color?: string };
  height?: number;
  isLoading?: boolean;
  error?: string | null;
  yAxisLabel?: string;
  onDataClick?: (point: LineWithBandDataPoint, seriesName: string) => void;
  className?: string;
}

export function LineWithBandChart({
  title,
  subtitle,
  series,
  referenceLine,
  height = 350,
  isLoading = false,
  error = null,
  yAxisLabel,
  onDataClick,
  className,
}: LineWithBandChartProps) {
  const option = useMemo<EChartsOption>(() => {
    const dates = series[0]?.data.map((d) => d.date) || [];
    const allSeries: any[] = [];

    series.forEach((s, i) => {
      const lineColor = s.color || colors.primary.DEFAULT;

      // Lower band (invisible, acts as base)
      allSeries.push({
        name: `${s.name}_lower`,
        type: 'line',
        data: s.data.map((d) => d.lower),
        lineStyle: { opacity: 0 },
        stack: `band_${i}`,
        symbol: 'none',
        silent: true,
      });

      // Band area (upper - lower)
      allSeries.push({
        name: `${s.name}_band`,
        type: 'line',
        data: s.data.map((d) => d.upper - d.lower),
        lineStyle: { opacity: 0 },
        areaStyle: { color: lineColor, opacity: 0.12 },
        stack: `band_${i}`,
        symbol: 'none',
        silent: true,
      });

      // Main line
      allSeries.push({
        name: s.name,
        type: 'line',
        data: s.data.map((d) => d.value),
        smooth: true,
        lineStyle: { color: lineColor, width: 2.5 },
        itemStyle: { color: lineColor },
        symbol: 'circle',
        symbolSize: 6,
        showSymbol: false,
        emphasis: { showSymbol: true, itemStyle: { borderWidth: 2 } },
      });
    });

    if (referenceLine) {
      allSeries.push({
        name: referenceLine.name,
        type: 'line',
        data: dates.map(() => referenceLine.value),
        lineStyle: {
          color: referenceLine.color || colors.neutral[400],
          type: 'dashed',
          width: 1.5,
        },
        symbol: 'none',
        silent: true,
      });
    }

    return {
      tooltip: {
        trigger: 'axis',
        formatter: (params: any) => {
          const items = params.filter(
            (p: any) => !p.seriesName.endsWith('_lower') && !p.seriesName.endsWith('_band'),
          );
          let html = `<strong>${params[0].axisValue}</strong><br/>`;
          items.forEach((item: any) => {
            html += `<span style="display:inline-block;margin-right:4px;border-radius:50%;width:8px;height:8px;background:${item.color}"></span>${item.seriesName}: ${typeof item.value === 'number' ? item.value.toFixed(1) : item.value}<br/>`;
          });
          return html;
        },
      },
      legend: {
        data: [...series.map((s) => s.name), ...(referenceLine ? [referenceLine.name] : [])],
        bottom: 0,
        textStyle: { fontSize: 11, color: colors.neutral[500] },
      },
      grid: { left: '3%', right: '4%', bottom: '12%', top: '5%', containLabel: true },
      xAxis: {
        type: 'category',
        data: dates,
        axisLabel: { fontSize: 11, color: colors.neutral[500] },
        axisLine: { lineStyle: { color: colors.neutral[200] } },
      },
      yAxis: {
        type: 'value',
        name: yAxisLabel,
        nameTextStyle: { fontSize: 11, color: colors.neutral[400] },
        axisLabel: { fontSize: 11, color: colors.neutral[500] },
        splitLine: { lineStyle: { color: colors.neutral[100] } },
      },
      series: allSeries,
    };
  }, [series, referenceLine, yAxisLabel]);

  const events = useMemo(
    () =>
      onDataClick
        ? {
            click: (params: any) => {
              if (params.seriesName.endsWith('_lower') || params.seriesName.endsWith('_band')) return;
              const s = series.find((s) => s.name === params.seriesName);
              if (s && s.data[params.dataIndex]) {
                onDataClick(s.data[params.dataIndex], params.seriesName);
              }
            },
          }
        : undefined,
    [onDataClick, series],
  );

  return (
    <ChartContainer
      title={title}
      subtitle={subtitle}
      isLoading={isLoading}
      error={error}
      isEmpty={series.length === 0 || series[0]?.data.length === 0}
      className={className}
    >
      <EChartsBase option={option} height={height} onEvents={events} />
    </ChartContainer>
  );
}
