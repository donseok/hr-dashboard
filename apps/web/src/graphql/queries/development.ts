import {
  KPI_CARD_FRAGMENT,
  TREND_POINT_FRAGMENT,
  DISTRIBUTION_ITEM_FRAGMENT,
} from '../fragments/common';

export const DEVELOPMENT_DASHBOARD_QUERY = /* GraphQL */ `
  ${KPI_CARD_FRAGMENT}
  ${TREND_POINT_FRAGMENT}
  ${DISTRIBUTION_ITEM_FRAGMENT}
  query DevelopmentDashboard {
    developmentDashboard {
      kpis { ...KpiCardFields }
      programsByCategory { ...DistributionItemFields }
      enrollmentTrend { ...TrendPointFields }
      completionRate
      topPrograms {
        id
        title
        category
        format
        enrollmentCount
      }
      skillGapAnalysis {
        skill
        currentLevel
        requiredLevel
        gap
        employeeCount
      }
      internalMobilityRate
      leadershipPipelineRatio
    }
  }
`;

export const SKILL_GAP_ANALYSIS_QUERY = /* GraphQL */ `
  query SkillGapAnalysis {
    skillGapAnalysis {
      skill
      currentLevel
      requiredLevel
      gap
      employeeCount
    }
  }
`;

export const TRAINING_PROGRAMS_QUERY = /* GraphQL */ `
  query TrainingPrograms($category: String) {
    trainingPrograms(category: $category) {
      id
      title
      description
      category
      provider
      format
      duration
      isActive
      enrollmentCount
    }
  }
`;

export const INTERNAL_MOBILITY_QUERY = /* GraphQL */ `
  query InternalMobility {
    internalMobilityRate
  }
`;
