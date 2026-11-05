export default async function EmployeePage({
    params,
}: {
    params: Promise<{ id: number }>
}) {
    const { id } = await params
    const data = await fetch(`http://localhost:3000/api/employees/${id}`)
    const employees = await data.json()

    let employee;
    if (employees.length === 1) {
        employee = employees[0];
    }

    return (
        <div className="flex flex-col items-center space-y-4 p-4 bg-white rounded-lg shadow">
            <h1 className="text-3xl font-bold">{employee?.name}</h1>
            <p className="text-gray-600">{employee?.position}</p>
        </div>
    );
}