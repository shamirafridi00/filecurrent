-- Optional follow-up for expense→invoice linking: tracks which expenses are
-- client-billable and which invoice billed them, so billed expenses can be
-- filtered out of the "Add from Expenses" picker and shown on the client.
-- The current code works without this (expenses import as line items);
-- run in Supabase SQL Editor when ready to enable full billable tracking.

ALTER TABLE expenses ADD COLUMN IF NOT EXISTS client_id UUID REFERENCES clients ON DELETE SET NULL;
ALTER TABLE expenses ADD COLUMN IF NOT EXISTS is_billable BOOLEAN DEFAULT FALSE;
ALTER TABLE expenses ADD COLUMN IF NOT EXISTS billed_invoice_id UUID REFERENCES invoices ON DELETE SET NULL;

CREATE INDEX IF NOT EXISTS idx_expenses_billable
  ON expenses(user_id, is_billable) WHERE is_billable = TRUE AND billed_invoice_id IS NULL;
