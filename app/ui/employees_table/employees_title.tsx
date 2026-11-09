'use client'

import { ColumnType } from "@/app/lib/types"
import { useRouter, useSearchParams, usePathname } from 'next/navigation'
import { useTransition } from "react"

interface EmployeesTitleProps {
    columns: ColumnType[],
}

export default function EmployeesTitle({ columns }: EmployeesTitleProps) {
    const router = useRouter()
    const searchParams = useSearchParams()
    const sort = searchParams.get('sort')
    const sortField = searchParams.get('sortField')
    const pathname = usePathname()
    const [isPending, startTransition] = useTransition()

    const colsWeight = columns.map(col => col.weight).join(" ")

    function handlerSorting(updates: Record<string, string | null>) {
        const params = new URLSearchParams(searchParams.toString())

        if (updates['sortField']) {
            params.set('sortField', updates['sortField'])
            if (sort === 'asc') {
                params.set('sort', 'desc')
            } else {
                params.set('sort', 'asc')
            }
        }

        startTransition(() => {
            router.push(`${pathname}?${params.toString()}`)
        });
    }



    return (
        <div
            className="grid text-xs font-medium bg-gray-200 pr-2"
            style={{ gridTemplateColumns: colsWeight }}
        >
            {columns.map((col, index) => (
                <div
                    key={index}
                    className="overflow-hidden whitespace-nowrap text-ellipsis px-1 border border-gray-300 text-center hover:cursor-pointer"
                    onClick={() => handlerSorting({ sort: sort || null, sortField: col.field || null })}
                >
                    {sortField === col.field ? sort === 'asc' ? `${col.title} ↑` : `${col.title} ↓` : col.title}
                </div>
            ))}
        </div>
    )
}