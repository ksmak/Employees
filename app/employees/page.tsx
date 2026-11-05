import { ColumnType } from "@/app/lib/types"
import EmployeesTable from "@/app/ui/employees_table/employees_table"

interface EmployeesPageProps {
    searchParams: Promise<{
        surname?: string;
        name?: string;
        middlename?: string;
        department?: string;
        management?: string;
        position?: string;
        page?: string;
    }>;
}

export default async function EmployeesPage({ searchParams }: EmployeesPageProps) {
    //getting search params
    const { surname, name, middlename, department, management, position, page } = await searchParams
    const currentPage = Number(page) || 1

    //loading dictionaries
    const departmentsData = await fetch("http://localhost:3000/api/departments")
    const departments = await departmentsData.json()
    const managementsData = await fetch("http://localhost:3000/api/managements")
    const managements = await managementsData.json()
    const positionsData = await fetch("http://localhost:3000/api/positions")
    const positions = await positionsData.json()

    //loading employees
    const data = await fetch(`http://localhost:3000/api/employees?surname=${surname || ''}&name=${name || ''}&middlename=${middlename || ''}&department=${department || ''}&management=${management || ''}&position=${position || ''}&page=${currentPage}`)
    const json = await data.json()
    const employees = json.res
    const totalPages = json.totalPages
    const totals = json.totals //count of record

    //table columns
    const columns: ColumnType[] = [
        {
            title: 'Фамилия',
            weight: '16%'
        },
        {
            title: 'Имя',
            weight: '16%'
        },
        {
            title: 'Отчество',
            weight: '16%'
        },
        {
            title: 'Управление',
            weight: '18%'
        },
        {
            title: 'Подразделение',
            weight: '18%'
        },
        {
            title: 'Должность',
            weight: '16%'
        },
    ]
    return (
        <>
            <EmployeesTable
                columns={columns}
                employees={employees}
                departments={departments}
                managements={managements}
                positions={positions}
                currentPage={currentPage}
                totalPages={totalPages}
                totals={totals}
            />
        </>
    )
}