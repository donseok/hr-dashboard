export const CREATE_REQUISITION_MUTATION = /* GraphQL */ `
  mutation CreateRequisition($input: CreateRequisitionInput!) {
    createRequisition(input: $input) {
      id
      title
      status
      departmentId
      headcount
    }
  }
`;

export const UPDATE_REQUISITION_STATUS_MUTATION = /* GraphQL */ `
  mutation UpdateRequisitionStatus($id: ID!, $status: String!) {
    updateRequisitionStatus(id: $id, status: $status) {
      id
      status
    }
  }
`;

export const UPDATE_APPLICATION_MUTATION = /* GraphQL */ `
  mutation UpdateApplication($input: UpdateApplicationInput!) {
    updateApplication(input: $input) {
      id
      stage
      status
      score
    }
  }
`;

export const SCHEDULE_INTERVIEW_MUTATION = /* GraphQL */ `
  mutation ScheduleInterview($input: ScheduleInterviewInput!) {
    scheduleInterview(input: $input) {
      id
      type
      scheduledAt
      duration
    }
  }
`;

export const MAKE_OFFER_MUTATION = /* GraphQL */ `
  mutation MakeOffer($input: MakeOfferInput!) {
    makeOffer(input: $input) {
      id
      stage
      status
    }
  }
`;
