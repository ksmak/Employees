'use client'

import { createContext, useContext, useEffect, useState } from 'react'
import { DictionaryType } from '@/app/lib/types'
import { getDictionary } from '@/app/lib/actions'

type Dictionaries = {
    departments: DictionaryType[]
    managements: DictionaryType[]
    positions: DictionaryType[]
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
                        getDictionary('departments'),
                        getDictionary('managements'),
                        getDictionary('positions'),
                    ])

                if (
                    departmentsRes.error ||
                    managementsRes.error ||
                    positionsRes.error
                ) {
                    throw new Error('Ошибка загрузки справочников')
                }

                setData({
                    departments: departmentsRes.dictionary || [],
                    managements: managementsRes.dictionary || [],
                    positions: positionsRes.dictionary || []
                })

            } catch (error) {
                setError(
                    error instanceof Error ? error.message : 'Неизвестная ошибка'
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