import type { FunnelStage } from '@/components/charts/FunnelChart';
import type { DonutSegment } from '@/components/charts/DonutChart';
import type { LineWithBandSeries } from '@/components/charts/LineWithBandChart';
import type { HeatmapDataPoint } from '@/components/charts/HeatmapChart';
import type { GanttTask } from '@/components/charts/GanttChart';

// ── KPI Data ──────────────────────────────────────────────
export const recruitmentKpis = {
  timeToHire: {
    title: '채용 소요일',
    value: '32',
    changePercent: 5.1,
    trend: 'up' as const,
    signal: 'warning' as const,
    unit: '일',
    sparklineData: [38, 36, 35, 34, 33, 31, 30, 32],
  },
  conversionRate: {
    title: '전환율',
    value: '12.4',
    changePercent: 1.8,
    trend: 'up' as const,
    signal: 'positive' as const,
    unit: '%',
    sparklineData: [10.2, 10.5, 11.0, 11.2, 11.8, 12.0, 12.1, 12.4],
  },
  channelEfficiency: {
    title: '채널 효율',
    value: '3.2',
    changePercent: -12.5,
    trend: 'down' as const,
    signal: 'negative' as const,
    unit: '배',
    sparklineData: [4.1, 3.9, 3.8, 3.5, 3.4, 3.3, 3.1, 3.2],
  },
  offerAcceptRate: {
    title: '오퍼 수락률',
    value: '87.5',
    changePercent: 2.3,
    trend: 'up' as const,
    signal: 'positive' as const,
    unit: '%',
    sparklineData: [82, 83, 84, 85, 86, 86, 87, 87.5],
  },
  costPerHire: {
    title: '채용 단가',
    value: '320',
    changePercent: -8.2,
    trend: 'down' as const,
    signal: 'positive' as const,
    unit: '만원',
    sparklineData: [380, 365, 350, 345, 340, 335, 325, 320],
  },
  earlyTurnover: {
    title: '조기퇴사율',
    value: '8.3',
    changePercent: -2.1,
    trend: 'down' as const,
    signal: 'positive' as const,
    unit: '%',
    sparklineData: [11.2, 10.5, 10.0, 9.8, 9.2, 8.8, 8.5, 8.3],
  },
  pipeline: {
    title: '파이프라인',
    value: '142',
    changePercent: 15.4,
    trend: 'up' as const,
    signal: 'neutral' as const,
    unit: '명',
    sparklineData: [98, 105, 110, 118, 125, 130, 138, 142],
  },
  diversity: {
    title: '다양성 지수',
    value: '0.72',
    changePercent: 3.5,
    trend: 'up' as const,
    signal: 'positive' as const,
    unit: '',
    sparklineData: [0.65, 0.66, 0.67, 0.68, 0.69, 0.70, 0.71, 0.72],
  },
};

// ── Funnel Chart Data ──────────────────────────────────────
export const recruitmentFunnelData: FunnelStage[] = [
  { name: '지원', value: 2840 },
  { name: '서류 통과', value: 1420 },
  { name: '1차 면접', value: 680 },
  { name: '2차 면접', value: 340 },
  { name: '최종 면접', value: 195 },
  { name: '합격', value: 156 },
  { name: '입사', value: 142 },
];

// ── Donut Chart Data (채용 채널 비율) ──────────────────────
export const recruitmentChannelData: DonutSegment[] = [
  { name: '채용사이트', value: 845 },
  { name: '사내추천', value: 520 },
  { name: '헤드헌터', value: 380 },
  { name: 'LinkedIn', value: 290 },
  { name: '캠퍼스', value: 185 },
  { name: '직접지원', value: 150 },
  { name: '기타', value: 80 },
];

// ── LineWithBand Chart Data (채용소요기간 트렌드) ────────────
const months = ['2025.04', '2025.05', '2025.06', '2025.07', '2025.08', '2025.09', '2025.10', '2025.11', '2025.12', '2026.01', '2026.02', '2026.03'];
export const timeToHireTrendData: LineWithBandSeries[] = [
  {
    name: '채용 소요일',
    color: '#2563EB',
    data: months.map((date, i) => ({
      date,
      value: 38 - i * 0.5 + Math.sin(i) * 2,
      upper: 42 - i * 0.4 + Math.sin(i) * 2,
      lower: 34 - i * 0.6 + Math.sin(i) * 2,
    })),
  },
];

// ── Heatmap Chart Data (월별/부서별 채용 현황) ──────────────
const departments = ['개발', '마케팅', '영업', '디자인', 'HR', '재무', '기획'];
const heatmapMonths = ['1월', '2월', '3월', '4월', '5월', '6월', '7월', '8월', '9월', '10월', '11월', '12월'];

export const recruitmentHeatmapData: {
  data: HeatmapDataPoint[];
  xLabels: string[];
  yLabels: string[];
} = {
  xLabels: heatmapMonths,
  yLabels: departments,
  data: departments.flatMap((_, yi) =>
    heatmapMonths.map((_, xi) => ({
      x: xi,
      y: yi,
      value: Math.round(Math.random() * 15 + (yi === 0 ? 5 : 1)),
    })),
  ),
};

// ── Gantt Chart Data (진행 중인 채용 타임라인) ──────────────
export const recruitmentGanttData: GanttTask[] = [
  { id: '1', name: 'Sr. Frontend 개발자', start: '2026-01-15', end: '2026-03-15', progress: 75, category: '개발' },
  { id: '2', name: 'Backend 개발자', start: '2026-02-01', end: '2026-04-01', progress: 45, category: '개발' },
  { id: '3', name: 'DevOps 엔지니어', start: '2026-01-20', end: '2026-03-20', progress: 60, category: '개발' },
  { id: '4', name: '프로덕트 매니저', start: '2026-02-10', end: '2026-04-10', progress: 30, category: '기획' },
  { id: '5', name: '마케팅 매니저', start: '2026-01-05', end: '2026-02-28', progress: 90, category: '마케팅' },
  { id: '6', name: 'UX 디자이너', start: '2026-02-15', end: '2026-04-15', progress: 20, category: '디자인' },
  { id: '7', name: '데이터 분석가', start: '2026-03-01', end: '2026-05-01', progress: 10, category: '데이터' },
  { id: '8', name: 'HR 비즈니스 파트너', start: '2026-02-20', end: '2026-04-20', progress: 35, category: 'HR' },
];

// ── Insights Data ──────────────────────────────────────────
export const recruitmentInsights = [
  {
    type: 'warning' as const,
    title: '개발팀 시니어 포지션 병목',
    description: '개발팀 시니어급 채용 소요일이 업계 평균(28일) 대비 42일로 50% 높습니다. 2차 면접 → 최종 면접 전환율이 45%로 병목이 확인됩니다.',
    action: '면접관 확대 및 프로세스 간소화 검토',
  },
  {
    type: 'success' as const,
    title: 'Offer 수락률 개선 추세',
    description: '최근 3개월간 Offer 수락률이 87.5%로 전년 동기(82.1%) 대비 5.4%p 상승했습니다. 경쟁사 대비 보상 패키지 경쟁력이 강화된 효과입니다.',
    action: '현 보상 체계 유지 및 모니터링',
  },
  {
    type: 'danger' as const,
    title: '채널 효율 하락 경고',
    description: '헤드헌터 채널의 채용당 비용이 520만원으로 직접 채용(180만원) 대비 2.9배 높습니다. 사내추천 프로그램 강화를 권고합니다.',
    action: '사내추천 인센티브 3배 상향 검토',
  },
  {
    type: 'info' as const,
    title: '파이프라인 예측',
    description: '현재 파이프라인 142명 기준, 3월 말까지 예상 입사자 18~22명입니다. Q1 목표(25명) 대비 72~88% 달성 전망입니다.',
    action: '추가 소싱 채널 활성화 필요',
  },
];
