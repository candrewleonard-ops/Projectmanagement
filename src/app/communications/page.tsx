"use client";

import React, { Suspense, useState, useMemo } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import {
  Phone, MessageSquare, Mail, StickyNote, Send, PhoneCall,
  PhoneMissed, Calendar, Clock, Search, X, ChevronRight,
  Plus, AlertTriangle, Ban, CheckSquare, Square, Users,
  Filter, UserPlus,
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
      {/* LEFT SIDEBAR - Contacts */}
      <div className="w-72 flex-shrink-0 flex flex-col bg-white rounded-xl border border-slate-200 overflow-hidden">
        <div className="p-3 border-b border-slate-200">
          <h2 className="text-sm font-bold text-slate-900 mb-2 flex items-center gap-2"><Users size={14} /> Contacts</h2>
          <div className="relative mb-2">
            <Search size={13} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input placeholder="Search contacts..." className="w-full pl-8 pr-3 py-1.5 text-xs border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400" value={contactSearch} onChange={(e) => setContactSearch(e.target.value)} />
          </div>
          <div className="flex flex-wrap gap-1">
            {SPECIALTIES.map((s) => (
              <button key={s} onClick={() => toggleFilter(s)}
                className={cn("px-2 py-0.5 rounded-full text-[10px] font-medium transition",
                  activeFilters.includes(s) ? "bg-blue-600 text-white" : "bg-slate-100 text-slate-500 hover:bg-slate-200"
                )}>
                {s}
              </button>
            ))}
          </div>
        </div>

        <div className="flex-1 overflow-auto">
          {filteredContractors.map((c) => {
            const isSelected = selectedContractors.includes(c.id);
            return (
              <div key={c.id} className={cn("flex items-center gap-2 px-3 py-2.5 border-b border-slate-100 transition cursor-pointer",
                openContactId === c.id ? "bg-blue-50" : "hover:bg-slate-50"
              )}>
                <button onClick={() => toggleSelect(c.id)} className="flex-shrink-0">
                  {isSelected
                    ? <CheckSquare size={16} className="text-blue-600" />
                    : <Square size={16} className="text-slate-300" />
                  }
                </button>
                <div className="flex-1 min-w-0" onClick={() => setOpenContactId(c.id)}>
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-full bg-gradient-to-br from-blue-500 to-violet-500 flex items-center justify-center text-white text-[9px] font-bold flex-shrink-0">
                      {c.name.split(" ").map((n) => n[0]).join("")}
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs font-medium text-slate-800 truncate">{c.name}</p>
                      <p className="text-[10px] text-slate-400 truncate">{c.company}</p>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-0.5 mt-1 ml-9">
                    {c.specialty.slice(0, 3).map((s) => (
                      <span key={s} className="px-1.5 py-0 rounded text-[9px] bg-slate-100 text-slate-500">{s}</span>
                    ))}
                    {c.specialty.length > 3 && <span className="text-[9px] text-slate-400">+{c.specialty.length - 3}</span>}
                  </div>
                </div>
              </div>
            );
          })}
          {filteredContractors.length === 0 && (
            <div className="text-center py-8 text-slate-400 text-xs">No contacts found</div>
          )}
        </div>

        {selectedContractors.length > 0 && (
          <div className="p-3 border-t border-slate-200 bg-blue-50">
            <p className="text-xs text-blue-700 font-medium mb-2">{selectedContractors.length} selected</p>
            <button onClick={() => setShowAddToProject(true)}
              className="w-full flex items-center justify-center gap-2 px-3 py-2 bg-blue-600 text-white rounded-lg text-xs font-medium hover:bg-blue-700 transition">
              <UserPlus size={13} /> Add to Project
            </button>
          </div>
        )}
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

      {/* RIGHT PANEL - Contact Detail */}
      {openContact && (
        <div className="w-96 flex-shrink-0 flex flex-col bg-white rounded-xl border border-slate-200 overflow-hidden">
          {/* Contact Header */}
          <div className="p-4 border-b border-slate-200 bg-gradient-to-r from-blue-50 to-violet-50">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-full bg-gradient-to-br from-blue-500 to-violet-500 flex items-center justify-center text-white text-sm font-bold">
                  {openContact.name.split(" ").map((n) => n[0]).join("")}
                </div>
                <div>
                  <p className="text-sm font-bold text-slate-900">{openContact.name}</p>
                  <p className="text-xs text-slate-500">{openContact.company}</p>
                </div>
              </div>
              <button onClick={() => setOpenContactId(null)} className="p-1 hover:bg-white/70 rounded-lg transition"><X size={16} className="text-slate-400" /></button>
            </div>
            <div className="mt-3 flex flex-wrap gap-1">
              {openContact.specialty.map((s) => (
                <span key={s} className="px-2 py-0.5 rounded-full text-[10px] font-medium bg-white/70 text-slate-600">{s}</span>
              ))}
            </div>
            <div className="mt-2 flex items-center gap-4 text-xs text-slate-500">
              <span>{openContact.phone}</span>
              <span>{openContact.email}</span>
            </div>
          </div>

          {/* Chat Thread */}
          <div className="flex-1 overflow-auto p-3 space-y-2 bg-slate-50">
            {openContactComms.length === 0 && (
              <div className="text-center py-8 text-slate-400 text-xs">No messages yet</div>
            )}
            {openContactComms.map((comm) => {
              if (comm.type === "call") {
                return (
                  <div key={comm.id} className="flex justify-center">
                    <div className={cn("px-3 py-1.5 rounded-full text-[10px] font-medium",
                      comm.callStatus === "missed" ? "bg-red-100 text-red-600" : "bg-emerald-100 text-emerald-700"
                    )}>
                      {comm.callStatus === "missed" ? "Missed call" : `${comm.direction === "inbound" ? "Inbound" : "Outbound"} call`}
                      {comm.duration ? ` · ${Math.floor(comm.duration / 60)}m ${comm.duration % 60}s` : ""}
                      <span className="ml-2 opacity-60">{formatRelativeTime(comm.timestamp)}</span>
                    </div>
                  </div>
                );
              }
              const isOutbound = comm.direction === "outbound";
              return (
                <div key={comm.id} className={cn("flex", isOutbound ? "justify-end" : "justify-start")}>
                  <div className={cn("max-w-[80%] px-3 py-2 rounded-2xl text-sm",
                    isOutbound ? "bg-blue-600 text-white rounded-br-md" : "bg-white text-slate-800 border border-slate-200 rounded-bl-md"
                  )}>
                    <p className="whitespace-pre-wrap">{comm.content}</p>
                    <p className={cn("text-[10px] mt-1", isOutbound ? "text-blue-200" : "text-slate-400")}>{formatRelativeTime(comm.timestamp)}</p>
                    {comm.scheduledFor && (
                      <p className={cn("text-[10px] mt-0.5 flex items-center gap-1", isOutbound ? "text-blue-200" : "text-violet-500")}>
                        <Clock size={9} /> Scheduled for {formatDate(comm.scheduledFor)}
                      </p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Compose */}
          <div className="p-3 border-t border-slate-200 bg-white">
            <textarea value={messageText} onChange={(e) => setMessageText(e.target.value)}
              placeholder={`Message ${openContact.name}...`}
              className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm resize-none h-14 mb-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
              onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); handleSend(); } }}
            />
            <div className="flex items-center gap-2">
              <button onClick={handleSend} disabled={!messageText.trim()}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 text-white rounded-lg text-xs font-medium hover:bg-blue-700 transition disabled:opacity-50"><Send size={11} /> Send</button>
              <button onClick={() => setShowSchedule(!showSchedule)}
                className={cn("flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs transition",
                  showSchedule ? "bg-violet-100 text-violet-700" : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                )}><Calendar size={11} /> Schedule</button>
            </div>
            {showSchedule && (
              <div className="mt-2 p-2.5 bg-violet-50 border border-violet-200 rounded-lg">
                <div className="flex items-center gap-2 flex-wrap">
                  <input type="date" value={scheduleDate} onChange={(e) => setScheduleDate(e.target.value)} className="border border-violet-200 rounded-lg px-2 py-1 text-xs bg-white" />
                  <input type="time" value={scheduleTime} onChange={(e) => setScheduleTime(e.target.value)} className="border border-violet-200 rounded-lg px-2 py-1 text-xs bg-white" />
                  <button onClick={handleScheduleMsg} disabled={!scheduleDate || !scheduleTime || !messageText.trim()}
                    className="px-3 py-1 bg-violet-600 text-white rounded-lg text-xs hover:bg-violet-700 disabled:opacity-50"><Clock size={10} /> Schedule</button>
                </div>
              </div>
            )}
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
