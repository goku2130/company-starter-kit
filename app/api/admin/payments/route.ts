import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { getDbReady } from "@/lib/db";

export async function GET() {
  if (process.env.YOCTO_SSO_SECRET) {
    const user = await getSession();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
  }

  try {
    const sql = await getDbReady();
    const rows = await sql`
      SELECT id, customer_email, amount_cents, currency, status, metadata, created_at
      FROM payments
      ORDER BY created_at DESC
      LIMIT 100
    `;

    return NextResponse.json({ data: rows, error: null });
  } catch (err) {
    console.error("[admin/payments]", err);
    return NextResponse.json(
      { data: null, error: "Failed to fetch payments" },
      { status: 500 },
    );
  }
}
