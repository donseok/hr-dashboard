export const CREATE_SURVEY_MUTATION = /* GraphQL */ `
  mutation CreateSurvey($input: CreateSurveyInput!) {
    createSurvey(input: $input) {
      id
      title
      type
      status
      startDate
      endDate
    }
  }
`;

export const SUBMIT_SURVEY_RESPONSE_MUTATION = /* GraphQL */ `
  mutation SubmitSurveyResponse($input: SubmitSurveyResponseInput!) {
    submitSurveyResponse(input: $input) {
      id
      score
      submittedAt
    }
  }
`;
