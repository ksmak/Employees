'use client'

import { ColumnType, DepartmentType, EmployeeType, ManagementType, PositionType } from "@/app/lib/types"
import EmployeesTitle from "./employees_title"
import EmployeesFilter from "./employees_filter"
import EmployeesRows from "./employees_rows"
import EmployeesPagination from "./employees_pagination"


interface EmployeesTableProps {
    columns: ColumnType[],
    employees: EmployeeType[],
    departments: DepartmentType[],
    managements: ManagementType[],
    positions: PositionType[],
    currentPage: number,
    totalPages: number,
    totals: number,
}


export default function EmployeesTable({
    columns,
    employees,
    departments,
    managements,
    positions,
    currentPage,
    totalPages,
    totals,
}: EmployeesTableProps) {
    return (
        <div className="min-h-0 flex flex-col">
            <EmployeesTitle columns={columns} />
            <EmployeesFilter columns={columns} departments={departments} managements={managements} positions={positions} />
            <EmployeesRows columns={columns} employees={employees} />
            <EmployeesPagination currentPage={currentPage} totalPages={totalPages} totals={totals} />
        </div>
    )
}