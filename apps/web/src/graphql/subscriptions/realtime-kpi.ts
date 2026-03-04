export const KPI_UPDATED_SUBSCRIPTION = /* GraphQL */ `
  subscription KpiUpdated($moduleType: String) {
    kpiUpdated(moduleType: $moduleType) {
      id
      kpiId
      moduleType
      value
      previousValue
      target
      unit
      period
      calculatedAt
    }
  }
`;
