import type { Metadata } from "next";
import { siteConfig } from "@/site.config";
import { PricingCard, type PricingTier } from "@/components/landing/pricing-card";
import { LeadForm } from "@/components/landing/lead-form";

export const metadata: Metadata = {
  title: `Pricing — ${siteConfig.name}`,
  description: siteConfig.pricing.subtitle,
};

export default function PricingPage() {
  const { pricing } = siteConfig;

  return (
    <>
      <section className="section">
        <div className="container">
          {/* Header */}
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h1 className="font-display text-4xl sm:text-5xl font-bold tracking-tight text-foreground text-balance">
              {pricing.headline}
            </h1>
            <p className="mt-4 text-lg text-muted leading-relaxed">
              {pricing.subtitle}
            </p>
          </div>

          {/* Pricing cards — cast needed because the coding agent may
              generate site.config.ts without `as const`, widening
              tier.type from "free"|"paid" to string. */}
          <div className="grid md:grid-cols-2 gap-8 max-w-3xl mx-auto">
            {pricing.tiers.map((tier) => (
              <PricingCard key={tier.name} tier={tier as PricingTier} />
            ))}
          </div>
        </div>
      </section>

      {/* Lead form below pricing */}
      <LeadForm />
    </>
  );
}
