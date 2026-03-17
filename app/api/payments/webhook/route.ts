import { NextResponse, type NextRequest } from "next/server";
import { getDbReady } from "@/lib/db";
import { inngest } from "@/inngest/client";

/**
 * Webhook callback from YoctoCorp Pay.
 *
 * YoctoCorp forwards the relevant Stripe events to each company's
 * webhook endpoint. We update the payment status accordingly.
 *
 * Verification: The webhook must include the YOCTO_APP_KEY in the
 * x-app-key header to prove it originated from YoctoCorp Pay.
 */
export async function POST(request: NextRequest) {
  try {
    // Verify the webhook is from YoctoCorp Pay — check the shared app key
    const appKey = process.env.YOCTO_PAY_API_KEY;
    if (appKey) {
      const headerKey = request.headers.get("x-app-key");
      if (headerKey !== appKey) {
        return NextResponse.json(
          { error: "Unauthorized webhook" },
          { status: 401 },
        );
      }
    }

    const body = await request.json();
    const { event, sessionId, customerEmail, status } = body as {
      event?: string;
      sessionId?: string;
      customerEmail?: string;
      status?: string;
    };

    if (!sessionId) {
      return NextResponse.json(
        { error: "Missing sessionId" },
        { status: 400 },
      );
    }

    const sql = await getDbReady();

    if (event === "checkout.session.completed" || status === "paid") {
      await sql`
        UPDATE payments
        SET status = 'paid', updated_at = now()
        WHERE stripe_checkout_session_id = ${sessionId}
      `;
    } else if (event === "checkout.session.expired" || status === "expired") {
      await sql`
        UPDATE payments
        SET status = 'expired', updated_at = now()
        WHERE stripe_checkout_session_id = ${sessionId}
      `;
    }

    // If we also got a customer email and there's a matching lead, mark it as converted
    if (customerEmail && status === "paid") {
      await sql`
        UPDATE leads
        SET source = 'converted'
        WHERE email = ${customerEmail}
          AND source != 'converted'
      `;

      // Fetch payment details for the email
      const [payment] = await sql`
        SELECT amount_cents, currency, metadata
        FROM payments
        WHERE stripe_checkout_session_id = ${sessionId}
        LIMIT 1
      `;

      if (payment) {
        await inngest.send({
          name: "payment/completed",
          data: {
            customerEmail,
            customerName: (payment.metadata as { customer_name?: string })?.customer_name ?? "",
            amountCents: payment.amount_cents as number,
            currency: payment.currency as string,
          },
        }).catch((err) => {
          console.error("[webhook] Failed to emit inngest event:", err);
        });
      }
    }

    return NextResponse.json({ received: true });
  } catch (err) {
    console.error("[webhook] payment webhook error:", err);
    return NextResponse.json(
      { error: "Webhook processing failed" },
      { status: 500 },
    );
  }
}
