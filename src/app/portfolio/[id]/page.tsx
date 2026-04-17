"use client";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, Home, FileText, Trash2, MapPin } from "lucide-react";
import { useState } from "react";
import { useStore } from "@/lib/store";
import { RentalProperty, NoteInvestment } from "@/lib/types";

export default function InvestmentDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const store = useStore();
  const [deleteConfirm, setDeleteConfirm] = useState(false);

  const investment = store.getInvestment(id);

  if (!investment) {
    return (
      <div className="space-y-6 fade-in">
        <Link href="/portfolio" className="text-sm text-blue-600 hover:text-blue-700 flex items-center gap-1">
          <ArrowLeft size={14} /> Back to Portfolio
        </Link>
        <div className="stat-card flex flex-col items-center py-16">
          <FileText size={48} className="text-slate-300 mb-3" />
          <p className="text-lg font-semibold text-slate-400">Investment not found</p>
        </div>
      </div>
    );
  }

  const handleDelete = () => {
    store.deleteInvestment(investment.id);
    router.push("/portfolio");
  };

  return (
    <div className="space-y-6 fade-in">
      <div className="flex items-start justify-between">
        <div>
          <Link href="/portfolio" className="text-sm text-blue-600 hover:text-blue-700 flex items-center gap-1 mb-2">
            <ArrowLeft size={14} /> Back to Portfolio
          </Link>
          <div className="flex items-center gap-2 mb-1">
            {investment.type === "rental" ? (
              <span className="badge bg-emerald-100 text-emerald-700 flex items-center gap-1"><Home size={10} /> Rental Property</span>
            ) : (
              <span className="badge bg-violet-100 text-violet-700 flex items-center gap-1"><FileText size={10} /> Note Investment</span>
            )}
          </div>
          <h1 className="text-2xl font-bold text-slate-900">{investment.name}</h1>
          {investment.type === "rental" && (
            <p className="text-sm text-slate-500 flex items-center gap-1.5 mt-1">
              <MapPin size={13} /> {investment.address.street}, {investment.address.city}, {investment.address.state} {investment.address.zip}
            </p>
          )}
          {investment.type === "note" && (
            <p className="text-sm text-slate-500 mt-1">Borrower: {investment.borrowerName || "—"}</p>
          )}
        </div>
        <button onClick={() => setDeleteConfirm(true)} className="flex items-center gap-1.5 px-3 py-2 bg-red-50 text-red-600 rounded-lg text-sm hover:bg-red-100 transition">
          <Trash2 size={14} /> Delete
        </button>
      </div>

      {investment.type === "rental" ? (
        <RentalView investment={investment} />
      ) : (
        <NoteView investment={investment} />
      )}

      {deleteConfirm && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50" onClick={() => setDeleteConfirm(false)}>
          <div className="bg-white rounded-2xl p-6 shadow-2xl max-w-sm" onClick={(e) => e.stopPropagation()}>
            <h3 className="text-lg font-bold text-slate-900 mb-2">Delete {investment.name}?</h3>
            <p className="text-sm text-slate-500 mb-4">This will permanently delete this investment.</p>
            <div className="flex gap-3 justify-end">
              <button onClick={() => setDeleteConfirm(false)} className="px-4 py-2 text-sm text-slate-600 hover:bg-slate-100 rounded-lg">Cancel</button>
              <button onClick={handleDelete} className="px-4 py-2 text-sm bg-red-600 text-white rounded-lg hover:bg-red-700">Delete</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function RentalView({ investment }: { investment: RentalProperty }) {
  return (
    <div className="stat-card flex flex-col items-center py-12">
      <Home size={48} className="text-slate-300 mb-3" />
      <p className="text-sm text-slate-400">Rental property tabs coming next.</p>
    </div>
  );
}

function NoteView({ investment }: { investment: NoteInvestment }) {
  return (
    <div className="stat-card flex flex-col items-center py-12">
      <FileText size={48} className="text-slate-300 mb-3" />
      <p className="text-sm text-slate-400">Note investment view coming next.</p>
    </div>
  );
}
