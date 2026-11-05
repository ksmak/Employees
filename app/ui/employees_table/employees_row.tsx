'use client'

import Link from 'next/link'
import { EmployeeType } from "@/app/lib/types"

interface EmployeesRowProps {
  employee: EmployeeType,
  colsWeight: string,
}

export default function EmployeesRow({
  employee,
  colsWeight,
}: EmployeesRowProps) {
  return (
    <Link
      href={`/employees/${employee.id}`}
      className="grid text-xs even:bg-gray-100 hover:bg-gray-200"
      style={{ gridTemplateColumns: colsWeight }}
    >
      <div className="overflow-hidden whitespace-nowrap text-ellipsis border border-gray-300 px-1">{employee.surname}</div>
      <div className="overflow-hidden whitespace-nowrap text-ellipsis border border-gray-300 px-1">{employee.name}</div>
      <div className="overflow-hidden whitespace-nowrap text-ellipsis border border-gray-300 px-1">{employee.middlename}</div>
      <div className="overflow-hidden whitespace-nowrap text-ellipsis border border-gray-300 px-1">{employee.department_name}</div>
      <div className="overflow-hidden whitespace-nowrap text-ellipsis border border-gray-300 px-1">{employee.management_name}</div>
      <div className="overflow-hidden whitespace-nowrap text-ellipsis border border-gray-300 px-1">{employee.position_name}</div>
    </Link>
  );
}