"use server"

import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"
import { z } from "zod"

const employeeSchema = z.object({
    surname: z.string()
        .min(2, "Фамилия должна содержать минимум 2 символа"),

    name: z.string()
        .min(2, "Имя должно содержать минимум 2 символа"),

    middlename: z.string().optional(),

    birthdate: z.string()
        .min(1, "Укажите дату рождения"),

    gender: z.enum(["Male", "Female"], {
        message: "Выберите пол",
    }),

    email: z.email("Некорректный email"),

    phone: z.string()
        .min(10, "Некорректный номер телефона"),
    department_id: z.string().min(1, "Выберите отдел"),
    management_id: z.string().min(1, "Выберите управление"),
    position_id: z.string().min(1, "Выберите должность"),
});

export type FormState = {
    errors?: {
        surname?: string[];
        name?: string[];
        middlename?: string[];
        birthdate?: string[];
        gender?: string[];
        email?: string[];
        phone?: string[];
        department_id?: string[];
        management_id?: string[];
        position_id?: string[];
    };
    message?: string;
}

type SearchParamsType = {
    surname?: string;
    name?: string;
    middlename?: string;
    department?: string;
    management?: string;
    position?: string;
    page?: string;
    sort?: string;
    sortField?: string;
};

export async function getEmployee(id: number) {
    try {
        const response = await fetch(`http://localhost:3000/api/employees/${id}`)
        if (!response.ok) {
            return {
                error: `HTTP error: ${response.status}`,
            }
        }
        const data = await response.json()
        return {
            employee: data
        }
    } catch (error) {
        return {
            error
        }
    }
}

export async function deleteEmployee(id: number) {
    try {
        const response = await fetch(`http://localhost:3000/api/employees/${id}/delete`, {
            method: 'DELETE',
        })
        if (!response.ok) {
            return {
                message: `HTTP error: ${response.status}`,
            }
        }

        revalidatePath('/employees')
        redirect('/employees')

    } catch (err) {
        console.error(err)
        throw err
    }
}

export async function createEmployee(initialState: FormState, formData: FormData) {
    const rawData = {
        surname: formData.get('surname'),
        name: formData.get('name'),
        middlename: formData.get('middlename'),
        birthdate: formData.get('birthdate'),
        gender: formData.get('gender'),
        email: formData.get('email'),
        phone: formData.get('phone'),
        address: formData.get('address'),
        department_id: formData.get('department_id'),
        management_id: formData.get('management_id'),
        position_id: formData.get('position_id'),
    }

    const result = employeeSchema.safeParse(rawData)

    if (!result.success) {
        return {
            errors: z.flattenError(result.error).fieldErrors,
            message: "Проверьте правильность заполнения формы",
        }
    }

    try {
        const res = await fetch("http://localhost:3000/api/employees", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(rawData)
        })

        if (!res.ok) {
            return {
                message: `HTTP error: ${res.status}`,
            }
        }

        revalidatePath('/employees')
        redirect('/employees')

    } catch (err) {
        console.error(err)
        throw err
    }
}

export async function updateEmployee(initialState: FormState, formData: FormData) {
    const rawData = {
        employeeId: formData.get('employeeId'),
        surname: formData.get('surname'),
        name: formData.get('name'),
        middlename: formData.get('middlename'),
        birthdate: formData.get('birthdate'),
        gender: formData.get('gender'),
        email: formData.get('email'),
        phone: formData.get('phone'),
        address: formData.get('address'),
        department_id: formData.get('department_id'),
        management_id: formData.get('management_id'),
        position_id: formData.get('position_id'),
    }

    const result = employeeSchema.safeParse(rawData)

    if (!result.success) {
        return {
            errors: z.flattenError(result.error).fieldErrors,
            message: "Проверьте правильность заполнения формы",
        }
    }

    try {
        const res = await fetch("http://localhost:3000/api/employees", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(rawData)
        })

        if (!res.ok) {
            return {
                message: `HTTP error: ${res.status}`,
            }
        }

        revalidatePath('/employees')
        redirect('/employees')

    } catch (err) {
        console.error(err)
        throw err
    }
}

export async function getEmployees(searchParams: SearchParamsType) {
    const params = new URLSearchParams(searchParams)
    try {
        const response = await fetch(`http://localhost:3000/api/employees?${params.toString()}`)
        const json = await response.json()
        const employees = json.res
        const totalPages = json.totalPages
        const totals = json.totals //count of record

        return {
            employees, totalPages, totals
        }

    } catch (error) {
        console.error(error)
        return {
            error
        }
    }
}

