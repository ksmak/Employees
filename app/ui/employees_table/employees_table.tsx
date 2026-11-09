'use client'

import { ColumnType, EmployeeType } from "@/app/lib/types"
import EmployeesTitle from "./employees_title"
import EmployeesFilter from "./employees_filter"
import EmployeesRows from "./employees_rows"
import EmployeesPagination from "./employees_pagination"
import EmployeesPanel from "./employees_panel"
import { useDictionaries } from "@/app/contexts/dictionaries"


interface EmployeesTableProps {
    columns: ColumnType[],
    employees: EmployeeType[],
    currentPage: number,
    totalPages: number,
    totals: number,
}


export default function EmployeesTable({
    columns,
    employees,
    currentPage,
    totalPages,
    totals,
}: EmployeesTableProps) {
    const { data, isLoading, error } = useDictionaries()

    if (isLoading) return <p>Загрузка справочников...</p>

    if (error) return <p>{error}</p>

    if (!data) return null

    return (
        <div className="min-h-0 flex flex-col">
            <EmployeesPanel />
            <EmployeesTitle columns={columns} />
            <EmployeesFilter
                columns={columns}
                departments={data.departments}
                managements={data.managements}
                positions={data.positions}
            />
            <EmployeesRows
                columns={columns}
                employees={employees}
            />
            <EmployeesPagination
                currentPage={currentPage}
                totalPages={totalPages}
                totals={totals}
            />
        </div>
    )
}