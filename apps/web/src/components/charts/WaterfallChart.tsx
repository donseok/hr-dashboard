'use client';

import { useMemo } from 'react';
import { EChartsBase } from './echarts/EChartsBase';
import { ChartContainer } from './ChartContainer';
import { colors } from '@hr-dashboard/design-tokens';
import type { EChartsOption } from 'echarts';

export interface WaterfallItem {
  name: string;
  value: number;
  type?: 'increase' | 'decrease' | 'total';
}

export interface WaterfallChartProps {
  title: string;
  subtitle?: string;
  data: WaterfallItem[];
  height?: number;
  isLoading?: boolean;
  error?: string | null;
  increaseColor?: string;
  decreaseColor?: string;
  totalColor?: string;
  onDataClick?: (item: WaterfallItem, index: number) => void;
  className?: string;
}

export function WaterfallChart({
  title,
  subtitle,
  data,
  height = 350,
  isLoading = false,
  error = null,
  increaseColor = colors.signal.success,
  decreaseColor = colors.signal.danger,
  totalColor = colors.primary.DEFAULT,
  onDataClick,
  className,
}: WaterfallChartProps) {
  const option = useMemo<EChartsOption>(() => {
    const categories = data.map((d) => d.name);
    const invisibleData: (number | string)[] = [];
    const increaseData: (number | string)[] = [];
    const decreaseData: (number | string)[] = [];
    const totalData: (number | string)[] = [];

    let runningTotal = 0;

    data.forEach((item) => {
      if (item.type === 'total') {
        invisibleData.push(0);
        increaseData.push('-');
        decreaseData.push('-');
        totalData.push(item.value);
        runningTotal = item.value;
      } else if (item.value >= 0) {
        invisibleData.push(runningTotal);
        increaseData.push(item.value);
        decreaseData.push('-');
        totalData.push('-');
        runningTotal += item.value;
      } else {
        runningTotal += item.value;
        invisibleData.push(runningTotal);
        increaseData.push('-');
        decreaseData.push(Math.abs(item.value));
        totalData.push('-');
      }
    });

    return {
      tooltip: {
        trigger: 'axis',
        axisPointer: { type: 'shadow' },
        formatter: (params: any) => {
          const nonEmpty = params.filter((p: any) => p.value !== '-' && p.seriesName !== 'base');
          if (nonEmpty.length === 0) return '';
          const item = nonEmpty[0];
          const d = data[item.dataIndex];
          const sign = d.value >= 0 ? '+' : '';
          return `${d.name}<br/>${d.type === 'total' ? '합계' : '변동'}: <strong>${sign}${d.value.toLocaleString()}명</strong>`;
        },
      },
      grid: { left: '3%', right: '4%', bottom: '5%', top: '5%', containLabel: true },
      xAxis: {
        type: 'category',
        data: categories,
        axisLabel: { fontSize: 11, color: colors.neutral[500] },
        axisLine: { lineStyle: { color: colors.neutral[200] } },
      },
      yAxis: {
        type: 'value',
        axisLabel: { fontSize: 11, color: colors.neutral[500] },
        splitLine: { lineStyle: { color: colors.neutral[100] } },
      },
      series: [
        {
          name: 'base',
          type: 'bar',
          stack: 'waterfall',
          itemStyle: { borderColor: 'transparent', color: 'transparent' },
          emphasis: { itemStyle: { borderColor: 'transparent', color: 'transparent' } },
          data: invisibleData,
        },
        {
          name: '증가',
          type: 'bar',
          stack: 'waterfall',
          data: increaseData,
          itemStyle: { color: increaseColor, borderRadius: [3, 3, 0, 0] },
          label: {
            show: true,
            position: 'top',
            formatter: (params: any) => (params.value !== '-' ? `+${params.value}` : ''),
            fontSize: 10,
            color: increaseColor,
            fontWeight: 600,
          },
        },
        {
          name: '감소',
          type: 'bar',
          stack: 'waterfall',
          data: decreaseData,
          itemStyle: { color: decreaseColor, borderRadius: [3, 3, 0, 0] },
          label: {
            show: true,
            position: 'bottom',
            formatter: (params: any) => {
              if (params.value === '-') return '';
              const d = data[params.dataIndex];
              return `${d.value}`;
            },
            fontSize: 10,
            color: decreaseColor,
            fontWeight: 600,
          },
        },
        {
          name: '합계',
          type: 'bar',
          stack: 'waterfall',
          data: totalData,
          itemStyle: { color: totalColor, borderRadius: [3, 3, 0, 0] },
          label: {
            show: true,
            position: 'top',
            formatter: (params: any) => (params.value !== '-' ? params.value.toLocaleString() : ''),
            fontSize: 11,
            color: totalColor,
            fontWeight: 700,
          },
        },
      ],
    };
  }, [data, increaseColor, decreaseColor, totalColor]);

  const events = useMemo(
    () =>
      onDataClick
        ? {
            click: (params: any) => {
              if (params.seriesName === 'base') return;
              onDataClick(data[params.dataIndex], params.dataIndex);
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
