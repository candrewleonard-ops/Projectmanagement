"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard, FolderKanban, HardHat, FileText,
  Settings, Phone, UserPlus, Landmark, AlertTriangle, LogOut,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/lib/auth";

const nav = [
  { href: "/", label: "Project Manager", icon: LayoutDashboard },
  { href: "/projects", label: "Projects", icon: FolderKanban },
  { href: "/portfolio", label: "Passive Income Portfolio", icon: Landmark },
  { href: "/contractors", label: "Contractors", icon: HardHat },
  { href: "/invoices", label: "Invoices", icon: FileText },
  { href: "/communications", label: "Hot Tasks & Comms", icon: AlertTriangle },
  { href: "/admin", label: "Admin / Users", icon: Settings },
  { href: "/contact", label: "Contact Us", icon: Phone },
];

export function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, signOut } = useAuth();

  if (pathname === "/signup" || pathname === "/login") return null;

  const displayName = user?.name || "Chris Leonard";
  const initials = user?.avatarInitials || "CL";
  const subtitle = user ? user.email : "Admin";

  return (
    <aside className="fixed inset-y-0 left-0 w-64 bg-gradient-to-b from-slate-900 to-slate-950 text-slate-200 flex flex-col z-30">
      <div className="h-20 flex items-center gap-3 px-4 border-b border-slate-700/30">
        <img
          src="/ProjectManagerLogo.svg"
          alt="Reinnovation Project Manager"
          width={48}
          height={48}
          className="rounded-lg"
        />
        <div>
          <p className="font-bold text-sm text-white leading-tight tracking-wide">Reinnovation</p>
          <p className="text-[10px] text-slate-400 leading-tight">Project Manager</p>
        </div>
      </div>

      <nav className="flex-1 py-4 px-3 space-y-0.5 overflow-auto">
        {nav.map((item) => {
          const active = item.href === "/" ? pathname === "/" : pathname.startsWith(item.href);
          return (
            <Link key={item.href} href={item.href}
              className={cn("relative flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200",
                active
                  ? "bg-blue-600/20 text-blue-400 shadow-lg shadow-blue-500/10"
                  : "text-slate-400 hover:text-white hover:bg-white/5"
              )}>
              {active && <span className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-5 bg-blue-500 rounded-r-full" />}
              <item.icon size={18} />
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-slate-700/30">
        {user ? (
          <button onClick={() => { signOut(); router.push("/signup"); }}
            className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-slate-400 hover:text-white hover:bg-white/5 text-sm mb-3 transition-all duration-200">
            <LogOut size={16} /> Sign Out
          </button>
        ) : (
          <Link href="/signup" className="flex items-center gap-2 px-3 py-2 rounded-lg text-slate-400 hover:text-white hover:bg-white/5 text-sm mb-3 transition-all duration-200">
            <UserPlus size={16} /> Sign Up / Log In
          </Link>
        )}
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center text-white text-xs font-bold shadow-lg shadow-blue-500/20">{initials}</div>
          <div className="min-w-0">
            <p className="text-xs font-medium text-white truncate">{displayName}</p>
            <p className="text-[10px] text-slate-500 truncate">{subtitle}</p>
          </div>
        </div>
      </div>
    </aside>
  );
}
