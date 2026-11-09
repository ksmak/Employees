'use client'

import Link from "next/link"

export default function Logo() {
    return (
        <Link href="/" className="flex items-center justify-center">
            <img src="/logo.png" alt="Logo" className="h-10 w-10 mr-2" />
            <span className="text-md font-bold text-gray-800">Employee Management</span>
        </Link>
    );
}