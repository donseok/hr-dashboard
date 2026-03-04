import {
  KPI_CARD_FRAGMENT,
  TREND_POINT_FRAGMENT,
  DISTRIBUTION_ITEM_FRAGMENT,
  PAGINATION_META_FRAGMENT,
} from '../fragments/common';

export const WORKFORCE_DASHBOARD_QUERY = /* GraphQL */ `
  ${KPI_CARD_FRAGMENT}
  ${TREND_POINT_FRAGMENT}
  ${DISTRIBUTION_ITEM_FRAGMENT}
  query WorkforceDashboard($dateRange: DateRangeInput) {
    workforceDashboard(dateRange: $dateRange) {
      kpis { ...KpiCardFields }
      headcountTrend { ...TrendPointFields }
      headcountByDepartment {
        departmentId
        departmentName
        count
        percentage
      }
      turnoverAnalysis {
        period
        totalTerminations
        voluntaryCount
        involuntaryCount
        turnoverRate
        retentionRate
        avgTenureMonths
      }
      employmentTypeDistribution { ...DistributionItemFields }
      tenureDistribution { ...DistributionItemFields }
      newHiresCount
      terminationsCount
    }
  }
`;

export const HEADCOUNT_TREND_QUERY = /* GraphQL */ `
  ${TREND_POINT_FRAGMENT}
  query HeadcountTrend($months: Int) {
    headcountTrend(months: $months) { ...TrendPointFields }
  }
`;

export const TURNOVER_ANALYSIS_QUERY = /* GraphQL */ `
  query TurnoverAnalysis($dateRange: DateRangeInput) {
    turnoverAnalysis(dateRange: $dateRange) {
      period
      totalTerminations
      voluntaryCount
      involuntaryCount
      turnoverRate
      retentionRate
      avgTenureMonths
    }
  }
`;

export const EMPLOYEES_QUERY = /* GraphQL */ `
  ${PAGINATION_META_FRAGMENT}
  query Employees($filter: EmployeeFilterInput, $pagination: PaginationInput) {
    employees(filter: $filter, pagination: $pagination) {
      data {
        id
        employeeNumber
        firstName
        lastName
        email
        position
        grade
        hireDate
        employmentType
        status
        location
        department { id name }
      }
      meta { ...PaginationMetaFields }
    }
  }
`;

export const DEPARTMENTS_QUERY = /* GraphQL */ `
  query Departments {
    departments {
      id
      name
      code
      headcount
    }
  }
`;

export const ORG_STRUCTURE_QUERY = /* GraphQL */ `
  query OrgStructure($departmentId: String) {
    orgStructure(departmentId: $departmentId) {
      id
      name
      position
      departmentId
      departmentName
      managerId
      directReportCount
    }
  }
`;
