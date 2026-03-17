"use client";

import { useState, type FormEvent } from "react";
import { siteConfig } from "@/site.config";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Mail, ArrowRight, CheckCircle } from "lucide-react";

export default function ContactPage() {
  const { contact } = siteConfig;
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
      // Store as a lead with source "contact" — captures the inquiry
      // and triggers the same notification pipeline as the lead form.
      const subject = data.get("subject") as string;
      const message = data.get("message") as string;
      const company = [subject, message].filter(Boolean).join(" — ");

      const res = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: data.get("name"),
          email: data.get("email"),
          company, // Store subject + message in company field
          source: "contact",
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
    <section className="section">
      <div className="container">
        <div className="max-w-2xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="font-display text-4xl sm:text-5xl font-bold tracking-tight text-foreground text-balance">
              {contact.headline}
            </h1>
            <p className="mt-4 text-lg text-muted leading-relaxed">
              {contact.subtitle}
            </p>
          </div>

          {submitted ? (
            <div className="text-center py-16 px-6 rounded-xl border border-success/20 bg-success/5">
              <CheckCircle size={48} className="text-success mx-auto mb-4" />
              <h2 className="text-xl font-semibold text-foreground mb-2">
                Message sent!
              </h2>
              <p className="text-muted">
                Thanks for reaching out. We&apos;ll get back to you within 24 hours.
              </p>
            </div>
          ) : (
            <div className="grid md:grid-cols-[1fr_auto] gap-12">
              {/* Form */}
              <form onSubmit={handleSubmit} className="space-y-5">
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
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      placeholder="jane@acme.com"
                      required
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="subject">Subject</Label>
                  <Input
                    id="subject"
                    name="subject"
                    placeholder="How can we help?"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="message">Message</Label>
                  <Textarea
                    id="message"
                    name="message"
                    placeholder="Tell us more about what you need..."
                    required
                  />
                </div>
                {error && (
                  <p className="text-sm text-error">{error}</p>
                )}
                <Button type="submit" size="lg" disabled={loading}>
                  {loading ? (
                    <span className="flex items-center gap-2">
                      <span className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Sending...
                    </span>
                  ) : (
                    <span className="flex items-center gap-2">
                      Send message
                      <ArrowRight size={16} />
                    </span>
                  )}
                </Button>
              </form>

              {/* Contact info sidebar */}
              <div className="hidden md:flex flex-col gap-6 pt-8">
                <div className="flex items-start gap-3">
                  <div className="h-10 w-10 rounded-lg bg-primary/8 flex items-center justify-center shrink-0">
                    <Mail size={18} className="text-primary" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-foreground">Email</p>
                    <a
                      href={`mailto:${contact.email}`}
                      className="text-sm text-muted hover:text-primary transition-colors"
                    >
                      {contact.email}
                    </a>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
