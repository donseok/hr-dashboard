import type { StackedBarSeries } from '@/components/charts/StackedBarChart';
import type { BubbleDataPoint } from '@/components/charts/BubbleChart';
import type { DonutSegment } from '@/components/charts/DonutChart';
import type { LineWithBandSeries } from '@/components/charts/LineWithBandChart';
import type { HeatmapDataPoint } from '@/components/charts/HeatmapChart';

// ── KPI Data ──────────────────────────────────────────────
export const deiKpis = {
  genderDiversity: {
    title: '성별 다양성',
    value: '38.5',
    changePercent: 2.8,
    trend: 'up' as const,
    signal: 'positive' as const,
    unit: '% 여성',
    sparklineData: [32, 33, 34, 35, 36, 37, 38, 38.5],
  },
  disabilityRate: {
    title: '장애인 고용률',
    value: '3.8',
    changePercent: 0.5,
    trend: 'up' as const,
    signal: 'positive' as const,
    unit: '%',
    sparklineData: [2.8, 3.0, 3.1, 3.2, 3.4, 3.5, 3.7, 3.8],
  },
  payEquity: {
    title: '급여 형평성 지수',
    value: '0.94',
    changePercent: 1.2,
    trend: 'up' as const,
    signal: 'positive' as const,
    unit: '',
    sparklineData: [0.88, 0.89, 0.90, 0.91, 0.92, 0.93, 0.93, 0.94],
  },
  inclusionScore: {
    title: '포용성 점수',
    value: '4.1',
    changePercent: -0.5,
    trend: 'down' as const,
    signal: 'warning' as const,
    unit: '/5.0',
    sparklineData: [4.2, 4.2, 4.1, 4.1, 4.1, 4.1, 4.1, 4.1],
  },
};

// ── StackedBar: 직급별 성별 분포 ────────────────────────────
export const genderByGradeData = {
  categories: ['임원', '부장/팀장', '과장/차장', '대리', '사원'],
  series: [
    { name: '남성', data: [18, 95, 192, 235, 222], color: '#2563EB' },
    { name: '여성', data: [2, 26, 85, 135, 137], color: '#EC4899' },
  ] as StackedBarSeries[],
};

// ── Bubble: 직급-급여 성별 비교 ──────────────────────────────
export const payEquityBubbleData: BubbleDataPoint[] = [
  { x: 1, y: 12500, size: 18, name: '임원 남성', group: '남성' },
  { x: 1, y: 11800, size: 2, name: '임원 여성', group: '여성' },
  { x: 2, y: 8200, size: 95, name: '부장/팀장 남성', group: '남성' },
  { x: 2, y: 7800, size: 26, name: '부장/팀장 여성', group: '여성' },
  { x: 3, y: 6100, size: 192, name: '과장/차장 남성', group: '남성' },
  { x: 3, y: 5900, size: 85, name: '과장/차장 여성', group: '여성' },
  { x: 4, y: 4500, size: 235, name: '대리 남성', group: '남성' },
  { x: 4, y: 4400, size: 135, name: '대리 여성', group: '여성' },
  { x: 5, y: 3200, size: 222, name: '사원 남성', group: '남성' },
  { x: 5, y: 3150, size: 137, name: '사원 여성', group: '여성' },
];

// ── Donut: 연령대별 구성 ──────────────────────────────────
export const ageDistributionData: DonutSegment[] = [
  { name: '20대', value: 320 },
  { name: '30대', value: 485 },
  { name: '40대', value: 298 },
  { name: '50대 이상', value: 144 },
];

// ── LineWithBand: DEI 지표 트렌드 ────────────────────────────
const quarters = ['2024 Q1', '2024 Q2', '2024 Q3', '2024 Q4', '2025 Q1', '2025 Q2', '2025 Q3', '2025 Q4'];
export const deiTrendData: LineWithBandSeries[] = [
  {
    name: '여성 비율',
    color: '#EC4899',
    data: quarters.map((date, i) => ({
      date,
      value: 32 + i * 0.8 + Math.sin(i) * 0.3,
      upper: 34 + i * 0.7 + Math.sin(i) * 0.3,
      lower: 30 + i * 0.9 + Math.sin(i) * 0.3,
    })),
  },
  {
    name: '급여 형평성',
    color: '#2563EB',
    data: quarters.map((date, i) => ({
      date,
      value: (88 + i * 0.75) ,
      upper: (90 + i * 0.7) ,
      lower: (86 + i * 0.8) ,
    })),
  },
];

// ── Heatmap: 부서별 다양성 ────────────────────────────────
const depts = ['개발본부', '영업본부', '마케팅본부', '경영지원', '디자인센터', '기획실'];
const deiDimensions = ['여성비율', '장애인비율', '연령다양성', '포용성점수'];

export const deiHeatmapData: {
  data: HeatmapDataPoint[];
  xLabels: string[];
  yLabels: string[];
} = {
  xLabels: deiDimensions,
  yLabels: depts,
  data: [
    { x: 0, y: 0, value: 28 }, { x: 1, y: 0, value: 3.2 }, { x: 2, y: 0, value: 72 }, { x: 3, y: 0, value: 4.0 },
    { x: 0, y: 1, value: 35 }, { x: 1, y: 1, value: 3.5 }, { x: 2, y: 1, value: 68 }, { x: 3, y: 1, value: 3.8 },
    { x: 0, y: 2, value: 52 }, { x: 1, y: 2, value: 4.2 }, { x: 2, y: 2, value: 75 }, { x: 3, y: 2, value: 4.3 },
    { x: 0, y: 3, value: 55 }, { x: 1, y: 3, value: 5.0 }, { x: 2, y: 3, value: 80 }, { x: 3, y: 3, value: 4.2 },
    { x: 0, y: 4, value: 48 }, { x: 1, y: 4, value: 2.8 }, { x: 2, y: 4, value: 65 }, { x: 3, y: 4, value: 4.5 },
    { x: 0, y: 5, value: 42 }, { x: 1, y: 5, value: 3.0 }, { x: 2, y: 5, value: 70 }, { x: 3, y: 5, value: 4.1 },
  ],
};

// ── Insights ──────────────────────────────────────────────
export const deiInsights = [
  {
    type: 'success' as const,
    title: '급여 형평성 개선',
    description: '급여 형평성 지수가 0.94로 전년(0.88) 대비 0.06 개선되었습니다. 동일 직급 내 성별 급여 격차가 6%로 축소 추세입니다.',
    action: '목표 0.97 달성을 위한 보상 조정 계속',
  },
  {
    type: 'warning' as const,
    title: '개발본부 여성 비율 저조',
    description: '개발본부 여성 비율이 28%로 전사 평균(38.5%) 대비 10.5%p 낮습니다. 기술직 여성 채용 강화 및 멘토링 프로그램이 필요합니다.',
    action: 'Women in Tech 채용 캠페인 계획',
  },
  {
    type: 'info' as const,
    title: '장애인 고용률 법정 초과 달성',
    description: '장애인 고용률 3.8%로 법정 의무(3.1%) 대비 0.7%p 초과 달성했습니다. 경영지원(5.0%)이 가장 높고, 디자인센터(2.8%)가 가장 낮습니다.',
    action: '디자인센터 장애인 채용 확대 검토',
  },
  {
    type: 'warning' as const,
    title: '포용성 점수 정체',
    description: '포용성 점수가 4.1점으로 3분기 연속 정체 중입니다. 특히 영업본부(3.8점)가 전사 최하위이며, 무의식적 편견 교육이 권고됩니다.',
    action: '전사 무의식적 편견 교육 의무화',
  },
];
