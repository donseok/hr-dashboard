import { ModuleType } from '@prisma/client';

export interface KpiDefinition {
  id: string;
  label: string;
  description: string;
  moduleType: ModuleType;
  unit: string;
  format: 'number' | 'percent' | 'currency' | 'duration';
  calculator: string;
}

export const KPI_DEFINITIONS: KpiDefinition[] = [
  { id: 'headcount_total', label: 'Total Headcount', description: 'Total active employees', moduleType: 'WORKFORCE', unit: '', format: 'number', calculator: 'headcount' },
  { id: 'headcount_growth', label: 'Headcount Growth', description: 'Month-over-month headcount change', moduleType: 'WORKFORCE', unit: '%', format: 'percent', calculator: 'headcountGrowth' },
  { id: 'turnover_rate', label: 'Turnover Rate', description: 'Employee turnover rate', moduleType: 'LIFECYCLE', unit: '%', format: 'percent', calculator: 'turnover' },
  { id: 'retention_rate', label: 'Retention Rate', description: 'Employee retention rate', moduleType: 'LIFECYCLE', unit: '%', format: 'percent', calculator: 'retention' },
  { id: 'avg_tenure', label: 'Avg Tenure', description: 'Average employee tenure in months', moduleType: 'LIFECYCLE', unit: 'mo', format: 'duration', calculator: 'avgTenure' },
  { id: 'time_to_hire', label: 'Time to Hire', description: 'Average days from open to hire', moduleType: 'RECRUITMENT', unit: 'days', format: 'duration', calculator: 'timeToHire' },
  { id: 'offer_acceptance_rate', label: 'Offer Acceptance', description: 'Offer acceptance rate', moduleType: 'RECRUITMENT', unit: '%', format: 'percent', calculator: 'offerAcceptance' },
  { id: 'training_hours', label: 'Training Hours', description: 'Average training hours per employee', moduleType: 'DEVELOPMENT', unit: 'hrs', format: 'number', calculator: 'trainingHours' },
  { id: 'engagement_score', label: 'Engagement Score', description: 'Employee engagement score', moduleType: 'CULTURE', unit: '', format: 'number', calculator: 'engagement' },
  { id: 'dei_ratio', label: 'DEI Index', description: 'Diversity & inclusion index', moduleType: 'DEI', unit: '', format: 'number', calculator: 'deiIndex' },
];
