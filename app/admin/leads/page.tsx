"use client";

import { useEffect, useState } from "react";
import { AdminHeader } from "@/components/admin/admin-header";
import { Users, Download, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface Lead {
  id: number;
  name: string;
  email: string;
  company: string;
  source: string;
  created_at: string;
}

export default function LeadsPage() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetch("/api/admin/leads")
      .then((r) => (r.ok ? r.json() : null))
      .then((data: { data?: Lead[] } | null) => {
        if (data?.data) setLeads(data.data);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const filtered = leads.filter(
    (l) =>
      l.name.toLowerCase().includes(search.toLowerCase()) ||
      l.email.toLowerCase().includes(search.toLowerCase()) ||
      l.company.toLowerCase().includes(search.toLowerCase()),
  );

  function exportCsv() {
    const header = "Name,Email,Company,Source,Date\n";
    const rows = leads
      .map(
        (l) =>
          `"${l.name}","${l.email}","${l.company}","${l.source}","${l.created_at}"`,
      )
      .join("\n");
    const blob = new Blob([header + rows], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `leads-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <>
      <AdminHeader title="Leads" />
      <div className="flex-1 p-8">
        {/* Toolbar */}
        <div className="flex items-center gap-4 mb-6">
          <div className="relative flex-1 max-w-sm">
            <Search
              size={16}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-muted"
            />
            <Input
              placeholder="Search leads..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9"
            />
          </div>
          <Button variant="secondary" size="sm" onClick={exportCsv}>
            <Download size={14} />
            Export CSV
          </Button>
        </div>

        {/* Table */}
        <div className="rounded-xl border border-border bg-surface-raised overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-surface">
                <th className="text-left px-6 py-3 font-medium text-muted text-xs uppercase tracking-wider">
                  Name
                </th>
                <th className="text-left px-6 py-3 font-medium text-muted text-xs uppercase tracking-wider">
                  Email
                </th>
                <th className="text-left px-6 py-3 font-medium text-muted text-xs uppercase tracking-wider">
                  Company
                </th>
                <th className="text-left px-6 py-3 font-medium text-muted text-xs uppercase tracking-wider">
                  Source
                </th>
                <th className="text-left px-6 py-3 font-medium text-muted text-xs uppercase tracking-wider">
                  Date
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {loading ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center">
                    <div className="h-5 w-5 border-2 border-primary/30 border-t-primary rounded-full animate-spin mx-auto" />
                  </td>
                </tr>
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center">
                    <Users
                      size={32}
                      className="text-muted/30 mx-auto mb-3"
                    />
                    <p className="text-sm text-muted">
                      {search ? "No leads match your search" : "No leads yet"}
                    </p>
                  </td>
                </tr>
              ) : (
                filtered.map((lead) => (
                  <tr
                    key={lead.id}
                    className="hover:bg-surface transition-colors"
                  >
                    <td className="px-6 py-3.5 font-medium text-foreground">
                      {lead.name}
                    </td>
                    <td className="px-6 py-3.5 text-muted">{lead.email}</td>
                    <td className="px-6 py-3.5 text-muted">
                      {lead.company || "—"}
                    </td>
                    <td className="px-6 py-3.5">
                      <span
                        className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${
                          lead.source === "converted"
                            ? "bg-success/10 text-success"
                            : "bg-primary/8 text-primary"
                        }`}
                      >
                        {lead.source}
                      </span>
                    </td>
                    <td className="px-6 py-3.5 text-muted-light">
                      {new Date(lead.created_at).toLocaleDateString()}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Count */}
        <p className="mt-4 text-xs text-muted-light">
          {filtered.length} lead{filtered.length !== 1 ? "s" : ""}
          {search ? ` matching "${search}"` : ""}
        </p>
      </div>
    </>
  );
}
