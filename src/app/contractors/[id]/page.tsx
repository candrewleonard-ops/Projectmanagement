"use client";

import { useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import {
  ArrowLeft, Phone, MessageSquare, Mail, Star, MapPin,
  FileText, Clock, CheckCircle2, Calendar, Building2,
  StickyNote, ExternalLink,
} from "lucide-react";
import {
  getContractor, getContractorComms, getContractorProjects,
  getContractorInvoices, tasks, contractors as allContractors,
} from "@/lib/mock-data";
import { formatCurrency, formatDate, formatRelativeTime, statusColor, cn } from "@/lib/utils";

export default function ContractorDetailPage() {
  const { id } = useParams<{ id: string }>();
  const contractor = getContractor(id);
  const [activeTab, setActiveTab] = useState<"overview" | "comms" | "invoices">("overview");

  if (!contractor) {
    return <div className="flex items-center justify-center h-96"><p className="text-slate-400">Contractor not found.</p></div>;
  }

  const comms = getContractorComms(contractor.id);
  const cProjects = getContractorProjects(contractor.id);
  const cInvoices = getContractorInvoices(contractor.id);
  const cTasks = tasks.filter((t) => t.assignedContractorId === contractor.id);

  // Other contractors sharing projects with this one
  const sharedContractorIds = new Set<string>();
  cProjects.forEach((p) => {
    p.contractorIds.forEach((cid) => {
      if (cid !== contractor.id) sharedContractorIds.add(cid);
    });
  });
  const sharedContractors = allContractors.filter((c) => sharedContractorIds.has(c.id));

  return (
    <div className="space-y-6 fade-in">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <Link href="/contractors" className="text-sm text-blue-600 hover:text-blue-700 flex items-center gap-1 mb-2">
            <ArrowLeft size={14} /> Back to Contractors
          </Link>
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-full bg-gradient-to-br from-blue-500 to-violet-500 flex items-center justify-center text-white font-bold text-lg">
              {contractor.name.split(" ").map((n) => n[0]).join("")}
            </div>
            <div>
              <h1 className="text-2xl font-bold text-slate-900">{contractor.name}</h1>
              <p className="text-sm text-slate-500">{contractor.company}</p>
              <div className="flex items-center gap-1 mt-1">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} size={14} className={i < Math.round(contractor.rating) ? "fill-amber-400 text-amber-400" : "text-slate-200"} />
                ))}
                <span className="text-sm text-slate-400 ml-1">{contractor.rating}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="flex gap-2">
          <button className="flex items-center gap-2 px-3 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700 transition">
            <MessageSquare size={14} /> Text
          </button>
          <button className="flex items-center gap-2 px-3 py-2 bg-emerald-600 text-white rounded-lg text-sm hover:bg-emerald-700 transition">
            <Phone size={14} /> Call
          </button>
          <button className="flex items-center gap-2 px-3 py-2 bg-violet-600 text-white rounded-lg text-sm hover:bg-violet-700 transition">
            <Mail size={14} /> Email
          </button>
          <Link href={`/invoices/create?contractor=${contractor.id}`} className="flex items-center gap-2 px-3 py-2 bg-amber-600 text-white rounded-lg text-sm hover:bg-amber-700 transition">
            <FileText size={14} /> Write Invoice
          </Link>
        </div>
      </div>

      {/* Contact + Specialties */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="stat-card">
          <h3 className="text-xs font-semibold text-slate-400 uppercase mb-2">Contact</h3>
          <div className="space-y-2 text-sm">
            <p className="flex items-center gap-2 text-slate-700"><Phone size={14} className="text-slate-400" /> {contractor.phone}</p>
            <p className="flex items-center gap-2 text-slate-700"><Mail size={14} className="text-slate-400" /> {contractor.email}</p>
          </div>
        </div>
        <div className="stat-card">
          <h3 className="text-xs font-semibold text-slate-400 uppercase mb-2">Specialties</h3>
          <div className="flex flex-wrap gap-1.5">
            {contractor.specialty.map((s) => (
              <span key={s} className="badge bg-blue-50 text-blue-700">{s}</span>
            ))}
          </div>
        </div>
        <div className="stat-card">
          <h3 className="text-xs font-semibold text-slate-400 uppercase mb-2">Stats</h3>
          <div className="grid grid-cols-2 gap-2 text-center">
            <div><p className="text-lg font-bold text-slate-900">{contractor.totalJobsCompleted}</p><p className="text-xs text-slate-400">Jobs Done</p></div>
            <div><p className="text-lg font-bold text-slate-900">{cProjects.filter(p => p.status === "active").length}</p><p className="text-xs text-slate-400">Active</p></div>
          </div>
        </div>
      </div>

      {/* Shared Contractors Banner */}
      {sharedContractors.length > 0 && (
        <div className="stat-card bg-blue-50 border-blue-200">
          <h3 className="text-xs font-semibold text-blue-600 uppercase mb-2">Also on shared projects</h3>
          <div className="flex gap-3 flex-wrap">
            {sharedContractors.map((sc) => (
              <Link key={sc.id} href={`/contractors/${sc.id}`} className="flex items-center gap-2 bg-white px-3 py-2 rounded-lg text-sm hover:shadow-md transition">
                <div className="w-7 h-7 rounded-full bg-gradient-to-br from-blue-500 to-violet-500 flex items-center justify-center text-white text-[10px] font-bold">
                  {sc.name.split(" ").map((n) => n[0]).join("")}
                </div>
                <div>
                  <p className="font-medium text-slate-800 text-xs">{sc.name}</p>
                  <p className="text-[10px] text-slate-400">{sc.specialty.join(", ")}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Notes */}
      {contractor.notes && (
        <div className="stat-card">
          <h3 className="text-xs font-semibold text-slate-400 uppercase mb-2 flex items-center gap-1.5"><StickyNote size={12} /> Notes</h3>
          <p className="text-sm text-slate-700">{contractor.notes}</p>
        </div>
      )}

      {/* Tabs */}
      <div className="border-b border-slate-200">
        <div className="flex gap-1 -mb-px">
          {(["overview", "comms", "invoices"] as const).map((tab) => (
            <button key={tab} onClick={() => setActiveTab(tab)} className={cn(
              "px-4 py-2.5 text-sm font-medium border-b-2 transition capitalize",
              activeTab === tab ? "border-blue-600 text-blue-600" : "border-transparent text-slate-500 hover:text-slate-700"
            )}>
              {tab === "comms" ? "Communications" : tab}
            </button>
          ))}
        </div>
      </div>

      {/* Tab Content */}
      {activeTab === "overview" && (
        <div className="space-y-6">
          {/* Projects */}
          <div>
            <h3 className="text-sm font-semibold text-slate-700 mb-3">Assigned Projects</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {cProjects.map((p) => (
                <Link key={p.id} href={`/projects/${p.id}`} className="stat-card flex items-center gap-3 group cursor-pointer">
                  <Building2 size={20} className="text-blue-500" />
                  <div className="flex-1">
                    <p className="font-medium text-slate-900 group-hover:text-blue-600 transition">{p.name}</p>
                    <p className="text-xs text-slate-400">{p.address.city}, {p.address.state}</p>
                  </div>
                  <span className={`badge ${statusColor(p.status)}`}>{p.status.replace("_", " ")}</span>
                </Link>
              ))}
            </div>
          </div>

          {/* Tasks assigned */}
          <div>
            <h3 className="text-sm font-semibold text-slate-700 mb-3">Tasks ({cTasks.length})</h3>
            <div className="space-y-2">
              {cTasks.map((task) => (
                <div key={task.id} className="stat-card flex items-center gap-3">
                  {task.status === "completed" ? (
                    <CheckCircle2 size={16} className="text-emerald-500" />
                  ) : task.status === "in_progress" ? (
                    <Clock size={16} className="text-sky-500" />
                  ) : (
                    <Calendar size={16} className="text-violet-500" />
                  )}
                  <div className="flex-1">
                    <p className="text-sm font-medium text-slate-800">{task.title}</p>
                    <p className="text-xs text-slate-400">{task.category} &middot; {task.status.replace("_", " ")}</p>
                  </div>
                  <span className="text-sm font-semibold text-slate-700">{formatCurrency(task.estimatedCost)}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {activeTab === "comms" && (
        <div className="space-y-2">
          {comms.length === 0 ? (
            <p className="text-sm text-slate-400">No communications yet.</p>
          ) : (
            comms.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()).map((comm) => (
              <div key={comm.id} className={cn("stat-card flex items-start gap-3", !comm.read && "ring-2 ring-blue-200")}>
                <div className={cn("w-8 h-8 rounded-full flex items-center justify-center text-white text-xs",
                  comm.type === "call" ? "bg-emerald-500" : comm.type === "sms" ? "bg-blue-500" : comm.type === "email" ? "bg-violet-500" : "bg-slate-500"
                )}>
                  {comm.type === "call" ? <Phone size={14} /> : comm.type === "sms" ? <MessageSquare size={14} /> : <FileText size={14} />}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-slate-900">{comm.type.toUpperCase()}</span>
                    <span className="text-xs text-slate-400">{comm.direction}</span>
                    {comm.callStatus === "missed" && <span className="badge bg-red-100 text-red-700">Missed</span>}
                    {comm.callStatus === "scheduled" && <span className="badge bg-violet-100 text-violet-700">Scheduled</span>}
                    {comm.duration && <span className="text-xs text-slate-400">{Math.floor(comm.duration / 60)}m {comm.duration % 60}s</span>}
                  </div>
                  <p className="text-sm text-slate-600 mt-0.5">{comm.content}</p>
                  <p className="text-xs text-slate-400 mt-1">{formatRelativeTime(comm.timestamp)}</p>
                  {/* Project context */}
                  {comm.projectId && (
                    <Link href={`/projects/${comm.projectId}`} className="text-xs text-blue-600 hover:text-blue-700 mt-1 inline-block">
                      View Project →
                    </Link>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {activeTab === "invoices" && (
        <div className="space-y-3">
          {cInvoices.length === 0 ? (
            <p className="text-sm text-slate-400">No invoices yet.</p>
          ) : (
            cInvoices.map((inv) => (
              <div key={inv.id} className="stat-card">
                <div className="flex items-center justify-between mb-2">
                  <p className="font-medium text-slate-900">Invoice #{inv.id}</p>
                  <span className={`badge ${statusColor(inv.status)}`}>{inv.status}</span>
                </div>
                <p className="text-lg font-bold text-slate-900">{formatCurrency(inv.subtotal)}</p>
                <div className="grid grid-cols-3 gap-2 mt-2">
                  <div className={cn("p-2 rounded-lg text-center text-xs", inv.depositPaid ? "bg-emerald-50 text-emerald-700" : "bg-slate-50 text-slate-500")}>
                    25% Deposit: {inv.depositPaid ? "Paid" : "Pending"}
                  </div>
                  <div className={cn("p-2 rounded-lg text-center text-xs", inv.midpointPaid ? "bg-emerald-50 text-emerald-700" : "bg-slate-50 text-slate-500")}>
                    25% Mid: {inv.midpointPaid ? "Paid" : "Pending"}
                  </div>
                  <div className={cn("p-2 rounded-lg text-center text-xs", inv.completionPaid ? "bg-emerald-50 text-emerald-700" : "bg-slate-50 text-slate-500")}>
                    50% Final: {inv.completionPaid ? "Paid" : "Pending"}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}
