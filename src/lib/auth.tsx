"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";

interface AuthUser {
  id: string;
  name: string;
  email: string;
  avatarInitials: string;
}

interface AuthContextValue {
  user: AuthUser | null;
  hydrated: boolean;
  signIn: (email: string, name?: string) => void;
  signOut: () => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);
const AUTH_KEY = "flipcrm_auth_v1";

function getInitials(name: string): string {
  const parts = name.trim().split(/\s+/);
  if (parts.length === 0) return "U";
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

const DEFAULT_USER: AuthUser = {
  id: "local-default",
  name: "Chris Leonard",
  email: "chris@flipcrm.io",
  avatarInitials: "CL",
};

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(AUTH_KEY);
      if (raw) {
        setUser(JSON.parse(raw));
      } else {
        // First open — seed with default user so the app feels signed-in
        setUser(DEFAULT_USER);
        localStorage.setItem(AUTH_KEY, JSON.stringify(DEFAULT_USER));
      }
    } catch {
      setUser(DEFAULT_USER);
    }
    setHydrated(true);
  }, []);

  const signIn = (email: string, name?: string) => {
    const displayName = name?.trim() || email.split("@")[0];
    const u: AuthUser = {
      id: `local-${Date.now()}`,
      email: email.trim().toLowerCase(),
      name: displayName,
      avatarInitials: getInitials(displayName),
    };
    setUser(u);
    try { localStorage.setItem(AUTH_KEY, JSON.stringify(u)); } catch {}
  };

  const signOut = () => {
    setUser(null);
    try { localStorage.removeItem(AUTH_KEY); } catch {}
  };

  return <AuthContext.Provider value={{ user, hydrated, signIn, signOut }}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
