"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard, FolderKanban, HardHat, FileText,
  MessageSquare, Settings, Phone, UserPlus,
} from "lucide-react";
import Image from "next/image";
import { cn } from "@/lib/utils";

const nav = [
  { href: "/", label: "Dashboard", icon: LayoutDashboard },
  { href: "/projects", label: "Projects", icon: FolderKanban },
  { href: "/contractors", label: "Contractors", icon: HardHat },
  { href: "/invoices", label: "Invoices", icon: FileText },
  { href: "/communications", label: "Communications", icon: MessageSquare },
  { href: "/admin", label: "Admin / Users", icon: Settings },
  { href: "/contact", label: "Contact Us", icon: Phone },
];

export function Sidebar() {
  const pathname = usePathname();

  if (pathname === "/signup" || pathname === "/login") return null;

  return (
    <aside className="fixed inset-y-0 left-0 w-64 bg-slate-900 text-slate-200 flex flex-col z-30">
      <div className="h-20 flex items-center gap-3 px-4 border-b border-slate-700/50">
        <Image
          src="/ProjectManagerLogo.png"
          alt="Reinnovation Project Manager"
          width={48}
          height={48}
          className="rounded-lg"
        />
        <div>
          <p className="font-bold text-sm text-white leading-tight">Reinnovation</p>
          <p className="text-[10px] text-slate-400 leading-tight">Project Manager</p>
        </div>
      </div>

      <nav className="flex-1 py-4 px-3 space-y-1 overflow-auto">
        {nav.map((item) => {
          const active = item.href === "/" ? pathname === "/" : pathname.startsWith(item.href);
          return (
            <Link key={item.href} href={item.href}
              className={cn("flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors",
                active ? "bg-blue-600/20 text-blue-400" : "text-slate-400 hover:text-white hover:bg-slate-800"
              )}>
              <item.icon size={18} />
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-slate-700/50">
        <Link href="/signup" className="flex items-center gap-2 px-3 py-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 text-sm mb-3 transition-colors">
          <UserPlus size={16} /> Sign Up / Log In
        </Link>
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white text-xs font-bold">CL</div>
          <div>
            <p className="text-xs font-medium text-white">Chris Leonard</p>
            <p className="text-[10px] text-slate-500">Admin</p>
          </div>
        </div>
      </div>
    </aside>
  );
}
