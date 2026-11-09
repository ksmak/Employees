export type DepartmentType = {
  id: number;
  name: string;
};

export type ManagementType = {
  id: number;
  department_id: number;
  name: string;
};

export type PositionType = {
  id: number;
  management_id: number;
  name: string;
  salary: number;
};

export type EmployeeType = {
  id: number;
  surname: string;
  name: string;
  middlename: string;
  birthdate: string;
  gender: string;
  email: string;
  phone: string;
  address: string;
  department_id: number;
  management_id: number;
  position_id: number;
  department_name: string;
  management_name: string;
  position_name: string;
  created_at: string;
  updated_at: string;
};

export type HistoryType = {
  id: number;
  employee_id: number;
  department_id: number;
  management_id: number;
  position_id: number;
  action: string;
  created_at: string;
  changed_at: string;
};

export type ColumnType = {
  title: string,
  weight: string,
  field: string,
}
