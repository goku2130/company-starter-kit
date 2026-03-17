import type { Metadata } from "next";
import { siteConfig } from "@/site.config";

export const metadata: Metadata = {
  title: `Terms of Service — ${siteConfig.name}`,
};

export default function TermsPage() {
  return (
    <section className="section">
      <div className="container">
        <div className="max-w-2xl mx-auto prose prose-sm">
          <h1 className="font-display text-4xl font-bold tracking-tight text-foreground mb-8">
            Terms of Service
          </h1>
          <p className="text-muted leading-relaxed">
            By using {siteConfig.name}, you agree to these terms. Our
            service is provided &ldquo;as is&rdquo; during the early adopters
            program.
          </p>
          <p className="text-muted leading-relaxed mt-4">
            Early adopter pricing is locked in for the lifetime of your
            subscription. You can cancel at any time — no questions asked.
          </p>
          <p className="text-muted leading-relaxed mt-4">
            We may update these terms as the product evolves. Material changes
            will be communicated via email.
          </p>
          <p className="text-muted leading-relaxed mt-4">
            For questions, contact{" "}
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
