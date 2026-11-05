import { apiGet, apiPost } from "@/app/api/database";

export async function POST(req: Request, res: Response) {
    const body = await req.json();
    const { department_id, name } = body;

    const query = `
        INSERT INTO managements(department_id, name) 
        VALUES(?, ?)
    `;

    const values = [department_id, name];

    let status, respBody;
    await apiPost(query, values)
        .then(() => {
            status = 200;
            respBody = { message: "Successfully created management" };
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
    const url = new URL(req.url);
    const searchParams = url.searchParams;
    const department_id = searchParams.get("department_id");
    const name = searchParams.get("name");

    let query = `
        SELECT * FROM managements
    `;
    if (department_id || name) {
        const conditions: string[] = [];

        if (department_id) {
            conditions.push(`managements.department_id = ${department_id}`);
        }

        if (name) {
            conditions.push(`managements.name LIKE '${name}%'`);
        }

        query += " WHERE " + conditions.join(" AND ");
    }

    let status, respBody;
    await apiGet(query)
        .then((data) => {
            status = 200;
            respBody = data;
        })
        .catch((err) => {
            status = 400;
            respBody = err;
        });
    return Response.json(respBody, {
        status,
    });
}