"use client";

import { useState, type FormEvent } from "react";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import { siteConfig } from "@/site.config";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CreditCard, ArrowRight, Shield, ArrowLeft } from "lucide-react";
import Link from "next/link";

/* ═══════════════════════════════════════════════════════════════════
   CHECKOUT PAGE — collects customer details and redirects to Stripe.

   Reached via /checkout?plan=early-adopters (or any plan slug).
   The create-checkout API handles Stripe session creation via
   YoctoCorp Pay SDK.
   ═══════════════════════════════════════════════════════════════════ */

export default function CheckoutPage() {
  return (
    <Suspense>
      <CheckoutContent />
    </Suspense>
  );
}

function CheckoutContent() {
  const searchParams = useSearchParams();
  const planSlug = searchParams.get("plan") ?? "early-adopters";

  // Find the matching tier from siteConfig
  const tier = siteConfig.pricing.tiers.find(
    (t) =>
      t.type === "paid" &&
      t.name.toLowerCase().replace(/\s+/g, "-") === planSlug,
  );

  const planName = tier?.name ?? "Early Adopters";
  const planPrice = tier?.price ?? "€19";
  const planPeriod = tier?.period ?? "/month";

  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!email.trim()) return;

    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/payments/create-checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customerEmail: email.trim(),
          customerName: name.trim() || undefined,
          planName,
        }),
      });

      const json = (await res.json()) as {
        data?: { checkoutUrl?: string };
        error?: string;
      };

      if (!res.ok || json.error) {
        throw new Error(json.error ?? "Failed to create checkout session");
      }

      if (json.data?.checkoutUrl) {
        // Redirect to Stripe Checkout
        window.location.href = json.data.checkoutUrl;
      } else {
        throw new Error("No checkout URL returned");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
      setLoading(false);
    }
  }

  return (
    <section className="section">
      <div className="container">
        <div className="max-w-lg mx-auto py-8">
          {/* Back link */}
          <Link
            href="/pricing"
            className="inline-flex items-center gap-1.5 text-sm text-muted hover:text-foreground transition-colors mb-8"
          >
            <ArrowLeft size={14} />
            Back to pricing
          </Link>

          {/* Plan summary */}
          <div className="rounded-xl border border-border bg-surface-raised p-6 mb-8">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted">You're signing up for</p>
                <h1 className="font-display text-2xl font-bold text-foreground mt-1">
                  {planName}
                </h1>
              </div>
              <div className="text-right">
                <span className="font-display text-3xl font-bold text-foreground">
                  {planPrice}
                </span>
                {planPeriod && (
                  <span className="text-muted text-sm">{planPeriod}</span>
                )}
              </div>
            </div>
          </div>

          {/* Checkout form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="checkout-name">Full name</Label>
              <Input
                id="checkout-name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Jane Smith"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="checkout-email">
                Email <span className="text-error">*</span>
              </Label>
              <Input
                id="checkout-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="jane@acme.com"
                required
              />
            </div>

            {error && (
              <div className="text-sm text-error bg-error/10 border border-error/20 rounded-lg px-4 py-3">
                {error}
              </div>
            )}

            <Button
              type="submit"
              size="lg"
              className="w-full"
              disabled={loading || !email.trim()}
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <span className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Redirecting to payment...
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  <CreditCard size={16} />
                  Continue to payment
                  <ArrowRight size={16} />
                </span>
              )}
            </Button>

            {/* Trust signals */}
            <div className="flex items-center justify-center gap-2 text-xs text-muted-light pt-2">
              <Shield size={12} />
              <span>Secure payment via Stripe. Cancel anytime.</span>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
}
