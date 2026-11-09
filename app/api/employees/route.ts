import { apiGetAll, apiPost } from "@/app/api/database";

export async function POST(req: Request, res: Response) {
  const body = await req.json();
  const { employeeId, surname, name, middlename, birthdate, gender, email, phone, address, department_id, management_id, position_id } = body;

  let query, values

  if (!employeeId) {
    query = `
      INSERT INTO employees(surname, name, middlename, birthdate, gender, email, phone, address, department_id, management_id, position_id)
      VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;
    values = [surname, name, middlename, birthdate, gender, email, phone, address, department_id, management_id, position_id];
  } else {
    query = `
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
    values = [surname, name, middlename, birthdate, gender, email, phone, address, department_id, management_id, position_id, employeeId];
  }


  let status, respBody;
  await apiPost(query, values)
    .then(() => {
      status = 200;
      respBody = { message: "Successfully created or updated employee" };
    })
    .catch((err) => {
      status = 400;
      respBody = err;
    });
  return Response.json(respBody, {
    status,
  });
}

export async function GET(req: Request, res: Response) {
  const url = new URL(req.url)
  const searchParams = url.searchParams
  const surname = searchParams.get("surname")
  const name = searchParams.get("name")
  const middlename = searchParams.get("middlename")
  const department = searchParams.get("department")
  const management = searchParams.get("management")
  const position = searchParams.get("position")
  const page = parseInt(searchParams.get("page") || "1")
  const sort = searchParams.get("sort") || "ASC"
  const sortField = searchParams.get("sortField")

  let query = `
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

  let queryTotal = "SELECT COUNT(id) as row_count FROM employees";

  //ordering
  if (sortField) {
    query += ` ORDER BY ${sortField} ${sort}`
  }

  //filtering
  if (surname || name || middlename || department || management || position) {
    const conditions: string[] = [];

    if (surname) {
      conditions.push(`employees.surname LIKE '${surname}%'`);
    }
    if (name) {
      conditions.push(`employees.name LIKE '${name}%'`);
    }
    if (middlename) {
      conditions.push(`employees.middlename LIKE '${middlename}%'`);
    }
    if (department) {
      conditions.push(`employees.department_id = ${department}`);
    }
    if (management) {
      conditions.push(`employees.management_id = ${management}`);
    }
    if (position) {
      conditions.push(`employees.position_id = ${position}`);
    }

    query += " WHERE " + conditions.join(" AND ");
    queryTotal += " WHERE " + conditions.join(" AND ");
  }

  //pagination
  const numberOfRows = 25
  const startingRow = (page - 1) * numberOfRows
  query += ` LIMIT ${numberOfRows} OFFSET ${startingRow}`

  console.log(query)

  let status, body;
  try {
    await apiGetAll(queryTotal)
      .then(async (res) => {
        const rowCount = (res as { row_count: number }[])[0].row_count;
        const totalPages = Math.ceil(rowCount / numberOfRows);
        const totals = rowCount;
        await apiGetAll(query)
          .then((res) => {
            status = 200;
            body = { res, totalPages, totals };
          })
          .catch((err: Error) => {
            status = 400;
            body = { error: err };
          });
      })
      .catch((err: Error) => {
        status = 400;
        body = { error: err };
      });
    return Response.json(body, {
      status,
    });
  } catch (error: any) {
    console.error(error.message);
    return Response.json(
      { error: error },
      {
        status: 400,
      }
    );
  }
}