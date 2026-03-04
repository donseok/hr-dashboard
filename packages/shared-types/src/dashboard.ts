export enum DashboardModuleId {
  EXECUTIVE_SUMMARY = 'executive-summary',
  HEADCOUNT = 'headcount',
  RECRUITMENT = 'recruitment',
  RETENTION = 'retention',
  COMPENSATION = 'compensation',
  PERFORMANCE = 'performance',
  LEARNING = 'learning',
  DEI = 'dei',
}

export interface DashboardModule {
  id: DashboardModuleId;
  name: string;
  description: string;
  icon: string;
  color: string;
  order: number;
  isEnabled: boolean;
  requiredPermission: string;
}

export interface DashboardLayout {
  userId: string;
  modules: Array<{
    moduleId: DashboardModuleId;
    position: { x: number; y: number; w: number; h: number };
    isVisible: boolean;
  }>;
  updatedAt: string;
}

export interface DashboardFilter {
  dateRange: {
    start: string;
    end: string;
  };
  departments: string[];
  locations: string[];
  employmentTypes: string[];
}
