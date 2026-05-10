"use client";

export const runtime = 'edge';
export const dynamic = 'force-dynamic';

import { useState, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Building2, Mail, Lock, User, Eye, EyeOff } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

export default function SignUpPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center bg-slate-50">Loading...</div>}>
      <SignUpInner />
    </Suspense>
  );
}

function SignUpInner() {
  const router = useRouter();
  const params = useSearchParams();
  const redirectTo = params.get("redirectTo") || "/projects";
  const supabase = createClient();

  const [mode, setMode] = useState<"signup" | "login">("signup");
  const [showPassword, setShowPassword] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [info, setInfo] = useState<string | null>(null);

  const set = (k: string, v: string) =>
    setForm((p) => ({ ...p, [k]: v }));

  async function handleSubmit() {
    setError(null);
    setInfo(null);
    setLoading(true);

    try {
      if (mode === "signup") {
        const { data, error } = await supabase.auth.signUp({
          email: form.email,
          password: form.password,
          options: {
            emailRedirectTo:
              typeof window !== "undefined"
                ? `${window.location.origin}${redirectTo}`
                : undefined,
            data: {
              full_name: form.name,
              org_name:
                form.name && form.name.trim().length > 0
                  ? `${form.name}'s Company`
                  : `${form.email.split("@")[0]}'s Company`,
            },
          },
        });
        if (error) {
          setError(error.message);
          return;
        }
        // If email confirmation is on, no session yet.
        if (!data.session) {
          setInfo(
            "Check your email to confirm your account, then come back and log in."
          );
          setMode("login");
          return;
        }
        router.push(redirectTo);
        router.refresh();
      } else {
        const { error } = await supabase.auth.signInWithPassword({
          email: form.email,
          password: form.password,
        });
        if (error) {
          setError(error.message);
          return;
        }
        router.push(redirectTo);
        router.refresh();
      }
    } catch (e: unknown) {
      const msg =
        e instanceof Error ? e.message : "Something went wrong, please retry.";
      setError(msg);
    } finally {
      setLoading(false);
    }
  }

  function onSubmitForm(e: React.FormEvent) {
    e.preventDefault();
    void handleSubmit();
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 -m-6 -ml-64">
      <div className="w-full max-w-md p-8">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-blue-600 to-violet-600 flex items-center justify-center mx-auto mb-3">
            <Building2 size={28} className="text-white" />
          </div>
          <h1 className="text-2xl font-bold text-slate-900">FlipCRM</h1>
          <p className="text-sm text-slate-500">by Reinnovation Homes</p>
        </div>

        <form
          onSubmit={onSubmitForm}
          className="bg-white rounded-2xl shadow-xl border border-slate-200 p-6"
        >
          {/* Tabs */}
          <div className="flex mb-6 bg-slate-100 rounded-lg p-1">
            <button
              type="button"
              onClick={() => {
                setMode("signup");
                setError(null);
                setInfo(null);
              }}
              className={`flex-1 py-2 text-sm font-medium rounded-md transition ${
                mode === "signup"
                  ? "bg-white shadow text-slate-900"
                  : "text-slate-500"
              }`}
            >
              Sign Up
            </button>
            <button
              type="button"
              onClick={() => {
                setMode("login");
                setError(null);
                setInfo(null);
              }}
              className={`flex-1 py-2 text-sm font-medium rounded-md transition ${
                mode === "login"
                  ? "bg-white shadow text-slate-900"
                  : "text-slate-500"
              }`}
            >
              Log In
            </button>
          </div>

          {/* Form */}
          <div className="space-y-3">
            {mode === "signup" && (
              <div className="relative">
                <User
                  size={16}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                />
                <input
                  type="text"
                  placeholder="Full Name"
                  value={form.name}
                  onChange={(e) => set("name", e.target.value)}
                  required
                  className="w-full pl-10 pr-4 py-2.5 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            )}
            <div className="relative">
              <Mail
                size={16}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
              />
              <input
                type="email"
                placeholder="Email Address"
                value={form.email}
                onChange={(e) => set("email", e.target.value)}
                required
                autoComplete="email"
                className="w-full pl-10 pr-4 py-2.5 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="relative">
              <Lock
                size={16}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
              />
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Password (8+ chars)"
                value={form.password}
                onChange={(e) => set("password", e.target.value)}
                required
                minLength={8}
                autoComplete={
                  mode === "signup" ? "new-password" : "current-password"
                }
                className="w-full pl-10 pr-10 py-2.5 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          {error && (
            <p className="text-sm text-red-600 mt-3" role="alert">
              {error}
            </p>
          )}
          {info && (
            <p className="text-sm text-emerald-600 mt-3" role="status">
              {info}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full mt-4 py-2.5 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition disabled:opacity-60"
          >
            {loading
              ? mode === "signup"
                ? "Creating account..."
                : "Logging in..."
              : mode === "signup"
              ? "Create Account"
              : "Log In"}
          </button>
        </form>

        <p className="text-center text-xs text-slate-400 mt-6">
          <Link href="/" className="text-blue-600 hover:text-blue-700">
            ← Back to Dashboard
          </Link>
        </p>
      </div>
    </div>
  );
}
