import { NextResponse, type NextRequest } from "next/server";
import { getSession } from "@/lib/auth";
import { getDbReady } from "@/lib/db";

const SETTING_KEYS = [
  "site_name",
  "site_tagline",
  "contact_email",
  "early_adopter_price_cents",
  "trial_days",
] as const;

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
      SELECT key, value FROM settings WHERE key = ANY(${SETTING_KEYS as unknown as string[]})
    `;

    const settings: Record<string, unknown> = {};
    for (const row of rows) {
      settings[row.key as string] = row.value;
    }

    return NextResponse.json({ data: settings, error: null });
  } catch (err) {
    console.error("[admin/settings] GET", err);
    return NextResponse.json(
      { data: null, error: "Failed to fetch settings" },
      { status: 500 },
    );
  }
}

export async function PUT(request: NextRequest) {
  if (process.env.YOCTO_SSO_SECRET) {
    const user = await getSession();
    if (!user || (user.role !== "owner" && user.role !== "admin")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
  }

  try {
    const body = await request.json();
    const sql = await getDbReady();

    for (const key of SETTING_KEYS) {
      if (key in (body as Record<string, unknown>)) {
        const val = (body as Record<string, unknown>)[key];
        await sql`
          INSERT INTO settings (key, value, updated_at)
          VALUES (${key}, ${JSON.stringify(val)}::jsonb, now())
          ON CONFLICT (key) DO UPDATE
          SET value = ${JSON.stringify(val)}::jsonb, updated_at = now()
        `;
      }
    }

    return NextResponse.json({ data: { updated: true }, error: null });
  } catch (err) {
    console.error("[admin/settings] PUT", err);
    return NextResponse.json(
      { data: null, error: "Failed to save settings" },
      { status: 500 },
    );
  }
}
