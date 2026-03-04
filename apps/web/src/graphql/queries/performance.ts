import { KPI_CARD_FRAGMENT, TREND_POINT_FRAGMENT } from '../fragments/common';

export const PERFORMANCE_DASHBOARD_QUERY = /* GraphQL */ `
  ${KPI_CARD_FRAGMENT}
  ${TREND_POINT_FRAGMENT}
  query PerformanceDashboard($cycleId: ID) {
    performanceDashboard(cycleId: $cycleId) {
      kpis { ...KpiCardFields }
      activeCycle {
        id
        name
        status
        startDate
        endDate
        totalReviews
        completedReviews
        completionRate
      }
      ratingDistribution {
        rating
        count
        percentage
      }
      departmentPerformance {
        departmentId
        departmentName
        averageRating
        reviewCount
        completionRate
      }
      completionTrend { ...TrendPointFields }
      goalAchievementRate
    }
  }
`;

export const NINE_BOX_DATA_QUERY = /* GraphQL */ `
  query NineBoxData($cycleId: ID!) {
    nineBoxData(cycleId: $cycleId) {
      performance
      potential
      count
      employees {
        id
        firstName
        lastName
        position
        department
        rating
      }
    }
  }
`;

export const CALIBRATION_DATA_QUERY = /* GraphQL */ `
  query CalibrationData($cycleId: ID!) {
    calibrationData(cycleId: $cycleId) {
      cycleId
      totalReviews
      completedReviews
      ratingDistribution {
        rating
        count
        percentage
      }
      departmentAverages {
        departmentId
        departmentName
        averageRating
        reviewCount
        completionRate
      }
    }
  }
`;

export const RATING_DISTRIBUTION_QUERY = /* GraphQL */ `
  query RatingDistribution($cycleId: ID!) {
    ratingDistribution(cycleId: $cycleId) {
      rating
      count
      percentage
    }
  }
`;

export const PERFORMANCE_CYCLES_QUERY = /* GraphQL */ `
  query PerformanceCycles {
    performanceCycles {
      id
      name
      status
      startDate
      endDate
      completionRate
    }
  }
`;
