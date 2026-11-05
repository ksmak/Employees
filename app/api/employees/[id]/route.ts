import type { NextRequest } from 'next/server'
import { apiGet } from "@/app/api/database";

export async function GET(_req: NextRequest, ctx: RouteContext<'/api/employees/[id]'>) {
    const { id } = await ctx.params
    const query = `
        SELECT * from employees WHERE id = ${parseInt(id, 10)}
   `;
    let status, body;
    try {
        await apiGet(query)
            .then((res) => {
                status = 200;
                body = res;
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