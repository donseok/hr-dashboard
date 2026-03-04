import type { KpiTimeSeries } from '@hr-dashboard/shared-types';

export interface ChartDataPoint {
  name: string;
  value: number;
  [key: string]: string | number;
}

export function kpiTimeSeriesToChartData(series: KpiTimeSeries): ChartDataPoint[] {
  return series.dataPoints.map((point) => ({
    name: point.date,
    value: point.value,
  }));
}

export function groupByField<T>(
  items: T[],
  field: keyof T,
): Record<string, T[]> {
  return items.reduce(
    (acc, item) => {
      const key = String(item[field]);
      if (!acc[key]) acc[key] = [];
      acc[key].push(item);
      return acc;
    },
    {} as Record<string, T[]>,
  );
}

export function calculatePercentChange(current: number, previous: number): number {
  if (previous === 0) return current > 0 ? 100 : 0;
  return ((current - previous) / Math.abs(previous)) * 100;
}

export function movingAverage(data: number[], window: number): number[] {
  return data.map((_, idx, arr) => {
    const start = Math.max(0, idx - window + 1);
    const slice = arr.slice(start, idx + 1);
    return slice.reduce((sum, v) => sum + v, 0) / slice.length;
  });
}

export function normalizeToPercent(data: number[]): number[] {
  const max = Math.max(...data);
  if (max === 0) return data.map(() => 0);
  return data.map((v) => (v / max) * 100);
}

export function sparklineData(series: KpiTimeSeries, maxPoints = 12): number[] {
  const points = series.dataPoints.slice(-maxPoints);
  return points.map((p) => p.value);
}
