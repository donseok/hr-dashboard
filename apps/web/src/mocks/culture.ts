import type { RadarIndicator, RadarSeries } from '@/components/charts/RadarChart';
import type { LineWithBandSeries } from '@/components/charts/LineWithBandChart';
import type { HeatmapDataPoint } from '@/components/charts/HeatmapChart';
import type { WordCloudWord } from '@/components/charts/WordCloud';

// ── KPI Data ──────────────────────────────────────────────
export const cultureKpis = {
  engagement: {
    title: '몰입도 지수',
    value: '4.2',
    changePercent: 3.5,
    trend: 'up' as const,
    signal: 'positive' as const,
    unit: '/5.0',
    sparklineData: [3.8, 3.9, 4.0, 4.0, 4.1, 4.1, 4.2, 4.2],
  },
  eNPS: {
    title: 'eNPS',
    value: '42',
    changePercent: 8.2,
    trend: 'up' as const,
    signal: 'positive' as const,
    unit: '',
    sparklineData: [28, 30, 32, 35, 36, 38, 40, 42],
  },
  cultureHealth: {
    title: '문화 건강도',
    value: '76.8',
    changePercent: 2.1,
    trend: 'up' as const,
    signal: 'positive' as const,
    unit: '%',
    sparklineData: [70, 71, 72, 73, 74, 75, 76, 76.8],
  },
  surveyParticipation: {
    title: '서베이 참여율',
    value: '89.3',
    changePercent: -1.5,
    trend: 'down' as const,
    signal: 'warning' as const,
    unit: '%',
    sparklineData: [92, 91, 91, 90, 90, 89, 89, 89.3],
  },
};

// ── Gauge: eNPS Score ─────────────────────────────────────
export const eNPSValue = 42;

// ── LineWithBand: 몰입도 분기별 트렌드 ──────────────────────
const quarters = ['2024 Q1', '2024 Q2', '2024 Q3', '2024 Q4', '2025 Q1', '2025 Q2', '2025 Q3', '2025 Q4'];
export const engagementTrendData: LineWithBandSeries[] = [
  {
    name: '몰입도 지수',
    color: '#7C3AED',
    data: quarters.map((date, i) => ({
      date,
      value: 3.8 + i * 0.05 + Math.sin(i * 0.5) * 0.08,
      upper: 4.0 + i * 0.04 + Math.sin(i * 0.5) * 0.08,
      lower: 3.6 + i * 0.06 + Math.sin(i * 0.5) * 0.08,
    })),
  },
];

// ── Radar: 문화 건강도 6개 차원 ──────────────────────────────
export const cultureRadarIndicators: RadarIndicator[] = [
  { name: '소통', max: 5 },
  { name: '리더십', max: 5 },
  { name: '성장', max: 5 },
  { name: '보상', max: 5 },
  { name: '워라밸', max: 5 },
  { name: '협업', max: 5 },
];

export const cultureRadarSeries: RadarSeries[] = [
  { name: '현재 점수', values: [4.2, 3.8, 4.0, 3.5, 4.3, 4.1], color: '#7C3AED' },
  { name: '목표', values: [4.5, 4.3, 4.5, 4.0, 4.5, 4.5], color: '#94A3B8' },
  { name: '업계 평균', values: [3.8, 3.6, 3.7, 3.5, 3.9, 3.8], color: '#F59E0B' },
];

// ── Heatmap: 부서별 몰입도 ────────────────────────────────
const depts = ['개발본부', '영업본부', '마케팅본부', '경영지원', '디자인센터', '기획실'];
const dimensions = ['소통', '리더십', '성장', '보상', '워라밸', '협업'];

export const engagementHeatmapData: {
  data: HeatmapDataPoint[];
  xLabels: string[];
  yLabels: string[];
} = {
  xLabels: dimensions,
  yLabels: depts,
  data: [
    // 개발본부
    { x: 0, y: 0, value: 4.3 }, { x: 1, y: 0, value: 3.9 }, { x: 2, y: 0, value: 4.5 },
    { x: 3, y: 0, value: 3.2 }, { x: 4, y: 0, value: 4.1 }, { x: 5, y: 0, value: 4.4 },
    // 영업본부
    { x: 0, y: 1, value: 3.8 }, { x: 1, y: 1, value: 4.2 }, { x: 2, y: 1, value: 3.5 },
    { x: 3, y: 1, value: 3.8 }, { x: 4, y: 1, value: 3.4 }, { x: 5, y: 1, value: 3.9 },
    // 마케팅본부
    { x: 0, y: 2, value: 4.1 }, { x: 1, y: 2, value: 3.7 }, { x: 2, y: 2, value: 4.0 },
    { x: 3, y: 2, value: 3.6 }, { x: 4, y: 2, value: 4.4 }, { x: 5, y: 2, value: 4.2 },
    // 경영지원
    { x: 0, y: 3, value: 3.5 }, { x: 1, y: 3, value: 3.3 }, { x: 2, y: 3, value: 3.2 },
    { x: 3, y: 3, value: 3.8 }, { x: 4, y: 3, value: 4.0 }, { x: 5, y: 3, value: 3.6 },
    // 디자인센터
    { x: 0, y: 4, value: 4.5 }, { x: 1, y: 4, value: 4.0 }, { x: 2, y: 4, value: 4.3 },
    { x: 3, y: 4, value: 3.4 }, { x: 4, y: 4, value: 4.6 }, { x: 5, y: 4, value: 4.5 },
    // 기획실
    { x: 0, y: 5, value: 4.0 }, { x: 1, y: 5, value: 3.8 }, { x: 2, y: 5, value: 4.1 },
    { x: 3, y: 5, value: 3.5 }, { x: 4, y: 5, value: 4.2 }, { x: 5, y: 5, value: 4.0 },
  ],
};

// ── WordCloud: 서베이 주요 키워드 ──────────────────────────
export const surveyKeywords: WordCloudWord[] = [
  { text: '성장기회', weight: 95, sentiment: 'positive' },
  { text: '자율성', weight: 88, sentiment: 'positive' },
  { text: '소통', weight: 82, sentiment: 'positive' },
  { text: '워라밸', weight: 78, sentiment: 'positive' },
  { text: '보상', weight: 75, sentiment: 'negative' },
  { text: '리더십', weight: 70, sentiment: 'neutral' },
  { text: '야근', weight: 65, sentiment: 'negative' },
  { text: '교육', weight: 62, sentiment: 'positive' },
  { text: '복지', weight: 60, sentiment: 'positive' },
  { text: '인사평가', weight: 58, sentiment: 'negative' },
  { text: '팀워크', weight: 55, sentiment: 'positive' },
  { text: '비전', weight: 52, sentiment: 'neutral' },
  { text: '커리어', weight: 50, sentiment: 'positive' },
  { text: '회의문화', weight: 48, sentiment: 'negative' },
  { text: '다양성', weight: 45, sentiment: 'positive' },
  { text: '유연근무', weight: 42, sentiment: 'positive' },
  { text: '피드백', weight: 40, sentiment: 'neutral' },
  { text: '승진', weight: 38, sentiment: 'negative' },
  { text: '동료', weight: 35, sentiment: 'positive' },
  { text: '혁신', weight: 32, sentiment: 'positive' },
];

// ── Insights ──────────────────────────────────────────────
export const cultureInsights = [
  {
    type: 'success' as const,
    title: 'eNPS 지속 상승 추세',
    description: 'eNPS가 42점으로 전분기(38점) 대비 4점 상승했습니다. 업계 평균(32점) 대비 10점 높은 수준이며, 특히 디자인센터(58점)가 가장 높습니다.',
    action: '디자인센터 우수 사례 전사 확산',
  },
  {
    type: 'warning' as const,
    title: '보상 만족도 하위',
    description: '문화 건강도 6개 차원 중 "보상"이 3.5점으로 가장 낮습니다. 특히 개발본부(3.2점)가 심각하며, 시장 보상 경쟁력 강화가 시급합니다.',
    action: '시장 보상 벤치마크 리서치 착수',
  },
  {
    type: 'danger' as const,
    title: '경영지원 몰입도 저하',
    description: '경영지원 부서의 전반적 몰입도가 3.4점으로 전사 평균(4.2점) 대비 0.8점 낮습니다. "성장"(3.2점)과 "리더십"(3.3점) 항목이 특히 부진합니다.',
    action: '경영지원 리더십 워크숍 및 CDP 수립',
  },
  {
    type: 'info' as const,
    title: '서베이 키워드 분석',
    description: '긍정 키워드: 성장기회, 자율성, 소통 / 부정 키워드: 보상, 야근, 인사평가. 전체 응답 중 긍정 비율 68%, 부정 비율 22%입니다.',
    action: '부정 키워드 심층 FGI 실시',
  },
];
