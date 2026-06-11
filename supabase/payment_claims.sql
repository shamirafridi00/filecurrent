-- Payment claims: client-submitted payment notifications from the public invoice
-- page / client portal. A claim is the client's *self-reported* statement that
-- they have paid (full or partial). It stays `pending` until the freelancer
-- confirms it, at which point a real row is written into `payments` and the
-- invoice paid_amount / status are updated. Run once in Supabase SQL Editor.

CREATE TABLE IF NOT EXISTS payment_claims (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  invoice_id UUID REFERENCES invoices ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES auth.users ON DELETE CASCADE NOT NULL,
  amount DECIMAL NOT NULL,
  method TEXT NOT NULL DEFAULT 'bank_transfer',
  payment_date DATE,
  note TEXT,
  receipt_url TEXT,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending','confirmed','rejected')),
  payment_id UUID REFERENCES payments ON DELETE SET NULL, -- set when confirmed
  created_at TIMESTAMPTZ DEFAULT NOW(),
  reviewed_at TIMESTAMPTZ
);

CREATE INDEX IF NOT EXISTS idx_payment_claims_invoice ON payment_claims(invoice_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_payment_claims_user_pending ON payment_claims(user_id, status) WHERE status = 'pending';

ALTER TABLE payment_claims ENABLE ROW LEVEL SECURITY;

-- Freelancers can only see/manage claims on their own invoices. The public
-- submission path uses the service-role admin client, which bypasses RLS.
DROP POLICY IF EXISTS "Users manage own payment claims" ON payment_claims;
CREATE POLICY "Users manage own payment claims" ON payment_claims
  FOR ALL USING (auth.uid() = user_id);
