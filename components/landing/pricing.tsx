import { siteConfig } from "@/site.config";
import { PricingCard } from "@/components/landing/pricing-card";

export function Pricing() {
  const { pricing } = siteConfig;

  return (
    <section id="pricing" className="section bg-surface">
      <div className="container">
        {/* Section header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="font-display text-3xl sm:text-4xl font-bold tracking-tight text-foreground text-balance">
            {pricing.headline}
          </h2>
          <p className="mt-4 text-lg text-muted leading-relaxed">
            {pricing.subtitle}
          </p>
        </div>

        {/* Pricing cards */}
        <div className="grid md:grid-cols-2 gap-8 max-w-3xl mx-auto">
          {pricing.tiers.map((tier) => (
            <PricingCard key={tier.name} tier={tier} />
          ))}
        </div>
      </div>
    </section>
  );
}
