"use client";

import { useState } from "react";
import Link from "next/link";
import { siteConfig } from "@/site.config";
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";

const navLinks = [
  { label: "Features", href: "/#features" },
  { label: "Pricing", href: "/pricing" },
  { label: "Contact", href: "/contact" },
];

export function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/50 bg-background/80 backdrop-blur-lg">
      <div className="container flex h-16 items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2.5">
          <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center">
            <span className="text-white font-bold text-sm">
              {siteConfig.name.charAt(0)}
            </span>
          </div>
          <span className="font-display font-semibold text-lg text-foreground">
            {siteConfig.name}
          </span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm text-muted hover:text-foreground transition-colors"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Desktop CTA */}
        <div className="hidden md:flex items-center gap-3">
          <Button variant="ghost" size="sm" asChild>
            <Link href="/admin">Log in</Link>
          </Button>
          <Button size="sm" asChild>
            <Link href="#lead-form">{siteConfig.hero.cta.label}</Link>
          </Button>
        </div>

        {/* Mobile menu button */}
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="md:hidden p-2 text-muted hover:text-foreground transition-colors"
          aria-label="Toggle menu"
        >
          {mobileOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {/* Mobile nav */}
      {mobileOpen && (
        <div className="md:hidden border-t border-border bg-background">
          <div className="container py-4 flex flex-col gap-3">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className="text-sm text-muted hover:text-foreground transition-colors py-2"
              >
                {link.label}
              </Link>
            ))}
            <div className="pt-2 border-t border-border flex flex-col gap-2">
              <Button variant="outline" size="sm" asChild>
                <Link href="/admin" onClick={() => setMobileOpen(false)}>Log in</Link>
              </Button>
              <Button size="sm" asChild>
                <Link href="#lead-form" onClick={() => setMobileOpen(false)}>
                  {siteConfig.hero.cta.label}
                </Link>
              </Button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
