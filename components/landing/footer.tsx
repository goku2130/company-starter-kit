import Link from "next/link";
import { siteConfig } from "@/site.config";

export function Footer() {
  const { footer, name } = siteConfig;
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-border bg-surface">
      <div className="container section">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <div className="flex items-center gap-2.5 mb-4">
              <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center">
                <span className="text-white font-bold text-sm">
                  {name.charAt(0)}
                </span>
              </div>
              <span className="font-display font-semibold text-lg text-foreground">
                {name}
              </span>
            </div>
            <p className="text-sm text-muted leading-relaxed max-w-xs">
              {siteConfig.tagline}
            </p>
          </div>

          {/* Product links */}
          <div>
            <h4 className="text-sm font-semibold text-foreground mb-4">
              Product
            </h4>
            <ul className="space-y-2.5">
              {footer.productLinks.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-sm text-muted hover:text-foreground transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company links */}
          <div>
            <h4 className="text-sm font-semibold text-foreground mb-4">
              Company
            </h4>
            <ul className="space-y-2.5">
              {footer.companyLinks.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-sm text-muted hover:text-foreground transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal links */}
          <div>
            <h4 className="text-sm font-semibold text-foreground mb-4">
              Legal
            </h4>
            <ul className="space-y-2.5">
              {footer.legalLinks.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-sm text-muted hover:text-foreground transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-12 pt-8 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm text-muted-light">
            &copy; {year} {footer.copyright}. All rights reserved.
          </p>
          <p className="text-xs text-muted-light">
            Powered by{" "}
            <a
              href="https://yoctocorp.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-muted hover:text-foreground transition-colors"
            >
              YoctoCorp
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
