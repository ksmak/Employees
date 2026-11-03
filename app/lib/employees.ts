import { EmployeeType } from "./types";

const employees: EmployeeType[] = [
  { id: 1, name: 'John Doe', position: 'Software Engineer' },
  { id: 2, name: 'Jane Smith', position: 'Product Manager' },
  { id: 3, name: 'Alice Johnson', position: 'UX Designer' },
  { id: 4, name: 'Bob Brown', position: 'Data Analyst' },
  { id: 5, name: 'Charlie Davis', position: 'DevOps Engineer' },
  { id: 6, name: 'Diana Evans', position: 'QA Engineer' },
  { id: 7, name: 'Frank Green', position: 'Technical Writer' },
  { id: 8, name: 'Grace Harris', position: 'HR Specialist' },
  { id: 9, name: 'Henry Jackson', position: 'Marketing Manager' },
  { id: 10, name: 'Ivy King', position: 'Sales Executive' },
];

export function getEmployees(): EmployeeType[] {
  return employees;
}

export function getEmployeeById(id: number): EmployeeType | undefined {
  return employees.find((employee) => employee.id === id);
}