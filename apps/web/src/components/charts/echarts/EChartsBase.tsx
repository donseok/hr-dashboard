'use client';

import { useRef, useEffect, useCallback, type CSSProperties } from 'react';
import * as echarts from 'echarts/core';
import { useTheme } from '@/providers/ThemeProvider';
import { CanvasRenderer } from 'echarts/renderers';
import {
  LineChart,
  BarChart,
  PieChart,
  ScatterChart,
  RadarChart,
  GaugeChart,
  FunnelChart,
  TreemapChart,
  HeatmapChart,
  CustomChart,
} from 'echarts/charts';
import {
  TitleComponent,
  TooltipComponent,
  GridComponent,
  LegendComponent,
  DataZoomComponent,
  ToolboxComponent,
  VisualMapComponent,
  GraphicComponent,
  MarkLineComponent,
} from 'echarts/components';
import type { EChartsOption } from 'echarts';
type EChartsInstance = ReturnType<typeof echarts.init>;
import { useChartResize } from '@/hooks/useChartResize';

echarts.use([
  CanvasRenderer,
  LineChart,
  BarChart,
  PieChart,
  ScatterChart,
  FunnelChart,
  TreemapChart,
  HeatmapChart,
  CustomChart,
  RadarChart,
  GaugeChart,
  TitleComponent,
  TooltipComponent,
  GridComponent,
  LegendComponent,
  DataZoomComponent,
  ToolboxComponent,
  VisualMapComponent,
  GraphicComponent,
  MarkLineComponent,
]);

interface EChartsBaseProps {
  option: EChartsOption;
  style?: CSSProperties;
  className?: string;
  height?: number | string;
  loading?: boolean;
  theme?: string | object;
  onChartReady?: (instance: EChartsInstance) => void;
  onEvents?: Record<string, (params: unknown) => void>;
}

export function EChartsBase({
  option,
  style,
  className,
  height = 300,
  loading = false,
  theme: themeProp,
  onChartReady,
  onEvents,
}: EChartsBaseProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const chartRef = useRef<EChartsInstance | null>(null);
  const { resolvedTheme } = useTheme();
  const effectiveTheme = themeProp ?? (resolvedTheme === 'dark' ? 'dark' : undefined);

  useChartResize(chartRef.current as Parameters<typeof useChartResize>[0]);

  const initChart = useCallback(() => {
    if (!containerRef.current) return;

    if (chartRef.current) {
      chartRef.current.dispose();
    }

    const instance = echarts.init(containerRef.current, effectiveTheme, {
      renderer: 'canvas',
    });
    chartRef.current = instance;
    onChartReady?.(instance);

    if (onEvents) {
      Object.entries(onEvents).forEach(([eventName, handler]) => {
        instance.on(eventName, handler);
      });
    }
  }, [effectiveTheme, onChartReady, onEvents]);

  useEffect(() => {
    initChart();
    return () => {
      chartRef.current?.dispose();
      chartRef.current = null;
    };
  }, [initChart]);

  useEffect(() => {
    if (chartRef.current) {
      chartRef.current.setOption(option, { notMerge: true });
    }
  }, [option]);

  useEffect(() => {
    if (chartRef.current) {
      if (loading) {
        chartRef.current.showLoading('default', {
          text: '',
          color: '#2563EB',
          maskColor: resolvedTheme === 'dark' ? 'rgba(15, 23, 42, 0.8)' : 'rgba(255, 255, 255, 0.8)',
        });
      } else {
        chartRef.current.hideLoading();
      }
    }
  }, [loading]);

  return (
    <div
      ref={containerRef}
      className={className}
      style={{
        height: typeof height === 'number' ? `${height}px` : height,
        width: '100%',
        ...style,
      }}
    />
  );
}
