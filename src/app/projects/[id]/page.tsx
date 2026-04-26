"use client";

import { useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import {
  ArrowLeft, MapPin, DollarSign, Calendar, Users, CheckCircle2,
  Clock, AlertTriangle, Camera, Box, MessageSquare, Phone,
  FileText, ExternalLink, Upload, Ban, Shield, Edit3, Trash2,
  Save, X, Key, Zap, Droplets, Flame, Send, ListChecks, Plus,
  Eye, EyeOff,
} from "lucide-react";
import { useStore } from "@/lib/store";
import { formatCurrency, formatDate, statusColor, cn, progressPercent, formatRelativeTime } from "@/lib/utils";

type Tab = "tasks" | "expenses" | "photos" | "renders" | "contractors" | "comms" | "invoices" | "vital";

export default function ProjectDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const store = useStore();
  const [activeTab, setActiveTab] = useState<Tab>("tasks");
  const [editing, setEditing] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState(false);
  const [composeFor, setComposeFor] = useState<string | null>(null);
  const [composeType, setComposeType] = useState<"sms" | "call">("sms");
  const [messageText, setMessageText] = useState("");

  const project = store.getProject(id);
  if (!project) return <div className="flex items-center justify-center h-96"><p className="text-slate-400">Project not found.</p></div>;

  const projectTasks = store.getProjectTasks(project.id);
  const projectExpenses = store.getProjectExpenses(project.id);
  const projectComms = store.getProjectComms(project.id);
  const projectInvoices = store.getProjectInvoices(project.id);
  const projectContractors = store.contractors.filter((c) => project.contractorIds.includes(c.id));
  const progress = progressPercent(project.totalSpent, project.totalBudget);
  const overBudget = project.totalSpent > project.totalBudget && project.totalBudget > 0;

  const completedTasks = projectTasks.filter((t) => t.status === "completed");
  const inProgressTasks = projectTasks.filter((t) => t.status === "in_progress");
  const scheduledTasks = projectTasks.filter((t) => t.status === "scheduled");
  const blockedTasks = projectTasks.filter((t) => t.status === "blocked");
  const qualityPassed = projectTasks.filter((t) => t.qualityCheck === "passed");
  const vitalInfo = store.getVitalInfo(project.id);

  const tabs: { key: Tab; label: string; count?: number }[] = [
    { key: "tasks", label: "Tasks & Work Orders", count: projectTasks.length },
    { key: "expenses", label: "Expenses", count: projectExpenses.length },
    { key: "vital", label: "Vital Information" },
    { key: "photos", label: "Files & Photos", count: project.photos.length },
    { key: "renders", label: "3D Renders", count: project.renders.length },
    { key: "contractors", label: "Contractors", count: projectContractors.length },
    { key: "comms", label: "Communications", count: projectComms.length },
    { key: "invoices", label: "Invoices", count: projectInvoices.length },
  ];

  const handleDelete = () => {
    store.deleteProject(project.id);
    router.push("/projects");
  };

  const handleSendMessage = (contractorId: string) => {
    if (!messageText.trim()) return;
    store.addCommunication({
      id: `comm-${Date.now()}`, projectId: project.id, contractorId,
      type: composeType === "sms" ? "sms" : "call", direction: "outbound",
      content: messageText, timestamp: new Date().toISOString(), read: true,
      ...(composeType === "call" ? { callStatus: "completed" as const } : {}),
    });
    setMessageText("");
    setComposeFor(null);
  };

  return (
    <div className="space-y-6 fade-in">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <Link href="/projects" className="text-sm text-blue-600 hover:text-blue-700 flex items-center gap-1 mb-2"><ArrowLeft size={14} /> Back to Projects</Link>
          <h1 className="text-2xl font-bold text-slate-900">{project.name}</h1>
          <p className="text-sm text-slate-500 flex items-center gap-1.5 mt-1"><MapPin size={13} /> {project.address.street}, {project.address.city}, {project.address.state} {project.address.zip}</p>
        </div>
        <div className="flex items-center gap-2">
          <span className={`badge text-sm ${statusColor(project.status)}`}>{project.status.replace("_", " ")}</span>
          {overBudget && <span className="badge text-sm bg-red-100 text-red-700 font-semibold">OVER BUDGET</span>}
          <button onClick={() => setEditing(true)} className="flex items-center gap-1.5 px-3 py-2 bg-slate-100 text-slate-700 rounded-lg text-sm hover:bg-slate-200 transition"><Edit3 size={14} /> Edit</button>
          <button onClick={() => setDeleteConfirm(true)} className="flex items-center gap-1.5 px-3 py-2 bg-red-50 text-red-600 rounded-lg text-sm hover:bg-red-100 transition"><Trash2 size={14} /> Delete</button>
          <Link href={`/communications?contractor=${projectContractors[0]?.id || ""}`} className="flex items-center gap-2 px-3 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition"><MessageSquare size={14} /> Messages & Calls</Link>
        </div>
      </div>

      {/* Financial Overview */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <MiniStat label="Purchase Price" value={formatCurrency(project.purchasePrice)} />
        <MiniStat label="Est. ARV" value={formatCurrency(project.estimatedARV)} accent="emerald" />
        <MiniStat label="Total Budget" value={formatCurrency(project.totalBudget)} />
        <MiniStat label="Total Spent" value={formatCurrency(project.totalSpent)} accent={overBudget ? "red" : "blue"} />
        <div className="stat-card">
          <p className="text-xs text-slate-400 mb-1">Potential Profit</p>
          <p className={cn("text-lg font-bold", overBudget ? "text-red-700" : "text-emerald-700")}>
            {formatCurrency(project.estimatedARV - project.purchasePrice - project.totalSpent)}
          </p>
          <p className="text-[10px] text-slate-400">ARV - Purchase - Spent</p>
        </div>
      </div>

      {/* Progress Bar */}
      <div className={cn("stat-card", overBudget && "ring-2 ring-red-300")}>
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-slate-700">Budget Progress</span>
          <span className={cn("text-sm font-semibold", overBudget && "text-red-600")}>{progress}%{overBudget && " — OVER BUDGET"}</span>
        </div>
        <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden">
          <div className={cn("h-full rounded-full transition-all", overBudget ? "bg-red-500" : progress > 70 ? "bg-amber-500" : "bg-blue-500")} style={{ width: `${Math.min(progress, 100)}%` }}></div>
        </div>
        {overBudget && (
          <p className="text-sm text-red-600 font-medium mt-2">Over budget by {formatCurrency(project.totalSpent - project.totalBudget)}</p>
        )}
        <div className="flex justify-between mt-2 text-xs text-slate-400">
          <span>Started {formatDate(project.startDate)}</span>
          <span>Est. Complete {formatDate(project.estimatedEndDate)}</span>
        </div>
      </div>

      {/* Scope of Work */}
      {project.scopeOfWork && (
        <div className="stat-card">
          <h3 className="text-sm font-semibold text-slate-700 mb-2">Scope of Work</h3>
          <p className="text-sm text-slate-600">{project.scopeOfWork}</p>
        </div>
      )}

      {/* Quick Stats */}
      <div className="flex items-center gap-6 text-sm">
        <span className="flex items-center gap-1.5 text-emerald-600"><CheckCircle2 size={14} /> {qualityPassed.length} QC Verified</span>
        <span className="flex items-center gap-1.5 text-sky-600"><Clock size={14} /> {inProgressTasks.length} In Progress</span>
        <span className="flex items-center gap-1.5 text-violet-600"><Calendar size={14} /> {scheduledTasks.length} Scheduled</span>
        <span className="flex items-center gap-1.5 text-red-600"><AlertTriangle size={14} /> {blockedTasks.length} Blocked</span>
        <span className="flex items-center gap-1.5 text-slate-600"><Users size={14} /> {projectContractors.length} Contractors</span>
      </div>

      {/* This Week */}
      <ThisWeekSection projectId={project.id} />

      {/* Tabs */}
      <div className="border-b border-slate-200">
        <div className="flex gap-1 -mb-px overflow-x-auto">
          {tabs.map((tab) => (
            <button key={tab.key} onClick={() => setActiveTab(tab.key)}
              className={cn("px-4 py-2.5 text-sm font-medium border-b-2 transition whitespace-nowrap",
                activeTab === tab.key ? "border-blue-600 text-blue-600" : "border-transparent text-slate-500 hover:text-slate-700"
              )}>
              {tab.label}
              {tab.count !== undefined && <span className="ml-1.5 text-xs bg-slate-100 text-slate-500 px-1.5 py-0.5 rounded-full">{tab.count}</span>}
            </button>
          ))}
        </div>
      </div>

      {/* Tab Content */}
      <div>
        {activeTab === "tasks" && <TasksTab tasks={projectTasks} />}
        {activeTab === "expenses" && <ExpensesTab expenses={projectExpenses} />}
        {activeTab === "vital" && <VitalInfoTab projectId={project.id} vitalInfo={vitalInfo} store={store} />}
        {activeTab === "photos" && <PhotosTab photos={project.photos} projectId={project.id} store={store} />}
        {activeTab === "renders" && <RendersTab renders={project.renders} />}
        {activeTab === "contractors" && (
          <div>
            <h3 className="text-sm font-semibold text-slate-700 mb-4">Assigned Contractors</h3>
            <div className="space-y-2">
              {projectContractors.map((c) => (
                <div key={c.id} className="stat-card cursor-pointer hover:border-blue-200 hover:shadow-md transition" onClick={() => router.push(`/contractors/${c.id}`)}>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-violet-500 flex items-center justify-center text-white font-bold text-sm">{c.name.split(" ").map((n) => n[0]).join("")}</div>
                    <div className="flex-1">
                      <span className="font-medium text-slate-900 group-hover:text-blue-600">{c.name}</span>
                      <p className="text-xs text-slate-400">{c.company} &middot; {c.phone}</p>
                    </div>
                    <div className="flex gap-1" onClick={(e) => e.stopPropagation()}>
                      <button onClick={() => { setComposeFor(c.id); setComposeType("sms"); }} className="p-2 rounded-lg hover:bg-blue-50 text-slate-400 hover:text-blue-600"><MessageSquare size={14} /></button>
                      <button onClick={() => { setComposeFor(c.id); setComposeType("call"); }} className="p-2 rounded-lg hover:bg-emerald-50 text-slate-400 hover:text-emerald-600"><Phone size={14} /></button>
                      <Link href={`/invoices/create?contractor=${c.id}&project=${project.id}`} className="p-2 rounded-lg hover:bg-violet-50 text-slate-400 hover:text-violet-600"><FileText size={14} /></Link>
                    </div>
                  </div>
                  {/* Inline compose */}
                  {composeFor === c.id && (
                    <div className="mt-3 pt-3 border-t border-slate-100">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-xs font-medium text-slate-500">{composeType === "sms" ? "Text" : "Call"} {c.name}</span>
                        <button onClick={() => setComposeFor(null)} className="ml-auto"><X size={12} /></button>
                      </div>
                      {composeType === "call" ? (
                        <button className="flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-lg text-sm"><Phone size={14} /> Call {c.phone}</button>
                      ) : (
                        <div className="flex gap-2">
                          <input value={messageText} onChange={(e) => setMessageText(e.target.value)} placeholder="Type message..." className="flex-1 border border-slate-200 rounded-lg px-3 py-1.5 text-sm" />
                          <button onClick={() => handleSendMessage(c.id)} className="px-3 py-1.5 bg-blue-600 text-white rounded-lg text-sm"><Send size={12} /></button>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
        {activeTab === "comms" && <CommsTab comms={projectComms} store={store} />}
        {activeTab === "invoices" && <InvoicesTab invoices={projectInvoices} store={store} projectId={project.id} />}
      </div>

      {/* Edit Modal */}
      {editing && <EditProjectModal project={project} store={store} onClose={() => setEditing(false)} />}

      {/* Delete Confirm */}
      {deleteConfirm && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50" onClick={() => setDeleteConfirm(false)}>
          <div className="bg-white rounded-2xl p-6 shadow-2xl max-w-sm" onClick={(e) => e.stopPropagation()}>
            <h3 className="text-lg font-bold text-slate-900 mb-2">Delete {project.name}?</h3>
            <p className="text-sm text-slate-500 mb-4">This will permanently delete the project and all tasks/expenses.</p>
            <div className="flex gap-3 justify-end">
              <button onClick={() => setDeleteConfirm(false)} className="px-4 py-2 text-sm text-slate-600 hover:bg-slate-100 rounded-lg">Cancel</button>
              <button onClick={handleDelete} className="px-4 py-2 text-sm bg-red-600 text-white rounded-lg hover:bg-red-700">Delete</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function MiniStat({ label, value, accent }: { label: string; value: string; accent?: string }) {
  const c = accent === "emerald" ? "text-emerald-700" : accent === "red" ? "text-red-700" : accent === "blue" ? "text-blue-700" : "text-slate-900";
  return <div className="stat-card"><p className="text-xs text-slate-400 mb-1">{label}</p><p className={cn("text-lg font-bold", c)}>{value}</p></div>;
}

function EditProjectModal({ project, store, onClose }: { project: any; store: any; onClose: () => void }) {
  const [form, setForm] = useState({
    name: project.name, street: project.address.street, city: project.address.city,
    state: project.address.state, zip: project.address.zip,
    purchasePrice: project.purchasePrice.toString(), estimatedARV: project.estimatedARV.toString(),
    totalBudget: project.totalBudget.toString(), totalSpent: project.totalSpent.toString(),
    status: project.status, scopeOfWork: project.scopeOfWork || "",
  });
  const set = (k: string, v: string) => setForm((p: any) => ({ ...p, [k]: v }));

  const save = () => {
    store.updateProject(project.id, {
      name: form.name, status: form.status as any, scopeOfWork: form.scopeOfWork,
      address: { ...project.address, street: form.street, city: form.city, state: form.state, zip: form.zip },
      purchasePrice: parseFloat(form.purchasePrice) || 0, estimatedARV: parseFloat(form.estimatedARV) || 0,
      totalBudget: parseFloat(form.totalBudget) || 0, totalSpent: parseFloat(form.totalSpent) || 0,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50" onClick={onClose}>
      <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[85vh] overflow-auto p-6 shadow-2xl" onClick={(e) => e.stopPropagation()}>
        <h2 className="text-xl font-bold text-slate-900 mb-4">Edit Project</h2>
        <div className="space-y-3">
          <div><label className="text-sm font-medium text-slate-700 block mb-1">Name</label><input className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm" value={form.name} onChange={(e) => set("name", e.target.value)} /></div>
          <div className="grid grid-cols-2 gap-3">
            <div><label className="text-sm font-medium text-slate-700 block mb-1">Street</label><input className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm" value={form.street} onChange={(e) => set("street", e.target.value)} /></div>
            <div><label className="text-sm font-medium text-slate-700 block mb-1">City</label><input className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm" value={form.city} onChange={(e) => set("city", e.target.value)} /></div>
          </div>
          <div className="grid grid-cols-3 gap-3">
            <div><label className="text-sm font-medium text-slate-700 block mb-1">State</label><input className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm" value={form.state} onChange={(e) => set("state", e.target.value)} /></div>
            <div><label className="text-sm font-medium text-slate-700 block mb-1">ZIP</label><input className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm" value={form.zip} onChange={(e) => set("zip", e.target.value)} /></div>
            <div><label className="text-sm font-medium text-slate-700 block mb-1">Status</label>
              <select className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm" value={form.status} onChange={(e) => set("status", e.target.value)}>
                <option value="active">Active</option><option value="completed">Completed</option><option value="on_hold">On Hold</option><option value="archived">Archived</option>
              </select>
            </div>
          </div>
          <div className="grid grid-cols-4 gap-3">
            <div><label className="text-sm font-medium text-slate-700 block mb-1">Purchase</label><input type="number" className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm" value={form.purchasePrice} onChange={(e) => set("purchasePrice", e.target.value)} /></div>
            <div><label className="text-sm font-medium text-slate-700 block mb-1">ARV</label><input type="number" className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm" value={form.estimatedARV} onChange={(e) => set("estimatedARV", e.target.value)} /></div>
            <div><label className="text-sm font-medium text-slate-700 block mb-1">Budget</label><input type="number" className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm" value={form.totalBudget} onChange={(e) => set("totalBudget", e.target.value)} /></div>
            <div><label className="text-sm font-medium text-slate-700 block mb-1">Spent</label><input type="number" className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm" value={form.totalSpent} onChange={(e) => set("totalSpent", e.target.value)} /></div>
          </div>
          <div><label className="text-sm font-medium text-slate-700 block mb-1">Scope of Work</label><textarea className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm h-20 resize-none" value={form.scopeOfWork} onChange={(e) => set("scopeOfWork", e.target.value)} /></div>
          <div className="flex gap-3 justify-end mt-4">
            <button onClick={onClose} className="px-4 py-2 text-sm text-slate-600 hover:bg-slate-100 rounded-lg">Cancel</button>
            <button onClick={save} className="px-4 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium"><Save size={14} className="inline mr-1" />Save Changes</button>
          </div>
        </div>
      </div>
    </div>
  );
}

function VitalInfoTab({ projectId, vitalInfo, store }: { projectId: string; vitalInfo: any; store: any }) {
  const [form, setForm] = useState(vitalInfo);
  const [saved, setSaved] = useState(false);
  const set = (k: string, v: string) => setForm((p: any) => ({ ...p, [k]: v }));

  const save = () => {
    store.updateVitalInfo(projectId, form);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="space-y-6">
      <div className="stat-card">
        <h3 className="text-lg font-semibold text-slate-900 mb-4 flex items-center gap-2"><Key size={18} className="text-slate-400" /> Vital Information</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-3">
            <h4 className="text-xs font-semibold text-slate-400 uppercase flex items-center gap-1.5"><Zap size={12} /> Electric</h4>
            <div><label className="text-xs text-slate-500">Company Name</label><input className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm mt-1" placeholder="Georgia Power" value={form.electricCompany} onChange={(e) => set("electricCompany", e.target.value)} /></div>
            <div><label className="text-xs text-slate-500">Account # / Login</label><input className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm mt-1" placeholder="Account number or login info" value={form.electricAccount} onChange={(e) => set("electricAccount", e.target.value)} /></div>
          </div>
          <div className="space-y-3">
            <h4 className="text-xs font-semibold text-slate-400 uppercase flex items-center gap-1.5"><Droplets size={12} /> Water</h4>
            <div><label className="text-xs text-slate-500">Company Name</label><input className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm mt-1" placeholder="City Water Dept" value={form.waterCompany} onChange={(e) => set("waterCompany", e.target.value)} /></div>
            <div><label className="text-xs text-slate-500">Account # / Login</label><input className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm mt-1" value={form.waterAccount} onChange={(e) => set("waterAccount", e.target.value)} /></div>
          </div>
          <div className="space-y-3">
            <h4 className="text-xs font-semibold text-slate-400 uppercase flex items-center gap-1.5"><Flame size={12} /> Gas</h4>
            <div><label className="text-xs text-slate-500">Company Name</label><input className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm mt-1" placeholder="Atlanta Gas Light" value={form.gasCompany} onChange={(e) => set("gasCompany", e.target.value)} /></div>
            <div><label className="text-xs text-slate-500">Account # / Login</label><input className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm mt-1" value={form.gasAccount} onChange={(e) => set("gasAccount", e.target.value)} /></div>
          </div>
          <div className="space-y-3">
            <h4 className="text-xs font-semibold text-slate-400 uppercase flex items-center gap-1.5"><Key size={12} /> Property Access</h4>
            <div><label className="text-xs text-slate-500">Key Location</label><textarea className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm mt-1 h-20 resize-none" placeholder="e.g. Lockbox on front door, code 1234. Spare key under the mat at side entrance." value={form.keyLocation} onChange={(e) => set("keyLocation", e.target.value)} /></div>
          </div>
        </div>
        <div className="mt-4">
          <label className="text-xs text-slate-500">Additional Notes</label>
          <textarea className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm mt-1 h-16 resize-none" placeholder="Any other vital info..." value={form.notes} onChange={(e) => set("notes", e.target.value)} />
        </div>
        <div className="flex items-center gap-3 mt-4">
          <button onClick={save} className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700 transition flex items-center gap-1.5"><Save size={14} /> Save Vital Info</button>
          {saved && <span className="text-sm text-emerald-600 font-medium flex items-center gap-1"><CheckCircle2 size={14} /> Saved!</span>}
        </div>
      </div>
    </div>
  );
}

function TasksTab({ tasks: projectTasks }: { tasks: any[] }) {
  const groups = [
    { label: "Blocked", tasks: projectTasks.filter((t) => t.status === "blocked"), color: "border-l-red-500" },
    { label: "In Progress", tasks: projectTasks.filter((t) => t.status === "in_progress"), color: "border-l-sky-500" },
    { label: "Scheduled (Upcoming)", tasks: projectTasks.filter((t) => t.status === "scheduled"), color: "border-l-violet-500" },
    { label: "Completed & Verified", tasks: projectTasks.filter((t) => t.status === "completed"), color: "border-l-emerald-500" },
  ];
  return (
    <div className="space-y-6">
      {groups.map((g) => g.tasks.length > 0 && (
        <div key={g.label}>
          <h3 className="text-sm font-semibold text-slate-700 mb-3">{g.label} ({g.tasks.length})</h3>
          <div className="space-y-2">
            {g.tasks.map((task: any) => (
              <div key={task.id} className={cn("stat-card border-l-4 flex items-center gap-4", g.color)}>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="font-medium text-slate-900">{task.title}</h4>
                    <span className={`badge ${statusColor(task.priority)}`}>{task.priority}</span>
                    {task.qualityCheck === "passed" && <span className="badge bg-emerald-100 text-emerald-700 flex items-center gap-1"><Shield size={10} /> QC Passed</span>}
                    {!task.orderConfirmed && task.status !== "completed" && <span className="badge bg-amber-100 text-amber-700">Order Not Confirmed</span>}
                  </div>
                  <p className="text-xs text-slate-500">{task.description}</p>
                  <div className="flex items-center gap-4 mt-1.5 text-xs text-slate-400">
                    <span>{task.category}</span>
                    {task.scheduledDate && <span>Scheduled: {formatDate(task.scheduledDate)}</span>}
                    {task.completedDate && <span>Completed: {formatDate(task.completedDate)}</span>}
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-semibold text-slate-900">{formatCurrency(task.estimatedCost)}</p>
                  {task.actualCost > 0 && <p className="text-xs text-slate-400">Actual: {formatCurrency(task.actualCost)}</p>}
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

function ExpensesTab({ expenses }: { expenses: any[] }) {
  const total = expenses.reduce((s, e) => s + e.total, 0);
  return (
    <div>
      <div className="flex justify-between items-center mb-4"><h3 className="text-sm font-semibold text-slate-700">All Expenses</h3><p className="text-sm font-semibold">Total: {formatCurrency(total)}</p></div>
      <div className="stat-card p-0 overflow-hidden">
        <table className="w-full text-sm">
          <thead><tr className="bg-slate-50 border-b border-slate-200"><th className="text-left py-3 px-4 font-medium text-slate-500">Item</th><th className="text-left py-3 px-4 font-medium text-slate-500">Category</th><th className="text-left py-3 px-4 font-medium text-slate-500">Vendor</th><th className="text-right py-3 px-4 font-medium text-slate-500">Unit</th><th className="text-right py-3 px-4 font-medium text-slate-500">Qty</th><th className="text-right py-3 px-4 font-medium text-slate-500">Total</th></tr></thead>
          <tbody>{expenses.map((e) => (
            <tr key={e.id} className="border-b border-slate-100"><td className="py-3 px-4 font-medium text-slate-800">{e.description}</td><td className="py-3 px-4 text-slate-500">{e.category}</td><td className="py-3 px-4 text-slate-500">{e.vendor}</td><td className="py-3 px-4 text-right">{formatCurrency(e.unitPrice)}</td><td className="py-3 px-4 text-right">{e.quantity}</td><td className="py-3 px-4 text-right font-semibold">{formatCurrency(e.total)}</td></tr>
          ))}</tbody>
        </table>
      </div>
    </div>
  );
}

function PhotosTab({ photos, projectId, store }: { photos: any[]; projectId: string; store: any }) {
  const [viewingFile, setViewingFile] = useState<string | null>(null);
  const [captionInput, setCaptionInput] = useState("");
  const [showCaptionModal, setShowCaptionModal] = useState(false);
  const [pendingFiles, setPendingFiles] = useState<File[]>([]);

  const detectFileType = (item: any): "pdf" | "xlsx" | "image" => {
    const url = (item.url || "").toLowerCase();
    const caption = (item.caption || "").toLowerCase();
    if (url.startsWith("data:application/pdf") || caption.endsWith(".pdf")) return "pdf";
    if (
      url.startsWith("data:application/vnd.openxmlformats-officedocument.spreadsheetml") ||
      url.startsWith("data:application/vnd.ms-excel") ||
      caption.endsWith(".xlsx") ||
      caption.endsWith(".xls")
    ) return "xlsx";
    return "image";
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    setPendingFiles(Array.from(files));
    setCaptionInput("");
    setShowCaptionModal(true);
    e.target.value = "";
  };

  const handleUpload = () => {
    pendingFiles.forEach((file) => {
      const reader = new FileReader();
      reader.onload = (ev) => {
        const base64 = ev.target?.result as string;
        const newPhoto = {
          id: `photo_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
          url: base64,
          caption: captionInput || file.name,
          uploadedAt: new Date().toISOString(),
          uploadedBy: "current_user",
        };
        store.updateProject(projectId, { photos: [...(store.getProject(projectId)?.photos || []), newPhoto] });
      };
      reader.readAsDataURL(file);
    });
    setShowCaptionModal(false);
    setPendingFiles([]);
    setCaptionInput("");
  };

  const handleDelete = (fileId: string) => {
    const updated = photos.filter((p) => p.id !== fileId);
    store.updateProject(projectId, { photos: updated });
    setViewingFile(null);
  };

  const handleFileClick = (item: any) => {
    const fileType = detectFileType(item);
    if (fileType === "xlsx") {
      const link = document.createElement("a");
      link.href = item.url;
      link.download = item.caption || "spreadsheet.xlsx";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      return;
    }
    if (fileType === "pdf") {
      setViewingFile(item.id);
      return;
    }
    setViewingFile(item.id);
  };

  const handleDownloadXlsx = (item: any) => {
    const link = document.createElement("a");
    link.href = item.url;
    link.download = item.caption || "spreadsheet.xlsx";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const viewingItem = photos.find((p) => p.id === viewingFile);
  const viewingType = viewingItem ? detectFileType(viewingItem) : null;

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-sm font-semibold text-slate-700">Project Files & Photos</h3>
        <label className="flex items-center gap-2 px-3 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700 cursor-pointer">
          <Upload size={14} /> Upload Files
          <input type="file" accept="image/*,.pdf,.xlsx,.xls,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" multiple className="hidden" onChange={handleFileSelect} />
        </label>
      </div>

      {showCaptionModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={() => setShowCaptionModal(false)}>
          <div className="bg-white rounded-xl p-6 w-full max-w-md mx-4 shadow-2xl" onClick={(e) => e.stopPropagation()}>
            <h4 className="text-lg font-semibold text-slate-900 mb-2">Upload {pendingFiles.length} File{pendingFiles.length > 1 ? "s" : ""}</h4>
            <p className="text-sm text-slate-500 mb-4">Add an optional caption for {pendingFiles.length > 1 ? "these files" : "this file"}.</p>
            <input
              type="text"
              placeholder="Caption (optional)"
              value={captionInput}
              onChange={(e) => setCaptionInput(e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
              autoFocus
              onKeyDown={(e) => e.key === "Enter" && handleUpload()}
            />
            <div className="flex gap-2 justify-end">
              <button onClick={() => setShowCaptionModal(false)} className="px-4 py-2 text-sm text-slate-600 hover:bg-slate-100 rounded-lg">Cancel</button>
              <button onClick={handleUpload} className="px-4 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700">Upload</button>
            </div>
          </div>
        </div>
      )}

      {viewingFile && viewingItem && (
        <div className="fixed inset-0 bg-black/90 flex items-center justify-center z-50" onClick={() => setViewingFile(null)}>
          <button onClick={() => setViewingFile(null)} className="absolute top-4 right-4 text-white hover:text-slate-300 z-10"><X size={28} /></button>
          <button onClick={() => handleDelete(viewingFile)} className="absolute top-4 left-4 text-red-400 hover:text-red-300 flex items-center gap-1 text-sm z-10"><Trash2 size={16} /> Delete</button>
          {viewingType === "image" && (
            <img src={viewingItem.url} alt="" className="max-w-[90vw] max-h-[85vh] object-contain rounded-lg" onClick={(e) => e.stopPropagation()} />
          )}
          {viewingType === "pdf" && (
            <div className="w-[90vw] h-[85vh] flex flex-col items-center" onClick={(e) => e.stopPropagation()}>
              <iframe src={viewingItem.url} className="w-full h-full rounded-lg bg-white" title={viewingItem.caption} />
              <button
                onClick={() => window.open(viewingItem.url, "_blank")}
                className="mt-3 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700 flex items-center gap-2"
              >
                <ExternalLink size={14} /> Open in New Tab
              </button>
            </div>
          )}
          {viewingType === "xlsx" && (
            <div className="flex flex-col items-center gap-4" onClick={(e) => e.stopPropagation()}>
              <FileText size={64} className="text-green-400" />
              <p className="text-white text-lg font-medium">{viewingItem.caption}</p>
              <button
                onClick={() => handleDownloadXlsx(viewingItem)}
                className="px-4 py-2 bg-green-600 text-white rounded-lg text-sm hover:bg-green-700 flex items-center gap-2"
              >
                <Upload size={14} className="rotate-180" /> Download Spreadsheet
              </button>
            </div>
          )}
          <p className="absolute bottom-6 text-white text-sm bg-black/60 px-4 py-2 rounded-lg">{viewingItem.caption}</p>
        </div>
      )}

      {photos.length > 0 ? (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {photos.map((p) => {
            const fileType = detectFileType(p);
            return (
              <div key={p.id} className="stat-card p-3 cursor-pointer hover:shadow-md transition relative" onClick={() => handleFileClick(p)}>
                <div className="absolute top-2 right-2 z-10">
                  <span className={cn(
                    "text-[10px] font-bold uppercase px-1.5 py-0.5 rounded",
                    fileType === "pdf" ? "bg-red-100 text-red-700" :
                    fileType === "xlsx" ? "bg-green-100 text-green-700" :
                    "bg-blue-100 text-blue-700"
                  )}>
                    {fileType === "pdf" ? "PDF" : fileType === "xlsx" ? "XLSX" : "IMG"}
                  </span>
                </div>
                <div className="aspect-[4/3] bg-slate-100 rounded-lg overflow-hidden mb-2 flex items-center justify-center">
                  {fileType === "image" && (
                    <img src={p.url} alt={p.caption} className="w-full h-full object-cover" />
                  )}
                  {fileType === "pdf" && (
                    <div className="flex flex-col items-center gap-2">
                      <FileText size={40} className="text-red-400" />
                      <span className="text-xs text-slate-500 font-medium">PDF Document</span>
                    </div>
                  )}
                  {fileType === "xlsx" && (
                    <div className="flex flex-col items-center gap-2">
                      <FileText size={40} className="text-green-500" />
                      <span className="text-xs text-slate-500 font-medium">Spreadsheet</span>
                    </div>
                  )}
                </div>
                <div className="flex items-center gap-1.5">
                  {fileType === "image" && <Camera size={12} className="text-blue-500 flex-shrink-0" />}
                  {fileType === "pdf" && <FileText size={12} className="text-red-500 flex-shrink-0" />}
                  {fileType === "xlsx" && <FileText size={12} className="text-green-500 flex-shrink-0" />}
                  <p className="text-sm font-medium text-slate-800 truncate">{p.caption}</p>
                </div>
                <p className="text-xs text-slate-400">{formatDate(p.uploadedAt)}</p>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="stat-card flex flex-col items-center py-12">
          <Camera size={48} className="text-slate-300 mb-3" />
          <p className="text-sm text-slate-400">No files yet</p>
          <p className="text-xs text-slate-300 mt-1">Click &ldquo;Upload Files&rdquo; to add project images, SOW sheets, and documents</p>
        </div>
      )}
    </div>
  );
}

function RendersTab({ renders }: { renders: any[] }) {
  return (
    <div>
      <h3 className="text-sm font-semibold text-slate-700 mb-4">3D Walkthrough Renders</h3>
      {renders.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">{renders.map((r) => (
          <div key={r.id} className="stat-card"><div className="aspect-video bg-gradient-to-br from-blue-100 to-violet-100 rounded-lg flex items-center justify-center mb-3"><Box size={40} className="text-blue-400" /></div><h4 className="font-semibold text-slate-900">{r.label}</h4><p className="text-xs text-slate-400 mb-3">Captured {formatDate(r.capturedAt)}</p><a href={r.url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-sm text-blue-600 hover:text-blue-700 font-medium"><ExternalLink size={14} /> View 3D Walkthrough</a></div>
        ))}</div>
      ) : (<div className="stat-card flex flex-col items-center py-12"><Box size={48} className="text-slate-300 mb-3" /><p className="text-sm text-slate-400">No 3D renders yet</p></div>)}
    </div>
  );
}

function CommsTab({ comms, store }: { comms: any[]; store: any }) {
  return (
    <div className="space-y-2">
      <div className="flex justify-between items-center mb-4"><h3 className="text-sm font-semibold text-slate-700">Communications</h3><Link href="/communications" className="text-sm text-blue-600">View All</Link></div>
      {comms.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()).map((comm) => {
        const contractor = store.getContractor(comm.contractorId);
        return (
          <div key={comm.id} className={cn("stat-card flex items-start gap-3 py-3", !comm.read && "ring-1 ring-blue-200")}>
            <div className={cn("w-7 h-7 rounded-full flex items-center justify-center text-white text-xs",
              comm.type === "call" ? "bg-emerald-500" : comm.type === "sms" ? "bg-blue-500" : "bg-violet-500"
            )}>{comm.type === "call" ? <Phone size={12} /> : <MessageSquare size={12} />}</div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-slate-900">{contractor?.name}</span>
                <span className="text-xs text-slate-400 capitalize">{comm.type} &middot; {comm.direction}</span>
                {comm.callStatus === "missed" && <span className="badge bg-red-100 text-red-700 text-[10px]">Missed</span>}
              </div>
              <p className="text-sm text-slate-600 mt-0.5 truncate">{comm.content}</p>
              <p className="text-xs text-slate-400 mt-0.5">{formatRelativeTime(comm.timestamp)}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
}

function InvoicesTab({ invoices, store, projectId }: { invoices: any[]; store: any; projectId: string }) {
  return (
    <div>
      <div className="flex justify-between items-center mb-4"><h3 className="text-sm font-semibold text-slate-700">Invoices</h3><Link href={`/invoices/create?project=${projectId}`} className="flex items-center gap-2 px-3 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700"><FileText size={14} /> Write Invoice</Link></div>
      <div className="space-y-3">{invoices.map((inv) => {
        const contractor = store.getContractor(inv.contractorId);
        return (
          <div key={inv.id} className="stat-card">
            <div className="flex items-center justify-between mb-2"><div><h4 className="font-medium text-slate-900">{contractor?.name}</h4><p className="text-xs text-slate-400">Created {formatDate(inv.createdAt)}</p></div><span className={`badge ${statusColor(inv.status)}`}>{inv.status}</span></div>
            {inv.lineItems.map((li: any) => (<div key={li.id} className="flex justify-between text-sm py-1 border-b border-slate-100"><span className="text-slate-700">{li.description}</span><span className="font-medium">{formatCurrency(li.total)}</span></div>))}
            <div className="grid grid-cols-3 gap-3 mt-3">
              <div className={cn("text-center p-2 rounded-lg text-xs", inv.depositPaid ? "bg-emerald-50 text-emerald-700" : "bg-slate-50 text-slate-400")}>25% Deposit: {inv.depositPaid ? "Paid" : "Pending"}</div>
              <div className={cn("text-center p-2 rounded-lg text-xs", inv.midpointPaid ? "bg-emerald-50 text-emerald-700" : "bg-slate-50 text-slate-400")}>25% Mid: {inv.midpointPaid ? "Paid" : "Pending"}</div>
              <div className={cn("text-center p-2 rounded-lg text-xs", inv.completionPaid ? "bg-emerald-50 text-emerald-700" : "bg-slate-50 text-slate-400")}>50% Final: {inv.completionPaid ? "Paid" : "Pending"}</div>
            </div>
          </div>
        );
      })}</div>
    </div>
  );
}

function ThisWeekSection({ projectId }: { projectId: string }) {
  const store = useStore();
  const todos = store.getProjectWeeklyTodos(projectId);
  const [newText, setNewText] = useState("");
  const [adding, setAdding] = useState(false);

  const handleAdd = () => {
    if (!newText.trim()) return;
    store.addWeeklyTodo({
      id: `todo-${Date.now()}`,
      projectId,
      text: newText.trim(),
      hiddenFromDashboard: false,
      createdAt: new Date().toISOString(),
    });
    setNewText("");
    setAdding(false);
  };

  const toggleDashboardVisibility = (id: string, currentlyHidden: boolean) => {
    store.updateWeeklyTodo(id, { hiddenFromDashboard: !currentlyHidden });
  };

  const visible = todos.filter((t) => !t.hiddenFromDashboard);
  const hidden = todos.filter((t) => t.hiddenFromDashboard);

  return (
    <div className="stat-card">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-semibold text-slate-700 flex items-center gap-2">
          <ListChecks size={16} className="text-blue-600" /> This Week
          <span className="text-xs text-slate-400 font-normal">&middot; synced to dashboard</span>
        </h3>
        <button onClick={() => setAdding(true)} className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 text-white rounded-lg text-xs font-medium hover:bg-blue-700 transition">
          <Plus size={12} /> Add Item
        </button>
      </div>

      {adding && (
        <div className="mb-3 flex gap-2">
          <input type="text" value={newText} onChange={(e) => setNewText(e.target.value)}
            onKeyDown={(e) => { if (e.key === "Enter") handleAdd(); if (e.key === "Escape") { setAdding(false); setNewText(""); } }}
            placeholder="What needs to happen this week?" autoFocus
            className="flex-1 border border-slate-300 rounded-lg px-3 py-2 text-sm" />
          <button onClick={handleAdd} className="px-3 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700">Add</button>
          <button onClick={() => { setAdding(false); setNewText(""); }} className="px-3 py-2 text-slate-500 hover:bg-slate-100 rounded-lg text-sm">Cancel</button>
        </div>
      )}

      {todos.length === 0 && !adding && (
        <p className="text-sm text-slate-400 py-3">No items yet. Click &quot;Add Item&quot; to create one.</p>
      )}

      {visible.length > 0 && (
        <div className="space-y-1.5">
          {visible.map((todo) => (
            <div key={todo.id} className="flex items-center gap-2 p-2 rounded-lg hover:bg-slate-50 group">
              <Eye size={14} className="text-blue-500 flex-shrink-0" />
              <span className="text-sm text-slate-700 flex-1">{todo.text}</span>
              <button onClick={() => toggleDashboardVisibility(todo.id, false)}
                className="text-xs text-slate-400 hover:text-amber-600 opacity-0 group-hover:opacity-100 transition">Hide from dashboard</button>
              <button onClick={() => store.deleteWeeklyTodo(todo.id)}
                className="p-1 rounded hover:bg-red-50 text-slate-400 hover:text-red-600 opacity-0 group-hover:opacity-100 transition"><Trash2 size={12} /></button>
            </div>
          ))}
        </div>
      )}

      {hidden.length > 0 && (
        <div className="mt-3 pt-3 border-t border-slate-100">
          <p className="text-xs text-slate-400 mb-2">Hidden from dashboard ({hidden.length})</p>
          <div className="space-y-1.5">
            {hidden.map((todo) => (
              <div key={todo.id} className="flex items-center gap-2 p-2 rounded-lg hover:bg-slate-50 group opacity-70">
                <EyeOff size={14} className="text-slate-400 flex-shrink-0" />
                <span className="text-sm text-slate-600 line-through flex-1">{todo.text}</span>
                <button onClick={() => toggleDashboardVisibility(todo.id, true)}
                  className="text-xs text-slate-400 hover:text-blue-600 opacity-0 group-hover:opacity-100 transition">Show on dashboard</button>
                <button onClick={() => store.deleteWeeklyTodo(todo.id)}
                  className="p-1 rounded hover:bg-red-50 text-slate-400 hover:text-red-600 opacity-0 group-hover:opacity-100 transition"><Trash2 size={12} /></button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
