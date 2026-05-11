"use client";

export const runtime = "edge";
export const dynamic = "force-dynamic";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import {
  ArrowRight, Check, CheckCircle2, ChevronRight, ClipboardList, DollarSign,
  FileText, FolderKanban, HardHat, LineChart, MapPin, MessageSquare,
  Shield, Sparkles, TrendingUp, Users, Wallet, Zap, AlertTriangle,
} from "lucide-react";

export default function LandingPage() {
  return (
    <div className="min-h-screen w-full bg-white text-slate-900 overflow-x-hidden">
      <NavBar />
      <Hero />
      <SocialProof />
      <FeatureGrid />
      <LiveDashboardDemo />
      <ProjectsDemo />
      <TasksDemo />
      <InvoicesDemo />
      <PortfolioDemo />
      <PricingTeaser />
      <FinalCta />
      <Footer />
    </div>
  );
}

function NavBar() {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  return (
    <header className={`fixed top-0 inset-x-0 z-50 transition-all ${scrolled ? "bg-white/85 backdrop-blur border-b border-slate-200/70 shadow-sm" : "bg-transparent"}`}>
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        <Link href="/landingpage" className="flex items-center gap-2.5">
          <Image src="/WorkTopLogo.svg" alt="WorkTop CRM" width={36} height={36} priority className="rounded-lg" />
          <div className="leading-tight">
            <p className="text-base font-bold">
              Work<span className="text-blue-500">Top</span>
              <span className="ml-1.5 text-slate-400 text-xs font-medium tracking-[0.18em]">CRM</span>
            </p>
          </div>
        </Link>
        <nav className="hidden md:flex items-center gap-7 text-sm text-slate-600">
          <a href="#features" className="hover:text-slate-900 transition">Features</a>
          <a href="#dashboard" className="hover:text-slate-900 transition">Live Demo</a>
          <a href="#pricing" className="hover:text-slate-900 transition">Pricing</a>
          <Link href="/contact" className="hover:text-slate-900 transition">Contact</Link>
        </nav>
        <div className="flex items-center gap-2">
          <Link href="/signup" className="hidden sm:inline-block text-sm text-slate-600 hover:text-slate-900 px-3 py-1.5 rounded-md transition">
            Log in
          </Link>
          <Link href="/signup" className="inline-flex items-center gap-1 text-sm font-medium bg-slate-900 hover:bg-blue-600 text-white px-4 py-2 rounded-lg shadow-sm transition-colors">
            Sign up <ArrowRight size={14} />
          </Link>
        </div>
      </div>
    </header>
  );
}

function Hero() {
  return (
    <section className="relative pt-32 pb-20 px-6 overflow-hidden">
      <div className="absolute -top-20 -right-20 w-[500px] h-[500px] rounded-full bg-blue-200/40 blur-3xl pointer-events-none"></div>
      <div className="absolute top-40 -left-20 w-[400px] h-[400px] rounded-full bg-emerald-200/40 blur-3xl pointer-events-none"></div>

      <div className="max-w-6xl mx-auto relative">
        <div className="text-center max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-slate-200 bg-white/70 backdrop-blur text-xs font-medium text-slate-600 mb-6 shadow-sm">
            <Sparkles size={12} className="text-blue-500" />
            Now live — built for builders, flippers & operators
          </div>
          <h1 className="text-5xl sm:text-6xl font-bold tracking-tight leading-[1.05] text-slate-900">
            Run every project from{" "}
            <span className="bg-gradient-to-r from-blue-600 via-blue-500 to-emerald-500 bg-clip-text text-transparent">
              one command center.
            </span>
          </h1>
          <p className="mt-6 text-lg text-slate-600 leading-relaxed">
            WorkTop CRM gives you projects, contractors, tasks, invoices, and a passive-income
            portfolio in one fast, beautiful workspace. Built to keep your jobs on time and on budget.
          </p>
          <div className="mt-8 flex items-center justify-center gap-3 flex-wrap">
            <Link href="/signup" className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-medium px-6 py-3 rounded-xl shadow-lg shadow-blue-500/20 transition-colors">
              Start free <ArrowRight size={16} />
            </Link>
            <a href="#dashboard" className="inline-flex items-center gap-2 bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 font-medium px-6 py-3 rounded-xl shadow-sm transition-colors">
              See it in action
            </a>
          </div>
          <p className="mt-4 text-xs text-slate-400">No credit card needed &middot; cancel anytime</p>
        </div>

        <div className="mt-16 relative">
          <HeroPreview />
        </div>
      </div>
    </section>
  );
}

function HeroPreview() {
  return (
    <div className="relative rounded-2xl border border-slate-200 bg-white shadow-2xl shadow-slate-900/10 overflow-hidden">
      <div className="bg-slate-50 border-b border-slate-200 px-4 py-2.5 flex items-center gap-2">
        <span className="w-2.5 h-2.5 rounded-full bg-red-400"></span>
        <span className="w-2.5 h-2.5 rounded-full bg-amber-400"></span>
        <span className="w-2.5 h-2.5 rounded-full bg-emerald-400"></span>
        <span className="ml-3 text-xs text-slate-400 font-mono">app.worktopcrm.com / dashboard</span>
      </div>
      <div className="grid grid-cols-12 min-h-[420px]">
        <div className="col-span-3 bg-slate-900 text-slate-300 p-4 text-xs space-y-1.5 hidden md:block">
          <div className="flex items-center gap-2 px-2 py-2 rounded-md bg-blue-600/20 text-blue-300">
            <FolderKanban size={14} /> Dashboard
          </div>
          {["Projects", "Portfolio", "Contractors", "Invoices", "Hot Tasks"].map((l) => (
            <div key={l} className="flex items-center gap-2 px-2 py-2 rounded-md text-slate-400">
              <span className="w-3.5 h-3.5 rounded-sm bg-slate-700"></span>{l}
            </div>
          ))}
        </div>
        <div className="col-span-12 md:col-span-9 p-6 space-y-5">
          <div className="flex items-end justify-between">
            <div>
              <p className="text-lg font-bold text-slate-900">Dashboard</p>
              <p className="text-xs text-slate-500">3 critical items &middot; 2 unread messages</p>
            </div>
            <p className="text-[10px] uppercase tracking-wider text-slate-400 font-medium">Monday, May 11</p>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
            <MiniStat icon={<FolderKanban size={16} />} label="Active" value="11" sub="of 14" color="blue" />
            <MiniStat icon={<TrendingUp size={16} />} label="ARV" value="$4.2M" sub="portfolio" color="emerald" />
            <MiniStat icon={<DollarSign size={16} />} label="Spent" value="$1.8M" sub="of $2.6M" color="violet" />
            <MiniStat icon={<AlertTriangle size={16} />} label="Hot Tasks" value="3" sub="critical" color="red" />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <DemoProjectChip name="2402 Magnolia Dr" loc="Austin, TX" tasks="8/12" status="green" />
            <DemoProjectChip name="118 Pine Ridge Ln" loc="Nashville, TN" tasks="5/9" status="amber" />
            <DemoProjectChip name="55 Birchwood Ave" loc="Charlotte, NC" tasks="11/11" status="green" />
            <DemoProjectChip name="908 Sunset Blvd" loc="Phoenix, AZ" tasks="2/14" status="red" />
          </div>
        </div>
      </div>
    </div>
  );
}

function MiniStat({ icon, label, value, sub, color }: { icon: React.ReactNode; label: string; value: string; sub: string; color: string }) {
  const colors: Record<string, string> = {
    blue: "bg-blue-50 text-blue-600",
    emerald: "bg-emerald-50 text-emerald-600",
    violet: "bg-violet-50 text-violet-600",
    red: "bg-red-50 text-red-600",
  };
  return (
    <div className="rounded-xl border border-slate-200 p-3 bg-white">
      <div className="flex items-center gap-2">
        <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${colors[color]}`}>{icon}</div>
        <div>
          <p className="text-[10px] text-slate-500">{label}</p>
          <p className="text-base font-bold text-slate-900 leading-tight">{value}</p>
        </div>
      </div>
      <p className="text-[10px] text-slate-400 mt-1">{sub}</p>
    </div>
  );
}

function DemoProjectChip({ name, loc, tasks, status }: { name: string; loc: string; tasks: string; status: "green" | "amber" | "red" }) {
  const dot = status === "green" ? "bg-emerald-500" : status === "amber" ? "bg-amber-500" : "bg-red-500";
  return (
    <div className="flex items-center gap-3 px-3 py-2.5 rounded-xl border border-slate-200 hover:border-blue-300 hover:shadow-sm transition">
      <span className={`w-3 h-3 rounded-full ${dot}`}></span>
      <div className="flex-1 min-w-0">
        <p className="text-xs font-medium text-slate-900 truncate">{name}</p>
        <p className="text-[10px] text-slate-400 truncate">{loc} &middot; {tasks} tasks</p>
      </div>
    </div>
  );
}

function SocialProof() {
  const stats = [
    { v: "$84M+", l: "Project value tracked" },
    { v: "12k+", l: "Tasks completed" },
    { v: "4.9★", l: "Operator rating" },
    { v: "99.9%", l: "Uptime" },
  ];
  return (
    <section className="border-y border-slate-100 bg-slate-50/60 py-10 px-6">
      <div className="max-w-5xl mx-auto grid grid-cols-2 sm:grid-cols-4 gap-6 text-center">
        {stats.map((s) => (
          <div key={s.l}>
            <p className="text-2xl font-bold text-slate-900">{s.v}</p>
            <p className="text-xs text-slate-500 mt-0.5">{s.l}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

function FeatureGrid() {
  const features = [
    { icon: FolderKanban, t: "Project Pipeline", d: "Track every flip and build with budgets, ARV, photos, and timelines.", c: "blue" },
    { icon: ClipboardList, t: "Tasks & Work Orders", d: "Schedule trades, confirm orders, and never lose a critical item.", c: "violet" },
    { icon: HardHat, t: "Contractor CRM", d: "Rate, message, and dispatch your team — directly in app.", c: "amber" },
    { icon: FileText, t: "Invoices & Expenses", d: "Generate clean invoices and track every dollar against budget.", c: "emerald" },
    { icon: MessageSquare, t: "Comms Hub", d: "All messages, calls, and SMS in one inbox — Twilio-ready.", c: "rose" },
    { icon: Wallet, t: "Passive Income Portfolio", d: "Rentals and notes tracked next to your active projects.", c: "indigo" },
  ];
  const colors: Record<string, string> = {
    blue: "bg-blue-50 text-blue-600",
    violet: "bg-violet-50 text-violet-600",
    amber: "bg-amber-50 text-amber-600",
    emerald: "bg-emerald-50 text-emerald-600",
    rose: "bg-rose-50 text-rose-600",
    indigo: "bg-indigo-50 text-indigo-600",
  };
  return (
    <section id="features" className="py-24 px-6">
      <div className="max-w-6xl mx-auto">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <p className="text-xs font-semibold text-blue-600 uppercase tracking-wider mb-2">Everything you need</p>
          <h2 className="text-4xl font-bold text-slate-900 leading-tight">Built end-to-end for real-world ops.</h2>
          <p className="mt-3 text-slate-600">No more spreadsheets, group texts, or sticky notes. One workspace for the whole crew.</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {features.map((f) => (
            <div key={f.t} className="group p-6 rounded-2xl border border-slate-200 hover:border-blue-300 hover:shadow-lg hover:shadow-blue-500/5 bg-white transition-all">
              <div className={`w-11 h-11 rounded-xl flex items-center justify-center ${colors[f.c]} mb-4 group-hover:scale-105 transition-transform`}>
                <f.icon size={20} />
              </div>
              <h3 className="text-lg font-semibold text-slate-900">{f.t}</h3>
              <p className="text-sm text-slate-600 mt-1.5 leading-relaxed">{f.d}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function LiveDashboardDemo() {
  return (
    <section id="dashboard" className="py-24 px-6 bg-gradient-to-b from-slate-50 to-white">
      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        <div>
          <p className="text-xs font-semibold text-blue-600 uppercase tracking-wider mb-2">Live mission control</p>
          <h2 className="text-4xl font-bold text-slate-900 leading-tight">Your dashboard, your numbers, in real time.</h2>
          <p className="mt-4 text-slate-600 leading-relaxed">
            Every project, budget, and hot task surfaced the moment you log in. Color-coded health pings tell you what
            needs you today — not yesterday.
          </p>
          <ul className="mt-6 space-y-2.5 text-sm text-slate-700">
            {["Over-budget alerts pulse in real time", "Weekly to-do per project", "Budget vs. spent charts", "Top-spend audit, last 30 days"].map((b) => (
              <li key={b} className="flex items-start gap-2">
                <Check size={16} className="text-emerald-500 mt-0.5 flex-shrink-0" /> {b}
              </li>
            ))}
          </ul>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white shadow-xl p-5 space-y-4">
          <div className="flex items-center justify-between">
            <p className="text-sm font-semibold text-slate-900">This Week</p>
            <span className="text-[10px] text-slate-400 uppercase tracking-wider">6 items</span>
          </div>
          {[
            { p: "2402 Magnolia Dr", t: "Confirm tile delivery for Wed" },
            { p: "118 Pine Ridge Ln", t: "Final walk-through scheduled" },
            { p: "908 Sunset Blvd", t: "Plumber arriving Friday 8am" },
          ].map((r) => (
            <div key={r.t} className="flex items-start gap-2.5 p-2 rounded-lg hover:bg-slate-50 transition">
              <input type="checkbox" className="mt-0.5 w-4 h-4 rounded border-slate-300 text-blue-600" readOnly />
              <div className="flex-1">
                <p className="text-xs font-semibold text-slate-500">{r.p}</p>
                <p className="text-sm text-slate-700">{r.t}</p>
              </div>
            </div>
          ))}
          <div className="border-t border-slate-100 pt-4">
            <div className="flex items-center gap-2 mb-2">
              <LineChart size={14} className="text-blue-600" />
              <p className="text-xs font-semibold text-slate-700">Budget vs. Spent</p>
            </div>
            {[
              { n: "2402 Magnolia", pct: 78 },
              { n: "118 Pine Ridge", pct: 54 },
              { n: "908 Sunset", pct: 112 },
            ].map((r) => (
              <div key={r.n} className="mb-2">
                <div className="flex items-center justify-between text-[11px] mb-1">
                  <span className="text-slate-600">{r.n}</span>
                  <span className={`font-medium ${r.pct > 100 ? "text-red-600" : "text-slate-700"}`}>{r.pct}%</span>
                </div>
                <div className="h-2 rounded-full bg-slate-100 overflow-hidden">
                  <div className={`h-full ${r.pct > 100 ? "bg-red-500" : "bg-blue-500"}`} style={{ width: `${Math.min(r.pct, 100)}%` }}></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function ProjectsDemo() {
  const rows = [
    { n: "2402 Magnolia Dr", loc: "Austin, TX", b: 380000, s: 296000, arv: 720000 },
    { n: "118 Pine Ridge Ln", loc: "Nashville, TN", b: 215000, s: 116000, arv: 410000 },
    { n: "908 Sunset Blvd", loc: "Phoenix, AZ", b: 295000, s: 331000, arv: 540000 },
  ];
  return (
    <section className="py-24 px-6">
      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        <div className="lg:order-2">
          <p className="text-xs font-semibold text-emerald-600 uppercase tracking-wider mb-2">Projects, end-to-end</p>
          <h2 className="text-4xl font-bold text-slate-900 leading-tight">Every flip in one tidy pipeline.</h2>
          <p className="mt-4 text-slate-600 leading-relaxed">
            Group by folder, filter by status, drill into a project to see tasks, expenses, contractors, photos, and 3D renders.
          </p>
          <Link href="/signup" className="inline-flex items-center gap-1 text-sm font-medium text-blue-600 hover:text-blue-700 mt-5">
            Try the demo workspace <ChevronRight size={14} />
          </Link>
        </div>
        <div className="lg:order-1 rounded-2xl border border-slate-200 bg-white shadow-xl overflow-hidden">
          <div className="px-5 py-3 border-b border-slate-200 flex items-center justify-between">
            <p className="text-sm font-semibold text-slate-900">Projects</p>
            <span className="text-[10px] text-slate-400">3 of 11</span>
          </div>
          <div className="divide-y divide-slate-100">
            {rows.map((r) => {
              const pct = Math.round((r.s / r.b) * 100);
              const over = pct > 100;
              return (
                <div key={r.n} className="px-5 py-4 hover:bg-slate-50 transition">
                  <div className="flex items-center justify-between mb-1.5">
                    <p className="text-sm font-semibold text-slate-900">{r.n}</p>
                    <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${over ? "bg-red-100 text-red-700" : "bg-emerald-100 text-emerald-700"}`}>
                      {over ? "Over" : "On track"}
                    </span>
                  </div>
                  <div className="flex items-center gap-3 text-xs text-slate-500 mb-2">
                    <span className="flex items-center gap-1"><MapPin size={11} />{r.loc}</span>
                    <span>ARV ${(r.arv / 1000).toFixed(0)}k</span>
                  </div>
                  <div className="h-1.5 rounded-full bg-slate-100 overflow-hidden">
                    <div className={`h-full ${over ? "bg-red-500" : "bg-blue-500"}`} style={{ width: `${Math.min(pct, 100)}%` }}></div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}

function TasksDemo() {
  return (
    <section className="py-24 px-6 bg-slate-50/60">
      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        <div>
          <p className="text-xs font-semibold text-violet-600 uppercase tracking-wider mb-2">Tasks & Work Orders</p>
          <h2 className="text-4xl font-bold text-slate-900 leading-tight">Stop losing items in group texts.</h2>
          <p className="mt-4 text-slate-600 leading-relaxed">
            Default renovation checklists are pre-loaded per project. Confirm orders, schedule trades, and route work
            orders to your contractors — without leaving the app.
          </p>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white shadow-xl p-5 space-y-2">
          {[
            { t: "Demo & dumpster delivery", s: "completed", c: "Carlos Demo Crew" },
            { t: "Rough plumbing", s: "in_progress", c: "Reyes Plumbing" },
            { t: "Kitchen cabinet order", s: "blocked", c: "Awaiting deposit" },
            { t: "Drywall mud + tape", s: "scheduled", c: "Tue, Jun 4" },
          ].map((t) => {
            const styles: Record<string, string> = {
              completed: "bg-emerald-100 text-emerald-700",
              in_progress: "bg-blue-100 text-blue-700",
              blocked: "bg-red-100 text-red-700",
              scheduled: "bg-amber-100 text-amber-700",
            };
            return (
              <div key={t.t} className="flex items-center gap-3 p-3 rounded-lg border border-slate-100 hover:border-blue-200 transition">
                {t.s === "completed" ? (
                  <CheckCircle2 size={18} className="text-emerald-500" />
                ) : (
                  <span className="w-[18px] h-[18px] rounded-full border-2 border-slate-300"></span>
                )}
                <div className="flex-1">
                  <p className="text-sm font-medium text-slate-900">{t.t}</p>
                  <p className="text-xs text-slate-500">{t.c}</p>
                </div>
                <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full uppercase tracking-wide ${styles[t.s]}`}>
                  {t.s.replace("_", " ")}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function InvoicesDemo() {
  return (
    <section className="py-24 px-6">
      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        <div className="lg:order-2">
          <p className="text-xs font-semibold text-amber-600 uppercase tracking-wider mb-2">Invoices & money</p>
          <h2 className="text-4xl font-bold text-slate-900 leading-tight">Send clean invoices in seconds.</h2>
          <p className="mt-4 text-slate-600 leading-relaxed">
            Pre-built invoice terms, auto-totals, line items, and a status tracker. Every dollar you spend or earn is one click away.
          </p>
          <div className="mt-5 flex items-center gap-3 flex-wrap">
            <Badge>PDF export</Badge><Badge>Line items</Badge><Badge>Status tracking</Badge><Badge>Reminders</Badge>
          </div>
        </div>
        <div className="lg:order-1 rounded-2xl border border-slate-200 bg-white shadow-xl overflow-hidden">
          <div className="bg-gradient-to-br from-blue-600 to-violet-600 text-white p-5">
            <div className="flex items-center justify-between">
              <p className="text-xs uppercase tracking-wider opacity-80">Invoice</p>
              <p className="text-xs font-mono opacity-80">#INV-0421</p>
            </div>
            <p className="text-2xl font-bold mt-2">$14,850.00</p>
            <p className="text-xs opacity-80 mt-1">Reyes Plumbing &middot; 2402 Magnolia Dr</p>
          </div>
          <div className="p-5 space-y-2 text-sm">
            {[
              ["Rough-in plumbing (3 bath)", "$8,400"],
              ["Water heater + install", "$2,950"],
              ["Trim & fixtures labor", "$3,500"],
            ].map(([l, v]) => (
              <div key={l} className="flex justify-between text-slate-700">
                <span>{l}</span>
                <span className="font-mono">{v}</span>
              </div>
            ))}
            <div className="border-t border-slate-100 pt-2 flex justify-between font-semibold text-slate-900">
              <span>Total due</span><span className="font-mono">$14,850.00</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function Badge({ children }: { children: React.ReactNode }) {
  return <span className="text-xs font-medium px-2.5 py-1 rounded-full bg-slate-100 text-slate-700 border border-slate-200">{children}</span>;
}

function PortfolioDemo() {
  return (
    <section className="py-24 px-6 bg-slate-50/60">
      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        <div>
          <p className="text-xs font-semibold text-indigo-600 uppercase tracking-wider mb-2">Passive income, tracked</p>
          <h2 className="text-4xl font-bold text-slate-900 leading-tight">Rentals and notes, side by side.</h2>
          <p className="mt-4 text-slate-600 leading-relaxed">
            Track every dollar of monthly income across your rentals and private notes — without leaving WorkTop.
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {[
            { t: "Rentals", v: "$18,400/mo", s: "12 units", c: "from-blue-500 to-blue-600" },
            { t: "Notes", v: "$6,200/mo", s: "5 active", c: "from-emerald-500 to-emerald-600" },
            { t: "Annual yield", v: "9.4%", s: "blended", c: "from-violet-500 to-violet-600" },
            { t: "Occupancy", v: "97%", s: "T-12", c: "from-amber-500 to-amber-600" },
          ].map((s) => (
            <div key={s.t} className="rounded-2xl border border-slate-200 bg-white p-5 hover:shadow-lg transition-shadow">
              <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${s.c} mb-3`}></div>
              <p className="text-xs text-slate-500">{s.t}</p>
              <p className="text-2xl font-bold text-slate-900 leading-tight">{s.v}</p>
              <p className="text-xs text-slate-400 mt-0.5">{s.s}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function PricingTeaser() {
  const tiers = [
    { n: "Solo", p: "Free", d: "For one builder", f: ["1 user", "Up to 3 projects", "Core CRM"], cta: "Start free", hl: false },
    { n: "Team", p: "$29", d: "/user / month", f: ["Unlimited projects", "Contractors & invoices", "Twilio messaging", "Priority support"], cta: "Start 14-day trial", hl: true },
    { n: "Operator", p: "Custom", d: "For multi-entity", f: ["Multi-org", "Advanced reporting", "API access", "Dedicated CSM"], cta: "Contact us", hl: false },
  ];
  return (
    <section id="pricing" className="py-24 px-6">
      <div className="max-w-6xl mx-auto">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <p className="text-xs font-semibold text-blue-600 uppercase tracking-wider mb-2">Simple pricing</p>
          <h2 className="text-4xl font-bold text-slate-900 leading-tight">Pay for the team you have today.</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {tiers.map((t) => (
            <div key={t.n} className={`rounded-2xl p-7 border bg-white transition-all ${t.hl ? "border-blue-500 shadow-xl shadow-blue-500/10 -translate-y-1" : "border-slate-200 hover:shadow-lg"}`}>
              {t.hl && <p className="text-[10px] font-bold uppercase tracking-wider text-blue-600 mb-2">Most popular</p>}
              <h3 className="text-xl font-bold text-slate-900">{t.n}</h3>
              <p className="text-3xl font-bold text-slate-900 mt-3">
                {t.p}<span className="text-sm font-normal text-slate-500"> {t.d}</span>
              </p>
              <ul className="mt-5 space-y-2.5 text-sm">
                {t.f.map((ft) => (
                  <li key={ft} className="flex items-start gap-2 text-slate-700">
                    <Check size={15} className="text-emerald-500 mt-0.5 flex-shrink-0" /> {ft}
                  </li>
                ))}
              </ul>
              <Link href={t.n === "Operator" ? "/contact" : "/signup"}
                className={`mt-6 inline-flex items-center justify-center w-full gap-1 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors ${t.hl ? "bg-blue-600 hover:bg-blue-700 text-white shadow" : "bg-slate-100 hover:bg-slate-200 text-slate-900"}`}>
                {t.cta} <ArrowRight size={14} />
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function FinalCta() {
  return (
    <section className="py-24 px-6">
      <div className="max-w-4xl mx-auto rounded-3xl bg-gradient-to-br from-blue-600 via-blue-700 to-violet-700 px-8 py-16 text-center text-white shadow-2xl shadow-blue-500/20">
        <Zap size={32} className="mx-auto mb-4 opacity-90" />
        <h2 className="text-4xl font-bold leading-tight">Get your jobs on time, on budget.</h2>
        <p className="mt-3 opacity-90 max-w-xl mx-auto">
          Join builders running their entire pipeline through WorkTop. Free to start. Setup in under 60 seconds.
        </p>
        <Link href="/signup" className="mt-7 inline-flex items-center gap-2 bg-white text-blue-700 font-semibold px-6 py-3 rounded-xl shadow-lg hover:bg-slate-50 transition-colors">
          Create your free account <ArrowRight size={16} />
        </Link>
        <div className="mt-6 flex items-center justify-center gap-5 text-xs opacity-80 flex-wrap">
          <span className="inline-flex items-center gap-1"><Shield size={12} /> SOC-2 ready infra</span>
          <span className="inline-flex items-center gap-1"><Users size={12} /> Team-friendly</span>
          <span className="inline-flex items-center gap-1"><Sparkles size={12} /> No card needed</span>
        </div>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="border-t border-slate-200 py-10 px-6 text-sm text-slate-500">
      <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <Image src="/WorkTopLogo.svg" alt="WorkTop CRM" width={28} height={28} className="rounded" />
          <span className="text-slate-700 font-semibold">WorkTop CRM</span>
          <span className="text-slate-400">&copy; {new Date().getFullYear()}</span>
        </div>
        <div className="flex items-center gap-5">
          <Link href="/contact" className="hover:text-slate-900 transition">Contact</Link>
          <Link href="/signup" className="hover:text-slate-900 transition">Sign in</Link>
          <a href="https://worktopcrm.com" className="hover:text-slate-900 transition">worktopcrm.com</a>
        </div>
      </div>
    </footer>
  );
}
