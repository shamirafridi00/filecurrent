-- Performance indexes — run once in Supabase SQL Editor
-- These replace full-table scans with index lookups on the most common query patterns.

-- Invoices
CREATE INDEX IF NOT EXISTS idx_invoices_user_id_created ON invoices(user_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_invoices_user_status ON invoices(user_id, status);
CREATE INDEX IF NOT EXISTS idx_invoices_user_recurring ON invoices(user_id, is_recurring, recurrence_next_date) WHERE is_recurring = true;
CREATE INDEX IF NOT EXISTS idx_invoices_due_date ON invoices(user_id, due_date) WHERE status IN ('sent', 'partial');
CREATE INDEX IF NOT EXISTS idx_invoices_share_token ON invoices(share_token) WHERE share_token IS NOT NULL;

-- Contracts
CREATE INDEX IF NOT EXISTS idx_contracts_user_id_created ON contracts(user_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_contracts_user_status ON contracts(user_id, status);

-- Clients
CREATE INDEX IF NOT EXISTS idx_clients_user_id ON clients(user_id);

-- Payments
CREATE INDEX IF NOT EXISTS idx_payments_invoice_id ON payments(invoice_id, payment_date DESC);

-- Audit events
CREATE INDEX IF NOT EXISTS idx_audit_events_contract_id ON audit_events(contract_id, timestamp DESC);

-- Invoice items
CREATE INDEX IF NOT EXISTS idx_invoice_items_invoice_id ON invoice_items(invoice_id);

-- Reminder logs
CREATE INDEX IF NOT EXISTS idx_reminder_logs_user_id ON reminder_logs(user_id, sent_at DESC);
