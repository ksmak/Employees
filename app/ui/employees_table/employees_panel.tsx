'use client'

import Link from "next/link"

export default function EmployeesPanel() {
    return (
        <div className="flex flex-row items-center justify-end px-2 py-1">
            <Link
                href="/employees/create"
                className="px-2 py-1 bg-gray-200 border border-gray-300 rounded-xs text-xs hover:cursorpointer hover:bg-gray-300"
            >Добавить нового сотрудника</Link>
        </div>
    )
}