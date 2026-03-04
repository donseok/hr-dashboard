export enum UserRole {
  SUPER_ADMIN = 'super_admin',
  HR_ADMIN = 'hr_admin',
  HR_MANAGER = 'hr_manager',
  HR_ANALYST = 'hr_analyst',
  DEPARTMENT_HEAD = 'department_head',
  VIEWER = 'viewer',
}

export enum Permission {
  DASHBOARD_VIEW = 'dashboard:view',
  DASHBOARD_EDIT = 'dashboard:edit',
  EMPLOYEE_VIEW = 'employee:view',
  EMPLOYEE_EDIT = 'employee:edit',
  EMPLOYEE_CREATE = 'employee:create',
  EMPLOYEE_DELETE = 'employee:delete',
  REPORT_VIEW = 'report:view',
  REPORT_EXPORT = 'report:export',
  SETTINGS_VIEW = 'settings:view',
  SETTINGS_EDIT = 'settings:edit',
  ANALYTICS_VIEW = 'analytics:view',
  ANALYTICS_ADVANCED = 'analytics:advanced',
}

export interface AuthUser {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  permissions: Permission[];
  departmentId: string | null;
  avatarUrl: string | null;
  lastLoginAt: string;
  createdAt: string;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  user: AuthUser;
  tokens: AuthTokens;
}
