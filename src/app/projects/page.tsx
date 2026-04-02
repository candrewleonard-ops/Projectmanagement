"use client";

import { Suspense, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import {
  Plus, MapPin, FolderOpen, Filter, Search, Grid3X3, List,
} from "lucide-react";
import { projects, folders, tasks } from "@/lib/mock-data";
import { formatCurrency, statusColor, progressPercent, cn, formatDate } from "@/lib/utils";
import { ProjectStatus } from "@/lib/types";

export default function ProjectsPage() {
  return <Suspense><ProjectsContent /></Suspense>;
}

function ProjectsContent() {
  const searchParams = useSearchParams();
  const folderFilter = searchParams.get("folder");
  const [statusFilter, setStatusFilter] = useState<ProjectStatus | "all">("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [showNewProject, setShowNewProject] = useState(false);

  let filtered = projects;
  if (folderFilter) {
    const folder = folders.find((f) => f.id === folderFilter);
    if (folder) filtered = filtered.filter((p) => folder.projectIds.includes(p.id));
  }
  if (statusFilter !== "all") filtered = filtered.filter((p) => p.status === statusFilter);
  if (searchQuery) {
    const q = searchQuery.toLowerCase();
    filtered = filtered.filter(
      (p) => p.name.toLowerCase().includes(q) || p.address.city.toLowerCase().includes(q) || p.address.state.toLowerCase().includes(q)
    );
  }

  const activeFolder = folders.find((f) => f.id === folderFilter);

  return (
    <div className="space-y-6 fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">
            {activeFolder ? activeFolder.name : "All Projects"}
          </h1>
          <p className="text-sm text-slate-500 mt-1">{filtered.length} projects</p>
        </div>
        <button
          onClick={() => setShowNewProject(true)}
          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2.5 rounded-lg text-sm font-medium hover:bg-blue-700 transition"
        >
          <Plus size={16} /> New Project
        </button>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-3 flex-wrap">
        {/* Folder pills */}
        <Link
          href="/projects"
          className={cn("px-3 py-1.5 rounded-full text-xs font-medium transition", !folderFilter ? "bg-blue-100 text-blue-700" : "bg-slate-100 text-slate-600 hover:bg-slate-200")}
        >
          All
        </Link>
        {folders.map((f) => (
          <Link
            key={f.id}
            href={`/projects?folder=${f.id}`}
            className={cn("px-3 py-1.5 rounded-full text-xs font-medium transition flex items-center gap-1.5",
              folderFilter === f.id ? "bg-blue-100 text-blue-700" : "bg-slate-100 text-slate-600 hover:bg-slate-200"
            )}
          >
            <span className="w-2 h-2 rounded-full" style={{ background: f.color }}></span>
            {f.name}
          </Link>
        ))}

        <div className="flex-1"></div>

        {/* Status filter */}
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value as ProjectStatus | "all")}
          className="text-xs border border-slate-200 rounded-lg px-3 py-1.5 bg-white"
        >
          <option value="all">All Statuses</option>
          <option value="active">Active</option>
          <option value="completed">Completed</option>
          <option value="on_hold">On Hold</option>
          <option value="archived">Archived</option>
        </select>

        {/* Search */}
        <div className="relative">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-8 pr-3 py-1.5 text-xs border border-slate-200 rounded-lg bg-white w-48"
          />
        </div>

        {/* View toggle */}
        <div className="flex border border-slate-200 rounded-lg overflow-hidden">
          <button onClick={() => setViewMode("grid")} className={cn("p-1.5", viewMode === "grid" ? "bg-blue-50 text-blue-600" : "text-slate-400")}>
            <Grid3X3 size={14} />
          </button>
          <button onClick={() => setViewMode("list")} className={cn("p-1.5", viewMode === "list" ? "bg-blue-50 text-blue-600" : "text-slate-400")}>
            <List size={14} />
          </button>
        </div>
      </div>

      {/* Project Grid/List */}
      {viewMode === "grid" ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {filtered.map((project) => {
            const pTasks = tasks.filter((t) => t.projectId === project.id);
            const completed = pTasks.filter((t) => t.status === "completed").length;
            const progress = progressPercent(project.totalSpent, project.totalBudget);
            const hasHot = pTasks.some((t) => t.priority === "critical" && (t.status === "in_progress" || t.status === "blocked"));
            const folder = folders.find((f) => f.id === project.folderId);

            return (
              <Link key={project.id} href={`/projects/${project.id}`} className="stat-card group cursor-pointer">
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      {folder && <span className="w-2 h-2 rounded-full" style={{ background: folder.color }}></span>}
                      <span className={`badge ${statusColor(project.status)}`}>{project.status.replace("_", " ")}</span>
                    </div>
                    <h3 className="font-semibold text-slate-900 group-hover:text-blue-600 transition">{project.name}</h3>
                    <p className="text-xs text-slate-400 flex items-center gap-1 mt-1">
                      <MapPin size={11} /> {project.address.street}, {project.address.city}, {project.address.state}
                    </p>
                  </div>
                  {hasHot && <span className="w-3 h-3 rounded-full bg-red-500 heat-pulse mt-1"></span>}
                </div>

                <div className="mt-4 grid grid-cols-3 gap-2 text-center">
                  <div className="bg-slate-50 rounded-lg p-2">
                    <p className="text-xs text-slate-400">Purchase</p>
                    <p className="text-sm font-semibold text-slate-800">{formatCurrency(project.purchasePrice)}</p>
                  </div>
                  <div className="bg-slate-50 rounded-lg p-2">
                    <p className="text-xs text-slate-400">ARV</p>
                    <p className="text-sm font-semibold text-emerald-700">{formatCurrency(project.estimatedARV)}</p>
                  </div>
                  <div className="bg-slate-50 rounded-lg p-2">
                    <p className="text-xs text-slate-400">Spent</p>
                    <p className="text-sm font-semibold text-slate-800">{formatCurrency(project.totalSpent)}</p>
                  </div>
                </div>

                <div className="mt-3">
                  <div className="flex justify-between text-xs text-slate-500 mb-1"><span>Budget</span><span>{progress}%</span></div>
                  <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                    <div className={cn("h-full rounded-full", progress > 90 ? "bg-red-500" : progress > 70 ? "bg-amber-500" : "bg-blue-500")} style={{ width: `${progress}%` }}></div>
                  </div>
                </div>

                <div className="mt-3 flex justify-between text-xs text-slate-400">
                  <span>{completed}/{pTasks.length} tasks done</span>
                  <span>{project.contractorIds.length} contractors</span>
                </div>
              </Link>
            );
          })}
        </div>
      ) : (
        <div className="stat-card p-0 overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50">
                <th className="text-left py-3 px-4 font-medium text-slate-500">Project</th>
                <th className="text-left py-3 px-4 font-medium text-slate-500">Location</th>
                <th className="text-left py-3 px-4 font-medium text-slate-500">Status</th>
                <th className="text-right py-3 px-4 font-medium text-slate-500">Purchase</th>
                <th className="text-right py-3 px-4 font-medium text-slate-500">ARV</th>
                <th className="text-right py-3 px-4 font-medium text-slate-500">Spent</th>
                <th className="text-right py-3 px-4 font-medium text-slate-500">Budget %</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((project) => {
                const progress = progressPercent(project.totalSpent, project.totalBudget);
                return (
                  <tr key={project.id} className="border-b border-slate-100 hover:bg-slate-50 transition">
                    <td className="py-3 px-4">
                      <Link href={`/projects/${project.id}`} className="font-medium text-slate-900 hover:text-blue-600">{project.name}</Link>
                    </td>
                    <td className="py-3 px-4 text-slate-500">{project.address.city}, {project.address.state}</td>
                    <td className="py-3 px-4"><span className={`badge ${statusColor(project.status)}`}>{project.status.replace("_", " ")}</span></td>
                    <td className="py-3 px-4 text-right text-slate-700">{formatCurrency(project.purchasePrice)}</td>
                    <td className="py-3 px-4 text-right text-emerald-700 font-medium">{formatCurrency(project.estimatedARV)}</td>
                    <td className="py-3 px-4 text-right text-slate-700">{formatCurrency(project.totalSpent)}</td>
                    <td className="py-3 px-4 text-right">
                      <span className={cn("font-medium", progress > 90 ? "text-red-600" : progress > 70 ? "text-amber-600" : "text-blue-600")}>{progress}%</span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* New Project Modal */}
      {showNewProject && <NewProjectModal onClose={() => setShowNewProject(false)} />}
    </div>
  );
}

function NewProjectModal({ onClose }: { onClose: () => void }) {
  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50" onClick={onClose}>
      <div className="bg-white rounded-2xl w-full max-w-lg p-6 shadow-2xl" onClick={(e) => e.stopPropagation()}>
        <h2 className="text-xl font-bold text-slate-900 mb-4">Create New Project</h2>
        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium text-slate-700 block mb-1">Project Name</label>
            <input className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm" placeholder="e.g. Oakwood Revival" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-slate-700 block mb-1">Street Address</label>
              <input className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm" placeholder="1234 Main St" />
            </div>
            <div>
              <label className="text-sm font-medium text-slate-700 block mb-1">City</label>
              <input className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm" placeholder="Atlanta" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-slate-700 block mb-1">State</label>
              <input className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm" placeholder="GA" />
            </div>
            <div>
              <label className="text-sm font-medium text-slate-700 block mb-1">ZIP</label>
              <input className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm" placeholder="30316" />
            </div>
          </div>
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="text-sm font-medium text-slate-700 block mb-1">Purchase Price</label>
              <input className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm" placeholder="$185,000" />
            </div>
            <div>
              <label className="text-sm font-medium text-slate-700 block mb-1">Est. ARV</label>
              <input className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm" placeholder="$345,000" />
            </div>
            <div>
              <label className="text-sm font-medium text-slate-700 block mb-1">Total Budget</label>
              <input className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm" placeholder="$78,000" />
            </div>
          </div>
          <div>
            <label className="text-sm font-medium text-slate-700 block mb-1">Folder</label>
            <select className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm">
              {folders.map((f) => (
                <option key={f.id} value={f.id}>{f.name}</option>
              ))}
            </select>
          </div>
          <div className="flex gap-3 justify-end mt-6">
            <button onClick={onClose} className="px-4 py-2 text-sm text-slate-600 hover:bg-slate-100 rounded-lg transition">Cancel</button>
            <button onClick={onClose} className="px-4 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium">Create Project</button>
          </div>
        </div>
      </div>
    </div>
  );
}
