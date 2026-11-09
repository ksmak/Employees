import type { NextRequest } from 'next/server'
import { apiGetFirst } from "@/app/api/database";
import { EmployeeType } from '@/app/lib/types';

export async function GET(_req: NextRequest, ctx: RouteContext<'/api/employees/[id]'>) {
    const { id } = await ctx.params
    const query = `
        SELECT * from employees WHERE id = ?
   `;
    let status, body;
    try {
        await apiGetFirst<EmployeeType>(query, [id])
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