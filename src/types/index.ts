// ============================================================
// src/types/index.ts
// All TypeScript interfaces for the app
// ============================================================

export type Plan = 'trial' | 'free' | 'pro_monthly' | 'pro_annual' | 'lifetime'

export type Profession =
  | 'web_developer'
  | 'photographer'
  | 'consultant'
  | 'designer'
  | 'copywriter'
  | 'marketer'
  | 'other'

export type ContractStatus = 'draft' | 'sent' | 'opened' | 'signed'

export type InvoiceStatus = 'draft' | 'sent' | 'partial' | 'paid' | 'overdue'

export type PaymentMethod =
  | 'bank_transfer'
  | 'credit_card'
  | 'cash'
  | 'paypal'
  | 'check'
  | 'other'

export type FeedbackType = 'bug' | 'feature' | 'general' | 'other'

export type InvoiceTheme = 'aurora' | 'summit' | 'ledger'

export type ExportFormat = 'excel_only' | 'pdf_only' | 'both'

// ─── User / Account ────────────────────────────────────────

export interface User {
  id: string
  email: string
  fullName: string
  phone?: string
  businessName?: string
  businessLogo?: string
  address?: string
  city?: string
  state?: string
  postalCode?: string
  country?: string
  taxId?: string
  defaultCurrency: string
  defaultTaxRate: number
  timezone: string
  profession?: Profession
  onboardingComplete?: boolean
  plan: Plan
  docsUsedThisMonth?: number
  trialEndsAt?: Date
  trialDaysRemaining?: number
  createdAt: Date
  updatedAt: Date
}

// ─── Client ────────────────────────────────────────────────

export interface Client {
  id: string
  userId: string
  name: string
  email?: string
  phone?: string
  company?: string
  address?: string
  notes?: string
  createdAt: Date
  updatedAt: Date
  // computed from relations
  contractCount?: number
  invoiceCount?: number
}

export interface ClientFormData {
  name: string
  email?: string
  phone?: string
  company?: string
  address?: string
  notes?: string
}

// ─── Contract Template ─────────────────────────────────────

export interface ContractTemplate {
  id: string
  userId?: string // null = global/system template
  name: string
  description?: string
  content: string
  isDefault: boolean
  isGlobal: boolean
  createdAt: Date
}

export interface ContractTemplateFormData {
  name: string
  description?: string
  content: string
  isDefault: boolean
}

// ─── Contract ──────────────────────────────────────────────

export interface Contract {
  id: string
  userId: string
  clientId: string
  client?: Client
  templateId?: string
  template?: ContractTemplate
  title: string
  projectDescription: string
  amount: number
  currency: string
  paymentTerms: string
  startDate: Date
  endDate?: Date
  additionalTerms?: string
  status: ContractStatus
  signedAt?: Date
  openCount: number
  lastOpenedAt?: Date
  createdAt: Date
  updatedAt: Date
}

export interface ContractFormData {
  clientId: string
  templateId: string
  title: string
  projectDescription: string
  amount: number
  currency: string
  paymentTerms: string
  startDate: string
  endDate?: string
  additionalTerms?: string
}

// ─── Invoice ───────────────────────────────────────────────

export interface InvoiceItem {
  id: string
  description: string
  quantity: number
  unitPrice: number
  amount: number // quantity * unitPrice
}

export interface Invoice {
  id: string
  userId: string
  clientId: string
  client?: Client
  invoiceNumber: string // INV-YYYY-NNNN
  invoiceDate: Date
  dueDate?: Date
  currency: string
  items: InvoiceItem[]
  subtotal: number
  taxRate: number
  taxAmount: number
  discountAmount: number
  total: number
  notes?: string
  paymentTerms?: string
  status: InvoiceStatus
  paidAmount: number
  balance: number // total - paidAmount
  createdAt: Date
  updatedAt: Date
}

export interface InvoiceFormData {
  clientId: string
  invoiceNumber: string
  invoiceDate: string
  dueDate?: string
  currency: string
  items: Omit<InvoiceItem, 'id'>[]
  taxRate: number
  discountAmount: number
  notes?: string
  paymentTerms?: string
}

// ─── Payment ───────────────────────────────────────────────

export interface Payment {
  id: string
  invoiceId: string
  amount: number
  paymentDate: Date
  method: PaymentMethod
  notes?: string
  createdAt: Date
}

export interface PaymentFormData {
  amount: number
  paymentDate: string
  method: PaymentMethod
  notes?: string
}

// ─── Email Template ────────────────────────────────────────

export interface EmailTemplate {
  id: string
  userId?: string
  name: string
  key: string
  description?: string
  subject: string
  body: string
  isSystem: boolean
  createdAt: Date
}

export interface EmailTemplateFormData {
  name: string
  key: string
  description?: string
  subject: string
  body: string
}

// ─── Reminder ──────────────────────────────────────────────

export interface ReminderLog {
  id: string
  invoiceId: string
  invoice?: Invoice
  clientId: string
  client?: Client
  recipientEmail: string
  templateKey: string
  status: 'sent' | 'failed'
  sentAt: Date
}

export interface ReminderSettings {
  userId: string
  enabled: boolean
  daysBefore: number[]
  sendOnDueDate: boolean
  daysAfterOverdue: number[]
  maxRemindersPerInvoice: number
  skipBelowBalance: number
}

// ─── Invoice Settings ──────────────────────────────────────

export interface InvoiceSettings {
  userId: string
  theme: InvoiceTheme
  primaryColor: string
  secondaryColor: string
  brandName?: string
  brandLogo?: string
  brandAddress?: string
  phone?: string
  website?: string
  taxId?: string
}

// ─── Export ────────────────────────────────────────────────

export interface ExportOptions {
  includeClients: boolean
  includeContracts: boolean
  includeInvoices: boolean
  invoiceFormat: ExportFormat
}

// ─── Feedback ──────────────────────────────────────────────

export interface Feedback {
  id: string
  userId: string
  type: FeedbackType
  message: string
  createdAt: Date
}

export interface FeedbackFormData {
  type: FeedbackType | ''
  message: string
}

// ─── Client Activity ───────────────────────────────────────

export interface ClientActivity {
  client: Client
  latestContract?: Contract
  latestInvoice?: Invoice
}

// ─── Dashboard Stats ───────────────────────────────────────

export interface DashboardStats {
  totalInvoiced: number
  totalPaid: number
  outstanding: number
  activeClients: number
  signedContracts: number
  pendingInvoices: number
  draftInvoices: number
  paidLast30Days: number
  overdueCount: number
  recentInvoices: Invoice[]
  recentContracts: Contract[]
}

// ─── Import ────────────────────────────────────────────────

export interface ImportResult {
  total: number
  imported: number
  skipped: number
  errors: string[]
}

// ─── UI helpers ────────────────────────────────────────────

export interface NavItem {
  label: string
  href: string
  icon: string // lucide icon name
}

export interface ToastMessage {
  id: string
  type: 'success' | 'error' | 'info' | 'warning'
  message: string
  duration?: number
}

export interface ConfirmOptions {
  title: string
  description: string
  confirmLabel?: string
  cancelLabel?: string
  variant?: 'danger' | 'primary'
}

export interface SelectOption {
  value: string
  label: string
}

// ─── Constants ─────────────────────────────────────────────

export const CURRENCIES: SelectOption[] = [
  { value: 'USD', label: 'USD - US Dollar' },
  { value: 'EUR', label: 'EUR - Euro' },
  { value: 'GBP', label: 'GBP - British Pound' },
  { value: 'PKR', label: 'PKR - Pakistani Rupee' },
  { value: 'CAD', label: 'CAD - Canadian Dollar' },
  { value: 'AUD', label: 'AUD - Australian Dollar' },
]

export const PAYMENT_METHODS: SelectOption[] = [
  { value: 'bank_transfer', label: 'Bank Transfer' },
  { value: 'credit_card', label: 'Credit Card' },
  { value: 'cash', label: 'Cash' },
  { value: 'paypal', label: 'PayPal' },
  { value: 'check', label: 'Check' },
  { value: 'other', label: 'Other' },
]

export const FEEDBACK_TYPES: SelectOption[] = [
  { value: 'bug', label: 'Bug Report' },
  { value: 'feature', label: 'Feature Request' },
  { value: 'general', label: 'General Feedback' },
  { value: 'other', label: 'Other' },
]

export const INVOICE_STATUSES: SelectOption[] = [
  { value: '', label: 'All Statuses' },
  { value: 'draft', label: 'Draft' },
  { value: 'sent', label: 'Sent' },
  { value: 'partial', label: 'Partial' },
  { value: 'paid', label: 'Paid' },
  { value: 'overdue', label: 'Overdue' },
]

export const TIMEZONES: SelectOption[] = [
  { value: 'UTC', label: 'UTC' },
  { value: 'America/New_York', label: 'Eastern Time (US & Canada)' },
  { value: 'America/Chicago', label: 'Central Time (US & Canada)' },
  { value: 'America/Los_Angeles', label: 'Pacific Time (US & Canada)' },
  { value: 'Europe/London', label: 'London' },
  { value: 'Asia/Karachi', label: 'Karachi' },
  { value: 'Asia/Dubai', label: 'Dubai' },
]
