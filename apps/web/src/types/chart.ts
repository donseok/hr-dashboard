import type { EChartsOption } from 'echarts';

export type ChartType = 'line' | 'bar' | 'pie' | 'scatter' | 'heatmap' | 'treemap' | 'sankey' | 'gauge' | 'radar';

export interface ChartConfig {
  type: ChartType;
  title: string;
  subtitle?: string;
  option: EChartsOption;
  height?: number;
}

export interface ChartContainerProps {
  title: string;
  subtitle?: string;
  isLoading?: boolean;
  isEmpty?: boolean;
  error?: string | null;
  toolbar?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}

export type ChartGranularity = 'daily' | 'weekly' | 'monthly' | 'quarterly' | 'yearly';

export interface ChartExportOptions {
  format: 'png' | 'svg' | 'csv';
  filename?: string;
}
