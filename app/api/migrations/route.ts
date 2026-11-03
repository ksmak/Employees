import { migrate } from "@/app/api/migrations";


export async function GET(req: Request, res: Response) {
    migrate()
    return Response.json({ message: "Migration completed successfully" }, { status: 200 }
  );
}