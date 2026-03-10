import { NextResponse, type NextRequest } from "next/server";
import { getSession } from "@/lib/auth";
import { getDb } from "@/lib/db";

export async function GET(request: NextRequest) {
  if (process.env.YOCTO_SSO_SECRET) {
    const user = await getSession();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
  }

  const limit = parseInt(
    request.nextUrl.searchParams.get("limit") ?? "100",
    10,
  );

  try {
    const sql = getDb();
    const rows = await sql`
      SELECT id, name, email, company, source, created_at
      FROM leads
      ORDER BY created_at DESC
      LIMIT ${limit}
    `;

    return NextResponse.json({ data: rows, error: null });
  } catch (err) {
    console.error("[admin/leads]", err);
    return NextResponse.json(
      { data: null, error: "Failed to fetch leads" },
      { status: 500 },
    );
  }
}
