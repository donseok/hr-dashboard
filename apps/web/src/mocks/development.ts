import type { StackedBarSeries } from '@/components/charts/StackedBarChart';
import type { LineWithBandSeries } from '@/components/charts/LineWithBandChart';
import type { RadarIndicator, RadarSeries } from '@/components/charts/RadarChart';
import type { TimelineEvent } from '@/components/charts/d3/InteractiveTimeline';
import type { DonutSegment } from '@/components/charts/DonutChart';

// ── KPI Data ──────────────────────────────────────────────
export const developmentKpis = {
  learningParticipation: {
    title: '학습 참여율',
    value: '78.5',
    changePercent: 5.2,
    trend: 'up' as const,
    signal: 'positive' as const,
    unit: '%',
    sparklineData: [65, 68, 70, 72, 74, 75, 77, 78.5],
  },
  trainingHoursPerHead: {
    title: '1인당 교육시간',
    value: '42',
    changePercent: 12.0,
    trend: 'up' as const,
    signal: 'positive' as const,
    unit: '시간',
    sparklineData: [28, 30, 33, 35, 37, 38, 40, 42],
  },
  internalMobility: {
    title: '내부 이동률',
    value: '8.2',
    changePercent: 1.5,
    trend: 'up' as const,
    signal: 'positive' as const,
    unit: '%',
    sparklineData: [5.8, 6.2, 6.5, 6.8, 7.2, 7.5, 7.8, 8.2],
  },
  leadershipPipeline: {
    title: '리더십 파이프라인',
    value: '1.8',
    changePercent: -5.0,
    trend: 'down' as const,
    signal: 'warning' as const,
    unit: '배',
    sparklineData: [2.2, 2.1, 2.0, 2.0, 1.9, 1.9, 1.8, 1.8],
  },
};

// ── StackedBar: 카테고리별 교육 참여 ────────────────────────
export const trainingCategoryData = {
  categories: ['개발본부', '영업본부', '마케팅본부', '경영지원', '디자인센터', '기획실'],
  series: [
    { name: '직무역량', data: [280, 145, 95, 82, 55, 62], color: '#2563EB' },
    { name: '리더십', data: [85, 65, 42, 48, 18, 30], color: '#7C3AED' },
    { name: '소프트스킬', data: [120, 88, 65, 55, 35, 40], color: '#0EA5E9' },
    { name: '자격증/인증', data: [95, 42, 28, 35, 22, 25], color: '#10B981' },
  ] as StackedBarSeries[],
};

// ── LineWithBand: 월별 교육 시간 트렌드 ──────────────────────
const months = ['2025.04', '2025.05', '2025.06', '2025.07', '2025.08', '2025.09', '2025.10', '2025.11', '2025.12', '2026.01', '2026.02', '2026.03'];
export const trainingHoursTrendData: LineWithBandSeries[] = [
  {
    name: '1인당 교육시간',
    color: '#7C3AED',
    data: months.map((date, i) => ({
      date,
      value: 28 + i * 1.2 + Math.sin(i * 0.8) * 2,
      upper: 35 + i * 1.0 + Math.sin(i * 0.8) * 2,
      lower: 22 + i * 1.3 + Math.sin(i * 0.8) * 2,
    })),
  },
];

// ── Radar: 팀별 역량 ──────────────────────────────────────
export const teamCompetencyIndicators: RadarIndicator[] = [
  { name: '기술전문성', max: 5 },
  { name: '문제해결', max: 5 },
  { name: '데이터활용', max: 5 },
  { name: '프로젝트관리', max: 5 },
  { name: '커뮤니케이션', max: 5 },
  { name: '창의/혁신', max: 5 },
];

export const teamCompetencySeries: RadarSeries[] = [
  { name: '개발본부', values: [4.5, 4.2, 4.0, 3.8, 3.5, 4.1], color: '#2563EB' },
  { name: '기획실', values: [3.5, 4.0, 4.2, 4.5, 4.3, 4.0], color: '#10B981' },
  { name: '디자인센터', values: [3.8, 4.0, 3.5, 3.6, 4.2, 4.8], color: '#F59E0B' },
];

// ── InteractiveTimeline: Growth Journey ──────────────────
export const growthJourneyEvents: TimelineEvent[] = [
  { id: '1', date: '2025-04-01', label: '신입 온보딩 프로그램', description: '전사 신입 42명 대상 2주 과정', category: '온보딩' },
  { id: '2', date: '2025-05-15', label: '리더십 아카데미 1기', description: '차세대 리더 20명 선발 과정', category: '리더십' },
  { id: '3', date: '2025-07-01', label: '테크 컨퍼런스', description: '개발본부 전체 참여, 외부 연사 8명', category: '직무' },
  { id: '4', date: '2025-08-20', label: '직무전환 파일럿', description: '개발↔기획 교차 근무 10명', category: '이동' },
  { id: '5', date: '2025-10-01', label: 'AI/ML 부트캠프', description: '전사 대상 데이터 리터러시 과정', category: '직무' },
  { id: '6', date: '2025-11-15', label: '리더십 아카데미 2기', description: '2기 15명 선발, 멘토링 프로그램 연계', category: '리더십' },
  { id: '7', date: '2026-01-10', label: '글로벌 연수 프로그램', description: '해외 파트너사 방문 연수 8명', category: '글로벌' },
  { id: '8', date: '2026-03-01', label: '승진자 리더 전환 과정', description: '2026년 승진자 35명 대상', category: '리더십' },
];

// ── Donut: 교육 유형별 비율 ────────────────────────────────
export const trainingTypeData: DonutSegment[] = [
  { name: '온라인(자율)', value: 4250 },
  { name: '오프라인(집합)', value: 2180 },
  { name: '외부 위탁', value: 1350 },
  { name: '멘토링/코칭', value: 890 },
  { name: 'OJT', value: 720 },
  { name: '컨퍼런스/세미나', value: 480 },
];

// ── Insights ──────────────────────────────────────────────
export const developmentInsights = [
  {
    type: 'success' as const,
    title: '학습 참여율 지속 상승',
    description: '전사 학습 참여율이 78.5%로 전년(65%) 대비 13.5%p 상승했습니다. 온라인 자율학습 플랫폼 도입 효과가 큽니다.',
    action: '콘텐츠 다양화 및 맞춤 추천 강화',
  },
  {
    type: 'warning' as const,
    title: '리더십 파이프라인 약화',
    description: '리더십 파이프라인 비율이 1.8배로 목표(2.5배) 대비 부족합니다. 차세대 리더 후보군 확대가 필요합니다.',
    action: '리더십 아카데미 3기 조기 운영 검토',
  },
  {
    type: 'info' as const,
    title: '역량 갭 분석',
    description: '전사 주요 역량 갭: 데이터 활용(현재 3.6 / 목표 4.2), 프로젝트관리(3.8 / 4.3). AI/ML 역량 수요가 전년 대비 180% 증가했습니다.',
    action: 'AI/ML 부트캠프 2기 확대 운영',
  },
  {
    type: 'success' as const,
    title: '내부 이동 활성화',
    description: '내부 이동률이 8.2%로 전년(5.8%) 대비 2.4%p 증가했습니다. 직무전환 파일럿 프로그램 참여자의 만족도는 4.5/5.0입니다.',
    action: '직무전환 프로그램 정식 운영 확대',
  },
];
