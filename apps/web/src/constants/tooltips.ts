export const NAV_TOOLTIPS: Record<string, string> = {
  overview: '전체 HR 지표를 한눈에 확인할 수 있는 종합 대시보드입니다.',
  workforce: '부서별 인원 현황, 인력 구성, 입퇴사 추이를 분석합니다.',
  recruitment: '채용 파이프라인, 전환율, 채용 소요 기간을 추적합니다.',
  performance: '성과 평가 현황, 목표 달성률, 평가 분포를 관리합니다.',
  development: '교육 프로그램 현황, 수료율, 역량 개발 추이를 확인합니다.',
  lifecycle: '직원 여정 단계별 현황과 리텐션 분석을 제공합니다.',
  culture: '조직문화 지표, eNPS, 직원 만족도 추이를 분석합니다.',
  dei: '다양성, 형평성, 포용성 지표와 조직 구성을 분석합니다.',
  reports: '맞춤형 리포트를 생성하고 데이터를 내보낼 수 있습니다.',
  settings: '시스템 설정, 알림, 표시 옵션을 관리합니다.',
};

export const KPI_TOOLTIPS: Record<string, string> = {
  totalHeadcount: '현재 재직 중인 전체 직원 수입니다.',
  turnoverRate: '일정 기간 내 퇴사한 직원의 비율입니다.',
  avgTenure: '전체 직원의 평균 근속 기간입니다.',
  openPositions: '현재 채용이 진행 중인 공석 수입니다.',
  recruitmentConversion: '지원자 대비 최종 채용된 인원의 비율입니다.',
  timeToHire: '채용 공고 게시부터 입사 확정까지 소요되는 평균 일수입니다.',
  offerAcceptRate: '오퍼를 받은 후보자 중 수락한 비율입니다.',
  trainingCompletion: '배정된 교육 과정의 완료 비율입니다.',
  eNPS: '직원 순추천 지수로, 조직 추천 의향을 측정합니다.',
  satisfaction: '직원 만족도 설문 결과의 평균 점수입니다.',
  diversityIndex: '조직 구성의 다양성을 나타내는 종합 지수입니다.',
  retentionRate: '일정 기간 동안 재직을 유지한 직원의 비율입니다.',
};

export const CHART_TOOLTIPS: Record<string, string> = {
  headcountTrend: '월별 전체 인원 변동 추이를 보여줍니다.',
  turnoverTrend: '월별 이직률 변동 추이를 보여줍니다.',
  departmentDistribution: '부서별 인원 분포를 보여줍니다.',
  recruitmentFunnel: '채용 단계별 전환율을 보여줍니다.',
  performanceDistribution: '성과 등급별 직원 분포를 보여줍니다.',
  tenureDistribution: '근속 기간별 직원 분포를 보여줍니다.',
  satisfactionTrend: '직원 만족도 변화 추이를 보여줍니다.',
};
