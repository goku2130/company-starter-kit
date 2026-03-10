"use client";

import { useEffect, useState, type FormEvent } from "react";
import { AdminHeader } from "@/components/admin/admin-header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { CheckCircle } from "lucide-react";

interface SiteSettings {
  site_name: string;
  site_tagline: string;
  contact_email: string;
  early_adopter_price_cents: number;
  trial_days: number;
}

export default function SettingsPage() {
  const [settings, setSettings] = useState<SiteSettings>({
    site_name: "",
    site_tagline: "",
    contact_email: "",
    early_adopter_price_cents: 1900,
    trial_days: 14,
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    fetch("/api/admin/settings")
      .then((r) => (r.ok ? r.json() : null))
      .then((data: { data?: SiteSettings } | null) => {
        if (data?.data) setSettings(data.data);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setSaving(true);
    setSaved(false);

    try {
      const res = await fetch("/api/admin/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(settings),
      });
      if (res.ok) setSaved(true);
    } catch {
      /* ignore */
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <>
        <AdminHeader title="Settings" />
        <div className="flex-1 flex items-center justify-center">
          <div className="h-6 w-6 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
        </div>
      </>
    );
  }

  return (
    <>
      <AdminHeader title="Settings" />
      <div className="flex-1 p-8">
        <form onSubmit={handleSubmit} className="max-w-xl space-y-6">
          {/* Site name */}
          <div className="space-y-2">
            <Label htmlFor="site_name">Site name</Label>
            <Input
              id="site_name"
              value={settings.site_name}
              onChange={(e) =>
                setSettings((s) => ({ ...s, site_name: e.target.value }))
              }
            />
          </div>

          {/* Tagline */}
          <div className="space-y-2">
            <Label htmlFor="site_tagline">Tagline</Label>
            <Textarea
              id="site_tagline"
              rows={2}
              value={settings.site_tagline}
              onChange={(e) =>
                setSettings((s) => ({ ...s, site_tagline: e.target.value }))
              }
            />
          </div>

          {/* Contact email */}
          <div className="space-y-2">
            <Label htmlFor="contact_email">Contact email</Label>
            <Input
              id="contact_email"
              type="email"
              value={settings.contact_email}
              onChange={(e) =>
                setSettings((s) => ({ ...s, contact_email: e.target.value }))
              }
            />
          </div>

          {/* Pricing */}
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="price">Early adopter price (cents)</Label>
              <Input
                id="price"
                type="number"
                value={settings.early_adopter_price_cents}
                onChange={(e) =>
                  setSettings((s) => ({
                    ...s,
                    early_adopter_price_cents: parseInt(e.target.value) || 0,
                  }))
                }
              />
              <p className="text-xs text-muted-light">
                €{(settings.early_adopter_price_cents / 100).toFixed(2)}/month
              </p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="trial_days">Free trial days</Label>
              <Input
                id="trial_days"
                type="number"
                value={settings.trial_days}
                onChange={(e) =>
                  setSettings((s) => ({
                    ...s,
                    trial_days: parseInt(e.target.value) || 0,
                  }))
                }
              />
            </div>
          </div>

          {/* Save */}
          <div className="flex items-center gap-4 pt-2">
            <Button type="submit" disabled={saving}>
              {saving ? "Saving..." : "Save settings"}
            </Button>
            {saved && (
              <span className="flex items-center gap-1.5 text-sm text-success">
                <CheckCircle size={16} />
                Saved
              </span>
            )}
          </div>
        </form>
      </div>
    </>
  );
}
