# FileCurrent — Codebase Map
**Product:** SaaS for US freelancers to manage contracts, invoices, and e-signatures.
**Stack:** Next.js 14 (App Router) · Supabase (PostgreSQL) · Tailwind CSS · shadcn/ui · TypeScript
**Live:** https://filecurrent.com
**Supabase region:** us-west-1 (Oregon) · **Vercel region:** sfo1 (San Francisco)

---

## Table of Contents
1. [Product Overview](#1-product-overview)
2. [Directory Structure](#2-directory-structure)
3. [Data Model](#3-data-model)
4. [Database Functions](#4-database-functions-srclibdbsupabasets)
5. [Routes — Pages](#5-routes--pages)
6. [Routes — API](#6-routes--api)
7. [Components](#7-components)
8. [Invoice Theme System](#8-invoice-theme-system)
9. [Email System](#9-email-system)
10. [External Services](#10-external-services)
11. [Auth & Plans](#11-auth--plans)
12. [Key Constants](#12-key-constants)
13. [Environment Variables](#13-environment-variables)
14. [Change Log](#14-change-log)

---

## 1. Product Overview

FileCurrent is a freelancer business tool targeting the US market. Core value: send contracts for e-signature, generate professional invoices, track payments, automate payment reminders.

**Feature set:**
| Feature | Status |
|---|---|
| Client management (CRUD) | ✅ Live |
| Contract creation from templates | ✅ Live |
| E-signatures (sign via public link) | ✅ Live |
| Invoice creation with 5 themes | ✅ Live |
| Invoice PDF download | ✅ Pro only |
| Invoice public share link | ✅ Live |
| Payment recording | ✅ Live |
| Recurring invoices | ✅ Live |
| Invoice duplicate | ✅ Live |
| Overdue auto-mark (on page load) | ✅ Live |
| Invoice filters (status/client/date) | ✅ Live |
| Payment reminders (automated email) | ✅ Live |
| Data export (Excel/PDF) | ✅ Live |
| Client import (CSV/Excel) | ✅ Live |
| Client activity tracking | ✅ Live |
| Dashboard analytics | ✅ Live |
| Business logo upload (R2) | ✅ Live |
| Subscription billing (Lemon Squeezy) | ✅ Live |
| Payment processing (direct) | ❌ Not planned yet |

---

## 2. Directory Structure

```
src/
├── app/
│   ├── (dashboard)/          # Protected routes — require auth
│   │   ├── layout.tsx        # Dashboard shell layout
│   │   ├── actions.ts        # Server actions
│   │   ├── dashboard/        # /dashboard — stats + recent activity
│   │   ├── clients/          # /clients — list, new, [id], [id]/edit
│   │   ├── contracts/        # /contracts — list, new, [id], templates/
│   │   ├── invoices/         # /invoices — list, new, [id], templates/
│   │   ├── reminders/        # /reminders — logs, settings
│   │   ├── settings/         # /settings — profile, notifications
│   │   ├── client-activity/  # /client-activity
│   │   ├── exports/          # /exports
│   │   ├── imports/          # /imports
│   │   └── feedback/         # /feedback
│   │
│   ├── (marketing)/          # Public marketing pages
│   │   ├── about/
│   │   ├── blog/             # MDX blog posts
│   │   ├── contact/
│   │   ├── help/
│   │   ├── privacy/
│   │   ├── terms/
│   │   ├── refund/
│   │   └── trial-expired/    # Upgrade page shown after trial ends
│   │
│   ├── api/                  # API route handlers
│   │   ├── checkout/         # Lemon Squeezy checkout
│   │   ├── clients/          # Client CRUD
│   │   ├── contracts/        # Contract CRUD + sign + PDF
│   │   ├── invoices/         # Invoice CRUD + payments + PDF + recurring + duplicate
│   │   ├── invoice-templates/ # Invoice template CRUD
│   │   ├── profile/          # Profile + logo upload
│   │   ├── contact/          # Contact form
│   │   ├── cron/             # Scheduled jobs
│   │   ├── webhooks/         # Lemon Squeezy webhook
│   │   └── auth/             # OAuth callback
│   │
│   ├── auth/callback/        # Supabase OAuth callback
│   ├── login/                # Login page
│   ├── signup/               # Signup page
│   ├── sign/[token]/         # Public contract signing page
│   ├── i/[token]/            # Public invoice view page
│   └── page.tsx              # Landing page
│
├── components/
│   ├── ui/                   # shadcn/ui primitives
│   ├── layout/               # AppLayout, Sidebar, Topbar, DashboardShell
│   ├── invoices/             # All invoice components (see §7)
│   ├── contracts/            # All contract components
│   ├── clients/              # ClientForm, DeleteClientButton
│   ├── reminders/            # ReminderSettings, EmailTemplateForm
│   ├── sign/                 # SignaturePanel, SignedActions
│   ├── settings/             # SettingsTabs
│   ├── onboarding/           # OnboardingModal
│   ├── upgrade/              # UpgradePrompt, UpgradeSuccessToast
│   ├── landing/              # LandingContent, NavBar, AnimatedFeatureCards
│   ├── logo/                 # LogoMark, LogoFull
│   └── icons.tsx             # Phosphor icon re-exports
│
├── lib/
│   ├── db/
│   │   ├── supabase.ts       # ALL database functions (single file, ~1400 lines)
│   │   └── seedUserDefaults.ts # Seeds default invoice templates on first load
│   ├── supabase/
│   │   ├── admin.ts          # adminClient (service role — server only)
│   │   ├── server.ts         # createClient() for server components
│   │   └── client.ts         # createClient() for client components
│   ├── email/
│   │   ├── index.ts          # sendEmail() via Brevo SDK
│   │   └── templates/        # invoice-sent, invoice-opened, payment-reminder,
│   │                         # contract-signature-request, contract-signed
│   ├── pdf/
│   │   ├── InvoicePDF.tsx    # @react-pdf/renderer invoice template
│   │   └── ContractPDF.tsx   # @react-pdf/renderer contract template
│   ├── lemonsqueezy.ts       # Payment checkout helpers
│   ├── r2.ts                 # Cloudflare R2 upload (via AWS S3 SDK)
│   ├── constants.ts          # APP_NAME, nav items, placeholders, themes
│   ├── utils.ts              # formatCurrency, formatDate, cn()
│   └── system-templates.ts   # Default email templates content
│
├── types/
│   └── index.ts              # All TS types + interfaces + constants
│
├── hooks/
│   ├── useCheckout.ts        # Lemon Squeezy checkout flow hook
│   └── index.ts
│
└── content/
    └── blog/                 # MDX blog posts (4 posts)
```

---

## 3. Data Model

### Supabase Tables (public schema)

| Table | Rows (approx) | RLS | Description |
|---|---|---|---|
| `profiles` | 1 active | ✅ | User account, plan, settings |
| `clients` | varies | ✅ | Client contact info |
| `contracts` | varies | ✅ | Contract documents |
| `contract_templates` | 7 (system) + user | ✅ | Reusable contract templates |
| `invoices` | varies | ✅ | Invoice records with JSONB items |
| `invoice_templates` | 5 per user | ✅ | Invoice design templates |
| `payments` | varies | ✅ | Payment records per invoice |
| `signing_sessions` | varies | ✅ | E-signature tokens |
| `audit_events` | varies | ✅ | Contract open/sign events |
| `reminder_settings` | 1 per user | ✅ | Payment reminder config |
| `reminder_logs` | varies | ✅ | Sent reminder history |
| `email_templates` | varies | ✅ | Custom email template overrides |
| `invoice_settings` | 1 per user | ✅ | Legacy (replaced by invoice_templates) |
| `line_item_presets` | 38 (system) | ✅ | Profession-based default line items |
| `feedback` | varies | ✅ | User feedback submissions |
| `reminder_unsubscribes` | varies | ✅ | Unsubscribe list |

### Key column notes
- `invoices.items` — JSONB array (no separate invoice_items table)
- `invoices.is_recurring` + `recurrence_interval` + `recurrence_next_date` + `recurrence_end_date` + `recurrence_parent_id`
- `invoices.share_token` — UUID for public link `/i/{token}`
- `invoices.deposit_amount` — upfront deposit, deducted from balance
- `invoices.payment_instructions` — shown on public invoice page
- `profiles.plan` — `trial | free | pro | pro_monthly | pro_annual | lifetime`
- `profiles.notification_prefs` — JSONB `{ invoice_opened: bool, ... }`
- `signing_sessions.unique_token` — UUID for public contract signing `/sign/{token}`

### Database Indexes (added 2026-06-07)
```sql
idx_invoices_user_id_created     invoices(user_id, created_at DESC)
idx_invoices_user_status         invoices(user_id, status)
idx_invoices_user_recurring      invoices(user_id, is_recurring, recurrence_next_date) WHERE is_recurring = true
idx_invoices_due_date            invoices(user_id, due_date) WHERE status IN ('sent','partial')
idx_invoices_share_token         invoices(share_token) WHERE share_token IS NOT NULL
idx_contracts_user_id_created    contracts(user_id, created_at DESC)
idx_contracts_user_status        contracts(user_id, status)
idx_clients_user_id              clients(user_id)
idx_payments_invoice_id          payments(invoice_id, payment_date DESC)
idx_audit_events_contract_id     audit_events(contract_id, timestamp DESC)
idx_reminder_logs_user_id        reminder_logs(user_id, sent_at DESC)
idx_signing_sessions_contract_id signing_sessions(contract_id)
idx_signing_sessions_token       signing_sessions(unique_token)
```

---

## 4. Database Functions (`src/lib/db/supabase.ts`)

All functions use `adminClient` (service role). Single file ~1400 lines.

### Profile
| Function | Returns | Notes |
|---|---|---|
| `getCurrentProfile(userId)` | `LocalProfile` | email, fullName, businessName, plan, trialEndsAt |
| `getFullProfile(userId)` | full profile row | all fields including logo, address |
| `updateProfile(userId, data)` | void | |
| `completeOnboarding(userId, input)` | void | sets profession, businessName, onboarding flag |
| `checkDocLimit(userId)` | `{allowed, isTrial, daysLeft, reason}` | enforces free/trial limits |

### Clients
| Function | Returns | Notes |
|---|---|---|
| `getClients(userId)` | `ClientRow[]` | |
| `getClientById(id, userId)` | `ClientDetailRow \| null` | includes contractCount, invoiceCount |
| `createClient(userId, data)` | clientId | |
| `updateClient(id, userId, data)` | void | |
| `deleteClient(id, userId)` | void | |

### Contracts
| Function | Returns | Notes |
|---|---|---|
| `getContracts(userId)` | `ContractListRow[]` | |
| `getContract(id, userId)` | `ContractDetailRow \| null` | includes template content, client |
| `createContract(userId, data)` | contractId | |
| `createSigningSession(contractId, signerEmail)` | token | unique UUID |
| `getContractForSigning(token)` | `SigningSessionRow \| null` | public — no auth |
| `submitContractSignature(token, signerName, ip)` | void | marks signed, creates audit event |
| `getContractTemplates(userId, profession)` | `{my, global}` | |
| `createContractTemplate(userId, data)` | templateId | |
| `updateContractTemplate(id, userId, data)` | void | |
| `deleteContractTemplate(id, userId)` | void | |

### Invoices
| Function | Returns | Notes |
|---|---|---|
| `getInvoices(userId)` | `InvoiceListRow[]` | includes recurrence fields |
| `getInvoice(id, userId)` | `InvoiceDetailRow \| null` | includes items, template, client |
| `getInvoiceByShareToken(token)` | `InvoicePublicRow \| null` | public — no auth, tracks open_count |
| `createInvoice(userId, data)` | invoiceId | |
| `updateInvoiceStatus(id, userId, status)` | void | |
| `deleteInvoice(id, userId)` | void | |
| `getNextInvoiceSequence(userId)` | number | generates INV-YYYY-NNNN |
| `markOverdueInvoices(userId)` | void | updates sent/partial where due_date < today |
| `setInvoiceRecurring(id, userId, settings)` | void | |
| `generateRecurringInvoices(userId)` | void | creates draft copies on due date |

### Payments
| Function | Returns | Notes |
|---|---|---|
| `getInvoicePayments(invoiceId)` | `PaymentRow[]` | |
| `recordPayment(invoiceId, data)` | paymentId | auto-updates invoice status + balance |

### Invoice Templates
| Function | Returns | Notes |
|---|---|---|
| `getInvoiceTemplates(userId)` | `InvoiceTemplateRow[]` | |
| `getInvoiceTemplate(id)` | `InvoiceTemplateRow \| null` | |
| `createInvoiceTemplate(userId, data)` | templateId | |
| `updateInvoiceTemplate(id, userId, data)` | void | |
| `deleteInvoiceTemplate(id, userId)` | void | |

### Other
| Function | Notes |
|---|---|
| `getDashboardStats(userId)` | Heavy: 7+ parallel queries, known N+1 in auditRes |
| `getReminderSettings(userId)` | Returns defaults if not set |
| `saveReminderSettings(userId, data)` | |
| `getReminderLogs(userId, limit)` | |
| `getLineItemPresets(profession)` | 38 system presets |

---

## 5. Routes — Pages

### Public
| Route | File | Notes |
|---|---|---|
| `/` | `app/page.tsx` | Landing page |
| `/login` | `app/login/` | |
| `/signup` | `app/signup/` | |
| `/sign/[token]` | `app/sign/[token]/` | Contract signing — public, no auth |
| `/i/[token]` | `app/i/[token]/page.tsx` | Public invoice view — uses `InvoiceDocument` |
| `/trial-expired` | `app/(marketing)/trial-expired/` | Upgrade page — Monthly + Annual only (Lifetime removed) |

### Dashboard (protected)
| Route | Notes |
|---|---|
| `/dashboard` | Stats + recent invoices/contracts |
| `/clients` | List with contract/invoice counts |
| `/clients/new` | ClientForm |
| `/clients/[id]` | Detail + edit link |
| `/clients/[id]/edit` | ClientForm (edit mode) |
| `/contracts` | List with status badges |
| `/contracts/new` | ContractForm with template selector |
| `/contracts/[id]` | Detail, send for signature, PDF |
| `/contracts/templates` | System + user templates |
| `/contracts/templates/new` | ContractTemplateForm |
| `/contracts/templates/[id]/edit` | ContractTemplateForm (edit) |
| `/invoices` | List — runs markOverdueInvoices + generateRecurringInvoices on load |
| `/invoices/new` | InvoiceForm with live preview |
| `/invoices/[id]` | Detail — uses `InvoiceDocument` + sidebar (payment, share, recurring) |
| `/invoices/templates` | 5 theme templates — seeds on first load |
| `/invoices/templates/new` | InvoiceTemplateFormPage |
| `/invoices/templates/[id]/edit` | InvoiceTemplateFormPage (edit) |
| `/reminders` | Reminder logs table |
| `/reminders/settings` | ReminderSettingsForm + EmailTemplateForm |
| `/settings` | SettingsTabs: profile, logo, password, notifications |
| `/client-activity` | Table of latest contract/invoice per client |
| `/exports` | Export data as Excel/PDF |
| `/imports` | Import clients from CSV/Excel |
| `/feedback` | Feedback form |

---

## 6. Routes — API

### Invoices
| Method | Route | Handler notes |
|---|---|---|
| POST | `/api/invoices` | Create invoice, returns `{ id }` |
| GET | `/api/invoices/[id]` | Get single invoice |
| PUT | `/api/invoices/[id]` | Update invoice |
| DELETE | `/api/invoices/[id]` | Delete invoice |
| POST | `/api/invoices/[id]/status` | Update status only |
| POST | `/api/invoices/[id]/payments` | Record payment |
| GET | `/api/invoices/[id]/pdf` | Generate + stream PDF (Pro only) |
| POST | `/api/invoices/[id]/duplicate` | Clone invoice as draft, returns `{ id }` |
| PATCH | `/api/invoices/[id]/recurring` | Set recurring settings |

### Contracts
| Method | Route | Notes |
|---|---|---|
| POST/GET | `/api/contracts` | Create/list |
| POST | `/api/contracts/[id]/send` | Send for signature (creates signing session, sends email) |
| GET | `/api/contracts/[id]/status` | Poll signing status |
| GET | `/api/contracts/[id]/pdf` | Generate PDF |

### Other
| Route | Notes |
|---|---|
| `/api/clients/[id]` | GET/PUT/DELETE |
| `/api/invoice-templates/[id]` | CRUD |
| `/api/profile` | GET/PUT |
| `/api/profile/logo` | POST — upload to R2 |
| `/api/checkout` | POST — Lemon Squeezy checkout URL |
| `/api/webhooks/lemonsqueezy` | POST — update plan on payment |
| `/api/cron/process-reminders` | POST — send payment reminders (runs 9am UTC daily) |
| `/api/cron/reset-monthly-docs` | POST — reset monthly doc count (1st of month) |
| `/api/contact` | POST — contact form email |
| `/api/sign/[token]` | GET — public contract data for signing |

---

## 7. Components

### Invoice Components (`src/components/invoices/`)
| Component | Type | Purpose |
|---|---|---|
| `InvoiceDocument.tsx` | Server-safe | **SHARED** invoice renderer used in dashboard detail + public page. Props: `data: InvoiceDocumentData`, `theme: InvoiceDocumentTheme` |
| `InvoicePreview.tsx` | Client | Scaled-down live preview shown while creating invoice in InvoiceForm |
| `InvoiceThemePreviews.tsx` | Client | Tiny thumbnail cards for theme selection (SummitPreview, AuroraPreview, etc.) |
| `InvoiceList.tsx` | Client | Invoice list with filters (status pills, search, client dropdown, date range) |
| `InvoiceForm.tsx` | Client | Full invoice creation/edit form with localStorage draft + live preview |
| `InvoiceTemplateFormPage.tsx` | Client | Template editor — theme picker, color pickers, brand fields |
| `InvoicePdfButton.tsx` | Client | Download PDF (Pro gate) |
| `InvoiceShareLink.tsx` | Client | Copy link + open. Props: `shareToken`, `compact?: boolean` |
| `RecordPaymentModal.tsx` | Client | Payment recording dialog |
| `DuplicateInvoiceButton.tsx` | Client | POST duplicate, redirect to new invoice |
| `RecurringSettings.tsx` | Client | Toggle + frequency + dates. PATCHes `/api/invoices/[id]/recurring` |

### Layout Components (`src/components/layout/`)
| Component | Notes |
|---|---|
| `AppLayout.tsx` | Main authenticated wrapper |
| `Sidebar.tsx` | Nav using MAIN_NAV_ITEMS + ACCOUNT_NAV_ITEMS |
| `Topbar.tsx` | User menu, no data fetching |
| `DashboardShell.tsx` | Shell wrapper with logout |

### Shared UI (`src/components/ui/`)
Full shadcn/ui suite: accordion, alert, alert-dialog, avatar, badge, button, card, checkbox, command, dialog, dropdown-menu, form, input, label, popover, progress, radio-group, scroll-area, select, separator, sheet, skeleton, sonner (toasts), switch, table, tabs, textarea, tooltip.

---

## 8. Invoice Theme System

5 themes. Each has distinct layout. Theme stored in `invoice_templates.theme`.

| Theme | Header Style | Table Headers | Accent |
|---|---|---|---|
| `summit` | White bg, 4px left border in primaryColor | Light gray `#F3F4F6` bg, dark text | primaryColor for brand name |
| `ivory` | White bg, 3px top border in primaryColor | Off-white `#F9FAFB` bg, dark text | primaryColor for "INVOICE" label |
| `ledger` | Dark `#111827` left sidebar, white right | No bg, `border-b-2 border-slate-800`, dark text | Dark + classic |
| `aurora` | Gradient `135deg primaryColor → #14b8a6` | `primaryColor` at 10% opacity, primaryColor text | Teal gradient |
| `slate` | Solid `primaryColor` bg, white text | Solid `primaryColor` bg, white text | Bold, brand-forward |

**Rendering locations:**
1. `InvoicePreview.tsx` — live preview in InvoiceForm (scaled down, fake data)
2. `InvoiceDocument.tsx` — actual invoice (used in `/invoices/[id]` dashboard + `/i/[token]` public)
3. `InvoiceThemePreviews.tsx` — tiny thumbnail cards in template selector
4. `src/lib/pdf/InvoicePDF.tsx` — PDF generation via @react-pdf/renderer

**Ledger preview matches InvoiceDocument** (fixed 2026-06-07): dark sidebar shows brandName + INVOICE + number only; FROM/BILL TO section below header; totals use `border-t border-slate-200`.

---

## 9. Email System

Provider: **Brevo** (formerly Sendinblue) via `@getbrevo/brevo` SDK.
Sender: configured via `EMAIL_FROM_ADDRESS` + `EMAIL_FROM_NAME` env vars.

### Transactional emails
| Template | Trigger | File |
|---|---|---|
| Invoice sent | User clicks "Send Invoice" | `email/templates/invoice-sent.ts` |
| Invoice opened | Client opens public invoice link (rate-limited 1/hr) | `email/templates/invoice-opened.ts` |
| Payment reminder | Cron at 9am UTC, per ReminderSettings config | `email/templates/payment-reminder.ts` |
| Contract signature request | User clicks "Send for Signature" | `email/templates/contract-signature-request.ts` |
| Contract signed | Signer completes signature | `email/templates/contract-signed.ts` |

### Reminder automation
Config in `reminder_settings`: daysBefore[], sendOnDueDate, daysAfterOverdue[], maxRemindersPerInvoice, skipBelowBalance.
Cron: `POST /api/cron/process-reminders` at `0 9 * * *` (vercel.json).
Logs stored in `reminder_logs`.
Unsubscribe list in `reminder_unsubscribes`.

---

## 10. External Services

| Service | Purpose | SDK / Method |
|---|---|---|
| **Supabase** | Database + Auth | `@supabase/supabase-js` v2, `@supabase/ssr` |
| **Vercel** | Hosting + cron jobs | Next.js deploy |
| **Lemon Squeezy** | Subscription billing | REST API via `lemonsqueezy.ts` |
| **Brevo** | Transactional email | `@getbrevo/brevo` SDK |
| **Cloudflare R2** | Business logo storage | AWS S3 SDK (`@aws-sdk/client-s3`) |

### Lemon Squeezy Plans
| Plan key | Variant | Price |
|---|---|---|
| `pro_monthly` | `LEMONSQUEEZY_MONTHLY_VARIANT_ID` | $9/mo |
| `pro_annual` | `LEMONSQUEEZY_ANNUAL_VARIANT_ID` | $79/yr |
| ~~`lifetime`~~ | ~~`LEMONSQUEEZY_LIFETIME_VARIANT_ID`~~ | ~~$49 one-time~~ (removed from UI) |

Webhook at `/api/webhooks/lemonsqueezy` updates `profiles.plan` on successful payment.

---

## 11. Auth & Plans

Auth via Supabase (email + OAuth). Middleware at `src/middleware.ts` — protects all `/dashboard`, `/invoices`, `/clients`, `/contracts`, etc. routes.

### Plan hierarchy
```
trial      → 30-day full access, then redirects to /trial-expired
free       → limited docs per month (checkDocLimit)
pro        → alias used in some places
pro_monthly → $9/mo — full access
pro_annual  → $79/yr — full access
lifetime   → $49 one-time — full access (billing removed from UI, plan type still exists)
```

**To manually set a user to paid:** Run in Supabase SQL Editor:
```sql
UPDATE profiles SET plan = 'pro_annual' WHERE email = 'user@example.com';
```

---

## 12. Key Constants

From `src/lib/constants.ts`:
- `APP_NAME` = `'FileCurrent'`
- `APP_URL` = `'https://filecurrent.com'`
- `TRIAL_DAYS` = `30`
- Cron: reminders at `0 9 * * *`, monthly reset at `1 0 1 * *`

From `src/types/index.ts`:
- `CURRENCIES` = USD, EUR, GBP, CAD, AUD
- `InvoiceTheme` = `'aurora' | 'summit' | 'ledger' | 'slate' | 'ivory'`
- `Plan` = `'trial' | 'free' | 'pro' | 'pro_monthly' | 'pro_annual' | 'lifetime'`
- `InvoiceStatus` = `'draft' | 'sent' | 'partial' | 'paid' | 'overdue'`
- `ContractStatus` = `'draft' | 'sent' | 'opened' | 'signed'`

---

## 13. Environment Variables

```bash
# Supabase
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=

# Email (Brevo)
BREVO_API_KEY=
EMAIL_FROM_ADDRESS=
EMAIL_FROM_NAME=
EMAIL_REPLY_TO=

# Payments (Lemon Squeezy)
LEMONSQUEEZY_API_KEY=
LEMONSQUEEZY_STORE_ID=
LEMONSQUEEZY_WEBHOOK_SECRET=
LEMONSQUEEZY_MONTHLY_VARIANT_ID=
LEMONSQUEEZY_ANNUAL_VARIANT_ID=
LEMONSQUEEZY_LIFETIME_VARIANT_ID=

# File Storage (Cloudflare R2)
R2_ACCOUNT_ID=
R2_BUCKET_NAME=
R2_ENDPOINT=
R2_ACCESS_KEY_ID=
R2_SECRET_ACCESS_KEY=
NEXT_PUBLIC_R2_PUBLIC_URL=

# App
NEXT_PUBLIC_APP_URL=https://filecurrent.com
CRON_SECRET=
```

---

## 14. Change Log

| Date | Change | Files affected |
|---|---|---|
| 2026-06-07 | Added 13 database performance indexes | Supabase DB |
| 2026-06-07 | Set Vercel region to `sfo1` (matches Supabase `us-west-1`) | `vercel.json` |
| 2026-06-07 | Removed Lifetime Deal from trial-expired page | `app/(marketing)/trial-expired/page.tsx` |
| 2026-06-07 | Added `InvoiceDocument.tsx` shared component | `components/invoices/InvoiceDocument.tsx` |
| 2026-06-07 | Public invoice page `/i/[token]` uses InvoiceDocument | `app/i/[token]/page.tsx` |
| 2026-06-07 | Invoice filters: status pills, search, client, date range | `components/invoices/InvoiceList.tsx` |
| 2026-06-07 | Overdue auto-mark on page load | `lib/db/supabase.ts` — `markOverdueInvoices` |
| 2026-06-07 | Invoice duplicate feature | `api/invoices/[id]/duplicate/route.ts`, `DuplicateInvoiceButton.tsx` |
| 2026-06-07 | Recurring invoices (toggle + frequency + auto-generate) | `RecurringSettings.tsx`, `api/invoices/[id]/recurring/`, `supabase.ts` |
| 2026-06-07 | Distinct theme headers in dashboard invoice detail page | `app/(dashboard)/invoices/[id]/page.tsx` |
| 2026-06-07 | Fixed Ledger preview layout to match InvoiceDocument structure | `components/invoices/InvoicePreview.tsx` |
| 2026-06-07 | Added % / flat discount toggle in invoice form | `components/invoices/InvoiceForm.tsx` |
| 2026-06-07 | Complete email system: shared emailLayout wrapper, payment-received + welcome templates, payment-received trigger on payment record, welcome email on first signup, per-call replyTo override | `src/lib/email/**` |
| 2026-06-07 | Complete client activity system: client_activity_log table, event logging at all triggers, redesigned /client-activity page, activity tab on /clients/[id], shared ActivityFeed component | `src/app/(dashboard)/client-activity/`, `src/components/clients/ActivityFeed.tsx`, `src/lib/db/supabase.ts`, `src/types/index.ts` |

---

*This file is the authoritative codebase map. Update the Change Log section after every significant commit.*
