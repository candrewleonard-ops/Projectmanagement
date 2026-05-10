"use client";

import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from "react";
import {
  Project, Contractor, TaskItem, ExpenseItem, Invoice,
  Communication, Folder, User, Organization, ProjectPhoto, ThreeDRender,
  Investment, RentalProperty, NoteInvestment, WorkOrder, WeeklyTodo,
} from "./types";
import {
  tasks as defaultTasks,
  expenses as defaultExpenses,
  invoices as defaultInvoices,
  communications as defaultComms,
  users as defaultUsers,
  organization as defaultOrg,
  currentUser,
} from "./mock-data";
import { createClient } from "./supabase/client";

// New accounts start empty — projects/contractors load from Supabase per user.
const defaultProjects: Project[] = [];
const defaultContractors: Contractor[] = [];
const defaultFolders: Folder[] = [
  { id: "f1", name: "Active Flips", color: "#22c55e", projectIds: [] },
  { id: "f2", name: "Under Evaluation", color: "#f59e0b", projectIds: [] },
  { id: "f3", name: "Completed", color: "#6366f1", projectIds: [] },
  { id: "f4", name: "On Hold", color: "#ef4444", projectIds: [] },
];

// Adapters: Supabase row -> existing client-side shape
interface DbProject {
  id: string; name: string; address_line1: string | null;
  city: string | null; state: string | null; zip: string | null;
  status: string; purchase_price: string | number | null;
  rehab_budget: string | number | null; arv: string | number | null;
  notes: string | null; created_at: string;
}
interface DbContractor {
  id: string; name: string; trade: string | null;
  phone: string | null; email: string | null;
  rating: number | null; notes: string | null;
}
function dbToProject(p: DbProject, idx: number): Project {
  return {
    id: p.id,
    name: p.name,
    folderId: "f1",
    status: "active",
    address: {
      street: p.address_line1 || "",
      city: p.city || "",
      state: p.state || "",
      zip: p.zip || "",
      lat: 33 + ((idx * 7) % 15),
      lng: -120 + ((idx * 11) % 50),
    },
    purchasePrice: Number(p.purchase_price) || 0,
    estimatedARV: Number(p.arv) || 0,
    totalBudget: Number(p.rehab_budget) || 0,
    totalSpent: 0,
    startDate: "",
    estimatedEndDate: "",
    contractorIds: [],
    photos: [],
    renders: [],
    scopeOfWork: p.notes || "",
    createdAt: (p.created_at || "").slice(0, 10),
  };
}
function dbToContractor(c: DbContractor): Contractor {
  return {
    id: c.id,
    name: c.name,
    company: c.name,
    email: c.email || "",
    phone: c.phone || "",
    city: "",
    state: "",
    zip: "",
    specialty: c.trade ? [c.trade] : [],
    rating: c.rating || 4,
    projectIds: [],
    totalJobsCompleted: 0,
    notes: c.notes || "",
  };
}

interface VitalInfo {
  projectId: string;
  electricCompany: string;
  electricAccount: string;
  waterCompany: string;
  waterAccount: string;
  gasCompany: string;
  gasAccount: string;
  keyLocation: string;
  notes: string;
}

interface StoreState {
  projects: Project[];
  contractors: Contractor[];
  tasks: TaskItem[];
  expenses: ExpenseItem[];
  invoices: Invoice[];
  communications: Communication[];
  folders: Folder[];
  users: User[];
  organization: Organization;
  vitalInfos: VitalInfo[];
  investments: Investment[];
  weeklyTodos: WeeklyTodo[];
}

interface StoreActions {
  // Projects
  addProject: (project: Project) => void;
  updateProject: (id: string, updates: Partial<Project>) => void;
  deleteProject: (id: string) => void;
  // Contractors
  addContractor: (contractor: Contractor) => void;
  updateContractor: (id: string, updates: Partial<Contractor>) => void;
  deleteContractor: (id: string) => void;
  // Tasks
  addTask: (task: TaskItem) => void;
  updateTask: (id: string, updates: Partial<TaskItem>) => void;
  deleteTask: (id: string) => void;
  // Expenses
  addExpense: (expense: ExpenseItem) => void;
  updateExpense: (id: string, updates: Partial<ExpenseItem>) => void;
  deleteExpense: (id: string) => void;
  // Invoices
  addInvoice: (invoice: Invoice) => void;
  updateInvoice: (id: string, updates: Partial<Invoice>) => void;
  // Communications
  addCommunication: (comm: Communication) => void;
  updateCommunication: (id: string, updates: Partial<Communication>) => void;
  // Users
  addUser: (user: User) => void;
  updateUser: (id: string, updates: Partial<User>) => void;
  deleteUser: (id: string) => void;
  // Folders
  addFolder: (folder: Folder) => void;
  updateFolder: (id: string, updates: Partial<Folder>) => void;
  // Vital Info
  getVitalInfo: (projectId: string) => VitalInfo;
  updateVitalInfo: (projectId: string, updates: Partial<VitalInfo>) => void;
  // Investments
  addInvestment: (investment: Investment) => void;
  updateInvestment: (id: string, updates: Partial<RentalProperty> | Partial<NoteInvestment>) => void;
  deleteInvestment: (id: string) => void;
  getInvestment: (id: string) => Investment | undefined;
  getRentalProperties: () => RentalProperty[];
  getNoteInvestments: () => NoteInvestment[];
  addWorkOrder: (investmentId: string, workOrder: WorkOrder) => void;
  updateWorkOrder: (investmentId: string, workOrderId: string, updates: Partial<WorkOrder>) => void;
  deleteWorkOrder: (investmentId: string, workOrderId: string) => void;
  // Weekly Todos
  addWeeklyTodo: (todo: WeeklyTodo) => void;
  updateWeeklyTodo: (id: string, updates: Partial<WeeklyTodo>) => void;
  deleteWeeklyTodo: (id: string) => void;
  getProjectWeeklyTodos: (projectId: string) => WeeklyTodo[];
  getVisibleWeeklyTodos: () => WeeklyTodo[];
  // Helpers
  getProject: (id: string) => Project | undefined;
  getContractor: (id: string) => Contractor | undefined;
  getProjectTasks: (projectId: string) => TaskItem[];
  getProjectExpenses: (projectId: string) => ExpenseItem[];
  getProjectComms: (projectId: string) => Communication[];
  getProjectInvoices: (projectId: string) => Invoice[];
  getContractorComms: (contractorId: string) => Communication[];
  getContractorProjects: (contractorId: string) => Project[];
  getContractorInvoices: (contractorId: string) => Invoice[];
  getActiveProjects: () => Project[];
  getTopExpenses: (limit?: number) => ExpenseItem[];
  getFolderProjects: (folderId: string) => Project[];
  currentUser: User;
}

type Store = StoreState & StoreActions;

const STORAGE_KEY_BASE = "flipcrm_data_v3";

function storageKeyFor(userId: string | null): string {
  return userId ? `${STORAGE_KEY_BASE}_${userId}` : `${STORAGE_KEY_BASE}_anon`;
}

function loadState(userId: string | null): StoreState {
  if (typeof window === "undefined") return getDefaultState();
  try {
    const raw = localStorage.getItem(storageKeyFor(userId));
    if (raw) {
      const parsed = JSON.parse(raw);
      return { ...getDefaultState(), ...parsed };
    }
  } catch {}
  return getDefaultState();
}

function getDefaultState(): StoreState {
  return {
    projects: defaultProjects,
    contractors: defaultContractors,
    tasks: defaultTasks,
    expenses: defaultExpenses,
    invoices: defaultInvoices,
    communications: defaultComms,
    folders: defaultFolders,
    users: defaultUsers,
    organization: defaultOrg,
    vitalInfos: [],
    investments: [],
    weeklyTodos: [],
  };
}

const StoreContext = createContext<Store | null>(null);

export function StoreProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<StoreState>(getDefaultState);
  const [hydrated, setHydrated] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);

  // Hydrate from per-user localStorage + Supabase on mount / auth change
  useEffect(() => {
    const supabase = createClient();
    let cancelled = false;

    async function hydrate(uid: string | null) {
      if (cancelled) return;
      setUserId(uid);
      // Start with per-user cache (or defaults if no cache).
      const cached = loadState(uid);
      setState(cached);
      setHydrated(true);

      // If logged in, fetch fresh data from Supabase and merge into state.
      if (uid) {
        try {
          const [{ data: projRows }, { data: contRows }] = await Promise.all([
            supabase.from("projects").select("*").order("created_at", { ascending: false }),
            supabase.from("contractors").select("*").order("created_at", { ascending: false }),
          ]);
          if (cancelled) return;

          const mappedProjects = ((projRows as unknown as DbProject[]) || []).map(dbToProject);
          const mappedContractors = ((contRows as unknown as DbContractor[]) || []).map(dbToContractor);

          setState((s) => ({
            ...s,
            projects: mappedProjects,
            contractors: mappedContractors,
            folders: s.folders.map((f) =>
              f.id === "f1"
                ? { ...f, projectIds: mappedProjects.map((p) => p.id) }
                : f
            ),
          }));
        } catch (e) {
          // Network/auth issue — silently fall back to cached/default state.
          console.warn("Supabase hydrate failed", e);
        }
      }
    }

    // Initial auth check.
    supabase.auth.getUser().then(({ data: { user } }) => hydrate(user?.id ?? null));

    // React to login/logout.
    const { data: sub } = supabase.auth.onAuthStateChange((_event, session) => {
      hydrate(session?.user?.id ?? null);
    });

    return () => {
      cancelled = true;
      sub.subscription.unsubscribe();
    };
  }, []);

  // Persist on change, scoped to the current user.
  useEffect(() => {
    if (hydrated) {
      try { localStorage.setItem(storageKeyFor(userId), JSON.stringify(state)); } catch {}
    }
  }, [state, hydrated, userId]);

  const update = useCallback((fn: (prev: StoreState) => StoreState) => {
    setState((prev) => fn(prev));
  }, []);

  const store: Store = {
    ...state,
    currentUser,
    // Projects
    addProject: (p) => update((s) => ({
      ...s,
      projects: [...s.projects, p],
      folders: s.folders.map((f) => f.id === p.folderId ? { ...f, projectIds: [...f.projectIds, p.id] } : f),
    })),
    updateProject: (id, u) => update((s) => ({
      ...s,
      projects: s.projects.map((p) => p.id === id ? { ...p, ...u } : p),
    })),
    deleteProject: (id) => update((s) => ({
      ...s,
      projects: s.projects.filter((p) => p.id !== id),
      tasks: s.tasks.filter((t) => t.projectId !== id),
      expenses: s.expenses.filter((e) => e.projectId !== id),
      folders: s.folders.map((f) => ({ ...f, projectIds: f.projectIds.filter((pid) => pid !== id) })),
      weeklyTodos: (s.weeklyTodos ?? []).filter((t) => t.projectId !== id),
    })),
    // Contractors
    addContractor: (c) => update((s) => ({ ...s, contractors: [...s.contractors, c] })),
    updateContractor: (id, u) => update((s) => ({
      ...s,
      contractors: s.contractors.map((c) => c.id === id ? { ...c, ...u } : c),
    })),
    deleteContractor: (id) => update((s) => ({
      ...s,
      contractors: s.contractors.filter((c) => c.id !== id),
      projects: s.projects.map((p) => ({ ...p, contractorIds: p.contractorIds.filter((cid) => cid !== id) })),
    })),
    // Tasks
    addTask: (t) => update((s) => ({ ...s, tasks: [...s.tasks, t] })),
    updateTask: (id, u) => update((s) => ({
      ...s,
      tasks: s.tasks.map((t) => t.id === id ? { ...t, ...u } : t),
    })),
    deleteTask: (id) => update((s) => ({ ...s, tasks: s.tasks.filter((t) => t.id !== id) })),
    // Expenses
    addExpense: (e) => update((s) => ({ ...s, expenses: [...s.expenses, e] })),
    updateExpense: (id, u) => update((s) => ({
      ...s,
      expenses: s.expenses.map((e) => e.id === id ? { ...e, ...u } : e),
    })),
    deleteExpense: (id) => update((s) => ({ ...s, expenses: s.expenses.filter((e) => e.id !== id) })),
    // Invoices
    addInvoice: (i) => update((s) => ({ ...s, invoices: [...s.invoices, i] })),
    updateInvoice: (id, u) => update((s) => ({
      ...s,
      invoices: s.invoices.map((i) => i.id === id ? { ...i, ...u } : i),
    })),
    // Communications
    addCommunication: (c) => update((s) => ({ ...s, communications: [...s.communications, c] })),
    updateCommunication: (id, u) => update((s) => ({
      ...s,
      communications: s.communications.map((c) => c.id === id ? { ...c, ...u } : c),
    })),
    // Users
    addUser: (u2) => update((s) => ({
      ...s,
      users: [...s.users, u2],
      organization: { ...s.organization, members: [...s.organization.members, u2.id] },
    })),
    updateUser: (id, u2) => update((s) => ({
      ...s,
      users: s.users.map((u) => u.id === id ? { ...u, ...u2 } : u),
    })),
    deleteUser: (id) => update((s) => ({
      ...s,
      users: s.users.filter((u) => u.id !== id),
      organization: { ...s.organization, members: s.organization.members.filter((m) => m !== id) },
    })),
    // Folders
    addFolder: (f) => update((s) => ({ ...s, folders: [...s.folders, f] })),
    updateFolder: (id, u) => update((s) => ({
      ...s,
      folders: s.folders.map((f) => f.id === id ? { ...f, ...u } : f),
    })),
    // Vital Info
    getVitalInfo: (projectId) => {
      const existing = state.vitalInfos.find((v) => v.projectId === projectId);
      return existing || { projectId, electricCompany: "", electricAccount: "", waterCompany: "", waterAccount: "", gasCompany: "", gasAccount: "", keyLocation: "", notes: "" };
    },
    updateVitalInfo: (projectId, updates) => update((s) => {
      const existing = s.vitalInfos.find((v) => v.projectId === projectId);
      if (existing) {
        return { ...s, vitalInfos: s.vitalInfos.map((v) => v.projectId === projectId ? { ...v, ...updates } : v) };
      }
      return { ...s, vitalInfos: [...s.vitalInfos, { projectId, electricCompany: "", electricAccount: "", waterCompany: "", waterAccount: "", gasCompany: "", gasAccount: "", keyLocation: "", notes: "", ...updates }] };
    }),
    // Investments
    addInvestment: (inv) => update((s) => ({ ...s, investments: [...(s.investments ?? []), inv] })),
    updateInvestment: (id, u) => update((s) => ({
      ...s,
      investments: (s.investments ?? []).map((inv) => inv.id === id ? { ...inv, ...u } as Investment : inv),
    })),
    deleteInvestment: (id) => update((s) => ({
      ...s,
      investments: (s.investments ?? []).filter((inv) => inv.id !== id),
    })),
    getInvestment: (id) => (state.investments ?? []).find((inv) => inv.id === id),
    getRentalProperties: () => (state.investments ?? []).filter((inv): inv is RentalProperty => inv.type === "rental"),
    getNoteInvestments: () => (state.investments ?? []).filter((inv): inv is NoteInvestment => inv.type === "note"),
    addWorkOrder: (investmentId, wo) => update((s) => ({
      ...s,
      investments: s.investments.map((inv) =>
        inv.id === investmentId && inv.type === "rental"
          ? { ...inv, workOrders: [...inv.workOrders, wo] }
          : inv
      ),
    })),
    updateWorkOrder: (investmentId, woId, updates) => update((s) => ({
      ...s,
      investments: s.investments.map((inv) =>
        inv.id === investmentId && inv.type === "rental"
          ? { ...inv, workOrders: (inv as RentalProperty).workOrders.map((wo) => wo.id === woId ? { ...wo, ...updates } : wo) }
          : inv
      ),
    })),
    deleteWorkOrder: (investmentId, woId) => update((s) => ({
      ...s,
      investments: s.investments.map((inv) =>
        inv.id === investmentId && inv.type === "rental"
          ? { ...inv, workOrders: (inv as RentalProperty).workOrders.filter((wo) => wo.id !== woId) }
          : inv
      ),
    })),
    // Weekly Todos
    addWeeklyTodo: (t) => update((s) => ({ ...s, weeklyTodos: [...(s.weeklyTodos ?? []), t] })),
    updateWeeklyTodo: (id, u) => update((s) => ({
      ...s,
      weeklyTodos: (s.weeklyTodos ?? []).map((t) => t.id === id ? { ...t, ...u } : t),
    })),
    deleteWeeklyTodo: (id) => update((s) => ({
      ...s,
      weeklyTodos: (s.weeklyTodos ?? []).filter((t) => t.id !== id),
    })),
    getProjectWeeklyTodos: (pid) => (state.weeklyTodos ?? []).filter((t) => t.projectId === pid),
    getVisibleWeeklyTodos: () => (state.weeklyTodos ?? []).filter((t) => !t.hiddenFromDashboard),
    // Helpers
    getProject: (id) => state.projects.find((p) => p.id === id),
    getContractor: (id) => state.contractors.find((c) => c.id === id),
    getProjectTasks: (pid) => state.tasks.filter((t) => t.projectId === pid),
    getProjectExpenses: (pid) => state.expenses.filter((e) => e.projectId === pid),
    getProjectComms: (pid) => state.communications.filter((c) => c.projectId === pid),
    getProjectInvoices: (pid) => state.invoices.filter((i) => i.projectId === pid),
    getContractorComms: (cid) => state.communications.filter((c) => c.contractorId === cid),
    getContractorProjects: (cid) => state.projects.filter((p) => p.contractorIds.includes(cid)),
    getContractorInvoices: (cid) => state.invoices.filter((i) => i.contractorId === cid),
    getActiveProjects: () => state.projects.filter((p) => p.status === "active"),
    getTopExpenses: (limit = 10) => [...state.expenses].sort((a, b) => b.total - a.total).slice(0, limit),
    getFolderProjects: (fid) => {
      const folder = state.folders.find((f) => f.id === fid);
      if (!folder) return [];
      return state.projects.filter((p) => folder.projectIds.includes(p.id));
    },
  };

  return <StoreContext.Provider value={store}>{children}</StoreContext.Provider>;
}

export function useStore(): Store {
  const ctx = useContext(StoreContext);
  if (!ctx) throw new Error("useStore must be used within StoreProvider");
  return ctx;
}
