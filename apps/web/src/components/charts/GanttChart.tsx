'use client';

import { useMemo } from 'react';
import { EChartsBase } from './echarts/EChartsBase';
import { ChartContainer } from './ChartContainer';
import { chartColorPalette, colors } from '@hr-dashboard/design-tokens';
import type { EChartsOption } from 'echarts';

export interface GanttTask {
  id: string;
  name: string;
  start: string;
  end: string;
  progress?: number;
  category?: string;
  color?: string;
}

export interface GanttChartProps {
  title: string;
  subtitle?: string;
  tasks: GanttTask[];
  height?: number;
  isLoading?: boolean;
  error?: string | null;
  onDataClick?: (task: GanttTask) => void;
  className?: string;
}

export function GanttChart({
  title,
  subtitle,
  tasks,
  height,
  isLoading = false,
  error = null,
  onDataClick,
  className,
}: GanttChartProps) {
  const computedHeight = height || Math.max(250, tasks.length * 36 + 80);

  const option = useMemo<EChartsOption>(() => {
    const categories = [...new Set(tasks.map((t) => t.category || '기타'))];
    const categoryColorMap = new Map(categories.map((c, i) => [c, chartColorPalette[i % chartColorPalette.length]]));
    const taskNames = tasks.map((t) => t.name).reverse();

    const allDates = tasks.flatMap((t) => [new Date(t.start).getTime(), new Date(t.end).getTime()]);
    const minDate = Math.min(...allDates);
    const maxDate = Math.max(...allDates);
    const padding = (maxDate - minDate) * 0.05;

    const renderData = tasks.map((task, i) => ({
      name: task.name,
      value: [
        tasks.length - 1 - i,
        new Date(task.start).getTime(),
        new Date(task.end).getTime(),
        task.progress ?? 0,
      ],
      itemStyle: {
        color: task.color || categoryColorMap.get(task.category || '기타'),
        borderRadius: 3,
      },
    }));

    return {
      tooltip: {
        formatter: (params: any) => {
          const task = tasks[tasks.length - 1 - params.value[0]];
          if (!task) return '';
          const start = new Date(params.value[1]).toLocaleDateString('ko-KR');
          const end = new Date(params.value[2]).toLocaleDateString('ko-KR');
          const days = Math.ceil((params.value[2] - params.value[1]) / (1000 * 60 * 60 * 24));
          return `<strong>${task.name}</strong><br/>${start} ~ ${end} (${days}일)<br/>진행률: ${(task.progress ?? 0)}%`;
        },
      },
      grid: { left: '20%', right: '5%', top: '5%', bottom: '10%' },
      xAxis: {
        type: 'time',
        min: minDate - padding,
        max: maxDate + padding,
        axisLabel: {
          fontSize: 10,
          color: colors.neutral[500],
          formatter: (val: number) => new Date(val).toLocaleDateString('ko-KR', { month: 'short', day: 'numeric' }),
        },
        splitLine: { lineStyle: { color: colors.neutral[100] } },
      },
      yAxis: {
        type: 'category',
        data: taskNames,
        axisLabel: { fontSize: 11, color: colors.neutral[600], width: 120, overflow: 'truncate' },
        axisLine: { show: false },
        axisTick: { show: false },
      },
      series: [
        {
          type: 'custom',
          renderItem: (params: any, api: any) => {
            const yIndex = api.value(0);
            const start = api.coord([api.value(1), yIndex]);
            const end = api.coord([api.value(2), yIndex]);
            const barHeight = 20;
            const progress = api.value(3) / 100;

            return {
              type: 'group',
              children: [
                {
                  type: 'rect',
                  shape: { x: start[0], y: start[1] - barHeight / 2, width: end[0] - start[0], height: barHeight },
                  style: { ...api.style(), opacity: 0.3 },
                },
                {
                  type: 'rect',
                  shape: {
                    x: start[0],
                    y: start[1] - barHeight / 2,
                    width: (end[0] - start[0]) * progress,
                    height: barHeight,
                  },
                  style: api.style(),
                },
              ],
            };
          },
          encode: { x: [1, 2], y: 0 },
          data: renderData,
        },
      ],
    };
  }, [tasks]);

  const events = useMemo(
    () =>
      onDataClick
        ? {
            click: (params: any) => {
              const idx = tasks.length - 1 - params.value[0];
              if (tasks[idx]) onDataClick(tasks[idx]);
            },
          }
        : undefined,
    [onDataClick, tasks],
  );

  return (
    <ChartContainer
      title={title}
      subtitle={subtitle}
      isLoading={isLoading}
      error={error}
      isEmpty={tasks.length === 0}
      className={className}
    >
      <EChartsBase option={option} height={computedHeight} onEvents={events} />
    </ChartContainer>
  );
}
