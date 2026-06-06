import 'server-only'

import { adminClient } from '@/lib/supabase/admin'
import type { Plan, Profession } from '@/types'

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
}

export interface ClientDetailRow extends ClientRow {
  address: string | null
  notes: string | null
  createdAt: string
  contractCount: number
  invoiceCount: number
}

export async function getClients(userId: string): Promise<ClientRow[]> {
  const { data, error } = await adminClient
    .from('clients')
    .select('id, name, email, company')
    .eq('user_id', userId)
    .order('name')
  if (error) throw new Error(error.message)
  return (data ?? []).map((r) => ({ id: r.id, name: r.name, email: r.email, company: r.company }))
}

export async function getClientById(id: string, userId: string): Promise<ClientDetailRow | null> {
  const { data, error } = await adminClient
    .from('clients')
    .select('id, name, email, company, address, notes, created_at')
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
  }
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
}

export interface InvoiceDetailRow extends InvoiceListRow {
  subtotal: number; taxRate: number; taxAmount: number; discountAmount: number
  paidAmount: number; items: InvoiceItem[]; notes: string | null
  paymentTerms: string | null; paymentInstructions: string | null
  clientEmail: string | null
  clientCompany: string | null; clientAddress: string | null
  templateId: string | null; template: InvoiceTemplateRow | null; createdAt: string
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
    .select('id, invoice_number, client_id, total, currency, status, invoice_date, due_date, share_token, clients!inner(name)')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
  if (error) throw new Error(error.message)
  return (data ?? []).map((r) => ({
    id: r.id, invoiceNumber: r.invoice_number, clientId: r.client_id,
    clientName: (r.clients as unknown as { name: string })?.name ?? '',
    total: r.total, currency: r.currency, status: r.status,
    invoiceDate: r.invoice_date, dueDate: r.due_date, shareToken: r.share_token,
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
    paidAmount: data.paid_amount,
    items: (typeof data.items === 'string' ? JSON.parse(data.items) : data.items) as InvoiceItem[],
    notes: data.notes, paymentTerms: data.payment_terms,
    paymentInstructions: data.payment_instructions ?? null,
    clientEmail: client.email, clientCompany: client.company,
    clientAddress: client.address, templateId: data.invoice_template_id,
    template, createdAt: data.created_at,
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
  const isPro = profile.data?.plan === 'pro_monthly' || profile.data?.plan === 'pro_annual' || profile.data?.plan === 'lifetime'

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

  const { data: inv } = await adminClient
    .from('invoices')
    .select('total, paid_amount')
    .eq('id', invoiceId)
    .single()

  if (inv) {
    const newPaid = (inv.paid_amount ?? 0) + data.amount
    const newStatus = newPaid >= inv.total ? 'paid' : 'partial'
    await adminClient
      .from('invoices')
      .update({ paid_amount: newPaid, status: newStatus, updated_at: new Date().toISOString() })
      .eq('id', invoiceId)
  }

  return row.id
}

export interface InvoicePublicRow {
  id: string; invoiceNumber: string; invoiceDate: string; dueDate: string | null
  currency: string; items: InvoiceItem[]; subtotal: number; taxRate: number
  taxAmount: number; discountAmount: number; paidAmount: number; total: number
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
    id: data.id, invoiceNumber: data.invoice_number, invoiceDate: data.invoice_date,
    dueDate: data.due_date, currency: data.currency,
    items: (typeof data.items === 'string' ? JSON.parse(data.items) : data.items) as InvoiceItem[],
    subtotal: data.subtotal, taxRate: data.tax_rate, taxAmount: data.tax_amount,
    discountAmount: data.discount_amount, paidAmount: data.paid_amount, total: data.total,
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

export interface ReminderLogRow {
  id: string; invoiceNumber: string; clientName: string
  recipientEmail: string; status: string; sentAt: string; openedAt: string | null
}

export async function getReminderLogs(userId: string, limit = 50): Promise<ReminderLogRow[]> {
  const { data } = await adminClient
    .from('reminder_logs')
    .select('id, recipient_email, status, sent_at, opened_at, invoices!inner(invoice_number, clients!inner(name))')
    .eq('user_id', userId)
    .order('sent_at', { ascending: false })
    .limit(limit)

  return (data ?? []).map((r) => {
    const inv = r.invoices as unknown as { invoice_number: string; clients: { name: string } }
    return {
      id: r.id, invoiceNumber: inv.invoice_number,
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

  const [invoicesRes, clientsRes, contractsRes, recentInvRes, recentConRes, auditRes, reminderRes] =
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
        .in('contract_id', await adminClient.from('contracts').select('id').eq('user_id', userId).then(r => (r.data ?? []).map(c => c.id)))
        .order('timestamp', { ascending: false })
        .limit(5),
      adminClient
        .from('reminder_logs')
        .select('id, sent_at, recipient_email, status, invoices!inner(invoice_number)')
        .eq('user_id', userId)
        .order('sent_at', { ascending: false })
        .limit(5),
    ])

  const invoices = invoicesRes.data ?? []
  const totalInvoiced = invoices.reduce((s, i) => s + (i.total ?? 0), 0)
  const totalPaid = invoices.reduce((s, i) => i.status === 'paid' ? s + (i.total ?? 0) : s, 0)
  const outstanding = invoices.reduce((s, i) => i.status !== 'paid' ? s + (i.total ?? 0) : s, 0)
  const overdueCount = invoices.filter(i => i.status === 'overdue').length
  const pendingInvoices = invoices.filter(i => ['sent', 'partial'].includes(i.status)).length
  const draftInvoices = invoices.filter(i => i.status === 'draft').length

  const paidInvRes = await adminClient
    .from('invoices')
    .select('total')
    .eq('user_id', userId)
    .eq('status', 'paid')
    .gte('updated_at', thirtyDaysAgo)
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
