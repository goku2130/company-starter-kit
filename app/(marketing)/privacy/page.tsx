import type { Metadata } from "next";
import { siteConfig } from "@/site.config";

export const metadata: Metadata = {
  title: `Privacy Policy — ${siteConfig.name}`,
};

export default function PrivacyPage() {
  return (
    <section className="section">
      <div className="container">
        <div className="max-w-2xl mx-auto prose prose-sm">
          <h1 className="font-display text-4xl font-bold tracking-tight text-foreground mb-8">
            Privacy Policy
          </h1>
          <p className="text-muted leading-relaxed">
            {siteConfig.name} respects your privacy. We collect only the
            information you provide (name, email, company) to deliver our
            services and communicate with you. We do not sell your data to
            third parties.
          </p>
          <p className="text-muted leading-relaxed mt-4">
            Payment processing is handled securely by Stripe. We never store
            your card details on our servers.
          </p>
          <p className="text-muted leading-relaxed mt-4">
            For questions about this policy, contact us at{" "}
            <a
              href={`mailto:${siteConfig.contact.email}`}
              className="text-primary hover:underline"
            >
              {siteConfig.contact.email}
            </a>
            .
          </p>
        </div>
      </div>
    </section>
  );
}
