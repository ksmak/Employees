import { getEmployees } from "./lib/employees";
import { Employee } from "./ui/employee";
import { EmployeeType } from "./lib/types";

export default async function Page() {
  const employees = await getEmployees();

  return (
    <>
      <nav className="bg-gray-200 p-4">
        <ul>
          <li>
            <a href="/about" className="text-gray-800 hover:text-blue-500">
              О нас
            </a>
          </li>
        </ul>
      </nav>
      <main>
        <div className="grid grid-cols-1">
          {employees.map((employee: EmployeeType) => (
            <Employee key={employee.id} employee={employee} />
          ))}
        </div>
      </main>
    </>
  );
}