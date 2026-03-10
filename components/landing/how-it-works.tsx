import { siteConfig } from "@/site.config";

export function HowItWorks() {
  const { howItWorks } = siteConfig;

  return (
    <section className="section">
      <div className="container">
        {/* Section header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="font-display text-3xl sm:text-4xl font-bold tracking-tight text-foreground text-balance">
            {howItWorks.headline}
          </h2>
        </div>

        {/* Steps */}
        <div className="grid md:grid-cols-3 gap-12 max-w-4xl mx-auto">
          {howItWorks.steps.map((step, i) => (
            <div key={step.step} className="relative text-center">
              {/* Connector line (not on last item) */}
              {i < howItWorks.steps.length - 1 && (
                <div className="hidden md:block absolute top-6 left-[60%] w-[80%] h-[1px] bg-border" />
              )}

              {/* Step number */}
              <div className="h-12 w-12 rounded-full bg-primary text-white font-bold text-lg flex items-center justify-center mx-auto mb-5 relative z-10">
                {step.step}
              </div>

              {/* Content */}
              <h3 className="font-semibold text-foreground mb-2">
                {step.title}
              </h3>
              <p className="text-sm text-muted leading-relaxed max-w-xs mx-auto">
                {step.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
