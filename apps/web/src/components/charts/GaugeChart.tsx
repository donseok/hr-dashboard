'use client';

import { useMemo } from 'react';
import { EChartsBase } from './echarts/EChartsBase';
import { ChartContainer } from './ChartContainer';
import { colors } from '@hr-dashboard/design-tokens';
import type { EChartsOption } from 'echarts';

export interface GaugeChartProps {
  title: string;
  subtitle?: string;
  value: number;
  min?: number;
  max?: number;
  unit?: string;
  thresholds?: { value: number; color: string }[];
  height?: number;
  isLoading?: boolean;
  error?: string | null;
  onDataClick?: (value: number) => void;
  className?: string;
}

export function GaugeChart({
  title,
  subtitle,
  value,
  min = 0,
  max = 100,
  unit = '%',
  thresholds,
  height = 280,
  isLoading = false,
  error = null,
  onDataClick,
  className,
}: GaugeChartProps) {
  const option = useMemo<EChartsOption>(() => {
    const defaultThresholds = [
      { value: max * 0.4, color: colors.signal.danger },
      { value: max * 0.7, color: colors.signal.warning },
      { value: max, color: colors.signal.success },
    ];
    const t = thresholds || defaultThresholds;
    const axisLineColors: [number, string][] = t.map((th) => [
      (th.value - min) / (max - min),
      th.color,
    ]);

    return {
      series: [
        {
          type: 'gauge',
          center: ['50%', '60%'],
          radius: '90%',
          min,
          max,
          startAngle: 200,
          endAngle: -20,
          progress: { show: true, width: 14 },
          pointer: {
            show: true,
            length: '55%',
            width: 5,
            itemStyle: { color: 'auto' },
          },
          axisLine: {
            lineStyle: {
              width: 14,
              color: axisLineColors,
            },
          },
          axisTick: { show: false },
          splitLine: {
            length: 8,
            lineStyle: { width: 2, color: colors.neutral[300] },
          },
          axisLabel: {
            distance: 20,
            color: colors.neutral[500],
            fontSize: 10,
          },
          anchor: {
            show: true,
            showAbove: true,
            size: 16,
            itemStyle: { borderWidth: 6, borderColor: 'auto' },
          },
          title: {
            show: true,
            offsetCenter: [0, '75%'],
            fontSize: 12,
            color: colors.neutral[500],
          },
          detail: {
            valueAnimation: true,
            fontSize: 28,
            fontWeight: 700,
            fontFamily: 'JetBrains Mono, monospace',
            offsetCenter: [0, '40%'],
            formatter: `{value}${unit}`,
            color: 'inherit',
          },
          data: [{ value, name: '' }],
        },
      ],
    };
  }, [value, min, max, unit, thresholds]);

  const events = useMemo(
    () => (onDataClick ? { click: () => onDataClick(value) } : undefined),
    [onDataClick, value],
  );

  return (
    <ChartContainer
      title={title}
      subtitle={subtitle}
      isLoading={isLoading}
      error={error}
      className={className}
    >
      <EChartsBase option={option} height={height} onEvents={events} />
    </ChartContainer>
  );
}
