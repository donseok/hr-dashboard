'use client';

import { useMemo } from 'react';
import { EChartsBase } from './echarts/EChartsBase';
import { ChartContainer } from './ChartContainer';
import { chartColorPalette } from '@hr-dashboard/design-tokens';
import type { EChartsOption } from 'echarts';

export interface FunnelStage {
  name: string;
  value: number;
  color?: string;
}

export interface FunnelChartProps {
  title: string;
  subtitle?: string;
  stages: FunnelStage[];
  height?: number;
  isLoading?: boolean;
  error?: string | null;
  showConversionRate?: boolean;
  onDataClick?: (stage: FunnelStage, index: number) => void;
  className?: string;
}

export function FunnelChart({
  title,
  subtitle,
  stages,
  height = 350,
  isLoading = false,
  error = null,
  showConversionRate = true,
  onDataClick,
  className,
}: FunnelChartProps) {
  const option = useMemo<EChartsOption>(() => {
    const maxValue = stages.length > 0 ? stages[0].value : 100;

    return {
      tooltip: {
        trigger: 'item',
        formatter: (params: any) => {
          const idx = stages.findIndex((s) => s.name === params.name);
          const rate = idx > 0
            ? `<br/>전환율: ${((stages[idx].value / stages[idx - 1].value) * 100).toFixed(1)}%`
            : '';
          return `${params.name}<br/>수: ${params.value.toLocaleString()}명${rate}`;
        },
      },
      legend: { show: false },
      series: [
        {
          type: 'funnel',
          left: '10%',
          top: 10,
          bottom: 10,
          width: '80%',
          min: 0,
          max: maxValue,
          minSize: '10%',
          maxSize: '100%',
          sort: 'descending',
          gap: 4,
          label: {
            show: true,
            position: 'inside',
            formatter: (params: any) => {
              const idx = stages.findIndex((s) => s.name === params.name);
              if (showConversionRate && idx > 0) {
                const rate = ((stages[idx].value / stages[idx - 1].value) * 100).toFixed(0);
                return `${params.name}\n${params.value.toLocaleString()} (${rate}%)`;
              }
              return `${params.name}\n${params.value.toLocaleString()}`;
            },
            fontSize: 12,
            color: '#fff',
            fontWeight: 500,
          },
          itemStyle: {
            borderColor: '#fff',
            borderWidth: 1,
          },
          emphasis: {
            label: { fontSize: 14 },
          },
          data: stages.map((stage, i) => ({
            name: stage.name,
            value: stage.value,
            itemStyle: { color: stage.color || chartColorPalette[i % chartColorPalette.length] },
          })),
        },
      ],
    };
  }, [stages, showConversionRate]);

  const events = useMemo(
    () =>
      onDataClick
        ? {
            click: (params: any) => {
              const idx = stages.findIndex((s) => s.name === params.name);
              if (idx >= 0) onDataClick(stages[idx], idx);
            },
          }
        : undefined,
    [onDataClick, stages],
  );

  return (
    <ChartContainer
      title={title}
      subtitle={subtitle}
      isLoading={isLoading}
      error={error}
      isEmpty={stages.length === 0}
      className={className}
    >
      <EChartsBase option={option} height={height} onEvents={events} />
    </ChartContainer>
  );
}
