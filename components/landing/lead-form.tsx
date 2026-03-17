"use client";

import { useState, type FormEvent } from "react";
import { siteConfig } from "@/site.config";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CheckCircle, ArrowRight } from "lucide-react";

export function LeadForm() {
  const { leadForm } = siteConfig;
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const form = e.currentTarget;
    const data = new FormData(form);

    try {
      const res = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: data.get("name"),
          email: data.get("email"),
          company: data.get("company"),
        }),
      });

      if (!res.ok) {
        const body = (await res.json()) as { error?: string };
        throw new Error(body.error ?? "Something went wrong");
      }

      setSubmitted(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  return (
    <section id="lead-form" className="section">
      <div className="container">
        <div className="max-w-lg mx-auto">
          {/* Section header */}
          <div className="text-center mb-8">
            <h2 className="font-display text-3xl sm:text-4xl font-bold tracking-tight text-foreground text-balance">
              {leadForm.headline}
            </h2>
            <p className="mt-3 text-muted leading-relaxed">
              {leadForm.subtitle}
            </p>
          </div>

          {submitted ? (
            /* Success state */
            <div className="text-center py-12 px-6 rounded-xl border border-success/20 bg-success/5">
              <CheckCircle size={48} className="text-success mx-auto mb-4" />
              <p className="text-lg font-medium text-foreground">
                {leadForm.successMessage}
              </p>
            </div>
          ) : (
            /* Form */
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Full name</Label>
                  <Input
                    id="name"
                    name="name"
                    placeholder="Jane Smith"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="company">Company</Label>
                  <Input
                    id="company"
                    name="company"
                    placeholder="Acme Inc."
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Work email</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="jane@acme.com"
                  required
                />
              </div>
              <Button
                type="submit"
                size="lg"
                className="w-full"
                disabled={loading}
              >
                {loading ? (
                  <span className="flex items-center gap-2">
                    <span className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Joining...
                  </span>
                ) : (
                  <span className="flex items-center gap-2">
                    {leadForm.buttonLabel}
                    <ArrowRight size={16} />
                  </span>
                )}
              </Button>
              {error && (
                <p className="text-xs text-center text-error">{error}</p>
              )}
              <p className="text-xs text-center text-muted-light">
                No spam, ever. We respect your inbox.
              </p>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}
