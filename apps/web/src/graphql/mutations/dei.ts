export const RECORD_DEI_METRIC_MUTATION = /* GraphQL */ `
  mutation RecordDeiMetric($input: RecordDeiMetricInput!) {
    recordDeiMetric(input: $input) {
      id
      period
      dimension
      category
      value
    }
  }
`;
