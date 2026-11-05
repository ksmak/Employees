'use client'

import { ColumnType } from "@/app/lib/types"

interface EmployeesTitleProps {
    columns: ColumnType[],
}

export default function EmployeesTitle({ columns }: EmployeesTitleProps) {
    const colsWeight = columns.map(col => col.weight).join(" ")

    return (
        <div
            className="grid text-xs font-medium bg-gray-200 pr-2"
            style={{ gridTemplateColumns: colsWeight }}
        >
            {columns.map((col, index) => (
                <div
                    key={index}
                    className="overflow-hidden whitespace-nowrap text-ellipsis px-1 border border-gray-300 text-center"
                >
                    {col.title}
                </div>
            ))}
        </div>
    )
}