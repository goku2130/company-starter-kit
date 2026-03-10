import type { Metadata } from "next";
import Link from "next/link";
import { siteConfig } from "@/site.config";
import { Button } from "@/components/ui/button";
import { CheckCircle, ArrowLeft } from "lucide-react";

export const metadata: Metadata = {
  title: `Thank you — ${siteConfig.name}`,
};

export default function ThankYouPage() {
  return (
    <section className="section">
      <div className="container">
        <div className="max-w-lg mx-auto text-center py-16">
          <CheckCircle
            size={64}
            className="text-success mx-auto mb-6"
          />
          <h1 className="font-display text-3xl sm:text-4xl font-bold tracking-tight text-foreground mb-4">
            Thank you!
          </h1>
          <p className="text-lg text-muted leading-relaxed mb-8">
            Your payment was successful. We&apos;ll send a confirmation to your
            email shortly.
          </p>
          <Button variant="secondary" size="lg" asChild>
            <Link href="/">
              <ArrowLeft size={16} />
              Back to {siteConfig.name}
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
