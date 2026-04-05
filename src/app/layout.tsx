import type { Metadata } from "next";
import "./globals.css";
import { ClientLayout } from "@/components/ClientLayout";

export const metadata: Metadata = {
  title: "FlipCRM — Fix & Flip Project Management",
  description: "Manage your fix-and-flip real estate projects, contractors, and invoices.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-screen flex bg-slate-50">
        <ClientLayout>{children}</ClientLayout>
      </body>
    </html>
  );
}
