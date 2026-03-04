import type { NineBoxEmployee } from '@/components/charts/d3/NineBoxGrid';
import type { StackedBarSeries } from '@/components/charts/StackedBarChart';
import type { RadarIndicator, RadarSeries } from '@/components/charts/RadarChart';
import type { BubbleDataPoint } from '@/components/charts/BubbleChart';

// ── KPI Data ──────────────────────────────────────────────
export const performanceKpis = {
  goalAchievement: {
    title: '목표 달성률',
    value: '78.5',
    changePercent: 4.5,
    trend: 'up' as const,
    signal: 'positive' as const,
    unit: '%',
    sparklineData: [68, 70, 72, 73, 75, 76, 77, 78.5],
  },
  gradeDistribution: {
    title: '성과 S등급 비율',
    value: '15.2',
    changePercent: -1.2,
    trend: 'down' as const,
    signal: 'neutral' as const,
    unit: '%',
    sparklineData: [18, 17.5, 17, 16.5, 16, 15.8, 15.5, 15.2],
  },
  compAlignment: {
    title: '성과-보상 정합성',
    value: '0.82',
    changePercent: 3.8,
    trend: 'up' as const,
    signal: 'positive' as const,
    unit: '',
    sparklineData: [0.72, 0.74, 0.75, 0.77, 0.78, 0.79, 0.81, 0.82],
  },
};

// ── NineBox Grid Data ────────────────────────────────────
export const nineBoxData: NineBoxEmployee[] = [
  // High Potential, High Performance (Consistent Star)
  ...Array.from({ length: 28 }, (_, i) => ({
    id: `cs-${i}`, name: `직원 CS${i + 1}`, performance: 3 as const, potential: 3 as const, department: '개발본부',
  })),
  // High Potential, Medium Performance (Future Star)
  ...Array.from({ length: 35 }, (_, i) => ({
    id: `fs-${i}`, name: `직원 FS${i + 1}`, performance: 2 as const, potential: 3 as const, department: '기획실',
  })),
  // High Potential, Low Performance (Rough Diamond)
  ...Array.from({ length: 12 }, (_, i) => ({
    id: `rd-${i}`, name: `직원 RD${i + 1}`, performance: 1 as const, potential: 3 as const, department: '마케팅',
  })),
  // Medium Potential, High Performance (Current Star)
  ...Array.from({ length: 85 }, (_, i) => ({
    id: `cst-${i}`, name: `직원 CST${i + 1}`, performance: 3 as const, potential: 2 as const, department: '영업본부',
  })),
  // Medium Potential, Medium Performance (Key Player)
  ...Array.from({ length: 420 }, (_, i) => ({
    id: `kp-${i}`, name: `직원 KP${i + 1}`, performance: 2 as const, potential: 2 as const, department: '경영지원',
  })),
  // Medium Potential, Low Performance (Inconsistent Player)
  ...Array.from({ length: 65 }, (_, i) => ({
    id: `ip-${i}`, name: `직원 IP${i + 1}`, performance: 1 as const, potential: 2 as const, department: '디자인센터',
  })),
  // Low Potential, High Performance (Solid Performer)
  ...Array.from({ length: 180 }, (_, i) => ({
    id: `sp-${i}`, name: `직원 SP${i + 1}`, performance: 3 as const, potential: 1 as const, department: '개발본부',
  })),
  // Low Potential, Medium Performance (Average Performer)
  ...Array.from({ length: 285 }, (_, i) => ({
    id: `ap-${i}`, name: `직원 AP${i + 1}`, performance: 2 as const, potential: 1 as const, department: '경영지원',
  })),
  // Low Potential, Low Performance (Talent Risk)
  ...Array.from({ length: 42 }, (_, i) => ({
    id: `tr-${i}`, name: `직원 TR${i + 1}`, performance: 1 as const, potential: 1 as const, department: '마케팅',
  })),
];

// ── StackedBar Data (성과 등급 분포) ────────────────────────
export const gradeDistributionData = {
  categories: ['개발본부', '영업본부', '마케팅본부', '경영지원', '디자인센터', '기획실'],
  series: [
    { name: 'S (탁월)', data: [65, 42, 25, 22, 15, 18], color: '#2563EB' },
    { name: 'A (우수)', data: [110, 72, 48, 42, 25, 28], color: '#0EA5E9' },
    { name: 'B (양호)', data: [165, 108, 70, 62, 35, 38], color: '#10B981' },
    { name: 'C (보통)', data: [60, 42, 28, 28, 15, 18], color: '#F59E0B' },
    { name: 'D (개선필요)', data: [20, 16, 9, 11, 5, 5], color: '#EF4444' },
  ] as StackedBarSeries[],
};

// ── Radar Chart Data (역량 평가 비교) ────────────────────────
export const competencyRadarIndicators: RadarIndicator[] = [
  { name: '리더십', max: 5 },
  { name: '전문성', max: 5 },
  { name: '협업', max: 5 },
  { name: '혁신', max: 5 },
  { name: '커뮤니케이션', max: 5 },
  { name: '실행력', max: 5 },
];

export const competencyRadarSeries: RadarSeries[] = [
  { name: '개발본부', values: [3.8, 4.5, 3.9, 4.2, 3.5, 4.1], color: '#2563EB' },
  { name: '영업본부', values: [3.5, 3.8, 4.2, 3.4, 4.5, 4.3], color: '#10B981' },
  { name: '전사 평균', values: [3.6, 4.0, 4.0, 3.7, 3.9, 4.0], color: '#94A3B8' },
];

// ── Bubble Chart Data (성과-잠재력 산점도) ──────────────────
export const perfPotentialBubbleData: BubbleDataPoint[] = [
  { x: 85, y: 90, size: 42, name: '개발 1팀', group: '개발본부' },
  { x: 78, y: 82, size: 38, name: '개발 2팀', group: '개발본부' },
  { x: 92, y: 75, size: 35, name: '개발 3팀', group: '개발본부' },
  { x: 70, y: 88, size: 28, name: 'Frontend팀', group: '개발본부' },
  { x: 88, y: 65, size: 45, name: '국내영업 1팀', group: '영업본부' },
  { x: 75, y: 70, size: 40, name: '국내영업 2팀', group: '영업본부' },
  { x: 82, y: 78, size: 32, name: '해외영업팀', group: '영업본부' },
  { x: 65, y: 85, size: 25, name: '디지털마케팅팀', group: '마케팅본부' },
  { x: 72, y: 60, size: 22, name: '브랜드팀', group: '마케팅본부' },
  { x: 80, y: 72, size: 30, name: '콘텐츠팀', group: '마케팅본부' },
  { x: 90, y: 55, size: 20, name: 'HR팀', group: '경영지원' },
  { x: 68, y: 75, size: 18, name: '재무팀', group: '경영지원' },
  { x: 85, y: 80, size: 35, name: 'UX팀', group: '디자인센터' },
  { x: 78, y: 68, size: 28, name: 'UI팀', group: '디자인센터' },
  { x: 73, y: 92, size: 30, name: '프로덕트팀', group: '기획실' },
  { x: 82, y: 85, size: 26, name: '전략기획팀', group: '기획실' },
];

// ── Insights Data ──────────────────────────────────────────
export const performanceInsights = [
  {
    type: 'success' as const,
    title: '목표 달성률 상승',
    description: '전사 목표 달성률이 78.5%로 전분기(74.0%) 대비 4.5%p 향상되었습니다. 특히 개발본부(85.2%)와 기획실(82.1%)이 강세를 보입니다.',
    action: '우수 부서 사례 전파 및 벤치마킹',
  },
  {
    type: 'warning' as const,
    title: '캘리브레이션 필요',
    description: '영업본부의 S등급 비율(15.0%)이 전사 평균(15.2%)에 근접하나, 부서 내 팀별 편차가 큽니다(10.5%~22.3%). 평가 기준 정합이 필요합니다.',
    action: '영업본부 캘리브레이션 세션 개최',
  },
  {
    type: 'danger' as const,
    title: '하위 성과자 집중 분포',
    description: 'D등급(개선필요) 비율이 마케팅본부(5.0%)와 경영지원(6.7%)에 집중되어 있습니다. 전사 평균(5.6%) 대비 경영지원이 높습니다.',
    action: '해당 부서 PIP(성과개선계획) 가이드 배포',
  },
  {
    type: 'info' as const,
    title: '성과-보상 정합성 개선',
    description: '성과-보상 정합성 지수가 0.82로 전기(0.79) 대비 개선되었습니다. S/A등급의 보상 프리미엄이 강화된 효과입니다.',
    action: '정합성 0.85 이상 목표 유지',
  },
];
