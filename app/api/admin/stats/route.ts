import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { getDbReady } from "@/lib/db";

export async function GET() {
  // In production, require auth. In dev, allow through.
  if (process.env.YOCTO_SSO_SECRET) {
    const user = await getSession();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
  }

  try {
    const sql = await getDbReady();

    const [leadCount] = await sql`SELECT count(*)::int as count FROM leads`;
    const [weekCount] = await sql`
      SELECT count(*)::int as count FROM leads
      WHERE created_at > now() - interval '7 days'
    `;
    const [paymentCount] = await sql`
      SELECT count(*)::int as count FROM payments WHERE status = 'paid'
    `;
    const [revenue] = await sql`
      SELECT coalesce(sum(amount_cents), 0)::int as total FROM payments WHERE status = 'paid'
    `;

    return NextResponse.json({
      data: {
        totalLeads: leadCount.count,
        leadsThisWeek: weekCount.count,
        totalPayments: paymentCount.count,
        revenue: revenue.total,
      },
      error: null,
    });
  } catch (err) {
    console.error("[admin/stats]", err);
    return NextResponse.json(
      { data: null, error: "Failed to fetch stats" },
      { status: 500 },
    );
  }
}
