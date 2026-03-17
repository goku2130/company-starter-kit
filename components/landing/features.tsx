import { siteConfig } from "@/site.config";
import {
  BarChart3,
  Zap,
  Shield,
  PieChart,
  Globe,
  Lock,
  type LucideIcon,
} from "lucide-react";

/* ─── Icon registry — maps string names from site.config to components ── */
const iconMap: Record<string, LucideIcon> = {
  BarChart3,
  Zap,
  Shield,
  PieChart,
  Globe,
  Lock,
};

export function Features() {
  const { features } = siteConfig;

  return (
    <section id="features" className="section bg-surface">
      <div className="container">
        {/* Section header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="font-display text-3xl sm:text-4xl font-bold tracking-tight text-foreground text-balance">
            {features.headline}
          </h2>
          <p className="mt-4 text-lg text-muted leading-relaxed">
            {features.subtitle}
          </p>
        </div>

        {/* Features grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.items.map((feature) => {
            const Icon = iconMap[feature.icon] ?? BarChart3;

            return (
              <div
                key={feature.title}
                className="group relative p-6 rounded-xl border border-border bg-surface-raised hover:shadow-md hover:border-primary/15 transition-all duration-300"
              >
                {/* Icon */}
                <div className="h-11 w-11 rounded-lg bg-primary/8 flex items-center justify-center mb-4 group-hover:bg-primary/12 transition-colors">
                  <Icon size={22} className="text-primary" />
                </div>

                {/* Content */}
                <h3 className="font-semibold text-foreground mb-2">
                  {feature.title}
                </h3>
                <p className="text-sm text-muted leading-relaxed">
                  {feature.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
