"use client";

import React, { Suspense, useState, useMemo } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import {
  Phone, MessageSquare, Mail, StickyNote, Send, PhoneCall,
  PhoneMissed, Calendar, Clock, Search, X, ChevronDown,
  Building2, ChevronRight, Trash2, Plus, Edit3,
} from "lucide-react";
import { useStore } from "@/lib/store";
import { formatRelativeTime, formatDate, cn } from "@/lib/utils";
import { Communication } from "@/lib/types";

export default function CommunicationsPage() {
  return <Suspense><CommunicationsContent /></Suspense>;
}

function CommunicationsContent() {
  const searchParams = useSearchParams();
  const filterContractor = searchParams.get("contractor") || "";
  const store = useStore();

  const [selectedContractor, setSelectedContractor] = useState(filterContractor);
  const [expandedComm, setExpandedComm] = useState<string | null>(null);
  const [composeFor, setComposeFor] = useState<string | null>(null);
  const [composeType, setComposeType] = useState<"sms" | "call">("sms");
  const [messageText, setMessageText] = useState("");
  const [scheduleTime, setScheduleTime] = useState("");
  const [scheduleAmPm, setScheduleAmPm] = useState<"AM" | "PM">("AM");
  const [showSchedule, setShowSchedule] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [editingNote, setEditingNote] = useState<string | null>(null);
  const [noteText, setNoteText] = useState("");

  const filtered = useMemo(() => {
    let result = [...store.communications];
    if (selectedContractor) result = result.filter((c) => c.contractorId === selectedContractor);
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      result = result.filter((c) => c.content.toLowerCase().includes(q));
    }
    return result.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
  }, [selectedContractor, searchQuery, store.communications]);

  const missedCalls = store.communications.filter((c) => c.callStatus === "missed");
  const scheduledCalls = store.communications.filter((c) => c.callStatus === "scheduled");
  const unread = store.communications.filter((c) => !c.read);

  const activeContractor = selectedContractor ? store.getContractor(selectedContractor) : null;

  const handleSend = () => {
    if (!messageText.trim() || !composeFor) return;
    store.addCommunication({
      id: `comm-${Date.now()}`, contractorId: composeFor,
      type: "sms", direction: "outbound", content: messageText,
      timestamp: new Date().toISOString(), read: true,
    });
    setMessageText("");
  };

  const openCompose = (contractorId: string, type: "sms" | "call") => {
    setComposeFor(contractorId);
    setComposeType(type);
    setMessageText("");
    setShowSchedule(false);
    setSelectedContractor(contractorId);
  };

  const addCallNote = (commId: string) => {
    if (!noteText.trim()) return;
    store.updateCommunication(commId, {
      content: store.communications.find(c => c.id === commId)!.content + "\n---\nNote: " + noteText,
    });
    setNoteText("");
    setEditingNote(null);
  };

  return (
    <div className="space-y-6 fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Communications</h1>
          <p className="text-sm text-slate-500 mt-1">{unread.length} unread &middot; {missedCalls.length} missed &middot; {scheduledCalls.length} scheduled</p>
        </div>
        <div className="flex gap-2">
          <button onClick={() => openCompose(selectedContractor || store.contractors[0]?.id || "", "sms")} className="flex items-center gap-2 px-3 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700 transition">
            <MessageSquare size={14} /> New Message
          </button>
          <button onClick={() => openCompose(selectedContractor || store.contractors[0]?.id || "", "call")} className="flex items-center gap-2 px-3 py-2 bg-emerald-600 text-white rounded-lg text-sm hover:bg-emerald-700 transition">
            <Phone size={14} /> Place Call
          </button>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-3 gap-4">
        <div className="stat-card flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-red-50 flex items-center justify-center"><PhoneMissed size={18} className="text-red-600" /></div>
          <div><p className="text-xs text-slate-400">Missed Calls</p><p className="text-lg font-bold text-slate-900">{missedCalls.length}</p></div>
        </div>
        <div className="stat-card flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-violet-50 flex items-center justify-center"><Calendar size={18} className="text-violet-600" /></div>
          <div><p className="text-xs text-slate-400">Scheduled Calls</p><p className="text-lg font-bold text-slate-900">{scheduledCalls.length}</p></div>
        </div>
        <div className="stat-card flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center"><MessageSquare size={18} className="text-blue-600" /></div>
          <div><p className="text-xs text-slate-400">Unread Messages</p><p className="text-lg font-bold text-slate-900">{unread.length}</p></div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Left sidebar - contractor list */}
        <div className="stat-card p-0 overflow-hidden">
          <div className="p-3 border-b border-slate-200">
            <div className="relative">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input placeholder="Search..." className="w-full pl-8 pr-3 py-2 text-xs border border-slate-200 rounded-lg" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
            </div>
          </div>
          <div className="max-h-[600px] overflow-auto">
            <button onClick={() => setSelectedContractor("")}
              className={cn("w-full text-left px-4 py-3 text-sm transition border-b border-slate-100 font-medium",
                !selectedContractor ? "bg-blue-50 text-blue-700" : "text-slate-600 hover:bg-slate-50"
              )}>
              All Conversations
            </button>
            {store.contractors.map((c) => {
              const lastComm = store.communications
                .filter((cm) => cm.contractorId === c.id)
                .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())[0];
              const unreadCount = store.communications.filter((cm) => cm.contractorId === c.id && !cm.read).length;
              return (
                <button key={c.id} onClick={() => setSelectedContractor(c.id)}
                  className={cn("w-full text-left px-4 py-3 transition border-b border-slate-100 flex items-start gap-3",
                    selectedContractor === c.id ? "bg-blue-50" : "hover:bg-slate-50"
                  )}>
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-violet-500 flex items-center justify-center text-white text-[10px] font-bold flex-shrink-0 mt-0.5">
                    {c.name.split(" ").map((n) => n[0]).join("")}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-medium text-slate-800 truncate">{c.name}</p>
                      {unreadCount > 0 && <span className="w-5 h-5 bg-blue-600 text-white text-[10px] rounded-full flex items-center justify-center flex-shrink-0">{unreadCount}</span>}
                    </div>
                    {lastComm && <p className="text-xs text-slate-400 truncate mt-0.5">{lastComm.content}</p>}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Main area */}
        <div className="lg:col-span-3 space-y-3">
          {/* Compose area */}
          {composeFor && (
            <div className="stat-card">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-slate-700">
                    {composeType === "sms" ? "Text" : "Call"} {store.getContractor(composeFor)?.name}
                  </span>
                  <select value={composeFor} onChange={(e) => setComposeFor(e.target.value)} className="text-xs border border-slate-200 rounded px-2 py-1">
                    {store.contractors.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
                  </select>
                </div>
                <div className="flex items-center gap-1">
                  <button onClick={() => setComposeType("sms")} className={cn("px-2 py-1 rounded text-xs font-medium", composeType === "sms" ? "bg-blue-100 text-blue-700" : "text-slate-400")}>Text</button>
                  <button onClick={() => setComposeType("call")} className={cn("px-2 py-1 rounded text-xs font-medium", composeType === "call" ? "bg-emerald-100 text-emerald-700" : "text-slate-400")}>Call</button>
                  <button onClick={() => setComposeFor(null)} className="p-1 hover:bg-slate-100 rounded ml-2"><X size={14} /></button>
                </div>
              </div>
              {composeType === "call" ? (
                <div className="flex items-center gap-3">
                  <p className="text-sm text-slate-600 flex-1">Call at {store.getContractor(composeFor)?.phone}</p>
                  <button className="flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-lg text-sm hover:bg-emerald-700 transition">
                    <PhoneCall size={14} /> Start Call (Twilio)
                  </button>
                </div>
              ) : (
                <div>
                  <textarea value={messageText} onChange={(e) => setMessageText(e.target.value)} placeholder="Type a message..." className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm resize-none h-16 mb-2" />
                  <div className="flex items-center gap-2">
                    <button onClick={handleSend} className="flex items-center gap-2 px-4 py-1.5 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700 transition"><Send size={12} /> Send</button>
                    <button onClick={() => setShowSchedule(!showSchedule)} className={cn("flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm transition", showSchedule ? "bg-violet-100 text-violet-700" : "bg-slate-200 text-slate-600")}><Clock size={12} /> Schedule</button>
                    {showSchedule && (
                      <>
                        <input type="time" value={scheduleTime} onChange={(e) => setScheduleTime(e.target.value)} className="border border-slate-200 rounded px-2 py-1 text-sm" />
                        <div className="flex border border-slate-200 rounded overflow-hidden">
                          <button onClick={() => setScheduleAmPm("AM")} className={cn("px-2 py-1 text-xs", scheduleAmPm === "AM" ? "bg-blue-100 text-blue-700" : "text-slate-500")}>AM</button>
                          <button onClick={() => setScheduleAmPm("PM")} className={cn("px-2 py-1 text-xs", scheduleAmPm === "PM" ? "bg-blue-100 text-blue-700" : "text-slate-500")}>PM</button>
                        </div>
                        <button className="px-3 py-1 bg-violet-600 text-white rounded text-xs hover:bg-violet-700">Schedule</button>
                      </>
                    )}
                  </div>
                  <p className="text-[10px] text-slate-400 mt-2">Powered by Twilio</p>
                </div>
              )}
            </div>
          )}

          {/* Communication rows - compact */}
          {filtered.map((comm) => {
            const contractor = store.getContractor(comm.contractorId);
            const project = comm.projectId ? store.getProject(comm.projectId) : null;
            const isExpanded = expandedComm === comm.id;

            return (
              <div key={comm.id}>
                {/* Compact row */}
                <div onClick={() => { setExpandedComm(isExpanded ? null : comm.id); if (!comm.read) store.updateCommunication(comm.id, { read: true }); }}
                  className={cn("flex items-center gap-3 px-4 py-2.5 rounded-lg border cursor-pointer transition hover:shadow-sm",
                    !comm.read ? "border-blue-200 bg-blue-50/40" : "border-slate-200 bg-white",
                    isExpanded && "border-blue-300 shadow-sm"
                  )}>
                  <CommIcon comm={comm} />
                  <span className="text-sm font-medium text-slate-800 w-36 truncate">{contractor?.name}</span>
                  <span className="text-xs text-slate-400 w-24 capitalize">{comm.type} &middot; {comm.direction === "inbound" ? "In" : "Out"}</span>
                  {comm.callStatus === "missed" && <span className="badge bg-red-100 text-red-700 text-[10px]">Missed</span>}
                  {comm.callStatus === "scheduled" && <span className="badge bg-violet-100 text-violet-700 text-[10px]">Scheduled</span>}
                  <p className="text-sm text-slate-600 flex-1 truncate">{comm.content.split("\n")[0]}</p>
                  <span className="text-xs text-slate-400 flex-shrink-0">{formatRelativeTime(comm.timestamp)}</span>
                  <div className="flex gap-1 flex-shrink-0" onClick={(e) => e.stopPropagation()}>
                    <button onClick={() => openCompose(comm.contractorId, "sms")} className="p-1 rounded hover:bg-blue-50 text-slate-400 hover:text-blue-600"><MessageSquare size={12} /></button>
                    <button onClick={() => openCompose(comm.contractorId, "call")} className="p-1 rounded hover:bg-emerald-50 text-slate-400 hover:text-emerald-600"><Phone size={12} /></button>
                  </div>
                </div>

                {/* Expanded detail */}
                {isExpanded && (
                  <div className="ml-4 mt-1 mb-2 bg-slate-50 rounded-lg border border-slate-200 p-4">
                    <div className="grid grid-cols-3 gap-4 mb-4">
                      <div>
                        <h4 className="text-xs font-semibold text-slate-400 uppercase mb-1">Contact</h4>
                        <p className="text-sm font-medium text-slate-800">{contractor?.name}</p>
                        <p className="text-xs text-slate-500">{contractor?.company}</p>
                        <p className="text-xs text-slate-500">{contractor?.phone} &middot; {contractor?.email}</p>
                      </div>
                      <div>
                        <h4 className="text-xs font-semibold text-slate-400 uppercase mb-1">Message</h4>
                        <p className="text-sm text-slate-700 whitespace-pre-wrap">{comm.content}</p>
                        {comm.duration && <p className="text-xs text-slate-400 mt-1">Duration: {Math.floor(comm.duration / 60)}m {comm.duration % 60}s</p>}
                      </div>
                      <div>
                        {project && (
                          <div>
                            <h4 className="text-xs font-semibold text-slate-400 uppercase mb-1">Project</h4>
                            <Link href={`/projects/${project.id}`} className="text-sm text-blue-600 hover:text-blue-700">{project.name} →</Link>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Call notes section */}
                    {comm.type === "call" && (
                      <div className="border-t border-slate-200 pt-3 mt-3">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="text-xs font-semibold text-slate-400 uppercase">Call Notes</h4>
                          <button onClick={() => { setEditingNote(comm.id); setNoteText(""); }} className="text-xs text-blue-600 hover:text-blue-700 flex items-center gap-1"><Plus size={10} /> Add Note</button>
                        </div>
                        {editingNote === comm.id && (
                          <div className="flex gap-2 mb-2">
                            <input value={noteText} onChange={(e) => setNoteText(e.target.value)} placeholder="Add a note..." className="flex-1 border border-slate-200 rounded px-2 py-1 text-sm" />
                            <button onClick={() => addCallNote(comm.id)} className="px-3 py-1 bg-blue-600 text-white rounded text-xs">Save</button>
                            <button onClick={() => setEditingNote(null)} className="px-2 py-1 text-slate-400 text-xs">Cancel</button>
                          </div>
                        )}
                      </div>
                    )}

                    {/* Recent comms with this contractor */}
                    {contractor && (
                      <div className="border-t border-slate-200 pt-3 mt-3">
                        <h4 className="text-xs font-semibold text-slate-400 uppercase mb-2">Recent with {contractor.name}</h4>
                        <div className="space-y-1.5 max-h-32 overflow-auto">
                          {store.getContractorComms(contractor.id)
                            .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
                            .slice(0, 5)
                            .map((rc) => (
                              <div key={rc.id} className="flex items-center gap-2 text-xs">
                                <CommIcon comm={rc} small />
                                <span className="text-slate-600 truncate flex-1">{rc.content.split("\n")[0]}</span>
                                <span className="text-slate-400 flex-shrink-0">{formatRelativeTime(rc.timestamp)}</span>
                              </div>
                            ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}

          {filtered.length === 0 && (
            <div className="text-center py-12 text-slate-400">
              <MessageSquare size={40} className="mx-auto mb-3 text-slate-300" />
              <p>No communications found</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function CommIcon({ comm, small }: { comm: Communication; small?: boolean }) {
  const sz = small ? 10 : 14;
  const base = small ? "w-5 h-5" : "w-7 h-7";
  const cls = `${base} rounded-full flex items-center justify-center text-white flex-shrink-0`;
  if (comm.type === "call") {
    if (comm.callStatus === "missed") return <div className={cn(cls, "bg-red-500")}><PhoneMissed size={sz} /></div>;
    if (comm.callStatus === "scheduled") return <div className={cn(cls, "bg-violet-500")}><Calendar size={sz} /></div>;
    return <div className={cn(cls, "bg-emerald-500")}><Phone size={sz} /></div>;
  }
  if (comm.type === "sms") return <div className={cn(cls, "bg-blue-500")}><MessageSquare size={sz} /></div>;
  if (comm.type === "email") return <div className={cn(cls, "bg-violet-500")}><Mail size={sz} /></div>;
  return <div className={cn(cls, "bg-slate-500")}><StickyNote size={sz} /></div>;
}
