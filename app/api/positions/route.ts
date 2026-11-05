import { apiGet, apiPost } from "@/app/api/database";

export async function POST(req: Request, res: Response) {
    const body = await req.json();
    const { management_id, name, salary } = body;

    const query = `
        INSERT INTO positions(management_id, name, salary)
        VALUES(?, ?)
    `;

    const values = [management_id, name, salary];

    let status, respBody;
    await apiPost(query, values)
        .then(() => {
            status = 200;
            respBody = { message: "Successfully created position" };
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
    const management_id = searchParams.get("management_id");
    const name = searchParams.get("name");

    let query = `
        SELECT * FROM positions
    `;
    if (management_id || name) {
        const conditions: string[] = [];

        if (management_id) {
            conditions.push(`positions.management_id = ${management_id}`);
        }

        if (name) {
            conditions.push(`positions.name LIKE '${name}%'`);
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