import { siteConfig } from "@/site.config";
import { Quote } from "lucide-react";

export function Testimonials() {
  const { testimonials } = siteConfig;

  if (testimonials.length === 0) return null;

  return (
    <section className="section bg-surface">
      <div className="container">
        {/* Section header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="font-display text-3xl sm:text-4xl font-bold tracking-tight text-foreground text-balance">
            Loved by businesses like yours
          </h2>
        </div>

        {/* Testimonials grid */}
        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {testimonials.map((testimonial, i) => (
            <div
              key={i}
              className="p-6 rounded-xl border border-border bg-surface-raised"
            >
              {/* Quote icon */}
              <Quote size={24} className="text-primary/20 mb-4" />

              {/* Quote text */}
              <blockquote className="text-sm text-foreground leading-relaxed mb-6">
                &ldquo;{testimonial.quote}&rdquo;
              </blockquote>

              {/* Author */}
              <div className="flex items-center gap-3">
                {/* Avatar placeholder */}
                <div className="h-10 w-10 rounded-full bg-primary/8 flex items-center justify-center shrink-0">
                  <span className="text-sm font-semibold text-primary">
                    {testimonial.author.split(" ").map((n) => n[0]).join("")}
                  </span>
                </div>
                <div>
                  <p className="text-sm font-medium text-foreground">
                    {testimonial.author}
                  </p>
                  <p className="text-xs text-muted">
                    {testimonial.role}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
