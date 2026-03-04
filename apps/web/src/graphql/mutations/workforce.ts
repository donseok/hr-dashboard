export const UPDATE_EMPLOYEE_MUTATION = /* GraphQL */ `
  mutation UpdateEmployee($id: ID!, $input: UpdateEmployeeInput!) {
    updateEmployee(id: $id, input: $input) {
      id
      firstName
      lastName
      position
      grade
      status
    }
  }
`;

export const TRANSFER_EMPLOYEE_MUTATION = /* GraphQL */ `
  mutation TransferEmployee($input: TransferEmployeeInput!) {
    transferEmployee(input: $input) {
      id
      position
      department { id name }
    }
  }
`;
