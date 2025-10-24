/**
 * TypeScript Types for HVAC Management System Frontend
 * Auto-generated from Backend DTOs and Prisma Schema
 * Last Updated: October 20, 2025
 */

// ============================================================================
// AUTHENTICATION & AUTHORIZATION
// ============================================================================

export interface User {
  id: string;
  email: string;
  tenantId: string;
  
  // Profile information
  firstName?: string;
  lastName?: string;
  phone?: string;
  avatarUrl?: string;
  bio?: string;
  timezone?: string;
  
  // Organization structure
  departmentId?: string;
  teamId?: string;
  managerId?: string;
  jobTitle?: string;
  employeeNumber?: string;
  
  // Roles & permissions
  roles?: Array<{
    id: string;
    name: string;
    displayName?: string;
    color?: string;
  }>;
  isSuperAdmin?: boolean;
  
  // MFA
  mfaEnabled?: boolean;
  mfaMethod?: string;
  
  // Status & security
  isActive: boolean;
  emailVerified?: boolean;
  emailVerifiedAt?: string;
  lastLoginAt?: string;
  lastLoginIp?: string;
  passwordChangedAt?: string;
  
  // Preferences
  preferences?: Record<string, any>;
  
  createdAt?: string;
  updatedAt?: string;
  deletedAt?: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  firstName?: string;
  lastName?: string;
  tenantId?: string;
}

export interface AuthResponse {
  access_token: string;
}

export interface Role {
  id: string;
  name: string;
  description?: string;
  isSystem: boolean;
  permissions: Permission[];
  createdAt: string;
  updatedAt: string;
}

export interface Permission {
  id: string;
  name: string;
  resource: string;
  action: string;
  description?: string;
  createdAt: string;
}

// ============================================================================
// WORK ORDERS
// ============================================================================

export interface WorkOrder {
  id: string;
  tenantId: string;
  number: string;
  title: string;
  description?: string;
  status: WorkOrderStatus;
  priority: WorkOrderPriority;
  type: string;
  
  // Customer & location
  customerId?: string;
  customerName?: string;
  address?: string;
  
  // Scheduling
  scheduledStart?: string;
  scheduledEnd?: string;
  actualStart?: string;
  actualEnd?: string;
  
  // Assignment
  technicianId?: string;
  technicianName?: string;
  teamId?: string;
  
  // Financial
  estimatedCost?: number;
  actualCost?: number;
  labor?: number;
  parts?: number;
  tax?: number;
  total?: number;
  
  // Completion
  completedAt?: string;
  completedBy?: string;
  customerSignature?: string;
  notes?: string;
  
  // Relations
  lineItems?: WorkOrderLineItem[];
  attachments?: WorkOrderAttachment[];
  statusHistory?: WorkOrderStatusHistory[];
  technicians?: WorkOrderTechnician[];
  fieldCalculations?: FieldCalculation[];
  
  createdAt: string;
  updatedAt: string;
  createdBy?: string;
}

export enum WorkOrderStatus {
  DRAFT = 'DRAFT',
  SCHEDULED = 'SCHEDULED',
  IN_PROGRESS = 'IN_PROGRESS',
  ON_HOLD = 'ON_HOLD',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED',
  INVOICED = 'INVOICED',
}

export enum WorkOrderPriority {
  LOW = 'LOW',
  MEDIUM = 'MEDIUM',
  HIGH = 'HIGH',
  EMERGENCY = 'EMERGENCY',
}

export interface WorkOrderLineItem {
  id: string;
  workOrderId: string;
  skuId?: string;
  description: string;
  quantity: number;
  unitPrice: number;
  total: number;
  type: 'PART' | 'LABOR' | 'SERVICE' | 'OTHER';
  createdAt: string;
}

export interface WorkOrderAttachment {
  id: string;
  workOrderId: string;
  fileName: string;
  fileUrl: string;
  fileType: string;
  fileSize: number;
  uploadedBy?: string;
  createdAt: string;
}

export interface WorkOrderStatusHistory {
  id: string;
  workOrderId: string;
  status: WorkOrderStatus;
  changedBy: string;
  reason?: string;
  createdAt: string;
}

export interface WorkOrderTechnician {
  id: string;
  workOrderId: string;
  userId: string;
  role: 'PRIMARY' | 'ASSISTANT';
  assignedAt: string;
}

export interface CreateWorkOrderRequest {
  title: string;
  description?: string;
  customerId?: string;
  type: string;
  priority: WorkOrderPriority;
  scheduledStart?: string;
  scheduledEnd?: string;
  technicianId?: string;
  estimatedCost?: number;
}

export interface UpdateWorkOrderStatusRequest {
  status: WorkOrderStatus;
  notes?: string;
}

// ============================================================================
// CRM
// ============================================================================

export interface Account {
  id: string;
  tenantId: string;
  accountNumber: string;
  name: string;
  type: 'RESIDENTIAL' | 'COMMERCIAL';
  status: 'ACTIVE' | 'INACTIVE' | 'SUSPENDED';
  
  // Contact info
  primaryContactId?: string;
  phone?: string;
  email?: string;
  website?: string;
  
  // Billing
  billingAddress?: string;
  billingCity?: string;
  billingState?: string;
  billingZip?: string;
  
  // Service
  serviceAddress?: string;
  serviceCity?: string;
  serviceState?: string;
  serviceZip?: string;
  
  // Business info
  taxId?: string;
  creditLimit?: number;
  paymentTerms?: string;
  
  // Metadata
  tags?: string[];
  notes?: string;
  
  // Relations
  contacts?: Contact[];
  workOrders?: WorkOrder[];
  equipment?: CustomerEquipment[];
  serviceAgreements?: ServiceAgreement[];
  
  createdAt: string;
  updatedAt: string;
}

export interface Contact {
  id: string;
  tenantId: string;
  accountId?: string;
  
  // Personal info
  firstName: string;
  lastName: string;
  fullName?: string;
  email?: string;
  phone?: string;
  mobile?: string;
  
  // Business info
  jobTitle?: string;
  department?: string;
  
  // Contact preferences
  preferredContactMethod?: 'EMAIL' | 'PHONE' | 'SMS';
  doNotContact: boolean;
  
  // Status
  isPrimary: boolean;
  isActive: boolean;
  
  notes?: string;
  
  createdAt: string;
  updatedAt: string;
}

export interface Lead {
  id: string;
  tenantId: string;
  contactId?: string;
  accountId?: string;
  
  // Lead info
  source: string;
  status: LeadStatus;
  score?: number;
  estimatedValue?: number;
  
  // Details
  description?: string;
  notes?: string;
  
  // Dates
  expectedCloseDate?: string;
  convertedAt?: string;
  
  createdAt: string;
  updatedAt: string;
}

export enum LeadStatus {
  NEW = 'NEW',
  CONTACTED = 'CONTACTED',
  QUALIFIED = 'QUALIFIED',
  PROPOSAL_SENT = 'PROPOSAL_SENT',
  NEGOTIATION = 'NEGOTIATION',
  WON = 'WON',
  LOST = 'LOST',
}

export interface CustomerNote {
  id: string;
  tenantId: string;
  customerId: string;
  content: string;
  isPinned: boolean;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

export interface CustomerEquipment {
  id: string;
  tenantId: string;
  customerId: string;
  
  // Equipment info
  type: string;
  manufacturer?: string;
  model?: string;
  serialNumber?: string;
  
  // Installation
  installDate?: string;
  installedBy?: string;
  warrantyExpires?: string;
  
  // Service
  lastServiceDate?: string;
  nextServiceDate?: string;
  serviceInterval?: number;
  
  // Location
  location?: string;
  notes?: string;
  
  createdAt: string;
  updatedAt: string;
}

export interface ServiceAgreement {
  id: string;
  tenantId: string;
  customerId: string;
  
  // Agreement info
  agreementNumber: string;
  name: string;
  type: 'MAINTENANCE' | 'SERVICE' | 'FULL_SERVICE';
  status: 'ACTIVE' | 'EXPIRED' | 'CANCELLED';
  
  // Terms
  startDate: string;
  endDate: string;
  billingCycle: 'MONTHLY' | 'QUARTERLY' | 'ANNUALLY';
  amount: number;
  
  // Services included
  servicesIncluded?: string[];
  visitsPerYear?: number;
  
  // Renewal
  autoRenew: boolean;
  renewalDate?: string;
  
  notes?: string;
  
  createdAt: string;
  updatedAt: string;
}

// ============================================================================
// INVENTORY
// ============================================================================

export interface SKU {
  id: string;
  tenantId: string;
  sku: string;
  name: string;
  description?: string;
  barcode?: string;
  
  // Classification
  category?: string;
  subcategory?: string;
  manufacturer?: string;
  model?: string;
  
  // Inventory
  onHand?: number;
  reorderPoint?: number;
  reorderQuantity?: number;
  safetyStock?: number;
  
  // Pricing
  unitCost?: number;
  unitPrice?: number;
  markup?: number;
  
  // Physical properties
  weight?: number;
  dimensions?: string;
  uom?: string; // Unit of measure
  
  // Status
  isActive: boolean;
  isSerialTracked: boolean;
  isLotTracked: boolean;
  
  // Relations
  stockLedger?: StockLedger[];
  
  createdAt: string;
  updatedAt: string;
}

export interface Warehouse {
  id: string;
  tenantId: string;
  code: string;
  name: string;
  
  // Location
  address?: string;
  city?: string;
  state?: string;
  zip?: string;
  
  // Contact
  phone?: string;
  managerName?: string;
  
  // Capacity
  totalCapacity?: number;
  usedCapacity?: number;
  
  isActive: boolean;
  
  // Relations
  bins?: Bin[];
  
  createdAt: string;
  updatedAt: string;
}

export interface Bin {
  id: string;
  warehouseId: string;
  name: string;
  code?: string;
  
  // Location
  aisle?: string;
  row?: string;
  shelf?: string;
  position?: string;
  
  // Capacity
  capacity?: number;
  isActive: boolean;
  
  warehouse?: Warehouse;
  
  createdAt: string;
  updatedAt: string;
}

export interface StockLedger {
  id: string;
  tenantId: string;
  skuId: string;
  warehouseId?: string;
  binId?: string;
  
  // Transaction details
  direction: 'IN' | 'OUT';
  quantity: number;
  reason: string;
  referenceType?: string; // 'PURCHASE_ORDER', 'WORK_ORDER', 'ADJUSTMENT', etc.
  referenceId?: string;
  
  // Tracking
  lotNumber?: string;
  serialNumber?: string;
  expiryDate?: string;
  
  // User
  userId?: string;
  notes?: string;
  
  createdAt: string;
}

export interface CreateSKURequest {
  name: string;
  description?: string;
  barcode?: string;
  category?: string;
  unitCost?: number;
  unitPrice?: number;
  reorderPoint?: number;
  reorderQuantity?: number;
}

export interface SKUListResponse {
  items: SKU[];
  total: number;
  page: number;
  pageSize: number;
}

// ============================================================================
// PURCHASING
// ============================================================================

export interface PurchaseOrder {
  id: string;
  tenantId: string;
  poNumber: string;
  
  // Vendor
  vendorId?: string;
  vendorName?: string;
  
  // SKU (simplified - one SKU per PO in current implementation)
  skuId: string;
  quantity: number;
  
  // Status
  status: 'DRAFT' | 'SENT' | 'APPROVED' | 'RECEIVED' | 'CANCELLED';
  
  // Dates
  orderDate: string;
  expectedDate?: string;
  receivedAt?: string;
  
  // Financial
  subtotal?: number;
  tax?: number;
  shipping?: number;
  total?: number;
  
  // Details
  notes?: string;
  
  // Relations
  sku?: SKU;
  
  createdAt: string;
  updatedAt: string;
}

export interface CreatePurchaseOrderRequest {
  skuId: string;
  quantity: number;
  tenantId?: string;
}

export interface PurchaseOrderListResponse {
  items: PurchaseOrder[];
  total: number;
  page: number;
  pageSize: number;
}

// ============================================================================
// DISPATCH & SCHEDULING
// ============================================================================

export interface DispatchSlot {
  id: string;
  tenantId: string;
  userId: string;
  workOrderId?: string;
  
  // Time slot
  startTime: string;
  endTime: string;
  date: string;
  
  // Status
  status: 'AVAILABLE' | 'SCHEDULED' | 'IN_PROGRESS' | 'COMPLETED';
  
  // Relations
  user?: User;
  workOrder?: WorkOrder;
  
  createdAt: string;
  updatedAt: string;
}

export interface CreateDispatchRequest {
  userId: string;
  workOrderId?: string;
  startTime: string;
  endTime: string;
  date: string;
}

// ============================================================================
// FORECASTING
// ============================================================================

export interface Forecast {
  id: string;
  tenantId: string;
  skuId: string;
  
  // Demand analysis
  avgDailyDemand: number;
  leadTimeDays: number;
  safetyFactor: number;
  
  // Recommendations
  reorderPoint: number;
  suggestedOrderQty: number;
  
  // Metadata
  lastCalculated: string;
  accuracy?: number;
  
  // Relations
  sku?: SKU;
  
  createdAt: string;
  updatedAt: string;
}

export interface ForecastListResponse {
  items: Forecast[];
  updated: number;
}

export interface ForecastData {
  date: string;
  historical: number;
  forecasted: number;
}

export interface ReorderRecommendation {
  sku: string;
  description: string;
  currentStock: number;
  reorderPoint: number;
  suggestedQuantity: number;
  priority: "high" | "medium" | "low";
}

export interface TopMover {
  sku: string;
  description: string;
  avgDemand: number;
  trend: "up" | "down" | "stable";
  forecast: number;
}

// ============================================================================
// FIELD CALCULATIONS
// ============================================================================

export type CalculatorCategory = 'electrical' | 'refrigeration' | 'airflow' | 'gas' | 'hydronic' | 'utility';

export interface FieldCalculation {
  id: string;
  tenantId: string;
  technicianId: string;
  
  // Calculator info
  calculatorType: string;
  category: CalculatorCategory;
  
  // Data
  inputs: Record<string, any>;
  results: Record<string, any>;
  
  // Work order attachment
  workOrderId?: string;
  isAttached: boolean;
  notes?: string;
  
  // Relations
  technician?: {
    id: string;
    email: string;
    firstName?: string;
    lastName?: string;
  };
  workOrder?: {
    id: string;
    number: string;
    title: string;
  };
  
  createdAt: string;
  updatedAt: string;
}

export interface CreateFieldCalculationRequest {
  calculatorType: string;
  category: CalculatorCategory;
  inputs: Record<string, any>;
  results: Record<string, any>;
  workOrderId?: string;
  notes?: string;
}

export interface FieldCalculationListResponse {
  items: FieldCalculation[];
  total: number;
}

// ============================================================================
// BARCODE & SCANNER
// ============================================================================

export interface BarcodeResponse {
  barcode: string;
  imageUrl: string;
  format: string;
}

export interface ScannerResponse {
  found: boolean;
  sku?: SKU;
  barcode: string;
  matchType?: 'exact' | 'fuzzy';
  confidence?: number;
}

// ============================================================================
// AI CHAT
// ============================================================================

export interface ChatMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

export interface ChatRequest {
  messages: ChatMessage[];
  tenantId?: string;
}

export interface ChatResponse {
  response: string;
  model: string;
  usage?: {
    promptTokens: number;
    completionTokens: number;
    totalTokens: number;
  };
}

export interface ChatLog {
  id: string;
  tenantId: string;
  userId?: string;
  
  // Message
  userMessage: string;
  aiResponse: string;
  
  // Metadata
  model: string;
  tokensUsed?: number;
  
  createdAt: string;
}

// ============================================================================
// FINANCIAL
// ============================================================================

export interface Invoice {
  id: string;
  tenantId: string;
  invoiceNumber: string;
  
  // Customer
  customerId: string;
  customerName?: string;
  
  // Work Order
  workOrderId?: string;
  
  // Financial
  subtotal: number;
  tax: number;
  discount: number;
  total: number;
  amountPaid: number;
  balance: number;
  
  // Status
  status: 'DRAFT' | 'SENT' | 'PAID' | 'OVERDUE' | 'CANCELLED';
  
  // Dates
  invoiceDate: string;
  dueDate: string;
  paidDate?: string;
  
  // Payment
  paymentTerms?: string;
  notes?: string;
  
  // Relations
  lineItems?: InvoiceLineItem[];
  payments?: Payment[];
  
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

export interface InvoiceLineItem {
  id: string;
  invoiceId: string;
  description: string;
  quantity: number;
  unitPrice: number;
  total: number;
  taxable: boolean;
}

export interface Payment {
  id: string;
  tenantId: string;
  invoiceId: string;
  
  // Payment details
  amount: number;
  method: 'CASH' | 'CHECK' | 'CREDIT_CARD' | 'ACH' | 'OTHER';
  reference?: string;
  
  // Status
  status: 'PENDING' | 'COMPLETED' | 'FAILED' | 'REFUNDED';
  
  // Processing
  processedDate?: string;
  notes?: string;
  
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

// ============================================================================
// ORGANIZATION
// ============================================================================

export interface Department {
  id: string;
  tenantId: string;
  name: string;
  description?: string;
  parentId?: string;
  managerId?: string;
  
  // Relations
  parent?: Department;
  children?: Department[];
  manager?: User;
  users?: User[];
  teams?: Team[];
  
  createdAt: string;
  updatedAt: string;
}

export interface Team {
  id: string;
  tenantId: string;
  departmentId?: string;
  name: string;
  description?: string;
  leadId?: string;
  
  // Relations
  department?: Department;
  lead?: User;
  members?: User[];
  
  createdAt: string;
  updatedAt: string;
}

// ============================================================================
// NOTIFICATIONS
// ============================================================================

export interface Notification {
  id: string;
  tenantId: string;
  userId: string;
  
  // Notification details
  type: string;
  title: string;
  message: string;
  
  // Status
  read: boolean;
  readAt?: string;
  
  // Actions
  actionUrl?: string;
  actionLabel?: string;
  
  // Related data
  relatedType?: string;
  relatedId?: string;
  
  createdAt: string;
}

// ============================================================================
// API RESPONSE TYPES
// ============================================================================

export interface ApiResponse<T = any> {
  data?: T;
  error?: ApiError;
  message?: string;
}

export interface ApiError {
  code: string;
  message: string;
  details?: any;
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export interface HealthResponse {
  status: 'ok' | 'error';
  uptime?: number;
  timestamp?: string;
}

export interface MetricsResponse {
  requestCount: number;
  errorCount: number;
  avgResponseTime: number;
  uptime: number;
}

// ============================================================================
// DASHBOARD TYPES
// ============================================================================

export interface Activity {
  id: string;
  type: "work_order" | "technician" | "customer" | "payment" | "alert";
  description: string;
  timestamp: string;
  icon?: string;
}

export interface TopTechnician {
  id: string;
  name: string;
  jobsCompleted: number;
  avgDuration: number;
  customerRating: number;
}

export interface RevenueDataPoint {
  date: string;
  amount: number;
}

export interface JobDistribution {
  scheduled: number;
  inProgress: number;
  completed: number;
}

// ============================================================================
// UTILITY TYPES
// ============================================================================

export type ID = string;
export type Timestamp = string;
export type DateString = string;
export type JSONValue = string | number | boolean | null | JSONValue[] | { [key: string]: JSONValue };
