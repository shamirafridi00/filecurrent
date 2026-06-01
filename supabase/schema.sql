-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Profiles (extends auth.users)
CREATE TABLE IF NOT EXISTS profiles (
  id UUID REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
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
  default_tax_rate DECIMAL(5,2) DEFAULT 0,
  timezone TEXT DEFAULT 'UTC',
  plan TEXT DEFAULT 'trial' CHECK (plan IN ('trial', 'pro', 'free')),
  trial_ends_at TIMESTAMPTZ DEFAULT NOW() + INTERVAL '30 days',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Clients
CREATE TABLE IF NOT EXISTS clients (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  email TEXT,
  phone TEXT,
  company TEXT,
  address TEXT,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX idx_clients_user_id ON clients(user_id);

-- Contract Templates
CREATE TABLE IF NOT EXISTS contract_templates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  content TEXT NOT NULL DEFAULT '',
  is_default BOOLEAN DEFAULT FALSE,
  is_global BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Contracts
CREATE TABLE IF NOT EXISTS contracts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users ON DELETE CASCADE NOT NULL,
  client_id UUID REFERENCES clients ON DELETE RESTRICT NOT NULL,
  template_id UUID REFERENCES contract_templates ON DELETE SET NULL,
  title TEXT NOT NULL,
  project_description TEXT,
  amount DECIMAL(12,2) NOT NULL DEFAULT 0,
  currency TEXT DEFAULT 'USD',
  payment_terms TEXT,
  start_date DATE,
  end_date DATE,
  additional_terms TEXT,
  status TEXT DEFAULT 'draft' CHECK (status IN ('draft','sent','opened','signed')),
  signed_at TIMESTAMPTZ,
  open_count INTEGER DEFAULT 0,
  last_opened_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX idx_contracts_user_id ON contracts(user_id);
CREATE INDEX idx_contracts_client_id ON contracts(client_id);

-- Invoices
CREATE TABLE IF NOT EXISTS invoices (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users ON DELETE CASCADE NOT NULL,
  client_id UUID REFERENCES clients ON DELETE RESTRICT NOT NULL,
  invoice_number TEXT NOT NULL,
  invoice_date DATE NOT NULL,
  due_date DATE,
  currency TEXT DEFAULT 'USD',
  items JSONB DEFAULT '[]'::jsonb,
  subtotal DECIMAL(12,2) DEFAULT 0,
  tax_rate DECIMAL(5,2) DEFAULT 0,
  tax_amount DECIMAL(12,2) DEFAULT 0,
  discount_amount DECIMAL(12,2) DEFAULT 0,
  total DECIMAL(12,2) DEFAULT 0,
  notes TEXT,
  payment_terms TEXT,
  status TEXT DEFAULT 'draft' CHECK (status IN ('draft','sent','partial','paid','overdue')),
  paid_amount DECIMAL(12,2) DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, invoice_number)
);
CREATE INDEX idx_invoices_user_id ON invoices(user_id);
CREATE INDEX idx_invoices_client_id ON invoices(client_id);

-- Payments
CREATE TABLE IF NOT EXISTS payments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  invoice_id UUID REFERENCES invoices ON DELETE CASCADE NOT NULL,
  amount DECIMAL(12,2) NOT NULL,
  payment_date DATE NOT NULL,
  method TEXT NOT NULL CHECK (method IN ('bank_transfer','credit_card','cash','paypal','check','other')),
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX idx_payments_invoice_id ON payments(invoice_id);

-- Email Templates
CREATE TABLE IF NOT EXISTS email_templates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users ON DELETE CASCADE,
  name TEXT NOT NULL,
  key TEXT NOT NULL,
  description TEXT,
  subject TEXT NOT NULL,
  body TEXT NOT NULL,
  is_system BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Reminder Logs
CREATE TABLE IF NOT EXISTS reminder_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  invoice_id UUID REFERENCES invoices ON DELETE CASCADE,
  client_id UUID REFERENCES clients ON DELETE SET NULL,
  recipient_email TEXT,
  template_key TEXT,
  status TEXT DEFAULT 'sent' CHECK (status IN ('sent','failed')),
  sent_at TIMESTAMPTZ DEFAULT NOW()
);

-- Reminder Settings
CREATE TABLE IF NOT EXISTS reminder_settings (
  user_id UUID REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
  enabled BOOLEAN DEFAULT TRUE,
  days_before INTEGER[] DEFAULT '{3,1}',
  send_on_due_date BOOLEAN DEFAULT TRUE,
  days_after_overdue INTEGER[] DEFAULT '{3,7,14}',
  max_reminders_per_invoice INTEGER DEFAULT 5,
  skip_below_balance DECIMAL(12,2) DEFAULT 10
);

-- Invoice Settings
CREATE TABLE IF NOT EXISTS invoice_settings (
  user_id UUID REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
  theme TEXT DEFAULT 'summit' CHECK (theme IN ('aurora','summit','ledger')),
  primary_color TEXT DEFAULT '#4F46E5',
  secondary_color TEXT DEFAULT '#0F172A',
  brand_name TEXT,
  brand_logo TEXT,
  brand_address TEXT,
  phone TEXT,
  website TEXT,
  tax_id TEXT
);

-- Feedback
CREATE TABLE IF NOT EXISTS feedback (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users ON DELETE CASCADE,
  type TEXT NOT NULL CHECK (type IN ('bug','feature','general','other')),
  message TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Row Level Security
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE clients ENABLE ROW LEVEL SECURITY;
ALTER TABLE contract_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE contracts ENABLE ROW LEVEL SECURITY;
ALTER TABLE invoices ENABLE ROW LEVEL SECURITY;
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE email_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE reminder_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE reminder_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE invoice_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE feedback ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "profiles_own" ON profiles FOR ALL USING (auth.uid() = id);
CREATE POLICY "clients_own" ON clients FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "contract_templates_own_or_global" ON contract_templates FOR ALL
  USING (auth.uid() = user_id OR is_global = TRUE);
CREATE POLICY "contracts_own" ON contracts FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "invoices_own" ON invoices FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "payments_own" ON payments FOR ALL USING (
  invoice_id IN (SELECT id FROM invoices WHERE user_id = auth.uid())
);
CREATE POLICY "email_templates_own_or_system" ON email_templates FOR ALL
  USING (auth.uid() = user_id OR is_system = TRUE);
CREATE POLICY "reminder_logs_own" ON reminder_logs FOR ALL USING (
  invoice_id IN (SELECT id FROM invoices WHERE user_id = auth.uid())
);
CREATE POLICY "reminder_settings_own" ON reminder_settings FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "invoice_settings_own" ON invoice_settings FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "feedback_own" ON feedback FOR ALL USING (auth.uid() = user_id);

-- Auto-create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name)
  VALUES (new.id, new.raw_user_meta_data->>'full_name');

  INSERT INTO public.reminder_settings (user_id) VALUES (new.id);
  INSERT INTO public.invoice_settings (user_id) VALUES (new.id);
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();
