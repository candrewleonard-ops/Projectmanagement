"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  FolderKanban, HardHat, FileText, TrendingUp, AlertTriangle,
  BarChart3, Shield, Zap, ArrowRight, Mail, Lock, User, Eye, EyeOff,
  CheckCircle2, ListChecks, Phone, Globe, DollarSign,
} from "lucide-react";
import { useAuth } from "@/lib/auth";
import { useToast } from "@/components/Toast";

const features = [
  {
    icon: FolderKanban,
    title: "Project Management",
    desc: "Track every fix-and-flip from acquisition to sale. Budget tracking, scope of work, timelines — all in one place.",
    color: "blue",
    gradient: "from-blue-500 to-blue-600",
    shadow: "shadow-blue-500/25",
  },
  {
    icon: HardHat,
    title: "Contractor Hub",
    desc: "Manage your contractor rolodex, assign them to projects, track specialties and performance across every job.",
    color: "amber",
    gradient: "from-amber-500 to-orange-500",
    shadow: "shadow-amber-500/25",
  },
  {
    icon: FileText,
    title: "Invoice Tracking",
    desc: "Create, send, and track invoices per project. See paid vs. pending at a glance with real-time totals.",
    color: "violet",
    gradient: "from-violet-500 to-purple-600",
    shadow: "shadow-violet-500/25",
  },
  {
    icon: AlertTriangle,
    title: "Hot Tasks & Comms",
    desc: "Critical tasks surface automatically. Communication logs keep your entire team on the same page.",
    color: "red",
    gradient: "from-red-500 to-rose-600",
    shadow: "shadow-red-500/25",
  },
  {
    icon: TrendingUp,
    title: "Portfolio Analytics",
    desc: "Track your passive income portfolio, ARV estimates, and ROI across all properties at once.",
    color: "emerald",
    gradient: "from-emerald-500 to-teal-600",
    shadow: "shadow-emerald-500/25",
  },
  {
    icon: BarChart3,
    title: "Budget vs. Spent",
    desc: "Visual charts show budget vs. actual spending per project. Catch overruns before they kill your margin.",
    color: "cyan",
    gradient: "from-cyan-500 to-blue-500",
    shadow: "shadow-cyan-500/25",
  },
];

const stats = [
  { label: "Projects Managed", value: "500+" },
  { label: "Contractor Network", value: "1,200+" },
  { label: "Invoices Processed", value: "$12M+" },
  { label: "Time Saved Weekly", value: "15hrs" },
];

const demoTasks = [
  { title: "Kitchen demo complete", status: "completed", project: "123 Oak St" },
  { title: "Plumbing rough-in inspection", status: "in_progress", project: "456 Elm Ave" },
  { title: "Flooring delivery scheduled", status: "scheduled", project: "123 Oak St" },
  { title: "HVAC install — blocked on permit", status: "blocked", project: "789 Pine Rd" },
];

export function LandingPage() {
  const [authMode, setAuthMode] = useState<"login" | "signup">("login");
  const [showAuth, setShowAuth] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [submitting, setSubmitting] = useState(false);
  const { signIn } = useAuth();
  const toast = useToast();
  const router = useRouter();
  const set = (k: string, v: string) => setForm((p) => ({ ...p, [k]: v }));

  const handleSubmit = (e?: React.FormEvent) => {
    e?.preventDefault();
    if (authMode === "login" && !form.email.trim() && !form.password.trim()) {
      signIn("chris@reinnovationhomes.com", "Chris Leonard");
      toast.success("Welcome back!");
      return;
    }
    if (!form.email.trim() || !form.password.trim()) {
      toast.error("Email and password are required");
      return;
    }
    if (authMode === "signup" && !form.name.trim()) {
      toast.error("Please enter your name");
      return;
    }
    setSubmitting(true);
    setTimeout(() => {
      signIn(form.email, authMode === "signup" ? form.name : undefined);
      toast.success(authMode === "signup" ? "Welcome to FlipCRM!" : "Welcome back!");
      setSubmitting(false);
    }, 400);
  };

  const handleGoogle = () => {
    signIn("demo@flipcrm.io", "Demo User");
    toast.success("Signed in as Demo User");
  };

  const openAuth = (mode: "login" | "signup") => {
    setAuthMode(mode);
    setShowAuth(true);
  };

  const statusColors: Record<string, string> = {
    completed: "text-emerald-600 bg-emerald-50",
    in_progress: "text-blue-600 bg-blue-50",
    scheduled: "text-amber-600 bg-amber-50",
    blocked: "text-red-600 bg-red-50",
  };

  return (
    <div className="min-h-screen w-full overflow-x-hidden">
      {/* Nav */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-xl border-b border-slate-200/60">
        <div className="max-w-7xl mx-auto flex items-center justify-between px-6 h-16">
          <div className="flex items-center gap-3">
            <img src="/ProjectManagerLogo.svg" alt="FlipCRM" width={40} height={40} className="rounded-lg" />
            <div>
              <p className="font-bold text-slate-900 text-sm leading-tight">Reinnovation</p>
              <p className="text-[10px] text-slate-400 leading-tight">Project Manager</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button onClick={() => openAuth("login")}
              className="px-4 py-2 text-sm font-medium text-slate-700 hover:text-slate-900 transition">
              Log In
            </button>
            <button onClick={() => openAuth("signup")}
              className="px-5 py-2 text-sm font-semibold text-white bg-gradient-to-r from-blue-600 to-violet-600 rounded-lg hover:shadow-lg hover:shadow-blue-500/25 hover:-translate-y-0.5 transition-all duration-200">
              Sign Up Free
            </button>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="pt-32 pb-20 px-6 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-violet-50/40 to-white -z-10" />
        <div className="absolute top-20 right-0 w-96 h-96 bg-blue-400/10 rounded-full blur-3xl -z-10" />
        <div className="absolute bottom-0 left-0 w-72 h-72 bg-violet-400/10 rounded-full blur-3xl -z-10" />

        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-16 items-center">
          <div className="fade-in">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-100 text-blue-700 text-xs font-semibold mb-6">
              <Zap size={12} /> Built for Fix & Flip Investors
            </div>
            <h1 className="text-5xl lg:text-6xl font-extrabold text-slate-900 leading-[1.1] tracking-tight">
              Manage Every Flip.
              <br />
              <span className="bg-gradient-to-r from-blue-600 via-violet-600 to-purple-600 bg-clip-text text-transparent">
                Maximize Every Dollar.
              </span>
            </h1>
            <p className="text-lg text-slate-600 mt-6 max-w-lg leading-relaxed">
              The all-in-one CRM for real estate investors. Track projects, manage contractors,
              monitor budgets, and close deals faster — from acquisition to sale.
            </p>
            <div className="flex items-center gap-4 mt-8">
              <button onClick={() => openAuth("signup")}
                className="px-8 py-3.5 text-sm font-semibold text-white bg-gradient-to-r from-blue-600 to-violet-600 rounded-xl hover:shadow-xl hover:shadow-blue-500/25 hover:-translate-y-0.5 transition-all duration-200 flex items-center gap-2">
                Get Started Free <ArrowRight size={16} />
              </button>
              <button onClick={() => { handleGoogle(); }}
                className="px-6 py-3.5 text-sm font-medium text-slate-700 bg-white border border-slate-200 rounded-xl hover:border-blue-300 hover:shadow-md transition-all duration-200">
                Try Demo
              </button>
            </div>
          </div>

          {/* Live Demo Preview */}
          <div className="relative fade-in" style={{ animationDelay: "0.15s" }}>
            <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl shadow-slate-200/50 overflow-hidden">
              <div className="bg-gradient-to-r from-slate-900 to-slate-800 px-5 py-3 flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-red-400" />
                <span className="w-3 h-3 rounded-full bg-amber-400" />
                <span className="w-3 h-3 rounded-full bg-emerald-400" />
                <span className="text-xs text-slate-400 ml-3 font-mono">flipcrm.app — Dashboard</span>
              </div>
              <div className="p-5 space-y-4">
                <div className="flex items-center gap-3 mb-1">
                  <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center shadow-md shadow-blue-500/20">
                    <FolderKanban size={16} className="text-white" />
                  </div>
                  <div>
                    <p className="text-xs text-slate-400 uppercase tracking-wider font-medium">Active Projects</p>
                    <p className="text-xl font-bold text-slate-900">4</p>
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-2">
                  <div className="bg-emerald-50 rounded-lg p-2.5 text-center">
                    <p className="text-lg font-bold text-emerald-700">$1.2M</p>
                    <p className="text-[10px] text-emerald-600">Portfolio ARV</p>
                  </div>
                  <div className="bg-violet-50 rounded-lg p-2.5 text-center">
                    <p className="text-lg font-bold text-violet-700">$340K</p>
                    <p className="text-[10px] text-violet-600">Total Spent</p>
                  </div>
                  <div className="bg-red-50 rounded-lg p-2.5 text-center">
                    <p className="text-lg font-bold text-red-700">3</p>
                    <p className="text-[10px] text-red-600">Hot Tasks</p>
                  </div>
                </div>
                <div className="border-t border-slate-100 pt-3">
                  <p className="text-xs font-semibold text-slate-700 mb-2 flex items-center gap-1.5">
                    <ListChecks size={12} className="text-blue-600" /> This Week
                  </p>
                  <div className="space-y-1.5">
                    {demoTasks.map((t, i) => (
                      <div key={i} className="flex items-center gap-2 py-1">
                        {t.status === "completed" ? (
                          <CheckCircle2 size={14} className="text-emerald-500" />
                        ) : (
                          <div className="w-3.5 h-3.5 rounded border border-slate-300" />
                        )}
                        <span className={`text-xs flex-1 ${t.status === "completed" ? "text-slate-400 line-through" : "text-slate-700"}`}>{t.title}</span>
                        <span className={`text-[9px] font-medium px-1.5 py-0.5 rounded-full ${statusColors[t.status]}`}>
                          {t.status.replace("_", " ")}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
            <div className="absolute -bottom-4 -right-4 w-32 h-32 bg-gradient-to-br from-violet-400/20 to-blue-400/20 rounded-full blur-2xl -z-10" />
          </div>
        </div>
      </section>

      {/* Stats Bar */}
      <section className="bg-gradient-to-r from-slate-900 to-slate-800 py-10 px-6">
        <div className="max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((s) => (
            <div key={s.label} className="text-center">
              <p className="text-3xl font-bold text-white">{s.value}</p>
              <p className="text-sm text-slate-400 mt-1">{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-24 px-6 bg-white" id="features">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-slate-900">Everything You Need to Flip Smarter</h2>
            <p className="text-lg text-slate-500 mt-3 max-w-2xl mx-auto">
              From project tracking to contractor management — FlipCRM puts your entire operation in one powerful dashboard.
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((f) => (
              <div key={f.title}
                className="group p-6 rounded-2xl border border-slate-200 hover:border-blue-200 bg-white hover:bg-gradient-to-br hover:from-white hover:to-blue-50/30 transition-all duration-300 hover:shadow-xl hover:shadow-blue-100/50 hover:-translate-y-1">
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${f.gradient} flex items-center justify-center shadow-lg ${f.shadow} mb-4`}>
                  <f.icon size={22} className="text-white" />
                </div>
                <h3 className="text-lg font-semibold text-slate-900 mb-2">{f.title}</h3>
                <p className="text-sm text-slate-500 leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* App Preview Section */}
      <section className="py-24 px-6 bg-gradient-to-br from-slate-50 to-blue-50/30">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-16 items-center">
          <div>
            <h2 className="text-4xl font-bold text-slate-900 mb-6">See Your Entire Portfolio at a Glance</h2>
            <p className="text-slate-600 mb-8 leading-relaxed">
              FlipCRM's dashboard gives you instant visibility into every project, every dollar, and every deadline.
              No more spreadsheets — just clear, actionable data.
            </p>
            <div className="space-y-4">
              {[
                { icon: CheckCircle2, text: "Real-time budget vs. actual spending charts" },
                { icon: CheckCircle2, text: "Automatic task prioritization — critical items surface first" },
                { icon: CheckCircle2, text: "One-click contractor assignment per project" },
                { icon: CheckCircle2, text: "Photo documentation with inline previews" },
                { icon: CheckCircle2, text: "Command palette (⌘K) for instant navigation" },
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-3">
                  <item.icon size={18} className="text-emerald-500 flex-shrink-0" />
                  <span className="text-sm text-slate-700">{item.text}</span>
                </div>
              ))}
            </div>
            <button onClick={() => openAuth("signup")}
              className="mt-8 px-7 py-3 text-sm font-semibold text-white bg-gradient-to-r from-blue-600 to-violet-600 rounded-xl hover:shadow-lg hover:shadow-blue-500/25 hover:-translate-y-0.5 transition-all duration-200 flex items-center gap-2">
              Start Managing Smarter <ArrowRight size={16} />
            </button>
          </div>

          {/* Contractor Demo Card */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-xl shadow-slate-200/30 overflow-hidden">
            <div className="bg-gradient-to-r from-slate-900 to-slate-800 px-5 py-3 flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-red-400" />
              <span className="w-3 h-3 rounded-full bg-amber-400" />
              <span className="w-3 h-3 rounded-full bg-emerald-400" />
              <span className="text-xs text-slate-400 ml-3 font-mono">flipcrm.app — Contractors</span>
            </div>
            <div className="p-5 space-y-3">
              {[
                { name: "Mike's Plumbing", specialty: "Plumbing", rating: 4.8, jobs: 12 },
                { name: "Elite Electric Co.", specialty: "Electrical", rating: 4.9, jobs: 8 },
                { name: "Ace Roofing LLC", specialty: "Roofing", rating: 4.7, jobs: 15 },
                { name: "Premier Painting", specialty: "Painting", rating: 4.6, jobs: 22 },
              ].map((c, i) => (
                <div key={i} className="flex items-center gap-3 p-3 rounded-xl border border-slate-100 hover:border-blue-200 hover:bg-blue-50/20 transition">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center text-white text-xs font-bold shadow-md shadow-amber-500/20">
                    {c.name.split(" ").map(w => w[0]).join("").slice(0, 2)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-slate-800">{c.name}</p>
                    <p className="text-xs text-slate-400">{c.specialty} · {c.jobs} jobs</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-semibold text-amber-600">{c.rating}</p>
                    <p className="text-[10px] text-slate-400">rating</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Testimonial / Trust */}
      <section className="py-20 px-6 bg-white">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-50 text-emerald-700 text-sm font-medium mb-6">
            <Shield size={16} /> Trusted by Real Estate Professionals
          </div>
          <blockquote className="text-2xl font-semibold text-slate-800 leading-relaxed">
            &ldquo;FlipCRM replaced our spreadsheets, our contractor texts, and our sticky notes —
            all in one app. We saved 15 hours a week and caught budget overruns we would have missed.&rdquo;
          </blockquote>
          <div className="flex items-center justify-center gap-3 mt-6">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-violet-600 flex items-center justify-center text-white text-xs font-bold">RH</div>
            <div className="text-left">
              <p className="text-sm font-semibold text-slate-900">Reinnovation Homes</p>
              <p className="text-xs text-slate-500">Fix & Flip Investors</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 px-6 bg-gradient-to-br from-slate-900 via-blue-900 to-violet-900 relative overflow-hidden">
        <div className="absolute inset-0 opacity-30">
          <div className="absolute top-0 left-1/4 w-72 h-72 bg-blue-500/20 rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-violet-500/20 rounded-full blur-3xl" />
        </div>
        <div className="max-w-3xl mx-auto text-center relative z-10">
          <h2 className="text-4xl font-bold text-white mb-4">Ready to Flip Smarter?</h2>
          <p className="text-lg text-blue-200 mb-8 max-w-xl mx-auto">
            Join hundreds of investors who manage their entire fix-and-flip operation with FlipCRM. Free to start, powerful from day one.
          </p>
          <button onClick={() => openAuth("signup")}
            className="px-10 py-4 text-base font-semibold text-slate-900 bg-white rounded-xl hover:shadow-2xl hover:shadow-white/20 hover:-translate-y-0.5 transition-all duration-200 inline-flex items-center gap-2">
            Create Your Free Account <ArrowRight size={18} />
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-950 text-slate-400 py-12 px-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <img src="/ProjectManagerLogo.svg" alt="FlipCRM" width={32} height={32} className="rounded-lg opacity-80" />
            <span className="text-sm font-medium text-slate-300">Reinnovation Project Manager</span>
          </div>
          <div className="flex items-center gap-6 text-sm">
            <a href="mailto:info@reinnovationhomes.com" className="hover:text-white transition flex items-center gap-1.5">
              <Mail size={14} /> Contact
            </a>
            <a href="https://www.instagram.com/reinnovationhomes/" target="_blank" rel="noopener noreferrer" className="hover:text-white transition">
              Instagram
            </a>
            <a href="https://reinnovationhomes.com" target="_blank" rel="noopener noreferrer" className="hover:text-white transition flex items-center gap-1.5">
              <Globe size={14} /> Website
            </a>
          </div>
          <p className="text-xs text-slate-600">&copy; 2026 Reinnovation Homes. All rights reserved.</p>
        </div>
      </footer>

      {/* Auth Modal */}
      {showAuth && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm fade-in" onClick={() => setShowAuth(false)}>
          <div className="w-full max-w-md mx-4 bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden scale-in" onClick={(e) => e.stopPropagation()}>
            <div className="p-6">
              <div className="text-center mb-5">
                <img src="/ProjectManagerLogo.svg" alt="FlipCRM" width={48} height={48} className="rounded-xl mx-auto mb-3" />
                <h2 className="text-xl font-bold text-slate-900">
                  {authMode === "signup" ? "Create Your Account" : "Welcome Back"}
                </h2>
                <p className="text-sm text-slate-500 mt-1">
                  {authMode === "signup" ? "Start managing your flips today" : "Log in to your dashboard"}
                </p>
              </div>

              <div className="flex mb-5 bg-slate-100 rounded-lg p-1">
                <button onClick={() => setAuthMode("signup")}
                  className={`flex-1 py-2 text-sm font-medium rounded-md transition ${authMode === "signup" ? "bg-white shadow text-slate-900" : "text-slate-500"}`}>
                  Sign Up
                </button>
                <button onClick={() => setAuthMode("login")}
                  className={`flex-1 py-2 text-sm font-medium rounded-md transition ${authMode === "login" ? "bg-white shadow text-slate-900" : "text-slate-500"}`}>
                  Log In
                </button>
              </div>

              <button onClick={handleGoogle}
                className="w-full flex items-center justify-center gap-3 px-4 py-2.5 border border-slate-300 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-50 transition mb-4">
                <svg width="18" height="18" viewBox="0 0 24 24">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/>
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                </svg>
                Continue with Google
              </button>

              <div className="relative my-4">
                <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-slate-200" /></div>
                <div className="relative flex justify-center text-xs"><span className="bg-white px-3 text-slate-400">or continue with email</span></div>
              </div>

              <form onSubmit={handleSubmit} noValidate className="space-y-3">
                {authMode === "signup" && (
                  <div className="relative">
                    <User size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input type="text" placeholder="Full Name" value={form.name} onChange={(e) => set("name", e.target.value)}
                      className="w-full pl-10 pr-4 py-2.5 border border-slate-300 rounded-lg text-sm" />
                  </div>
                )}
                <div className="relative">
                  <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input type="email" placeholder="Email Address" value={form.email} onChange={(e) => set("email", e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 border border-slate-300 rounded-lg text-sm" />
                </div>
                <div className="relative">
                  <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input type={showPassword ? "text" : "password"} placeholder="Password" value={form.password} onChange={(e) => set("password", e.target.value)}
                    className="w-full pl-10 pr-10 py-2.5 border border-slate-300 rounded-lg text-sm" />
                  <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
                <button type="submit" disabled={submitting}
                  className="w-full mt-2 py-2.5 bg-gradient-to-r from-blue-600 to-violet-600 text-white rounded-lg text-sm font-semibold hover:shadow-lg hover:shadow-blue-500/25 transition-all duration-200 disabled:opacity-60 flex items-center justify-center gap-2">
                  {submitting ? "Please wait..." : (
                    <>{authMode === "signup" ? "Create Account" : "Log In"} <ArrowRight size={14} /></>
                  )}
                </button>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
