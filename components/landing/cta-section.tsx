import Link from "next/link";
import { siteConfig } from "@/site.config";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

export function CtaSection() {
  return (
    <section className="section">
      <div className="container">
        <div className="relative overflow-hidden rounded-2xl bg-primary px-8 py-16 md:px-16 md:py-20 text-center">
          {/* Decorative gradient */}
          <div className="absolute inset-0 bg-gradient-to-br from-primary via-primary to-primary-dark opacity-90" />
          <div className="absolute top-0 right-0 w-96 h-96 rounded-full bg-white/5 blur-3xl -translate-y-1/2 translate-x-1/3" />

          <div className="relative z-10">
            <h2 className="font-display text-3xl sm:text-4xl font-bold tracking-tight text-white text-balance max-w-2xl mx-auto">
              Ready to take control of your finances?
            </h2>
            <p className="mt-4 text-lg text-white/70 max-w-xl mx-auto">
              Join {siteConfig.hero.socialProof?.match(/\d+/)?.[0] ?? "hundreds of"} businesses
              already using {siteConfig.name}.
            </p>
            <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button
                size="xl"
                className="bg-white text-primary hover:bg-white/90"
                asChild
              >
                <Link href="#lead-form">
                  {siteConfig.hero.cta.label}
                  <ArrowRight size={18} />
                </Link>
              </Button>
              <Button
                variant="outline"
                size="xl"
                className="border-white/20 text-white hover:bg-white/10 bg-transparent"
                asChild
              >
                <Link href="/pricing">See plans</Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
