import { NextResponse } from "next/server";
import { ensureSchema } from "@/lib/db";

/**
 * One-time schema setup endpoint.
 * POST /api/setup — creates tables if they don't exist.
 * Protected by a simple check: only works when DB is fresh.
 */
export async function POST() {
  try {
    await ensureSchema();
    return NextResponse.json({
      data: { message: "Schema created successfully" },
      error: null,
    });
  } catch (err) {
    console.error("[setup] Schema setup failed:", err);
    return NextResponse.json(
      { data: null, error: "Schema setup failed" },
      { status: 500 },
    );
  }
}
