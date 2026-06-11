import 'server-only'

import { adminClient } from '@/lib/supabase/admin'
import type { Plan, Profession, IntakeField, IntakeForm, IntakeResponse } from '@/types'

// ── Auth helper ────────────────────────────────────────────
// API routes and server actions import this to get the current user.
// Pages use createClient() from @/lib/supabase/server directly.

export { adminClient as getDb }

// ── Profile ────────────────────────────────────────────────

export interface LocalProfile {
  id: string
  email: string
  fullName: string
  businessName: string | null
  businessLogo: string | null
  phone: string | null
  plan: Plan
  trialEndsAt: string | null
  profession: Profession | null
  onboardingComplete: boolean
  defaultTaxRate: number
}

export interface OnboardingInput {
  profession: Profession
  businessName: string
  fullName: string
  phone?: string
}

export async function getCurrentProfile(userId: string): Promise<LocalProfile> {
  const { data, error } = await adminClient
    .from('profiles')
    .select('id, email, full_name, business_name, business_logo, phone, plan, trial_ends_at, profession, onboarding_complete, default_tax_rate')
    .eq('id', userId)
    .single()

  if (error || !data) throw new Error('Profile not found')

  return {
    id: data.id,
    email: data.email ?? '',
    fullName: data.full_name || data.email || '',
    businessName: data.business_name,
    businessLogo: data.business_logo ?? null,
    phone: data.phone,
    plan: (data.plan as Plan) ?? 'trial',
    trialEndsAt: data.trial_ends_at ?? null,
    profession: data.profession as Profession | null,
    onboardingComplete: Boolean(data.onboarding_complete),
    defaultTaxRate: data.default_tax_rate ?? 0,
  }
}

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
  businessLogo?: string
}

export async function updateProfile(userId: string, data: ProfileUpdateData): Promise<void> {
  const update: Record<string, unknown> = { updated_at: new Date().toISOString() }
  if (data.fullName !== undefined) update.full_name = data.fullName
  if (data.phone !== undefined) update.phone = data.phone
  if (data.businessName !== undefined) update.business_name = data.businessName
  if (data.address !== undefined) update.address = data.address
  if (data.city !== undefined) update.city = data.city
  if (data.state !== undefined) update.state = data.state
  if (data.postalCode !== undefined) update.postal_code = data.postalCode
  if (data.country !== undefined) update.country = data.country
  if (data.taxId !== undefined) update.tax_id = data.taxId
  if (data.defaultCurrency !== undefined) update.default_currency = data.defaultCurrency
  if (data.defaultTaxRate !== undefined) update.default_tax_rate = data.defaultTaxRate
  if (data.timezone !== undefined) update.timezone = data.timezone
  if (data.profession !== undefined) update.profession = data.profession
  if (data.notificationPrefs !== undefined) update.notification_prefs = data.notificationPrefs
  if (data.businessLogo !== undefined) update.business_logo = data.businessLogo

  const { error } = await adminClient.from('profiles').update(update).eq('id', userId)
  if (error) throw new Error(error.message)
}

export async function getFullProfile(userId: string) {
  const { data } = await adminClient
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single()
  return data
}

export async function completeOnboarding(userId: string, input: OnboardingInput): Promise<void> {
  const { error } = await adminClient
    .from('profiles')
    .update({
      profession: input.profession,
      business_name: input.businessName,
      full_name: input.fullName,
      phone: input.phone || null,
      onboarding_complete: true,
      updated_at: new Date().toISOString(),
    })
    .eq('id', userId)
  if (error) throw new Error(error.message)
}

// ── Access check ───────────────────────────────────────────

export async function checkDocLimit(userId: string): Promise<{
  allowed: boolean
  isTrial?: boolean
  daysLeft?: number
  reason?: string
}> {
  const { data: profile } = await adminClient
    .from('profiles')
    .select('plan, trial_ends_at')
    .eq('id', userId)
    .single()

  if (!profile) return { allowed: false, reason: 'no_profile' }

  if (
    profile.plan === 'pro' ||
    profile.plan === 'pro_monthly' ||
    profile.plan === 'pro_annual' ||
    profile.plan === 'lifetime'
  ) {
    return { allowed: true }
  }

  if (profile.plan === 'trial') {
    const trialEnd = new Date(profile.trial_ends_at)
    if (trialEnd > new Date()) {
      return {
        allowed: true,
        isTrial: true,
        daysLeft: Math.ceil((trialEnd.getTime() - Date.now()) / 86400000),
      }
    }
    return { allowed: false, reason: 'trial_expired' }
  }

  return { allowed: false, reason: 'upgrade_required' }
}

// ── Clients ────────────────────────────────────────────────

export interface ClientRow {
  id: string
  name: string
  email: string | null
  company: string | null
  portalToken?: string | null
}

export interface ClientDetailRow extends ClientRow {
  address: string | null
  notes: string | null
  createdAt: string
  contractCount: number
  invoiceCount: number
  remindersPaused: boolean
}

export async function getClients(userId: string): Promise<ClientRow[]> {
  const { data, error } = await adminClient
    .from('clients')
    .select('id, name, email, company, portal_token')
    .eq('user_id', userId)
    .order('name')
  if (error) throw new Error(error.message)
  return (data ?? []).map((r) => ({
    id: r.id,
    name: r.name,
    email: r.email,
    company: r.company,
    portalToken: r.portal_token ?? null,
  }))
}

export async function getClientById(id: string, userId: string): Promise<ClientDetailRow | null> {
  const { data, error } = await adminClient
    .from('clients')
    .select('id, name, email, company, address, notes, created_at, reminders_paused')
    .eq('id', id)
    .eq('user_id', userId)
    .single()
  if (error || !data) return null

  const [{ count: contractCount }, { count: invoiceCount }] = await Promise.all([
    adminClient.from('contracts').select('*', { count: 'exact', head: true }).eq('client_id', id),
    adminClient.from('invoices').select('*', { count: 'exact', head: true }).eq('client_id', id),
  ])

  return {
    id: data.id,
    name: data.name,
    email: data.email,
    company: data.company,
    address: data.address,
    notes: data.notes,
    createdAt: data.created_at,
    contractCount: contractCount ?? 0,
    invoiceCount: invoiceCount ?? 0,
    remindersPaused: data.reminders_paused ?? false,
  }
}

export async function toggleClientRemindersPaused(
  clientId: string,
  userId: string,
  paused: boolean
): Promise<void> {
  const { error } = await adminClient
    .from('clients')
    .update({ reminders_paused: paused })
    .eq('id', clientId)
    .eq('user_id', userId)
  if (error) throw new Error(error.message)
}

export async function createClient(
  userId: string,
  data: { name: string; email?: string; phone?: string; company?: string; address?: string; notes?: string }
): Promise<string> {
  const { data: row, error } = await adminClient
    .from('clients')
    .insert({
      user_id: userId,
      name: data.name,
      email: data.email ?? null,
      phone: data.phone ?? null,
      company: data.company ?? null,
      address: data.address ?? null,
      notes: data.notes ?? null,
    })
    .select('id')
    .single()
  if (error) throw new Error(error.message)
  return row.id
}

export async function updateClient(
  id: string,
  userId: string,
  data: { name: string; email?: string; phone?: string; company?: string; address?: string; notes?: string }
): Promise<void> {
  const { error } = await adminClient
    .from('clients')
    .update({
      name: data.name,
      email: data.email ?? null,
      phone: data.phone ?? null,
      company: data.company ?? null,
      address: data.address ?? null,
      notes: data.notes ?? null,
      updated_at: new Date().toISOString(),
    })
    .eq('id', id)
    .eq('user_id', userId)
  if (error) throw new Error(error.message)
}

export async function deleteClient(id: string, userId: string): Promise<void> {
  const { error } = await adminClient
    .from('clients')
    .delete()
    .eq('id', id)
    .eq('user_id', userId)
  if (error) throw new Error(error.message)
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

function rowToContractTemplate(r: {
  id: string; name: string; description: string | null; content: string
  is_default: boolean; is_global: boolean; profession: string | null
  user_id: string | null; created_at: string
}): ContractTemplateRow {
  return {
    id: r.id, name: r.name, description: r.description, content: r.content,
    isDefault: Boolean(r.is_default), isGlobal: Boolean(r.is_global),
    profession: r.profession, userId: r.user_id, createdAt: r.created_at,
  }
}

export async function getContractTemplates(
  userId: string,
  profession: Profession | null
): Promise<{ my: ContractTemplateRow[]; global: ContractTemplateRow[] }> {
  const [myRes, globalRes] = await Promise.all([
    adminClient
      .from('contract_templates')
      .select('*')
      .eq('user_id', userId)
      .order('is_default', { ascending: false })
      .order('name'),
    adminClient
      .from('contract_templates')
      .select('*')
      .eq('is_global', true)
      .is('user_id', null)
      .order('name'),
  ])

  const globalRows = (globalRes.data ?? []).sort((a, b) => {
    const aMatch = a.profession === profession ? 0 : a.profession === null ? 1 : 2
    const bMatch = b.profession === profession ? 0 : b.profession === null ? 1 : 2
    return aMatch - bMatch || a.name.localeCompare(b.name)
  })

  return {
    my: (myRes.data ?? []).map(rowToContractTemplate),
    global: globalRows.map(rowToContractTemplate),
  }
}

export async function getContractTemplate(id: string): Promise<ContractTemplateRow | null> {
  const { data } = await adminClient
    .from('contract_templates')
    .select('*')
    .eq('id', id)
    .single()
  return data ? rowToContractTemplate(data) : null
}

export async function createContractTemplate(
  userId: string,
  data: { name: string; description?: string; content: string; isDefault?: boolean }
): Promise<string> {
  const { data: row, error } = await adminClient
    .from('contract_templates')
    .insert({
      user_id: userId,
      name: data.name,
      description: data.description ?? null,
      content: data.content,
      is_default: data.isDefault ?? false,
      is_global: false,
    })
    .select('id')
    .single()
  if (error) throw new Error(error.message)
  return row.id
}

export async function updateContractTemplate(
  id: string,
  userId: string,
  data: { name: string; description?: string; content: string; isDefault?: boolean }
): Promise<void> {
  const { error } = await adminClient
    .from('contract_templates')
    .update({
      name: data.name,
      description: data.description ?? null,
      content: data.content,
      is_default: data.isDefault ?? false,
    })
    .eq('id', id)
    .eq('user_id', userId)
  if (error) throw new Error(error.message)
}

export async function deleteContractTemplate(id: string, userId: string): Promise<void> {
  const { error } = await adminClient
    .from('contract_templates')
    .delete()
    .eq('id', id)
    .eq('user_id', userId)
    .eq('is_global', false)
  if (error) throw new Error(error.message)
}

// ── Contracts ──────────────────────────────────────────────

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
  signedPdfUrl: string | null
  clientEmail: string | null
  clientCompany: string | null
}

export async function getContracts(userId: string): Promise<ContractListRow[]> {
  const { data, error } = await adminClient
    .from('contracts')
    .select('id, title, client_id, amount, currency, status, created_at, clients!inner(name)')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
  if (error) throw new Error(error.message)
  return (data ?? []).map((r) => ({
    id: r.id, title: r.title, clientId: r.client_id,
    clientName: (r.clients as unknown as { name: string })?.name ?? '',
    amount: r.amount, currency: r.currency, status: r.status, createdAt: r.created_at,
  }))
}

export async function getContract(id: string, userId: string): Promise<ContractDetailRow | null> {
  const { data } = await adminClient
    .from('contracts')
    .select(`
      id, title, client_id, amount, currency, status, created_at,
      project_description, payment_terms, start_date, end_date,
      additional_terms, signed_at, signed_pdf_url, niche_content,
      clients!inner(name, email, company),
      contract_templates(content)
    `)
    .eq('id', id)
    .eq('user_id', userId)
    .single()
  if (!data) return null

  const client = data.clients as unknown as { name: string; email: string | null; company: string | null }
  const template = data.contract_templates as unknown as { content: string } | null
  const nicheContent = (data as unknown as { niche_content: string | null }).niche_content

  return {
    id: data.id, title: data.title, clientId: data.client_id,
    clientName: client?.name ?? '', amount: data.amount,
    currency: data.currency, status: data.status, createdAt: data.created_at,
    projectDescription: data.project_description,
    paymentTerms: data.payment_terms, startDate: data.start_date,
    endDate: data.end_date, additionalTerms: data.additional_terms,
    templateContent: nicheContent ?? template?.content ?? null,
    signedAt: data.signed_at, signedPdfUrl: data.signed_pdf_url ?? null,
    clientEmail: client?.email ?? null,
    clientCompany: client?.company ?? null,
  }
}

export async function createContract(
  userId: string,
  data: {
    clientId: string; templateId: string; title: string; projectDescription: string
    amount: number; currency: string; paymentTerms: string; startDate: string
    endDate?: string; additionalTerms?: string; nicheContent?: string
  }
): Promise<string> {
  const { data: row, error } = await adminClient
    .from('contracts')
    .insert({
      user_id: userId,
      client_id: data.clientId,
      template_id: data.templateId,
      title: data.title,
      project_description: data.projectDescription,
      amount: data.amount,
      currency: data.currency,
      payment_terms: data.paymentTerms,
      start_date: data.startDate,
      end_date: data.endDate ?? null,
      additional_terms: data.additionalTerms ?? null,
      niche_content: data.nicheContent ?? null,
      status: 'draft',
      has_branding_footer: true,
    })
    .select('id')
    .single()
  if (error) throw new Error(error.message)
  return row.id
}

export async function createSigningSession(contractId: string, signerEmail: string): Promise<string> {
  const { data: row, error } = await adminClient
    .from('signing_sessions')
    .insert({ contract_id: contractId, signer_email: signerEmail })
    .select('unique_token')
    .single()
  if (error) throw new Error(error.message)

  await adminClient.from('contracts').update({ status: 'sent' }).eq('id', contractId)
  return row.unique_token
}

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
  freelancerLogo: string | null
  clientName: string
  clientEmail: string | null
  clientCompany: string | null
  amount: number
  currency: string
  startDate: string | null
  endDate: string | null
  paymentTerms: string | null
  projectDescription: string | null
  additionalTerms: string | null
}

export async function getContractForSigning(token: string): Promise<SigningSessionRow | null> {
  const { data } = await adminClient
    .from('signing_sessions')
    .select(`
      unique_token, contract_id, signer_email, signer_name, status,
      contracts(
        title, amount, currency, start_date, end_date, payment_terms,
        project_description, user_id, additional_terms, niche_content,
        contract_templates(content),
        clients!inner(name, email, company)
      )
    `)
    .eq('unique_token', token)
    .single()
  if (!data) return null

  const contract = data.contracts as unknown as {
    title: string; amount: number; currency: string; start_date: string | null
    end_date: string | null; payment_terms: string | null; project_description: string | null
    user_id: string
    additional_terms: string | null
    niche_content: string | null
    contract_templates: { content: string } | null
    clients: { name: string; email: string | null; company: string | null }
  }

  const { data: profileData } = await adminClient
    .from('profiles')
    .select('full_name, business_name, business_logo')
    .eq('id', contract.user_id)
    .single()

  const profile = profileData as { full_name: string | null; business_name: string | null; business_logo: string | null } | null

  return {
    token: data.unique_token,
    contractId: data.contract_id,
    contractTitle: contract.title,
    contractContent: contract.niche_content ?? contract.contract_templates?.content ?? null,
    signerEmail: data.signer_email,
    signerName: data.signer_name,
    status: data.status,
    freelancerName: profile?.full_name || 'Service Provider',
    freelancerBusiness: profile?.business_name ?? null,
    freelancerLogo: profile?.business_logo ?? null,
    clientName: contract.clients.name,
    clientEmail: contract.clients.email,
    clientCompany: contract.clients.company,
    amount: contract.amount,
    currency: contract.currency,
    startDate: contract.start_date,
    endDate: contract.end_date,
    paymentTerms: contract.payment_terms,
    projectDescription: contract.project_description,
    additionalTerms: contract.additional_terms,
  }
}

export async function submitContractSignature(
  token: string,
  signerName: string,
  ipAddress: string
): Promise<void> {
  const { data: session, error } = await adminClient
    .from('signing_sessions')
    .select('id, contract_id')
    .eq('unique_token', token)
    .eq('status', 'pending')
    .single()

  if (error || !session) throw new Error('Invalid or already-signed token')

  const now = new Date().toISOString()

  await Promise.all([
    adminClient.from('signing_sessions').update({
      status: 'signed', signer_name: signerName, signed_at: now,
    }).eq('id', session.id),
    adminClient.from('contracts').update({
      status: 'signed', signed_at: now,
    }).eq('id', session.contract_id),
    adminClient.from('audit_events').insert({
      contract_id: session.contract_id,
      signing_session_id: session.id,
      event_type: 'signed',
      signer_name: signerName,
      ip_address: ipAddress,
      timestamp: now,
    }),
  ])
}

// ── Invoice templates ──────────────────────────────────────

export interface InvoiceTemplateRow {
  id: string; name: string; description: string | null; theme: string
  primaryColor: string; secondaryColor: string; logoUrl: string | null
  brandName: string | null; brandAddress: string | null; phone: string | null
  website: string | null; taxId: string | null; defaultNotes: string | null
  defaultPaymentTerms: string | null; defaultTaxRate: number
  paymentInstructions: string | null
  isDefault: boolean; createdAt: string
}

function rowToInvoiceTemplate(r: {
  id: string; name: string; description: string | null; theme: string
  primary_color: string; secondary_color: string; logo_url: string | null
  brand_name: string | null; brand_address: string | null; phone: string | null
  website: string | null; tax_id: string | null; default_notes: string | null
  default_payment_terms: string | null; default_tax_rate: number
  payment_instructions: string | null
  is_default: boolean; created_at: string
}): InvoiceTemplateRow {
  return {
    id: r.id, name: r.name, description: r.description, theme: r.theme,
    primaryColor: r.primary_color, secondaryColor: r.secondary_color,
    logoUrl: r.logo_url, brandName: r.brand_name, brandAddress: r.brand_address,
    phone: r.phone, website: r.website, taxId: r.tax_id,
    defaultNotes: r.default_notes, defaultPaymentTerms: r.default_payment_terms,
    defaultTaxRate: r.default_tax_rate,
    paymentInstructions: r.payment_instructions ?? null,
    isDefault: Boolean(r.is_default),
    createdAt: r.created_at,
  }
}

export async function getInvoiceTemplates(userId: string): Promise<InvoiceTemplateRow[]> {
  const { data } = await adminClient
    .from('invoice_templates')
    .select('*')
    .eq('user_id', userId)
    .order('is_default', { ascending: false })
    .order('name')
  return (data ?? []).map(rowToInvoiceTemplate)
}

export async function getInvoiceTemplate(id: string): Promise<InvoiceTemplateRow | null> {
  const { data } = await adminClient.from('invoice_templates').select('*').eq('id', id).single()
  return data ? rowToInvoiceTemplate(data) : null
}

export async function createInvoiceTemplate(
  userId: string,
  data: Partial<Omit<InvoiceTemplateRow, 'id' | 'createdAt'>> & { name: string }
): Promise<string> {
  const { data: row, error } = await adminClient
    .from('invoice_templates')
    .insert({
      user_id: userId, name: data.name, description: data.description ?? null,
      theme: data.theme ?? 'summit', primary_color: data.primaryColor ?? '#635BFF',
      secondary_color: data.secondaryColor ?? '#111827', brand_name: data.brandName ?? null,
      brand_address: data.brandAddress ?? null, phone: data.phone ?? null,
      website: data.website ?? null, tax_id: data.taxId ?? null,
      default_notes: data.defaultNotes ?? null,
      default_payment_terms: data.defaultPaymentTerms ?? null,
      default_tax_rate: data.defaultTaxRate ?? 0,
      payment_instructions: data.paymentInstructions ?? null,
      is_default: data.isDefault ?? false,
    })
    .select('id')
    .single()
  if (error) throw new Error(error.message)
  return row.id
}

export async function updateInvoiceTemplate(
  id: string,
  userId: string,
  data: Partial<Omit<InvoiceTemplateRow, 'id' | 'createdAt'>> & { name: string }
): Promise<void> {
  const { error } = await adminClient
    .from('invoice_templates')
    .update({
      name: data.name, description: data.description ?? null,
      theme: data.theme ?? 'summit', primary_color: data.primaryColor ?? '#635BFF',
      secondary_color: data.secondaryColor ?? '#111827', brand_name: data.brandName ?? null,
      brand_address: data.brandAddress ?? null, phone: data.phone ?? null,
      website: data.website ?? null, tax_id: data.taxId ?? null,
      default_notes: data.defaultNotes ?? null,
      default_payment_terms: data.defaultPaymentTerms ?? null,
      default_tax_rate: data.defaultTaxRate ?? 0,
      payment_instructions: data.paymentInstructions ?? null,
      is_default: data.isDefault ?? false,
      updated_at: new Date().toISOString(),
    })
    .eq('id', id)
    .eq('user_id', userId)
  if (error) throw new Error(error.message)
}

export async function deleteInvoiceTemplate(id: string, userId: string): Promise<void> {
  const { error } = await adminClient
    .from('invoice_templates')
    .delete()
    .eq('id', id)
    .eq('user_id', userId)
  if (error) throw new Error(error.message)
}

// ── Line item presets ──────────────────────────────────────

export interface LineItemPreset {
  id: string; label: string; description: string | null; defaultRate: number | null
}

export async function getLineItemPresets(profession: Profession | null): Promise<LineItemPreset[]> {
  const { data } = await adminClient
    .from('line_item_presets')
    .select('id, label, description, default_rate')
    .eq('profession', profession ?? 'other')
    .order('sort_order')
  return (data ?? []).map((r) => ({
    id: r.id, label: r.label, description: r.description, defaultRate: r.default_rate,
  }))
}

// ── Invoices ───────────────────────────────────────────────

export interface InvoiceItem {
  description: string; quantity: number; unitPrice: number; amount: number
}

export interface InvoiceListRow {
  id: string; invoiceNumber: string; clientId: string; clientName: string
  total: number; currency: string; status: string; invoiceDate: string
  dueDate: string | null; shareToken: string
  isRecurring: boolean; recurrenceInterval: string | null; recurrenceNextDate: string | null
}

export interface InvoiceDetailRow extends InvoiceListRow {
  subtotal: number; taxRate: number; taxAmount: number; discountAmount: number
  depositAmount: number; paidAmount: number; items: InvoiceItem[]; notes: string | null
  paymentTerms: string | null; paymentInstructions: string | null
  clientEmail: string | null
  clientCompany: string | null; clientAddress: string | null
  templateId: string | null; template: InvoiceTemplateRow | null; createdAt: string
  recurrenceEndDate: string | null; recurrenceParentId: string | null
  remindersPaused: boolean
}

export async function getNextInvoiceSequence(userId: string): Promise<number> {
  const year = new Date().getFullYear()
  const { data } = await adminClient
    .from('invoices')
    .select('invoice_number')
    .eq('user_id', userId)
    .like('invoice_number', `INV-${year}-%`)
    .order('invoice_number', { ascending: false })
    .limit(1)

  const latest = data?.[0]?.invoice_number
  if (!latest) return 1
  const parts = latest.split('-')
  const parsed = parseInt(parts[2] ?? '0', 10)
  return isNaN(parsed) ? 1 : parsed + 1
}

export async function deleteInvoice(id: string, userId: string): Promise<void> {
  const { error } = await adminClient
    .from('invoices')
    .delete()
    .eq('id', id)
    .eq('user_id', userId)
  if (error) throw new Error(error.message)
}

export async function getInvoices(userId: string): Promise<InvoiceListRow[]> {
  const { data, error } = await adminClient
    .from('invoices')
    .select('id, invoice_number, client_id, total, currency, status, invoice_date, due_date, share_token, is_recurring, recurrence_interval, recurrence_next_date, clients!inner(name)')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
  if (error) throw new Error(error.message)
  return (data ?? []).map((r) => ({
    id: r.id, invoiceNumber: r.invoice_number, clientId: r.client_id,
    clientName: (r.clients as unknown as { name: string })?.name ?? '',
    total: r.total, currency: r.currency, status: r.status,
    invoiceDate: r.invoice_date, dueDate: r.due_date, shareToken: r.share_token,
    isRecurring: r.is_recurring ?? false,
    recurrenceInterval: r.recurrence_interval ?? null,
    recurrenceNextDate: r.recurrence_next_date ?? null,
  }))
}

export async function getInvoice(id: string, userId: string): Promise<InvoiceDetailRow | null> {
  const { data } = await adminClient
    .from('invoices')
    .select(`
      *, clients!inner(name, email, company, address)
    `)
    .eq('id', id)
    .eq('user_id', userId)
    .single()
  if (!data) return null

  const client = data.clients as { name: string; email: string | null; company: string | null; address: string | null }
  const template = data.invoice_template_id ? await getInvoiceTemplate(data.invoice_template_id) : null

  return {
    id: data.id, invoiceNumber: data.invoice_number, clientId: data.client_id,
    clientName: client.name, total: data.total, currency: data.currency,
    status: data.status, invoiceDate: data.invoice_date, dueDate: data.due_date,
    shareToken: data.share_token, subtotal: data.subtotal, taxRate: data.tax_rate,
    taxAmount: data.tax_amount, discountAmount: data.discount_amount,
    depositAmount: data.deposit_amount ?? 0,
    paidAmount: data.paid_amount,
    items: (typeof data.items === 'string' ? JSON.parse(data.items) : data.items) as InvoiceItem[],
    notes: data.notes, paymentTerms: data.payment_terms,
    paymentInstructions: data.payment_instructions ?? null,
    clientEmail: client.email, clientCompany: client.company,
    clientAddress: client.address, templateId: data.invoice_template_id,
    template, createdAt: data.created_at,
    isRecurring: data.is_recurring ?? false,
    recurrenceInterval: data.recurrence_interval ?? null,
    recurrenceNextDate: data.recurrence_next_date ?? null,
    recurrenceEndDate: data.recurrence_end_date ?? null,
    recurrenceParentId: data.recurrence_parent_id ?? null,
    remindersPaused: data.reminders_paused ?? false,
  }
}

export async function createInvoice(
  userId: string,
  data: {
    clientId: string; templateId: string | null; invoiceNumber: string
    invoiceDate: string; dueDate?: string; currency: string
    items: InvoiceItem[]; subtotal: number; taxRate: number; taxAmount: number
    discountAmount: number; depositAmount: number; total: number
    notes?: string; paymentTerms?: string; paymentInstructions?: string
  }
): Promise<string> {
  const profile = await adminClient
    .from('profiles')
    .select('plan')
    .eq('id', userId)
    .single()
  const isPro = profile.data?.plan === 'pro' || profile.data?.plan === 'pro_monthly' || profile.data?.plan === 'pro_annual' || profile.data?.plan === 'lifetime'

  const shareToken = crypto.randomUUID()

  const { data: row, error } = await adminClient
    .from('invoices')
    .insert({
      user_id: userId, client_id: data.clientId,
      invoice_template_id: data.templateId ?? null,
      invoice_number: data.invoiceNumber, invoice_date: data.invoiceDate,
      due_date: data.dueDate ?? null, currency: data.currency,
      items: JSON.stringify(data.items), subtotal: data.subtotal,
      tax_rate: data.taxRate, tax_amount: data.taxAmount,
      discount_amount: data.discountAmount,
      deposit_amount: data.depositAmount, total: data.total,
      notes: data.notes ?? null, payment_terms: data.paymentTerms ?? null,
      payment_instructions: data.paymentInstructions ?? null,
      status: 'draft', has_branding_footer: !isPro,
      share_token: shareToken,
    })
    .select('id')
    .single()
  if (error) throw new Error(error.message)
  return row.id
}

export async function markOverdueInvoices(userId: string): Promise<void> {
  const today = new Date().toISOString().split('T')[0]
  const { error } = await adminClient
    .from('invoices')
    .update({ status: 'overdue', updated_at: new Date().toISOString() })
    .eq('user_id', userId)
    .in('status', ['sent', 'partial'])
    .lt('due_date', today)
    .not('due_date', 'is', null)
  if (error) console.error('[markOverdueInvoices] failed:', error)
}

export async function setInvoiceRecurring(
  id: string,
  userId: string,
  settings: {
    isRecurring: boolean
    interval: 'weekly' | 'biweekly' | 'monthly' | 'quarterly' | null
    nextDate: string | null
    endDate: string | null
  }
): Promise<void> {
  const { error } = await adminClient
    .from('invoices')
    .update({
      is_recurring: settings.isRecurring,
      recurrence_interval: settings.isRecurring ? settings.interval : null,
      recurrence_next_date: settings.isRecurring ? settings.nextDate : null,
      recurrence_end_date: settings.isRecurring ? settings.endDate : null,
      updated_at: new Date().toISOString(),
    })
    .eq('id', id)
    .eq('user_id', userId)
  if (error) throw new Error(error.message)
}

export async function generateRecurringInvoices(userId: string): Promise<void> {
  const today = new Date().toISOString().split('T')[0]

  const { data: due, error } = await adminClient
    .from('invoices')
    .select('id, client_id, invoice_template_id, currency, items, subtotal, tax_rate, tax_amount, discount_amount, deposit_amount, total, notes, payment_terms, payment_instructions, recurrence_interval, recurrence_next_date, recurrence_end_date')
    .eq('user_id', userId)
    .eq('is_recurring', true)
    .lte('recurrence_next_date', today)
    .not('recurrence_next_date', 'is', null)

  if (error) { console.error('[generateRecurringInvoices] fetch failed:', error); return }
  if (!due || due.length === 0) return

  for (const source of due) {
    try {
      const current = new Date(source.recurrence_next_date as string)
      let next: Date
      switch (source.recurrence_interval) {
        case 'weekly':    next = new Date(current); next.setDate(current.getDate() + 7); break
        case 'biweekly':  next = new Date(current); next.setDate(current.getDate() + 14); break
        case 'quarterly': next = new Date(current); next.setMonth(current.getMonth() + 3); break
        default:          next = new Date(current); next.setMonth(current.getMonth() + 1); break
      }
      const nextDateStr = next.toISOString().split('T')[0]

      const endDate = source.recurrence_end_date as string | null
      if (endDate && nextDateStr > endDate) {
        await adminClient.from('invoices').update({ is_recurring: false, recurrence_next_date: null }).eq('id', source.id)
        continue
      }

      const year = new Date().getFullYear()
      const { data: latest } = await adminClient
        .from('invoices')
        .select('invoice_number')
        .eq('user_id', userId)
        .like('invoice_number', `INV-${year}-%`)
        .order('invoice_number', { ascending: false })
        .limit(1)
      const latestNum = latest?.[0]?.invoice_number
      const parts = latestNum ? latestNum.split('-') : []
      const nextSeq = (parseInt(parts[2] ?? '0', 10) || 0) + 1
      const invoiceNumber = `INV-${year}-${String(nextSeq).padStart(4, '0')}`

      const items = typeof source.items === 'string' ? JSON.parse(source.items) : source.items
      await adminClient.from('invoices').insert({
        user_id: userId,
        client_id: source.client_id,
        invoice_template_id: source.invoice_template_id ?? null,
        invoice_number: invoiceNumber,
        invoice_date: today,
        due_date: null,
        currency: source.currency,
        items: JSON.stringify(items),
        subtotal: source.subtotal,
        tax_rate: source.tax_rate,
        tax_amount: source.tax_amount,
        discount_amount: source.discount_amount,
        deposit_amount: source.deposit_amount ?? 0,
        total: source.total,
        notes: source.notes ?? null,
        payment_terms: source.payment_terms ?? null,
        payment_instructions: source.payment_instructions ?? null,
        status: 'draft',
        has_branding_footer: true,
        share_token: crypto.randomUUID(),
        recurrence_parent_id: source.id,
        is_recurring: false,
      })

      await adminClient
        .from('invoices')
        .update({ recurrence_next_date: nextDateStr, updated_at: new Date().toISOString() })
        .eq('id', source.id)
    } catch (err) {
      console.error(`[generateRecurringInvoices] failed for invoice ${source.id}:`, err)
    }
  }
}

export async function updateInvoiceStatus(id: string, userId: string, status: string): Promise<void> {
  const { error } = await adminClient
    .from('invoices')
    .update({ status, updated_at: new Date().toISOString() })
    .eq('id', id)
    .eq('user_id', userId)
  if (error) throw new Error(error.message)
}

export interface PaymentRow {
  id: string; amount: number; paymentDate: string; method: string
  notes: string | null; createdAt: string
}

export async function getInvoicePayments(invoiceId: string): Promise<PaymentRow[]> {
  const { data } = await adminClient
    .from('payments')
    .select('id, amount, payment_date, method, notes, created_at')
    .eq('invoice_id', invoiceId)
    .order('payment_date', { ascending: false })
  return (data ?? []).map((r) => ({
    id: r.id, amount: r.amount, paymentDate: r.payment_date,
    method: r.method, notes: r.notes, createdAt: r.created_at,
  }))
}

export async function recordPayment(
  invoiceId: string,
  data: { amount: number; paymentDate: string; method: string; notes?: string }
): Promise<string> {
  const { data: row, error } = await adminClient
    .from('payments')
    .insert({
      invoice_id: invoiceId, amount: data.amount,
      payment_date: data.paymentDate, method: data.method,
      notes: data.notes ?? null,
    })
    .select('id')
    .single()
  if (error) throw new Error(error.message)

  await recalcInvoicePaidTotal(invoiceId)

  return row.id
}

// Recomputes paid_amount + status from the sum of confirmed payments on an
// invoice. Used by recordPayment and by confirmPaymentClaim. Summing (rather
// than incrementing) keeps the invoice consistent even if a payment is removed.
async function recalcInvoicePaidTotal(invoiceId: string): Promise<void> {
  const { data: inv } = await adminClient
    .from('invoices')
    .select('total, status')
    .eq('id', invoiceId)
    .single()
  if (!inv) return

  const { data: pays } = await adminClient
    .from('payments')
    .select('amount')
    .eq('invoice_id', invoiceId)

  const newPaid = (pays ?? []).reduce((sum, p) => sum + Number(p.amount), 0)
  // Preserve a non-payment status (draft) only when nothing is paid yet.
  const newStatus = newPaid >= Number(inv.total)
    ? 'paid'
    : newPaid > 0
      ? 'partial'
      : (inv.status === 'paid' || inv.status === 'partial') ? 'sent' : inv.status

  await adminClient
    .from('invoices')
    .update({ paid_amount: newPaid, status: newStatus, updated_at: new Date().toISOString() })
    .eq('id', invoiceId)
}

// ── Payment claims (client self-reported payments) ─────────────
//
// A payment claim is the client's statement, made from the public invoice page
// or client portal, that they have paid. It is unverified until the freelancer
// confirms it — at which point a real `payments` row is created and the invoice
// totals are recomputed. This mirrors how FreshBooks / Wave handle "client says
// they paid" when there is no integrated payment processor.

export interface PaymentClaimRow {
  id: string
  invoiceId: string
  amount: number
  method: string
  paymentDate: string | null
  note: string | null
  receiptUrl: string | null
  status: 'pending' | 'confirmed' | 'rejected'
  createdAt: string
  reviewedAt: string | null
}

function mapClaim(r: Record<string, unknown>): PaymentClaimRow {
  return {
    id: r.id as string,
    invoiceId: r.invoice_id as string,
    amount: Number(r.amount),
    method: r.method as string,
    paymentDate: (r.payment_date as string) ?? null,
    note: (r.note as string) ?? null,
    receiptUrl: (r.receipt_url as string) ?? null,
    status: r.status as 'pending' | 'confirmed' | 'rejected',
    createdAt: r.created_at as string,
    reviewedAt: (r.reviewed_at as string) ?? null,
  }
}

/** Public: client submits a payment claim from the share-token invoice page. */
export async function createPaymentClaim(
  shareToken: string,
  data: { amount: number; method: string; paymentDate?: string; note?: string; receiptUrl?: string }
): Promise<{ claimId: string; userId: string; invoiceId: string; invoiceNumber: string; clientName: string; currency: string; freelancerEmail: string | null; freelancerName: string; freelancerBusiness: string | null } | null> {
  const { data: inv } = await adminClient
    .from('invoices')
    .select('id, user_id, invoice_number, currency, clients!inner(name)')
    .eq('share_token', shareToken)
    .single()
  if (!inv) return null

  const { data: row, error } = await adminClient
    .from('payment_claims')
    .insert({
      invoice_id: inv.id,
      user_id: inv.user_id,
      amount: data.amount,
      method: data.method,
      payment_date: data.paymentDate ?? new Date().toISOString().split('T')[0],
      note: data.note ?? null,
      receipt_url: data.receiptUrl ?? null,
      status: 'pending',
    })
    .select('id')
    .single()
  if (error) throw new Error(error.message)

  const { data: profile } = await adminClient
    .from('profiles')
    .select('email, full_name, business_name')
    .eq('id', inv.user_id)
    .single()

  const client = inv.clients as unknown as { name: string }

  return {
    claimId: row.id,
    userId: inv.user_id,
    invoiceId: inv.id,
    invoiceNumber: inv.invoice_number,
    clientName: client?.name ?? 'A client',
    currency: inv.currency,
    freelancerEmail: profile?.email ?? null,
    freelancerName: profile?.full_name ?? 'there',
    freelancerBusiness: profile?.business_name ?? null,
  }
}

/** Claims for one invoice (freelancer view, and public confirmed history). */
export async function getPaymentClaims(invoiceId: string): Promise<PaymentClaimRow[]> {
  const { data } = await adminClient
    .from('payment_claims')
    .select('*')
    .eq('invoice_id', invoiceId)
    .order('created_at', { ascending: false })
  return (data ?? []).map(mapClaim)
}

/** Count of pending claims across all of a freelancer's invoices (badge). */
export async function getPendingClaimCount(userId: string): Promise<number> {
  const { count } = await adminClient
    .from('payment_claims')
    .select('id', { count: 'exact', head: true })
    .eq('user_id', userId)
    .eq('status', 'pending')
  return count ?? 0
}

/**
 * Freelancer confirms a pending claim → creates a real payment row and
 * recomputes the invoice. Returns the resulting invoice totals.
 */
export async function confirmPaymentClaim(
  claimId: string,
  userId: string
): Promise<{ invoiceId: string; paymentId: string } | null> {
  const { data: claim } = await adminClient
    .from('payment_claims')
    .select('*')
    .eq('id', claimId)
    .eq('user_id', userId)
    .single()
  if (!claim || claim.status !== 'pending') return null

  const noteParts = ['Confirmed from client claim']
  if (claim.note) noteParts.push(claim.note)
  if (claim.receipt_url) noteParts.push(`Receipt: ${claim.receipt_url}`)

  const { data: pay, error: payErr } = await adminClient
    .from('payments')
    .insert({
      invoice_id: claim.invoice_id,
      amount: claim.amount,
      payment_date: claim.payment_date ?? new Date().toISOString().split('T')[0],
      method: claim.method,
      notes: noteParts.join(' · '),
    })
    .select('id')
    .single()
  if (payErr) throw new Error(payErr.message)

  await adminClient
    .from('payment_claims')
    .update({ status: 'confirmed', payment_id: pay.id, reviewed_at: new Date().toISOString() })
    .eq('id', claimId)

  await recalcInvoicePaidTotal(claim.invoice_id)

  return { invoiceId: claim.invoice_id, paymentId: pay.id }
}

/** Freelancer rejects a pending claim (e.g. payment never arrived). */
export async function rejectPaymentClaim(claimId: string, userId: string): Promise<boolean> {
  const { data, error } = await adminClient
    .from('payment_claims')
    .update({ status: 'rejected', reviewed_at: new Date().toISOString() })
    .eq('id', claimId)
    .eq('user_id', userId)
    .eq('status', 'pending')
    .select('id')
  if (error) throw new Error(error.message)
  return (data?.length ?? 0) > 0
}

export interface InvoicePublicRow {
  id: string; userId: string; invoiceNumber: string; invoiceDate: string; dueDate: string | null
  currency: string; items: InvoiceItem[]; subtotal: number; taxRate: number
  taxAmount: number; discountAmount: number; depositAmount: number; paidAmount: number; total: number
  notes: string | null; paymentTerms: string | null; paymentInstructions: string | null
  status: string
  hasBrandingFooter: boolean; clientName: string; clientEmail: string | null
  clientCompany: string | null; freelancerName: string; businessName: string | null
  template: InvoiceTemplateRow | null
}

export async function getInvoiceByShareToken(token: string): Promise<InvoicePublicRow | null> {
  if (!token) return null
  const { data } = await adminClient
    .from('invoices')
    .select(`*, clients!inner(name, email, company)`)
    .eq('share_token', token)
    .single()
  if (!data) return null

  const { data: profileData } = await adminClient
    .from('profiles')
    .select('full_name, business_name')
    .eq('id', data.user_id)
    .single()

  // Track open
  await adminClient
    .from('invoices')
    .update({ open_count: (data.open_count ?? 0) + 1, last_opened_at: new Date().toISOString() })
    .eq('share_token', token)

  const client = data.clients as unknown as { name: string; email: string | null; company: string | null }
  const profile = profileData as { full_name: string | null; business_name: string | null } | null
  const template = data.invoice_template_id ? await getInvoiceTemplate(data.invoice_template_id) : null

  return {
    id: data.id, userId: data.user_id, invoiceNumber: data.invoice_number, invoiceDate: data.invoice_date,
    dueDate: data.due_date, currency: data.currency,
    items: (typeof data.items === 'string' ? JSON.parse(data.items) : data.items) as InvoiceItem[],
    subtotal: data.subtotal, taxRate: data.tax_rate, taxAmount: data.tax_amount,
    discountAmount: data.discount_amount, depositAmount: data.deposit_amount ?? 0,
    paidAmount: data.paid_amount, total: data.total,
    notes: data.notes, paymentTerms: data.payment_terms,
    paymentInstructions: data.payment_instructions ?? null,
    status: data.status,
    hasBrandingFooter: Boolean(data.has_branding_footer),
    clientName: client.name, clientEmail: client.email,
    clientCompany: client.company,
    freelancerName: profile?.full_name || 'Service Provider',
    businessName: profile?.business_name ?? null, template,
  }
}

// ── Reminder settings ──────────────────────────────────────

export interface ReminderSettingsRow {
  enabled: boolean; daysBefore: number[]; sendOnDueDate: boolean
  daysAfterOverdue: number[]; autoStopOnPaid: boolean
  allowUnsubscribe: boolean; skipBelowBalance: number
}

export async function getReminderSettings(userId: string): Promise<ReminderSettingsRow> {
  const { data } = await adminClient
    .from('reminder_settings')
    .select('*')
    .eq('user_id', userId)
    .single()

  const defaults: ReminderSettingsRow = {
    enabled: true, daysBefore: [3, 1], sendOnDueDate: true,
    daysAfterOverdue: [3, 7, 14], autoStopOnPaid: true,
    allowUnsubscribe: true, skipBelowBalance: 10,
  }
  if (!data) return defaults

  return {
    enabled: Boolean(data.enabled),
    daysBefore: (Array.isArray(data.days_before) ? data.days_before : JSON.parse(data.days_before || '[3,1]')) as number[],
    sendOnDueDate: Boolean(data.send_on_due_date),
    daysAfterOverdue: (Array.isArray(data.days_after_overdue) ? data.days_after_overdue : JSON.parse(data.days_after_overdue || '[3,7,14]')) as number[],
    autoStopOnPaid: data.auto_stop_on_paid !== null ? Boolean(data.auto_stop_on_paid) : true,
    allowUnsubscribe: data.allow_unsubscribe !== null ? Boolean(data.allow_unsubscribe) : true,
    skipBelowBalance: data.skip_below_balance ?? 10,
  }
}

export async function saveReminderSettings(userId: string, data: ReminderSettingsRow): Promise<void> {
  const { error } = await adminClient
    .from('reminder_settings')
    .upsert({
      user_id: userId,
      enabled: data.enabled,
      days_before: data.daysBefore,
      send_on_due_date: data.sendOnDueDate,
      days_after_overdue: data.daysAfterOverdue,
      auto_stop_on_paid: data.autoStopOnPaid,
      allow_unsubscribe: data.allowUnsubscribe,
      skip_below_balance: data.skipBelowBalance,
    })
  if (error) throw new Error(error.message)
}

export async function toggleInvoiceRemindersPaused(
  invoiceId: string,
  userId: string,
  paused: boolean
): Promise<void> {
  const { error } = await adminClient
    .from('invoices')
    .update({ reminders_paused: paused })
    .eq('id', invoiceId)
    .eq('user_id', userId)
  if (error) throw new Error(error.message)
}

export interface ReminderLogRow {
  id: string; invoiceId: string; invoiceNumber: string; clientName: string
  recipientEmail: string; status: string; sentAt: string; openedAt: string | null
}

export interface InvoiceReminderLogRow {
  id: string; triggerType: string; status: string; sentAt: string
}

export async function getInvoiceReminderLogs(invoiceId: string): Promise<InvoiceReminderLogRow[]> {
  const { data } = await adminClient
    .from('reminder_logs')
    .select('id, trigger_type, status, sent_at')
    .eq('invoice_id', invoiceId)
    .order('sent_at', { ascending: false })
    .limit(20)

  return (data ?? []).map((r) => ({
    id: r.id,
    triggerType: r.trigger_type,
    status: r.status,
    sentAt: r.sent_at,
  }))
}

export async function getReminderLogs(userId: string, limit = 50): Promise<ReminderLogRow[]> {
  const { data } = await adminClient
    .from('reminder_logs')
    .select('id, invoice_id, recipient_email, status, sent_at, opened_at, invoices!inner(invoice_number, clients!inner(name))')
    .eq('user_id', userId)
    .order('sent_at', { ascending: false })
    .limit(limit)

  return (data ?? []).map((r) => {
    const inv = r.invoices as unknown as { invoice_number: string; clients: { name: string } }
    return {
      id: r.id, invoiceId: r.invoice_id, invoiceNumber: inv.invoice_number,
      clientName: inv.clients.name, recipientEmail: r.recipient_email,
      status: r.status, sentAt: r.sent_at, openedAt: r.opened_at,
    }
  })
}

// ── Dashboard stats ────────────────────────────────────────

export interface DashboardStats {
  totalInvoiced: number; totalPaid: number; outstanding: number
  paidLast30Days: number; overdueCount: number; pendingInvoices: number
  draftInvoices: number; activeClients: number; signedContracts: number
  recentInvoices: Array<{ id: string; invoiceNumber: string; clientName: string; total: number; currency: string; status: string; invoiceDate: string }>
  recentContracts: Array<{ id: string; title: string; clientName: string; amount: number; currency: string; status: string; createdAt: string }>
  recentActivity: Array<{ id: string; type: 'audit' | 'reminder'; description: string; timestamp: string }>
}

export async function getDashboardStats(userId: string): Promise<DashboardStats> {
  const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString()

  const [invoicesRes, clientsRes, contractsRes, recentInvRes, recentConRes, auditRes, reminderRes, paidInvRes] =
    await Promise.all([
      adminClient.from('invoices').select('total, status, paid_amount').eq('user_id', userId),
      adminClient.from('clients').select('id', { count: 'exact', head: true }).eq('user_id', userId),
      adminClient.from('contracts').select('id', { count: 'exact', head: true }).eq('user_id', userId).eq('status', 'signed'),
      adminClient
        .from('invoices')
        .select('id, invoice_number, total, currency, status, invoice_date, clients!inner(name)')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .limit(5),
      adminClient
        .from('contracts')
        .select('id, title, amount, currency, status, created_at, clients!inner(name)')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .limit(5),
      adminClient
        .from('audit_events')
        .select('id, event_type, signer_name, signer_email, timestamp, contracts!inner(title)')
        .eq('contracts.user_id', userId)
        .order('timestamp', { ascending: false })
        .limit(5),
      adminClient
        .from('reminder_logs')
        .select('id, sent_at, recipient_email, status, invoices!inner(invoice_number)')
        .eq('user_id', userId)
        .order('sent_at', { ascending: false })
        .limit(5),
      adminClient
        .from('invoices')
        .select('total')
        .eq('user_id', userId)
        .eq('status', 'paid')
        .gte('updated_at', thirtyDaysAgo),
    ])

  const invoices = invoicesRes.data ?? []
  const totalInvoiced = invoices.reduce((s, i) => s + (i.total ?? 0), 0)
  const totalPaid = invoices.reduce((s, i) => i.status === 'paid' ? s + (i.total ?? 0) : s, 0)
  const outstanding = invoices.reduce((s, i) => i.status !== 'paid' ? s + (i.total ?? 0) : s, 0)
  const overdueCount = invoices.filter(i => i.status === 'overdue').length
  const pendingInvoices = invoices.filter(i => ['sent', 'partial'].includes(i.status)).length
  const draftInvoices = invoices.filter(i => i.status === 'draft').length

  const paidLast30Days = (paidInvRes.data ?? []).reduce((s, i) => s + (i.total ?? 0), 0)

  const recentInvoices = (recentInvRes.data ?? []).map((r) => ({
    id: r.id, invoiceNumber: r.invoice_number,
    clientName: (r.clients as unknown as { name: string }).name,
    total: r.total, currency: r.currency, status: r.status, invoiceDate: r.invoice_date,
  }))

  const recentContracts = (recentConRes.data ?? []).map((r) => ({
    id: r.id, title: r.title,
    clientName: (r.clients as unknown as { name: string }).name,
    amount: r.amount, currency: r.currency, status: r.status, createdAt: r.created_at,
  }))

  const auditActivity = (auditRes.data ?? []).map((e) => ({
    id: `audit-${e.id}`,
    type: 'audit' as const,
    description: formatAuditDescription(
      e.event_type,
      e.signer_name,
      e.signer_email,
      (e.contracts as unknown as { title: string })?.title ?? ''
    ),
    timestamp: e.timestamp,
  }))

  const reminderActivity = (reminderRes.data ?? []).map((r) => ({
    id: `reminder-${r.id}`,
    type: 'reminder' as const,
    description: `Reminder sent to ${r.recipient_email} for ${(r.invoices as unknown as { invoice_number: string })?.invoice_number}`,
    timestamp: r.sent_at,
  }))

  const recentActivity = [...auditActivity, ...reminderActivity]
    .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
    .slice(0, 10)

  return {
    totalInvoiced, totalPaid, outstanding, paidLast30Days,
    overdueCount, pendingInvoices, draftInvoices,
    activeClients: clientsRes.count ?? 0,
    signedContracts: contractsRes.count ?? 0,
    recentInvoices, recentContracts, recentActivity,
  }
}

// ── Client Activity Log ────────────────────────────────────

export async function logClientActivity(data: {
  userId: string
  clientId?: string | null
  clientName: string
  eventType: string
  entityType: 'invoice' | 'contract' | 'payment' | 'note'
  entityId?: string
  entityLabel?: string
  amount?: number
  metadata?: Record<string, unknown>
}): Promise<void> {
  await adminClient.from('client_activity_log').insert({
    user_id: data.userId,
    client_id: data.clientId ?? null,
    client_name: data.clientName,
    event_type: data.eventType,
    entity_type: data.entityType,
    entity_id: data.entityId ?? null,
    entity_label: data.entityLabel ?? null,
    amount: data.amount ?? null,
    metadata: data.metadata ?? {},
  })
}

export async function getClientActivityLog(
  userId: string,
  clientId: string,
  limit = 50
): Promise<import('@/types').ClientActivityLogRow[]> {
  const { data } = await adminClient
    .from('client_activity_log')
    .select('*')
    .eq('user_id', userId)
    .eq('client_id', clientId)
    .order('created_at', { ascending: false })
    .limit(limit)
  return (data ?? []) as import('@/types').ClientActivityLogRow[]
}

export async function getAllClientActivity(
  userId: string,
  limit = 100
): Promise<import('@/types').ClientActivityLogRow[]> {
  const { data } = await adminClient
    .from('client_activity_log')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
    .limit(limit)
  return (data ?? []) as import('@/types').ClientActivityLogRow[]
}

export interface ClientStatsRow {
  totalBilled: number
  totalPaid: number
  outstanding: number
  invoiceCount: number
  contractCount: number
  signedContracts: number
}

export async function getClientStats(userId: string, clientId: string): Promise<ClientStatsRow> {
  const [invoicesRes, contractsRes] = await Promise.all([
    adminClient
      .from('invoices')
      .select('total, paid_amount, status')
      .eq('user_id', userId)
      .eq('client_id', clientId),
    adminClient
      .from('contracts')
      .select('status')
      .eq('user_id', userId)
      .eq('client_id', clientId),
  ])

  const invoices = invoicesRes.data ?? []
  const contracts = contractsRes.data ?? []

  const totalBilled = invoices.reduce((s, i) => s + (i.total ?? 0), 0)
  const totalPaid = invoices.reduce((s, i) => s + (i.paid_amount ?? 0), 0)
  const outstanding = totalBilled - totalPaid
  const invoiceCount = invoices.length
  const contractCount = contracts.length
  const signedContracts = contracts.filter((c) => c.status === 'signed').length

  return { totalBilled, totalPaid, outstanding, invoiceCount, contractCount, signedContracts }
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

// ── Expenses ────────────────────────────────────────────────

export interface ExpenseRow {
  id: string
  userId: string
  date: string
  description: string
  amount: number
  category: string
  notes: string | null
  createdAt: string
  updatedAt: string
}

export async function getExpenses(userId: string): Promise<ExpenseRow[]> {
  const { data, error } = await adminClient
    .from('expenses')
    .select('*')
    .eq('user_id', userId)
    .order('date', { ascending: false })
    .order('created_at', { ascending: false })

  if (error) throw new Error(error.message)
  return (data ?? []).map((r) => ({
    id: r.id,
    userId: r.user_id,
    date: r.date,
    description: r.description,
    amount: Number(r.amount),
    category: r.category,
    notes: r.notes ?? null,
    createdAt: r.created_at,
    updatedAt: r.updated_at,
  }))
}

export async function createExpense(userId: string, data: {
  date: string
  description: string
  amount: number
  category: string
  notes?: string
}): Promise<string> {
  const { data: row, error } = await adminClient
    .from('expenses')
    .insert({
      user_id: userId,
      date: data.date,
      description: data.description,
      amount: data.amount,
      category: data.category,
      notes: data.notes ?? null,
    })
    .select('id')
    .single()

  if (error || !row) throw new Error(error?.message ?? 'Failed to create expense')
  return row.id
}

export async function updateExpense(id: string, userId: string, data: {
  date?: string
  description?: string
  amount?: number
  category?: string
  notes?: string
}): Promise<void> {
  const update: Record<string, unknown> = { updated_at: new Date().toISOString() }
  if (data.date !== undefined) update.date = data.date
  if (data.description !== undefined) update.description = data.description
  if (data.amount !== undefined) update.amount = data.amount
  if (data.category !== undefined) update.category = data.category
  if (data.notes !== undefined) update.notes = data.notes

  const { error } = await adminClient
    .from('expenses')
    .update(update)
    .eq('id', id)
    .eq('user_id', userId)

  if (error) throw new Error(error.message)
}

export async function deleteExpense(id: string, userId: string): Promise<void> {
  const { error } = await adminClient
    .from('expenses')
    .delete()
    .eq('id', id)
    .eq('user_id', userId)

  if (error) throw new Error(error.message)
}

// ── Client Portal ────────────────────────────────────────────

export async function getClientPortalData(portalToken: string): Promise<{
  clientName: string
  clientCompany: string | null
  clientId: string
  userId: string
  freelancerName: string
  freelancerBusiness: string | null
  freelancerLogo: string | null
  invoices: Array<{
    id: string
    invoiceNumber: string
    invoiceDate: string
    dueDate: string | null
    total: number
    paidAmount: number
    currency: string
    status: string
    shareToken: string | null
  }>
  contracts: Array<{
    id: string
    title: string
    amount: number
    currency: string
    status: string
    createdAt: string
    signedAt: string | null
  }>
} | null> {
  const { data: client, error: clientErr } = await adminClient
    .from('clients')
    .select('id, name, company, user_id')
    .eq('portal_token', portalToken)
    .single()

  if (clientErr || !client) return null

  const { data: profile } = await adminClient
    .from('profiles')
    .select('full_name, business_name, business_logo')
    .eq('id', client.user_id)
    .single()

  const [invoicesRes, contractsRes] = await Promise.all([
    adminClient
      .from('invoices')
      .select('id, invoice_number, invoice_date, due_date, total, paid_amount, currency, status, share_token')
      .eq('client_id', client.id)
      .eq('user_id', client.user_id)
      .order('invoice_date', { ascending: false }),
    adminClient
      .from('contracts')
      .select('id, title, amount, currency, status, created_at, signed_at')
      .eq('client_id', client.id)
      .eq('user_id', client.user_id)
      .order('created_at', { ascending: false }),
  ])

  const invoices = (invoicesRes.data ?? []).map((r) => ({
    id: r.id,
    invoiceNumber: r.invoice_number,
    invoiceDate: r.invoice_date,
    dueDate: r.due_date ?? null,
    total: Number(r.total),
    paidAmount: Number(r.paid_amount),
    currency: r.currency,
    status: r.status,
    shareToken: r.share_token ?? null,
  }))

  const contracts = (contractsRes.data ?? []).map((r) => ({
    id: r.id,
    title: r.title,
    amount: Number(r.amount),
    currency: r.currency,
    status: r.status,
    createdAt: r.created_at,
    signedAt: r.signed_at ?? null,
  }))

  return {
    clientName: client.name,
    clientCompany: client.company ?? null,
    clientId: client.id,
    userId: client.user_id,
    freelancerName: profile?.full_name ?? '',
    freelancerBusiness: profile?.business_name ?? null,
    freelancerLogo: profile?.business_logo ?? null,
    invoices,
    contracts,
  }
}

export async function getClientPortalToken(clientId: string, userId: string): Promise<string | null> {
  const { data, error } = await adminClient
    .from('clients')
    .select('portal_token')
    .eq('id', clientId)
    .eq('user_id', userId)
    .single()
  if (error || !data) return null
  return data.portal_token ?? null
}

export async function regeneratePortalToken(clientId: string, userId: string): Promise<string> {
  const newToken = crypto.randomUUID()
  const { error } = await adminClient
    .from('clients')
    .update({ portal_token: newToken })
    .eq('id', clientId)
    .eq('user_id', userId)
  if (error) throw new Error(error.message)
  return newToken
}

export async function getExpenseSummary(userId: string, year?: number): Promise<{
  totalExpenses: number
  byCategory: { category: string; total: number }[]
  byMonth: { month: string; total: number }[]
}> {
  const currentYear = year ?? new Date().getFullYear()
  const from = `${currentYear}-01-01`
  const to = `${currentYear}-12-31`

  const { data, error } = await adminClient
    .from('expenses')
    .select('amount, category, date')
    .eq('user_id', userId)
    .gte('date', from)
    .lte('date', to)

  if (error) throw new Error(error.message)
  const rows = data ?? []

  const totalExpenses = rows.reduce((sum, r) => sum + Number(r.amount), 0)

  const catMap: Record<string, number> = {}
  const monthMap: Record<string, number> = {}

  for (const r of rows) {
    catMap[r.category] = (catMap[r.category] ?? 0) + Number(r.amount)
    const month = r.date.slice(0, 7)
    monthMap[month] = (monthMap[month] ?? 0) + Number(r.amount)
  }

  const byCategory = Object.entries(catMap)
    .map(([category, total]) => ({ category, total }))
    .sort((a, b) => b.total - a.total)

  const byMonth = Object.entries(monthMap)
    .map(([month, total]) => ({ month, total }))
    .sort((a, b) => a.month.localeCompare(b.month))

  return { totalExpenses, byCategory, byMonth }
}

// ── Proposals ────────────────────────────────────────────────

export interface ProposalListRow {
  id: string
  clientId: string
  clientName: string
  title: string
  total: number
  currency: string
  status: string
  createdAt: string
  validUntil: string | null
  shareToken: string | null
  contractId: string | null
}

export interface ProposalDetailRow {
  id: string
  clientId: string
  clientName: string
  clientEmail: string | null
  clientCompany: string | null
  title: string
  summary: string | null
  lineItems: Array<{ id: string; description: string; quantity: number; unitPrice: number; amount: number }>
  subtotal: number
  taxRate: number
  taxAmount: number
  discountAmount: number
  total: number
  currency: string
  validUntil: string | null
  notes: string | null
  status: string
  shareToken: string | null
  acceptedAt: string | null
  declinedAt: string | null
  viewedAt: string | null
  contractId: string | null
  createdAt: string
}

export async function getProposals(userId: string): Promise<ProposalListRow[]> {
  const { data, error } = await adminClient
    .from('proposals')
    .select('id, client_id, title, total, currency, status, created_at, valid_until, share_token, contract_id, clients!inner(name)')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
  if (error) throw new Error(error.message)
  return (data ?? []).map((r) => ({
    id: r.id,
    clientId: r.client_id,
    clientName: (r.clients as unknown as { name: string })?.name ?? '',
    title: r.title,
    total: Number(r.total),
    currency: r.currency,
    status: r.status,
    createdAt: r.created_at,
    validUntil: r.valid_until ?? null,
    shareToken: r.share_token ?? null,
    contractId: r.contract_id ?? null,
  }))
}

export async function getProposal(id: string, userId: string): Promise<ProposalDetailRow | null> {
  const { data } = await adminClient
    .from('proposals')
    .select('*, clients!inner(name, email, company)')
    .eq('id', id)
    .eq('user_id', userId)
    .single()
  if (!data) return null
  const client = data.clients as unknown as { name: string; email: string | null; company: string | null }
  return {
    id: data.id, clientId: data.client_id,
    clientName: client.name, clientEmail: client.email ?? null,
    clientCompany: client.company ?? null, title: data.title,
    summary: data.summary ?? null,
    lineItems: (typeof data.line_items === 'string' ? JSON.parse(data.line_items) : data.line_items) ?? [],
    subtotal: Number(data.subtotal), taxRate: Number(data.tax_rate),
    taxAmount: Number(data.tax_amount), discountAmount: Number(data.discount_amount),
    total: Number(data.total), currency: data.currency,
    validUntil: data.valid_until ?? null, notes: data.notes ?? null,
    status: data.status, shareToken: data.share_token ?? null,
    acceptedAt: data.accepted_at ?? null, declinedAt: data.declined_at ?? null,
    viewedAt: data.viewed_at ?? null, contractId: data.contract_id ?? null,
    createdAt: data.created_at,
  }
}

export async function getProposalByShareToken(token: string): Promise<(ProposalDetailRow & {
  freelancerName: string
  freelancerBusiness: string | null
  freelancerLogo: string | null
  userId: string
}) | null> {
  const { data } = await adminClient
    .from('proposals')
    .select('*, clients!inner(name, email, company), profiles!inner(full_name, business_name, business_logo)')
    .eq('share_token', token)
    .single()
  if (!data) return null
  const client = data.clients as unknown as { name: string; email: string | null; company: string | null }
  const profile = data.profiles as unknown as { full_name: string; business_name: string | null; business_logo: string | null }
  return {
    id: data.id, clientId: data.client_id,
    clientName: client.name, clientEmail: client.email ?? null,
    clientCompany: client.company ?? null, title: data.title,
    summary: data.summary ?? null,
    lineItems: (typeof data.line_items === 'string' ? JSON.parse(data.line_items) : data.line_items) ?? [],
    subtotal: Number(data.subtotal), taxRate: Number(data.tax_rate),
    taxAmount: Number(data.tax_amount), discountAmount: Number(data.discount_amount),
    total: Number(data.total), currency: data.currency,
    validUntil: data.valid_until ?? null, notes: data.notes ?? null,
    status: data.status, shareToken: data.share_token ?? null,
    acceptedAt: data.accepted_at ?? null, declinedAt: data.declined_at ?? null,
    viewedAt: data.viewed_at ?? null, contractId: data.contract_id ?? null,
    createdAt: data.created_at,
    freelancerName: profile.full_name, freelancerBusiness: profile.business_name ?? null,
    freelancerLogo: profile.business_logo ?? null,
    userId: data.user_id,
  }
}

export async function createProposal(userId: string, data: {
  clientId: string; title: string; summary?: string
  lineItems: Array<{ description: string; quantity: number; unitPrice: number; amount: number }>
  subtotal: number; taxRate: number; taxAmount: number; discountAmount: number; total: number
  currency: string; validUntil?: string; notes?: string
}): Promise<string> {
  const { data: row, error } = await adminClient
    .from('proposals')
    .insert({
      user_id: userId, client_id: data.clientId, title: data.title,
      summary: data.summary ?? null,
      line_items: data.lineItems, subtotal: data.subtotal,
      tax_rate: data.taxRate, tax_amount: data.taxAmount,
      discount_amount: data.discountAmount, total: data.total,
      currency: data.currency, valid_until: data.validUntil ?? null,
      notes: data.notes ?? null, status: 'draft',
    })
    .select('id').single()
  if (error || !row) throw new Error(error?.message ?? 'Failed to create proposal')
  return row.id
}

export async function updateProposalStatus(
  id: string,
  userId: string,
  status: string,
  extra?: { contractId?: string; acceptedAt?: string; declinedAt?: string }
): Promise<void> {
  const update: Record<string, unknown> = { status, updated_at: new Date().toISOString() }
  if (extra?.contractId) update.contract_id = extra.contractId
  if (extra?.acceptedAt) update.accepted_at = extra.acceptedAt
  if (extra?.declinedAt) update.declined_at = extra.declinedAt
  const { error } = await adminClient.from('proposals').update(update).eq('id', id).eq('user_id', userId)
  if (error) throw new Error(error.message)
}

export async function deleteProposal(id: string, userId: string): Promise<void> {
  const { error } = await adminClient.from('proposals').delete().eq('id', id).eq('user_id', userId)
  if (error) throw new Error(error.message)
}

export async function markProposalViewed(id: string): Promise<void> {
  await adminClient
    .from('proposals')
    .update({ viewed_at: new Date().toISOString(), updated_at: new Date().toISOString() })
    .eq('id', id)
    .is('viewed_at', null)
}

export async function acceptProposal(shareToken: string): Promise<{ proposalId: string; userId: string; clientId: string } | null> {
  const { data } = await adminClient
    .from('proposals')
    .update({ status: 'accepted', accepted_at: new Date().toISOString(), updated_at: new Date().toISOString() })
    .eq('share_token', shareToken)
    .in('status', ['sent', 'draft'])
    .select('id, user_id, client_id')
    .single()
  if (!data) return null
  return { proposalId: data.id, userId: data.user_id, clientId: data.client_id }
}

export async function declineProposal(shareToken: string): Promise<boolean> {
  const { error } = await adminClient
    .from('proposals')
    .update({ status: 'declined', declined_at: new Date().toISOString(), updated_at: new Date().toISOString() })
    .eq('share_token', shareToken)
    .in('status', ['sent', 'draft'])
  return !error
}

// ── Time Tracking ────────────────────────────────────────────

export interface TimeEntryRow {
  id: string
  clientId: string | null
  clientName: string | null
  description: string
  date: string
  durationMinutes: number
  hourlyRate: number
  amount: number
  isBillable: boolean
  isInvoiced: boolean
  invoiceId: string | null
  notes: string | null
  createdAt: string
}

export async function getTimeEntries(userId: string): Promise<TimeEntryRow[]> {
  const { data, error } = await adminClient
    .from('time_entries')
    .select('*, clients(name)')
    .eq('user_id', userId)
    .order('date', { ascending: false })
    .order('created_at', { ascending: false })
  if (error) throw new Error(error.message)
  return (data ?? []).map((r) => ({
    id: r.id,
    clientId: r.client_id ?? null,
    clientName: (r.clients as unknown as { name: string } | null)?.name ?? null,
    description: r.description,
    date: r.date,
    durationMinutes: r.duration_minutes,
    hourlyRate: Number(r.hourly_rate),
    amount: Number(r.amount),
    isBillable: r.is_billable,
    isInvoiced: r.is_invoiced,
    invoiceId: r.invoice_id ?? null,
    notes: r.notes ?? null,
    createdAt: r.created_at,
  }))
}

export async function getUnbilledTimeEntries(userId: string, clientId?: string): Promise<TimeEntryRow[]> {
  let query = adminClient
    .from('time_entries')
    .select('*, clients(name)')
    .eq('user_id', userId)
    .eq('is_billable', true)
    .eq('is_invoiced', false)
    .order('date', { ascending: false })
  if (clientId) query = query.eq('client_id', clientId)
  const { data, error } = await query
  if (error) throw new Error(error.message)
  return (data ?? []).map((r) => ({
    id: r.id,
    clientId: r.client_id ?? null,
    clientName: (r.clients as unknown as { name: string } | null)?.name ?? null,
    description: r.description,
    date: r.date,
    durationMinutes: r.duration_minutes,
    hourlyRate: Number(r.hourly_rate),
    amount: Number(r.amount),
    isBillable: r.is_billable,
    isInvoiced: r.is_invoiced,
    invoiceId: r.invoice_id ?? null,
    notes: r.notes ?? null,
    createdAt: r.created_at,
  }))
}

export async function createTimeEntry(userId: string, data: {
  clientId?: string; description: string; date: string
  durationMinutes: number; hourlyRate: number; isBillable: boolean; notes?: string
}): Promise<string> {
  const { data: row, error } = await adminClient
    .from('time_entries')
    .insert({
      user_id: userId,
      client_id: data.clientId ?? null,
      description: data.description,
      date: data.date,
      duration_minutes: data.durationMinutes,
      hourly_rate: data.hourlyRate,
      is_billable: data.isBillable,
      notes: data.notes ?? null,
    })
    .select('id').single()
  if (error || !row) throw new Error(error?.message ?? 'Failed to create')
  return row.id
}

export async function updateTimeEntry(id: string, userId: string, data: {
  clientId?: string | null; description?: string; date?: string
  durationMinutes?: number; hourlyRate?: number; isBillable?: boolean
  isInvoiced?: boolean; notes?: string
}): Promise<void> {
  const update: Record<string, unknown> = { updated_at: new Date().toISOString() }
  if (data.clientId !== undefined) update.client_id = data.clientId
  if (data.description !== undefined) update.description = data.description
  if (data.date !== undefined) update.date = data.date
  if (data.durationMinutes !== undefined) update.duration_minutes = data.durationMinutes
  if (data.hourlyRate !== undefined) update.hourly_rate = data.hourlyRate
  if (data.isBillable !== undefined) update.is_billable = data.isBillable
  if (data.isInvoiced !== undefined) update.is_invoiced = data.isInvoiced
  if (data.notes !== undefined) update.notes = data.notes
  const { error } = await adminClient.from('time_entries').update(update).eq('id', id).eq('user_id', userId)
  if (error) throw new Error(error.message)
}

export async function deleteTimeEntry(id: string, userId: string): Promise<void> {
  const { error } = await adminClient.from('time_entries').delete().eq('id', id).eq('user_id', userId)
  if (error) throw new Error(error.message)
}

export async function markTimeEntriesInvoiced(ids: string[], userId: string, invoiceId: string): Promise<void> {
  const { error } = await adminClient
    .from('time_entries')
    .update({ is_invoiced: true, invoice_id: invoiceId, updated_at: new Date().toISOString() })
    .in('id', ids)
    .eq('user_id', userId)
  if (error) throw new Error(error.message)
}

export async function getTimeTrackingSummary(userId: string): Promise<{
  totalHours: number
  billableHours: number
  unbilledAmount: number
  thisWeekHours: number
}> {
  const { data } = await adminClient
    .from('time_entries')
    .select('duration_minutes, hourly_rate, is_billable, is_invoiced, amount, date')
    .eq('user_id', userId)

  const rows = data ?? []
  const totalHours = rows.reduce((s, r) => s + r.duration_minutes, 0) / 60
  const billableHours = rows.filter((r) => r.is_billable).reduce((s, r) => s + r.duration_minutes, 0) / 60
  const unbilledAmount = rows
    .filter((r) => r.is_billable && !r.is_invoiced)
    .reduce((s, r) => s + Number(r.amount), 0)

  const weekStart = new Date()
  weekStart.setDate(weekStart.getDate() - weekStart.getDay())
  const weekStartStr = weekStart.toISOString().slice(0, 10)
  const thisWeekHours = rows
    .filter((r) => r.date >= weekStartStr)
    .reduce((s, r) => s + r.duration_minutes, 0) / 60

  return { totalHours, billableHours, unbilledAmount, thisWeekHours }
}

// ── Intake Forms ─────────────────────────────────────────────

export async function getIntakeForms(userId: string): Promise<IntakeForm[]> {
  const { data, error } = await adminClient
    .from('intake_forms')
    .select('*, intake_responses(count)')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
  if (error) throw new Error(error.message)
  return (data ?? []).map((r) => ({
    id: r.id,
    userId: r.user_id,
    title: r.title,
    description: r.description ?? null,
    fields: r.fields as IntakeField[],
    shareToken: r.share_token,
    isActive: r.is_active,
    createdAt: r.created_at,
    responseCount: (r.intake_responses as unknown as { count: number }[])?.[0]?.count ?? 0,
  }))
}

export async function getIntakeFormById(id: string, userId: string): Promise<IntakeForm | null> {
  const { data, error } = await adminClient
    .from('intake_forms')
    .select('*')
    .eq('id', id)
    .eq('user_id', userId)
    .single()
  if (error || !data) return null
  return {
    id: data.id,
    userId: data.user_id,
    title: data.title,
    description: data.description ?? null,
    fields: data.fields as IntakeField[],
    shareToken: data.share_token,
    isActive: data.is_active,
    createdAt: data.created_at,
  }
}

export async function getIntakeFormByToken(token: string): Promise<IntakeForm | null> {
  const { data, error } = await adminClient
    .from('intake_forms')
    .select('*')
    .eq('share_token', token)
    .eq('is_active', true)
    .single()
  if (error || !data) return null
  return {
    id: data.id,
    userId: data.user_id,
    title: data.title,
    description: data.description ?? null,
    fields: data.fields as IntakeField[],
    shareToken: data.share_token,
    isActive: data.is_active,
    createdAt: data.created_at,
  }
}

export async function createIntakeForm(userId: string, data: {
  title: string
  description?: string
  fields: IntakeField[]
}): Promise<string> {
  const { data: row, error } = await adminClient
    .from('intake_forms')
    .insert({
      user_id: userId,
      title: data.title,
      description: data.description ?? null,
      fields: data.fields,
    })
    .select('id').single()
  if (error || !row) throw new Error(error?.message ?? 'Failed to create form')
  return row.id
}

export async function updateIntakeForm(id: string, userId: string, data: {
  title?: string
  description?: string | null
  fields?: IntakeField[]
  isActive?: boolean
}): Promise<void> {
  const update: Record<string, unknown> = { updated_at: new Date().toISOString() }
  if (data.title !== undefined) update.title = data.title
  if (data.description !== undefined) update.description = data.description
  if (data.fields !== undefined) update.fields = data.fields
  if (data.isActive !== undefined) update.is_active = data.isActive
  const { error } = await adminClient
    .from('intake_forms').update(update).eq('id', id).eq('user_id', userId)
  if (error) throw new Error(error.message)
}

export async function deleteIntakeForm(id: string, userId: string): Promise<void> {
  const { error } = await adminClient
    .from('intake_forms').delete().eq('id', id).eq('user_id', userId)
  if (error) throw new Error(error.message)
}

export async function getIntakeResponses(formId: string, userId: string): Promise<IntakeResponse[]> {
  const { data, error } = await adminClient
    .from('intake_responses')
    .select('*, intake_forms(title), clients(name)')
    .eq('form_id', formId)
    .eq('user_id', userId)
    .order('submitted_at', { ascending: false })
  if (error) throw new Error(error.message)
  return (data ?? []).map((r) => ({
    id: r.id,
    formId: r.form_id,
    formTitle: (r.intake_forms as unknown as { title: string } | null)?.title ?? '',
    clientId: r.client_id ?? null,
    clientName: (r.clients as unknown as { name: string } | null)?.name ?? null,
    respondentName: r.respondent_name ?? null,
    respondentEmail: r.respondent_email ?? null,
    answers: r.answers as Record<string, string | boolean | string[]>,
    submittedAt: r.submitted_at,
  }))
}

/** Intake responses submitted by a specific client (for the client detail page). */
export async function getClientIntakeResponses(clientId: string, userId: string): Promise<IntakeResponse[]> {
  const { data, error } = await adminClient
    .from('intake_responses')
    .select('*, intake_forms(title)')
    .eq('client_id', clientId)
    .eq('user_id', userId)
    .order('submitted_at', { ascending: false })
  if (error) throw new Error(error.message)
  return (data ?? []).map((r) => ({
    id: r.id,
    formId: r.form_id,
    formTitle: (r.intake_forms as unknown as { title: string } | null)?.title ?? '',
    clientId: r.client_id ?? null,
    clientName: null,
    respondentName: r.respondent_name ?? null,
    respondentEmail: r.respondent_email ?? null,
    answers: r.answers as Record<string, string | boolean | string[]>,
    submittedAt: r.submitted_at,
  }))
}

export async function submitIntakeResponse(data: {
  formId: string
  userId: string
  respondentName: string
  respondentEmail: string
  answers: Record<string, string | boolean | string[]>
  createClient: boolean
}): Promise<{ responseId: string; clientId: string | null }> {
  let clientId: string | null = null

  if (data.createClient && data.respondentName) {
    const existing = data.respondentEmail
      ? await adminClient
          .from('clients')
          .select('id')
          .eq('user_id', data.userId)
          .eq('email', data.respondentEmail)
          .maybeSingle()
      : { data: null }
    if (existing.data) {
      clientId = existing.data.id
    } else {
      const { data: newClient } = await adminClient
        .from('clients')
        .insert({
          user_id: data.userId,
          name: data.respondentName,
          email: data.respondentEmail || null,
        })
        .select('id').single()
      if (newClient) clientId = newClient.id
    }
  }

  const { data: row, error } = await adminClient
    .from('intake_responses')
    .insert({
      form_id: data.formId,
      user_id: data.userId,
      client_id: clientId,
      respondent_name: data.respondentName,
      respondent_email: data.respondentEmail,
      answers: data.answers,
    })
    .select('id').single()
  if (error || !row) throw new Error(error?.message ?? 'Failed to submit')

  // Surface the submission in the freelancer's activity feed + the client's
  // activity tab. Without this the response was stored but invisible in-app.
  const { data: formRow } = await adminClient
    .from('intake_forms')
    .select('title')
    .eq('id', data.formId)
    .single()

  void logClientActivity({
    userId: data.userId,
    clientId,
    clientName: data.respondentName,
    eventType: 'intake_submitted',
    entityType: 'note',
    entityId: row.id,
    entityLabel: formRow?.title ?? 'Intake form',
  })

  return { responseId: row.id, clientId }
}
