import { Navbar } from "@/components/landing/navbar";
import { Footer } from "@/components/landing/footer";
import { AuthBanner } from "@/components/landing/auth-banner";

export default function MarketingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Navbar />
      <AuthBanner />
      <main className="flex-1">{children}</main>
      <Footer />
    </>
  );
}
