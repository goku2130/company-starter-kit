import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";

/** Return the current session user, or null if not authenticated. */
export async function GET() {
  const user = await getSession();

  if (!user) {
    return NextResponse.json(
      { data: null, error: "Not authenticated" },
      { status: 401 },
    );
  }

  return NextResponse.json({ data: user, error: null });
}
