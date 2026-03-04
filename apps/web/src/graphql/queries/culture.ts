import { KPI_CARD_FRAGMENT, TREND_POINT_FRAGMENT } from '../fragments/common';

export const CULTURE_DASHBOARD_QUERY = /* GraphQL */ `
  ${KPI_CARD_FRAGMENT}
  ${TREND_POINT_FRAGMENT}
  query CultureDashboard {
    cultureDashboard {
      kpis { ...KpiCardFields }
      engagementTrend { ...TrendPointFields }
      eNPS
      surveyParticipationRate
      sentimentAnalysis {
        positive
        neutral
        negative
        topKeywords {
          keyword
          count
          sentiment
        }
      }
      departmentEngagement {
        departmentId
        departmentName
        score
        responseRate
        trend
      }
      recentSurveys {
        id
        title
        type
        status
        responseCount
      }
      activeSurveyCount
      totalResponseCount
    }
  }
`;

export const ENGAGEMENT_TREND_QUERY = /* GraphQL */ `
  ${TREND_POINT_FRAGMENT}
  query EngagementTrend($months: Int) {
    engagementTrend(months: $months) { ...TrendPointFields }
  }
`;

export const ENPS_SCORE_QUERY = /* GraphQL */ `
  query ENPSScore {
    eNPSScore
  }
`;

export const SENTIMENT_ANALYSIS_QUERY = /* GraphQL */ `
  query SentimentAnalysis($surveyId: ID) {
    sentimentAnalysis(surveyId: $surveyId) {
      positive
      neutral
      negative
      topKeywords {
        keyword
        count
        sentiment
      }
    }
  }
`;

export const SURVEYS_QUERY = /* GraphQL */ `
  query Surveys($type: String) {
    surveys(type: $type) {
      id
      title
      description
      type
      status
      startDate
      endDate
      isAnonymous
      responseCount
    }
  }
`;
