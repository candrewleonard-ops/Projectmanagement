"use client";

import Link from "next/link";
import {
  FolderKanban, TrendingUp, DollarSign, AlertTriangle,
  ArrowRight, MapPin, CheckCircle2, Clock, Ban,
} from "lucide-react";
import {
  projects, folders, tasks, communications,
  getActiveProjects, getTopExpenses, heatmapPoints,
} from "@/lib/mock-data";
import { formatCurrency, progressPercent, cn } from "@/lib/utils";
import { USAHeatmap } from "@/components/USAHeatmap";
import { BudgetChart } from "@/components/BudgetChart";

export default function Dashboard() {
  const activeProjects = getActiveProjects();
  const topExpenses = getTopExpenses(8);
  const totalPortfolioValue = projects.reduce((s, p) => s + p.estimatedARV, 0);
  const totalSpent = projects.reduce((s, p) => s + p.totalSpent, 0);
  const totalBudget = projects.reduce((s, p) => s + p.totalBudget, 0);
  const hotTasks = tasks.filter(
    (t) => t.priority === "critical" && (t.status === "in_progress" || t.status === "blocked")
  );
  const unreadComms = communications.filter((c) => !c.read).length;
  const completedTasks = tasks.filter((t) => t.status === "completed").length;
  const scheduledTasks = tasks.filter((t) => t.status === "scheduled").length;

  return (
    <div className="space-y-6 fade-in">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Dashboard</h1>
        <p className="text-sm text-slate-500 mt-1">
          Welcome back, Chris. You have {hotTasks.length} critical items and {unreadComms} unread messages.
        </p>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard icon={<FolderKanban size={20} />} label="Active Projects" value={activeProjects.length.toString()} sub={`${projects.length} total`} color="blue" />
        <StatCard icon={<TrendingUp size={20} />} label="Portfolio ARV" value={formatCurrency(totalPortfolioValue)} sub="Estimated after repair" color="emerald" />
        <StatCard icon={<DollarSign size={20} />} label="Total Spent" value={formatCurrency(totalSpent)} sub={`of ${formatCurrency(totalBudget)} budget`} color="violet" />
        <StatCard icon={<AlertTriangle size={20} />} label="Hot Tasks Today" value={hotTasks.length.toString()} sub={`${completedTasks} completed, ${scheduledTasks} scheduled`} color="red" pulse={hotTasks.length > 0} />
      </div>

      {/* Heatmap + Sidebar */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 stat-card">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-slate-900">Property Heatmap</h2>
            <div className="flex items-center gap-4 text-xs">
              <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-full bg-red-500"></span> Critical / Blocked</span>
              <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-full bg-amber-400"></span> Unconfirmed Orders</span>
              <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-full bg-emerald-400"></span> On Track</span>
            </div>
          </div>
          <USAHeatmap points={heatmapPoints} />
        </div>

        <div className="space-y-4">
          <div className="stat-card">
            <h3 className="text-sm font-semibold text-slate-700 mb-3">Task Overview</h3>
            <div className="space-y-2.5">
              <TaskRow icon={<Ban size={14} />} label="Blocked" count={tasks.filter(t => t.status === "blocked").length} color="text-red-600 bg-red-50" />
              <TaskRow icon={<Clock size={14} />} label="In Progress" count={tasks.filter(t => t.status === "in_progress").length} color="text-sky-600 bg-sky-50" />
              <TaskRow icon={<Clock size={14} />} label="Scheduled" count={scheduledTasks} color="text-violet-600 bg-violet-50" />
              <TaskRow icon={<CheckCircle2 size={14} />} label="Completed" count={completedTasks} color="text-emerald-600 bg-emerald-50" />
            </div>
          </div>

          <div className="stat-card">
            <h3 className="text-sm font-semibold text-slate-700 mb-3">Project Library</h3>
            <div className="space-y-2">
              {folders.map((folder) => (
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
      </div>

      {/* Budget Chart + Top Expenses */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="stat-card">
          <h2 className="text-lg font-semibold text-slate-900 mb-4">Budget vs. Spent by Project</h2>
          <BudgetChart projects={activeProjects} />
        </div>

        <div className="stat-card">
          <h2 className="text-lg font-semibold text-slate-900 mb-4">Highest Expense Items</h2>
          <div className="space-y-3">
            {topExpenses.map((exp, i) => {
              const proj = projects.find((p) => p.id === exp.projectId);
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

      {/* Active Projects Grid */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-slate-900">Active Projects</h2>
          <Link href="/projects" className="text-sm text-blue-600 hover:text-blue-700 font-medium flex items-center gap-1">View All <ArrowRight size={14} /></Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
          {activeProjects.map((project) => {
            const pTasks = tasks.filter((t) => t.projectId === project.id);
            const completed = pTasks.filter((t) => t.status === "completed").length;
            const progress = progressPercent(project.totalSpent, project.totalBudget);
            const hasHot = pTasks.some((t) => t.priority === "critical" && (t.status === "in_progress" || t.status === "blocked"));
            return (
              <Link key={project.id} href={`/projects/${project.id}`} className="stat-card group cursor-pointer">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <h3 className="font-semibold text-slate-900 group-hover:text-blue-600 transition">{project.name}</h3>
                    <p className="text-xs text-slate-400 flex items-center gap-1 mt-0.5"><MapPin size={11} /> {project.address.city}, {project.address.state}</p>
                  </div>
                  {hasHot && <span className="w-3 h-3 rounded-full bg-red-500 heat-pulse"></span>}
                </div>
                <div className="mt-3">
                  <div className="flex justify-between text-xs text-slate-500 mb-1"><span>Budget</span><span>{progress}%</span></div>
                  <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                    <div className={cn("h-full rounded-full", progress > 90 ? "bg-red-500" : progress > 70 ? "bg-amber-500" : "bg-blue-500")} style={{ width: `${progress}%` }}></div>
                  </div>
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
