"use client";

import { useEffect, useState } from "react";
import { AdminHeader } from "@/components/admin/admin-header";
import { Users, CreditCard, TrendingUp, Clock } from "lucide-react";
import Link from "next/link";

interface Stats {
  totalLeads: number;
  leadsThisWeek: number;
  totalPayments: number;
  revenue: number;
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [recentLeads, setRecentLeads] = useState<
    Array<{ id: number; name: string; email: string; created_at: string }>
  >([]);

  useEffect(() => {
    // Fetch dashboard stats
    fetch("/api/admin/stats")
      .then((r) => (r.ok ? r.json() : null))
      .then((data: { data?: Stats } | null) => {
        if (data?.data) setStats(data.data);
      })
      .catch(() => {});

    // Fetch recent leads
    fetch("/api/admin/leads?limit=5")
      .then((r) => (r.ok ? r.json() : null))
      .then(
        (data: {
          data?: Array<{
            id: number;
            name: string;
            email: string;
            created_at: string;
          }>;
        } | null) => {
          if (data?.data) setRecentLeads(data.data);
        },
      )
      .catch(() => {});
  }, []);

  const cards = [
    {
      label: "Total leads",
      value: stats?.totalLeads ?? "—",
      icon: Users,
      href: "/admin/leads",
      color: "text-primary",
      bg: "bg-primary/8",
    },
    {
      label: "This week",
      value: stats?.leadsThisWeek ?? "—",
      icon: TrendingUp,
      href: "/admin/leads",
      color: "text-accent",
      bg: "bg-accent/8",
    },
    {
      label: "Payments",
      value: stats?.totalPayments ?? "—",
      icon: CreditCard,
      href: "/admin/payments",
      color: "text-success",
      bg: "bg-success/8",
    },
    {
      label: "Revenue",
      value:
        stats?.revenue != null
          ? `€${(stats.revenue / 100).toFixed(2)}`
          : "—",
      icon: TrendingUp,
      href: "/admin/payments",
      color: "text-warning",
      bg: "bg-warning/8",
    },
  ];

  return (
    <>
      <AdminHeader title="Dashboard" />
      <div className="flex-1 p-8 space-y-8">
        {/* Stat cards */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {cards.map((card) => (
            <Link
              key={card.label}
              href={card.href}
              className="p-6 rounded-xl border border-border bg-surface-raised hover:shadow-md hover:border-border-light transition-all"
            >
              <div className="flex items-center justify-between mb-4">
                <span className="text-sm text-muted">{card.label}</span>
                <div
                  className={`h-9 w-9 rounded-lg ${card.bg} flex items-center justify-center`}
                >
                  <card.icon size={18} className={card.color} />
                </div>
              </div>
              <p className="font-display text-2xl font-bold text-foreground">
                {card.value}
              </p>
            </Link>
          ))}
        </div>

        {/* Recent leads */}
        <div className="rounded-xl border border-border bg-surface-raised">
          <div className="px-6 py-4 border-b border-border flex items-center justify-between">
            <h2 className="font-semibold text-foreground">Recent leads</h2>
            <Link
              href="/admin/leads"
              className="text-sm text-primary hover:underline"
            >
              View all
            </Link>
          </div>
          {recentLeads.length === 0 ? (
            <div className="px-6 py-12 text-center">
              <Clock size={32} className="text-muted/30 mx-auto mb-3" />
              <p className="text-sm text-muted">No leads yet</p>
              <p className="text-xs text-muted-light mt-1">
                Leads will appear here as they come in
              </p>
            </div>
          ) : (
            <div className="divide-y divide-border">
              {recentLeads.map((lead) => (
                <div
                  key={lead.id}
                  className="px-6 py-3.5 flex items-center justify-between"
                >
                  <div>
                    <p className="text-sm font-medium text-foreground">
                      {lead.name}
                    </p>
                    <p className="text-xs text-muted">{lead.email}</p>
                  </div>
                  <time className="text-xs text-muted-light">
                    {new Date(lead.created_at).toLocaleDateString()}
                  </time>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
