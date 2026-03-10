import { Hero } from "@/components/landing/hero";
import { Features } from "@/components/landing/features";
import { HowItWorks } from "@/components/landing/how-it-works";
import { Testimonials } from "@/components/landing/testimonials";
import { Pricing } from "@/components/landing/pricing";
import { LeadForm } from "@/components/landing/lead-form";
import { CtaSection } from "@/components/landing/cta-section";

export default function HomePage() {
  return (
    <>
      <Hero />
      <Features />
      <HowItWorks />
      <Testimonials />
      <Pricing />
      <LeadForm />
      <CtaSection />
    </>
  );
}
