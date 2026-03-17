"use client";

import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import { AlertTriangle } from "lucide-react";

/**
 * Shows a banner when the user arrives from a failed auth redirect.
 * The middleware redirects to /?auth=required or /?auth=expired.
 */
export function AuthBanner() {
  return (
    <Suspense>
      <AuthBannerContent />
    </Suspense>
  );
}

function AuthBannerContent() {
  const searchParams = useSearchParams();
  const auth = searchParams.get("auth");

  if (!auth) return null;

  const message =
    auth === "expired"
      ? "Your session has expired. Please log in again from your dashboard."
      : "You need to log in to access the admin area. Use your YoctoCorp dashboard to sign in.";

  return (
    <div className="bg-warning/10 border-b border-warning/20">
      <div className="container flex items-center gap-3 py-3 text-sm">
        <AlertTriangle size={16} className="text-warning shrink-0" />
        <p className="text-foreground">{message}</p>
      </div>
    </div>
  );
}
