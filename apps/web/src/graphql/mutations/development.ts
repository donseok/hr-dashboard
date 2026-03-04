export const CREATE_PROGRAM_MUTATION = /* GraphQL */ `
  mutation CreateProgram($input: CreateProgramInput!) {
    createProgram(input: $input) {
      id
      title
      category
      format
      isActive
    }
  }
`;

export const ENROLL_EMPLOYEE_MUTATION = /* GraphQL */ `
  mutation EnrollEmployee($input: EnrollEmployeeInput!) {
    enrollEmployee(input: $input) {
      id
      status
      enrolledAt
    }
  }
`;

export const COMPLETE_TRAINING_MUTATION = /* GraphQL */ `
  mutation CompleteTraining($enrollmentId: ID!, $score: Float) {
    completeTraining(enrollmentId: $enrollmentId, score: $score) {
      id
      status
      completedAt
      score
    }
  }
`;
