"use client";

import { useEffect, useState } from "react";
import { createClient } from "./supabase/client";

export interface AppUser {
  id: string;
  email: string;
  name: string;
  initials: string;
}

function deriveName(meta: Record<string, unknown> | null | undefined, email: string): string {
  const full = (meta?.full_name || meta?.name) as string | undefined;
  if (full && full.trim()) return full.trim();
  return email.split("@")[0];
}

function deriveInitials(name: string): string {
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

export function useUser() {
  const [user, setUser] = useState<AppUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const supabase = createClient();
    let active = true;

    supabase.auth.getUser().then(({ data }) => {
      if (!active) return;
      const u = data.user;
      if (u) {
        const name = deriveName(u.user_metadata as Record<string, unknown>, u.email || "");
        setUser({
          id: u.id,
          email: u.email || "",
          name,
          initials: deriveInitials(name),
        });
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    const { data: sub } = supabase.auth.onAuthStateChange((_event, session) => {
      const u = session?.user;
      if (u) {
        const name = deriveName(u.user_metadata as Record<string, unknown>, u.email || "");
        setUser({
          id: u.id,
          email: u.email || "",
          name,
          initials: deriveInitials(name),
        });
      } else {
        setUser(null);
      }
    });

    return () => {
      active = false;
      sub.subscription.unsubscribe();
    };
  }, []);

  return { user, loading };
}

export async function signOut() {
  const supabase = createClient();
  await supabase.auth.signOut();
  if (typeof window !== "undefined") window.location.href = "/landingpage";
}
