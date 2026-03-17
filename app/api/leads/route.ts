import { NextResponse, type NextRequest } from "next/server";
import { getDbReady } from "@/lib/db";
import { inngest } from "@/inngest/client";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, email, company, source } = body as {
      name?: string;
      email?: string;
      company?: string;
      source?: string;
    };

    const leadSource = source === "contact" ? "contact" : "website";

    if (!name || !email) {
      return NextResponse.json(
        { error: "Name and email are required" },
        { status: 400 },
      );
    }

    // Basic email validation
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json(
        { error: "Invalid email address" },
        { status: 400 },
      );
    }

    const sql = await getDbReady();

    const rows = await sql`
      INSERT INTO leads (name, email, company, source)
      VALUES (${name}, ${email}, ${company ?? ""}, ${leadSource})
      RETURNING id, created_at
    `;

    // Fire-and-forget: emit Inngest event for async processing
    await inngest.send({
      name: "lead/captured",
      data: { name, email, company: company ?? "" },
    }).catch((err) => {
      // Don't fail the request if Inngest is unavailable
      console.error("[leads] Failed to emit inngest event:", err);
    });

    return NextResponse.json(
      {
        data: { id: rows[0].id, created_at: rows[0].created_at },
        error: null,
      },
      { status: 201 },
    );
  } catch (err) {
    console.error("[leads] Failed to capture lead:", err);
    return NextResponse.json(
      { data: null, error: "Failed to save lead" },
      { status: 500 },
    );
  }
}
