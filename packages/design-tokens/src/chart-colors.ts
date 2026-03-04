export const chartColors = {
  headcount: '#2563EB',
  recruitment: '#7C3AED',
  retention: '#22C55E',
  compensation: '#F59E0B',
  performance: '#EF4444',
  learning: '#06B6D4',
  dei: '#EC4899',
} as const;

export const chartColorPalette = [
  '#2563EB',
  '#7C3AED',
  '#22C55E',
  '#F59E0B',
  '#EF4444',
  '#06B6D4',
  '#EC4899',
] as const;

export type ChartColorToken = typeof chartColors;
