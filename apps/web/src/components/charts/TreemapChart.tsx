'use client';

import { useMemo } from 'react';
import { EChartsBase } from './echarts/EChartsBase';
import { ChartContainer } from './ChartContainer';
import { chartColorPalette, colors } from '@hr-dashboard/design-tokens';
import type { EChartsOption } from 'echarts';

export interface TreemapNode {
  name: string;
  value: number;
  children?: TreemapNode[];
  color?: string;
}

export interface TreemapChartProps {
  title: string;
  subtitle?: string;
  data: TreemapNode[];
  height?: number;
  isLoading?: boolean;
  error?: string | null;
  valueFormatter?: (value: number) => string;
  onDataClick?: (node: TreemapNode, path: string[]) => void;
  className?: string;
}

export function TreemapChart({
  title,
  subtitle,
  data,
  height = 400,
  isLoading = false,
  error = null,
  valueFormatter = (v) => `${v}명`,
  onDataClick,
  className,
}: TreemapChartProps) {
  const option = useMemo<EChartsOption>(() => {
    const colorize = (nodes: TreemapNode[], depth = 0): any[] =>
      nodes.map((node, i) => ({
        name: node.name,
        value: node.value,
        itemStyle: {
          color: node.color || chartColorPalette[(depth === 0 ? i : depth + i) % chartColorPalette.length],
          borderColor: '#fff',
          borderWidth: depth === 0 ? 3 : 1,
          gapWidth: depth === 0 ? 3 : 1,
        },
        children: node.children ? colorize(node.children, depth + 1) : undefined,
      }));

    return {
      tooltip: {
        formatter: (params: any) => {
          const treePath = params.treePathInfo
            .map((p: any) => p.name)
            .filter(Boolean)
            .join(' > ');
          return `${treePath}<br/>${valueFormatter(params.value)}`;
        },
      },
      series: [
        {
          type: 'treemap',
          roam: false,
          width: '100%',
          height: '100%',
          nodeClick: 'zoomToNode',
          breadcrumb: {
            show: true,
            bottom: 0,
            itemStyle: { color: colors.neutral[100], textStyle: { color: colors.neutral[700] } },
          },
          label: {
            show: true,
            formatter: (params: any) => `${params.name}\n${valueFormatter(params.value)}`,
            fontSize: 12,
            color: '#fff',
            fontWeight: 500,
          },
          upperLabel: {
            show: true,
            height: 24,
            color: '#fff',
            fontSize: 11,
            fontWeight: 600,
          },
          levels: [
            {
              itemStyle: { borderWidth: 3, borderColor: '#fff', gapWidth: 3 },
              upperLabel: { show: false },
            },
            {
              itemStyle: { borderWidth: 1, borderColor: 'rgba(255,255,255,0.5)', gapWidth: 1 },
              emphasis: { itemStyle: { borderColor: '#fff' } },
            },
            {
              itemStyle: { borderWidth: 1, borderColor: 'rgba(255,255,255,0.3)' },
              label: { fontSize: 10 },
            },
          ],
          data: colorize(data),
        },
      ],
    };
  }, [data, valueFormatter]);

  const events = useMemo(
    () =>
      onDataClick
        ? {
            click: (params: any) => {
              const path = params.treePathInfo.map((p: any) => p.name).filter(Boolean);
              onDataClick({ name: params.name, value: params.value }, path);
            },
          }
        : undefined,
    [onDataClick],
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
