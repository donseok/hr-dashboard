import {
  KPI_CARD_FRAGMENT,
  TREND_POINT_FRAGMENT,
  DISTRIBUTION_ITEM_FRAGMENT,
} from '../fragments/common';

export const DEI_DASHBOARD_QUERY = /* GraphQL */ `
  ${KPI_CARD_FRAGMENT}
  ${TREND_POINT_FRAGMENT}
  ${DISTRIBUTION_ITEM_FRAGMENT}
  query DeiDashboard {
    deiDashboard {
      kpis { ...KpiCardFields }
      genderDistribution { ...DistributionItemFields }
      payEquityAnalysis {
        grade
        category
        avgSalaryMale
        avgSalaryFemale
        gapPercent
        employeeCount
      }
      deiTrend { ...TrendPointFields }
      inclusionScore
      diversityByDepartment {
        departmentId
        departmentName
        diversityScore
        genderRatio
        employeeCount
      }
      recentMetrics {
        id
        period
        dimension
        category
        value
        benchmark
      }
    }
  }
`;

export const PAY_EQUITY_QUERY = /* GraphQL */ `
  query PayEquityAnalysis($grade: String) {
    payEquityAnalysis(grade: $grade) {
      grade
      category
      avgSalaryMale
      avgSalaryFemale
      gapPercent
      employeeCount
    }
  }
`;

export const DEI_TREND_QUERY = /* GraphQL */ `
  ${TREND_POINT_FRAGMENT}
  query DeiTrend($months: Int) {
    deiTrend(months: $months) { ...TrendPointFields }
  }
`;

export const DEI_METRICS_QUERY = /* GraphQL */ `
  query DeiMetrics($dimension: String, $period: String) {
    deiMetrics(dimension: $dimension, period: $period) {
      id
      period
      dimension
      category
      value
      benchmark
    }
  }
`;
