import { KPI_CARD_FRAGMENT } from '../fragments/common';

export const LIFECYCLE_DASHBOARD_QUERY = /* GraphQL */ `
  ${KPI_CARD_FRAGMENT}
  query LifecycleDashboard {
    lifecycleDashboard {
      kpis { ...KpiCardFields }
      employeeJourney {
        stage
        avgDuration
        count
        conversionRate
      }
      crossModuleInsights {
        title
        description
        sourceModule
        targetModule
        correlationStrength
        insight
      }
      attritionCorrelation {
        factor
        correlationWithAttrition
        sampleSize
        significance
      }
      moduleKpiSummary {
        module
        kpis { ...KpiCardFields }
        overallSignal
      }
    }
  }
`;

export const EMPLOYEE_JOURNEY_QUERY = /* GraphQL */ `
  query EmployeeJourney($employeeId: ID!) {
    employeeJourney(employeeId: $employeeId) {
      stage
      avgDuration
      count
      conversionRate
    }
  }
`;

export const CROSS_MODULE_ANALYSIS_QUERY = /* GraphQL */ `
  query CrossModuleAnalysis {
    crossModuleAnalysis {
      title
      description
      sourceModule
      targetModule
      correlationStrength
      insight
    }
  }
`;

export const ATTRITION_CORRELATION_QUERY = /* GraphQL */ `
  query AttritionCorrelation {
    attritionCorrelation {
      factor
      correlationWithAttrition
      sampleSize
      significance
    }
  }
`;
