export type { KpiId, KpiTrend, KpiSignal, KpiValue, KpiCard, KpiThreshold, KpiTimeSeries } from '@hr-dashboard/shared-types';

export interface KpiCardDisplayProps {
  title: string;
  value: string;
  changePercent: number;
  trend: 'up' | 'down' | 'stable';
  signal: 'positive' | 'negative' | 'warning' | 'neutral';
  sparklineData?: number[];
  unit?: string;
  className?: string;
}

export interface KpiGridConfig {
  columns?: number;
  gap?: number;
}
