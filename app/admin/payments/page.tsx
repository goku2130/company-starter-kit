"use client";

import { useEffect, useState } from "react";
import { AdminHeader } from "@/components/admin/admin-header";
import { CreditCard } from "lucide-react";

interface Payment {
  id: number;
  customer_email: string;
  amount_cents: number;
  currency: string;
  status: string;
  metadata: { customer_name?: string; plan?: string };
  created_at: string;
}

const statusStyles: Record<string, string> = {
  paid: "bg-success/10 text-success",
  pending: "bg-warning/10 text-warning",
  expired: "bg-error/10 text-error",
};

export default function PaymentsPage() {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/admin/payments")
      .then((r) => (r.ok ? r.json() : null))
      .then((data: { data?: Payment[] } | null) => {
        if (data?.data) setPayments(data.data);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const totalRevenue = payments
    .filter((p) => p.status === "paid")
    .reduce((sum, p) => sum + p.amount_cents, 0);

  return (
    <>
      <AdminHeader title="Payments" />
      <div className="flex-1 p-8">
        {/* Summary */}
        <div className="grid sm:grid-cols-3 gap-6 mb-8">
          <div className="p-6 rounded-xl border border-border bg-surface-raised">
            <p className="text-sm text-muted mb-1">Total revenue</p>
            <p className="font-display text-2xl font-bold text-foreground">
              €{(totalRevenue / 100).toFixed(2)}
            </p>
          </div>
          <div className="p-6 rounded-xl border border-border bg-surface-raised">
            <p className="text-sm text-muted mb-1">Paid</p>
            <p className="font-display text-2xl font-bold text-success">
              {payments.filter((p) => p.status === "paid").length}
            </p>
          </div>
          <div className="p-6 rounded-xl border border-border bg-surface-raised">
            <p className="text-sm text-muted mb-1">Pending</p>
            <p className="font-display text-2xl font-bold text-warning">
              {payments.filter((p) => p.status === "pending").length}
            </p>
          </div>
        </div>

        {/* Table */}
        <div className="rounded-xl border border-border bg-surface-raised overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-surface">
                <th className="text-left px-6 py-3 font-medium text-muted text-xs uppercase tracking-wider">
                  Customer
                </th>
                <th className="text-left px-6 py-3 font-medium text-muted text-xs uppercase tracking-wider">
                  Amount
                </th>
                <th className="text-left px-6 py-3 font-medium text-muted text-xs uppercase tracking-wider">
                  Status
                </th>
                <th className="text-left px-6 py-3 font-medium text-muted text-xs uppercase tracking-wider">
                  Plan
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
              ) : payments.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center">
                    <CreditCard
                      size={32}
                      className="text-muted/30 mx-auto mb-3"
                    />
                    <p className="text-sm text-muted">No payments yet</p>
                    <p className="text-xs text-muted-light mt-1">
                      Payments will appear here once customers subscribe
                    </p>
                  </td>
                </tr>
              ) : (
                payments.map((payment) => (
                  <tr
                    key={payment.id}
                    className="hover:bg-surface transition-colors"
                  >
                    <td className="px-6 py-3.5">
                      <p className="font-medium text-foreground">
                        {payment.metadata?.customer_name ||
                          payment.customer_email}
                      </p>
                      <p className="text-xs text-muted">
                        {payment.customer_email}
                      </p>
                    </td>
                    <td className="px-6 py-3.5 font-medium text-foreground">
                      €{(payment.amount_cents / 100).toFixed(2)}
                    </td>
                    <td className="px-6 py-3.5">
                      <span
                        className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${statusStyles[payment.status] ?? "bg-surface text-muted"}`}
                      >
                        {payment.status}
                      </span>
                    </td>
                    <td className="px-6 py-3.5 text-muted">
                      {payment.metadata?.plan ?? "—"}
                    </td>
                    <td className="px-6 py-3.5 text-muted-light">
                      {new Date(payment.created_at).toLocaleDateString()}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}
