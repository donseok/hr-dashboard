import type { SankeyNodeData, SankeyLinkData } from '@/components/charts/d3/SankeyDiagram';
import type { CohortRow } from '@/components/charts/d3/CohortHeatmap';
import type { BubbleDataPoint } from '@/components/charts/BubbleChart';
import type { LineWithBandSeries } from '@/components/charts/LineWithBandChart';

// ── KPI Data (전 모듈 대표 KPI 각 1개) ────────────────────────
export const lifecycleKpis = {
  recruitment: {
    title: '채용 소요일',
    value: '32',
    changePercent: 5.1,
    trend: 'up' as const,
    signal: 'warning' as const,
    unit: '일',
    sparklineData: [38, 36, 35, 34, 33, 31, 30, 32],
  },
  workforce: {
    title: '이직률',
    value: '12.8',
    changePercent: 1.5,
    trend: 'up' as const,
    signal: 'warning' as const,
    unit: '%',
    sparklineData: [10.2, 10.8, 11.1, 11.5, 11.9, 12.2, 12.5, 12.8],
  },
  performance: {
    title: '목표 달성률',
    value: '78.5',
    changePercent: 4.5,
    trend: 'up' as const,
    signal: 'positive' as const,
    unit: '%',
    sparklineData: [68, 70, 72, 73, 75, 76, 77, 78.5],
  },
  culture: {
    title: 'eNPS',
    value: '42',
    changePercent: 8.2,
    trend: 'up' as const,
    signal: 'positive' as const,
    unit: '',
    sparklineData: [28, 30, 32, 35, 36, 38, 40, 42],
  },
  development: {
    title: '학습 참여율',
    value: '78.5',
    changePercent: 5.2,
    trend: 'up' as const,
    signal: 'positive' as const,
    unit: '%',
    sparklineData: [65, 68, 70, 72, 74, 75, 77, 78.5],
  },
  dei: {
    title: '급여 형평성',
    value: '0.94',
    changePercent: 1.2,
    trend: 'up' as const,
    signal: 'positive' as const,
    unit: '',
    sparklineData: [0.88, 0.89, 0.90, 0.91, 0.92, 0.93, 0.93, 0.94],
  },
  overall: {
    title: '인재 유지율',
    value: '87.2',
    changePercent: -1.5,
    trend: 'down' as const,
    signal: 'warning' as const,
    unit: '%',
    sparklineData: [90, 89.5, 89, 88.5, 88, 87.8, 87.5, 87.2],
  },
};

// ── Sankey: 인재 라이프사이클 흐름 ────────────────────────────
export const lifecycleFlowNodes: SankeyNodeData[] = [
  { id: 'recruit', name: '채용', group: '입사' },
  { id: 'onboard', name: '온보딩', group: '입사' },
  { id: 'growth', name: '성장/개발', group: '성장' },
  { id: 'perform', name: '성과 달성', group: '성장' },
  { id: 'promote', name: '승진/이동', group: '전환' },
  { id: 'retain', name: '핵심인재 유지', group: '전환' },
  { id: 'vol-exit', name: '자발적 퇴사', group: '이탈' },
  { id: 'invol-exit', name: '비자발적 퇴사', group: '이탈' },
  { id: 'retire', name: '정년/계약만료', group: '이탈' },
];

export const lifecycleFlowLinks: SankeyLinkData[] = [
  { source: 'recruit', target: 'onboard', value: 142 },
  { source: 'onboard', target: 'growth', value: 130 },
  { source: 'onboard', target: 'vol-exit', value: 12 },
  { source: 'growth', target: 'perform', value: 115 },
  { source: 'growth', target: 'vol-exit', value: 15 },
  { source: 'perform', target: 'promote', value: 45 },
  { source: 'perform', target: 'retain', value: 55 },
  { source: 'perform', target: 'vol-exit', value: 10 },
  { source: 'perform', target: 'invol-exit', value: 5 },
  { source: 'retain', target: 'promote', value: 15 },
  { source: 'retain', target: 'vol-exit', value: 8 },
  { source: 'retain', target: 'retire', value: 5 },
  { source: 'promote', target: 'growth', value: 35 },
  { source: 'promote', target: 'retain', value: 20 },
];

// ── CohortHeatmap: 입사 기수별 잔존율 ──────────────────────
export const cohortRetentionData: CohortRow[] = [
  { cohort: '2021 H1', values: [100, 92, 85, 78, 72, 68, 65, 62, 60, 58] },
  { cohort: '2021 H2', values: [100, 90, 82, 75, 70, 65, 62, 60, 58, 0] },
  { cohort: '2022 H1', values: [100, 93, 86, 80, 75, 71, 68, 65, 0, 0] },
  { cohort: '2022 H2', values: [100, 88, 80, 73, 68, 64, 61, 0, 0, 0] },
  { cohort: '2023 H1', values: [100, 94, 88, 82, 77, 73, 0, 0, 0, 0] },
  { cohort: '2023 H2', values: [100, 91, 84, 78, 74, 0, 0, 0, 0, 0] },
  { cohort: '2024 H1', values: [100, 95, 89, 84, 0, 0, 0, 0, 0, 0] },
  { cohort: '2024 H2', values: [100, 92, 86, 0, 0, 0, 0, 0, 0, 0] },
  { cohort: '2025 H1', values: [100, 94, 0, 0, 0, 0, 0, 0, 0, 0] },
  { cohort: '2025 H2', values: [100, 0, 0, 0, 0, 0, 0, 0, 0, 0] },
];

export const cohortPeriodLabels = ['입사', '6개월', '1년', '1.5년', '2년', '2.5년', '3년', '3.5년', '4년', '4.5년'];

// ── Bubble: 모듈간 상관관계 ────────────────────────────────
export const moduleCorrelationData: BubbleDataPoint[] = [
  { x: 4.2, y: 85, size: 42, name: '몰입도→성과', group: '문화-성과' },
  { x: 42, y: 87, size: 38, name: 'eNPS→유지율', group: '문화-인력' },
  { x: 78.5, y: 8.2, size: 35, name: '학습참여→내부이동', group: '개발-인력' },
  { x: 32, y: 12.8, size: 30, name: '채용소요일→이직률', group: '채용-인력' },
  { x: 0.94, y: 4.1, size: 28, name: '급여형평성→포용성', group: 'DEI' },
  { x: 78.5, y: 42, size: 45, name: '목표달성→eNPS', group: '성과-문화' },
  { x: 42, y: 78.5, size: 32, name: '교육시간→성과', group: '개발-성과' },
];

// ── LineWithBand: 통합 트렌드 ──────────────────────────────
const quarters = ['2024 Q1', '2024 Q2', '2024 Q3', '2024 Q4', '2025 Q1', '2025 Q2', '2025 Q3', '2025 Q4'];
export const integratedTrendData: LineWithBandSeries[] = [
  {
    name: '인재 유지율',
    color: '#2563EB',
    data: quarters.map((date, i) => ({
      date,
      value: 90 - i * 0.35 + Math.sin(i * 0.6) * 0.5,
      upper: 92 - i * 0.3 + Math.sin(i * 0.6) * 0.5,
      lower: 88 - i * 0.4 + Math.sin(i * 0.6) * 0.5,
    })),
  },
  {
    name: '전체 건강도',
    color: '#10B981',
    data: quarters.map((date, i) => ({
      date,
      value: 72 + i * 0.6 + Math.sin(i * 0.5) * 1.2,
      upper: 75 + i * 0.5 + Math.sin(i * 0.5) * 1.2,
      lower: 69 + i * 0.7 + Math.sin(i * 0.5) * 1.2,
    })),
  },
];

// ── Insights ──────────────────────────────────────────────
export const lifecycleInsights = [
  {
    type: 'success' as const,
    title: '채용→성과 연결 강화',
    description: '사내추천 채널로 입사한 직원의 1년 후 성과 평균이 B+ 이상으로, 외부 채널(B) 대비 높습니다. 채용 채널별 성과 상관계수 0.72.',
    action: '사내추천 채널 확대 및 인센티브 강화',
  },
  {
    type: 'warning' as const,
    title: '온보딩 이탈 주의',
    description: '최근 기수(2025 H1) 6개월 잔존율 94%로 양호하나, 2024 H2 기수는 92%로 전년 동기(95%) 대비 하락. 온보딩 프로그램 점검이 필요합니다.',
    action: '2024 H2 기수 대상 잔존 분석 실시',
  },
  {
    type: 'info' as const,
    title: '교육→승진 상관관계',
    description: '연간 교육 50시간 이상 이수자의 승진율이 28%로, 미달 이수자(12%) 대비 2.3배 높습니다. 리더십 교육 이수는 승진과 가장 강한 상관(r=0.68)을 보입니다.',
    action: '교육-승진 연계 CDP 가이드 배포',
  },
  {
    type: 'danger' as const,
    title: '몰입도↔이직 상관 경고',
    description: '몰입도 3.5점 이하 직원의 6개월 이내 이직 확률이 42%로, 4.0점 이상(8%) 대비 5.25배 높습니다. 현재 해당 그룹 185명(전사 14.8%).',
    action: '저몰입 그룹 긴급 리텐션 플랜 수립',
  },
];
