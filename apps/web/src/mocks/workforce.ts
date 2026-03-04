import type { TreemapNode } from '@/components/charts/TreemapChart';
import type { WaterfallItem } from '@/components/charts/WaterfallChart';
import type { StackedBarSeries } from '@/components/charts/StackedBarChart';
import type { LineWithBandSeries } from '@/components/charts/LineWithBandChart';
import type { SankeyNodeData, SankeyLinkData } from '@/components/charts/d3/SankeyDiagram';

// ── KPI Data ──────────────────────────────────────────────
export const workforceKpis = {
  turnoverRate: {
    title: '이직률',
    value: '12.8',
    changePercent: 1.5,
    trend: 'up' as const,
    signal: 'warning' as const,
    unit: '%',
    sparklineData: [10.2, 10.8, 11.1, 11.5, 11.9, 12.2, 12.5, 12.8],
  },
  keyTalentRetention: {
    title: '핵심인재 유지율',
    value: '94.2',
    changePercent: -0.8,
    trend: 'down' as const,
    signal: 'warning' as const,
    unit: '%',
    sparklineData: [96.0, 95.8, 95.5, 95.2, 95.0, 94.8, 94.5, 94.2],
  },
  fillDays: {
    title: '충원 소요일',
    value: '45',
    changePercent: -5.3,
    trend: 'down' as const,
    signal: 'positive' as const,
    unit: '일',
    sparklineData: [52, 50, 49, 48, 47, 46, 45, 45],
  },
  revenuePerHead: {
    title: '1인당 매출',
    value: '2.8',
    changePercent: 4.2,
    trend: 'up' as const,
    signal: 'positive' as const,
    unit: '억원',
    sparklineData: [2.4, 2.5, 2.5, 2.6, 2.6, 2.7, 2.7, 2.8],
  },
  laborCostRatio: {
    title: '인건비율',
    value: '38.5',
    changePercent: 2.1,
    trend: 'up' as const,
    signal: 'warning' as const,
    unit: '%',
    sparklineData: [35.2, 35.8, 36.2, 36.8, 37.2, 37.8, 38.1, 38.5],
  },
};

// ── Treemap Data (조직 인력 구조) ────────────────────────────
export const orgTreemapData: TreemapNode[] = [
  {
    name: '개발본부',
    value: 420,
    children: [
      { name: 'Frontend', value: 85 },
      { name: 'Backend', value: 120 },
      { name: 'Mobile', value: 65 },
      { name: 'DevOps', value: 40 },
      { name: 'QA', value: 55 },
      { name: 'Data', value: 55 },
    ],
  },
  {
    name: '영업본부',
    value: 280,
    children: [
      { name: '국내영업', value: 120 },
      { name: '해외영업', value: 85 },
      { name: '기술영업', value: 75 },
    ],
  },
  {
    name: '마케팅본부',
    value: 180,
    children: [
      { name: '디지털마케팅', value: 65 },
      { name: '브랜드', value: 45 },
      { name: '콘텐츠', value: 40 },
      { name: 'PR', value: 30 },
    ],
  },
  {
    name: '경영지원',
    value: 165,
    children: [
      { name: 'HR', value: 45 },
      { name: '재무', value: 40 },
      { name: '법무', value: 25 },
      { name: '총무', value: 30 },
      { name: 'IT인프라', value: 25 },
    ],
  },
  {
    name: '디자인센터',
    value: 95,
    children: [
      { name: 'UX', value: 40 },
      { name: 'UI', value: 35 },
      { name: '브랜드디자인', value: 20 },
    ],
  },
  {
    name: '기획실',
    value: 107,
    children: [
      { name: '전략기획', value: 30 },
      { name: '프로덕트', value: 42 },
      { name: '사업개발', value: 35 },
    ],
  },
];

// ── Waterfall Chart Data (분기별 인원 변동) ──────────────────
export const headcountWaterfallData: WaterfallItem[] = [
  { name: '2025 Q1 시작', value: 1180, type: 'total' },
  { name: '신규 채용', value: 45 },
  { name: '내부 전환', value: 12 },
  { name: '자발적 퇴사', value: -38 },
  { name: '비자발적 퇴사', value: -8 },
  { name: '계약 만료', value: -15 },
  { name: '복직', value: 7 },
  { name: '2025 Q1 종료', value: 1183, type: 'total' },
  { name: '신규 채용', value: 52 },
  { name: '자발적 퇴사', value: -42 },
  { name: '비자발적 퇴사', value: -5 },
  { name: '2025 Q2 종료', value: 1188, type: 'total' },
];

// ── StackedBar Data (직급/직종별 인력 구성) ──────────────────
export const positionCompositionData = {
  categories: ['개발본부', '영업본부', '마케팅본부', '경영지원', '디자인센터', '기획실'],
  series: [
    { name: '임원', data: [5, 4, 3, 4, 1, 3], color: '#7C3AED' },
    { name: '부장/팀장', data: [35, 28, 18, 20, 8, 12], color: '#2563EB' },
    { name: '과장/차장', data: [85, 65, 42, 38, 22, 25], color: '#0EA5E9' },
    { name: '대리', data: [140, 98, 62, 55, 32, 35], color: '#10B981' },
    { name: '사원', data: [155, 85, 55, 48, 32, 32], color: '#F59E0B' },
  ] as StackedBarSeries[],
};

// ── LineWithBand Data (이직률 트렌드) ────────────────────────
const months = ['2025.04', '2025.05', '2025.06', '2025.07', '2025.08', '2025.09', '2025.10', '2025.11', '2025.12', '2026.01', '2026.02', '2026.03'];
export const turnoverTrendData: LineWithBandSeries[] = [
  {
    name: '이직률',
    color: '#EF4444',
    data: months.map((date, i) => ({
      date,
      value: 10.2 + i * 0.23 + Math.sin(i * 0.8) * 0.5,
      upper: 12.0 + i * 0.2 + Math.sin(i * 0.8) * 0.5,
      lower: 8.5 + i * 0.25 + Math.sin(i * 0.8) * 0.5,
    })),
  },
];

// ── Sankey Data (부서간 인재 이동) ────────────────────────────
export const talentFlowNodes: SankeyNodeData[] = [
  { id: 'dev-from', name: '개발본부', group: '출발' },
  { id: 'sales-from', name: '영업본부', group: '출발' },
  { id: 'mkt-from', name: '마케팅본부', group: '출발' },
  { id: 'support-from', name: '경영지원', group: '출발' },
  { id: 'design-from', name: '디자인센터', group: '출발' },
  { id: 'plan-from', name: '기획실', group: '출발' },
  { id: 'dev-to', name: '개발본부', group: '도착' },
  { id: 'sales-to', name: '영업본부', group: '도착' },
  { id: 'mkt-to', name: '마케팅본부', group: '도착' },
  { id: 'support-to', name: '경영지원', group: '도착' },
  { id: 'design-to', name: '디자인센터', group: '도착' },
  { id: 'plan-to', name: '기획실', group: '도착' },
];

export const talentFlowLinks: SankeyLinkData[] = [
  { source: 'dev-from', target: 'plan-to', value: 8 },
  { source: 'dev-from', target: 'design-to', value: 5 },
  { source: 'dev-from', target: 'support-to', value: 3 },
  { source: 'sales-from', target: 'mkt-to', value: 12 },
  { source: 'sales-from', target: 'plan-to', value: 6 },
  { source: 'mkt-from', target: 'sales-to', value: 8 },
  { source: 'mkt-from', target: 'plan-to', value: 4 },
  { source: 'support-from', target: 'dev-to', value: 5 },
  { source: 'support-from', target: 'plan-to', value: 3 },
  { source: 'design-from', target: 'dev-to', value: 7 },
  { source: 'design-from', target: 'mkt-to', value: 4 },
  { source: 'plan-from', target: 'dev-to', value: 6 },
  { source: 'plan-from', target: 'sales-to', value: 5 },
  { source: 'plan-from', target: 'mkt-to', value: 3 },
];

// ── Insights Data ──────────────────────────────────────────
export const workforceInsights = [
  {
    type: 'danger' as const,
    title: '이탈 위험 인재 감지',
    description: '개발본부 핵심 인재 12명 중 3명이 이탈 위험 점수 80점 이상입니다. 주요 요인: 보상 경쟁력 하락(2건), 성장기회 부족(1건).',
    action: '해당 인재 1:1 면담 및 리텐션 플랜 수립',
  },
  {
    type: 'warning' as const,
    title: '인건비율 상승 추세',
    description: '인건비율이 38.5%로 목표(36%) 대비 2.5%p 초과했습니다. 최근 6개월간 지속 상승 추세이며, 매출 성장률(8%) 대비 인건비 증가율(14%)이 높습니다.',
    action: '인력 효율화 및 매출 증대 전략 병행',
  },
  {
    type: 'success' as const,
    title: '충원 효율 개선',
    description: '평균 충원 소요일이 45일로 전분기(52일) 대비 13.5% 단축되었습니다. 채용 프로세스 간소화와 사내추천 활성화 효과입니다.',
    action: '현 프로세스 유지 및 확산',
  },
  {
    type: 'info' as const,
    title: '부서간 이동 분석',
    description: '지난 분기 부서간 이동 89건 중 개발→기획(8건), 영업→마케팅(12건) 이동이 가장 활발합니다. 전환 후 성과 유지율은 92%입니다.',
    action: '교차 직무 경험 프로그램 확대 고려',
  },
];
