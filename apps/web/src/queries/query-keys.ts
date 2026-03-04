/**
 * Query key factory for TanStack Query.
 * Follows the pattern: [module, entity, ...params]
 * This enables targeted invalidation at any granularity.
 */

interface DateRange {
  start: string;
  end: string;
}

interface Filters {
  dateRange?: DateRange;
  departmentIds?: string[];
  [key: string]: unknown;
}

export const queryKeys = {
  // ── Recruitment ──────────────────────────────────────────
  recruitment: {
    all: ['recruitment'] as const,
    dashboard: (filters?: Filters) =>
      [...queryKeys.recruitment.all, 'dashboard', filters] as const,
    funnel: (filters?: Filters) =>
      [...queryKeys.recruitment.all, 'funnel', filters] as const,
    channels: (filters?: Filters) =>
      [...queryKeys.recruitment.all, 'channels', filters] as const,
    trend: (months?: number) =>
      [...queryKeys.recruitment.all, 'trend', months] as const,
    requisitions: (filters?: Filters) =>
      [...queryKeys.recruitment.all, 'requisitions', filters] as const,
    requisition: (id: string) =>
      [...queryKeys.recruitment.all, 'requisition', id] as const,
  },

  // ── Workforce ───────────────────────────────────────────
  workforce: {
    all: ['workforce'] as const,
    dashboard: (filters?: Filters) =>
      [...queryKeys.workforce.all, 'dashboard', filters] as const,
    headcountTrend: (months?: number) =>
      [...queryKeys.workforce.all, 'headcount-trend', months] as const,
    turnover: (filters?: Filters) =>
      [...queryKeys.workforce.all, 'turnover', filters] as const,
    employees: (filters?: Filters) =>
      [...queryKeys.workforce.all, 'employees', filters] as const,
    employee: (id: string) =>
      [...queryKeys.workforce.all, 'employee', id] as const,
    departments: () =>
      [...queryKeys.workforce.all, 'departments'] as const,
    orgStructure: (deptId?: string) =>
      [...queryKeys.workforce.all, 'org-structure', deptId] as const,
  },

  // ── Performance ─────────────────────────────────────────
  performance: {
    all: ['performance'] as const,
    dashboard: (cycleId?: string) =>
      [...queryKeys.performance.all, 'dashboard', cycleId] as const,
    cycles: () =>
      [...queryKeys.performance.all, 'cycles'] as const,
    nineBox: (cycleId: string) =>
      [...queryKeys.performance.all, 'nine-box', cycleId] as const,
    calibration: (cycleId: string) =>
      [...queryKeys.performance.all, 'calibration', cycleId] as const,
    ratingDistribution: (cycleId: string) =>
      [...queryKeys.performance.all, 'ratings', cycleId] as const,
  },

  // ── Culture ─────────────────────────────────────────────
  culture: {
    all: ['culture'] as const,
    dashboard: () =>
      [...queryKeys.culture.all, 'dashboard'] as const,
    engagementTrend: (months?: number) =>
      [...queryKeys.culture.all, 'engagement-trend', months] as const,
    eNPS: () =>
      [...queryKeys.culture.all, 'enps'] as const,
    sentiment: (surveyId?: string) =>
      [...queryKeys.culture.all, 'sentiment', surveyId] as const,
    surveys: (type?: string) =>
      [...queryKeys.culture.all, 'surveys', type] as const,
  },

  // ── Development ─────────────────────────────────────────
  development: {
    all: ['development'] as const,
    dashboard: () =>
      [...queryKeys.development.all, 'dashboard'] as const,
    skillGaps: () =>
      [...queryKeys.development.all, 'skill-gaps'] as const,
    programs: (category?: string) =>
      [...queryKeys.development.all, 'programs', category] as const,
    mobility: () =>
      [...queryKeys.development.all, 'mobility'] as const,
  },

  // ── DEI ─────────────────────────────────────────────────
  dei: {
    all: ['dei'] as const,
    dashboard: () =>
      [...queryKeys.dei.all, 'dashboard'] as const,
    payEquity: (grade?: string) =>
      [...queryKeys.dei.all, 'pay-equity', grade] as const,
    trend: (months?: number) =>
      [...queryKeys.dei.all, 'trend', months] as const,
    metrics: (dimension?: string, period?: string) =>
      [...queryKeys.dei.all, 'metrics', dimension, period] as const,
  },

  // ── Lifecycle ───────────────────────────────────────────
  lifecycle: {
    all: ['lifecycle'] as const,
    dashboard: () =>
      [...queryKeys.lifecycle.all, 'dashboard'] as const,
    journey: (employeeId: string) =>
      [...queryKeys.lifecycle.all, 'journey', employeeId] as const,
    crossModule: () =>
      [...queryKeys.lifecycle.all, 'cross-module'] as const,
    attrition: () =>
      [...queryKeys.lifecycle.all, 'attrition'] as const,
  },

  // ── KPI ─────────────────────────────────────────────────
  kpi: {
    all: ['kpi'] as const,
    snapshots: (kpiId?: string, moduleType?: string) =>
      [...queryKeys.kpi.all, 'snapshots', kpiId, moduleType] as const,
    latest: (moduleType?: string) =>
      [...queryKeys.kpi.all, 'latest', moduleType] as const,
  },

  // ── Notifications ───────────────────────────────────────
  notifications: {
    all: ['notifications'] as const,
    list: (unreadOnly?: boolean) =>
      [...queryKeys.notifications.all, 'list', unreadOnly] as const,
    unreadCount: () =>
      [...queryKeys.notifications.all, 'unread-count'] as const,
  },
} as const;
