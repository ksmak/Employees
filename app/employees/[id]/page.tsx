import { getEmployee } from "@/app/lib/actions"
import EmployeeCard from "@/app/ui/employee_card/employee_card"

export default async function EmployeePage({
    params,
}: {
    params: Promise<{ id: number }>
}) {
    const { id } = await params
    const result = await getEmployee(id)

    if (result.error) {
        return (<p className="text-sm text-red-600 font-medium mx-auto my-auto">{`Ошибка! ${result.error}`}</p>)
    }

    return (
        <EmployeeCard
            employee={result.employee}
        />
    );
}