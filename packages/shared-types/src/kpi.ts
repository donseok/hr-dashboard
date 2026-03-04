export type KpiId =
  | 'headcount_total'
  | 'headcount_growth'
  | 'turnover_rate'
  | 'retention_rate'
  | 'avg_tenure'
  | 'time_to_hire'
  | 'offer_acceptance_rate'
  | 'cost_per_hire'
  | 'training_hours'
  | 'engagement_score'
  | 'dei_ratio'
  | 'absenteeism_rate'
  | 'revenue_per_employee'
  | 'compensation_ratio';

export type KpiTrend = 'up' | 'down' | 'stable';

export type KpiSignal = 'positive' | 'negative' | 'neutral' | 'warning';

export interface KpiValue {
  current: number;
  previous: number;
  changePercent: number;
  trend: KpiTrend;
  signal: KpiSignal;
}

export interface KpiCard {
  id: KpiId;
  label: string;
  description: string;
  value: KpiValue;
  unit: string;
  format: 'number' | 'percent' | 'currency' | 'duration';
  moduleId: string;
  updatedAt: string;
}

export interface KpiThreshold {
  kpiId: KpiId;
  warningMin?: number;
  warningMax?: number;
  dangerMin?: number;
  dangerMax?: number;
}

export interface KpiTimeSeries {
  kpiId: KpiId;
  dataPoints: Array<{
    date: string;
    value: number;
  }>;
  granularity: 'daily' | 'weekly' | 'monthly' | 'quarterly' | 'yearly';
}
