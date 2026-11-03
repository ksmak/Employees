'use client';

import Link from 'next/link'
import { EmployeeType } from "@/app/lib/types"

export function Employee({ employee }: { employee: EmployeeType }) {
  return (
    <Link href={`/employee/${employee.id}`} className="grid grid-cols-2 text-sm p-1 border-b border-gray-300 even:bg-gray-100 hover:bg-gray-200">
      <div>{employee.name}</div>
      <div>{employee.position}</div>
    </Link>
  );
}