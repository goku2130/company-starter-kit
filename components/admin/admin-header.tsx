"use client";

import { useEffect, useState } from "react";
import type { SessionUser } from "@/lib/auth";

export function AdminHeader({ title }: { title: string }) {
  const [user, setUser] = useState<SessionUser | null>(null);

  useEffect(() => {
    fetch("/api/auth/session")
      .then((r) => (r.ok ? r.json() : null))
      .then((data: { data?: SessionUser } | null) => {
        if (data?.data) setUser(data.data);
      })
      .catch(() => {
        /* ignore */
      });
  }, []);

  return (
    <header className="h-16 border-b border-border bg-background flex items-center justify-between px-8">
      <h1 className="font-display text-lg font-semibold text-foreground">
        {title}
      </h1>
      {user && (
        <div className="flex items-center gap-3">
          <div className="h-8 w-8 rounded-full bg-primary/8 flex items-center justify-center">
            <span className="text-xs font-semibold text-primary">
              {user.name
                .split(" ")
                .map((n) => n[0])
                .join("")}
            </span>
          </div>
          <div className="text-right">
            <p className="text-sm font-medium text-foreground">{user.name}</p>
            <p className="text-xs text-muted">{user.email}</p>
          </div>
        </div>
      )}
    </header>
  );
}
