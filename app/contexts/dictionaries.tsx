'use client'

import {
    createContext,
    useContext,
    useEffect,
    useState,
} from 'react'
import { DepartmentType, ManagementType, PositionType } from '../lib/types'

type Dictionaries = {
    departments: DepartmentType[]
    managements: ManagementType[]
    positions: PositionType[]
}

type DictionaryContextType = {
    data: Dictionaries | null
    isLoading: boolean
    error: string | null
}

const DictionaryContext = createContext<DictionaryContextType | undefined>(undefined)

export function DictionaryProvider({
    children,
}: {
    children: React.ReactNode
}) {
    const [data, setData] = useState<Dictionaries | null>(null)
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        async function load() {
            try {
                const [departmentsRes, managementsRes, positionsRes] =
                    await Promise.all([
                        fetch('/api/departments'),
                        fetch('/api/managements'),
                        fetch('/api/positions'),
                    ])

                if (
                    !departmentsRes.ok ||
                    !managementsRes.ok ||
                    !positionsRes.ok
                ) {
                    throw new Error('Ошибка загрузки справочников')
                }

                const [departments, managements, positions] =
                    await Promise.all([
                        departmentsRes.json() as Promise<DepartmentType[]>,
                        managementsRes.json() as Promise<ManagementType[]>,
                        positionsRes.json() as Promise<PositionType[]>,
                    ])

                setData({ departments, managements, positions })
            } catch (err) {
                setError(
                    err instanceof Error ? err.message : 'Неизвестная ошибка'
                )
            } finally {
                setIsLoading(false)
            }
        }

        load()
    }, [])

    return (
        <DictionaryContext.Provider value={{ data, isLoading, error }} >
            {children}
        </DictionaryContext.Provider>
    )
}

export function useDictionaries() {
    const context = useContext(DictionaryContext)

    if (!context) {
        throw new Error('DictionaryProvider is missing')
    }

    return context
}