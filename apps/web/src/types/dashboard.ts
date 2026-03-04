export type ModuleId =
  | 'recruitment'
  | 'workforce'
  | 'performance'
  | 'culture'
  | 'development'
  | 'dei'
  | 'lifecycle';

export interface ModuleConfig {
  id: ModuleId;
  name: string;
  nameKo: string;
  description: string;
  icon: string;
  href: string;
  color: string;
}

export const MODULE_CONFIGS: ModuleConfig[] = [
  { id: 'recruitment', name: 'Recruitment', nameKo: '채용', description: '채용 파이프라인 및 분석', icon: 'UserPlus', href: '/recruitment', color: '#7C3AED' },
  { id: 'workforce', name: 'Workforce', nameKo: '인력', description: '인력 현황 및 분석', icon: 'Users', href: '/workforce', color: '#2563EB' },
  { id: 'performance', name: 'Performance', nameKo: '성과', description: '성과 관리 및 평가', icon: 'TrendingUp', href: '/performance', color: '#EF4444' },
  { id: 'culture', name: 'Culture', nameKo: '문화', description: '조직 문화 및 만족도', icon: 'Heart', href: '/culture', color: '#EC4899' },
  { id: 'development', name: 'Development', nameKo: '육성', description: '교육 및 역량 개발', icon: 'GraduationCap', href: '/development', color: '#06B6D4' },
  { id: 'dei', name: 'DEI', nameKo: 'DEI', description: '다양성, 형평성, 포용성', icon: 'Globe', href: '/dei', color: '#F59E0B' },
  { id: 'lifecycle', name: 'Lifecycle', nameKo: '라이프사이클', description: '직원 여정 관리', icon: 'RefreshCw', href: '/lifecycle', color: '#22C55E' },
];
