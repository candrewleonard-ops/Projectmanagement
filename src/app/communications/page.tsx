"use client";

import React, { Suspense, useState, useMemo } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import {
  Phone, MessageSquare, Mail, StickyNote, Send, PhoneCall,
  PhoneMissed, Calendar, Clock, Search, X, ChevronRight,
  Plus, AlertTriangle, Ban, CheckSquare, Square, Users,
  Filter, UserPlus, FolderKanban,
} from "lucide-react";
import { useStore } from "@/lib/store";
import { formatRelativeTime, formatDate, cn } from "@/lib/utils";
import { Communication, Contractor } from "@/lib/types";

const SPECIALTIES = [
  "Flooring", "Drywall", "Roofing", "Plumbing", "Electrical",
  "HVAC", "Painting", "General", "Kitchen", "Bathroom",
  "Demolition", "Framing", "Exterior",
];

export default function CommunicationsPage() {
  return <Suspense><HotTasksCommsContent /></Suspense>;
}

function HotTasksCommsContent() {
  const searchParams = useSearchParams();
  const store = useStore();

  const [contactSearch, setContactSearch] = useState("");
  const [activeFilters, setActiveFilters] = useState<string[]>([]);
  const [selectedContractors, setSelectedContractors] = useState<string[]>([]);
  const [showAddToProject, setShowAddToProject] = useState(false);
  const [openContactId, setOpenContactId] = useState<string | null>(null);
  const [messageText, setMessageText] = useState("");
  const [scheduleDate, setScheduleDate] = useState("");
  const [scheduleTime, setScheduleTime] = useState("");
  const [showSchedule, setShowSchedule] = useState(false);
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null);
  const [showAssignModal, setShowAssignModal] = useState(false);

  const selectedProject = selectedProjectId ? store.getProject(selectedProjectId) : null;
  const projectContractors = useMemo(() => {
    if (!selectedProject) return [];
    return selectedProject.contractorIds
      .map((cid) => store.getContractor(cid))
      .filter(Boolean) as Contractor[];
  }, [selectedProject, store]);

  const hotTasks = useMemo(() => {
    return store.tasks
      .filter((t) => t.status === "blocked" || (t.priority === "critical" && (t.status === "in_progress" || t.status === "scheduled")))
      .sort((a, b) => {
        if (a.status === "blocked" && b.status !== "blocked") return -1;
        if (b.status === "blocked" && a.status !== "blocked") return 1;
        if (a.priority === "critical" && b.priority !== "critical") return -1;
        if (b.priority === "critical" && a.priority !== "critical") return 1;
        return 0;
      });
  }, [store.tasks]);

  const filteredContractors = useMemo(() => {
    let result = [...store.contractors];
    if (contactSearch) {
      const q = contactSearch.toLowerCase();
      result = result.filter((c) => c.name.toLowerCase().includes(q) || c.company.toLowerCase().includes(q));
    }
    if (activeFilters.length > 0) {
      result = result.filter((c) => c.specialty.some((s) => activeFilters.includes(s)));
    }
    return result;
  }, [store.contractors, contactSearch, activeFilters]);

  const recentCommsByProject = useMemo(() => {
    const activeProjects = store.getActiveProjects();
    return activeProjects
      .map((project) => {
        const projectComms = store.getProjectComms(project.id)
          .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
        const contractorMap = new Map<string, Communication>();
        for (const comm of projectComms) {
          if (!contractorMap.has(comm.contractorId)) contractorMap.set(comm.contractorId, comm);
          if (contractorMap.size >= 3) break;
        }
        return { project, recentContacts: Array.from(contractorMap.entries()) };
      })
      .filter((p) => p.recentContacts.length > 0);
  }, [store]);

  const openContact = store.getContractor(openContactId || "");
  const openContactComms = openContactId
    ? store.getContractorComms(openContactId).sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime())
    : [];

  const toggleFilter = (f: string) => {
    setActiveFilters((prev) => prev.includes(f) ? prev.filter((x) => x !== f) : [...prev, f]);
  };

  const toggleSelect = (id: string) => {
    setSelectedContractors((prev) => prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]);
  };

  const handleAddToProject = (projectId: string) => {
    const project = store.getProject(projectId);
    if (!project) return;
    const newContractorIds = [...new Set([...project.contractorIds, ...selectedContractors])];
    store.updateProject(projectId, { contractorIds: newContractorIds });
    selectedContractors.forEach((cid) => {
      const contractor = store.getContractor(cid);
      if (contractor) {
        const newProjectIds = [...new Set([...contractor.projectIds, projectId])];
        store.updateContractor(cid, { projectIds: newProjectIds });
      }
    });
    setSelectedContractors([]);
    setShowAddToProject(false);
  };

  const handleSend = () => {
    if (!messageText.trim() || !openContactId) return;
    store.addCommunication({
      id: `comm-${Date.now()}`, contractorId: openContactId,
      type: "sms", direction: "outbound", content: messageText,
      timestamp: new Date().toISOString(), read: true,
    });
    setMessageText("");
  };

  const handleScheduleMsg = () => {
    if (!messageText.trim() || !openContactId || !scheduleDate || !scheduleTime) return;
    store.addCommunication({
      id: `comm-${Date.now()}`, contractorId: openContactId,
      type: "sms", direction: "outbound", content: messageText,
      timestamp: new Date().toISOString(), read: true,
      scheduledFor: `${scheduleDate}T${scheduleTime}:00`,
    });
    setMessageText("");
    setScheduleDate("");
    setScheduleTime("");
    setShowSchedule(false);
  };

  const formatCommPreview = (comm: Communication) => {
    if (comm.type === "call") {
      const dir = comm.direction === "inbound" ? "Inbound" : "Outbound";
      if (comm.callStatus === "missed") return `Missed call`;
      const dur = comm.duration ? ` - ${Math.floor(comm.duration / 60)}m ${comm.duration % 60}s` : "";
      return `${dir} call${dur}`;
    }
    return comm.content;
  };

  return (
    <div className="fade-in flex gap-6 h-[calc(100vh-6rem)]">
      {/* LEFT SIDEBAR - Projects */}
      <div className="w-64 flex-shrink-0 flex flex-col bg-white rounded-xl border border-slate-200 overflow-hidden">
        <div className="p-3 border-b border-slate-200">
          <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2"><FolderKanban size={14} /> Projects</h2>
        </div>
        <div className="flex-1 overflow-auto">
          {store.projects.map((p) => (
            <button key={p.id} onClick={() => setSelectedProjectId(p.id)}
              className={cn("w-full text-left px-3 py-3 border-b border-slate-100 transition",
                selectedProjectId === p.id ? "bg-blue-50 border-l-2 border-l-blue-500" : "hover:bg-slate-50"
              )}>
              <p className="text-xs font-medium text-slate-800 truncate">{p.name}</p>
              <p className="text-[10px] text-slate-400 truncate">{p.address.city}, {p.address.state}</p>
              <div className="flex items-center gap-2 mt-1">
                <span className={cn("px-1.5 py-0.5 rounded text-[9px] font-medium",
                  p.status === "active" ? "bg-emerald-100 text-emerald-700" :
                  p.status === "completed" ? "bg-blue-100 text-blue-700" :
                  p.status === "on_hold" ? "bg-amber-100 text-amber-700" : "bg-slate-100 text-slate-500"
                )}>{p.status.replace("_", " ")}</span>
                <span className="text-[9px] text-slate-400">{p.contractorIds.length} contractor{p.contractorIds.length !== 1 ? "s" : ""}</span>
              </div>
            </button>
          ))}
          {store.projects.length === 0 && (
            <div className="text-center py-8 text-slate-400 text-xs">No projects yet</div>
          )}
        </div>
      </div>

      {/* CENTER - Main Content */}
      <div className={cn("flex-1 overflow-auto space-y-5", openContactId && "max-w-[calc(100%-38rem)]")}>
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Hot Tasks & Communications</h1>
          <p className="text-sm text-slate-500 mt-1">
            {hotTasks.length} hot tasks &middot; {store.communications.filter((c) => !c.read).length} unread messages
          </p>
        </div>

        {/* Hot Tasks */}
        {hotTasks.length > 0 && (
          <div>
            <h2 className="text-sm font-bold text-slate-700 mb-3 flex items-center gap-2"><AlertTriangle size={14} className="text-red-500" /> Hot Tasks</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              {hotTasks.map((task) => {
                const project = store.getProject(task.projectId);
                const contractor = task.assignedContractorId ? store.getContractor(task.assignedContractorId) : null;
                return (
                  <Link key={task.id} href={`/projects/${task.projectId}`}
                    className={cn("stat-card py-3 px-4 flex items-start gap-3 hover:shadow-md transition group",
                      task.status === "blocked" ? "border-red-200 bg-red-50/30" : "border-amber-200 bg-amber-50/30"
                    )}>
                    <div className={cn("w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5",
                      task.status === "blocked" ? "bg-red-100" : "bg-amber-100"
                    )}>
                      {task.status === "blocked" ? <Ban size={14} className="text-red-600" /> : <AlertTriangle size={14} className="text-amber-600" />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-slate-900 group-hover:text-blue-600 truncate">{task.title}</p>
                      <p className="text-xs text-slate-500 mt-0.5">{project?.name}</p>
                      <div className="flex items-center gap-2 mt-1.5">
                        <span className={cn("badge text-[10px]",
                          task.status === "blocked" ? "bg-red-100 text-red-700" : "bg-amber-100 text-amber-700"
                        )}>{task.status.replace("_", " ")}</span>
                        <span className="badge text-[10px] bg-slate-100 text-slate-600">{task.priority}</span>
                        {contractor && <span className="text-[10px] text-slate-400">{contractor.name}</span>}
                        {task.scheduledDate && <span className="text-[10px] text-slate-400">{formatDate(task.scheduledDate)}</span>}
                      </div>
                    </div>
                    <ChevronRight size={14} className="text-slate-300 group-hover:text-blue-400 mt-1 flex-shrink-0" />
                  </Link>
                );
              })}
            </div>
          </div>
        )}

        {/* Recent Communications by Project */}
        <div>
          <h2 className="text-sm font-bold text-slate-700 mb-3 flex items-center gap-2"><MessageSquare size={14} className="text-blue-500" /> Recent Communications</h2>
          {recentCommsByProject.length > 0 ? (
            <div className="space-y-4">
              {recentCommsByProject.map(({ project, recentContacts }) => (
                <div key={project.id} className="stat-card p-0 overflow-hidden">
                  <div className="px-4 py-2.5 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
                    <Link href={`/projects/${project.id}`} className="text-sm font-semibold text-slate-800 hover:text-blue-600 transition flex items-center gap-2">
                      {project.name}
                      <ChevronRight size={13} className="text-slate-400" />
                    </Link>
                    <span className="text-[10px] text-slate-400">{project.address.city}, {project.address.state}</span>
                  </div>
                  <div className="divide-y divide-slate-100">
                    {recentContacts.map(([contractorId, lastComm]) => {
                      const contractor = store.getContractor(contractorId);
                      if (!contractor) return null;
                      return (
                        <div key={contractorId}
                          onClick={() => setOpenContactId(contractorId)}
                          className="flex items-center gap-3 px-4 py-3 hover:bg-blue-50/40 transition cursor-pointer group">
                          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-blue-500 to-violet-500 flex items-center justify-center text-white text-[10px] font-bold flex-shrink-0">
                            {contractor.name.split(" ").map((n) => n[0]).join("")}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2">
                              <p className="text-sm font-medium text-slate-800 group-hover:text-blue-600">{contractor.name}</p>
                              <CommBadge comm={lastComm} />
                            </div>
                            <p className="text-xs text-slate-500 truncate mt-0.5">{formatCommPreview(lastComm)}</p>
                          </div>
                          <span className="text-[10px] text-slate-400 flex-shrink-0">{formatRelativeTime(lastComm.timestamp)}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="stat-card flex flex-col items-center py-12">
              <MessageSquare size={40} className="text-slate-300 mb-3" />
              <p className="text-sm text-slate-400">No recent communications</p>
              <p className="text-xs text-slate-300 mt-1">Messages and calls will appear here organized by project</p>
            </div>
          )}
        </div>
      </div>

      {/* RIGHT PANEL - Project Contractors */}
      {selectedProject && (
        <div className="w-80 flex-shrink-0 flex flex-col bg-white rounded-xl border border-slate-200 overflow-hidden">
          <div className="p-4 border-b border-slate-200 bg-gradient-to-r from-blue-50 to-violet-50">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-bold text-slate-900">{selectedProject.name}</p>
                <p className="text-xs text-slate-500">{selectedProject.address.street}, {selectedProject.address.city}</p>
              </div>
              <button onClick={() => setSelectedProjectId(null)} className="p-1 hover:bg-white/70 rounded-lg transition"><X size={16} className="text-slate-400" /></button>
            </div>
            <p className="text-xs text-slate-500 mt-2">{projectContractors.length} assigned contractor{projectContractors.length !== 1 ? "s" : ""}</p>
          </div>

          <div className="flex-1 overflow-auto">
            {projectContractors.length === 0 && (
              <div className="text-center py-10 text-slate-400 text-xs">No contractors assigned yet</div>
            )}
            {projectContractors.map((c) => (
              <div key={c.id} className="flex items-center gap-3 px-4 py-3 border-b border-slate-100 hover:bg-slate-50 transition cursor-pointer"
                onClick={() => setOpenContactId(c.id)}>
                <div className="w-9 h-9 rounded-full bg-gradient-to-br from-blue-500 to-violet-500 flex items-center justify-center text-white text-[10px] font-bold flex-shrink-0">
                  {c.name.split(" ").map((n) => n[0]).join("")}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-slate-800">{c.name}</p>
                  <p className="text-[10px] text-slate-400">{c.company}</p>
                  <div className="flex flex-wrap gap-0.5 mt-1">
                    {c.specialty.slice(0, 3).map((s) => (
                      <span key={s} className="px-1.5 py-0 rounded text-[9px] bg-slate-100 text-slate-500">{s}</span>
                    ))}
                  </div>
                </div>
                <ChevronRight size={14} className="text-slate-300 flex-shrink-0" />
              </div>
            ))}
          </div>

          <div className="p-3 border-t border-slate-200">
            <button onClick={() => setShowAssignModal(true)}
              className="w-full flex items-center justify-center gap-2 px-3 py-2.5 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition">
              <UserPlus size={14} /> Assign New Contractors
            </button>
          </div>
        </div>
      )}

      {/* Assign Contractors to Project Modal */}
      {showAssignModal && selectedProject && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={() => setShowAssignModal(false)}>
          <div className="bg-white rounded-xl p-6 w-full max-w-md mx-4 shadow-2xl" onClick={(e) => e.stopPropagation()}>
            <h3 className="text-lg font-semibold text-slate-900 mb-1">Assign Contractors</h3>
            <p className="text-sm text-slate-500 mb-4">Add contractors to {selectedProject.name}</p>
            <div className="space-y-2 max-h-64 overflow-auto">
              {store.contractors
                .filter((c) => !selectedProject.contractorIds.includes(c.id))
                .map((c) => (
                  <button key={c.id} onClick={() => {
                    const newIds = [...new Set([...selectedProject.contractorIds, c.id])];
                    store.updateProject(selectedProject.id, { contractorIds: newIds });
                    const cProjects = [...new Set([...c.projectIds, selectedProject.id])];
                    store.updateContractor(c.id, { projectIds: cProjects });
                  }}
                    className="w-full text-left px-4 py-3 rounded-lg border border-slate-200 hover:border-blue-300 hover:bg-blue-50 transition flex items-center justify-between group">
                    <div>
                      <p className="text-sm font-medium text-slate-800 group-hover:text-blue-700">{c.name}</p>
                      <p className="text-xs text-slate-400">{c.company} &middot; {c.specialty.join(", ")}</p>
                    </div>
                    <Plus size={14} className="text-slate-300 group-hover:text-blue-500" />
                  </button>
                ))}
              {store.contractors.filter((c) => !selectedProject.contractorIds.includes(c.id)).length === 0 && (
                <p className="text-center text-sm text-slate-400 py-4">All contractors are already assigned</p>
              )}
            </div>
            <div className="flex justify-end mt-4">
              <button onClick={() => setShowAssignModal(false)} className="px-4 py-2 text-sm text-slate-600 hover:bg-slate-100 rounded-lg">Done</button>
            </div>
          </div>
        </div>
      )}

      {/* Add to Project Modal */}
      {showAddToProject && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={() => setShowAddToProject(false)}>
          <div className="bg-white rounded-xl p-6 w-full max-w-md mx-4 shadow-2xl" onClick={(e) => e.stopPropagation()}>
            <h3 className="text-lg font-semibold text-slate-900 mb-1">Add to Project</h3>
            <p className="text-sm text-slate-500 mb-4">Select which project to add {selectedContractors.length} contractor{selectedContractors.length > 1 ? "s" : ""} to:</p>
            <div className="space-y-2 max-h-64 overflow-auto">
              {store.getActiveProjects().map((project) => (
                <button key={project.id} onClick={() => handleAddToProject(project.id)}
                  className="w-full text-left px-4 py-3 rounded-lg border border-slate-200 hover:border-blue-300 hover:bg-blue-50 transition flex items-center justify-between group">
                  <div>
                    <p className="text-sm font-medium text-slate-800 group-hover:text-blue-700">{project.name}</p>
                    <p className="text-xs text-slate-400">{project.address.city}, {project.address.state}</p>
                  </div>
                  <Plus size={14} className="text-slate-300 group-hover:text-blue-500" />
                </button>
              ))}
            </div>
            <div className="flex justify-end mt-4">
              <button onClick={() => setShowAddToProject(false)} className="px-4 py-2 text-sm text-slate-600 hover:bg-slate-100 rounded-lg">Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function CommBadge({ comm }: { comm: Communication }) {
  if (comm.type === "call") {
    if (comm.callStatus === "missed") return <span className="badge text-[9px] bg-red-100 text-red-600">Missed Call</span>;
    return <span className="badge text-[9px] bg-emerald-100 text-emerald-600">Call</span>;
  }
  if (comm.type === "sms") {
    return <span className={cn("badge text-[9px]", comm.direction === "inbound" ? "bg-slate-100 text-slate-600" : "bg-blue-100 text-blue-600")}>
      {comm.direction === "inbound" ? "Received" : "Sent"}
    </span>;
  }
  if (comm.type === "email") return <span className="badge text-[9px] bg-violet-100 text-violet-600">Email</span>;
  return <span className="badge text-[9px] bg-slate-100 text-slate-500">Note</span>;
}
