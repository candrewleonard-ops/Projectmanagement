"use client";

import { StoreProvider } from "@/lib/store";
import { Sidebar } from "@/components/Sidebar";
import { TopBar } from "@/components/TopBar";

export function ClientLayout({ children }: { children: React.ReactNode }) {
  return (
    <StoreProvider>
      <Sidebar />
      <div className="flex-1 flex flex-col ml-64">
        <TopBar />
        <main className="flex-1 p-6 overflow-auto">{children}</main>
      </div>
    </StoreProvider>
  );
}
