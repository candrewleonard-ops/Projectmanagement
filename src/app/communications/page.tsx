"use client";

import { Suspense, useState, useMemo } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import {
  Phone, MessageSquare, Mail, StickyNote, Send, PhoneCall,
  PhoneMissed, Calendar, Clock, Search, Filter,
  Building2, ChevronRight,
} from "lucide-react";
import { communications, contractors, projects } from "@/lib/mock-data";
import { formatRelativeTime, formatDate, cn } from "@/lib/utils";
import { Communication } from "@/lib/types";

export default function CommunicationsPage() {
  return <Suspense><CommunicationsContent /></Suspense>;
}

function CommunicationsContent() {
  const searchParams = useSearchParams();
  const filterContractor = searchParams.get("contractor") || "";
  const filterProject = searchParams.get("project") || "";

  const [selectedContractor, setSelectedContractor] = useState(filterContractor);
  const [composeOpen, setComposeOpen] = useState(false);
  const [composeType, setComposeType] = useState<"sms" | "call" | "email">("sms");
  const [messageText, setMessageText] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  // Filter comms
  const filtered = useMemo(() => {
    let result = [...communications];
    if (selectedContractor) result = result.filter((c) => c.contractorId === selectedContractor);
    if (filterProject) result = result.filter((c) => c.projectId === filterProject);
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      result = result.filter((c) => c.content.toLowerCase().includes(q));
    }
    return result.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
  }, [selectedContractor, filterProject, searchQuery]);

  const missedCalls = communications.filter((c) => c.callStatus === "missed");
  const scheduledCalls = communications.filter((c) => c.callStatus === "scheduled");
  const unread = communications.filter((c) => !c.read);

  // Active contractor details
  const activeContractor = selectedContractor ? contractors.find((c) => c.id === selectedContractor) : null;
  const activeContractorProjects = activeContractor
    ? projects.filter((p) => p.contractorIds.includes(activeContractor.id))
    : [];

  // Other contractors sharing projects with active contractor
  const sharedContractors = useMemo(() => {
    if (!activeContractor) return [];
    const sharedIds = new Set<string>();
    activeContractorProjects.forEach((p) => {
      p.contractorIds.forEach((cid) => {
        if (cid !== activeContractor.id) sharedIds.add(cid);
      });
    });
    return contractors.filter((c) => sharedIds.has(c.id));
  }, [activeContractor, activeContractorProjects]);

  return (
    <div className="space-y-6 fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Communications</h1>
          <p className="text-sm text-slate-500 mt-1">
            {unread.length} unread &middot; {missedCalls.length} missed calls &middot; {scheduledCalls.length} scheduled
          </p>
        </div>
        <div className="flex gap-2">
          <button onClick={() => { setComposeType("sms"); setComposeOpen(true); }} className="flex items-center gap-2 px-3 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700 transition">
            <MessageSquare size={14} /> New Message
          </button>
          <button onClick={() => { setComposeType("call"); setComposeOpen(true); }} className="flex items-center gap-2 px-3 py-2 bg-emerald-600 text-white rounded-lg text-sm hover:bg-emerald-700 transition">
            <Phone size={14} /> Place Call
          </button>
          <button onClick={() => { setComposeType("email"); setComposeOpen(true); }} className="flex items-center gap-2 px-3 py-2 bg-violet-600 text-white rounded-lg text-sm hover:bg-violet-700 transition">
            <Mail size={14} /> Send Email
          </button>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-3 gap-4">
        <div className="stat-card flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-red-50 flex items-center justify-center"><PhoneMissed size={18} className="text-red-600" /></div>
          <div>
            <p className="text-xs text-slate-400">Missed Calls</p>
            <p className="text-lg font-bold text-slate-900">{missedCalls.length}</p>
          </div>
        </div>
        <div className="stat-card flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-violet-50 flex items-center justify-center"><Calendar size={18} className="text-violet-600" /></div>
          <div>
            <p className="text-xs text-slate-400">Scheduled Calls</p>
            <p className="text-lg font-bold text-slate-900">{scheduledCalls.length}</p>
          </div>
        </div>
        <div className="stat-card flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center"><MessageSquare size={18} className="text-blue-600" /></div>
          <div>
            <p className="text-xs text-slate-400">Unread Messages</p>
            <p className="text-lg font-bold text-slate-900">{unread.length}</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Contractor List (Left) */}
        <div className="stat-card p-0 overflow-hidden">
          <div className="p-3 border-b border-slate-200">
            <div className="relative">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                placeholder="Search contractors..."
                className="w-full pl-8 pr-3 py-2 text-xs border border-slate-200 rounded-lg"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
          <div className="max-h-[600px] overflow-auto">
            <button
              onClick={() => setSelectedContractor("")}
              className={cn("w-full text-left px-4 py-3 text-sm transition border-b border-slate-100",
                !selectedContractor ? "bg-blue-50 text-blue-700 font-medium" : "hover:bg-slate-50"
              )}
            >
              All Conversations
            </button>
            {contractors.map((c) => {
              const lastComm = communications
                .filter((cm) => cm.contractorId === c.id)
                .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())[0];
              const unreadCount = communications.filter((cm) => cm.contractorId === c.id && !cm.read).length;
              return (
                <button
                  key={c.id}
                  onClick={() => setSelectedContractor(c.id)}
                  className={cn("w-full text-left px-4 py-3 transition border-b border-slate-100 flex items-start gap-3",
                    selectedContractor === c.id ? "bg-blue-50" : "hover:bg-slate-50"
                  )}
                >
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-violet-500 flex items-center justify-center text-white text-[10px] font-bold flex-shrink-0 mt-0.5">
                    {c.name.split(" ").map((n) => n[0]).join("")}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-medium text-slate-800 truncate">{c.name}</p>
                      {unreadCount > 0 && (
                        <span className="w-5 h-5 bg-blue-600 text-white text-[10px] rounded-full flex items-center justify-center flex-shrink-0">{unreadCount}</span>
                      )}
                    </div>
                    {lastComm && <p className="text-xs text-slate-400 truncate mt-0.5">{lastComm.content}</p>}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Main Conversation Area */}
        <div className="lg:col-span-3 space-y-4">
          {/* Header for selected contractor */}
          {activeContractor && (
            <div className="stat-card">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-violet-500 flex items-center justify-center text-white font-bold text-sm">
                    {activeContractor.name.split(" ").map((n) => n[0]).join("")}
                  </div>
                  <div>
                    <h3 className="font-semibold text-slate-900">{activeContractor.name}</h3>
                    <p className="text-xs text-slate-400">{activeContractor.company} &middot; {activeContractor.phone}</p>
                  </div>
                </div>
                <Link href={`/contractors/${activeContractor.id}`} className="text-sm text-blue-600 hover:text-blue-700 flex items-center gap-1">
                  View Profile <ChevronRight size={14} />
                </Link>
              </div>

              {/* Shared projects */}
              {activeContractorProjects.length > 0 && (
                <div className="mt-3 flex items-center gap-2 flex-wrap">
                  <span className="text-xs text-slate-400">Projects:</span>
                  {activeContractorProjects.map((p) => (
                    <Link key={p.id} href={`/projects/${p.id}`} className="badge bg-blue-50 text-blue-700 hover:bg-blue-100 transition">
                      <Building2 size={10} className="mr-1" /> {p.name}
                    </Link>
                  ))}
                </div>
              )}

              {/* Shared contractors on same jobs */}
              {sharedContractors.length > 0 && (
                <div className="mt-2 flex items-center gap-2 flex-wrap">
                  <span className="text-xs text-slate-400">Also on these jobs:</span>
                  {sharedContractors.map((sc) => (
                    <button
                      key={sc.id}
                      onClick={() => setSelectedContractor(sc.id)}
                      className="badge bg-slate-100 text-slate-600 hover:bg-slate-200 transition cursor-pointer"
                    >
                      {sc.name}
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Messages */}
          <div className="space-y-2">
            {filtered.map((comm) => {
              const contractor = contractors.find((c) => c.id === comm.contractorId);
              const project = comm.projectId ? projects.find((p) => p.id === comm.projectId) : null;
              return (
                <div
                  key={comm.id}
                  className={cn("stat-card flex items-start gap-3", !comm.read && "ring-2 ring-blue-200 bg-blue-50/30")}
                >
                  <CommIcon comm={comm} />
                  <div className="flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <button
                        onClick={() => setSelectedContractor(comm.contractorId)}
                        className="text-sm font-medium text-slate-900 hover:text-blue-600 transition"
                      >
                        {contractor?.name}
                      </button>
                      <span className="text-xs text-slate-400 capitalize">{comm.type} &middot; {comm.direction}</span>
                      {comm.callStatus === "missed" && <span className="badge bg-red-100 text-red-700">Missed</span>}
                      {comm.callStatus === "scheduled" && <span className="badge bg-violet-100 text-violet-700">Scheduled {formatDate(comm.scheduledFor || "")}</span>}
                      {comm.duration && <span className="text-xs text-slate-400">{Math.floor(comm.duration / 60)}m {comm.duration % 60}s</span>}
                    </div>
                    <p className="text-sm text-slate-600 mt-1">{comm.content}</p>
                    <div className="flex items-center gap-3 mt-1.5">
                      <span className="text-xs text-slate-400">{formatRelativeTime(comm.timestamp)}</span>
                      {project && (
                        <Link href={`/projects/${project.id}`} className="text-xs text-blue-600 hover:text-blue-700">
                          {project.name} →
                        </Link>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Compose Box */}
          {activeContractor && (
            <div className="stat-card">
              <div className="flex items-center gap-2 mb-3">
                <button
                  onClick={() => setComposeType("sms")}
                  className={cn("px-3 py-1.5 rounded-lg text-xs font-medium transition",
                    composeType === "sms" ? "bg-blue-100 text-blue-700" : "bg-slate-100 text-slate-500"
                  )}
                >
                  <MessageSquare size={12} className="inline mr-1" /> Text
                </button>
                <button
                  onClick={() => setComposeType("call")}
                  className={cn("px-3 py-1.5 rounded-lg text-xs font-medium transition",
                    composeType === "call" ? "bg-emerald-100 text-emerald-700" : "bg-slate-100 text-slate-500"
                  )}
                >
                  <Phone size={12} className="inline mr-1" /> Call
                </button>
                <button
                  onClick={() => setComposeType("email")}
                  className={cn("px-3 py-1.5 rounded-lg text-xs font-medium transition",
                    composeType === "email" ? "bg-violet-100 text-violet-700" : "bg-slate-100 text-slate-500"
                  )}
                >
                  <Mail size={12} className="inline mr-1" /> Email
                </button>
              </div>
              {composeType === "call" ? (
                <div className="flex items-center gap-3">
                  <p className="text-sm text-slate-600 flex-1">Call {activeContractor.name} at {activeContractor.phone}</p>
                  <button className="flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-lg text-sm hover:bg-emerald-700 transition">
                    <PhoneCall size={14} /> Start Call (Twilio)
                  </button>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <input
                    value={messageText}
                    onChange={(e) => setMessageText(e.target.value)}
                    placeholder={composeType === "sms" ? "Type a message..." : "Type your email..."}
                    className="flex-1 border border-slate-200 rounded-lg px-3 py-2 text-sm"
                  />
                  <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700 transition">
                    <Send size={14} /> Send
                  </button>
                </div>
              )}
              <p className="text-[10px] text-slate-400 mt-2">
                Powered by Twilio. Messages and calls will be sent from your registered number.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function CommIcon({ comm }: { comm: Communication }) {
  const base = "w-8 h-8 rounded-full flex items-center justify-center text-white text-xs flex-shrink-0";
  if (comm.type === "call") {
    if (comm.callStatus === "missed") return <div className={cn(base, "bg-red-500")}><PhoneMissed size={14} /></div>;
    if (comm.callStatus === "scheduled") return <div className={cn(base, "bg-violet-500")}><Calendar size={14} /></div>;
    return <div className={cn(base, "bg-emerald-500")}><Phone size={14} /></div>;
  }
  if (comm.type === "sms") return <div className={cn(base, "bg-blue-500")}><MessageSquare size={14} /></div>;
  if (comm.type === "email") return <div className={cn(base, "bg-violet-500")}><Mail size={14} /></div>;
  return <div className={cn(base, "bg-slate-500")}><StickyNote size={14} /></div>;
}
