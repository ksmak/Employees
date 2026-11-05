'use client'

import { useRouter, useSearchParams, usePathname } from 'next/navigation'
import { useState, useEffect, useTransition } from 'react'
import { ColumnType, DepartmentType, ManagementType, PositionType } from '@/app/lib/types'

interface EmployeesFilterProps {
    columns: ColumnType[],
    departments: DepartmentType[],
    managements: ManagementType[],
    positions: PositionType[],
}

export default function EmployeesFilter({
    columns,
    departments,
    managements,
    positions,
}: EmployeesFilterProps) {
    const router = useRouter()
    const searchParams = useSearchParams()
    const pathname = usePathname()
    const [isPending, startTransition] = useTransition()

    const [surname, setSurname] = useState(searchParams.get('surname') ?? '')
    const [name, setName] = useState(searchParams.get('name') ?? '')
    const [middlename, setMiddlename] = useState(searchParams.get('middlename') ?? '')
    const [department, setDepartment] = useState(searchParams.get('department') ?? '')
    const [management, setManagement] = useState(searchParams.get('management') ?? '')
    const [position, setPosition] = useState(searchParams.get('position') ?? '')

    const colsWeight = columns.map(col => col.weight).join(" ")

    function updateParams(updates: Record<string, string | null>) {
        const params = new URLSearchParams(searchParams.toString())

        Object.entries(updates).forEach(([key, value]) => {
            if (value) {
                params.set(key, value)
            } else {
                params.delete(key)
            }
        });

        params.set('page', '1')

        startTransition(() => {
            router.push(`${pathname}?${params.toString()}`)
        });
    }

    // Debounce the search input so it doesn't refetch on every keystroke
    useEffect(() => {
        const timeout = setTimeout(() => {
            updateParams({ surname: surname || null, name: name || null, middlename: middlename || null, department: department || null, management: management || null, position: position || null });
        }, 400);

        return () => clearTimeout(timeout);
    }, [surname, name, middlename, department, management, position]);

    return (
        <>
            <div
                className="grid text-xs font-medium pr-2"
                style={{ gridTemplateColumns: colsWeight }}
            >
                <input
                    className="p-1 border border-gray-300 focus:outline-none"
                    value={surname}
                    onChange={(e) => setSurname(e.target.value)}
                />
                <input
                    className="p-1 border border-gray-300 focus:outline-none"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                />
                <input
                    className="p-1 border border-gray-300 focus:outline-none"
                    value={middlename}
                    onChange={(e) => setMiddlename(e.target.value)}
                />
                <select
                    className="p-1 border border-gray-300 focus:outline-none"
                    onChange={(e) => setDepartment(e.target.value)}
                >
                    <option value=""></option>
                    {departments.map((department: DepartmentType) => (
                        <option key={department.id} value={department.id}>{department.name}</option>
                    ))}
                </select>
                <select
                    className="p-1 border border-gray-300 focus:outline-none"
                    onChange={(e) => setManagement(e.target.value)}
                >
                    <option value=""></option>
                    {managements.map((management: ManagementType) => (
                        <option key={management.id} value={management.id}>{management.name}</option>
                    ))}
                </select>
                <select
                    className="p-1 border border-gray-300 focus:outline-none"
                    onChange={(e) => setPosition(e.target.value)}
                >
                    <option value=""></option>
                    {positions.map((position: PositionType) => (
                        <option key={position.id} value={position.id}>{position.name}</option>
                    ))}
                </select>
            </div>
        </>
    );
}