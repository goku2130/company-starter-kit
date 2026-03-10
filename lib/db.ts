/* ═══════════════════════════════════════════════════════════════════
   Neon DB — Serverless Postgres connection.

   Each company site gets its own Neon database. The connection string
   is set via DATABASE_URL in .env.local.
   ═══════════════════════════════════════════════════════════════════ */

import { neon, type NeonQueryFunction } from "@neondatabase/serverless";

let _sql: NeonQueryFunction<false, false> | null = null;

export function getDb() {
  if (!_sql) {
    const url = process.env.DATABASE_URL;
    if (!url) {
      throw new Error("DATABASE_URL is not set");
    }
    _sql = neon(url);
  }
  return _sql;
}

/* ─── Schema bootstrap ───────────────────────────────────────────
   Called once on first deploy (or via a setup script).
   Creates the tables if they don't exist.
   ─────────────────────────────────────────────────────────────── */

export async function ensureSchema() {
  const sql = getDb();

  await sql`
    CREATE TABLE IF NOT EXISTS leads (
      id            SERIAL PRIMARY KEY,
      name          TEXT NOT NULL,
      email         TEXT NOT NULL,
      company       TEXT DEFAULT '',
      source        TEXT DEFAULT 'website',
      created_at    TIMESTAMPTZ DEFAULT now()
    )
  `;

  await sql`
    CREATE TABLE IF NOT EXISTS payments (
      id                        SERIAL PRIMARY KEY,
      customer_email            TEXT NOT NULL,
      amount_cents              INTEGER NOT NULL,
      currency                  TEXT NOT NULL DEFAULT 'eur',
      status                    TEXT NOT NULL DEFAULT 'pending',
      stripe_checkout_session_id TEXT UNIQUE,
      metadata                  JSONB DEFAULT '{}',
      created_at                TIMESTAMPTZ DEFAULT now(),
      updated_at                TIMESTAMPTZ DEFAULT now()
    )
  `;

  await sql`
    CREATE TABLE IF NOT EXISTS settings (
      key         TEXT PRIMARY KEY,
      value       JSONB NOT NULL,
      updated_at  TIMESTAMPTZ DEFAULT now()
    )
  `;

  /* Seed default settings if empty */
  await sql`
    INSERT INTO settings (key, value)
    VALUES
      ('site_name', ${JSON.stringify('"CashPulse"')}::jsonb),
      ('site_tagline', ${JSON.stringify('"Financial intelligence for growing businesses"')}::jsonb),
      ('contact_email', ${JSON.stringify('"hello@cashpulse.com"')}::jsonb),
      ('early_adopter_price_cents', '1900'::jsonb),
      ('trial_days', '14'::jsonb)
    ON CONFLICT (key) DO NOTHING
  `;
}
