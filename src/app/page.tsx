"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import {
  FolderKanban, TrendingUp, DollarSign, AlertTriangle,
  ArrowRight, MapPin, ListChecks,
} from "lucide-react";
import { useStore } from "@/lib/store";
import { formatCurrency, cn } from "@/lib/utils";
import { BudgetChart } from "@/components/BudgetChart";
import { WeeklyTodo } from "@/lib/types";

export default function Dashboard() {
  const store = useStore();
  const activeProjects = store.getActiveProjects();
  const topExpenses = useMemo(() => {
    const thirtyDaysAgo = Date.now() - 30 * 24 * 60 * 60 * 1000;
    return [...store.expenses]
      .filter((e) => new Date(e.purchasedDate).getTime() >= thirtyDaysAgo)
      .sort((a, b) => b.total - a.total)
      .slice(0, 8);
  }, [store.expenses]);
  const totalPortfolioValue = store.projects.reduce((s, p) => s + p.estimatedARV, 0);
  const totalSpent = store.projects.reduce((s, p) => s + p.totalSpent, 0);
  const totalBudget = store.projects.reduce((s, p) => s + p.totalBudget, 0);
  const hotTasks = store.tasks.filter((t) => t.priority === "critical" && (t.status === "in_progress" || t.status === "blocked"));
  const unreadComms = store.communications.filter((c) => !c.read).length;
  const completedTasks = store.tasks.filter((t) => t.status === "completed").length;
  const scheduledTasks = store.tasks.filter((t) => t.status === "scheduled").length;

  const today = new Date();
  const dateLabel = today.toLocaleDateString(undefined, { weekday: "long", month: "long", day: "numeric" });

  return (
    <div className="space-y-6 fade-in">
      <div className="flex items-end justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Dashboard</h1>
          <p className="text-sm text-slate-500 mt-1">
            {hotTasks.length} critical item{hotTasks.length === 1 ? "" : "s"} &middot; {unreadComms} unread message{unreadComms === 1 ? "" : "s"}
          </p>
        </div>
        <p className="text-xs font-medium text-slate-400 tracking-wide uppercase">{dateLabel}</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard icon={<FolderKanban size={20} />} label="Active Projects" value={activeProjects.length.toString()} sub={`${store.projects.length} total`} color="blue" />
        <StatCard icon={<TrendingUp size={20} />} label="Portfolio ARV" value={formatCurrency(totalPortfolioValue)} sub="Estimated after repair" color="emerald" />
        <StatCard icon={<DollarSign size={20} />} label="Total Spent" value={formatCurrency(totalSpent)} sub={`of ${formatCurrency(totalBudget)} budget`} color="violet" />
        <StatCard icon={<AlertTriangle size={20} />} label="Hot Tasks Today" value={hotTasks.length.toString()} sub={`${completedTasks} completed, ${scheduledTasks} scheduled`} color="red" pulse={hotTasks.length > 0} />
      </div>

      {/* Active Project Bubbles */}
      <div className="stat-card">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-slate-900">Active Projects</h2>
          <Link href="/projects" className="text-sm text-blue-600 hover:text-blue-700 font-medium flex items-center gap-1">View All <ArrowRight size={14} /></Link>
        </div>
        <div className="flex flex-wrap gap-3">
          {activeProjects.map((project) => {
            const pTasks = store.getProjectTasks(project.id);
            const completed = pTasks.filter((t) => t.status === "completed").length;
            const overBudget = project.totalSpent > project.totalBudget && project.totalBudget > 0;
            const hasUnconfirmed = pTasks.some((t) => !t.orderConfirmed && t.status !== "completed");
            const hasBlocked = pTasks.some((t) => t.status === "blocked");
            const statusColor = overBudget ? "bg-red-500" : hasBlocked ? "bg-amber-500" : hasUnconfirmed ? "bg-amber-400" : "bg-emerald-500";
            const ringColor = overBudget ? "ring-red-200" : hasBlocked ? "ring-amber-200" : "ring-transparent";

            return (
              <Link key={project.id} href={`/projects/${project.id}`}
                className={cn("flex items-center gap-3 px-4 py-3 rounded-xl border border-slate-200 hover:border-blue-300 hover:shadow-md transition group", overBudget && "border-red-200 bg-red-50/50")}
              >
                <div className="relative">
                  <span className={cn("block w-4 h-4 rounded-full", statusColor)}></span>
                  {overBudget && <span className="absolute inset-0 rounded-full bg-red-400 opacity-40 animate-ping"></span>}
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-900 group-hover:text-blue-600 transition">{project.name}</p>
                  <p className="text-xs text-slate-400">{project.address.city}, {project.address.state} &middot; {completed}/{pTasks.length} tasks</p>
                </div>
                {overBudget && <span className="text-[10px] font-semibold text-red-600 bg-red-100 px-2 py-0.5 rounded-full ml-1">OVER BUDGET</span>}
              </Link>
            );
          })}
          {activeProjects.length === 0 && <p className="text-sm text-slate-400">No active projects.</p>}
        </div>
      </div>

      <ThisWeekDashboard />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="stat-card">
          <h2 className="text-lg font-semibold text-slate-900 mb-4">Budget vs. Spent by Project</h2>
          <BudgetChart projects={activeProjects} />
        </div>
        <div className="stat-card">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-slate-900">Highest Expense Items</h2>
            <span className="text-xs text-slate-400">Last 30 days</span>
          </div>
          {topExpenses.length === 0 ? (
            <p className="text-sm text-slate-400 py-3">No expenses in the last 30 days.</p>
          ) : (
            <div className="space-y-3">
              {topExpenses.map((exp, i) => {
                const proj = store.getProject(exp.projectId);
                return (
                  <div key={exp.id} className="flex items-center gap-3">
                    <span className="text-xs font-bold text-slate-300 w-5 text-right">{i + 1}</span>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-slate-800 truncate">{exp.description}</p>
                      <p className="text-xs text-slate-400">{proj?.name} &middot; {exp.category}</p>
                    </div>
                    <span className="text-sm font-semibold text-slate-900">{formatCurrency(exp.total)}</span>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function StatCard({ icon, label, value, sub, color, pulse }: {
  icon: React.ReactNode; label: string; value: string; sub: string; color: string; pulse?: boolean;
}) {
  const colors: Record<string, string> = { blue: "bg-blue-50 text-blue-600", emerald: "bg-emerald-50 text-emerald-600", violet: "bg-violet-50 text-violet-600", red: "bg-red-50 text-red-600" };
  return (
    <div className={cn("stat-card", pulse && "ring-2 ring-red-200")}>
      <div className="flex items-center gap-3">
        <div className={cn("w-10 h-10 rounded-lg flex items-center justify-center", colors[color])}>{icon}</div>
        <div>
          <p className="text-xs text-slate-500">{label}</p>
          <p className="text-xl font-bold text-slate-900">{value}</p>
        </div>
      </div>
      <p className="text-xs text-slate-400 mt-2">{sub}</p>
    </div>
  );
}

function ThisWeekDashboard() {
  const store = useStore();
  const activeProjects = store.getActiveProjects();
  const visibleTodos = store.getVisibleWeeklyTodos();
  const [confirming, setConfirming] = useState<WeeklyTodo | null>(null);

  // Group todos by project (only active projects)
  const activeProjectIds = new Set(activeProjects.map((p) => p.id));
  const grouped = new Map<string, WeeklyTodo[]>();
  for (const todo of visibleTodos) {
    if (!activeProjectIds.has(todo.projectId)) continue;
    const existing = grouped.get(todo.projectId) || [];
    existing.push(todo);
    grouped.set(todo.projectId, existing);
  }

  const handleCheck = () => {
    if (!confirming) return;
    store.updateWeeklyTodo(confirming.id, { hiddenFromDashboard: true });
    setConfirming(null);
  };

  return (
    <div className="stat-card">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-semibold text-slate-700 flex items-center gap-2">
          <ListChecks size={16} className="text-blue-600" /> This Week
        </h3>
        <span className="text-xs text-slate-400">{visibleTodos.length} item{visibleTodos.length === 1 ? "" : "s"}</span>
      </div>

      {grouped.size === 0 ? (
        <div className="py-6 text-center">
          <p className="text-sm text-slate-400">No items for this week.</p>
          <p className="text-xs text-slate-400 mt-1">Add items from each project&apos;s page.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {activeProjects.map((project) => {
            const todos = grouped.get(project.id);
            if (!todos || todos.length === 0) return null;
            return (
              <div key={project.id}>
                <Link href={`/projects/${project.id}`} className="flex items-center gap-2 mb-2 group">
                  <MapPin size={12} className="text-slate-400" />
                  <span className="text-xs font-semibold text-slate-600 group-hover:text-blue-600 transition">{project.name}</span>
                  <span className="text-xs text-slate-400">&middot; {project.address.city}, {project.address.state}</span>
                </Link>
                <div className="space-y-1.5">
                  {todos.map((todo) => (
                    <label key={todo.id} className="flex items-start gap-2.5 p-2 rounded-lg hover:bg-slate-50 transition cursor-pointer">
                      <input type="checkbox" checked={false}
                        onChange={() => setConfirming(todo)}
                        className="mt-0.5 w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500" />
                      <span className="text-sm text-slate-700 flex-1">{todo.text}</span>
                    </label>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {confirming && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50" onClick={() => setConfirming(null)}>
          <div className="bg-white rounded-2xl p-6 shadow-2xl max-w-md" onClick={(e) => e.stopPropagation()}>
            <h3 className="text-lg font-bold text-slate-900 mb-2">Are you sure?</h3>
            <p className="text-sm text-slate-600 mb-1">Mark this as done and remove from the dashboard?</p>
            <p className="text-sm text-slate-800 font-medium mb-4 p-3 bg-slate-50 rounded-lg">&ldquo;{confirming.text}&rdquo;</p>
            <p className="text-xs text-slate-500 mb-4">It will remain visible on the project&apos;s page.</p>
            <div className="flex gap-3 justify-end">
              <button onClick={() => setConfirming(null)} className="px-4 py-2 text-sm text-slate-600 hover:bg-slate-100 rounded-lg font-medium">No, keep it</button>
              <button onClick={handleCheck} className="px-4 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium">Yes, mark done</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
