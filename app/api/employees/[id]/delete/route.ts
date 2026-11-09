import type { NextRequest } from 'next/server'
import { apiPost } from "@/app/api/database";
import { EmployeeType } from '@/app/lib/types';

export async function DELETE(_req: NextRequest, ctx: RouteContext<'/api/employees/[id]/delete'>) {
    const { id } = await ctx.params
    const query = `
        DELETE FROM employees WHERE id = ?
   `;
    let status, body;
    try {
        await apiPost(query, [id])
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