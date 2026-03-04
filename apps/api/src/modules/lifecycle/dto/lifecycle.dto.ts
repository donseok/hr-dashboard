export interface LifecycleStage {
  stage: string;
  count: number;
  avgDuration: number;
}

export interface TurnoverAnalysis {
  period: string;
  totalTerminations: number;
  voluntaryRate: number;
  avgTenureMonths: number;
  topReasons: Array<{ reason: string; count: number }>;
}
