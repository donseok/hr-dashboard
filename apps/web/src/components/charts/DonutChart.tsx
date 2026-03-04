'use client';

import { useMemo } from 'react';
import { EChartsBase } from './echarts/EChartsBase';
import { ChartContainer } from './ChartContainer';
import { chartColorPalette, colors } from '@hr-dashboard/design-tokens';
import type { EChartsOption } from 'echarts';

export interface DonutSegment {
  name: string;
  value: number;
  color?: string;
}

export interface DonutChartProps {
  title: string;
  subtitle?: string;
  data: DonutSegment[];
  centerLabel?: string;
  centerValue?: string;
  innerRadius?: string;
  outerRadius?: string;
  height?: number;
  isLoading?: boolean;
  error?: string | null;
  onDataClick?: (segment: DonutSegment, index: number) => void;
  className?: string;
}

export function DonutChart({
  title,
  subtitle,
  data,
  centerLabel,
  centerValue,
  innerRadius = '55%',
  outerRadius = '80%',
  height = 300,
  isLoading = false,
  error = null,
  onDataClick,
  className,
}: DonutChartProps) {
  const total = useMemo(() => data.reduce((s, d) => s + d.value, 0), [data]);

  const option = useMemo<EChartsOption>(() => ({
    tooltip: {
      trigger: 'item',
      formatter: (params: any) => {
        const pct = total > 0 ? ((params.value / total) * 100).toFixed(1) : '0';
        return `${params.name}<br/>${params.value.toLocaleString()} (${pct}%)`;
      },
    },
    legend: {
      orient: 'vertical',
      right: '5%',
      top: 'center',
      textStyle: { fontSize: 11, color: colors.neutral[600] },
      formatter: (name: string) => {
        const item = data.find((d) => d.name === name);
        if (!item || total === 0) return name;
        return `${name}  ${((item.value / total) * 100).toFixed(0)}%`;
      },
    },
    graphic: centerLabel || centerValue
      ? [
          {
            type: 'group',
            left: 'center',
            top: 'center',
            children: [
              ...(centerValue
                ? [{
                    type: 'text' as const,
                    style: {
                      text: centerValue,
                      fontSize: 24,
                      fontWeight: 700,
                      fontFamily: 'JetBrains Mono, monospace',
                      fill: colors.neutral[900],
                      textAlign: 'center' as const,
                      y: centerLabel ? -8 : 0,
                    },
                  }]
                : []),
              ...(centerLabel
                ? [{
                    type: 'text' as const,
                    style: {
                      text: centerLabel,
                      fontSize: 11,
                      fill: colors.neutral[500],
                      textAlign: 'center' as const,
                      y: centerValue ? 14 : 0,
                    },
                  }]
                : []),
            ],
          },
        ]
      : undefined,
    series: [
      {
        type: 'pie',
        radius: [innerRadius, outerRadius],
        center: ['40%', '50%'],
        avoidLabelOverlap: true,
        itemStyle: {
          borderColor: '#fff',
          borderWidth: 2,
          borderRadius: 4,
        },
        label: { show: false },
        emphasis: {
          label: { show: true, fontSize: 13, fontWeight: 600 },
          scaleSize: 8,
        },
        data: data.map((d, i) => ({
          name: d.name,
          value: d.value,
          itemStyle: { color: d.color || chartColorPalette[i % chartColorPalette.length] },
        })),
      },
    ],
  }), [data, total, centerLabel, centerValue, innerRadius, outerRadius]);

  const events = useMemo(
    () =>
      onDataClick
        ? {
            click: (params: any) => {
              const idx = data.findIndex((d) => d.name === params.name);
              if (idx >= 0) onDataClick(data[idx], idx);
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
