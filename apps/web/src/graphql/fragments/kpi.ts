export const KPI_CARD_FIELDS = /* GraphQL */ `
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

export const KPI_SNAPSHOT_FIELDS = /* GraphQL */ `
  fragment KpiSnapshotFields on KpiSnapshot {
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
`;
