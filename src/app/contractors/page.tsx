"use client";

import Link from "next/link";
import { Star, Phone, MessageSquare, Mail, Briefcase, Plus } from "lucide-react";
import { contractors, projects, tasks, communications } from "@/lib/mock-data";
import { cn } from "@/lib/utils";

export default function ContractorsPage() {
  return (
    <div className="space-y-6 fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Contractors</h1>
          <p className="text-sm text-slate-500 mt-1">{contractors.length} contractors in your network</p>
        </div>
        <button className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2.5 rounded-lg text-sm font-medium hover:bg-blue-700 transition">
          <Plus size={16} /> Add Contractor
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {contractors.map((c) => {
          const cProjects = projects.filter((p) => p.contractorIds.includes(c.id));
          const activeProjCount = cProjects.filter((p) => p.status === "active").length;
          const cTasks = tasks.filter((t) => t.assignedContractorId === c.id);
          const completedTasks = cTasks.filter((t) => t.status === "completed").length;
          const lastComm = communications
            .filter((cm) => cm.contractorId === c.id)
            .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())[0];

          return (
            <Link key={c.id} href={`/contractors/${c.id}`} className="stat-card group cursor-pointer">
              <div className="flex items-start gap-3">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-violet-500 flex items-center justify-center text-white font-bold text-sm">
                  {c.name.split(" ").map((n) => n[0]).join("")}
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-slate-900 group-hover:text-blue-600 transition">{c.name}</h3>
                  <p className="text-xs text-slate-400">{c.company}</p>
                  <div className="flex items-center gap-1 mt-1">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star key={i} size={12} className={i < Math.round(c.rating) ? "fill-amber-400 text-amber-400" : "text-slate-200"} />
                    ))}
                    <span className="text-xs text-slate-400 ml-1">{c.rating}</span>
                  </div>
                </div>
              </div>

              <div className="flex flex-wrap gap-1.5 mt-3">
                {c.specialty.map((s) => (
                  <span key={s} className="badge bg-blue-50 text-blue-700">{s}</span>
                ))}
              </div>

              <div className="grid grid-cols-3 gap-2 mt-3 text-center">
                <div className="bg-slate-50 rounded-lg p-2">
                  <p className="text-xs text-slate-400">Active</p>
                  <p className="text-sm font-bold text-slate-800">{activeProjCount}</p>
                </div>
                <div className="bg-slate-50 rounded-lg p-2">
                  <p className="text-xs text-slate-400">Total Jobs</p>
                  <p className="text-sm font-bold text-slate-800">{c.totalJobsCompleted}</p>
                </div>
                <div className="bg-slate-50 rounded-lg p-2">
                  <p className="text-xs text-slate-400">Tasks Done</p>
                  <p className="text-sm font-bold text-slate-800">{completedTasks}</p>
                </div>
              </div>

              {lastComm && (
                <div className="mt-3 p-2.5 bg-slate-50 rounded-lg">
                  <p className="text-[10px] text-slate-400 mb-0.5">Last communication</p>
                  <p className="text-xs text-slate-600 line-clamp-1">{lastComm.content}</p>
                </div>
              )}

              <div className="flex gap-2 mt-3">
                <button className="flex-1 flex items-center justify-center gap-1.5 py-2 bg-blue-50 text-blue-600 rounded-lg text-xs font-medium hover:bg-blue-100 transition" onClick={(e) => e.preventDefault()}>
                  <MessageSquare size={12} /> Text
                </button>
                <button className="flex-1 flex items-center justify-center gap-1.5 py-2 bg-emerald-50 text-emerald-600 rounded-lg text-xs font-medium hover:bg-emerald-100 transition" onClick={(e) => e.preventDefault()}>
                  <Phone size={12} /> Call
                </button>
                <button className="flex-1 flex items-center justify-center gap-1.5 py-2 bg-violet-50 text-violet-600 rounded-lg text-xs font-medium hover:bg-violet-100 transition" onClick={(e) => e.preventDefault()}>
                  <Mail size={12} /> Email
                </button>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
