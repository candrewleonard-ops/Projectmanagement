// ============================================================
// FlipCRM – Core Type Definitions
// ============================================================

// ---- Roles & Users ----
export type UserRole = "admin" | "project_manager" | "viewer";

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: UserRole;
  avatarUrl?: string;
  organizationId: string;
  createdAt: string;
}

export interface Organization {
  id: string;
  name: string;
  ownerUserId: string;
  members: string[]; // user IDs
  createdAt: string;
}

// ---- Folders / Library ----
export interface Folder {
  id: string;
  name: string;
  color: string;
  projectIds: string[];
}

// ---- Property / Project ----
export type ProjectStatus = "active" | "completed" | "on_hold" | "archived";

export interface PropertyAddress {
  street: string;
  city: string;
  state: string;
  zip: string;
  lat: number;
  lng: number;
}

export interface ThreeDRender {
  id: string;
  label: string; // e.g. "Post Trashout", "50% Complete", "100% Complete"
  url: string;
  capturedAt: string;
}

export interface ProjectPhoto {
  id: string;
  url: string;
  caption: string;
  uploadedAt: string;
  uploadedBy: string;
}

export interface Project {
  id: string;
  name: string;
  address: PropertyAddress;
  status: ProjectStatus;
  folderId: string;
  purchasePrice: number;
  estimatedARV: number; // After Repair Value
  totalBudget: number;
  totalSpent: number;
  startDate: string;
  estimatedEndDate: string;
  completedDate?: string;
  contractorIds: string[];
  photos: ProjectPhoto[];
  renders: ThreeDRender[];
  scopeOfWork: string;
  scopeAttachmentName?: string;
  createdAt: string;
}

// ---- Work Orders / Tasks ----
export type TaskStatus = "completed" | "in_progress" | "scheduled" | "blocked" | "not_started";
export type TaskPriority = "critical" | "high" | "medium" | "low";
export type QualityCheck = "passed" | "failed" | "pending";

export interface TaskItem {
  id: string;
  projectId: string;
  title: string;
  description: string;
  status: TaskStatus;
  priority: TaskPriority;
  qualityCheck: QualityCheck;
  assignedContractorId?: string;
  scheduledDate?: string;
  completedDate?: string;
  orderConfirmed: boolean;
  estimatedCost: number;
  actualCost: number;
  category: string; // e.g. "HVAC", "Plumbing", "Electrical"
}

// ---- Contractors ----
export interface Contractor {
  id: string;
  name: string;
  company: string;
  email: string;
  phone: string;
  city: string;
  state: string;
  zip: string;
  specialty: string[];
  rating: number; // 1-5
  avatarUrl?: string;
  projectIds: string[];
  totalJobsCompleted: number;
  notes: string;
}

// ---- Expenses / Line Items ----
export interface ExpenseItem {
  id: string;
  projectId: string;
  description: string;
  category: string;
  unitPrice: number;
  quantity: number;
  total: number;
  vendor: string;
  purchasedDate: string;
  receiptUrl?: string;
}

// ---- Invoices ----
export type InvoiceStatus = "draft" | "sent" | "approved" | "paid" | "disputed";

export interface InvoiceLineItem {
  id: string;
  description: string;
  category: string;
  subcategory: string;
  unitPrice: number;
  quantity: number;
  total: number;
}

export interface Invoice {
  id: string;
  projectId: string;
  contractorId: string;
  status: InvoiceStatus;
  lineItems: InvoiceLineItem[];
  subtotal: number;
  depositAmount: number; // 25%
  midpointAmount: number; // 25%
  completionAmount: number; // 50%
  depositPaid: boolean;
  midpointPaid: boolean;
  completionPaid: boolean;
  terms: string;
  createdAt: string;
  sentAt?: string;
}

// ---- Communications ----
export type CommType = "sms" | "call" | "email" | "note";
export type CommDirection = "inbound" | "outbound";
export type CallStatus = "completed" | "missed" | "scheduled" | "voicemail";

export interface Communication {
  id: string;
  projectId?: string;
  contractorId: string;
  type: CommType;
  direction: CommDirection;
  callStatus?: CallStatus;
  content: string;
  timestamp: string;
  duration?: number; // seconds for calls
  read: boolean;
  scheduledFor?: string;
}

// ---- Service Catalog ----
export interface ServiceCategory {
  id: string;
  name: string;
  icon: string;
  services: ServiceItem[];
}

export interface ServiceItem {
  id: string;
  name: string;
  defaultPrice: number;
  unit: string; // "per unit", "per hour", "flat rate"
}

// ---- Heatmap ----
export interface HeatmapPoint {
  id: string;
  projectId: string;
  lat: number;
  lng: number;
  intensity: number; // 0-1, based on urgency
  hasHotTasks: boolean;
  hasUnconfirmedOrders: boolean;
  label: string;
}
