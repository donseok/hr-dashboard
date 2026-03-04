import {
  KPI_CARD_FRAGMENT,
  TREND_POINT_FRAGMENT,
  PAGINATION_META_FRAGMENT,
} from '../fragments/common';

export const RECRUITMENT_DASHBOARD_QUERY = /* GraphQL */ `
  ${KPI_CARD_FRAGMENT}
  ${TREND_POINT_FRAGMENT}
  query RecruitmentDashboard($dateRange: DateRangeInput) {
    recruitmentDashboard(dateRange: $dateRange) {
      kpis { ...KpiCardFields }
      funnel {
        stage
        count
        conversionRate
        avgDaysInStage
      }
      channelEfficiency {
        source
        applicants
        hires
        conversionRate
        avgTimeToHire
        costPerHire
      }
      timeToHireTrend { ...TrendPointFields }
      openRequisitions
      activeApplications
      interviewsThisWeek
      offersExtended
    }
  }
`;

export const RECRUITMENT_FUNNEL_QUERY = /* GraphQL */ `
  query RecruitmentFunnel($requisitionId: ID, $dateRange: DateRangeInput) {
    recruitmentFunnel(requisitionId: $requisitionId, dateRange: $dateRange) {
      stage
      count
      conversionRate
      avgDaysInStage
    }
  }
`;

export const CHANNEL_EFFICIENCY_QUERY = /* GraphQL */ `
  query ChannelEfficiency($dateRange: DateRangeInput) {
    channelEfficiency(dateRange: $dateRange) {
      source
      applicants
      hires
      conversionRate
      avgTimeToHire
      costPerHire
    }
  }
`;

export const TIME_TO_HIRE_TREND_QUERY = /* GraphQL */ `
  ${TREND_POINT_FRAGMENT}
  query TimeToHireTrend($months: Int) {
    timeToHireTrend(months: $months) { ...TrendPointFields }
  }
`;

export const REQUISITIONS_QUERY = /* GraphQL */ `
  ${PAGINATION_META_FRAGMENT}
  query Requisitions($filter: RecruitmentFilterInput, $pagination: PaginationInput) {
    requisitions(filter: $filter, pagination: $pagination) {
      data {
        id
        title
        departmentId
        department { id name }
        grade
        status
        priority
        headcount
        location
        openDate
        targetDate
        applicationCount
      }
      meta { ...PaginationMetaFields }
    }
  }
`;
