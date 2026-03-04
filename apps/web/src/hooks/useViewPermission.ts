'use client';

import { useMemo } from 'react';
import { useAuth } from '@/providers/AuthProvider';
import { UserRole } from '@hr-dashboard/shared-types';

export function useViewPermission() {
  const { user, hasPermission } = useAuth();

  const permissions = useMemo(() => {
    if (!user) {
      return {
        canViewDashboard: false,
        canEditDashboard: false,
        canViewEmployees: false,
        canEditEmployees: false,
        canViewReports: false,
        canExportReports: false,
        canViewSettings: false,
        canEditSettings: false,
        canViewAdvancedAnalytics: false,
        isAdmin: false,
      };
    }

    const isAdmin = user.role === UserRole.SUPER_ADMIN || user.role === UserRole.HR_ADMIN;

    return {
      canViewDashboard: hasPermission('dashboard:view'),
      canEditDashboard: hasPermission('dashboard:edit'),
      canViewEmployees: hasPermission('employee:view'),
      canEditEmployees: hasPermission('employee:edit'),
      canViewReports: hasPermission('report:view'),
      canExportReports: hasPermission('report:export'),
      canViewSettings: hasPermission('settings:view'),
      canEditSettings: hasPermission('settings:edit'),
      canViewAdvancedAnalytics: hasPermission('analytics:advanced'),
      isAdmin,
    };
  }, [user, hasPermission]);

  return permissions;
}
