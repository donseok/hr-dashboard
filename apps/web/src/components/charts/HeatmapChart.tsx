'use client';

import { useMemo } from 'react';
import { EChartsBase } from './echarts/EChartsBase';
import { ChartContainer } from './ChartContainer';
import { colors } from '@hr-dashboard/design-tokens';
import type { EChartsOption } from 'echarts';

export interface HeatmapDataPoint {
  x: number;
  y: number;
  value: number;
}

export interface HeatmapChartProps {
  title: string;
  subtitle?: string;
  data: HeatmapDataPoint[];
  xLabels: string[];
  yLabels: string[];
  height?: number;
  isLoading?: boolean;
  error?: string | null;
  minColor?: string;
  maxColor?: string;
  valueFormatter?: (value: number) => string;
  onDataClick?: (point: HeatmapDataPoint, xLabel: string, yLabel: string) => void;
  className?: string;
}

export function HeatmapChart({
  title,
  subtitle,
  data,
  xLabels,
  yLabels,
  height = 350,
  isLoading = false,
  error = null,
  minColor = '#EFF6FF',
  maxColor = colors.primary.DEFAULT,
  valueFormatter = (v) => v.toFixed(1),
  onDataClick,
  className,
}: HeatmapChartProps) {
  const option = useMemo<EChartsOption>(() => {
    const values = data.map((d) => d.value);
    const min = Math.min(...values);
    const max = Math.max(...values);

    return {
      tooltip: {
        position: 'top',
        formatter: (params: any) => {
          const [x, y, val] = params.data;
          return `${yLabels[y]} / ${xLabels[x]}<br/><strong>${valueFormatter(val)}</strong>`;
        },
      },
      grid: {
        left: '15%',
        right: '10%',
        bottom: '15%',
        top: '5%',
      },
      xAxis: {
        type: 'category',
        data: xLabels,
        splitArea: { show: true },
        axisLabel: { fontSize: 10, color: colors.neutral[500], rotate: xLabels.length > 12 ? 45 : 0 },
      },
      yAxis: {
        type: 'category',
        data: yLabels,
        splitArea: { show: true },
        axisLabel: { fontSize: 11, color: colors.neutral[500] },
      },
      visualMap: {
        min,
        max,
        calculable: true,
        orient: 'horizontal',
        left: 'center',
        bottom: 0,
        inRange: {
          color: [minColor, maxColor],
        },
        textStyle: { fontSize: 10, color: colors.neutral[500] },
      },
      series: [
        {
          type: 'heatmap',
          data: data.map((d) => [d.x, d.y, d.value]),
          label: {
            show: data.length <= 100,
            fontSize: 10,
            formatter: (params: any) => valueFormatter(params.data[2]),
          },
          emphasis: {
            itemStyle: {
              shadowBlur: 10,
              shadowColor: 'rgba(0, 0, 0, 0.3)',
            },
          },
        },
      ],
    };
  }, [data, xLabels, yLabels, minColor, maxColor, valueFormatter]);

  const events = useMemo(
    () =>
      onDataClick
        ? {
            click: (params: any) => {
              const [x, y, value] = params.data;
              onDataClick({ x, y, value }, xLabels[x], yLabels[y]);
            },
          }
        : undefined,
    [onDataClick, xLabels, yLabels],
  );

  return (
    <ChartContainer
      title={title}
      subtitle={subtitle}
      isLoading={isLoading}
      error={error}
      isEmpty={data.length === 0}
      className={className}
    >
      <EChartsBase option={option} height={height} onEvents={events} />
    </ChartContainer>
  );
}
