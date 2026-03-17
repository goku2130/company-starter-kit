import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

export interface PricingTier {
  name: string;
  /** "free" tiers link to lead form; "paid" tiers link to /checkout */
  type: "free" | "paid";
  price: string;
  period: string;
  description: string;
  features: readonly string[] | string[];
  cta: { label: string; href: string };
  highlighted: boolean;
}

export function PricingCard({ tier }: { tier: PricingTier }) {
  return (
    <div
      className={cn(
        "relative flex flex-col rounded-xl border p-8 transition-all duration-300",
        tier.highlighted
          ? "border-primary/30 bg-surface-raised shadow-lg scale-[1.02] ring-1 ring-primary/10"
          : "border-border bg-surface-raised hover:shadow-md hover:border-border-light",
      )}
    >
      {/* Popular badge */}
      {tier.highlighted && (
        <div className="absolute -top-3.5 left-1/2 -translate-x-1/2">
          <span className="bg-primary text-white text-xs font-medium px-4 py-1 rounded-full">
            Most popular
          </span>
        </div>
      )}

      {/* Header */}
      <div className="mb-6">
        <h3 className="font-semibold text-lg text-foreground">
          {tier.name}
        </h3>
        <p className="text-sm text-muted mt-1">
          {tier.description}
        </p>
      </div>

      {/* Price */}
      <div className="mb-6">
        <span className="font-display text-4xl font-bold text-foreground">
          {tier.price}
        </span>
        {tier.period && (
          <span className="text-muted ml-1">{tier.period}</span>
        )}
      </div>

      {/* CTA */}
      <Button
        variant={tier.highlighted ? "default" : "secondary"}
        size="lg"
        className="w-full mb-8"
        asChild
      >
        <Link href={tier.cta.href}>{tier.cta.label}</Link>
      </Button>

      {/* Features */}
      <ul className="space-y-3 flex-1">
        {tier.features.map((feature) => (
          <li key={feature} className="flex items-start gap-3">
            <Check
              size={16}
              className={cn(
                "mt-0.5 shrink-0",
                tier.highlighted ? "text-primary" : "text-muted",
              )}
            />
            <span className="text-sm text-foreground">{feature}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
