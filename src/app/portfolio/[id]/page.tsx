"use client";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, Home, FileText, Trash2, MapPin, Upload, X, Camera } from "lucide-react";
import { useState, useRef } from "react";
import { useStore } from "@/lib/store";
import { RentalProperty, NoteInvestment, UtilityInfo } from "@/lib/types";
import { formatCurrency, cn } from "@/lib/utils";

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

type RentalTab = "overview" | "lease" | "vital" | "workorders" | "property";

function RentalView({ investment }: { investment: RentalProperty }) {
  const [activeTab, setActiveTab] = useState<RentalTab>("overview");

  const tabs: { key: RentalTab; label: string }[] = [
    { key: "overview", label: "Overview" },
    { key: "lease", label: "Lease Agreement" },
    { key: "vital", label: "Vital Information" },
    { key: "workorders", label: "Work Orders" },
    { key: "property", label: "Property Information" },
  ];

  return (
    <div className="space-y-6">
      <div className="border-b border-slate-200">
        <div className="flex gap-1 -mb-px overflow-x-auto">
          {tabs.map((tab) => (
            <button key={tab.key} onClick={() => setActiveTab(tab.key)}
              className={cn("px-4 py-2.5 text-sm font-medium border-b-2 transition whitespace-nowrap",
                activeTab === tab.key ? "border-blue-600 text-blue-600" : "border-transparent text-slate-500 hover:text-slate-700"
              )}>
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {activeTab === "overview" && <OverviewTab investment={investment} />}
      {activeTab === "lease" && <TabPlaceholder label="Lease Agreement" />}
      {activeTab === "vital" && <TabPlaceholder label="Vital Information" />}
      {activeTab === "workorders" && <TabPlaceholder label="Work Orders" />}
      {activeTab === "property" && <TabPlaceholder label="Property Information" />}
    </div>
  );
}

function TabPlaceholder({ label }: { label: string }) {
  return (
    <div className="stat-card flex flex-col items-center py-12">
      <p className="text-sm text-slate-400">{label} coming next.</p>
    </div>
  );
}

function OverviewTab({ investment }: { investment: RentalProperty }) {
  const store = useStore();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [mainPhotoIdx, setMainPhotoIdx] = useState(0);

  const update = (patch: Partial<RentalProperty>) => {
    store.updateInvestment(investment.id, patch);
  };

  const handlePhotoUpload = async (files: FileList | null) => {
    if (!files) return;
    const readers = Array.from(files).map((file) => new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    }));
    const newPhotos = await Promise.all(readers);
    update({ photos: [...investment.photos, ...newPhotos] });
  };

  const removePhoto = (idx: number) => {
    const next = investment.photos.filter((_, i) => i !== idx);
    update({ photos: next });
    if (mainPhotoIdx >= next.length) setMainPhotoIdx(Math.max(0, next.length - 1));
  };

  const piti = investment.principal + investment.interest + investment.taxes + investment.insurance;
  const utilities: { key: keyof Pick<RentalProperty, "gas" | "electric" | "sewer" | "water" | "trash">; label: string }[] = [
    { key: "gas", label: "Gas" },
    { key: "electric", label: "Electric" },
    { key: "sewer", label: "Sewer" },
    { key: "water", label: "Water" },
    { key: "trash", label: "Trash" },
  ];
  const landlordUtilCost = utilities
    .filter((u) => !investment[u.key].tenantPays)
    .reduce((sum, u) => sum + investment[u.key].monthlyCost, 0);
  const totalExpenses = piti + landlordUtilCost + investment.propertyManagerFee;
  const netCashflow = investment.monthlyRent - totalExpenses;
  const cashflowPositive = netCashflow >= 0;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Photos */}
        <div className="stat-card">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-semibold text-slate-700">Property Photos</h3>
            <button onClick={() => fileInputRef.current?.click()} className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 text-white rounded-lg text-xs font-medium hover:bg-blue-700 transition">
              <Upload size={12} /> Upload Photos
            </button>
            <input ref={fileInputRef} type="file" accept="image/*" multiple className="hidden" onChange={(e) => { handlePhotoUpload(e.target.files); e.target.value = ""; }} />
          </div>
          {investment.photos.length === 0 ? (
            <button onClick={() => fileInputRef.current?.click()} className="w-full aspect-[4/3] bg-slate-100 border-2 border-dashed border-slate-300 rounded-lg flex flex-col items-center justify-center text-slate-400 hover:bg-slate-50 hover:border-blue-300 transition">
              <Camera size={40} className="mb-2" />
              <span className="text-sm font-medium">Click to upload property photos</span>
              <span className="text-xs mt-1">Exterior, interior, rooms, etc.</span>
            </button>
          ) : (
            <div className="space-y-2">
              <div className="relative aspect-[4/3] rounded-lg overflow-hidden bg-slate-100">
                <img src={investment.photos[mainPhotoIdx]} alt="Property" className="w-full h-full object-cover" />
                <button onClick={() => removePhoto(mainPhotoIdx)} className="absolute top-2 right-2 w-8 h-8 rounded-full bg-black/60 text-white flex items-center justify-center hover:bg-black/80">
                  <X size={14} />
                </button>
              </div>
              {investment.photos.length > 1 && (
                <div className="flex gap-2 overflow-x-auto pb-1">
                  {investment.photos.map((src, i) => (
                    <button key={i} onClick={() => setMainPhotoIdx(i)}
                      className={cn("flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden border-2 transition",
                        mainPhotoIdx === i ? "border-blue-600" : "border-transparent opacity-70 hover:opacity-100")}>
                      <img src={src} alt="" className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* PITI + Rent */}
        <div className="space-y-4">
          <div className="stat-card">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-semibold text-slate-700">Monthly Payment (PITI)</h3>
              <span className="text-sm font-bold text-slate-900">{formatCurrency(piti)}</span>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <NumberField label="Principal" value={investment.principal} onChange={(v) => update({ principal: v })} />
              <NumberField label="Interest" value={investment.interest} onChange={(v) => update({ interest: v })} />
              <NumberField label="Taxes" value={investment.taxes} onChange={(v) => update({ taxes: v })} />
              <NumberField label="Insurance" value={investment.insurance} onChange={(v) => update({ insurance: v })} />
            </div>
          </div>

          <div className="stat-card">
            <h3 className="text-sm font-semibold text-slate-700 mb-3">Monthly Rent Collected</h3>
            <NumberField label="Rent" value={investment.monthlyRent} onChange={(v) => update({ monthlyRent: v })} accent="emerald" />
          </div>

          <div className="stat-card">
            <h3 className="text-sm font-semibold text-slate-700 mb-3">Property Manager</h3>
            <NumberField label="Monthly PM Fee" value={investment.propertyManagerFee} onChange={(v) => update({ propertyManagerFee: v })} />
          </div>
        </div>
      </div>

      {/* Utilities */}
      <div className="stat-card">
        <h3 className="text-sm font-semibold text-slate-700 mb-4">Utilities</h3>
        <div className="space-y-2">
          <div className="grid grid-cols-[120px_1fr_1fr_auto] gap-3 text-xs font-medium text-slate-400 uppercase pb-2 border-b border-slate-100">
            <div>Utility</div>
            <div>Tenant Pays</div>
            <div>Landlord Pays</div>
            <div className="text-right">Cost / mo</div>
          </div>
          {utilities.map((u) => {
            const info: UtilityInfo = investment[u.key];
            return (
              <div key={u.key} className="grid grid-cols-[120px_1fr_1fr_auto] gap-3 items-center py-2 border-b border-slate-50 last:border-0">
                <div className="text-sm font-medium text-slate-700">{u.label}</div>
                <label className="flex items-center gap-2 text-sm text-slate-600 cursor-pointer">
                  <input type="checkbox" checked={info.tenantPays} onChange={(e) => update({ [u.key]: { ...info, tenantPays: e.target.checked } } as Partial<RentalProperty>)}
                    className="w-4 h-4 rounded text-emerald-600" />
                  Tenant pays
                </label>
                <label className="flex items-center gap-2 text-sm text-slate-600 cursor-pointer">
                  <input type="checkbox" checked={!info.tenantPays} onChange={(e) => update({ [u.key]: { ...info, tenantPays: !e.target.checked } } as Partial<RentalProperty>)}
                    className="w-4 h-4 rounded text-blue-600" />
                  Landlord pays
                </label>
                <div className="w-32">
                  <input type="number" disabled={info.tenantPays} value={info.monthlyCost || ""} placeholder="$ 0"
                    onChange={(e) => update({ [u.key]: { ...info, monthlyCost: parseFloat(e.target.value) || 0 } } as Partial<RentalProperty>)}
                    className={cn("w-full border border-slate-300 rounded-lg px-3 py-1.5 text-sm text-right",
                      info.tenantPays && "bg-slate-50 text-slate-300")} />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Cashflow Line */}
      <div className={cn("stat-card", cashflowPositive ? "ring-2 ring-emerald-200 bg-emerald-50/30" : "ring-2 ring-red-200 bg-red-50/30")}>
        <h3 className="text-sm font-semibold text-slate-700 mb-4">Monthly Cash Flow</h3>
        <div className="flex items-center justify-between flex-wrap gap-3 text-lg font-semibold">
          <div className="flex items-center gap-2">
            <span className="text-emerald-700">{formatCurrency(investment.monthlyRent)}</span>
            <span className="text-xs text-slate-400 font-normal">gross rent</span>
          </div>
          <span className="text-slate-400">−</span>
          <div className="flex items-center gap-2">
            <span className="text-red-600">{formatCurrency(totalExpenses)}</span>
            <span className="text-xs text-slate-400 font-normal">expenses</span>
          </div>
          <span className="text-slate-400">=</span>
          <div className="flex items-center gap-2">
            <span className={cn("text-2xl font-bold", cashflowPositive ? "text-emerald-600" : "text-red-600")}>{formatCurrency(netCashflow)}</span>
            <span className="text-xs text-slate-400 font-normal">net cash flow</span>
          </div>
        </div>
        <div className="mt-4 pt-4 border-t border-slate-200 grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
          <ExpenseLine label="PITI" value={piti} color="text-slate-600" />
          <ExpenseLine label="Landlord Utilities" value={landlordUtilCost} color="text-amber-600" />
          <ExpenseLine label="Property Mgr" value={investment.propertyManagerFee} color="text-violet-600" />
          <ExpenseLine label="Total Expenses" value={totalExpenses} color="text-red-600" bold />
        </div>
      </div>
    </div>
  );
}

function NumberField({ label, value, onChange, accent }: { label: string; value: number; onChange: (v: number) => void; accent?: "emerald" }) {
  return (
    <div>
      <label className="text-xs text-slate-500 block mb-1">{label}</label>
      <div className="relative">
        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm">$</span>
        <input type="number" value={value || ""} placeholder="0"
          onChange={(e) => onChange(parseFloat(e.target.value) || 0)}
          className={cn("w-full border border-slate-300 rounded-lg pl-7 pr-3 py-2 text-sm font-medium",
            accent === "emerald" && "text-emerald-700")} />
      </div>
    </div>
  );
}

function ExpenseLine({ label, value, color, bold }: { label: string; value: number; color: string; bold?: boolean }) {
  return (
    <div>
      <p className="text-xs text-slate-400">{label}</p>
      <p className={cn("font-semibold", color, bold && "text-base")}>{formatCurrency(value)}</p>
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
