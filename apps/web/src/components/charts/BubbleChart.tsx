'use client';

import { useMemo } from 'react';
import { EChartsBase } from './echarts/EChartsBase';
import { ChartContainer } from './ChartContainer';
import { chartColorPalette, colors } from '@hr-dashboard/design-tokens';
import type { EChartsOption } from 'echarts';

export interface BubbleDataPoint {
  x: number;
  y: number;
  size: number;
  name: string;
  group?: string;
}

export interface BubbleChartProps {
  title: string;
  subtitle?: string;
  data: BubbleDataPoint[];
  xAxisLabel?: string;
  yAxisLabel?: string;
  sizeLabel?: string;
  height?: number;
  isLoading?: boolean;
  error?: string | null;
  quadrants?: { labels: [string, string, string, string] };
  onDataClick?: (point: BubbleDataPoint) => void;
  className?: string;
}

export function BubbleChart({
  title,
  subtitle,
  data,
  xAxisLabel = 'X',
  yAxisLabel = 'Y',
  sizeLabel = '크기',
  height = 400,
  isLoading = false,
  error = null,
  quadrants,
  onDataClick,
  className,
}: BubbleChartProps) {
  const option = useMemo<EChartsOption>(() => {
    const groups = [...new Set(data.map((d) => d.group || 'default'))];
    const sizeMax = Math.max(...data.map((d) => d.size), 1);
    const xValues = data.map((d) => d.x);
    const yValues = data.map((d) => d.y);
    const xMin = Math.min(...xValues);
    const xMax = Math.max(...xValues);
    const yMin = Math.min(...yValues);
    const yMax = Math.max(...yValues);
    const xMid = (xMin + xMax) / 2;
    const yMid = (yMin + yMax) / 2;

    const markLines: any[] = [];
    if (quadrants) {
      markLines.push(
        { xAxis: xMid, lineStyle: { color: colors.neutral[200], type: 'dashed' } },
        { yAxis: yMid, lineStyle: { color: colors.neutral[200], type: 'dashed' } },
      );
    }

    return {
      tooltip: {
        formatter: (params: any) => {
          const d = params.data;
          return `<strong>${d[3]}</strong><br/>${xAxisLabel}: ${d[0]}<br/>${yAxisLabel}: ${d[1]}<br/>${sizeLabel}: ${d[2]}`;
        },
      },
      legend: groups.length > 1
        ? { data: groups, bottom: 0, textStyle: { fontSize: 11, color: colors.neutral[500] } }
        : undefined,
      grid: { left: '8%', right: '5%', bottom: groups.length > 1 ? '12%' : '8%', top: quadrants ? '8%' : '5%', containLabel: true },
      xAxis: {
        name: xAxisLabel,
        nameLocation: 'center',
        nameGap: 30,
        nameTextStyle: { fontSize: 11, color: colors.neutral[500] },
        axisLabel: { fontSize: 10, color: colors.neutral[500] },
        splitLine: { lineStyle: { color: colors.neutral[100] } },
      },
      yAxis: {
        name: yAxisLabel,
        nameLocation: 'center',
        nameGap: 40,
        nameTextStyle: { fontSize: 11, color: colors.neutral[500] },
        axisLabel: { fontSize: 10, color: colors.neutral[500] },
        splitLine: { lineStyle: { color: colors.neutral[100] } },
      },
      series: groups.map((group, gi) => ({
        name: group === 'default' ? title : group,
        type: 'scatter',
        symbolSize: (val: number[]) => Math.max(8, (val[2] / sizeMax) * 50),
        data: data
          .filter((d) => (d.group || 'default') === group)
          .map((d) => [d.x, d.y, d.size, d.name]),
        itemStyle: {
          color: chartColorPalette[gi % chartColorPalette.length],
          opacity: 0.75,
        },
        emphasis: {
          itemStyle: { opacity: 1, borderColor: '#fff', borderWidth: 2, shadowBlur: 10, shadowColor: 'rgba(0,0,0,0.2)' },
          label: { show: true, formatter: (p: any) => p.data[3], position: 'top', fontSize: 11 },
        },
        markLine: gi === 0 && quadrants ? { silent: true, data: markLines } : undefined,
      })),
      ...(quadrants
        ? {
            graphic: quadrants.labels.map((label, i) => ({
              type: 'text',
              left: i % 2 === 1 ? '75%' : '25%',
              top: i < 2 ? '8%' : '85%',
              style: { text: label, fontSize: 10, fill: colors.neutral[300], textAlign: 'center' },
            })),
          }
        : {}),
    };
  }, [data, xAxisLabel, yAxisLabel, sizeLabel, quadrants, title]);

  const events = useMemo(
    () =>
      onDataClick
        ? {
            click: (params: any) => {
              const [x, y, size, name] = params.data;
              const point = data.find((d) => d.name === name && d.x === x && d.y === y);
              if (point) onDataClick(point);
            },
          }
        : undefined,
    [onDataClick, data],
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
