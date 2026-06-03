import 'server-only'

import { existsSync, mkdirSync, readFileSync } from 'node:fs'
import path from 'node:path'
import { DatabaseSync } from 'node:sqlite'
import type { Plan, Profession } from '@/types'

const dbDirectory = path.join(process.cwd(), '.data')
const dbPath = process.env.SQLITE_DATABASE_PATH || path.join(dbDirectory, 'filecurrent.sqlite')
const schemaPath = path.join(process.cwd(), 'sqlite', 'schema.sql')

let database: DatabaseSync | null = null

function runMigrations(db: DatabaseSync) {
  // Additive column migrations — safe to run on every startup
  const migrations = [
    `ALTER TABLE reminder_settings ADD COLUMN auto_stop_on_paid INTEGER DEFAULT 1`,
    `ALTER TABLE reminder_settings ADD COLUMN allow_unsubscribe INTEGER DEFAULT 1`,
    `ALTER TABLE profiles ADD COLUMN notification_prefs TEXT DEFAULT '{}'`,
  ]
  for (const sql of migrations) {
    try { db.exec(sql) } catch { /* column already exists — ignore */ }
  }
}

function ensureDatabase() {
  if (!existsSync(dbDirectory)) {
    mkdirSync(dbDirectory, { recursive: true })
  }

  if (!database) {
    database = new DatabaseSync(dbPath)
    database.exec('PRAGMA busy_timeout=10000;')
    database.exec(readFileSync(schemaPath, 'utf8'))
    runMigrations(database)
  }

  return database
}

export function getDb() {
  return ensureDatabase()
}

export interface LocalProfile {
  id: string
  email: string
  fullName: string
  businessName: string | null
  phone: string | null
  plan: Plan
  profession: Profession | null
  onboardingComplete: boolean
  docsUsedThisMonth: number
}

export interface OnboardingInput {
  profession: Profession
  businessName: string
  fullName: string
  phone?: string
  plan: Extract<Plan, 'free' | 'pro_monthly'>
}

export function getCurrentProfile(): LocalProfile {
  const row = getDb()
    .prepare(
      `SELECT id, email, full_name, business_name, phone, plan, profession,
        onboarding_complete, docs_used_this_month
       FROM profiles
       WHERE id = ?`
    )
    .get('local-user') as
    | {
        id: string
        email: string
        full_name: string | null
        business_name: string | null
        phone: string | null
        plan: Plan
        profession: Profession | null
        onboarding_complete: number | null
        docs_used_this_month: number | null
      }
    | undefined

  if (!row) {
    throw new Error('Local SQLite profile was not seeded.')
  }

  return {
    id: row.id,
    email: row.email,
    fullName: row.full_name || row.email,
    businessName: row.business_name,
    phone: row.phone,
    plan: row.plan,
    profession: row.profession,
    onboardingComplete: Boolean(row.onboarding_complete),
    docsUsedThisMonth: row.docs_used_this_month || 0,
  }
}

export interface DashboardStats {
  totalInvoiced: number
  totalPaid: number
  outstanding: number
  paidLast30Days: number
  overdueCount: number
  pendingInvoices: number
  draftInvoices: number
  activeClients: number
  signedContracts: number
  recentInvoices: Array<{
    id: string
    invoiceNumber: string
    clientName: string
    total: number
    currency: string
    status: string
    invoiceDate: string
  }>
  recentContracts: Array<{
    id: string
    title: string
    clientName: string
    amount: number
    currency: string
    status: string
    createdAt: string
  }>
  recentActivity: Array<{
    id: string
    type: 'audit' | 'reminder'
    description: string
    timestamp: string
  }>
}

export function getDashboardStats(userId: string): DashboardStats {
  const db = getDb()

  const invoiceAgg = db
    .prepare(
      `SELECT
        COALESCE(SUM(total), 0) as total_invoiced,
        COALESCE(SUM(CASE WHEN status = 'paid' THEN total ELSE 0 END), 0) as total_paid,
        COALESCE(SUM(CASE WHEN status NOT IN ('paid') THEN total ELSE 0 END), 0) as outstanding,
        COALESCE(SUM(CASE WHEN status = 'overdue' THEN 1 ELSE 0 END), 0) as overdue_count,
        COALESCE(SUM(CASE WHEN status IN ('sent','partial') THEN 1 ELSE 0 END), 0) as pending_invoices,
        COALESCE(SUM(CASE WHEN status = 'draft' THEN 1 ELSE 0 END), 0) as draft_invoices
       FROM invoices WHERE user_id = ?`
    )
    .get(userId) as {
    total_invoiced: number
    total_paid: number
    outstanding: number
    overdue_count: number
    pending_invoices: number
    draft_invoices: number
  }

  const paidRow = db
    .prepare(
      `SELECT COALESCE(SUM(total), 0) as amount FROM invoices
       WHERE user_id = ? AND status = 'paid'
       AND updated_at >= datetime('now', '-30 days')`
    )
    .get(userId) as { amount: number }

  const clientRow = db
    .prepare(`SELECT COUNT(*) as count FROM clients WHERE user_id = ?`)
    .get(userId) as { count: number }

  const contractRow = db
    .prepare(`SELECT COUNT(*) as count FROM contracts WHERE user_id = ? AND status = 'signed'`)
    .get(userId) as { count: number }

  const recentInvoicesRaw = db
    .prepare(
      `SELECT i.id, i.invoice_number, i.total, i.currency, i.status, i.invoice_date,
              c.name as client_name
       FROM invoices i
       JOIN clients c ON i.client_id = c.id
       WHERE i.user_id = ?
       ORDER BY i.created_at DESC LIMIT 5`
    )
    .all(userId) as Array<{
    id: string
    invoice_number: string
    total: number
    currency: string
    status: string
    invoice_date: string
    client_name: string
  }>

  const recentContractsRaw = db
    .prepare(
      `SELECT co.id, co.title, co.amount, co.currency, co.status, co.created_at,
              c.name as client_name
       FROM contracts co
       JOIN clients c ON co.client_id = c.id
       WHERE co.user_id = ?
       ORDER BY co.created_at DESC LIMIT 5`
    )
    .all(userId) as Array<{
    id: string
    title: string
    amount: number
    currency: string
    status: string
    created_at: string
    client_name: string
  }>

  const auditEvents = db
    .prepare(
      `SELECT ae.id, ae.event_type, ae.signer_name, ae.signer_email, ae.timestamp,
              co.title as contract_title
       FROM audit_events ae
       JOIN contracts co ON ae.contract_id = co.id
       WHERE co.user_id = ?
       ORDER BY ae.timestamp DESC LIMIT 5`
    )
    .all(userId) as Array<{
    id: string
    event_type: string
    signer_name: string | null
    signer_email: string | null
    timestamp: string
    contract_title: string
  }>

  const reminderLogs = db
    .prepare(
      `SELECT rl.id, rl.sent_at, rl.recipient_email, rl.status,
              i.invoice_number
       FROM reminder_logs rl
       JOIN invoices i ON rl.invoice_id = i.id
       WHERE i.user_id = ?
       ORDER BY rl.sent_at DESC LIMIT 5`
    )
    .all(userId) as Array<{
    id: string
    sent_at: string
    recipient_email: string
    status: string
    invoice_number: string
  }>

  const auditActivity = auditEvents.map((e) => ({
    id: `audit-${e.id}`,
    type: 'audit' as const,
    description: formatAuditDescription(e.event_type, e.signer_name, e.signer_email, e.contract_title),
    timestamp: e.timestamp,
  }))

  const reminderActivity = reminderLogs.map((r) => ({
    id: `reminder-${r.id}`,
    type: 'reminder' as const,
    description: `Reminder sent to ${r.recipient_email} for ${r.invoice_number}`,
    timestamp: r.sent_at,
  }))

  const recentActivity = [...auditActivity, ...reminderActivity]
    .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
    .slice(0, 10)

  return {
    totalInvoiced: invoiceAgg.total_invoiced,
    totalPaid: invoiceAgg.total_paid,
    outstanding: invoiceAgg.outstanding,
    paidLast30Days: paidRow.amount,
    overdueCount: invoiceAgg.overdue_count,
    pendingInvoices: invoiceAgg.pending_invoices,
    draftInvoices: invoiceAgg.draft_invoices,
    activeClients: clientRow.count,
    signedContracts: contractRow.count,
    recentInvoices: recentInvoicesRaw.map((r) => ({
      id: r.id,
      invoiceNumber: r.invoice_number,
      clientName: r.client_name,
      total: r.total,
      currency: r.currency,
      status: r.status,
      invoiceDate: r.invoice_date,
    })),
    recentContracts: recentContractsRaw.map((r) => ({
      id: r.id,
      title: r.title,
      clientName: r.client_name,
      amount: r.amount,
      currency: r.currency,
      status: r.status,
      createdAt: r.created_at,
    })),
    recentActivity,
  }
}

// ── Clients ────────────────────────────────────────────────

export interface ClientRow {
  id: string
  name: string
  email: string | null
  company: string | null
}

export function getClients(userId: string): ClientRow[] {
  return getDb()
    .prepare(`SELECT id, name, email, company FROM clients WHERE user_id = ? ORDER BY name`)
    .all(userId) as unknown as ClientRow[]
}

// ── Client CRUD ────────────────────────────────────────────

export interface ClientDetailRow extends ClientRow {
  address: string | null
  notes: string | null
  createdAt: string
  contractCount: number
  invoiceCount: number
}

export function getClientById(id: string, userId: string): ClientDetailRow | null {
  const row = getDb()
    .prepare(
      `SELECT c.id, c.name, c.email, c.company, c.address, c.notes, c.created_at,
              (SELECT COUNT(*) FROM contracts WHERE client_id = c.id) as contract_count,
              (SELECT COUNT(*) FROM invoices WHERE client_id = c.id) as invoice_count
       FROM clients c WHERE c.id = ? AND c.user_id = ?`
    )
    .get(id, userId) as unknown as {
    id: string; name: string; email: string | null; company: string | null
    address: string | null; notes: string | null; created_at: string
    contract_count: number; invoice_count: number
  } | undefined

  if (!row) return null
  return {
    id: row.id, name: row.name, email: row.email, company: row.company,
    address: row.address, notes: row.notes, createdAt: row.created_at,
    contractCount: row.contract_count, invoiceCount: row.invoice_count,
  }
}

export function createClient(
  userId: string,
  data: { name: string; email?: string; phone?: string; company?: string; address?: string; notes?: string }
): string {
  const id = `client-${Date.now()}`
  getDb().prepare(
    `INSERT INTO clients (id, user_id, name, email, phone, company, address, notes)
     VALUES (?,?,?,?,?,?,?,?)`
  ).run(id, userId, data.name, data.email ?? null, data.phone ?? null,
    data.company ?? null, data.address ?? null, data.notes ?? null)
  return id
}

export function updateClient(
  id: string,
  userId: string,
  data: { name: string; email?: string; phone?: string; company?: string; address?: string; notes?: string }
): void {
  getDb().prepare(
    `UPDATE clients SET name=?, email=?, phone=?, company=?, address=?, notes=?,
     updated_at=CURRENT_TIMESTAMP WHERE id=? AND user_id=?`
  ).run(data.name, data.email ?? null, data.phone ?? null, data.company ?? null,
    data.address ?? null, data.notes ?? null, id, userId)
}

export function deleteClient(id: string, userId: string): void {
  getDb().prepare(`DELETE FROM clients WHERE id=? AND user_id=?`).run(id, userId)
}

// ── Contract templates ─────────────────────────────────────

export interface ContractTemplateRow {
  id: string
  name: string
  description: string | null
  content: string
  isDefault: boolean
  isGlobal: boolean
  profession: string | null
  userId: string | null
  createdAt: string
}

function rowToTemplate(r: {
  id: string
  name: string
  description: string | null
  content: string
  is_default: number
  is_global: number
  profession: string | null
  user_id: string | null
  created_at: string
}): ContractTemplateRow {
  return {
    id: r.id,
    name: r.name,
    description: r.description,
    content: r.content,
    isDefault: Boolean(r.is_default),
    isGlobal: Boolean(r.is_global),
    profession: r.profession,
    userId: r.user_id,
    createdAt: r.created_at,
  }
}

export function getContractTemplates(
  userId: string,
  profession: Profession | null
): { my: ContractTemplateRow[]; global: ContractTemplateRow[] } {
  const db = getDb()

  const myRows = db
    .prepare(
      `SELECT id, name, description, content, is_default, is_global, profession, user_id, created_at
       FROM contract_templates WHERE user_id = ? ORDER BY is_default DESC, name`
    )
    .all(userId) as Parameters<typeof rowToTemplate>[0][]

  // Global templates: profession-matched first, then generic (profession IS NULL)
  const globalRows = db
    .prepare(
      `SELECT id, name, description, content, is_default, is_global, profession, user_id, created_at
       FROM contract_templates
       WHERE is_global = 1 AND user_id IS NULL
       ORDER BY
         CASE WHEN profession = ? THEN 0
              WHEN profession IS NULL THEN 1
              ELSE 2 END,
         name`
    )
    .all(profession ?? '') as Parameters<typeof rowToTemplate>[0][]

  return {
    my: myRows.map(rowToTemplate),
    global: globalRows.map(rowToTemplate),
  }
}

export function getContractTemplate(id: string): ContractTemplateRow | null {
  const row = getDb()
    .prepare(
      `SELECT id, name, description, content, is_default, is_global, profession, user_id, created_at
       FROM contract_templates WHERE id = ?`
    )
    .get(id) as Parameters<typeof rowToTemplate>[0] | undefined
  return row ? rowToTemplate(row) : null
}

export function createContractTemplate(
  userId: string,
  data: { name: string; description?: string; content: string; isDefault?: boolean }
): string {
  const id = `tmpl-user-${Date.now()}`
  getDb()
    .prepare(
      `INSERT INTO contract_templates (id, user_id, name, description, content, is_default, is_global)
       VALUES (?, ?, ?, ?, ?, ?, 0)`
    )
    .run(id, userId, data.name, data.description ?? null, data.content, data.isDefault ? 1 : 0)
  return id
}

export function updateContractTemplate(
  id: string,
  userId: string,
  data: { name: string; description?: string; content: string; isDefault?: boolean }
): void {
  getDb()
    .prepare(
      `UPDATE contract_templates SET name=?, description=?, content=?, is_default=?
       WHERE id=? AND user_id=?`
    )
    .run(data.name, data.description ?? null, data.content, data.isDefault ? 1 : 0, id, userId)
}

export function deleteContractTemplate(id: string, userId: string): void {
  getDb()
    .prepare(`DELETE FROM contract_templates WHERE id=? AND user_id=?`)
    .run(id, userId)
}

// ── Contracts ─────────────────────────────────────────────

export interface ContractListRow {
  id: string
  title: string
  clientId: string
  clientName: string
  amount: number
  currency: string
  status: string
  createdAt: string
}

export interface ContractDetailRow extends ContractListRow {
  projectDescription: string | null
  paymentTerms: string | null
  startDate: string | null
  endDate: string | null
  additionalTerms: string | null
  templateContent: string | null
  signedAt: string | null
  clientEmail: string | null
  clientCompany: string | null
}

export function getContracts(userId: string): ContractListRow[] {
  return (
    getDb()
      .prepare(
        `SELECT c.id, c.title, c.client_id, c.amount, c.currency, c.status, c.created_at,
                cl.name as client_name
         FROM contracts c
         JOIN clients cl ON c.client_id = cl.id
         WHERE c.user_id = ?
         ORDER BY c.created_at DESC`
      )
      .all(userId) as Array<{
      id: string
      title: string
      client_id: string
      amount: number
      currency: string
      status: string
      created_at: string
      client_name: string
    }>
  ).map((r) => ({
    id: r.id,
    title: r.title,
    clientId: r.client_id,
    clientName: r.client_name,
    amount: r.amount,
    currency: r.currency,
    status: r.status,
    createdAt: r.created_at,
  }))
}

export function getContract(id: string, userId: string): ContractDetailRow | null {
  const row = getDb()
    .prepare(
      `SELECT c.id, c.title, c.client_id, c.amount, c.currency, c.status, c.created_at,
              c.project_description, c.payment_terms, c.start_date, c.end_date,
              c.additional_terms, c.signed_at,
              cl.name as client_name, cl.email as client_email, cl.company as client_company,
              t.content as template_content
       FROM contracts c
       JOIN clients cl ON c.client_id = cl.id
       LEFT JOIN contract_templates t ON c.template_id = t.id
       WHERE c.id = ? AND c.user_id = ?`
    )
    .get(id, userId) as
    | {
        id: string
        title: string
        client_id: string
        amount: number
        currency: string
        status: string
        created_at: string
        project_description: string | null
        payment_terms: string | null
        start_date: string | null
        end_date: string | null
        additional_terms: string | null
        signed_at: string | null
        client_name: string
        client_email: string | null
        client_company: string | null
        template_content: string | null
      }
    | undefined

  if (!row) return null
  return {
    id: row.id,
    title: row.title,
    clientId: row.client_id,
    clientName: row.client_name,
    amount: row.amount,
    currency: row.currency,
    status: row.status,
    createdAt: row.created_at,
    projectDescription: row.project_description,
    paymentTerms: row.payment_terms,
    startDate: row.start_date,
    endDate: row.end_date,
    additionalTerms: row.additional_terms,
    templateContent: row.template_content,
    signedAt: row.signed_at,
    clientEmail: row.client_email,
    clientCompany: row.client_company,
  }
}

export function createContract(
  userId: string,
  data: {
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
): string {
  const id = `contract-${Date.now()}`
  getDb()
    .prepare(
      `INSERT INTO contracts
         (id, user_id, client_id, template_id, title, project_description, amount, currency,
          payment_terms, start_date, end_date, additional_terms, status, has_branding_footer)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'draft', 1)`
    )
    .run(
      id,
      userId,
      data.clientId,
      data.templateId,
      data.title,
      data.projectDescription,
      data.amount,
      data.currency,
      data.paymentTerms,
      data.startDate,
      data.endDate ?? null,
      data.additionalTerms ?? null
    )
  // Increment docs used this month
  getDb()
    .prepare(`UPDATE profiles SET docs_used_this_month = docs_used_this_month + 1 WHERE id = ?`)
    .run(userId)
  return id
}

// ── Signing sessions ───────────────────────────────────────

export interface SigningSessionRow {
  token: string
  contractId: string
  contractTitle: string
  contractContent: string | null
  signerEmail: string
  signerName: string | null
  status: string
  freelancerName: string
  freelancerBusiness: string | null
  clientName: string
  clientEmail: string | null
  clientCompany: string | null
  amount: number
  currency: string
  startDate: string | null
  endDate: string | null
  paymentTerms: string | null
  projectDescription: string | null
}

export function createSigningSession(
  contractId: string,
  signerEmail: string
): string {
  const token = `sign-${Date.now()}-${Math.random().toString(36).slice(2)}`
  const db = getDb()
  db.prepare(
    `INSERT INTO signing_sessions (id, contract_id, signer_email, unique_token, status)
     VALUES (lower(hex(randomblob(16))), ?, ?, ?, 'pending')`
  ).run(contractId, signerEmail, token)
  // Update contract status to 'sent'
  db.prepare(`UPDATE contracts SET status='sent' WHERE id=?`).run(contractId)
  return token
}

export function getContractForSigning(token: string): SigningSessionRow | null {
  const db = getDb()
  const row = db
    .prepare(
      `SELECT ss.unique_token, ss.contract_id, ss.signer_email, ss.signer_name, ss.status,
              c.title as contract_title, c.amount, c.currency, c.start_date, c.end_date,
              c.payment_terms, c.project_description,
              t.content as contract_content,
              p.full_name as freelancer_name, p.business_name as freelancer_business,
              cl.name as client_name, cl.email as client_email, cl.company as client_company
       FROM signing_sessions ss
       JOIN contracts c ON ss.contract_id = c.id
       JOIN profiles p ON c.user_id = p.id
       JOIN clients cl ON c.client_id = cl.id
       LEFT JOIN contract_templates t ON c.template_id = t.id
       WHERE ss.unique_token = ?`
    )
    .get(token) as
    | {
        unique_token: string
        contract_id: string
        signer_email: string
        signer_name: string | null
        status: string
        contract_title: string
        amount: number
        currency: string
        start_date: string | null
        end_date: string | null
        payment_terms: string | null
        project_description: string | null
        contract_content: string | null
        freelancer_name: string | null
        freelancer_business: string | null
        client_name: string
        client_email: string | null
        client_company: string | null
      }
    | undefined

  if (!row) return null
  return {
    token: row.unique_token,
    contractId: row.contract_id,
    contractTitle: row.contract_title,
    contractContent: row.contract_content,
    signerEmail: row.signer_email,
    signerName: row.signer_name,
    status: row.status,
    freelancerName: row.freelancer_name || 'Service Provider',
    freelancerBusiness: row.freelancer_business,
    clientName: row.client_name,
    clientEmail: row.client_email,
    clientCompany: row.client_company,
    amount: row.amount,
    currency: row.currency,
    startDate: row.start_date,
    endDate: row.end_date,
    paymentTerms: row.payment_terms,
    projectDescription: row.project_description,
  }
}

export function submitContractSignature(
  token: string,
  signerName: string,
  ipAddress: string
): void {
  const db = getDb()
  const now = new Date().toISOString()
  // Get the session
  const session = db
    .prepare(`SELECT id, contract_id FROM signing_sessions WHERE unique_token = ? AND status = 'pending'`)
    .get(token) as { id: string; contract_id: string } | undefined

  if (!session) throw new Error('Invalid or already-signed token')

  db.prepare(
    `UPDATE signing_sessions SET status='signed', signer_name=?, signed_at=? WHERE id=?`
  ).run(signerName, now, session.id)

  db.prepare(
    `UPDATE contracts SET status='signed', signed_at=? WHERE id=?`
  ).run(now, session.contract_id)

  db.prepare(
    `INSERT INTO audit_events (contract_id, signing_session_id, event_type, signer_name, ip_address, timestamp)
     VALUES (?, ?, 'signed', ?, ?, ?)`
  ).run(session.contract_id, session.id, signerName, ipAddress, now)
}

// ── Invoice templates ─────────────────────────────────────

export interface InvoiceTemplateRow {
  id: string
  name: string
  description: string | null
  theme: string
  primaryColor: string
  secondaryColor: string
  logoUrl: string | null
  brandName: string | null
  brandAddress: string | null
  phone: string | null
  website: string | null
  taxId: string | null
  defaultNotes: string | null
  defaultPaymentTerms: string | null
  defaultTaxRate: number
  isDefault: boolean
  createdAt: string
}

function rowToInvoiceTemplate(r: {
  id: string; name: string; description: string | null; theme: string
  primary_color: string; secondary_color: string; logo_url: string | null
  brand_name: string | null; brand_address: string | null; phone: string | null
  website: string | null; tax_id: string | null; default_notes: string | null
  default_payment_terms: string | null; default_tax_rate: number
  is_default: number; created_at: string
}): InvoiceTemplateRow {
  return {
    id: r.id, name: r.name, description: r.description, theme: r.theme,
    primaryColor: r.primary_color, secondaryColor: r.secondary_color,
    logoUrl: r.logo_url, brandName: r.brand_name, brandAddress: r.brand_address,
    phone: r.phone, website: r.website, taxId: r.tax_id,
    defaultNotes: r.default_notes, defaultPaymentTerms: r.default_payment_terms,
    defaultTaxRate: r.default_tax_rate, isDefault: Boolean(r.is_default),
    createdAt: r.created_at,
  }
}

export function getInvoiceTemplates(userId: string): InvoiceTemplateRow[] {
  return (getDb()
    .prepare(`SELECT * FROM invoice_templates WHERE user_id = ? ORDER BY is_default DESC, name`)
    .all(userId) as unknown as Parameters<typeof rowToInvoiceTemplate>[0][])
    .map(rowToInvoiceTemplate)
}

export function getInvoiceTemplate(id: string): InvoiceTemplateRow | null {
  const row = getDb()
    .prepare(`SELECT * FROM invoice_templates WHERE id = ?`)
    .get(id) as Parameters<typeof rowToInvoiceTemplate>[0] | undefined
  return row ? rowToInvoiceTemplate(row) : null
}

export function createInvoiceTemplate(
  userId: string,
  data: Partial<Omit<InvoiceTemplateRow, 'id' | 'createdAt'>> & { name: string }
): string {
  const id = `itpl-${Date.now()}`
  getDb().prepare(
    `INSERT INTO invoice_templates
       (id, user_id, name, description, theme, primary_color, secondary_color,
        brand_name, brand_address, phone, website, tax_id, default_notes,
        default_payment_terms, default_tax_rate, is_default)
     VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)`
  ).run(
    id, userId, data.name, data.description ?? null,
    data.theme ?? 'summit', data.primaryColor ?? '#635BFF',
    data.secondaryColor ?? '#111827', data.brandName ?? null,
    data.brandAddress ?? null, data.phone ?? null, data.website ?? null,
    data.taxId ?? null, data.defaultNotes ?? null,
    data.defaultPaymentTerms ?? null, data.defaultTaxRate ?? 0,
    data.isDefault ? 1 : 0
  )
  return id
}

export function updateInvoiceTemplate(
  id: string,
  userId: string,
  data: Partial<Omit<InvoiceTemplateRow, 'id' | 'createdAt'>> & { name: string }
): void {
  getDb().prepare(
    `UPDATE invoice_templates SET
       name=?, description=?, theme=?, primary_color=?, secondary_color=?,
       brand_name=?, brand_address=?, phone=?, website=?, tax_id=?,
       default_notes=?, default_payment_terms=?, default_tax_rate=?, is_default=?,
       updated_at=CURRENT_TIMESTAMP
     WHERE id=? AND user_id=?`
  ).run(
    data.name, data.description ?? null, data.theme ?? 'summit',
    data.primaryColor ?? '#635BFF', data.secondaryColor ?? '#111827',
    data.brandName ?? null, data.brandAddress ?? null, data.phone ?? null,
    data.website ?? null, data.taxId ?? null, data.defaultNotes ?? null,
    data.defaultPaymentTerms ?? null, data.defaultTaxRate ?? 0,
    data.isDefault ? 1 : 0, id, userId
  )
}

export function deleteInvoiceTemplate(id: string, userId: string): void {
  getDb().prepare(`DELETE FROM invoice_templates WHERE id=? AND user_id=?`).run(id, userId)
}

// ── Line item presets ──────────────────────────────────────

export interface LineItemPreset {
  id: string
  label: string
  description: string | null
  defaultRate: number | null
}

export function getLineItemPresets(profession: Profession | null): LineItemPreset[] {
  return (getDb()
    .prepare(
      `SELECT id, label, description, default_rate FROM line_item_presets
       WHERE profession = ? ORDER BY sort_order`
    )
    .all(profession ?? 'other') as unknown as Array<{
      id: string; label: string; description: string | null; default_rate: number | null
    }>).map((r) => ({ id: r.id, label: r.label, description: r.description, defaultRate: r.default_rate }))
}

// ── Invoices ──────────────────────────────────────────────

export interface InvoiceItem {
  description: string
  quantity: number
  unitPrice: number
  amount: number
}

export interface InvoiceListRow {
  id: string
  invoiceNumber: string
  clientId: string
  clientName: string
  total: number
  currency: string
  status: string
  invoiceDate: string
  dueDate: string | null
  shareToken: string
}

export interface InvoiceDetailRow extends InvoiceListRow {
  subtotal: number
  taxRate: number
  taxAmount: number
  discountAmount: number
  paidAmount: number
  items: InvoiceItem[]
  notes: string | null
  paymentTerms: string | null
  clientEmail: string | null
  clientCompany: string | null
  clientAddress: string | null
  templateId: string | null
  template: InvoiceTemplateRow | null
  createdAt: string
}

export function getNextInvoiceSequence(userId: string): number {
  const row = getDb()
    .prepare(`SELECT COUNT(*) as cnt FROM invoices WHERE user_id = ?`)
    .get(userId) as { cnt: number }
  return (row.cnt || 0) + 1
}

export function getInvoices(userId: string): InvoiceListRow[] {
  return (getDb()
    .prepare(
      `SELECT i.id, i.invoice_number, i.client_id, i.total, i.currency, i.status,
              i.invoice_date, i.due_date, i.share_token,
              c.name as client_name
       FROM invoices i
       JOIN clients c ON i.client_id = c.id
       WHERE i.user_id = ? ORDER BY i.created_at DESC`
    )
    .all(userId) as unknown as Array<{
    id: string; invoice_number: string; client_id: string; total: number
    currency: string; status: string; invoice_date: string; due_date: string | null
    share_token: string; client_name: string
  }>).map((r) => ({
    id: r.id, invoiceNumber: r.invoice_number, clientId: r.client_id,
    clientName: r.client_name, total: r.total, currency: r.currency,
    status: r.status, invoiceDate: r.invoice_date, dueDate: r.due_date,
    shareToken: r.share_token,
  }))
}

export function getInvoice(id: string, userId: string): InvoiceDetailRow | null {
  const row = getDb()
    .prepare(
      `SELECT i.*, c.name as client_name, c.email as client_email,
              c.company as client_company, c.address as client_address
       FROM invoices i
       JOIN clients c ON i.client_id = c.id
       WHERE i.id = ? AND i.user_id = ?`
    )
    .get(id, userId) as unknown as {
    id: string; invoice_number: string; client_id: string; total: number
    currency: string; status: string; invoice_date: string; due_date: string | null
    share_token: string; client_name: string; subtotal: number; tax_rate: number
    tax_amount: number; discount_amount: number; paid_amount: number
    items: string; notes: string | null; payment_terms: string | null
    client_email: string | null; client_company: string | null
    client_address: string | null; invoice_template_id: string | null
    created_at: string
  } | undefined

  if (!row) return null

  const template = row.invoice_template_id ? getInvoiceTemplate(row.invoice_template_id) : null

  return {
    id: row.id, invoiceNumber: row.invoice_number, clientId: row.client_id,
    clientName: row.client_name, total: row.total, currency: row.currency,
    status: row.status, invoiceDate: row.invoice_date, dueDate: row.due_date,
    shareToken: row.share_token, subtotal: row.subtotal, taxRate: row.tax_rate,
    taxAmount: row.tax_amount, discountAmount: row.discount_amount,
    paidAmount: row.paid_amount,
    items: JSON.parse(row.items || '[]') as InvoiceItem[],
    notes: row.notes, paymentTerms: row.payment_terms,
    clientEmail: row.client_email, clientCompany: row.client_company,
    clientAddress: row.client_address, templateId: row.invoice_template_id,
    template, createdAt: row.created_at,
  }
}

export function createInvoice(
  userId: string,
  data: {
    clientId: string
    templateId: string | null
    invoiceNumber: string
    invoiceDate: string
    dueDate?: string
    currency: string
    items: InvoiceItem[]
    subtotal: number
    taxRate: number
    taxAmount: number
    discountAmount: number
    depositAmount: number
    total: number
    notes?: string
    paymentTerms?: string
  }
): string {
  const id = `inv-${Date.now()}`
  const plan = (getDb()
    .prepare(`SELECT plan FROM profiles WHERE id = ?`)
    .get(userId) as { plan: string } | undefined)?.plan ?? 'free'

  getDb().prepare(
    `INSERT INTO invoices
       (id, user_id, client_id, invoice_template_id, invoice_number, invoice_date, due_date,
        currency, items, subtotal, tax_rate, tax_amount, discount_amount, total,
        paid_amount, notes, payment_terms, status, has_branding_footer)
     VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,'draft',?)`
  ).run(
    id, userId, data.clientId, data.templateId ?? null,
    data.invoiceNumber, data.invoiceDate, data.dueDate ?? null,
    data.currency, JSON.stringify(data.items),
    data.subtotal, data.taxRate, data.taxAmount, data.discountAmount,
    data.total, data.depositAmount, data.notes ?? null, data.paymentTerms ?? null,
    plan === 'free' ? 1 : 0
  )
  getDb()
    .prepare(`UPDATE profiles SET docs_used_this_month = docs_used_this_month + 1 WHERE id = ?`)
    .run(userId)
  return id
}

export function updateInvoiceStatus(id: string, userId: string, status: string): void {
  getDb()
    .prepare(`UPDATE invoices SET status=?, updated_at=CURRENT_TIMESTAMP WHERE id=? AND user_id=?`)
    .run(status, id, userId)
}

export interface PaymentRow {
  id: string
  amount: number
  paymentDate: string
  method: string
  notes: string | null
  createdAt: string
}

export function getInvoicePayments(invoiceId: string): PaymentRow[] {
  return (getDb()
    .prepare(`SELECT id, amount, payment_date, method, notes, created_at FROM payments WHERE invoice_id = ? ORDER BY payment_date DESC`)
    .all(invoiceId) as unknown as Array<{
      id: string; amount: number; payment_date: string; method: string; notes: string | null; created_at: string
    }>).map((r) => ({
    id: r.id, amount: r.amount, paymentDate: r.payment_date,
    method: r.method, notes: r.notes, createdAt: r.created_at,
  }))
}

export function recordPayment(
  invoiceId: string,
  data: { amount: number; paymentDate: string; method: string; notes?: string }
): string {
  const id = `pay-${Date.now()}`
  const db = getDb()
  db.prepare(
    `INSERT INTO payments (id, invoice_id, amount, payment_date, method, notes)
     VALUES (?,?,?,?,?,?)`
  ).run(id, invoiceId, data.amount, data.paymentDate, data.method, data.notes ?? null)

  // Update paid_amount and status
  const inv = db
    .prepare(`SELECT total, paid_amount FROM invoices WHERE id = ?`)
    .get(invoiceId) as { total: number; paid_amount: number } | undefined
  if (inv) {
    const newPaid = inv.paid_amount + data.amount
    const newStatus = newPaid >= inv.total ? 'paid' : 'partial'
    db.prepare(`UPDATE invoices SET paid_amount=?, status=?, updated_at=CURRENT_TIMESTAMP WHERE id=?`)
      .run(newPaid, newStatus, invoiceId)
  }
  return id
}

export interface InvoicePublicRow {
  id: string
  invoiceNumber: string
  invoiceDate: string
  dueDate: string | null
  currency: string
  items: InvoiceItem[]
  subtotal: number
  taxRate: number
  taxAmount: number
  discountAmount: number
  paidAmount: number
  total: number
  notes: string | null
  paymentTerms: string | null
  status: string
  hasBrandingFooter: boolean
  clientName: string
  clientEmail: string | null
  clientCompany: string | null
  freelancerName: string
  businessName: string | null
  template: InvoiceTemplateRow | null
}

export function getInvoiceByShareToken(token: string): InvoicePublicRow | null {
  const row = getDb()
    .prepare(
      `SELECT i.*, c.name as client_name, c.email as client_email, c.company as client_company,
              p.full_name as freelancer_name, p.business_name
       FROM invoices i
       JOIN clients c ON i.client_id = c.id
       JOIN profiles p ON i.user_id = p.id
       WHERE i.share_token = ?`
    )
    .get(token) as unknown as {
    id: string; invoice_number: string; invoice_date: string; due_date: string | null
    currency: string; items: string; subtotal: number; tax_rate: number; tax_amount: number
    discount_amount: number; paid_amount: number; total: number; notes: string | null
    payment_terms: string | null; status: string; has_branding_footer: number
    client_name: string; client_email: string | null; client_company: string | null
    freelancer_name: string | null; business_name: string | null
    invoice_template_id: string | null
  } | undefined

  if (!row) return null

  // Track open
  getDb()
    .prepare(`UPDATE invoices SET open_count=open_count+1, last_opened_at=CURRENT_TIMESTAMP WHERE share_token=?`)
    .run(token)

  const template = row.invoice_template_id ? getInvoiceTemplate(row.invoice_template_id) : null

  return {
    id: row.id, invoiceNumber: row.invoice_number, invoiceDate: row.invoice_date,
    dueDate: row.due_date, currency: row.currency,
    items: JSON.parse(row.items || '[]') as InvoiceItem[],
    subtotal: row.subtotal, taxRate: row.tax_rate, taxAmount: row.tax_amount,
    discountAmount: row.discount_amount, paidAmount: row.paid_amount, total: row.total,
    notes: row.notes, paymentTerms: row.payment_terms, status: row.status,
    hasBrandingFooter: Boolean(row.has_branding_footer),
    clientName: row.client_name, clientEmail: row.client_email,
    clientCompany: row.client_company,
    freelancerName: row.freelancer_name || 'Service Provider',
    businessName: row.business_name, template,
  }
}

// ── Reminder settings ─────────────────────────────────────

export interface ReminderSettingsRow {
  enabled: boolean
  daysBefore: number[]
  sendOnDueDate: boolean
  daysAfterOverdue: number[]
  autoStopOnPaid: boolean
  allowUnsubscribe: boolean
  skipBelowBalance: number
}

export function getReminderSettings(userId: string): ReminderSettingsRow {
  const row = getDb()
    .prepare(`SELECT * FROM reminder_settings WHERE user_id = ?`)
    .get(userId) as {
    enabled: number; days_before: string; send_on_due_date: number
    days_after_overdue: string; auto_stop_on_paid: number | null
    allow_unsubscribe: number | null; skip_below_balance: number
  } | undefined

  const defaults: ReminderSettingsRow = {
    enabled: true, daysBefore: [3, 1], sendOnDueDate: true,
    daysAfterOverdue: [3, 7, 14], autoStopOnPaid: true,
    allowUnsubscribe: true, skipBelowBalance: 10,
  }
  if (!row) return defaults

  return {
    enabled: Boolean(row.enabled),
    daysBefore: JSON.parse(row.days_before || '[3,1]') as number[],
    sendOnDueDate: Boolean(row.send_on_due_date),
    daysAfterOverdue: JSON.parse(row.days_after_overdue || '[3,7,14]') as number[],
    autoStopOnPaid: row.auto_stop_on_paid !== null ? Boolean(row.auto_stop_on_paid) : true,
    allowUnsubscribe: row.allow_unsubscribe !== null ? Boolean(row.allow_unsubscribe) : true,
    skipBelowBalance: row.skip_below_balance,
  }
}

export function saveReminderSettings(userId: string, data: ReminderSettingsRow): void {
  getDb().prepare(
    `INSERT INTO reminder_settings
       (user_id, enabled, days_before, send_on_due_date, days_after_overdue,
        auto_stop_on_paid, allow_unsubscribe, skip_below_balance)
     VALUES (?,?,?,?,?,?,?,?)
     ON CONFLICT(user_id) DO UPDATE SET
       enabled=excluded.enabled, days_before=excluded.days_before,
       send_on_due_date=excluded.send_on_due_date,
       days_after_overdue=excluded.days_after_overdue,
       auto_stop_on_paid=excluded.auto_stop_on_paid,
       allow_unsubscribe=excluded.allow_unsubscribe,
       skip_below_balance=excluded.skip_below_balance`
  ).run(
    userId, data.enabled ? 1 : 0,
    JSON.stringify(data.daysBefore), data.sendOnDueDate ? 1 : 0,
    JSON.stringify(data.daysAfterOverdue),
    data.autoStopOnPaid ? 1 : 0, data.allowUnsubscribe ? 1 : 0,
    data.skipBelowBalance
  )
}

export interface ReminderLogRow {
  id: string
  invoiceNumber: string
  clientName: string
  recipientEmail: string
  status: string
  sentAt: string
  openedAt: string | null
}

export function getReminderLogs(userId: string, limit = 50): ReminderLogRow[] {
  return (getDb()
    .prepare(
      `SELECT rl.id, rl.recipient_email, rl.status, rl.sent_at, rl.opened_at,
              i.invoice_number, c.name as client_name
       FROM reminder_logs rl
       JOIN invoices i ON rl.invoice_id = i.id
       JOIN clients c ON i.client_id = c.id
       WHERE i.user_id = ?
       ORDER BY rl.sent_at DESC LIMIT ?`
    )
    .all(userId, limit) as unknown as Array<{
    id: string; recipient_email: string; status: string; sent_at: string
    opened_at: string | null; invoice_number: string; client_name: string
  }>).map((r) => ({
    id: r.id, invoiceNumber: r.invoice_number, clientName: r.client_name,
    recipientEmail: r.recipient_email, status: r.status,
    sentAt: r.sent_at, openedAt: r.opened_at,
  }))
}

// ── Profile update (full settings) ────────────────────────

export interface ProfileUpdateData {
  fullName?: string
  phone?: string
  businessName?: string
  address?: string
  city?: string
  state?: string
  postalCode?: string
  country?: string
  taxId?: string
  defaultCurrency?: string
  defaultTaxRate?: number
  timezone?: string
  profession?: Profession
  notificationPrefs?: Record<string, boolean>
}

export function updateProfile(userId: string, data: ProfileUpdateData): void {
  const db = getDb()
  const fields: string[] = []
  const values: unknown[] = []

  if (data.fullName !== undefined) { fields.push('full_name=?'); values.push(data.fullName) }
  if (data.phone !== undefined) { fields.push('phone=?'); values.push(data.phone) }
  if (data.businessName !== undefined) { fields.push('business_name=?'); values.push(data.businessName) }
  if (data.address !== undefined) { fields.push('address=?'); values.push(data.address) }
  if (data.city !== undefined) { fields.push('city=?'); values.push(data.city) }
  if (data.state !== undefined) { fields.push('state=?'); values.push(data.state) }
  if (data.postalCode !== undefined) { fields.push('postal_code=?'); values.push(data.postalCode) }
  if (data.country !== undefined) { fields.push('country=?'); values.push(data.country) }
  if (data.taxId !== undefined) { fields.push('tax_id=?'); values.push(data.taxId) }
  if (data.defaultCurrency !== undefined) { fields.push('default_currency=?'); values.push(data.defaultCurrency) }
  if (data.defaultTaxRate !== undefined) { fields.push('default_tax_rate=?'); values.push(data.defaultTaxRate) }
  if (data.timezone !== undefined) { fields.push('timezone=?'); values.push(data.timezone) }
  if (data.profession !== undefined) { fields.push('profession=?'); values.push(data.profession) }
  if (data.notificationPrefs !== undefined) { fields.push('notification_prefs=?'); values.push(JSON.stringify(data.notificationPrefs)) }

  if (fields.length === 0) return
  fields.push('updated_at=CURRENT_TIMESTAMP')
  values.push(userId)
  db.prepare(`UPDATE profiles SET ${fields.join(',')} WHERE id=?`).run(...values)
}

export function getFullProfile(userId: string) {
  return getDb()
    .prepare(
      `SELECT id, email, full_name, phone, business_name, business_logo, address,
              city, state, postal_code, country, tax_id, default_currency,
              default_tax_rate, timezone, profession, plan, onboarding_complete,
              docs_used_this_month, docs_reset_at, lemon_squeezy_customer_id,
              plan_expires_at, COALESCE(notification_prefs, '{}') as notification_prefs
       FROM profiles WHERE id = ?`
    )
    .get(userId) as unknown as {
    id: string; email: string; full_name: string | null; phone: string | null
    business_name: string | null; business_logo: string | null; address: string | null
    city: string | null; state: string | null; postal_code: string | null
    country: string | null; tax_id: string | null; default_currency: string
    default_tax_rate: number; timezone: string; profession: Profession | null
    plan: Plan; onboarding_complete: number; docs_used_this_month: number
    docs_reset_at: string | null; lemon_squeezy_customer_id: string | null
    plan_expires_at: string | null; notification_prefs: string
  } | undefined
}

// ── Doc limit check ────────────────────────────────────────

export function checkDocLimit(userId: string): { allowed: boolean; used: number; limit: number } {
  const row = getDb()
    .prepare(`SELECT plan, docs_used_this_month FROM profiles WHERE id = ?`)
    .get(userId) as { plan: Plan; docs_used_this_month: number } | undefined

  if (!row) return { allowed: false, used: 0, limit: 3 }
  if (row.plan !== 'free') return { allowed: true, used: row.docs_used_this_month, limit: Infinity }
  const limit = 3
  const used = row.docs_used_this_month ?? 0
  return { allowed: used < limit, used, limit }
}

function formatAuditDescription(
  eventType: string,
  signerName: string | null,
  signerEmail: string | null,
  contractTitle: string
): string {
  const who = signerName || signerEmail || 'Client'
  switch (eventType) {
    case 'viewed': return `${who} viewed "${contractTitle}"`
    case 'signed': return `${who} signed "${contractTitle}"`
    case 'sent': return `"${contractTitle}" sent for signature`
    case 'created': return `"${contractTitle}" created`
    default: return `Activity on "${contractTitle}"`
  }
}

export function completeOnboarding(input: OnboardingInput) {
  getDb()
    .prepare(
      `UPDATE profiles
       SET profession = ?,
           business_name = ?,
           full_name = ?,
           phone = ?,
           plan = ?,
           onboarding_complete = 1,
           updated_at = CURRENT_TIMESTAMP
       WHERE id = ?`
    )
    .run(
      input.profession,
      input.businessName,
      input.fullName,
      input.phone || null,
      input.plan,
      'local-user'
    )
}
