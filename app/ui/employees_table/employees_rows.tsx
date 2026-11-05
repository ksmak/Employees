'use client'

import { ColumnType, EmployeeType } from "@/app/lib/types"
import EmployeesRow from "@/app/ui/employees_table/employees_row"

interface EmployeesRowsProps {
    columns: ColumnType[],
    employees: EmployeeType[],
}

export default function EmployeesRows({
    columns,
    employees,
}: EmployeesRowsProps) {
    const colsWeight = columns.map(col => col.weight).join(" ")

    return (
        <div className="flex-1 min-h-0 overflow-y-scroll bg-white [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-thumb]:bg-gray-300 [&::-webkit-scrollbar-track]:bg-transparent">
            {employees.length > 0 ? (
                employees.map((employee: EmployeeType) => (
                    <EmployeesRow key={employee.id} employee={employee} colsWeight={colsWeight} />
                ))
            ) : (
                <p className="text-xs text-center p-2">Данные не найдены</p>
            )}
        </div>
    )
}