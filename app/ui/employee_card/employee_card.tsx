'use client'

import { DepartmentType, EmployeeType, ManagementType, PositionType } from '@/app/lib/types'
import { useActionState, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createEmployee, deleteEmployee, FormState, updateEmployee } from '@/app/lib/actions'
import { useDictionaries } from '@/app/contexts/dictionaries'

interface EmployeeCardProps {
    employee?: EmployeeType
}

export default function EmployeeCard({
    employee
}: EmployeeCardProps) {
    const { data, isLoading, error } = useDictionaries()

    const router = useRouter();

    const isNew = !employee

    const [edit, setEdit] = useState(isNew)
    const [modal, setModal] = useState(false)

    const initialState: FormState = {};

    const action = isNew ? createEmployee : updateEmployee;

    const [state, formAction, pending] = useActionState(action, initialState);

    const handlerCancel = () => {
        if (isNew) {
            router.push("/employees")
            return
        }

        setValues(initialValues)

        setEdit(false)
    }

    const handlerDelete = async () => {
        if (employee?.id) {
            await deleteEmployee(employee.id)
        }
    }

    const initialValues = {
        id: employee?.id ?? "",
        name: employee?.name ?? "",
        surname: employee?.surname ?? "",
        middlename: employee?.middlename ?? "",
        birthdate: employee?.birthdate ?? "",
        gender: employee?.gender ?? "",
        email: employee?.email ?? "",
        phone: employee?.phone ?? "",
        address: employee?.address ?? "",
        department_id: employee?.department_id.toString() ?? "",
        management_id: employee?.management_id.toString() ?? "",
        position_id: employee?.position_id.toString() ?? "",
    }

    const [values, setValues] = useState(initialValues)

    if (isLoading) return <p>Загрузка справочников...</p>

    if (error) return <p>{error}</p>

    if (!data) return null

    return (
        <>
            {modal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                    <div className="bg-white p-6 rounded-lg shadow-xl max-w-sm w-full">
                        <h3 className="text-sm font-bold mb-4">Удаление</h3>
                        <p className="mb-4 text-xs">Вы действительно хотите удалить данное сотрудника?</p>
                        <div className='flex flex-row gap-3 items-center justify-center'>
                            <button
                                onClick={handlerDelete}
                                className="px-2 py-1 bg-red-300 rounded-sm text-xs"
                            >
                                Удалить
                            </button>
                            <button
                                onClick={() => setModal(false)}
                                className="px-2 py-1 bg-gray-300 rounded-sm text-xs"
                            >
                                Отмена
                            </button>
                        </div>
                    </div>
                </div>
            )}
            {/* panel */}
            <div className="flex flex-row justify-between items-center px-2 py-1">
                <div className="mx-auto text-xs text-red-600 font-medium">{state?.message}</div>
                <div className="flex flex-row items-center justify-end gap-3">
                    <button
                        className="border border-red-300 bg-red-200 hover:bg-red-300 rounded-sm px-2 py-1 text-xs"
                        onClick={() => setModal(true)}
                        hidden={edit || isNew}
                    >
                        Удалить
                    </button>
                    <button
                        className="border border-gray-300 bg-gray-200 hover:bg-gray-300 rounded-sm px-2 py-1 text-xs"
                        onClick={() => setEdit(true)}
                        hidden={edit}
                    >
                        Редактировать
                    </button>
                    <button
                        form="formEmployee"
                        type="submit"
                        className="border border-gray-300 bg-gray-200 hover:bg-gray-300 rounded-sm px-2 py-1 text-xs"
                        hidden={!edit}
                    >
                        {!isNew ? "Сохранить изменения" : "Создать сотрудника"}
                    </button>
                    <button
                        className="border border-gray-300 bg-gray-200 hover:bg-gray-300 rounded-sm px-2 py-1 text-xs"
                        onClick={() => router.push('/employees')}
                        hidden={edit}
                    >
                        Закрыть
                    </button>
                    <button
                        className="border border-gray-300 bg-gray-200 hover:bg-gray-300 rounded-sm px-2 py-1 text-xs"
                        onClick={handlerCancel}
                        hidden={!edit}
                    >
                        Отмена
                    </button>
                </div>
            </div>
            {/* form */}
            <form action={formAction} className="p-1" id="formEmployee">
                <input
                    type="hidden"
                    name="employeeId"
                    value={values.id}
                />
                <fieldset className="text-xs w-full border border-gray-300 rounded-sm p-2">
                    <legend className="font-medium">
                        Персональные данные
                    </legend>
                    <div className="grid grid-cols-3 gap-3">
                        <div className="flex flex-col gap-1">
                            <label className="ml-1" htmlFor="surname">Фамилия</label>
                            <input
                                className={`border border-gray-300 rounded-sm p-1 focus:outline-none ${edit && "text-blue-600"}`}
                                value={values.surname}
                                onChange={e =>
                                    setValues(prev => ({
                                        ...prev,
                                        surname: e.target.value,
                                    }))
                                }
                                type="text"
                                id="surname"
                                name="surname"
                                required
                                disabled={!edit || pending}
                            />
                            <div className='ml-1 text-xs text-red-600'>{state?.errors?.surname}</div>
                        </div>
                        <div className="flex flex-col gap-1">
                            <label className="ml-1" htmlFor="name">Имя</label>
                            <input
                                className={`border border-gray-300 rounded-sm p-1 focus:outline-none ${edit && "text-blue-600"}`}
                                value={values.name}
                                onChange={e =>
                                    setValues(prev => ({
                                        ...prev,
                                        name: e.target.value,
                                    }))
                                }
                                type="text"
                                id="name"
                                name="name"
                                required
                                disabled={!edit || pending}
                            />
                            <div className='ml-1 text-xs text-red-600'>{state?.errors?.name}</div>
                        </div>
                        <div className="flex flex-col gap-1">
                            <label className="ml-1" htmlFor="middlename">Отчество</label>
                            <input
                                className={`border border-gray-300 rounded-sm p-1 focus:outline-none ${edit && "text-blue-600"}`}
                                value={values.middlename}
                                onChange={e =>
                                    setValues(prev => ({
                                        ...prev,
                                        middlename: e.target.value,
                                    }))
                                }
                                type="text"
                                id="middlename"
                                name="middlename"
                                disabled={!edit || pending}
                            />
                            <div className='ml-1 text-xs text-red-600'>{state?.errors?.middlename}</div>
                        </div>
                        <div className="flex flex-col gap-1">
                            <label className="ml-1" htmlFor="birthdate">Дата рождения</label>
                            <input
                                className={`border border-gray-300 rounded-sm p-1 focus:outline-none ${edit && "text-blue-600"}`}
                                value={values.birthdate}
                                onChange={e =>
                                    setValues(prev => ({
                                        ...prev,
                                        birthdate: e.target.value,
                                    }))
                                }
                                type="date"
                                id="birthdate"
                                name="birthdate"
                                disabled={!edit || pending}
                            />
                            <div className='ml-1 text-xs text-red-600'>{state?.errors?.birthdate}</div>
                        </div>
                        <div className="flex flex-col gap-1">
                            <label className="ml-1" htmlFor="gender">Пол</label>
                            <select
                                className={`border border-gray-300 rounded-sm p-1 focus:outline-none ${edit && "text-blue-600"}`}
                                value={values.gender}
                                onChange={e =>
                                    setValues(prev => ({
                                        ...prev,
                                        gender: e.target.value,
                                    }))
                                }
                                id="gender"
                                name="gender"
                                disabled={!edit || pending}
                            >
                                <option value="">-</option>
                                <option value="Male">Мужской</option>
                                <option value="Female">Женский</option>
                            </select>
                            <div className='ml-1 text-xs text-red-600'>{state?.errors?.gender}</div>
                        </div>
                    </div>
                </fieldset>
                <fieldset className="mt-1 text-xs w-full border border-gray-300 rounded-sm p-2">
                    <legend className="font-medium">
                        Контакты
                    </legend>
                    <div className="grid grid-cols-3 gap-3">
                        <div className="flex flex-col gap-1">
                            <label className="ml-1" htmlFor="phone">Телефон</label>
                            <input
                                className={`border border-gray-300 rounded-sm p-1 focus:outline-none ${edit && "text-blue-600"}`}
                                value={values.phone}
                                onChange={e =>
                                    setValues(prev => ({
                                        ...prev,
                                        phone: e.target.value,
                                    }))
                                }
                                type="text"
                                id="phone"
                                name="phone"
                                disabled={!edit || pending}
                            />
                            <div className='ml-1 text-xs text-red-600'>{state?.errors?.phone}</div>
                        </div>
                        <div className="flex flex-col gap-1">
                            <label className="ml-1" htmlFor="address">Адрес</label>
                            <input
                                className={`border border-gray-300 rounded-sm p-1 focus:outline-none ${edit && "text-blue-600"}`}
                                value={values.address}
                                onChange={e =>
                                    setValues(prev => ({
                                        ...prev,
                                        address: e.target.value,
                                    }))
                                }
                                type="text"
                                id="address"
                                name="address"
                                disabled={!edit || pending}
                            />
                            <div className='ml-1 text-xs text-red-600'>{state?.errors?.email}</div>
                        </div>
                        <div className="flex flex-col gap-1">
                            <label className="ml-1" htmlFor="email">Email</label>
                            <input
                                className={`border border-gray-300 rounded-sm p-1 focus:outline-none ${edit && "text-blue-600"}`}
                                value={values.email}
                                onChange={e =>
                                    setValues(prev => ({
                                        ...prev,
                                        email: e.target.value,
                                    }))
                                }
                                type="text"
                                id="email"
                                name="email"
                                disabled={!edit || pending}
                            />
                        </div>
                    </div>
                </fieldset>
                <fieldset className="mt-1 text-xs w-full border border-gray-300 rounded-sm p-2">
                    <legend className="font-medium">
                        Должность
                    </legend>
                    <div className="grid grid-cols-3 gap-3">
                        <div className="flex flex-col gap-1">
                            <label className="ml-1" htmlFor="department_id">Управление</label>
                            <select
                                className={`border border-gray-300 rounded-sm p-1 focus:outline-none ${edit && "text-blue-600"}`}
                                value={values.department_id}
                                onChange={e =>
                                    setValues(prev => ({
                                        ...prev,
                                        department_id: e.target.value,
                                    }))
                                }
                                id="department_id"
                                name="department_id"
                                required
                                disabled={!edit || pending}
                            >
                                <option value="">-</option>
                                {data?.departments.map((department: DepartmentType) => (
                                    <option key={department.id} value={String(department.id)}>{department.name}</option>
                                ))}
                            </select>
                            <div className='ml-1 text-xs text-red-600'>{state?.errors?.department_id}</div>
                        </div>
                        <div className="flex flex-col gap-1">
                            <label className="ml-1" htmlFor="management_id">Подразделение</label>
                            <select
                                className={`border border-gray-300 rounded-sm p-1 focus:outline-none ${edit && "text-blue-600"}`}
                                value={values.management_id}
                                onChange={e =>
                                    setValues(prev => ({
                                        ...prev,
                                        management_id: e.target.value,
                                    }))
                                }
                                id="management_id"
                                name="management_id"
                                required
                                disabled={!edit || pending}
                            >
                                <option value="">-</option>
                                {data?.managements.map((management: ManagementType) => (
                                    <option key={management.id} value={String(management.id)}>{management.name}</option>
                                ))}
                            </select>
                            <div className='ml-1 text-xs text-red-600'>{state?.errors?.management_id}</div>
                        </div>
                        <div className="flex flex-col gap-1">
                            <label className="ml-1" htmlFor="position_id">Должность</label>
                            <select
                                className={`border border-gray-300 rounded-sm p-1 focus:outline-none ${edit && "text-blue-600"}`}
                                value={values.position_id}
                                onChange={e =>
                                    setValues(prev => ({
                                        ...prev,
                                        position_id: e.target.value,
                                    }))
                                }
                                id="position_id"
                                name="position_id"
                                required
                                disabled={!edit || pending}
                            >
                                <option value="">-</option>
                                {data?.positions.map((position: PositionType) => (
                                    <option key={position.id} value={String(position.id)}>{position.name}</option>
                                ))}
                            </select>
                            <div className='ml-1 text-xs text-red-600'>{state?.errors?.position_id}</div>
                        </div>
                    </div>
                </fieldset>
            </form>
        </>
    )
}