/* ═══════════════════════════════════════════════════════════════════
   Neon DB — Serverless Postgres connection.

   Each company site gets its own Neon database. The connection string
   is set via DATABASE_URL in .env.local.

   Schema auto-bootstrap: the first DB call in a cold-start
   automatically creates tables if they don't exist. No manual
   /api/setup POST required.
   ═══════════════════════════════════════════════════════════════════ */

import { neon, type NeonQueryFunction } from "@neondatabase/serverless";
import { siteConfig } from "@/site.config";

let _sql: NeonQueryFunction<false, false> | null = null;
let _schemaReady = false;
let _schemaPromise: Promise<void> | null = null;

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

/**
 * Returns a DB handle with guaranteed schema. Call this instead of
 * getDb() in API routes that need tables to exist. The bootstrap
 * runs once per cold start and is a no-op after that.
 */
export async function getDbReady(): Promise<NeonQueryFunction<false, false>> {
  const sql = getDb();
  if (!_schemaReady) {
    // Deduplicate concurrent calls during cold start
    if (!_schemaPromise) {
      _schemaPromise = ensureSchema()
        .then(() => {
          _schemaReady = true;
        })
        .catch((err) => {
          _schemaPromise = null; // Allow retry on next request
          throw err;
        });
    }
    await _schemaPromise;
  }
  return sql;
}

/* ─── Schema bootstrap ───────────────────────────────────────────
   Creates tables if they don't exist. Uses IF NOT EXISTS so it's
   safe to run repeatedly. Called automatically by getDbReady().
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

  /* Seed default settings from siteConfig — not hardcoded values.
     ON CONFLICT DO NOTHING ensures we only seed once. */
  await sql`
    INSERT INTO settings (key, value)
    VALUES
      ('site_name', ${JSON.stringify(siteConfig.name)}::jsonb),
      ('site_tagline', ${JSON.stringify(siteConfig.tagline)}::jsonb),
      ('contact_email', ${JSON.stringify(siteConfig.contact.email)}::jsonb),
      ('early_adopter_price_cents', '1900'::jsonb),
      ('trial_days', '14'::jsonb)
    ON CONFLICT (key) DO NOTHING
  `;
}
