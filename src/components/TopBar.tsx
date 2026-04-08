"use client";

import { useState } from "react";
import Link from "next/link";
import { ChevronDown, FolderOpen, Bell, Search } from "lucide-react";
import { useStore } from "@/lib/store";
import { BrowserNav } from "./BrowserNav";

export function TopBar() {
  const store = useStore();
  const [folderOpen, setFolderOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);

  return (
    <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-6 sticky top-0 z-20">
      {/* Browser Nav + Search */}
      <div className="flex items-center gap-3 flex-1">
        <BrowserNav />
        {searchOpen ? (
          <div className="relative w-96">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              autoFocus
              className="w-full pl-9 pr-4 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Search projects, contractors, tasks..."
              onBlur={() => setSearchOpen(false)}
            />
          </div>
        ) : (
          <button onClick={() => setSearchOpen(true)} className="flex items-center gap-2 text-sm text-slate-400 hover:text-slate-600 transition">
            <Search size={16} />
            <span>Search...</span>
            <kbd className="hidden sm:inline text-[10px] bg-slate-100 px-1.5 py-0.5 rounded border border-slate-200 text-slate-400">⌘K</kbd>
          </button>
        )}
      </div>

      {/* Right side: folder switcher + notifications */}
      <div className="flex items-center gap-4">
        {/* Notifications */}
        <button className="relative p-2 rounded-lg hover:bg-slate-100 transition">
          <Bell size={18} className="text-slate-500" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full"></span>
        </button>

        {/* Folder Switcher */}
        <div className="relative">
          <button
            onClick={() => setFolderOpen(!folderOpen)}
            className="flex items-center gap-2 px-3 py-2 bg-slate-100 hover:bg-slate-200 rounded-lg text-sm font-medium transition"
          >
            <FolderOpen size={16} className="text-blue-600" />
            <span>Project Folders</span>
            <ChevronDown size={14} className={`text-slate-400 transition-transform ${folderOpen ? "rotate-180" : ""}`} />
          </button>

          {folderOpen && (
            <div className="absolute right-0 top-full mt-2 w-64 bg-white border border-slate-200 rounded-xl shadow-xl py-2 z-50">
              <p className="px-4 py-1.5 text-[10px] font-semibold uppercase text-slate-400 tracking-wider">Switch Folder</p>
              {store.folders.map((folder) => (
                <Link
                  key={folder.id}
                  href={`/projects?folder=${folder.id}`}
                  onClick={() => setFolderOpen(false)}
                  className="flex items-center gap-3 px-4 py-2.5 hover:bg-slate-50 transition text-sm"
                >
                  <span className="w-3 h-3 rounded-full" style={{ background: folder.color }}></span>
                  <span className="flex-1 font-medium text-slate-700">{folder.name}</span>
                  <span className="text-xs text-slate-400">{folder.projectIds.length}</span>
                </Link>
              ))}
              <div className="border-t border-slate-100 mt-1 pt-1">
                <Link
                  href="/projects"
                  onClick={() => setFolderOpen(false)}
                  className="flex items-center gap-3 px-4 py-2.5 hover:bg-slate-50 transition text-sm text-blue-600 font-medium"
                >
                  View All Projects
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
