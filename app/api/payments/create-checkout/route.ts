import { NextResponse, type NextRequest } from "next/server";
import { getDbReady } from "@/lib/db";

/**
 * Create a Stripe Checkout session via YoctoCorp Pay SDK.
 *
 * The customer pays through Stripe, routed via YoctoCorp's platform.
 * YoctoCorp takes the platform fee (3%) and routes the rest to the owner.
 *
 * Price is read from the `settings` table (early_adopter_price_cents)
 * so admin changes propagate without a code deploy.
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { customerEmail, customerName, planName } = body as {
      customerEmail?: string;
      customerName?: string;
      planName?: string;
    };

    if (!customerEmail) {
      return NextResponse.json(
        { error: "Customer email is required" },
        { status: 400 },
      );
    }

    const apiKey = process.env.YOCTO_PAY_API_KEY;
    const baseUrl = process.env.YOCTO_PAY_BASE_URL;

    if (!apiKey || !baseUrl) {
      return NextResponse.json(
        { error: "Payment system not configured" },
        { status: 503 },
      );
    }

    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3001";

    // Read price from DB settings — falls back to 1900 (€19) if not set
    const sql = await getDbReady();
    const [priceSetting] = await sql`
      SELECT value FROM settings WHERE key = 'early_adopter_price_cents'
    `;
    const unitAmountCents =
      typeof priceSetting?.value === "number"
        ? priceSetting.value
        : 1900;

    // Call YoctoCorp Pay SDK to create a checkout session
    const response = await fetch(`${baseUrl}/create-checkout`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-app-key": apiKey,
      },
      body: JSON.stringify({
        productName: planName ?? "Early Adopters — Monthly",
        unitAmountCents,
        currency: "eur",
        customerEmail,
        successUrl: `${siteUrl}/thank-you?session_id={CHECKOUT_SESSION_ID}`,
        cancelUrl: `${siteUrl}/pricing`,
        metadata: {
          customer_name: customerName ?? "",
          plan: planName ?? "early_adopters",
        },
      }),
    });

    if (!response.ok) {
      const errText = await response.text();
      console.error("[payments] YoctoCorp Pay error:", errText);
      return NextResponse.json(
        { error: "Failed to create checkout session" },
        { status: 502 },
      );
    }

    const result = (await response.json()) as {
      data?: { checkoutUrl?: string; sessionId?: string };
    };

    // Record the pending payment in our DB
    await sql`
      INSERT INTO payments (customer_email, amount_cents, currency, status, stripe_checkout_session_id, metadata)
      VALUES (
        ${customerEmail},
        ${unitAmountCents},
        'eur',
        'pending',
        ${result.data?.sessionId ?? null},
        ${JSON.stringify({ customer_name: customerName, plan: planName })}::jsonb
      )
    `;

    return NextResponse.json({
      data: { checkoutUrl: result.data?.checkoutUrl },
      error: null,
    });
  } catch (err) {
    console.error("[payments] create-checkout error:", err);
    return NextResponse.json(
      { data: null, error: "Internal error" },
      { status: 500 },
    );
  }
}
