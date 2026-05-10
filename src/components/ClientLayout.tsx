"use client";

import { StoreProvider } from "@/lib/store";
import { AuthProvider } from "@/lib/auth";
import { Sidebar } from "@/components/Sidebar";
import { TopBar } from "@/components/TopBar";
import { ToastProvider } from "@/components/Toast";

export function ClientLayout({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <StoreProvider>
        <ToastProvider>
          <Sidebar />
          <div className="flex-1 flex flex-col ml-64">
            <TopBar />
            <main className="flex-1 p-6 overflow-auto">{children}</main>
          </div>
        </ToastProvider>
      </StoreProvider>
    </AuthProvider>
  );
}
