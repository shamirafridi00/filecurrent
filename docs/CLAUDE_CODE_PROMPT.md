# Claude Code Master Prompt
# Paste this into Claude Code to start building

---

## CONTEXT

I am building a freelance management SaaS called [YOUR_APP_NAME].
It's a clone of PaperDock with my own branding and color scheme.

All spec files and component files are in this repository.

---

## TECH STACK

- Next.js 14 (App Router)
- TypeScript
- Tailwind CSS
- shadcn/ui for base components
- Supabase for database + auth + file storage
- React Hook Form + Zod for form validation
- Lucide React for icons
- Resend for transactional email
- LemonSqueezy for payments
- Vercel for deployment

---

## PHASE 1 — PROJECT SETUP

1. Initialize Next.js 14 with TypeScript and Tailwind
2. Install dependencies: `npx shadcn-ui@latest init`
3. Install: lucide-react, zustand, react-hook-form, zod, @supabase/supabase-js, resend
4. Copy all files from the docs/ folder into the project
5. Set up the directory structure as defined in docs/APP_SPEC.md section 12

---

## PHASE 2 — DATABASE (SUPABASE)

Create these tables in Supabase:

```sql
-- Users (extends Supabase auth.users)
CREATE TABLE profiles (
  id UUID REFERENCES auth.users PRIMARY KEY,
  full_name TEXT,
  phone TEXT,
  business_name TEXT,
  business_logo TEXT,
  address TEXT,
  city TEXT,
  state TEXT,
  postal_code TEXT,
  country TEXT DEFAULT 'United States',
  tax_id TEXT,
  default_currency TEXT DEFAULT 'USD',
  default_tax_rate DECIMAL DEFAULT 0,
  timezone TEXT DEFAULT 'UTC',
  plan TEXT DEFAULT 'trial',
  trial_ends_at TIMESTAMPTZ DEFAULT NOW() + INTERVAL '30 days',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE clients (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users NOT NULL,
  name TEXT NOT NULL,
  email TEXT,
  phone TEXT,
  company TEXT,
  address TEXT,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE contract_templates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users,
  name TEXT NOT NULL,
  description TEXT,
  content TEXT NOT NULL,
  is_default BOOLEAN DEFAULT FALSE,
  is_global BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE contracts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users NOT NULL,
  client_id UUID REFERENCES clients NOT NULL,
  template_id UUID REFERENCES contract_templates,
  title TEXT NOT NULL,
  project_description TEXT,
  amount DECIMAL NOT NULL DEFAULT 0,
  currency TEXT DEFAULT 'USD',
  payment_terms TEXT,
  start_date DATE,
  end_date DATE,
  additional_terms TEXT,
  status TEXT DEFAULT 'draft',
  signed_at TIMESTAMPTZ,
  open_count INTEGER DEFAULT 0,
  last_opened_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE invoices (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users NOT NULL,
  client_id UUID REFERENCES clients NOT NULL,
  invoice_number TEXT NOT NULL,
  invoice_date DATE NOT NULL,
  due_date DATE,
  currency TEXT DEFAULT 'USD',
  items JSONB DEFAULT '[]',
  subtotal DECIMAL DEFAULT 0,
  tax_rate DECIMAL DEFAULT 0,
  tax_amount DECIMAL DEFAULT 0,
  discount_amount DECIMAL DEFAULT 0,
  total DECIMAL DEFAULT 0,
  notes TEXT,
  payment_terms TEXT,
  status TEXT DEFAULT 'draft',
  paid_amount DECIMAL DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE payments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  invoice_id UUID REFERENCES invoices NOT NULL,
  amount DECIMAL NOT NULL,
  payment_date DATE NOT NULL,
  method TEXT NOT NULL,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE email_templates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users,
  name TEXT NOT NULL,
  key TEXT NOT NULL,
  description TEXT,
  subject TEXT NOT NULL,
  body TEXT NOT NULL,
  is_system BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE reminder_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  invoice_id UUID REFERENCES invoices,
  client_id UUID REFERENCES clients,
  recipient_email TEXT,
  template_key TEXT,
  status TEXT DEFAULT 'sent',
  sent_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE reminder_settings (
  user_id UUID REFERENCES auth.users PRIMARY KEY,
  enabled BOOLEAN DEFAULT TRUE,
  days_before INTEGER[] DEFAULT '{3,1}',
  send_on_due_date BOOLEAN DEFAULT TRUE,
  days_after_overdue INTEGER[] DEFAULT '{3,7,14}',
  max_reminders_per_invoice INTEGER DEFAULT 5,
  skip_below_balance DECIMAL DEFAULT 10
);

CREATE TABLE invoice_settings (
  user_id UUID REFERENCES auth.users PRIMARY KEY,
  theme TEXT DEFAULT 'summit',
  primary_color TEXT DEFAULT '#4F46E5',
  secondary_color TEXT DEFAULT '#0F172A',
  brand_name TEXT,
  brand_logo TEXT,
  brand_address TEXT,
  phone TEXT,
  website TEXT,
  tax_id TEXT
);
```

Enable Row Level Security on all tables:
```sql
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
-- Repeat for all tables
-- Policy: users can only see/edit their own rows
CREATE POLICY "Users see own rows" ON clients
  FOR ALL USING (auth.uid() = user_id);
-- Repeat pattern for all tables
```

---

## PHASE 3 — AUTH

Build auth using Supabase Auth:
- /login page — email + password sign in
- /signup page — full name + email + password + confirm password
- After signup → auto-create profile row + seed system templates for user
- Auth middleware: protect all /dashboard/* routes, redirect to /login
- Logout → show ConfirmDialog (NOT window.confirm), then sign out

Session:
- Use Supabase session cookies
- Set session to 7 days
- No 30-min timeout — keep session alive

---

## PHASE 4 — BUILD PAGES IN ORDER

Build each page using the component files I provide.

### Order:
1. AppLayout (sidebar + topbar)
2. /dashboard
3. /clients (list + new + [id] + [id]/edit)
4. /contracts (list + new + [id])
5. /contracts/templates (list + new + [id]/edit)
6. /invoices (list + new + [id])
7. /client-activity
8. /imports
9. /exports
10. /reminders (hub + templates + settings)
11. /settings + /settings/invoice
12. /feedback
13. Landing page (/)

### Important navigation fixes:
- When opening /contracts/new from /clients/[id], pass ?returnTo=/clients/[id]
  and use that for the back button, not hardcoded /contracts
- Same fix for /invoices/new from /clients/[id]
- /reminders/templates/[id]/edit back button → /reminders/templates (not /reminders)

### Replace all window.confirm() with ConfirmDialog component
### Replace all window.alert() with AlertBanner or Toast

---

## PHASE 5 — BRANDING

Replace all PaperDock references:
- App name: [YOUR_APP_NAME] (defined in src/lib/constants.ts → APP_NAME)
- Primary color: change #4F46E5 to your color in src/lib/theme.ts
- Logo: your logo in the topbar (32x32 square with rounded corners)
- All "paperdock.pro" URLs with your domain

---

## PHASE 6 — KEY FEATURES TO IMPLEMENT

### Invoice PDF generation
Use puppeteer or react-pdf to generate PDF from invoice detail page.
Respect invoice theme (aurora/summit/ledger) and brand colors from invoice settings.

### Send invoice by email
Use Resend API. Send HTML invoice as email attachment (PDF).
Show ConfirmDialog before sending.

### CSV/Excel import (clients)
Use papaparse for CSV, xlsx for Excel.
Map columns: name (required), email, company, phone, address, notes.
Show import summary after processing.

### Export ZIP
Use ExcelJS + JSZip.
Export selected data (clients Excel, contracts PDF, invoices Excel+PDF) into single ZIP.

### Payment reminders (cron)
Implement as Next.js API route /api/cron/process-reminders.
Read reminder_settings for user.
Check invoices that match the schedule.
Send emails via Resend.
Log to reminder_logs.
Set up cron via Vercel cron or external cron.

---

## PHASE 7 — POLISH

- Loading states on all async actions
- Error boundaries on all pages
- Empty states for all list pages (clients, contracts, invoices, etc.)
- Toast notifications for all CRUD operations
- Responsive layout (sidebar collapses on mobile)
- No window.confirm() or window.alert() anywhere

---

## MY BRANDING

App name: [YOUR_APP_NAME]
Primary color: [YOUR_HEX_COLOR]
Logo: [describe your logo or say "text-only initials logo"]

All other design follows the spec in docs/APP_SPEC.md.
