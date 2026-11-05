'use client'

import { useRouter, useSearchParams, usePathname } from 'next/navigation'

interface EmployeesPaginationProps {
    currentPage: number,
    totalPages: number,
    totals: number,
}

export default function EmployeesPagination({ currentPage, totalPages, totals }: EmployeesPaginationProps) {
    const router = useRouter()
    const pathname = usePathname()
    const searchParams = useSearchParams()

    function goToPage(page: number) {
        const params = new URLSearchParams(searchParams.toString())
        params.set('page', String(page))
        router.push(`${pathname}?${params.toString()}`)
    }

    const maxBtn = 4
    let start = Math.floor((currentPage - 1) / maxBtn) * maxBtn + 1
    if (start + maxBtn - 1 > totalPages) {
        start = Math.max(1, totalPages - maxBtn + 1)
    }
    let end = Math.min(totalPages, start + maxBtn - 1)

    return (
        <div className='py-3 grid grid-cols-3'>
            <div className='col-start-2 justify-self-center'>
                <div className='flex flex-row gap-2'>
                    <button
                        className="border border-gray-300 p-1 text-xs bg-gray-200 hover:bg-gray-300 rounded-xs"
                        disabled={currentPage <= 1}
                        onClick={() => goToPage(currentPage - 1)}
                    >
                        Предыдущий
                    </button>
                    {currentPage > maxBtn && <span>...</span>}
                    {Array.from({ length: end - start + 1 }, (_, i) => (
                        <button
                            key={i}
                            className={`border border-gray-300 p-1 text-xs ${currentPage == start + i ? "bg-white" : "bg-gray-200"} hover:bg-gray-300 rounded-xs`}
                            onClick={() => goToPage(start + i)}
                        >
                            {start + i}
                        </button>
                    ))}
                    {end < totalPages && <span>...</span>}
                    <button
                        className="border border-gray-300 p-1 text-xs bg-gray-200 hover:bg-gray-300 rounded-xs"
                        disabled={currentPage >= totalPages}
                        onClick={() => goToPage(currentPage + 1)}
                    >
                        Следующий
                    </button>
                </div>
            </div>
            <div className="justify-self-center text-xs">
                Всего: {totals}
            </div>
        </div>
    );
}