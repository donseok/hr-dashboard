'use client';

import { useMemo } from 'react';
import { EChartsBase } from './echarts/EChartsBase';
import { ChartContainer } from './ChartContainer';
import { chartColorPalette, colors } from '@hr-dashboard/design-tokens';
import type { EChartsOption } from 'echarts';

export interface RadarIndicator {
  name: string;
  max: number;
}

export interface RadarSeries {
  name: string;
  values: number[];
  color?: string;
}

export interface RadarChartProps {
  title: string;
  subtitle?: string;
  indicators: RadarIndicator[];
  series: RadarSeries[];
  height?: number;
  isLoading?: boolean;
  error?: string | null;
  shape?: 'polygon' | 'circle';
  onDataClick?: (seriesName: string, indicatorName: string, value: number) => void;
  className?: string;
}

export function RadarChart({
  title,
  subtitle,
  indicators,
  series,
  height = 350,
  isLoading = false,
  error = null,
  shape = 'polygon',
  onDataClick,
  className,
}: RadarChartProps) {
  const option = useMemo<EChartsOption>(() => ({
    tooltip: {
      trigger: 'item',
      formatter: (params: any) => {
        const vals = params.value as number[];
        let html = `<strong>${params.seriesName}</strong><br/>`;
        indicators.forEach((ind, i) => {
          html += `${ind.name}: ${vals[i]}/${ind.max}<br/>`;
        });
        return html;
      },
    },
    legend: {
      data: series.map((s) => s.name),
      bottom: 0,
      textStyle: { fontSize: 11, color: colors.neutral[500] },
    },
    radar: {
      indicator: indicators.map((ind) => ({
        name: ind.name,
        max: ind.max,
      })),
      shape,
      splitNumber: 4,
      axisName: {
        color: colors.neutral[600],
        fontSize: 11,
      },
      splitArea: {
        areaStyle: {
          color: ['rgba(37,99,235,0.02)', 'rgba(37,99,235,0.04)', 'rgba(37,99,235,0.06)', 'rgba(37,99,235,0.08)'],
        },
      },
      splitLine: { lineStyle: { color: colors.neutral[200] } },
      axisLine: { lineStyle: { color: colors.neutral[200] } },
    },
    series: [
      {
        type: 'radar',
        data: series.map((s, i) => {
          const c = s.color || chartColorPalette[i % chartColorPalette.length];
          return {
            name: s.name,
            value: s.values,
            symbol: 'circle',
            symbolSize: 6,
            lineStyle: { color: c, width: 2 },
            areaStyle: { color: c, opacity: 0.15 },
            itemStyle: { color: c },
          };
        }),
      },
    ],
  }), [indicators, series, shape]);

  const events = useMemo(
    () =>
      onDataClick
        ? {
            click: (params: any) => {
              if (params.value) {
                const idx = params.dataIndex || 0;
                onDataClick(params.seriesName, indicators[idx]?.name || '', params.value[idx] || 0);
              }
            },
          }
        : undefined,
    [onDataClick, indicators],
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
