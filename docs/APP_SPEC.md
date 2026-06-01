# App Spec & Design Guide
# Freelance Management SaaS — Clone Reference

---

## 1. APP OVERVIEW

**Type:** Freelance paperwork management SaaS  
**Core value:** Clients + Contracts + Invoices in one place  
**Target user:** Freelancers, consultants, independent contractors  
**Monetization:** One-time lifetime deal ($69) with 30-day free trial  

---

## 2. DESIGN SYSTEM

### Colors (Original → Replace with your own)
```
Primary (buttons, links, active nav):     #4F46E5  (indigo)
Primary dark (hover):                     #4338CA
Primary light bg (highlights):            #EEF2FF
Success (paid, signed, sent):             #16A34A  (green)
Success bg:                               #F0FDF4
Warning (partial, pending):               #D97706  (amber)
Warning bg:                               #FFFBEB
Danger (delete, overdue):                 #DC2626  (red)
Danger bg:                                #FEF2F2
Text primary:                             #0F172A
Text secondary:                           #64748B
Border:                                   #E2E8F0
Background:                               #F8FAFC
Card background:                          #FFFFFF
Sidebar background:                       #FFFFFF
Sidebar border:                           #E2E8F0
```

> **To apply your own theme:** Replace all #4F46E5 references with your primary color.
> All colors live in `src/lib/theme.ts` — change once, applies everywhere.

### Typography
```
Font family: Inter (Google Fonts)
Page title:    font-bold text-2xl (30px)  text-slate-900
Page subtitle: text-sm               text-slate-500
Section head:  font-semibold text-base    text-slate-800
Table header:  text-xs uppercase tracking-wide font-semibold text-slate-500
Body:          text-sm                    text-slate-700
Label:         text-sm font-medium        text-slate-700
Helper text:   text-xs                    text-slate-500
```

### Spacing
```
Sidebar width:        200px (fixed)
Topbar height:        56px (fixed)
Content padding:      p-8 (32px all sides)
Card padding:         p-6
Section gap:          gap-6
Form field gap:       gap-4
Table row height:     48px
```

### Border Radius
```
Buttons:   rounded-lg (8px)
Cards:     rounded-xl (12px)
Inputs:    rounded-lg (8px)
Badges:    rounded-full
Modals:    rounded-2xl (16px)
```

### Shadows
```
Card:      shadow-sm
Modal:     shadow-xl
Dropdown:  shadow-lg
Topbar:    shadow-sm border-b
```

---

## 3. LAYOUT STRUCTURE

```
┌─────────────────────────────────────────────────────┐
│  TOPBAR (h-14, full width, z-50)                    │
│  [Logo + AppName]    [Plan badge] [Avatar] [Logout] │
├──────────────┬──────────────────────────────────────┤
│  SIDEBAR     │  MAIN CONTENT AREA                   │
│  (w-[200px]  │  (flex-1, overflow-y-auto)           │
│  fixed left) │  padding: p-8                        │
│              │                                      │
│  MAIN MENU   │  [Page Header]                       │
│  - Dashboard │  [Page Controls / Filters]           │
│  - Clients   │  [Content: Table / Form / Cards]     │
│  - Contracts │                                      │
│  - Invoices  │                                      │
│  - Client    │                                      │
│    Activity  │                                      │
│  - Export    │                                      │
│  - Import    │                                      │
│  - Reminders │                                      │
│              │                                      │
│  ACCOUNT     │                                      │
│  - Settings  │                                      │
│  - Feedback  │                                      │
└──────────────┴──────────────────────────────────────┘
```

### Topbar detail
- Left: Square logo icon (32px) + App name in bold
- Right: Plan badge (colored pill) + Avatar circle (initials) + username + Logout icon button
- Plan badge: gold/amber background, "Pro Plan / Trial Active" text

### Sidebar detail
- Section labels: "MAIN MENU" and "ACCOUNT" in xs uppercase tracking-wide text-slate-400
- Nav items: icon (20px) + label, full-width, rounded-lg on hover and active
- Active state: bg-primary/10 text-primary font-medium
- No collapse/toggle — always visible on desktop

---

## 4. ALL ROUTES & PAGES

### Public routes
```
/                    Landing page
/login               Login form
/signup              Signup form
```

### Protected routes (require auth)
```
/dashboard                           Dashboard home
/clients                             Clients list
/clients/new                         Add new client form
/clients/[id]                        Client detail
/clients/[id]/edit                   Edit client form
/contracts                           Contracts list
/contracts/new                       Create contract form
/contracts/[id]                      Contract detail (view)
/contracts/templates                 Contract templates list
/contracts/templates/new             Create contract template
/contracts/templates/[id]/edit       Edit contract template
/invoices                            Invoices list
/invoices/new                        Create invoice form
/invoices/[id]                       Invoice detail
/client-activity                     Client activity & engagement
/imports                             Import clients (CSV/Excel)
/exports                             Export data
/reminders                           Payment reminders hub
/reminders/templates                 Email templates list
/reminders/templates/new             Create email template
/reminders/templates/[id]/edit       Edit email template
/reminders/settings                  Reminder automation settings
/settings                            Account settings
/settings/invoice                    Invoice settings
/feedback                            Feedback form
```

---

## 5. PAGE-BY-PAGE SPEC

---

### 5.1 LANDING PAGE (/)

**Sections (top to bottom):**

1. **Nav bar**
   - Logo + name (left)
   - Links: Pricing, FAQ, About, Login (right)
   - CTA button: "Sign Up" (primary)

2. **Hero section**
   - Headline: "Professional Contract & Invoice for [Niche]"
   - Subtext: clients, contracts, cashflow — all in one place
   - Trust line: "Trusted by X+ freelancers..."
   - Two CTAs: "Try Free 30 Days" (primary) | "Login" (ghost)
   - Trust badges: "2 Min / Create Contract", "100% Compliant", "Secure", "Simple"

3. **What is [App]? section**
   - Short paragraph description
   - Feature bullet list

4. **Features grid (3 columns)**
   - Freelance Contract Generator
   - Invoice Software for Freelancers
   - Digital E-Signature Tool
   - Client Management Dashboard
   - Freelance Paperwork Automation
   - Secure & Private
   - Complete Audit Trail
   - Client Activity Tracking
   - Export All Your Data

5. **Built for [Niche] section**
   - Target personas grid: Freelance Consultant, Creative Freelance, Freelance Developer, Marketing Agencies, Independent Contractors, Solopreneurs

6. **Comparison table**
   - Compare vs competitors (DocuSign, FreshBooks, etc.)
   - Features vs pricing grid

7. **Pricing section**
   - One plan: $69 lifetime (or your own price)
   - Feature checklist
   - CTA: "Start Your Free 30-Day Trial"

8. **Social proof**
   - 3 testimonial cards

9. **FAQ accordion**
   - 6-7 common questions

10. **CTA footer banner**
    - "Ready to Simplify Your Freelance Paperwork?"
    - Two buttons

11. **Footer**
    - Logo + tagline
    - Links: Product, Resources, Company

---

### 5.2 LOGIN PAGE (/login)

**Form fields:**
- Email (required)
- Password (required)
- "Forgot password?" link

**Buttons:**
- "Sign In" (primary, full width)
- "Don't have an account? Sign Up" link

**Layout:** Centered card, max-w-md, logo above card

---

### 5.3 SIGNUP PAGE (/signup)

**Form fields:**
- Full Name (required)
- Email (required)
- Password (required)
- Confirm Password (required)

**Buttons:**
- "Create Account" (primary, full width)
- "Already have an account? Sign In" link

---

### 5.4 DASHBOARD (/dashboard)

**Trial banner (dismissible):**
- Orange/amber left border accent
- Clock icon, "You are on a free trial"
- "X days remaining in your trial"
- "Unlock lifetime access for $XX" CTA button

**Stat cards row 1 (3 cols):**
- Total Invoiced ($) — document icon
- Total Paid ($) — dollar icon — green
- Outstanding ($) — clock icon — amber

**Stat cards row 2 (4 cols):**
- Active Clients — people icon
- Signed Contracts — contract icon
- Pending — hourglass icon
- Drafts — document icon

**Quick Actions (3 cards):**
- Create Client (person+ icon)
- Create Contract (contract icon)
- Create Invoice (invoice icon)
Each is a clickable card → navigates to /clients/new, /contracts/new, /invoices/new

**Recent Invoices (left col):**
- "View All →" link → /invoices
- Invoice cards: invoice #, client name, date, amount, status badge

**Recent Contracts (right col):**
- "View All →" link → /contracts
- Contract cards: title, client name, date, amount, status badge

**Status badges:**
```
Draft:    bg-slate-100  text-slate-600  border-slate-200
Sent:     bg-blue-100   text-blue-700   border-blue-200
Partial:  bg-amber-100  text-amber-700  border-amber-200
Paid:     bg-green-100  text-green-700  border-green-200
Overdue:  bg-red-100    text-red-700    border-red-200
Signed:   bg-green-100  text-green-700  border-green-200
Pending:  bg-amber-100  text-amber-700  border-amber-200
```

---

### 5.5 CLIENTS (/clients)

**Page header:**
- Title: "Clients"
- Subtitle: "X total clients"
- Button: "+ Add Client" (primary, top right)

**Search bar:**
- Full-width input: "Search by name, email, or company..."
- "Search" button (primary)

**Table columns:**
- NAME (clickable link → /clients/[id])
- EMAIL
- COMPANY
- PHONE
- ACTIONS: eye icon (view) + pencil icon (edit)

**Empty state:**
- Centered icon + "No clients yet" + "Add your first client" button

---

### 5.6 ADD CLIENT (/clients/new)

**Header:**
- "← Back to Clients" link
- Title: "Add New Client"

**Form fields (2-col grid for name/email, phone/company):**
- Client Name* (required)
- Email
- Phone
- Company
- Address (full-width textarea)
- Notes (full-width textarea, "Internal notes — not visible to client")

**Buttons (bottom right):**
- "× Cancel" (ghost)
- "Create Client" (primary, with user-plus icon)

---

### 5.7 CLIENT DETAIL (/clients/[id])

**Header:**
- "← Back to Clients" link
- Client name (h1)
- Edit button (primary outline) + Delete button (red)

**Info card:**
- Email (with envelope icon, clickable mailto)
- Phone (with phone icon)
- Address (with pin icon)
- Created at / Last Updated timestamps

**Contracts section:**
- "Contracts (N)" heading + "+ New Contract" button (primary)
- Table: Title, Amount, Status badge, Period, Actions (View →)

**Invoices section:**
- "Invoices (N)" heading + "+ New Invoice" button (green)
- Table: Invoice #, Amount, Status badge, Issue Date, Due Date, Actions (View →)

**Note on navigation bug (FIX):**
When clicking "+ New Contract" from /clients/[id], the back button on /contracts/new should return to /clients/[id], not /contracts. Implement via router.back() or pass `returnTo` query param.

---

### 5.8 EDIT CLIENT (/clients/[id]/edit)

Same form as Add Client, pre-populated.
Buttons: Cancel + "Update Client"

---

### 5.9 CONTRACTS (/contracts)

**Page header:**
- Title: "Contracts"
- Button: "+ New Contract" (primary)

**Table columns:**
- TITLE
- CLIENT
- AMOUNT
- STATUS (badge)
- DATE (calendar icon)
- ACTIONS: "View" link

---

### 5.10 CREATE CONTRACT (/contracts/new)

**Header:** "← Back to Contracts" | Title: "Create New Contract"

**Section: Basic Information**
- Client* (dropdown)
- Contract Template* (dropdown — lists all templates from /contracts/templates)
- "Manage templates →" link
- Contract Title* (text input)
- Project Description* (textarea)

**Section: Financial Terms**
- Contract Amount* (number input)
- Currency* (dropdown)
- Payment Terms* (textarea)

**Section: Contract Timeline**
- Start Date (date picker)
- End Date (date picker)

**Section: Additional Terms (Optional)**
- Additional Terms & Conditions (textarea)
- Helper: "These will be appended to the contract template."

**Buttons (bottom right):**
- "× Cancel" (ghost)
- "Preview Contract" (primary, with eye icon)

---

### 5.11 CONTRACT TEMPLATES (/contracts/templates)

**Page header:**
- Title: "Contract Templates"
- Subtitle: "Manage your reusable contract templates"
- Button: "+ New Template" (primary)

**Template cards (3-col grid):**
Each card:
- Template name (bold) + "Global" badge (if system template)
- Star icon if default
- Short description
- Preview of contract text (truncated, monospace)
- Created date
- Footer actions: "View" | "Read-only" label | "Use Template →"

**About Templates section (bottom):**
- Placeholder reference table (2 cols)
- Default Template explanation
- Global Templates explanation

**System templates included:**
1. Standard Service Agreement ⭐ (default)
2. Photography Services Agreement
3. Web Development Contract
4. Consulting Services Agreement
5. Content Writing Agreement
6. Design Services Agreement

---

### 5.12 CREATE/EDIT CONTRACT TEMPLATE (/contracts/templates/new | /edit)

**Header:** "← Back to Templates" | Title: "Create New Template" or "Edit Template"

**Section: Template Information**
- Template Name* (text)
- Description (textarea)
- "Set as default template" checkbox

**Section: Template Content***
- Contract Text (large textarea with placeholder text)
- Helper: "Use placeholders like {{client_name}} to automatically fill in details."

**Available Placeholders (2-col grid, blue links):**
```
{{client_name}}         {{brand_name}}
{{client_company}}      (etc.)
{{client_email}}
{{freelancer_name}}
{{freelancer_business}}
{{project_description}}
{{rate}}
{{currency}}
{{start_date}}
{{end_date}}
{{payment_terms}}
```

**Contract Styling Guide (right col):**
```
Bold:          **Important clause**
Italic:        __Confidential__
Underline:     __u:Notice required__
Section:       ## Payment Terms
Subsection:    ### Scope of Work
Bullet:        - First point
Numbered:      1. First item
Divider:       ---
```
Tip: "Keep formatting simple and professional"

**Buttons (bottom):**
- "× Cancel"
- "Create Template" / "Update Template" (primary)

---

### 5.13 INVOICES (/invoices)

**Page header:**
- Title: "Invoices"
- Subtitle: "Manage and track your invoices"
- Button: "+ New Invoice" (primary)

**Filters row:**
- Search input: "Invoice # or client name"
- Status dropdown: All Statuses / Draft / Sent / Partial / Paid / Overdue
- Client dropdown: All Clients / [client names]
- Filter button (dark/slate)

**Table columns:**
- INVOICE # (clickable link → /invoices/[id])
- CLIENT
- DATE
- DUE DATE
- AMOUNT (with "Paid: $X.XX" sub-line if partial)
- STATUS (badge)
- ACTIONS: eye icon (view) + download icon (PDF)

**Summary footer row:**
- Total Invoices: N
- Total Amount: $X
- Paid: $X (green)
- Outstanding: $X (amber)

---

### 5.14 CREATE INVOICE (/invoices/new)

**Header:** "← Back to Invoices" | Title: "Create New Invoice" | Subtitle

**Section: Basic Information** (icon: ℹ️)
- Client* (dropdown)
- Invoice Number* (auto-generated: INV-YYYY-NNNN)
- Invoice Date* (date picker, default today)
- Due Date (date picker)
- Currency* (dropdown, default USD)

**Section: Invoice Items** (icon: 📋) + "+ Add Item" button (green)
Table:
- Description (text input)
- Quantity (number, default 1)
- Unit Price (number, default 0.00)
- Amount (calculated, read-only)
- Delete row (red trash icon)

**Section: Calculations** (icon: 🧮)
- Left col:
  - Tax Rate (%) input + helper
  - Discount Amount input + helper
- Right col — Summary card:
  - Subtotal: $X
  - Tax: $X
  - Discount: -$X (red)
  - **Total: $X** (large, primary color)

**Section: Additional Information** (icon: 📋)
- Notes (textarea, "visible to client")
- Payment Terms (textarea)

**Buttons (bottom right):**
- "Save as Draft" (dark/slate)
- "Save & Mark as Sent" (primary)

---

### 5.15 INVOICE DETAIL (/invoices/[id])

**Top:**
- Success toast: "Invoice created successfully!" (green, dismissible)
- "← Back to Invoices" link

**Invoice card (full width, styled):**
- Header bar (primary color bg): "INVOICE" + invoice number + status badge
- FROM section: freelancer name + email
- BILL TO section: client name, address, email (highlighted box)
- Meta row: Invoice Date | Due Date | Currency | Total Amount (primary color)

**Items table (dark header):**
- Description | Qty | Unit Price | Amount
- Footer: Subtotal, Tax (X%), Discount, TOTAL (large, bold, primary)

**Notes card (blue accent):** notes text
**Payment Terms card (amber accent):** payment terms text

**Payment History section:**
- Empty state: "No payments recorded yet"
- OR: list of payments with date, amount, method

**Record a Payment form:**
- Amount input (USD)
- Payment Date (date picker)
- Balance Due helper text
- Payment Method dropdown: Bank Transfer, Credit Card, Cash, PayPal, Check, Other
- Notes (optional)
- "✓ Record Payment" button (green, full width)

**Action buttons row:**
- Edit Invoice (primary)
- Delete Draft (red) — only if Draft status
- Send Invoice to Client (blue/teal)
- Send Reminder (amber)
- Download PDF (green)
- View Client (primary outline)
- Print (dark)

**Payment Reminders section (bottom):**
- Empty: "No reminders sent for this invoice yet"
- "Send First Reminder" button (primary)

---

### 5.16 CLIENT ACTIVITY (/client-activity)

**Page header:**
- Lightning bolt icon
- Title: "Client Activity & Engagement"
- Subtitle: "Track contract and invoice engagement per client"

**Table columns:**
- CLIENT (name + email)
- CONTRACT STATUS (badge: Signed/Sent/Not sent + "Opened N times" + last activity note)
- LAST CONTRACT ACTIVITY (datetime)
- INVOICE STATUS (badge + invoice # + amount)
- LAST INVOICE ACTIVITY (datetime)
- ACTIONS: eye (view client), contract icon (view contract), dollar/invoice icon (view invoice)

**Status Legend:**
- Not sent → No activity
- Sent → Email delivered
- Opened → Client viewed (purple/indigo)
- Signed/Paid → Completed (green)

---

### 5.17 IMPORT CLIENTS (/imports)

**Page header:**
- Title: "Import Clients"
- Subtitle: "Upload a CSV or Excel file to import multiple clients at once"

**Upload File card:**
- Supported formats: CSV (.csv), Excel (.xls, .xlsx). Max 10MB
- Drop zone (dashed border, upload cloud icon): "Click to upload or drag and drop" + "CSV, XLS, or XLSX files only"
- "Download CSV Template" button
- "Download Excel Template" button

**Import Instructions (blue left-border card):**
- 📋 Import Instructions
- Required column: `name`
- Recommended: `email`, `company`, `phone`
- Optional: `address`, `city`, `state`, `postal_code`, `country`, `notes`
- First row = column headers
- Duplicate detection: email (or name+company if no email)
- Invalid rows skipped, reported in summary

---

### 5.18 EXPORT DATA (/exports)

**Page header:**
- Title: "Export Your Data"
- Subtitle: "Download all your clients, contracts, and invoices as a single ZIP file."

**Form card:**

*Select Data to Export* (checkboxes):
- ☑ Clients — All client information as Excel file
- ☑ Contracts — All contracts as professional PDF files
- ☑ Invoices — Invoice data and files

*Invoice Export Format* (radio):
- ○ Excel Summary Only
- ○ PDF Files Only
- ● Both Excel + PDF Files (Recommended)

*"Start Export" button* (primary, full width)

**What's Included card:**
- ✓ Clients: Excel file with all client info
- ✓ Contracts: Professional PDF files for each contract
- ✓ Invoices: Excel summary and/or PDF files
- ✓ Exports compressed into ZIP
- ✓ Data remains secure

---

### 5.19 PAYMENT REMINDERS (/reminders)

**Page header:**
- Title: "Payment Reminders"
- Subtitle: "Manage payment reminders and configure automation settings"

**Daily limit banner (blue):**
- Info icon + "Daily Email Limit: 19/20"
- "Limits reset daily at midnight"

**3 feature cards:**
- Email Templates (info icon) — "Create and edit reminder templates"
- Automation Settings (gear icon) — "Configure when to send reminders"
- Send Reminder (checkmark icon) — "Send manual reminder from invoice"

**Recent Reminders table:**
- INVOICE | CLIENT | RECIPIENT | STATUS | SENT
- "Sent" badge (green)

**How It Works section (4 green checkmark bullets):**
- Manual Reminders
- Automated Reminders
- Daily Limits
- Customizable Templates

---

### 5.20 EMAIL TEMPLATES (/reminders/templates)

**Page header:**
- Title: "Email Templates"
- Subtitle: "Create and edit payment reminder email templates"
- Button: "+ New Template" (primary)

**System Templates section:**
- Subtitle: "These are default templates provided by [App]. You can customize them but cannot delete."
- Template cards (list, not grid):
  Each: Name, description, Key (monospace), Subject (bold), Edit + Preview buttons

System templates:
1. Due in 3 Days — default_due_3_days_before
2. Due Today — default_due_on_date
3. Manual Follow-up — manual_followup_generic
4. Overdue – 7 Days — default_overdue_7_days

**Custom Templates section:**
- Empty state: dashed border card, icon, "No custom templates yet", "Create First Template" button

**Template Preview modal:**
- Title: "Template Preview"
- Subject Template (read-only input)
- Body Template Preview (read-only textarea)
- Helper text about using invoice page for real preview
- × close button

---

### 5.21 EDIT EMAIL TEMPLATE (/reminders/templates/[id]/edit)

**Header:** "← Back to Templates" (goes to /reminders/templates, NOT /reminders)
**Title:** "Edit Template" | Subtitle: "Modify your email template"

**Form sections:**

*Template Name* (text input)
*Template Key* (text input, read-only if system) + helper
*Description* (textarea)

*Email Subject* (text input) + helper "Supports placeholders like {{invoice_number}}"

*Email Body* (large textarea, HTML) + helper "HTML email body. Can contain placeholders."

**Available Placeholders (2-col blue links):**
```
{{user_name}}           {{brand_name}}
{{invoice_number}}      {{invoice_amount}}
{{invoice_balance}}     {{due_date}}
{{client_name}}         {{client_company}}
{{days_overdue}}        {{payment_link}}
{{invoice_link}}        {{support_email}}
{{site_url}}            {{today_date}}
```

**Tips for Great Templates (green card):**
- Use professional, polite tone
- Include clear CTA button with payment link
- Keep emails mobile-friendly
- Use HTML for formatting — support inline CSS
- Include contact info for support requests
- Add unsubscribe note for CAN-SPAM compliance

**Buttons:**
- "Update Template" (primary) | "Cancel"

---

### 5.22 REMINDER AUTOMATION SETTINGS (/reminders/settings)

**Header:**
- Title: "Reminder Automation Settings"
- Subtitle: "Configure when payment reminders are automatically sent"

**Cards:**

1. *Enable automated payment reminders* (checkbox toggle)
   - When enabled, reminders sent automatically per schedule

2. *Send Reminders Before Due Date*
   - Days before due date (JSON array input): `[3,1]`
   - Helper: "Enter as JSON array: [3,1] = send reminders 3 days and 1 day before due date"

3. *Send reminder on due date* (checkbox)
   - "Send a reminder on the day the invoice is due"

4. *Send Reminders After Overdue*
   - Days after overdue (JSON array input): `[3,7,14]`
   - Helper text

5. *Limit Reminders Per Invoice*
   - Maximum reminders per invoice (number, default 5)
   - Helper: "Default: 5 reminders. Prevents excessive emails."

6. *Skip Small Balances*
   - "Skip if remaining balance ≤ $" (number input, default 10.00)
   - Helper: "Default: $10.00. Useful for skipping reminders on nearly-paid invoices."

**Buttons:** "Save Settings" (primary) | "Cancel"

**How Automated Reminders Work (blue card, bottom):**
- Reminders processed daily (recommended: 9 AM in your timezone)
- Each client receives max 1 reminder per day
- Reminders respect your daily email limit (default: 20/day)
- Invoices below threshold are skipped
- Each invoice can receive up to max number
- Configure cron job to run: `0 9 * * * /usr/bin/php /path/to/cron/process_payment_reminders.php`

---

### 5.23 SETTINGS (/settings)

**Title:** "Settings"
**Left sidebar nav** (within settings page):
- Invoice Settings (link to /settings/invoice)
- Personal Information (anchor)

**Personal Information section:**
- Full Name* (text)
- Email Address* (email)
- Phone Number (text)

**Business Information:**
- Business Name (text) — "appears on invoices and contracts"
- Business Logo (file upload) — "JPG, PNG, GIF. Max 2MB. 400x400px"
- Address (textarea)
- City | State | Postal Code | Country (grid)
- Tax ID / VAT Number

**Default Settings:**
- Default Currency (dropdown)
- Default Tax Rate (%) (number)
- Timezone (dropdown)

**Buttons:** Cancel | "Save Settings" (primary)

**Account Information card:**
- Member since: [date]
- Last updated: [date]

---

### 5.24 INVOICE SETTINGS (/settings/invoice)

**Title:** "Invoice Settings"
**Subtitle:** "Customize how your invoices look and what information they display"

**Invoice Theme (3 cards):**
- Aurora — "Modern gradient design"
- Summit — "Clean minimalist style" (may be selected)
- Ledger — "Classic accounting style"
Each is selectable (radio-style cards)

**Brand Colors:**
- Primary Color (color picker + hex input, default #4F46E5)
- Secondary Color (color picker + hex input, default #0F172A)

**Brand Information:**
- Brand Name (text) — "Leave blank to use your business name"
- Brand Logo (file upload)
- Brand Address (textarea)
- Phone Number | Website | Tax ID/EIN (text inputs)

**Buttons:** "Save Invoice Settings" (primary)

**Live Preview (right col):**
- Mini invoice preview showing current settings applied
- Shows: brand name, address, "INVOICE #12345", sample line item, total

---

### 5.25 FEEDBACK (/feedback)

**Title:** "Send Feedback"
**Subtitle:** "Help us improve [App] by sharing your thoughts"

**Form:**
- Feedback type* (dropdown): Bug Report, Feature Request, General Feedback, Other
- Message* (textarea, min 10 chars, max 2000)
- Character counter: "0 / 2000"

**Buttons:** "Submit Feedback" (primary) | "Cancel"

**Info card:**
- "Your feedback helps us improve"
- "We review all submissions and use them to make [App] better for everyone."
- "You can submit up to 3 feedback messages per day."

---

## 6. COMPONENTS LIST

### Layout
- `AppLayout` — sidebar + topbar wrapper
- `Sidebar` — nav with sections
- `Topbar` — logo, plan badge, user menu
- `PageHeader` — title + subtitle + action button

### UI Primitives
- `Button` — variants: primary, secondary, ghost, danger, success
- `Badge` — variants per status
- `Input` — text, number, email, password
- `Textarea`
- `Select` / `Dropdown`
- `Checkbox`
- `RadioGroup`
- `DatePicker`
- `ColorPicker`
- `FileUpload` (drag-drop zone)
- `Modal` / `Dialog`
- `Toast` / `Alert`
- `Tooltip`
- `Card`
- `Table` (sortable headers)
- `EmptyState`
- `LoadingSpinner`
- `Breadcrumb` ("← Back to X")

### Feature Components
- `StatCard` — dashboard metric cards
- `InvoiceCard` — recent invoice preview
- `ContractCard` — recent contract preview
- `TemplateCard` — contract template card
- `ClientRow` — table row for clients
- `InvoiceRow` — table row for invoices
- `ContractRow` — table row for contracts
- `ActivityRow` — table row for client activity
- `ReminderRow` — table row for reminders
- `InvoiceItemRow` — line item in invoice form
- `PaymentForm` — record payment section
- `DropZone` — file upload area
- `TemplatePreviewModal`
- `ConfirmDialog` — replaces window.confirm() (modern)
- `PlanBadge`
- `TrialBanner`
- `InvoicePreview` — live preview for invoice settings
- `PlaceholderGrid` — shows available template variables
- `StatusLegend`

---

## 7. DATA MODELS

```typescript
// User / Account
interface User {
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
  plan: 'trial' | 'pro' | 'free'
  trialEndsAt?: Date
  createdAt: Date
}

// Client
interface Client {
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
}

// Contract Template
interface ContractTemplate {
  id: string
  userId?: string          // null = global/system template
  name: string
  description?: string
  content: string          // markdown-like text with {{placeholders}}
  isDefault: boolean
  isGlobal: boolean        // true = system template, read-only
  createdAt: Date
}

// Contract
interface Contract {
  id: string
  userId: string
  clientId: string
  templateId?: string
  title: string
  projectDescription: string
  amount: number
  currency: string
  paymentTerms: string
  startDate: Date
  endDate?: Date
  additionalTerms?: string
  status: 'draft' | 'sent' | 'opened' | 'signed'
  signedAt?: Date
  openCount: number
  lastOpenedAt?: Date
  createdAt: Date
  updatedAt: Date
}

// Invoice Item
interface InvoiceItem {
  id: string
  description: string
  quantity: number
  unitPrice: number
  amount: number
}

// Invoice
interface Invoice {
  id: string
  userId: string
  clientId: string
  invoiceNumber: string    // INV-YYYY-NNNN
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
  status: 'draft' | 'sent' | 'partial' | 'paid' | 'overdue'
  paidAmount: number
  createdAt: Date
  updatedAt: Date
}

// Payment
interface Payment {
  id: string
  invoiceId: string
  amount: number
  paymentDate: Date
  method: 'bank_transfer' | 'credit_card' | 'cash' | 'paypal' | 'check' | 'other'
  notes?: string
  createdAt: Date
}

// Email Template
interface EmailTemplate {
  id: string
  userId?: string
  name: string
  key: string              // e.g. default_due_3_days_before
  description?: string
  subject: string
  body: string             // HTML with {{placeholders}}
  isSystem: boolean        // true = cannot delete
  createdAt: Date
}

// Reminder Log
interface ReminderLog {
  id: string
  invoiceId: string
  clientId: string
  recipientEmail: string
  templateKey: string
  status: 'sent' | 'failed'
  sentAt: Date
}

// Reminder Settings
interface ReminderSettings {
  userId: string
  enabled: boolean
  daysBefore: number[]     // e.g. [3, 1]
  sendOnDueDate: boolean
  daysAfterOverdue: number[] // e.g. [3, 7, 14]
  maxRemindersPerInvoice: number
  skipBelowBalance: number
}

// Invoice Settings
interface InvoiceSettings {
  userId: string
  theme: 'aurora' | 'summit' | 'ledger'
  primaryColor: string
  secondaryColor: string
  brandName?: string
  brandLogo?: string
  brandAddress?: string
  phone?: string
  website?: string
  taxId?: string
}

// Feedback
interface Feedback {
  id: string
  userId: string
  type: 'bug' | 'feature' | 'general' | 'other'
  message: string
  createdAt: Date
}
```

---

## 8. STATE MANAGEMENT

Use React Context or Zustand. Suggested stores:

- `authStore` — user session, plan, trial days
- `clientsStore` — clients list, selected client
- `contractsStore` — contracts list, templates
- `invoicesStore` — invoices list, payments
- `uiStore` — sidebar open, modals, toasts

---

## 9. KNOWN BUGS TO FIX IN YOUR VERSION

1. **Back button on /contracts/new from client page** — should go back to /clients/[id], not /contracts. Fix: pass `?returnTo=/clients/[id]` in URL and use router.back() or read the param.

2. **Same issue on /invoices/new from client page** — same fix.

3. **window.confirm() dialogs** — replace all with a proper ConfirmDialog modal component.

4. **window.confirm() on "Send Invoice to Client"** — replace with a proper modal.

5. **No logout confirmation** — add a confirm dialog before logging out.

6. **Session timeout (30 min)** — implement proper token refresh or warn user before expiry.

7. **App crashes on rapid navigation** — proper loading states, error boundaries, and suspense.

8. **Cookie duration too short** — set appropriate session duration (7-30 days with remember me).

---

## 10. NAVIGATION FLOWS (User Journeys)

### Create a contract from a client profile:
1. /clients → click client name → /clients/38
2. Click "+ New Contract" → /contracts/new?clientId=38&returnTo=/clients/38
3. Client dropdown pre-selected with this client
4. Fill form → "Preview Contract" → /contracts/[id]
5. Back button → /clients/38 ✓

### Invoice workflow:
1. /invoices/new → fill form → "Save & Mark as Sent"
2. → /invoices/[id] with success toast
3. Click "Send Invoice to Client" → ConfirmDialog (not window.confirm)
4. → Email sent → toast confirmation
5. Click "Record Payment" → fill form → save
6. Status updates: Sent → Partial or Paid

### Reminder workflow:
1. /reminders — overview
2. Click "Email Templates" card → /reminders/templates
3. Click "Edit" on a template → /reminders/templates/[id]/edit
4. Back button → /reminders/templates (not /reminders)
5. Click "Automation Settings" card → /reminders/settings
6. Toggle on → set schedule → Save Settings

---

## 11. TECH STACK RECOMMENDATION

```
Framework:        Next.js 14 (App Router)
Styling:          Tailwind CSS
UI Components:    shadcn/ui (built on Radix UI)
Icons:            Lucide React
Forms:            React Hook Form + Zod validation
State:            Zustand or React Context
Database:         Supabase (PostgreSQL + Auth + Storage)
Email:            Resend or Nodemailer
PDF generation:   Puppeteer or react-pdf
File export:      ExcelJS + JSZip
Payments:         LemonSqueezy (lifetime deal)
Hosting:          Vercel
```

---

## 12. FILE STRUCTURE

```
src/
├── app/
│   ├── (auth)/
│   │   ├── login/page.tsx
│   │   └── signup/page.tsx
│   ├── (dashboard)/
│   │   ├── layout.tsx              ← AppLayout wrapper
│   │   ├── dashboard/page.tsx
│   │   ├── clients/
│   │   │   ├── page.tsx
│   │   │   ├── new/page.tsx
│   │   │   └── [id]/
│   │   │       ├── page.tsx
│   │   │       └── edit/page.tsx
│   │   ├── contracts/
│   │   │   ├── page.tsx
│   │   │   ├── new/page.tsx
│   │   │   ├── [id]/page.tsx
│   │   │   └── templates/
│   │   │       ├── page.tsx
│   │   │       ├── new/page.tsx
│   │   │       └── [id]/edit/page.tsx
│   │   ├── invoices/
│   │   │   ├── page.tsx
│   │   │   ├── new/page.tsx
│   │   │   └── [id]/page.tsx
│   │   ├── client-activity/page.tsx
│   │   ├── imports/page.tsx
│   │   ├── exports/page.tsx
│   │   ├── reminders/
│   │   │   ├── page.tsx
│   │   │   ├── settings/page.tsx
│   │   │   └── templates/
│   │   │       ├── page.tsx
│   │   │       ├── new/page.tsx
│   │   │       └── [id]/edit/page.tsx
│   │   ├── settings/
│   │   │   ├── page.tsx
│   │   │   └── invoice/page.tsx
│   │   └── feedback/page.tsx
│   ├── layout.tsx                  ← Root layout
│   └── page.tsx                    ← Landing page
├── components/
│   ├── layout/
│   │   ├── AppLayout.tsx
│   │   ├── Sidebar.tsx
│   │   └── Topbar.tsx
│   ├── ui/
│   │   ├── Button.tsx
│   │   ├── Badge.tsx
│   │   ├── Input.tsx
│   │   ├── Textarea.tsx
│   │   ├── Select.tsx
│   │   ├── Modal.tsx
│   │   ├── ConfirmDialog.tsx
│   │   ├── Toast.tsx
│   │   ├── Card.tsx
│   │   ├── Table.tsx
│   │   ├── EmptyState.tsx
│   │   ├── DropZone.tsx
│   │   ├── ColorPicker.tsx
│   │   └── PageHeader.tsx
│   ├── dashboard/
│   │   ├── StatCard.tsx
│   │   ├── TrialBanner.tsx
│   │   └── QuickActions.tsx
│   ├── clients/
│   │   ├── ClientForm.tsx
│   │   └── ClientTable.tsx
│   ├── contracts/
│   │   ├── ContractForm.tsx
│   │   ├── TemplateCard.tsx
│   │   └── PlaceholderGrid.tsx
│   ├── invoices/
│   │   ├── InvoiceForm.tsx
│   │   ├── InvoiceItemRow.tsx
│   │   ├── InvoiceDetail.tsx
│   │   └── PaymentForm.tsx
│   └── reminders/
│       ├── ReminderSettings.tsx
│       └── EmailTemplateForm.tsx
├── lib/
│   ├── theme.ts                    ← All colors/tokens
│   ├── constants.ts                ← Sidebar nav, currencies, etc.
│   ├── utils.ts                    ← cn(), formatCurrency(), etc.
│   ├── validations.ts              ← Zod schemas
│   └── supabase.ts                 ← Supabase client
├── hooks/
│   ├── useClients.ts
│   ├── useContracts.ts
│   ├── useInvoices.ts
│   ├── useToast.ts
│   └── useConfirm.ts
└── types/
    └── index.ts                    ← All TypeScript interfaces
```
