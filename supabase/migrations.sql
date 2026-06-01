-- Run this in Supabase SQL Editor AFTER the base schema.sql
-- Adds missing tables and columns needed by the full sqlite.ts feature set

-- Add missing columns to profiles
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS email TEXT;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS profession TEXT CHECK (
  profession IN ('web_developer','photographer','consultant','designer','copywriter','marketer','other')
);
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS onboarding_complete BOOLEAN DEFAULT FALSE;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS plan TEXT DEFAULT 'free' CHECK (
  plan IN ('free','pro_monthly','pro_annual','lifetime')
);
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS plan_expires_at TIMESTAMPTZ;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS lemon_squeezy_customer_id TEXT;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS docs_used_this_month INTEGER DEFAULT 0;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS docs_reset_at TIMESTAMPTZ DEFAULT NOW();
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS notification_prefs JSONB DEFAULT '{}';

-- Drop the old plan column constraint if it exists and re-add
-- (safe to run — will fail silently if already correct)

-- Add profession column to contract_templates
ALTER TABLE contract_templates ADD COLUMN IF NOT EXISTS profession TEXT;
ALTER TABLE contract_templates ADD COLUMN IF NOT EXISTS is_global BOOLEAN DEFAULT FALSE;

-- Invoice templates table (not in base schema)
CREATE TABLE IF NOT EXISTS invoice_templates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users ON DELETE CASCADE NOT NULL,
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
  default_tax_rate DECIMAL(5,2) DEFAULT 0,
  is_default BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_invoice_templates_user_id ON invoice_templates(user_id);

-- Line item presets
CREATE TABLE IF NOT EXISTS line_item_presets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  profession TEXT NOT NULL,
  label TEXT NOT NULL,
  description TEXT,
  default_rate DECIMAL(12,2),
  is_global BOOLEAN DEFAULT TRUE,
  sort_order INTEGER DEFAULT 0,
  UNIQUE(profession, label)
);

-- Signing sessions
CREATE TABLE IF NOT EXISTS signing_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  contract_id UUID REFERENCES contracts ON DELETE CASCADE NOT NULL,
  signer_email TEXT NOT NULL,
  signer_name TEXT,
  unique_token TEXT DEFAULT encode(gen_random_bytes(16), 'hex') NOT NULL UNIQUE,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending','viewed','signed','declined')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  signed_at TIMESTAMPTZ,
  document_hash TEXT
);
CREATE INDEX IF NOT EXISTS idx_signing_sessions_token ON signing_sessions(unique_token);
CREATE INDEX IF NOT EXISTS idx_signing_sessions_contract ON signing_sessions(contract_id);

-- Audit events
CREATE TABLE IF NOT EXISTS audit_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  contract_id UUID REFERENCES contracts ON DELETE CASCADE,
  signing_session_id UUID REFERENCES signing_sessions ON DELETE CASCADE,
  event_type TEXT NOT NULL CHECK (
    event_type IN ('created','sent','viewed','consent_given','signed','downloaded')
  ),
  signer_name TEXT,
  signer_email TEXT,
  ip_address TEXT,
  user_agent TEXT,
  timestamp TIMESTAMPTZ DEFAULT NOW(),
  metadata JSONB DEFAULT '{}'
);
CREATE INDEX IF NOT EXISTS idx_audit_events_contract ON audit_events(contract_id);

-- Add missing columns to contracts
ALTER TABLE contracts ADD COLUMN IF NOT EXISTS has_branding_footer BOOLEAN DEFAULT TRUE;
ALTER TABLE contracts ADD COLUMN IF NOT EXISTS document_hash TEXT;
ALTER TABLE contracts ADD COLUMN IF NOT EXISTS signed_pdf_url TEXT;
ALTER TABLE contracts ADD COLUMN IF NOT EXISTS audit_pdf_url TEXT;

-- Add missing columns to invoices
ALTER TABLE invoices ADD COLUMN IF NOT EXISTS invoice_template_id UUID REFERENCES invoice_templates ON DELETE SET NULL;
ALTER TABLE invoices ADD COLUMN IF NOT EXISTS share_token TEXT DEFAULT encode(gen_random_bytes(16), 'hex');
ALTER TABLE invoices ADD COLUMN IF NOT EXISTS open_count INTEGER DEFAULT 0;
ALTER TABLE invoices ADD COLUMN IF NOT EXISTS last_opened_at TIMESTAMPTZ;
ALTER TABLE invoices ADD COLUMN IF NOT EXISTS has_branding_footer BOOLEAN DEFAULT TRUE;
ALTER TABLE invoices ADD COLUMN IF NOT EXISTS deposit_amount DECIMAL(12,2) DEFAULT 0;

-- Add trigger_type and user_id to reminder_logs
ALTER TABLE reminder_logs ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES auth.users ON DELETE CASCADE;
ALTER TABLE reminder_logs ADD COLUMN IF NOT EXISTS trigger_type TEXT;
ALTER TABLE reminder_logs ADD COLUMN IF NOT EXISTS opened_at TIMESTAMPTZ;
ALTER TABLE reminder_logs ADD COLUMN IF NOT EXISTS open_count INTEGER DEFAULT 0;

-- Add auto_stop_on_paid and allow_unsubscribe to reminder_settings
ALTER TABLE reminder_settings ADD COLUMN IF NOT EXISTS auto_stop_on_paid BOOLEAN DEFAULT TRUE;
ALTER TABLE reminder_settings ADD COLUMN IF NOT EXISTS allow_unsubscribe BOOLEAN DEFAULT TRUE;

-- Reminder unsubscribes
CREATE TABLE IF NOT EXISTS reminder_unsubscribes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  client_email TEXT NOT NULL UNIQUE,
  unsubscribed_at TIMESTAMPTZ DEFAULT NOW()
);

-- RLS for new tables
ALTER TABLE invoice_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE signing_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE line_item_presets ENABLE ROW LEVEL SECURITY;
ALTER TABLE reminder_unsubscribes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "invoice_templates_own" ON invoice_templates FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "signing_sessions_own" ON signing_sessions FOR ALL USING (
  contract_id IN (SELECT id FROM contracts WHERE user_id = auth.uid())
);
CREATE POLICY "audit_events_own" ON audit_events FOR ALL USING (
  contract_id IN (SELECT id FROM contracts WHERE user_id = auth.uid())
);
CREATE POLICY "line_item_presets_read" ON line_item_presets FOR SELECT USING (TRUE);
CREATE POLICY "reminder_unsubscribes_service" ON reminder_unsubscribes FOR ALL USING (TRUE);

-- Update handle_new_user trigger to use new plan column
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, email, plan, docs_used_this_month)
  VALUES (
    new.id,
    new.raw_user_meta_data->>'full_name',
    new.email,
    'free',
    0
  )
  ON CONFLICT (id) DO NOTHING;

  INSERT INTO public.reminder_settings (user_id)
  VALUES (new.id)
  ON CONFLICT (user_id) DO NOTHING;

  INSERT INTO public.invoice_settings (user_id)
  VALUES (new.id)
  ON CONFLICT (user_id) DO NOTHING;

  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Global contract templates (seed data)
INSERT INTO contract_templates (user_id, profession, name, description, content, is_default, is_global) VALUES
(NULL, NULL, 'Standard Service Agreement', 'General freelance services contract suitable for most projects',
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
Name: {{client_name}}', TRUE, TRUE),

(NULL, 'web_developer', 'Web Development Agreement', 'Specialized contract for website and web application projects',
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
Name: {{client_name}}', FALSE, TRUE),

(NULL, 'photographer', 'Photography Services Agreement', 'Contract for corporate and commercial photography services',
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
Name: {{client_name}}', FALSE, TRUE),

(NULL, 'consultant', 'Consulting Services Agreement', 'Professional consulting agreement for advisory and strategic services',
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
Name: {{client_name}}', FALSE, TRUE),

(NULL, 'designer', 'Design Services Agreement', 'Contract for graphic design, branding, and creative services',
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
Name: {{client_name}}', FALSE, TRUE),

(NULL, 'copywriter', 'Content Writing Agreement', 'Contract for blog posts, articles, copywriting, and content creation',
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
Name: {{client_name}}', FALSE, TRUE),

(NULL, 'marketer', 'Marketing Services Agreement', 'Contract for digital marketing, campaigns, and strategy services',
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
Name: {{client_name}}', FALSE, TRUE)
ON CONFLICT DO NOTHING;

-- Line item presets seed
INSERT INTO line_item_presets (profession, label, description, default_rate, sort_order) VALUES
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
  ('other', 'Revision', 'Revision and feedback round', NULL, 3)
ON CONFLICT (profession, label) DO NOTHING;
