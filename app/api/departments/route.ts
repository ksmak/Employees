import { apiGet, apiPost } from "@/app/api/database";

export async function POST(req: Request, res: Response) {
    const body = await req.json();
    const { name } = body;

    const query = `
        INSERT INTO departments(name)
        VALUES(?)
    `;
    const values = [name];

    let status, respBody;
    await apiPost(query, values)
        .then(() => {
            status = 200;
            respBody = { message: "Successfully created department" };
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
    const name = searchParams.get("name");

    let query = `
        SELECT * FROM departments
    `;
    if (name) {
        query += ` WHERE name LIKE '${name}%'`;
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