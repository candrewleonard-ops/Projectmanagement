"use client";

import Link from "next/link";
import {
  FolderKanban, TrendingUp, DollarSign, AlertTriangle,
  ArrowRight, MapPin, CheckCircle2, Clock, Ban,
} from "lucide-react";
import { useStore } from "@/lib/store";
import { formatCurrency, progressPercent, cn } from "@/lib/utils";
import { BudgetChart } from "@/components/BudgetChart";

export default function Dashboard() {
  const store = useStore();
  const activeProjects = store.getActiveProjects();
  const topExpenses = store.getTopExpenses(8);
  const totalPortfolioValue = store.projects.reduce((s, p) => s + p.estimatedARV, 0);
  const totalSpent = store.projects.reduce((s, p) => s + p.totalSpent, 0);
  const totalBudget = store.projects.reduce((s, p) => s + p.totalBudget, 0);
  const hotTasks = store.tasks.filter((t) => t.priority === "critical" && (t.status === "in_progress" || t.status === "blocked"));
  const unreadComms = store.communications.filter((c) => !c.read).length;
  const completedTasks = store.tasks.filter((t) => t.status === "completed").length;
  const scheduledTasks = store.tasks.filter((t) => t.status === "scheduled").length;

  return (
    <div className="space-y-6 fade-in">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Dashboard</h1>
        <p className="text-sm text-slate-500 mt-1">Welcome back, Chris. You have {hotTasks.length} critical items and {unreadComms} unread messages.</p>
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

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-4">
          <div className="stat-card">
            <h3 className="text-sm font-semibold text-slate-700 mb-3">Task Overview</h3>
            <div className="space-y-2.5">
              <TaskRow icon={<Ban size={14} />} label="Blocked" count={store.tasks.filter(t => t.status === "blocked").length} color="text-red-600 bg-red-50" />
              <TaskRow icon={<Clock size={14} />} label="In Progress" count={store.tasks.filter(t => t.status === "in_progress").length} color="text-sky-600 bg-sky-50" />
              <TaskRow icon={<Clock size={14} />} label="Scheduled" count={scheduledTasks} color="text-violet-600 bg-violet-50" />
              <TaskRow icon={<CheckCircle2 size={14} />} label="Completed" count={completedTasks} color="text-emerald-600 bg-emerald-50" />
            </div>
          </div>
          <div className="stat-card">
            <h3 className="text-sm font-semibold text-slate-700 mb-3">Project Library</h3>
            <div className="space-y-2">
              {store.folders.map((folder) => (
                <Link key={folder.id} href={`/projects?folder=${folder.id}`} className="flex items-center justify-between p-2.5 rounded-lg hover:bg-slate-50 transition group">
                  <div className="flex items-center gap-3">
                    <span className="w-3 h-3 rounded-full" style={{ background: folder.color }}></span>
                    <span className="text-sm font-medium text-slate-700">{folder.name}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-slate-400">{folder.projectIds.length}</span>
                    <ArrowRight size={14} className="text-slate-300 group-hover:text-blue-500 transition" />
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-4">
          {/* Right column placeholder for future widgets */}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="stat-card">
          <h2 className="text-lg font-semibold text-slate-900 mb-4">Budget vs. Spent by Project</h2>
          <BudgetChart projects={activeProjects} />
        </div>
        <div className="stat-card">
          <h2 className="text-lg font-semibold text-slate-900 mb-4">Highest Expense Items</h2>
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
        </div>
      </div>

      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-slate-900">Active Projects</h2>
          <Link href="/projects" className="text-sm text-blue-600 hover:text-blue-700 font-medium flex items-center gap-1">View All <ArrowRight size={14} /></Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
          {activeProjects.map((project) => {
            const pTasks = store.getProjectTasks(project.id);
            const completed = pTasks.filter((t) => t.status === "completed").length;
            const progress = progressPercent(project.totalSpent, project.totalBudget);
            const overBudget = project.totalSpent > project.totalBudget && project.totalBudget > 0;
            const hasHot = pTasks.some((t) => t.priority === "critical" && (t.status === "in_progress" || t.status === "blocked"));
            return (
              <Link key={project.id} href={`/projects/${project.id}`} className={cn("stat-card group cursor-pointer", overBudget && "ring-2 ring-red-300")}>
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <h3 className="font-semibold text-slate-900 group-hover:text-blue-600 transition">{project.name}</h3>
                    <p className="text-xs text-slate-400 flex items-center gap-1 mt-0.5"><MapPin size={11} /> {project.address.city}, {project.address.state}</p>
                  </div>
                  {(hasHot || overBudget) && <span className={cn("w-3 h-3 rounded-full heat-pulse", overBudget ? "bg-red-500" : "bg-red-500")}></span>}
                </div>
                <div className="mt-3">
                  <div className="flex justify-between text-xs text-slate-500 mb-1">
                    <span>Budget</span>
                    <span className={overBudget ? "text-red-600 font-semibold" : ""}>{overBudget ? `${progress}% OVER` : `${progress}%`}</span>
                  </div>
                  <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                    <div className={cn("h-full rounded-full", overBudget ? "bg-red-500" : progress > 70 ? "bg-amber-500" : "bg-blue-500")} style={{ width: `${Math.min(progress, 100)}%` }}></div>
                  </div>
                  {overBudget && (
                    <p className="text-xs text-red-600 font-medium mt-1">Over budget by {formatCurrency(project.totalSpent - project.totalBudget)}</p>
                  )}
                  <div className="flex justify-between mt-2 text-xs text-slate-500">
                    <span>{formatCurrency(project.totalSpent)} spent</span>
                    <span>{completed}/{pTasks.length} tasks</span>
                  </div>
                </div>
              </Link>
            );
          })}
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

function TaskRow({ icon, label, count, color }: { icon: React.ReactNode; label: string; count: number; color: string }) {
  return (
    <div className="flex items-center gap-3">
      <div className={cn("w-7 h-7 rounded-md flex items-center justify-center", color)}>{icon}</div>
      <span className="text-sm text-slate-700 flex-1">{label}</span>
      <span className="text-sm font-semibold text-slate-900">{count}</span>
    </div>
  );
}
