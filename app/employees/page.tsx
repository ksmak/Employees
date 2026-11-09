import { ColumnType } from "@/app/lib/types"
import EmployeesTable from "@/app/ui/employees_table/employees_table"
import { getEmployees } from "../lib/actions";

interface EmployeesPageProps {
    searchParams: Promise<{
        surname?: string;
        name?: string;
        middlename?: string;
        department?: string;
        management?: string;
        position?: string;
        page?: string;
        sort?: string;
        sortField: string;
    }>;
}

export default async function EmployeesPage({ searchParams }: EmployeesPageProps) {
    //getting search params
    const { surname, name, middlename, department, management, position, page, sort, sortField } = await searchParams
    const currentPage = Number(page) || 1
    const data = await getEmployees({
        surname: surname || '',
        name: name || '',
        middlename: middlename || '',
        department: department || '',
        management: management || '',
        position: position || '',
        page: String(currentPage),
        sort: sort || '',
        sortField: sortField || '',
    })

    if (!data.error) {
        <p>{`Ошибка! ${data.error}`}</p>
    }

    //table columns
    const columns: ColumnType[] = [
        {
            title: 'Фамилия',
            weight: '16%',
            field: 'employees.surname',
        },
        {
            title: 'Имя',
            weight: '16%',
            field: 'employees.name',
        },
        {
            title: 'Отчество',
            weight: '16%',
            field: 'employees.middlename',
        },
        {
            title: 'Управление',
            weight: '18%',
            field: 'department_name',
        },
        {
            title: 'Подразделение',
            weight: '18%',
            field: 'management_name',
        },
        {
            title: 'Должность',
            weight: '16%',
            field: 'position_name',
        },
    ]
    return (
        <>
            <EmployeesTable
                columns={columns}
                employees={data.employees}
                currentPage={currentPage}
                totalPages={data.totalPages}
                totals={data.totals}
            />
        </>
    )
}