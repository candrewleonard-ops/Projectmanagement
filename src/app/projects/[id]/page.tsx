"use client";

import { useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import {
  ArrowLeft, MapPin, DollarSign, Calendar, Users, CheckCircle2,
  Clock, AlertTriangle, Camera, Box, MessageSquare, Phone,
  FileText, ExternalLink, Upload, ChevronDown, Ban, Shield,
} from "lucide-react";
import {
  getProject, getProjectTasks, getProjectExpenses, getProjectComms,
  getProjectInvoices, contractors as allContractors,
} from "@/lib/mock-data";
import { formatCurrency, formatDate, statusColor, cn, progressPercent, formatRelativeTime } from "@/lib/utils";

type Tab = "tasks" | "expenses" | "photos" | "renders" | "contractors" | "comms" | "invoices";

export default function ProjectDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [activeTab, setActiveTab] = useState<Tab>("tasks");
  const project = getProject(id);

  if (!project) {
    return (
      <div className="flex items-center justify-center h-96">
        <p className="text-slate-400">Project not found.</p>
      </div>
    );
  }

  const projectTasks = getProjectTasks(project.id);
  const projectExpenses = getProjectExpenses(project.id);
  const projectComms = getProjectComms(project.id);
  const projectInvoices = getProjectInvoices(project.id);
  const projectContractors = allContractors.filter((c) => project.contractorIds.includes(c.id));
  const progress = progressPercent(project.totalSpent, project.totalBudget);

  const completedTasks = projectTasks.filter((t) => t.status === "completed");
  const inProgressTasks = projectTasks.filter((t) => t.status === "in_progress");
  const scheduledTasks = projectTasks.filter((t) => t.status === "scheduled");
  const blockedTasks = projectTasks.filter((t) => t.status === "blocked");
  const qualityPassed = projectTasks.filter((t) => t.qualityCheck === "passed");

  const tabs: { key: Tab; label: string; count?: number }[] = [
    { key: "tasks", label: "Tasks & Work Orders", count: projectTasks.length },
    { key: "expenses", label: "Expenses", count: projectExpenses.length },
    { key: "photos", label: "Photos", count: project.photos.length },
    { key: "renders", label: "3D Renders", count: project.renders.length },
    { key: "contractors", label: "Contractors", count: projectContractors.length },
    { key: "comms", label: "Communications", count: projectComms.length },
    { key: "invoices", label: "Invoices", count: projectInvoices.length },
  ];

  return (
    <div className="space-y-6 fade-in">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <Link href="/projects" className="text-sm text-blue-600 hover:text-blue-700 flex items-center gap-1 mb-2">
            <ArrowLeft size={14} /> Back to Projects
          </Link>
          <h1 className="text-2xl font-bold text-slate-900">{project.name}</h1>
          <p className="text-sm text-slate-500 flex items-center gap-1.5 mt-1">
            <MapPin size={13} /> {project.address.street}, {project.address.city}, {project.address.state} {project.address.zip}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <span className={`badge text-sm ${statusColor(project.status)}`}>{project.status.replace("_", " ")}</span>
          <Link href={`/communications?project=${project.id}`} className="flex items-center gap-2 px-3 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition">
            <MessageSquare size={14} /> Messages & Calls
          </Link>
        </div>
      </div>

      {/* Financial Overview Cards */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <MiniStat icon={<DollarSign size={16} />} label="Purchase Price" value={formatCurrency(project.purchasePrice)} />
        <MiniStat icon={<DollarSign size={16} />} label="Est. ARV" value={formatCurrency(project.estimatedARV)} accent="emerald" />
        <MiniStat icon={<DollarSign size={16} />} label="Total Budget" value={formatCurrency(project.totalBudget)} />
        <MiniStat icon={<DollarSign size={16} />} label="Total Spent" value={formatCurrency(project.totalSpent)} accent={progress > 90 ? "red" : "blue"} />
        <div className="stat-card">
          <p className="text-xs text-slate-400 mb-1">Potential Profit</p>
          <p className="text-lg font-bold text-emerald-700">
            {formatCurrency(project.estimatedARV - project.purchasePrice - project.totalBudget)}
          </p>
          <p className="text-[10px] text-slate-400">ARV − Purchase − Budget</p>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="stat-card">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-slate-700">Budget Progress</span>
          <span className="text-sm font-semibold">{progress}%</span>
        </div>
        <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden">
          <div className={cn("h-full rounded-full transition-all", progress > 90 ? "bg-red-500" : progress > 70 ? "bg-amber-500" : "bg-blue-500")} style={{ width: `${progress}%` }}></div>
        </div>
        <div className="flex justify-between mt-2 text-xs text-slate-400">
          <span>Started {formatDate(project.startDate)}</span>
          <span>Est. Complete {formatDate(project.estimatedEndDate)}</span>
        </div>
      </div>

      {/* Quick Stats Row */}
      <div className="flex items-center gap-6 text-sm">
        <span className="flex items-center gap-1.5 text-emerald-600"><CheckCircle2 size={14} /> {qualityPassed.length} Quality Verified</span>
        <span className="flex items-center gap-1.5 text-sky-600"><Clock size={14} /> {inProgressTasks.length} In Progress</span>
        <span className="flex items-center gap-1.5 text-violet-600"><Calendar size={14} /> {scheduledTasks.length} Scheduled</span>
        <span className="flex items-center gap-1.5 text-red-600"><AlertTriangle size={14} /> {blockedTasks.length} Blocked</span>
        <span className="flex items-center gap-1.5 text-slate-600"><Users size={14} /> {projectContractors.length} Contractors</span>
      </div>

      {/* Tabs */}
      <div className="border-b border-slate-200">
        <div className="flex gap-1 -mb-px overflow-x-auto">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={cn(
                "px-4 py-2.5 text-sm font-medium border-b-2 transition whitespace-nowrap",
                activeTab === tab.key
                  ? "border-blue-600 text-blue-600"
                  : "border-transparent text-slate-500 hover:text-slate-700"
              )}
            >
              {tab.label}
              {tab.count !== undefined && (
                <span className="ml-1.5 text-xs bg-slate-100 text-slate-500 px-1.5 py-0.5 rounded-full">{tab.count}</span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Tab Content */}
      <div className="fade-in">
        {activeTab === "tasks" && <TasksTab tasks={projectTasks} />}
        {activeTab === "expenses" && <ExpensesTab expenses={projectExpenses} />}
        {activeTab === "photos" && <PhotosTab photos={project.photos} />}
        {activeTab === "renders" && <RendersTab renders={project.renders} />}
        {activeTab === "contractors" && <ContractorsTab contractors={projectContractors} projectId={project.id} />}
        {activeTab === "comms" && <CommsTab comms={projectComms} />}
        {activeTab === "invoices" && <InvoicesTab invoices={projectInvoices} />}
      </div>
    </div>
  );
}

function MiniStat({ icon, label, value, accent }: { icon: React.ReactNode; label: string; value: string; accent?: string }) {
  const accentColor = accent === "emerald" ? "text-emerald-700" : accent === "red" ? "text-red-700" : accent === "blue" ? "text-blue-700" : "text-slate-900";
  return (
    <div className="stat-card">
      <p className="text-xs text-slate-400 mb-1">{label}</p>
      <p className={cn("text-lg font-bold", accentColor)}>{value}</p>
    </div>
  );
}

function TasksTab({ tasks: projectTasks }: { tasks: ReturnType<typeof getProjectTasks> }) {
  const groups = [
    { label: "Blocked", tasks: projectTasks.filter((t) => t.status === "blocked"), color: "border-l-red-500" },
    { label: "In Progress", tasks: projectTasks.filter((t) => t.status === "in_progress"), color: "border-l-sky-500" },
    { label: "Scheduled (Upcoming)", tasks: projectTasks.filter((t) => t.status === "scheduled"), color: "border-l-violet-500" },
    { label: "Completed & Verified", tasks: projectTasks.filter((t) => t.status === "completed"), color: "border-l-emerald-500" },
  ];

  return (
    <div className="space-y-6">
      {groups.map((group) => (
        group.tasks.length > 0 && (
          <div key={group.label}>
            <h3 className="text-sm font-semibold text-slate-700 mb-3">{group.label} ({group.tasks.length})</h3>
            <div className="space-y-2">
              {group.tasks.map((task) => (
                <div key={task.id} className={cn("stat-card border-l-4 flex items-center gap-4", group.color)}>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-medium text-slate-900">{task.title}</h4>
                      <span className={`badge ${statusColor(task.priority)}`}>{task.priority}</span>
                      {task.qualityCheck === "passed" && (
                        <span className="badge bg-emerald-100 text-emerald-700 flex items-center gap-1"><Shield size={10} /> QC Passed</span>
                      )}
                      {!task.orderConfirmed && task.status !== "completed" && (
                        <span className="badge bg-amber-100 text-amber-700">Order Not Confirmed</span>
                      )}
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
        )
      ))}
    </div>
  );
}

function ExpensesTab({ expenses }: { expenses: ReturnType<typeof getProjectExpenses> }) {
  const total = expenses.reduce((s, e) => s + e.total, 0);
  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-sm font-semibold text-slate-700">All Expenses</h3>
        <p className="text-sm font-semibold">Total: {formatCurrency(total)}</p>
      </div>
      <div className="stat-card p-0 overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-200">
              <th className="text-left py-3 px-4 font-medium text-slate-500">Item</th>
              <th className="text-left py-3 px-4 font-medium text-slate-500">Category</th>
              <th className="text-left py-3 px-4 font-medium text-slate-500">Vendor</th>
              <th className="text-right py-3 px-4 font-medium text-slate-500">Unit Price</th>
              <th className="text-right py-3 px-4 font-medium text-slate-500">Qty</th>
              <th className="text-right py-3 px-4 font-medium text-slate-500">Total</th>
              <th className="text-left py-3 px-4 font-medium text-slate-500">Date</th>
            </tr>
          </thead>
          <tbody>
            {expenses.map((exp) => (
              <tr key={exp.id} className="border-b border-slate-100">
                <td className="py-3 px-4 font-medium text-slate-800">{exp.description}</td>
                <td className="py-3 px-4 text-slate-500">{exp.category}</td>
                <td className="py-3 px-4 text-slate-500">{exp.vendor}</td>
                <td className="py-3 px-4 text-right text-slate-700">{formatCurrency(exp.unitPrice)}</td>
                <td className="py-3 px-4 text-right text-slate-700">{exp.quantity}</td>
                <td className="py-3 px-4 text-right font-semibold text-slate-900">{formatCurrency(exp.total)}</td>
                <td className="py-3 px-4 text-slate-400">{formatDate(exp.purchasedDate)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function PhotosTab({ photos }: { photos: { id: string; url: string; caption: string; uploadedAt: string }[] }) {
  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-sm font-semibold text-slate-700">Project Photos</h3>
        <button className="flex items-center gap-2 px-3 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700 transition">
          <Upload size={14} /> Upload Photos
        </button>
      </div>
      {photos.length > 0 ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {photos.map((photo) => (
            <div key={photo.id} className="stat-card p-3 group cursor-pointer">
              <div className="aspect-[4/3] bg-slate-200 rounded-lg flex items-center justify-center mb-2">
                <Camera size={32} className="text-slate-400" />
              </div>
              <p className="text-sm font-medium text-slate-800">{photo.caption}</p>
              <p className="text-xs text-slate-400">{formatDate(photo.uploadedAt)}</p>
            </div>
          ))}
        </div>
      ) : (
        <div className="stat-card flex flex-col items-center justify-center py-12">
          <Camera size={48} className="text-slate-300 mb-3" />
          <p className="text-sm text-slate-400">No photos uploaded yet</p>
          <button className="mt-3 text-sm text-blue-600 hover:text-blue-700 font-medium">Upload your first photo</button>
        </div>
      )}
    </div>
  );
}

function RendersTab({ renders }: { renders: { id: string; label: string; url: string; capturedAt: string }[] }) {
  return (
    <div>
      <h3 className="text-sm font-semibold text-slate-700 mb-4">3D Walkthrough Renders</h3>
      {renders.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {renders.map((render) => (
            <div key={render.id} className="stat-card group">
              <div className="aspect-video bg-gradient-to-br from-blue-100 to-violet-100 rounded-lg flex items-center justify-center mb-3">
                <Box size={40} className="text-blue-400" />
              </div>
              <h4 className="font-semibold text-slate-900">{render.label}</h4>
              <p className="text-xs text-slate-400 mb-3">Captured {formatDate(render.capturedAt)}</p>
              <a
                href={render.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-sm text-blue-600 hover:text-blue-700 font-medium"
              >
                <ExternalLink size={14} /> View 3D Walkthrough
              </a>
            </div>
          ))}
        </div>
      ) : (
        <div className="stat-card flex flex-col items-center justify-center py-12">
          <Box size={48} className="text-slate-300 mb-3" />
          <p className="text-sm text-slate-400">No 3D renders available yet</p>
        </div>
      )}
    </div>
  );
}

function ContractorsTab({ contractors, projectId }: { contractors: typeof allContractors; projectId: string }) {
  return (
    <div>
      <h3 className="text-sm font-semibold text-slate-700 mb-4">Assigned Contractors</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {contractors.map((c) => (
          <Link key={c.id} href={`/contractors/${c.id}`} className="stat-card group cursor-pointer">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-bold text-sm">
                {c.name.split(" ").map((n) => n[0]).join("")}
              </div>
              <div className="flex-1">
                <h4 className="font-semibold text-slate-900 group-hover:text-blue-600 transition">{c.name}</h4>
                <p className="text-xs text-slate-400">{c.company}</p>
                <div className="flex items-center gap-2 mt-1.5">
                  {c.specialty.slice(0, 3).map((s) => (
                    <span key={s} className="badge bg-slate-100 text-slate-600">{s}</span>
                  ))}
                </div>
              </div>
              <div className="flex items-center gap-1 text-amber-500 text-sm">
                {"★".repeat(Math.round(c.rating))}
                <span className="text-xs text-slate-400 ml-1">{c.rating}</span>
              </div>
            </div>
            <div className="flex gap-2 mt-3">
              <Link href={`/communications?contractor=${c.id}`} className="flex-1 flex items-center justify-center gap-1.5 py-2 bg-blue-50 text-blue-600 rounded-lg text-xs font-medium hover:bg-blue-100 transition" onClick={(e) => e.stopPropagation()}>
                <MessageSquare size={12} /> Message
              </Link>
              <Link href={`/communications?contractor=${c.id}`} className="flex-1 flex items-center justify-center gap-1.5 py-2 bg-emerald-50 text-emerald-600 rounded-lg text-xs font-medium hover:bg-emerald-100 transition" onClick={(e) => e.stopPropagation()}>
                <Phone size={12} /> Call
              </Link>
              <Link href={`/invoices/create?contractor=${c.id}&project=${projectId}`} className="flex-1 flex items-center justify-center gap-1.5 py-2 bg-violet-50 text-violet-600 rounded-lg text-xs font-medium hover:bg-violet-100 transition" onClick={(e) => e.stopPropagation()}>
                <FileText size={12} /> Invoice
              </Link>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

function CommsTab({ comms }: { comms: ReturnType<typeof getProjectComms> }) {
  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-sm font-semibold text-slate-700">Recent Communications</h3>
        <Link href="/communications" className="text-sm text-blue-600 hover:text-blue-700 font-medium">View All</Link>
      </div>
      <div className="space-y-2">
        {comms.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()).map((comm) => {
          const contractor = allContractors.find((c) => c.id === comm.contractorId);
          return (
            <div key={comm.id} className={cn("stat-card flex items-start gap-3", !comm.read && "ring-2 ring-blue-200")}>
              <div className={cn("w-8 h-8 rounded-full flex items-center justify-center text-white text-xs",
                comm.type === "call" ? "bg-emerald-500" : comm.type === "sms" ? "bg-blue-500" : comm.type === "email" ? "bg-violet-500" : "bg-slate-500"
              )}>
                {comm.type === "call" ? <Phone size={14} /> : comm.type === "sms" ? <MessageSquare size={14} /> : <FileText size={14} />}
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <Link href={`/contractors/${comm.contractorId}`} className="text-sm font-medium text-slate-900 hover:text-blue-600">{contractor?.name}</Link>
                  <span className="text-xs text-slate-400">{comm.direction === "inbound" ? "→ You" : "← You"}</span>
                  {comm.callStatus === "missed" && <span className="badge bg-red-100 text-red-700">Missed</span>}
                  {comm.callStatus === "scheduled" && <span className="badge bg-violet-100 text-violet-700">Scheduled</span>}
                </div>
                <p className="text-sm text-slate-600 mt-0.5">{comm.content}</p>
                <p className="text-xs text-slate-400 mt-1">{formatRelativeTime(comm.timestamp)}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function InvoicesTab({ invoices }: { invoices: ReturnType<typeof getProjectInvoices> }) {
  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-sm font-semibold text-slate-700">Invoices</h3>
        <Link href="/invoices/create" className="flex items-center gap-2 px-3 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700 transition">
          <FileText size={14} /> Write Invoice
        </Link>
      </div>
      <div className="space-y-3">
        {invoices.map((inv) => {
          const contractor = allContractors.find((c) => c.id === inv.contractorId);
          return (
            <div key={inv.id} className="stat-card">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <h4 className="font-medium text-slate-900">{contractor?.name} — {contractor?.company}</h4>
                  <p className="text-xs text-slate-400">Created {formatDate(inv.createdAt)}</p>
                </div>
                <span className={`badge ${statusColor(inv.status)}`}>{inv.status}</span>
              </div>
              {inv.lineItems.map((li) => (
                <div key={li.id} className="flex justify-between text-sm py-1 border-b border-slate-100">
                  <span className="text-slate-700">{li.description}</span>
                  <span className="font-medium">{formatCurrency(li.total)}</span>
                </div>
              ))}
              <div className="grid grid-cols-3 gap-3 mt-3">
                <PaymentStep label="25% Deposit" amount={inv.depositAmount} paid={inv.depositPaid} />
                <PaymentStep label="25% Midpoint" amount={inv.midpointAmount} paid={inv.midpointPaid} />
                <PaymentStep label="50% Final" amount={inv.completionAmount} paid={inv.completionPaid} />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function PaymentStep({ label, amount, paid }: { label: string; amount: number; paid: boolean }) {
  return (
    <div className={cn("text-center p-2 rounded-lg", paid ? "bg-emerald-50" : "bg-slate-50")}>
      <p className="text-xs text-slate-400">{label}</p>
      <p className="text-sm font-semibold">{formatCurrency(amount)}</p>
      <p className={cn("text-xs font-medium mt-0.5", paid ? "text-emerald-600" : "text-slate-400")}>{paid ? "Paid" : "Pending"}</p>
    </div>
  );
}
