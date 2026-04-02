import {
  User, Organization, Folder, Project, TaskItem, Contractor,
  ExpenseItem, Invoice, Communication, HeatmapPoint,
} from "./types";
import { INVOICE_TERMS } from "./invoice-terms";

// ---- Current User ----
export const currentUser: User = {
  id: "u1",
  name: "Chris Leonard",
  email: "chris@flipcrm.io",
  phone: "+15551234567",
  role: "admin",
  organizationId: "org1",
  createdAt: "2025-06-01",
};

export const organization: Organization = {
  id: "org1",
  name: "Leonard Property Group",
  ownerUserId: "u1",
  members: ["u1", "u2", "u3"],
  createdAt: "2025-06-01",
};

export const users: User[] = [
  currentUser,
  { id: "u2", name: "Sarah Mitchell", email: "sarah@flipcrm.io", phone: "+15559876543", role: "project_manager", organizationId: "org1", createdAt: "2025-07-15" },
  { id: "u3", name: "James Rodriguez", email: "james@flipcrm.io", phone: "+15555551234", role: "viewer", organizationId: "org1", createdAt: "2025-09-01" },
];

// ---- Folders ----
export const folders: Folder[] = [
  { id: "f1", name: "Active Flips", color: "#22c55e", projectIds: ["p1", "p2", "p3", "p4"] },
  { id: "f2", name: "Under Evaluation", color: "#f59e0b", projectIds: ["p5"] },
  { id: "f3", name: "Completed 2025", color: "#6366f1", projectIds: ["p6", "p7"] },
  { id: "f4", name: "On Hold", color: "#ef4444", projectIds: ["p8"] },
];

// ---- Projects ----
export const projects: Project[] = [
  {
    id: "p1", name: "Oakwood Revival", folderId: "f1", status: "active",
    address: { street: "1423 Oakwood Dr", city: "Atlanta", state: "GA", zip: "30316", lat: 33.749, lng: -84.388 },
    purchasePrice: 185000, estimatedARV: 345000, totalBudget: 78000, totalSpent: 42300,
    startDate: "2026-01-15", estimatedEndDate: "2026-05-01",
    contractorIds: ["c1", "c2", "c3"], photos: [
      { id: "ph1", url: "/photos/oakwood-before.jpg", caption: "Front exterior – before", uploadedAt: "2026-01-16", uploadedBy: "u1" },
      { id: "ph2", url: "/photos/oakwood-kitchen.jpg", caption: "Kitchen demo complete", uploadedAt: "2026-02-10", uploadedBy: "u2" },
    ],
    renders: [
      { id: "r1", label: "Post Trashout", url: "https://my.matterport.com/show/?m=example1", capturedAt: "2026-01-20" },
      { id: "r2", label: "50% Complete", url: "https://my.matterport.com/show/?m=example2", capturedAt: "2026-03-05" },
    ],
    createdAt: "2026-01-10",
  },
  {
    id: "p2", name: "Maple Street Rehab", folderId: "f1", status: "active",
    address: { street: "782 Maple St", city: "Dallas", state: "TX", zip: "75201", lat: 32.78, lng: -96.797 },
    purchasePrice: 210000, estimatedARV: 390000, totalBudget: 95000, totalSpent: 18750,
    startDate: "2026-02-20", estimatedEndDate: "2026-07-15",
    contractorIds: ["c2", "c4"], photos: [],
    renders: [
      { id: "r3", label: "Post Trashout", url: "https://my.matterport.com/show/?m=example3", capturedAt: "2026-02-25" },
    ],
    createdAt: "2026-02-18",
  },
  {
    id: "p3", name: "Sunset Blvd Flip", folderId: "f1", status: "active",
    address: { street: "4501 Sunset Blvd", city: "Phoenix", state: "AZ", zip: "85004", lat: 33.4484, lng: -112.074 },
    purchasePrice: 165000, estimatedARV: 295000, totalBudget: 62000, totalSpent: 55800,
    startDate: "2025-11-01", estimatedEndDate: "2026-04-10",
    contractorIds: ["c1", "c5"], photos: [],
    renders: [
      { id: "r4", label: "Post Trashout", url: "https://my.matterport.com/show/?m=example4", capturedAt: "2025-11-05" },
      { id: "r5", label: "50% Complete", url: "https://my.matterport.com/show/?m=example5", capturedAt: "2026-01-15" },
      { id: "r6", label: "100% Complete", url: "https://my.matterport.com/show/?m=example6", capturedAt: "2026-03-28" },
    ],
    createdAt: "2025-10-28",
  },
  {
    id: "p4", name: "Riverside Cottage", folderId: "f1", status: "active",
    address: { street: "88 River Rd", city: "Nashville", state: "TN", zip: "37203", lat: 36.1627, lng: -86.7816 },
    purchasePrice: 230000, estimatedARV: 415000, totalBudget: 85000, totalSpent: 5200,
    startDate: "2026-03-20", estimatedEndDate: "2026-08-30",
    contractorIds: ["c3"], photos: [],
    renders: [],
    createdAt: "2026-03-18",
  },
  {
    id: "p5", name: "Elm Ave Prospect", folderId: "f2", status: "on_hold",
    address: { street: "320 Elm Ave", city: "Charlotte", state: "NC", zip: "28202", lat: 35.2271, lng: -80.8431 },
    purchasePrice: 0, estimatedARV: 310000, totalBudget: 0, totalSpent: 0,
    startDate: "", estimatedEndDate: "",
    contractorIds: [], photos: [],
    renders: [],
    createdAt: "2026-03-25",
  },
  {
    id: "p6", name: "Birch Lane Beauty", folderId: "f3", status: "completed",
    address: { street: "155 Birch Ln", city: "Tampa", state: "FL", zip: "33602", lat: 27.9506, lng: -82.4572 },
    purchasePrice: 195000, estimatedARV: 355000, totalBudget: 72000, totalSpent: 68400,
    startDate: "2025-05-01", estimatedEndDate: "2025-10-15", completedDate: "2025-10-10",
    contractorIds: ["c1", "c2"], photos: [],
    renders: [],
    createdAt: "2025-04-28",
  },
  {
    id: "p7", name: "Pine Court Reno", folderId: "f3", status: "completed",
    address: { street: "67 Pine Ct", city: "Denver", state: "CO", zip: "80202", lat: 39.7392, lng: -104.9903 },
    purchasePrice: 275000, estimatedARV: 480000, totalBudget: 110000, totalSpent: 104500,
    startDate: "2025-03-15", estimatedEndDate: "2025-09-01", completedDate: "2025-08-28",
    contractorIds: ["c4", "c5"], photos: [],
    renders: [],
    createdAt: "2025-03-10",
  },
  {
    id: "p8", name: "Willow Park Stall", folderId: "f4", status: "on_hold",
    address: { street: "410 Willow Park Dr", city: "Miami", state: "FL", zip: "33101", lat: 25.7617, lng: -80.1918 },
    purchasePrice: 310000, estimatedARV: 520000, totalBudget: 105000, totalSpent: 32000,
    startDate: "2025-12-01", estimatedEndDate: "2026-06-01",
    contractorIds: ["c1", "c3"], photos: [],
    renders: [],
    createdAt: "2025-11-28",
  },
];

// ---- Tasks ----
export const tasks: TaskItem[] = [
  // Oakwood Revival (p1)
  { id: "t1", projectId: "p1", title: "Kitchen Cabinet Installation", description: "Install shaker-style cabinets", status: "in_progress", priority: "high", qualityCheck: "pending", assignedContractorId: "c1", scheduledDate: "2026-04-02", estimatedCost: 6500, actualCost: 6500, category: "Kitchen", orderConfirmed: true },
  { id: "t2", projectId: "p1", title: "Granite Countertop Install", description: "Measure, template, and install granite countertops", status: "scheduled", priority: "high", qualityCheck: "pending", assignedContractorId: "c1", scheduledDate: "2026-04-08", estimatedCost: 4500, actualCost: 0, category: "Kitchen", orderConfirmed: false },
  { id: "t3", projectId: "p1", title: "Full Electrical Rewire", description: "Rewire entire house to code", status: "completed", priority: "critical", qualityCheck: "passed", assignedContractorId: "c2", completedDate: "2026-02-28", estimatedCost: 12000, actualCost: 11800, category: "Electrical", orderConfirmed: true },
  { id: "t4", projectId: "p1", title: "HVAC System Replacement", description: "Remove old unit, install new 3-ton system", status: "completed", priority: "critical", qualityCheck: "passed", assignedContractorId: "c3", completedDate: "2026-03-15", estimatedCost: 5500, actualCost: 5500, category: "HVAC", orderConfirmed: true },
  { id: "t5", projectId: "p1", title: "Interior Paint – Full House", description: "Prep and paint all rooms, SW Agreeable Gray", status: "scheduled", priority: "medium", qualityCheck: "pending", assignedContractorId: "c1", scheduledDate: "2026-04-15", estimatedCost: 4200, actualCost: 0, category: "Painting", orderConfirmed: true },
  { id: "t6", projectId: "p1", title: "LVP Flooring Install", description: "Install luxury vinyl plank throughout", status: "blocked", priority: "critical", qualityCheck: "pending", assignedContractorId: "c1", scheduledDate: "2026-04-05", estimatedCost: 7200, actualCost: 0, category: "Flooring", orderConfirmed: false },

  // Maple Street (p2)
  { id: "t7", projectId: "p2", title: "Full Interior Demo", description: "Gut interior to studs", status: "completed", priority: "high", qualityCheck: "passed", assignedContractorId: "c4", completedDate: "2026-03-05", estimatedCost: 5000, actualCost: 4800, category: "Demolition", orderConfirmed: true },
  { id: "t8", projectId: "p2", title: "Plumbing Re-Pipe (PEX)", description: "Replace all supply lines with PEX", status: "in_progress", priority: "critical", qualityCheck: "pending", assignedContractorId: "c2", scheduledDate: "2026-03-28", estimatedCost: 5500, actualCost: 0, category: "Plumbing", orderConfirmed: true },
  { id: "t9", projectId: "p2", title: "Roof Replacement", description: "30-year architectural shingles", status: "scheduled", priority: "high", qualityCheck: "pending", scheduledDate: "2026-04-20", estimatedCost: 9500, actualCost: 0, category: "Roofing", orderConfirmed: false },

  // Sunset Blvd (p3)
  { id: "t10", projectId: "p3", title: "Final Punch List", description: "Address all remaining items", status: "in_progress", priority: "high", qualityCheck: "pending", assignedContractorId: "c5", scheduledDate: "2026-04-02", estimatedCost: 1500, actualCost: 0, category: "General", orderConfirmed: true },
  { id: "t11", projectId: "p3", title: "Exterior Paint Touch-Up", description: "Touch up all exterior trim", status: "scheduled", priority: "medium", qualityCheck: "pending", assignedContractorId: "c5", scheduledDate: "2026-04-05", estimatedCost: 800, actualCost: 0, category: "Painting", orderConfirmed: true },

  // Riverside Cottage (p4)
  { id: "t12", projectId: "p4", title: "Trashout & Junk Removal", description: "Clear all debris from property", status: "in_progress", priority: "critical", qualityCheck: "pending", assignedContractorId: "c3", scheduledDate: "2026-04-01", estimatedCost: 2500, actualCost: 0, category: "Demolition", orderConfirmed: true },
  { id: "t13", projectId: "p4", title: "Property Inspection", description: "Full inspection report", status: "scheduled", priority: "high", qualityCheck: "pending", scheduledDate: "2026-04-10", estimatedCost: 450, actualCost: 0, category: "General", orderConfirmed: false },
];

// ---- Contractors ----
export const contractors: Contractor[] = [
  {
    id: "c1", name: "Mike Torres", company: "Torres General Contracting", email: "mike@torrescontracting.com", phone: "+15551001001",
    specialty: ["Kitchen", "Flooring", "Painting", "General"], rating: 4.8, projectIds: ["p1", "p3", "p6", "p8"],
    totalJobsCompleted: 34, notes: "Reliable GC. Prefers 2-week lead time for material orders.",
  },
  {
    id: "c2", name: "Angela Washington", company: "Sparks Electrical & Plumbing", email: "angela@sparksep.com", phone: "+15551002002",
    specialty: ["Electrical", "Plumbing"], rating: 4.9, projectIds: ["p1", "p2", "p6"],
    totalJobsCompleted: 28, notes: "Licensed Master Electrician & Plumber. Excellent code compliance record.",
  },
  {
    id: "c3", name: "Dave Kowalski", company: "Kowalski HVAC & Demo", email: "dave@kowalskihvac.com", phone: "+15551003003",
    specialty: ["HVAC", "Demolition"], rating: 4.5, projectIds: ["p1", "p4", "p8"],
    totalJobsCompleted: 19, notes: "Strong demo crew. HVAC installs run clean.",
  },
  {
    id: "c4", name: "Rosa Hernandez", company: "Hernandez Roofing & Exteriors", email: "rosa@hernandezroofing.com", phone: "+15551004004",
    specialty: ["Roofing", "Exterior", "Demolition"], rating: 4.6, projectIds: ["p2", "p7"],
    totalJobsCompleted: 22, notes: "Family-owned. Very competitive pricing on roofing.",
  },
  {
    id: "c5", name: "Tyler Banks", company: "Banks Finish Works", email: "tyler@banksfinish.com", phone: "+15551005005",
    specialty: ["Bathroom", "Kitchen", "Painting", "General"], rating: 4.7, projectIds: ["p3", "p7"],
    totalJobsCompleted: 15, notes: "Detail-oriented finish carpenter. Great for punch list and final touches.",
  },
];

// ---- Expenses ----
export const expenses: ExpenseItem[] = [
  { id: "e1", projectId: "p1", description: "Shaker Cabinets (Full Kitchen Set)", category: "Kitchen", unitPrice: 4200, quantity: 1, total: 4200, vendor: "CabinetWorld", purchasedDate: "2026-03-20" },
  { id: "e2", projectId: "p1", description: "200 AMP Electrical Panel", category: "Electrical", unitPrice: 1800, quantity: 1, total: 1800, vendor: "Home Depot Pro", purchasedDate: "2026-02-10" },
  { id: "e3", projectId: "p1", description: "Carrier 3-Ton AC Unit", category: "HVAC", unitPrice: 3200, quantity: 1, total: 3200, vendor: "?"   , purchasedDate: "2026-03-01" },
  { id: "e4", projectId: "p1", description: "LVP Flooring (1200 sqft)", category: "Flooring", unitPrice: 3.50, quantity: 1200, total: 4200, vendor: "Floor & Decor", purchasedDate: "2026-03-25" },
  { id: "e5", projectId: "p1", description: "Romex Wire (14/2, 12/2 spools)", category: "Electrical", unitPrice: 280, quantity: 8, total: 2240, vendor: "Home Depot Pro", purchasedDate: "2026-02-08" },
  { id: "e6", projectId: "p2", description: "PEX Manifold + Fittings Kit", category: "Plumbing", unitPrice: 1200, quantity: 1, total: 1200, vendor: "Ferguson Supply", purchasedDate: "2026-03-15" },
  { id: "e7", projectId: "p2", description: "Dumpster Rental (2 weeks)", category: "Demolition", unitPrice: 550, quantity: 2, total: 1100, vendor: "WM", purchasedDate: "2026-02-28" },
  { id: "e8", projectId: "p3", description: "Full Kitchen Remodel Package", category: "Kitchen", unitPrice: 25000, quantity: 1, total: 25000, vendor: "IKEA Pro Services", purchasedDate: "2025-12-15" },
  { id: "e9", projectId: "p3", description: "Bathroom Vanities x3", category: "Bathroom", unitPrice: 650, quantity: 3, total: 1950, vendor: "Wayfair Pro", purchasedDate: "2026-01-10" },
  { id: "e10", projectId: "p4", description: "Junk Removal Service", category: "Demolition", unitPrice: 2500, quantity: 1, total: 2500, vendor: "1-800-GOT-JUNK", purchasedDate: "2026-03-28" },
  { id: "e11", projectId: "p6", description: "Roof Replacement (Shingle)", category: "Roofing", unitPrice: 9500, quantity: 1, total: 9500, vendor: "Hernandez Roofing", purchasedDate: "2025-07-20" },
  { id: "e12", projectId: "p7", description: "Quartz Countertops", category: "Kitchen", unitPrice: 5500, quantity: 1, total: 5500, vendor: "MSI Surfaces", purchasedDate: "2025-06-15" },
];

// ---- Invoices ----
export const invoices: Invoice[] = [
  {
    id: "inv1", projectId: "p1", contractorId: "c2", status: "paid",
    lineItems: [
      { id: "li1", description: "Full Electrical Rewire", category: "Electrical", subcategory: "Rewire", unitPrice: 12000, quantity: 1, total: 12000 },
    ],
    subtotal: 12000, depositAmount: 3000, midpointAmount: 3000, completionAmount: 6000,
    depositPaid: true, midpointPaid: true, completionPaid: true,
    terms: INVOICE_TERMS, createdAt: "2026-02-01", sentAt: "2026-02-01",
  },
  {
    id: "inv2", projectId: "p1", contractorId: "c3", status: "approved",
    lineItems: [
      { id: "li2", description: "Full AC System Installation", category: "HVAC", subcategory: "Installation", unitPrice: 5500, quantity: 1, total: 5500 },
    ],
    subtotal: 5500, depositAmount: 1375, midpointAmount: 1375, completionAmount: 2750,
    depositPaid: true, midpointPaid: true, completionPaid: false,
    terms: INVOICE_TERMS, createdAt: "2026-02-28", sentAt: "2026-03-01",
  },
];

// ---- Communications ----
export const communications: Communication[] = [
  { id: "comm1", projectId: "p1", contractorId: "c1", type: "sms", direction: "outbound", content: "Hey Mike, cabinets arrived at the site. Can you start install tomorrow?", timestamp: "2026-04-01T14:30:00Z", read: true },
  { id: "comm2", projectId: "p1", contractorId: "c1", type: "sms", direction: "inbound", content: "Yep, I'll have my crew there at 8am. Need to confirm the backsplash tile is on site too.", timestamp: "2026-04-01T14:45:00Z", read: true },
  { id: "comm3", projectId: "p1", contractorId: "c1", type: "sms", direction: "outbound", content: "Backsplash tile is on backorder. Let's skip that for now and focus on cabinets + counters.", timestamp: "2026-04-01T15:00:00Z", read: true },
  { id: "comm4", projectId: "p1", contractorId: "c2", type: "call", direction: "outbound", callStatus: "completed", content: "Discussed final walkthrough for electrical inspection.", timestamp: "2026-03-28T10:00:00Z", duration: 420, read: true },
  { id: "comm5", projectId: "p2", contractorId: "c2", type: "sms", direction: "inbound", content: "PEX manifold install is done. Moving to bathroom supply lines tomorrow.", timestamp: "2026-04-01T16:20:00Z", read: false },
  { id: "comm6", projectId: "p1", contractorId: "c3", type: "call", direction: "inbound", callStatus: "missed", content: "Missed call from Dave", timestamp: "2026-04-02T09:15:00Z", read: false },
  { id: "comm7", projectId: "p3", contractorId: "c5", type: "sms", direction: "inbound", content: "Punch list items are almost done. Should finish by EOD Thursday.", timestamp: "2026-04-01T11:00:00Z", read: true },
  { id: "comm8", contractorId: "c4", type: "email", direction: "outbound", content: "Rosa, sending over the scope for the Maple St roof replacement. Please review and send your bid.", timestamp: "2026-03-30T09:00:00Z", read: true },
  { id: "comm9", projectId: "p4", contractorId: "c3", type: "call", direction: "outbound", callStatus: "scheduled", content: "Scheduled call to discuss trashout progress", timestamp: "2026-04-03T14:00:00Z", read: true, scheduledFor: "2026-04-03T14:00:00Z" },
  { id: "comm10", projectId: "p1", contractorId: "c1", type: "note", direction: "outbound", content: "Mike mentioned he has a flooring subcontractor who can do the LVP at $5.50/sqft installed. Worth considering.", timestamp: "2026-03-29T16:00:00Z", read: true },
];

// ---- Heatmap Points ----
export const heatmapPoints: HeatmapPoint[] = projects
  .filter((p) => p.status === "active" || p.status === "on_hold")
  .map((p) => {
    const projectTasks = tasks.filter((t) => t.projectId === p.id);
    const hasHot = projectTasks.some(
      (t) => t.priority === "critical" && (t.status === "in_progress" || t.status === "blocked")
    );
    const hasUnconfirmed = projectTasks.some((t) => !t.orderConfirmed && t.status !== "completed");
    return {
      id: `hp-${p.id}`,
      projectId: p.id,
      lat: p.address.lat,
      lng: p.address.lng,
      intensity: hasHot ? 1 : hasUnconfirmed ? 0.6 : 0.2,
      hasHotTasks: hasHot,
      hasUnconfirmedOrders: hasUnconfirmed,
      label: `${p.name} – ${p.address.city}, ${p.address.state}`,
    };
  });

// ---- Helper Functions ----
export function getProject(id: string) { return projects.find((p) => p.id === id); }
export function getContractor(id: string) { return contractors.find((c) => c.id === id); }
export function getProjectTasks(projectId: string) { return tasks.filter((t) => t.projectId === projectId); }
export function getProjectExpenses(projectId: string) { return expenses.filter((e) => e.projectId === projectId); }
export function getContractorComms(contractorId: string) { return communications.filter((c) => c.contractorId === contractorId); }
export function getProjectComms(projectId: string) { return communications.filter((c) => c.projectId === projectId); }
export function getContractorProjects(contractorId: string) { return projects.filter((p) => p.contractorIds.includes(contractorId)); }
export function getProjectInvoices(projectId: string) { return invoices.filter((i) => i.projectId === projectId); }
export function getContractorInvoices(contractorId: string) { return invoices.filter((i) => i.contractorId === contractorId); }
export function getActiveProjects() { return projects.filter((p) => p.status === "active"); }
export function getTopExpenses(limit = 10) { return [...expenses].sort((a, b) => b.total - a.total).slice(0, limit); }
export function getFolderProjects(folderId: string) { const folder = folders.find((f) => f.id === folderId); if (!folder) return []; return projects.filter((p) => folder.projectIds.includes(p.id)); }
