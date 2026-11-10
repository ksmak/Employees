"use server"

import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"
import { success, z } from "zod"
import { execute, fetchAll, fetchFirst } from "./database";
import { DictionaryType, EmployeeType } from "./types";

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
    success?: boolean;
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
    let sql = `SELECT * FROM employees WHERE id = ?`;

    try {
        const data = await fetchFirst<EmployeeType>(sql, [id]);
        return {
            employee: data
        }

    } catch (error) {
        return {
            error: error instanceof Error
                ? error.message
                : "Произошла неизвестная ошибка"
        }
    }
}

export async function deleteEmployee(id: number) {
    let sql = `DELETE FROM employees WHERE id = ?`;

    try {
        await execute(sql, [id]);

        revalidatePath('/employees')
        redirect('/employees')

    } catch (error) {
        return {
            error: error instanceof Error
                ? error.message
                : "Произошла неизвестная ошибка"
        }
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

    let sql, params

    if (!rawData.employeeId) {
        sql = `
          INSERT INTO employees(
            surname, 
            name, 
            middlename, 
            birthdate, 
            gender, 
            email, 
            phone, 
            address, 
            department_id, 
            management_id, 
            position_id
          ) VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `

        params = [
            rawData.surname,
            rawData.name,
            rawData.middlename,
            rawData.birthdate,
            rawData.gender,
            rawData.email,
            rawData.phone,
            rawData.address,
            rawData.department_id,
            rawData.management_id,
            rawData.position_id,
        ]
    } else {
        sql = `
          UPDATE employees SET
            surname = ?,
            name = ?,
            middlename = ?,
            birthdate = ?,
            gender = ?,
            email = ?,
            phone = ?,
            address = ?,
            department_id = ?,
            management_id = ?,
            position_id = ?
          WHERE id = ?
        `
        params = [
            rawData.surname,
            rawData.name,
            rawData.middlename,
            rawData.birthdate,
            rawData.gender,
            rawData.email,
            rawData.phone,
            rawData.address,
            rawData.department_id,
            rawData.management_id,
            rawData.position_id,
            rawData.employeeId,
        ]
    }

    try {
        await execute(sql, params);

        revalidatePath('/employees')

        return {
            success: true,
            message: 'Данные успешно сохранены'
        }

    } catch (error) {
        return {
            error: error instanceof Error
                ? error.message
                : "Произошла неизвестная ошибка"
        }
    }
}

export async function getEmployees(params: SearchParamsType) {
    let sql = `
        SELECT 
          employees.*, 
          departments.name AS department_name, 
          managements.name AS management_name, 
          positions.name AS position_name
        FROM employees
        LEFT JOIN departments ON employees.department_id = departments.id
        LEFT JOIN managements ON employees.management_id = managements.id
        LEFT JOIN positions ON employees.position_id = positions.id
      `;

    let sqlTotal = `SELECT COUNT(id) as row_count FROM employees`;

    //filtering
    if (params.surname ||
        params.name ||
        params.middlename ||
        params.department ||
        params.management ||
        params.position
    ) {
        const conditions: string[] = [];

        if (params.surname) {
            conditions.push(`employees.surname LIKE '${params.surname}%'`);
        }
        if (params.name) {
            conditions.push(`employees.name LIKE '${params.name}%'`);
        }
        if (params.middlename) {
            conditions.push(`employees.middlename LIKE '${params.middlename}%'`);
        }
        if (params.department) {
            conditions.push(`employees.department_id = ${params.department}`);
        }
        if (params.management) {
            conditions.push(`employees.management_id = ${params.management}`);
        }
        if (params.position) {
            conditions.push(`employees.position_id = ${params.position}`);
        }

        sql += " WHERE " + conditions.join(" AND ");
        sqlTotal += " WHERE " + conditions.join(" AND ");
    }

    //ordering
    if (params.sortField) {
        sql += ` ORDER BY ${params.sortField} ${params.sort}`
    }

    //pagination
    const numberOfRows = 25
    const startingRow = (Number(params.page) - 1) * numberOfRows
    sql += ` LIMIT ${numberOfRows} OFFSET ${startingRow}`

    console.log(sql)

    try {
        const data = await fetchAll<EmployeeType>(sql);
        const totalData = await fetchAll<{ row_count: number }>(sqlTotal);
        const rowCount = totalData[0].row_count;
        const totalPages = Math.ceil(rowCount / numberOfRows);
        const totals = rowCount;
        return {
            employees: data, totalPages, totals
        }

    } catch (error) {
        return {
            error: error instanceof Error
                ? error.message
                : "Произошла неизвестная ошибка"
        }
    }
}

export async function getDictionary(tablename: string) {
    let sql = `
        SELECT * FROM ${tablename}
    `
    try {
        const data = await fetchAll<DictionaryType>(sql, [])
        return {
            dictionary: data
        }
    } catch (error) {
        return {
            error: error instanceof Error
                ? error.message
                : "Произошла неизвестная ошибка"
        }
    }
}

export async function updateDictionary(tablename: string, id: number | null, value: string) {
    let sql, params

    if (!id) {
        sql = `
            INSERT INTO ${tablename}(name) VALUES( ? )
        `
        params = [value]
    } else {
        sql = `
            UPDATE ${tablename} SET name = ? WHERE id = ?
        `
        params = [value, id]
    }

    try {
        execute(sql, params)

        revalidatePath(`/dictionaries?dict=${tablename}`)

    } catch (error) {
        return {
            error: error instanceof Error
                ? error.message
                : "Произошла неизвестная ошибка"
        }
    }
}

export async function deleteDictionary(tablename: string, id: number) {
    let sql = `DELETE FROM ${tablename} WHERE id = ?`;

    try {
        await execute(sql, [id]);

        revalidatePath(`/dictionaries?dict=${tablename}`)

    } catch (error) {
        return {
            error: error instanceof Error
                ? error.message
                : "Произошла неизвестная ошибка"
        }
    }
}