PRAGMA foreign_keys = ON;

CREATE TABLE IF NOT EXISTS profiles (
  id TEXT PRIMARY KEY,
  email TEXT NOT NULL UNIQUE,
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
  default_tax_rate REAL DEFAULT 0,
  timezone TEXT DEFAULT 'UTC',
  profession TEXT CHECK (
    profession IN (
      'web_developer',
      'photographer',
      'consultant',
      'designer',
      'copywriter',
      'marketer',
      'other'
    )
  ),
  onboarding_complete INTEGER DEFAULT 0,
  plan TEXT DEFAULT 'free' CHECK (plan IN ('free','pro_monthly','pro_annual','lifetime')),
  plan_expires_at TEXT,
  lemon_squeezy_customer_id TEXT,
  docs_used_this_month INTEGER DEFAULT 0,
  docs_reset_at TEXT DEFAULT CURRENT_TIMESTAMP,
  created_at TEXT DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS clients (
  id TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(16)))),
  user_id TEXT NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  email TEXT,
  phone TEXT,
  company TEXT,
  address TEXT,
  notes TEXT,
  created_at TEXT DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX IF NOT EXISTS idx_clients_user_id ON clients(user_id);

CREATE TABLE IF NOT EXISTS contract_templates (
  id TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(16)))),
  user_id TEXT REFERENCES profiles(id) ON DELETE CASCADE,
  profession TEXT,
  name TEXT NOT NULL,
  description TEXT,
  content TEXT NOT NULL DEFAULT '',
  is_default INTEGER DEFAULT 0,
  is_global INTEGER DEFAULT 0,
  created_at TEXT DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS contracts (
  id TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(16)))),
  user_id TEXT NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  client_id TEXT NOT NULL REFERENCES clients(id) ON DELETE RESTRICT,
  template_id TEXT REFERENCES contract_templates(id) ON DELETE SET NULL,
  title TEXT NOT NULL,
  project_description TEXT,
  amount REAL NOT NULL DEFAULT 0,
  currency TEXT DEFAULT 'USD',
  payment_terms TEXT,
  start_date TEXT,
  end_date TEXT,
  additional_terms TEXT,
  status TEXT DEFAULT 'draft' CHECK (status IN ('draft','sent','opened','signed')),
  signed_at TEXT,
  open_count INTEGER DEFAULT 0,
  last_opened_at TEXT,
  has_branding_footer INTEGER DEFAULT 1,
  document_hash TEXT,
  signed_pdf_url TEXT,
  audit_pdf_url TEXT,
  created_at TEXT DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX IF NOT EXISTS idx_contracts_user_id ON contracts(user_id);
CREATE INDEX IF NOT EXISTS idx_contracts_client_id ON contracts(client_id);

CREATE TABLE IF NOT EXISTS invoices (
  id TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(16)))),
  user_id TEXT NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  client_id TEXT NOT NULL REFERENCES clients(id) ON DELETE RESTRICT,
  invoice_number TEXT NOT NULL,
  invoice_date TEXT NOT NULL,
  due_date TEXT,
  currency TEXT DEFAULT 'USD',
  items TEXT DEFAULT '[]',
  subtotal REAL DEFAULT 0,
  tax_rate REAL DEFAULT 0,
  tax_amount REAL DEFAULT 0,
  discount_amount REAL DEFAULT 0,
  total REAL DEFAULT 0,
  notes TEXT,
  payment_terms TEXT,
  status TEXT DEFAULT 'draft' CHECK (status IN ('draft','sent','partial','paid','overdue')),
  paid_amount REAL DEFAULT 0,
  has_branding_footer INTEGER DEFAULT 1,
  invoice_template_id TEXT REFERENCES invoice_templates(id) ON DELETE SET NULL,
  share_token TEXT DEFAULT (lower(hex(randomblob(16)))),
  open_count INTEGER DEFAULT 0,
  last_opened_at TEXT,
  created_at TEXT DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(user_id, invoice_number)
);
CREATE INDEX IF NOT EXISTS idx_invoices_user_id ON invoices(user_id);
CREATE INDEX IF NOT EXISTS idx_invoices_client_id ON invoices(client_id);
CREATE INDEX IF NOT EXISTS idx_invoices_share_token ON invoices(share_token);

CREATE TABLE IF NOT EXISTS payments (
  id TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(16)))),
  invoice_id TEXT NOT NULL REFERENCES invoices(id) ON DELETE CASCADE,
  amount REAL NOT NULL,
  payment_date TEXT NOT NULL,
  method TEXT NOT NULL CHECK (method IN ('bank_transfer','credit_card','cash','paypal','check','other')),
  notes TEXT,
  created_at TEXT DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX IF NOT EXISTS idx_payments_invoice_id ON payments(invoice_id);

CREATE TABLE IF NOT EXISTS email_templates (
  id TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(16)))),
  user_id TEXT REFERENCES profiles(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  key TEXT NOT NULL,
  description TEXT,
  subject TEXT NOT NULL,
  body TEXT NOT NULL,
  is_system INTEGER DEFAULT 0,
  created_at TEXT DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS reminder_logs (
  id TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(16)))),
  invoice_id TEXT REFERENCES invoices(id) ON DELETE CASCADE,
  client_id TEXT REFERENCES clients(id) ON DELETE SET NULL,
  recipient_email TEXT,
  template_key TEXT,
  status TEXT DEFAULT 'sent' CHECK (status IN ('sent','failed')),
  sent_at TEXT DEFAULT CURRENT_TIMESTAMP,
  opened_at TEXT,
  open_count INTEGER DEFAULT 0
);

CREATE TABLE IF NOT EXISTS reminder_settings (
  user_id TEXT PRIMARY KEY REFERENCES profiles(id) ON DELETE CASCADE,
  enabled INTEGER DEFAULT 1,
  days_before TEXT DEFAULT '[3,1]',
  send_on_due_date INTEGER DEFAULT 1,
  days_after_overdue TEXT DEFAULT '[3,7,14]',
  max_reminders_per_invoice INTEGER DEFAULT 5,
  skip_below_balance REAL DEFAULT 10
);

CREATE TABLE IF NOT EXISTS invoice_templates (
  id TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(16)))),
  user_id TEXT NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  theme TEXT DEFAULT 'summit' CHECK (theme IN ('aurora','summit','ledger')),
  primary_color TEXT DEFAULT '#0F766E',
  secondary_color TEXT DEFAULT '#111827',
  logo_url TEXT,
  brand_name TEXT,
  brand_address TEXT,
  phone TEXT,
  website TEXT,
  tax_id TEXT,
  default_notes TEXT,
  default_payment_terms TEXT,
  default_tax_rate REAL DEFAULT 0,
  is_default INTEGER DEFAULT 0,
  created_at TEXT DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS line_item_presets (
  id TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(16)))),
  profession TEXT NOT NULL,
  label TEXT NOT NULL,
  description TEXT,
  default_rate REAL,
  is_global INTEGER DEFAULT 1,
  sort_order INTEGER DEFAULT 0,
  UNIQUE(profession, label)
);

CREATE TABLE IF NOT EXISTS signing_sessions (
  id TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(16)))),
  contract_id TEXT NOT NULL REFERENCES contracts(id) ON DELETE CASCADE,
  signer_email TEXT NOT NULL,
  signer_name TEXT,
  unique_token TEXT DEFAULT (lower(hex(randomblob(16)))) NOT NULL UNIQUE,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending','viewed','signed','declined')),
  created_at TEXT DEFAULT CURRENT_TIMESTAMP,
  signed_at TEXT,
  document_hash TEXT
);

CREATE TABLE IF NOT EXISTS audit_events (
  id TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(16)))),
  contract_id TEXT REFERENCES contracts(id) ON DELETE CASCADE,
  signing_session_id TEXT REFERENCES signing_sessions(id) ON DELETE CASCADE,
  event_type TEXT NOT NULL CHECK (
    event_type IN ('created','sent','viewed','consent_given','signed','downloaded')
  ),
  signer_name TEXT,
  signer_email TEXT,
  ip_address TEXT,
  user_agent TEXT,
  timestamp TEXT DEFAULT CURRENT_TIMESTAMP,
  metadata TEXT DEFAULT '{}'
);

INSERT OR IGNORE INTO profiles (
  id,
  email,
  full_name,
  business_name,
  profession,
  onboarding_complete,
  plan,
  docs_used_this_month
) VALUES (
  'local-user',
  'demo@filecurrent.local',
  'Demo User',
  'FileCurrent Demo',
  'web_developer',
  0,
  'free',
  2
);

INSERT OR IGNORE INTO reminder_settings (user_id) VALUES ('local-user');

-- Global contract templates (system-level, is_global=1, user_id=NULL)
INSERT OR IGNORE INTO contract_templates (id, user_id, profession, name, description, content, is_default, is_global) VALUES
('tmpl-standard', NULL, NULL, 'Standard Service Agreement', 'General freelance services contract suitable for most projects',
'**STANDARD SERVICE AGREEMENT**

This Service Agreement ("Agreement") is entered into as of **{{start_date}}** by and between:

**SERVICE PROVIDER:**
{{freelancer_name}}
{{freelancer_business}}

**CLIENT:**
{{client_name}}
{{client_company}}
Contact Email: {{client_email}}

---

## 1. Scope of Work

{{project_description}}

## 2. Compensation

The Client agrees to pay a total fee of {{currency}} {{rate}}.

## 3. Payment Terms

{{payment_terms}}

## 4. Project Timeline

Start Date: {{start_date}}
Expected Completion: {{end_date}}

## 5. Intellectual Property Rights

Upon receipt of full payment, all rights transfer to the Client.

## 6. Confidentiality

Both Parties agree to protect confidential information.

## 7. Termination

Either Party may terminate with 14 days written notice.

---

**SERVICE PROVIDER SIGNATURE:**
Name: {{freelancer_name}}

**CLIENT SIGNATURE:**
Name: {{client_name}}', 1, 1),

('tmpl-webdev', NULL, 'web_developer', 'Web Development Agreement', 'Specialized contract for website and web application projects',
'**WEB DEVELOPMENT AGREEMENT**

This Agreement is entered into as of **{{start_date}}** by and between:

**DEVELOPER:**
{{freelancer_name}}
{{freelancer_business}}

**CLIENT:**
{{client_name}}
{{client_company}}
Email: {{client_email}}

---

## 1. Project Description

{{project_description}}

## 2. Development Timeline

Start Date: {{start_date}}
Expected Completion: {{end_date}}

## 3. Project Fee

Total fee: {{currency}} {{rate}}

## 4. Payment Schedule

{{payment_terms}}

## 5. Revisions

Includes up to 3 rounds of revisions.

## 6. Intellectual Property

Upon full payment, all rights transfer to the Client.

## 7. Warranty

30-day warranty for bugs in delivered code.

---

**DEVELOPER SIGNATURE:**
Name: {{freelancer_name}}

**CLIENT SIGNATURE:**
Name: {{client_name}}', 0, 1),

('tmpl-photography', NULL, 'photographer', 'Photography Services Agreement', 'Contract for corporate and commercial photography services',
'**PHOTOGRAPHY SERVICES AGREEMENT**

This Agreement is entered into as of **{{start_date}}** by and between:

**PHOTOGRAPHER:**
{{freelancer_name}}
{{freelancer_business}}

**CLIENT:**
{{client_name}}
{{client_company}}
Email: {{client_email}}

---

## 1. Scope of Services

{{project_description}}

## 2. Project Schedule

Start Date: {{start_date}}
End Date: {{end_date}}

## 3. Fees

Total fee: {{currency}} {{rate}}

## 4. Payment Terms

{{payment_terms}}

## 5. Deliverables

Final edited images in high-resolution digital format.

## 6. Copyright & Usage Rights

The Photographer retains copyright. Upon full payment, Client receives a non-exclusive license for business use.

## 7. Cancellation

- More than 48 hours before shoot: no penalty
- Within 48 hours: up to 50% fee
- Same-day: up to 100% fee

---

**PHOTOGRAPHER SIGNATURE:**
Name: {{freelancer_name}}

**CLIENT SIGNATURE:**
Name: {{client_name}}', 0, 1),

('tmpl-consulting', NULL, 'consultant', 'Consulting Services Agreement', 'Professional consulting agreement for advisory and strategic services',
'**CONSULTING SERVICES AGREEMENT**

This Agreement is entered into as of **{{start_date}}** by and between:

**CONSULTANT:**
{{freelancer_name}}
{{freelancer_business}}

**CLIENT:**
{{client_name}}
{{client_company}}
Contact Email: {{client_email}}

---

## 1. Consulting Services

{{project_description}}

## 2. Term

From {{start_date}} to {{end_date}}.

## 3. Compensation

{{currency}} {{rate}}

## 4. Payment Terms

{{payment_terms}}

## 5. Independent Contractor

The Consultant is an independent contractor, not an employee.

## 6. Confidentiality

The Consultant agrees to maintain strict confidentiality of all business information.

---

**CONSULTANT SIGNATURE:**
Name: {{freelancer_name}}

**CLIENT SIGNATURE:**
Name: {{client_name}}', 0, 1),

('tmpl-design', NULL, 'designer', 'Design Services Agreement', 'Contract for graphic design, branding, and creative services',
'**DESIGN SERVICES AGREEMENT**

This Agreement is entered into as of **{{start_date}}** by and between:

**DESIGNER:**
{{freelancer_name}}
{{freelancer_business}}

**CLIENT:**
{{client_name}}
{{client_company}}
Email: {{client_email}}

---

## 1. Project Scope

{{project_description}}

## 2. Project Schedule

Start Date: {{start_date}}
Completion Date: {{end_date}}

## 3. Project Fee

{{currency}} {{rate}}

## 4. Payment Schedule

{{payment_terms}}

## 5. Revision Rounds

Includes up to 3 rounds of revisions.

## 6. Copyright

Upon full payment, Client receives exclusive rights to final approved designs.

---

**DESIGNER SIGNATURE:**
Name: {{freelancer_name}}

**CLIENT SIGNATURE:**
Name: {{client_name}}', 0, 1),

('tmpl-copywriting', NULL, 'copywriter', 'Content Writing Agreement', 'Contract for blog posts, articles, copywriting, and content creation',
'**CONTENT WRITING AGREEMENT**

This Agreement is entered into as of **{{start_date}}** by and between:

**WRITER:**
{{freelancer_name}}
{{freelancer_business}}

**CLIENT:**
{{client_name}}
{{client_company}}
Contact Email: {{client_email}}

---

## 1. Content Deliverables

{{project_description}}

## 2. Project Timeline

Start Date: {{start_date}}
Deadline: {{end_date}}

## 3. Compensation

{{currency}} {{rate}}

## 4. Payment Terms

{{payment_terms}}

## 5. Revisions

Includes up to 2 rounds of revisions per content piece.

## 6. Copyright

Upon full payment, all rights transfer to the Client.

## 7. Kill Fee

If cancelled after work has commenced: 50% of total fee.

---

**WRITER SIGNATURE:**
Name: {{freelancer_name}}

**CLIENT SIGNATURE:**
Name: {{client_name}}', 0, 1),

('tmpl-marketing', NULL, 'marketer', 'Marketing Services Agreement', 'Contract for digital marketing, campaigns, and strategy services',
'**MARKETING SERVICES AGREEMENT**

This Agreement is entered into as of **{{start_date}}** by and between:

**MARKETER:**
{{freelancer_name}}
{{freelancer_business}}

**CLIENT:**
{{client_name}}
{{client_company}}
Email: {{client_email}}

---

## 1. Scope of Services

{{project_description}}

## 2. Project Timeline

Start Date: {{start_date}}
End Date: {{end_date}}

## 3. Compensation

{{currency}} {{rate}}

## 4. Payment Terms

{{payment_terms}}

## 5. Reporting

Regular progress reports will be provided as agreed.

## 6. Confidentiality

All client data and strategies are confidential.

---

**MARKETER SIGNATURE:**
Name: {{freelancer_name}}

**CLIENT SIGNATURE:**
Name: {{client_name}}', 0, 1);

INSERT OR IGNORE INTO invoice_templates (
  user_id,
  name,
  description,
  brand_name,
  is_default
) VALUES (
  'local-user',
  'Default',
  'Default FileCurrent invoice template',
  'FileCurrent Demo',
  1
);

INSERT OR IGNORE INTO line_item_presets (profession, label, description, default_rate, sort_order) VALUES
  ('web_developer', 'Discovery & Planning', 'Requirements gathering and project scoping', NULL, 1),
  ('web_developer', 'UI/UX Design', 'Wireframes, mockups, and design system', NULL, 2),
  ('web_developer', 'Frontend Development', 'HTML, CSS, JavaScript implementation', NULL, 3),
  ('web_developer', 'Backend Development', 'Server-side logic, APIs, database', NULL, 4),
  ('web_developer', 'API Integration', 'Third-party API setup and integration', NULL, 5),
  ('web_developer', 'Revision Round', 'Feedback incorporation and revisions', NULL, 6),
  ('web_developer', 'Hosting Setup', 'Domain, server, and deployment configuration', NULL, 7),
  ('web_developer', 'Maintenance Retainer', 'Ongoing monthly support and updates', NULL, 8),
  ('photographer', 'Full Day Coverage', 'Up to 8 hours on-location photography', NULL, 1),
  ('photographer', 'Half Day Coverage', 'Up to 4 hours on-location photography', NULL, 2),
  ('photographer', 'Second Shooter', 'Additional photographer for event coverage', NULL, 3),
  ('photographer', 'Photo Editing', 'Post-processing and color grading', NULL, 4),
  ('photographer', 'Album Design', 'Premium print album design and layout', NULL, 5),
  ('photographer', 'Print Products', 'Prints, canvases, or other physical products', NULL, 6),
  ('photographer', 'Rush Delivery', 'Expedited turnaround surcharge', NULL, 7),
  ('consultant', 'Strategy Session', 'Focused consulting session (per hour)', NULL, 1),
  ('consultant', 'Research & Analysis', 'Market research or data analysis', NULL, 2),
  ('consultant', 'Report Writing', 'Deliverable document preparation', NULL, 3),
  ('consultant', 'Presentation Design', 'Slide deck creation and design', NULL, 4),
  ('consultant', 'Implementation Support', 'Hands-on guidance during execution', NULL, 5),
  ('designer', 'Brand Identity', 'Logo, colors, typography system', NULL, 1),
  ('designer', 'UI Design', 'Screen design and component system', NULL, 2),
  ('designer', 'Print Design', 'Business cards, brochures, signage', NULL, 3),
  ('designer', 'Social Media Kit', 'Templates for social platforms', NULL, 4),
  ('designer', 'Revision Round', 'Design feedback and revisions', NULL, 5),
  ('copywriter', 'Website Copy', 'Page-by-page website copywriting', NULL, 1),
  ('copywriter', 'Blog Article', 'SEO-optimized blog post', NULL, 2),
  ('copywriter', 'Email Sequence', 'Automated email campaign copy', NULL, 3),
  ('copywriter', 'Ad Copy', 'Paid advertising copy variants', NULL, 4),
  ('copywriter', 'Brand Voice Guide', 'Tone of voice documentation', NULL, 5),
  ('marketer', 'Strategy Development', 'Marketing strategy and roadmap', NULL, 1),
  ('marketer', 'Campaign Management', 'Paid or organic campaign management', NULL, 2),
  ('marketer', 'Content Creation', 'Written or visual content production', NULL, 3),
  ('marketer', 'Analytics Report', 'Performance reporting and insights', NULL, 4),
  ('marketer', 'SEO Audit', 'Technical and content SEO review', NULL, 5),
  ('other', 'Service Fee', 'Professional service', NULL, 1),
  ('other', 'Consultation', 'Advisory session', NULL, 2),
  ('other', 'Revision', 'Revision and feedback round', NULL, 3);
