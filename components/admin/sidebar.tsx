"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { siteConfig } from "@/site.config";
import { cn } from "@/lib/utils";
import {
  Users,
  CreditCard,
  Settings,
  LayoutDashboard,
  LogOut,
  ExternalLink,
} from "lucide-react";

const navItems = [
  { label: "Dashboard", href: "/admin", icon: LayoutDashboard },
  { label: "Leads", href: "/admin/leads", icon: Users },
  { label: "Payments", href: "/admin/payments", icon: CreditCard },
  { label: "Settings", href: "/admin/settings", icon: Settings },
];

export function AdminSidebar() {
  const pathname = usePathname();

  async function handleLogout() {
    await fetch("/api/auth/logout", { method: "POST" });
    window.location.href = "/";
  }

  return (
    <aside className="w-64 shrink-0 border-r border-border bg-surface flex flex-col h-screen sticky top-0">
      {/* Brand */}
      <div className="h-16 flex items-center gap-2.5 px-6 border-b border-border">
        <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center">
          <span className="text-white font-bold text-sm">
            {siteConfig.name.charAt(0)}
          </span>
        </div>
        <div>
          <span className="font-display font-semibold text-foreground text-sm">
            {siteConfig.name}
          </span>
          <span className="block text-[10px] text-muted leading-none">
            Admin
          </span>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-1">
        {navItems.map((item) => {
          const isActive =
            pathname === item.href ||
            (item.href !== "/admin" && pathname.startsWith(item.href));

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors",
                isActive
                  ? "bg-primary/8 text-primary font-medium"
                  : "text-muted hover:text-foreground hover:bg-surface-raised",
              )}
            >
              <item.icon size={18} />
              {item.label}
            </Link>
          );
        })}
      </nav>

      {/* Bottom */}
      <div className="px-3 py-4 border-t border-border space-y-1">
        <Link
          href="/"
          target="_blank"
          className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-muted hover:text-foreground hover:bg-surface-raised transition-colors"
        >
          <ExternalLink size={18} />
          View site
        </Link>
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-muted hover:text-foreground hover:bg-surface-raised transition-colors w-full text-left cursor-pointer"
        >
          <LogOut size={18} />
          Log out
        </button>
      </div>
    </aside>
  );
}
