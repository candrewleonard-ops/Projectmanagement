"use client";

import Link from "next/link";
import { FileText, Plus } from "lucide-react";
import { invoices, contractors, projects } from "@/lib/mock-data";
import { formatCurrency, formatDate, statusColor, cn } from "@/lib/utils";

export default function InvoicesPage() {
  return (
    <div className="space-y-6 fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Invoices</h1>
          <p className="text-sm text-slate-500 mt-1">{invoices.length} invoices</p>
        </div>
        <Link href="/invoices/create" className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2.5 rounded-lg text-sm font-medium hover:bg-blue-700 transition">
          <Plus size={16} /> Write Invoice
        </Link>
      </div>

      <div className="stat-card p-0 overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-200">
              <th className="text-left py-3 px-4 font-medium text-slate-500">Invoice</th>
              <th className="text-left py-3 px-4 font-medium text-slate-500">Contractor</th>
              <th className="text-left py-3 px-4 font-medium text-slate-500">Project</th>
              <th className="text-left py-3 px-4 font-medium text-slate-500">Status</th>
              <th className="text-right py-3 px-4 font-medium text-slate-500">Total</th>
              <th className="text-center py-3 px-4 font-medium text-slate-500">Deposit</th>
              <th className="text-center py-3 px-4 font-medium text-slate-500">Midpoint</th>
              <th className="text-center py-3 px-4 font-medium text-slate-500">Final</th>
              <th className="text-left py-3 px-4 font-medium text-slate-500">Created</th>
            </tr>
          </thead>
          <tbody>
            {invoices.map((inv) => {
              const contractor = contractors.find((c) => c.id === inv.contractorId);
              const project = projects.find((p) => p.id === inv.projectId);
              return (
                <tr key={inv.id} className="border-b border-slate-100 hover:bg-slate-50 transition">
                  <td className="py-3 px-4 font-medium text-slate-900">#{inv.id}</td>
                  <td className="py-3 px-4">
                    <Link href={`/contractors/${inv.contractorId}`} className="text-blue-600 hover:text-blue-700">{contractor?.name}</Link>
                  </td>
                  <td className="py-3 px-4">
                    <Link href={`/projects/${inv.projectId}`} className="text-blue-600 hover:text-blue-700">{project?.name}</Link>
                  </td>
                  <td className="py-3 px-4"><span className={`badge ${statusColor(inv.status)}`}>{inv.status}</span></td>
                  <td className="py-3 px-4 text-right font-semibold">{formatCurrency(inv.subtotal)}</td>
                  <td className="py-3 px-4 text-center">
                    <span className={cn("w-6 h-6 inline-flex items-center justify-center rounded-full text-xs font-medium", inv.depositPaid ? "bg-emerald-100 text-emerald-700" : "bg-slate-100 text-slate-400")}>
                      {inv.depositPaid ? "✓" : "—"}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-center">
                    <span className={cn("w-6 h-6 inline-flex items-center justify-center rounded-full text-xs font-medium", inv.midpointPaid ? "bg-emerald-100 text-emerald-700" : "bg-slate-100 text-slate-400")}>
                      {inv.midpointPaid ? "✓" : "—"}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-center">
                    <span className={cn("w-6 h-6 inline-flex items-center justify-center rounded-full text-xs font-medium", inv.completionPaid ? "bg-emerald-100 text-emerald-700" : "bg-slate-100 text-slate-400")}>
                      {inv.completionPaid ? "✓" : "—"}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-slate-400">{formatDate(inv.createdAt)}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
