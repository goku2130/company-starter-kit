import Link from "next/link";
import { siteConfig } from "@/site.config";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowRight } from "lucide-react";

export function Hero() {
  const { hero } = siteConfig;

  return (
    <section className="relative overflow-hidden">
      {/* Subtle grid background */}
      <div className="absolute inset-0 bg-grid opacity-40" />

      {/* Gradient orb — decorative */}
      <div className="absolute top-[-20%] left-[50%] -translate-x-1/2 w-[800px] h-[600px] rounded-full bg-primary/5 blur-3xl pointer-events-none" />

      <div className="container relative">
        <div className="flex flex-col items-center text-center pt-24 pb-20 md:pt-32 md:pb-28">
          {/* Badge */}
          {hero.badge && (
            <Badge variant="default" className="mb-6">
              {hero.badge}
            </Badge>
          )}

          {/* Headline */}
          <h1 className="font-display text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight text-foreground text-balance max-w-4xl leading-[1.1]">
            {hero.headline.split("\n").map((line, i) => (
              <span key={i}>
                {i > 0 && <br />}
                {i === 1 ? (
                  <span className="gradient-text">{line}</span>
                ) : (
                  line
                )}
              </span>
            ))}
          </h1>

          {/* Subheadline */}
          <p className="mt-6 text-lg md:text-xl text-muted max-w-2xl leading-relaxed text-balance">
            {hero.subheadline}
          </p>

          {/* CTAs */}
          <div className="mt-10 flex flex-col sm:flex-row items-center gap-4">
            <Button size="xl" asChild>
              <Link href={hero.cta.href}>
                {hero.cta.label}
                <ArrowRight size={18} />
              </Link>
            </Button>
            {hero.secondaryCta && (
              <Button variant="secondary" size="xl" asChild>
                <Link href={hero.secondaryCta.href}>
                  {hero.secondaryCta.label}
                </Link>
              </Button>
            )}
          </div>

          {/* Social proof */}
          {hero.socialProof && (
            <p className="mt-8 text-sm text-muted-light">
              {hero.socialProof}
            </p>
          )}
        </div>
      </div>
    </section>
  );
}
