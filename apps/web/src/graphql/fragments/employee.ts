export const EMPLOYEE_BRIEF_FIELDS = /* GraphQL */ `
  fragment EmployeeBriefFields on Employee {
    id
    employeeNumber
    firstName
    lastName
    position
    grade
    status
  }
`;

export const EMPLOYEE_FULL_FIELDS = /* GraphQL */ `
  fragment EmployeeFullFields on Employee {
    id
    employeeNumber
    firstName
    lastName
    email
    position
    grade
    hireDate
    terminationDate
    employmentType
    status
    location
    department {
      id
      name
      code
    }
    manager {
      id
      firstName
      lastName
    }
    createdAt
  }
`;
