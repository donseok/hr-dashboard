export interface Employee {
  id: string;
  employeeNumber: string;
  firstName: string;
  lastName: string;
  email: string;
  departmentId: string;
  positionId: string;
  managerId: string | null;
  hireDate: string;
  terminationDate: string | null;
  employmentType: EmploymentType;
  status: EmployeeStatus;
  location: string;
  createdAt: string;
  updatedAt: string;
}

export type EmploymentType = 'full-time' | 'part-time' | 'contract' | 'intern';

export type EmployeeStatus = 'active' | 'inactive' | 'on-leave' | 'terminated';

export interface Department {
  id: string;
  name: string;
  code: string;
  parentId: string | null;
  headId: string | null;
  headcount: number;
  createdAt: string;
  updatedAt: string;
}

export interface Position {
  id: string;
  title: string;
  level: string;
  departmentId: string;
  minSalary: number;
  maxSalary: number;
  createdAt: string;
  updatedAt: string;
}

export interface EmployeeDetail extends Employee {
  department: Department;
  position: Position;
  manager: Pick<Employee, 'id' | 'firstName' | 'lastName' | 'email'> | null;
}
