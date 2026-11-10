'use client'

import { deleteDictionary, updateDictionary } from "@/app/lib/actions";
import { DictionaryType } from "@/app/lib/types";
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { useState, useTransition } from "react";

interface DictionaryPanelProps {
    dict: string;
    data: DictionaryType[]
}

export default function DictionaryPanel({
    dict,
    data,
}: DictionaryPanelProps) {
    const router = useRouter()
    const pathname = usePathname()
    const searchParams = useSearchParams();
    const [isPending, startTransition] = useTransition()
    const [edit, setEdit] = useState(false)
    const [del, setDel] = useState(false)
    const [message, setMessage] = useState("")
    const [dictId, setDictId] = useState<number | null>(null)
    const [value, setValue] = useState<string>("")

    function setDictionary(dict: string) {
        const params = new URLSearchParams(searchParams.toString())
        params.set('dict', dict)
        startTransition(() => {
            router.push(`${pathname}?${params.toString()}`)
        });
    }

    async function handlerDelete() {
        if (!dictId) {
            setDel(false)
            return
        }

        const result = await deleteDictionary(dict, dictId)

        if (result && "error" in result) {
            setMessage(result.error)
            setDel(false)
            return
        }

        setMessage("")
        setDel(false)
    }

    async function handlerEdit() {
        const result = await updateDictionary(dict, dictId, value)

        if (result && "error" in result) {
            setMessage(result.error)
            setEdit(false)
            return
        }

        setMessage("")
        setEdit(false)
    }

    return (
        <div>
            {del && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                    <div className="bg-white p-6 rounded-lg shadow-xl max-w-sm w-full">
                        <h3 className="text-sm font-bold mb-4">Удаление</h3>
                        <p className="mb-4 text-xs">Удалить запись?</p>
                        <div className='flex flex-row gap-3 items-center justify-center'>
                            <button
                                onClick={handlerDelete}
                                className="px-2 py-1 bg-red-300 rounded-sm text-xs"
                            >
                                Удалить
                            </button>
                            <button
                                onClick={() => setDel(false)}
                                className="px-2 py-1 bg-gray-300 rounded-sm text-xs"
                            >
                                Отмена
                            </button>
                        </div>
                    </div>
                </div>
            )}
            {edit && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                    <div className="bg-white p-6 rounded-lg shadow-xl max-w-sm w-full">
                        <h3 className="text-sm font-bold mb-4">Редактировать</h3>
                        <input
                            className="text-xs border border-gray-300 rounded p-1 w-full"
                            type="text"
                            onChange={(e) => setValue(e.target.value)}
                            value={value}
                        />
                        <div className='mt-3 flex flex-row gap-3 items-center justify-center'>
                            <button
                                onClick={handlerEdit}
                                className="px-2 py-1 bg-red-300 rounded-sm text-xs"
                            >
                                Сохранить
                            </button>
                            <button
                                onClick={() => setEdit(false)}
                                className="px-2 py-1 bg-gray-300 rounded-sm text-xs"
                            >
                                Отмена
                            </button>
                        </div>
                    </div>
                </div>
            )}
            <div className="flex flex-row justify-between items-center p-3">
                <div className="flex flex-row gap-3 text-xs">
                    <label
                        className="p-1"
                        htmlFor="selectDict"
                    >
                        Выберите справочник
                    </label>
                    <select
                        className="border border-gray-300 rounded p-1 w-96"
                        name="selectDict"
                        id="selectDict"
                        onChange={(e) => setDictionary(e.target.value)}
                        defaultValue={dict}
                    >
                        <option value="">-</option>
                        <option value="managements">Управления</option>
                        <option value="departments">Подразделения</option>
                        <option value="positions">Должности</option>
                    </select>
                </div>
                {dict && <button
                    className="text-xs border border-gray-300 bg-gray-300 px-2 py-1 rounded"
                    onClick={() => { setDictId(null); setEdit(true); setValue("") }}
                >
                    Добавить
                </button>}
            </div>
            <div className="min-h-0 flex flex-col overflow-y-scroll bg-white [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-thumb]:bg-gray-300 [&::-webkit-scrollbar-track]:bg-transparent">
                {data.map(d => (
                    <div key={d.id} className="flex flex-row text-xs even:bg-gray-100 hover:bg-gray-200">
                        <div className="overflow-hidden whitespace-nowrap text-ellipsis border border-gray-300 px-1">{d.id}</div>
                        <div className="grow overflow-hidden whitespace-nowrap text-ellipsis border border-gray-300 px-1">{d.name}</div>
                        <div className="border border-gray-300 px-1">
                            <button
                                className="hover:cursor-pointer text-blue-300"
                                onClick={() => { setEdit(true); setDictId(d.id); setValue(d.name) }}
                            >
                                Редактировать
                            </button>
                        </div>
                        <div className="border border-gray-300 px-1">
                            <button
                                className="hover:cursor-pointer text-blue-300"
                                onClick={() => { setDel(true); setDictId(d.id) }}
                            >
                                Удалить
                            </button>
                        </div>
                    </div>
                ))}
            </div>
            <div className="text-xs text-red-600 font-medium p-2">{message}</div>
        </div>
    )
}