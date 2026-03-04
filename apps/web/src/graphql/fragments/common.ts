export const PAGINATION_META_FRAGMENT = /* GraphQL */ `
  fragment PaginationMetaFields on PaginationMeta {
    page
    limit
    total
    totalPages
    hasNextPage
    hasPreviousPage
  }
`;

export const KPI_CARD_FRAGMENT = /* GraphQL */ `
  fragment KpiCardFields on KpiCardData {
    kpiId
    label
    value
    previousValue
    changePercent
    trend
    signal
    unit
    format
  }
`;

export const TREND_POINT_FRAGMENT = /* GraphQL */ `
  fragment TrendPointFields on TrendPoint {
    date
    value
    label
  }
`;

export const DISTRIBUTION_ITEM_FRAGMENT = /* GraphQL */ `
  fragment DistributionItemFields on DistributionItem {
    label
    value
    count
    percentage
    color
  }
`;

export const DEPARTMENT_FRAGMENT = /* GraphQL */ `
  fragment DepartmentFields on Department {
    id
    name
    code
    headcount
  }
`;

export const EMPLOYEE_BRIEF_FRAGMENT = /* GraphQL */ `
  fragment EmployeeBriefFields on Employee {
    id
    employeeNumber
    firstName
    lastName
    position
    grade
    status
  }
`;
