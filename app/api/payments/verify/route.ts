import { NextResponse, type NextRequest } from "next/server";
import { getDb } from "@/lib/db";

/**
 * Verify a payment by customer email or Stripe session ID.
 * Used by the thank-you page and admin to check payment status.
 */
export async function GET(request: NextRequest) {
  const email = request.nextUrl.searchParams.get("customerEmail");
  const sessionId = request.nextUrl.searchParams.get("session_id");

  if (!email && !sessionId) {
    return NextResponse.json(
      { error: "Provide customerEmail or session_id" },
      { status: 400 },
    );
  }

  try {
    const sql = getDb();

    let rows;
    if (sessionId) {
      rows = await sql`
        SELECT id, customer_email, amount_cents, currency, status, created_at
        FROM payments
        WHERE stripe_checkout_session_id = ${sessionId}
        LIMIT 1
      `;
    } else {
      rows = await sql`
        SELECT id, customer_email, amount_cents, currency, status, created_at
        FROM payments
        WHERE customer_email = ${email!}
        ORDER BY created_at DESC
        LIMIT 1
      `;
    }

    if (rows.length === 0) {
      return NextResponse.json(
        { data: null, error: "Payment not found" },
        { status: 404 },
      );
    }

    return NextResponse.json({ data: rows[0], error: null });
  } catch (err) {
    console.error("[payments] verify error:", err);
    return NextResponse.json(
      { data: null, error: "Internal error" },
      { status: 500 },
    );
  }
}
