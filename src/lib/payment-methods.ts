// Structured payment methods stored inside the existing
// `invoices.payment_instructions` text column. New invoices save a JSON
// envelope; legacy invoices keep their freeform text, which every parser
// falls back to. No schema migration needed.

export type PaymentMethodType =
  | 'bank_transfer'
  | 'paypal'
  | 'payment_link'   // Stripe / Square / Wise checkout link
  | 'venmo'
  | 'zelle'
  | 'check'
  | 'other'

export interface PaymentMethodEntry {
  type: PaymentMethodType
  /** Per-type fields, e.g. bank: accountName/accountNumber/routing/iban; paypal: email; link: url */
  fields: Record<string, string>
}

export interface StructuredInstructions {
  version: 1
  methods: PaymentMethodEntry[]
  /** Optional freeform note shown under the methods */
  note?: string
}

export const PAYMENT_METHOD_META: Record<PaymentMethodType, {
  label: string
  fields: Array<{ key: string; label: string; placeholder: string }>
}> = {
  bank_transfer: {
    label: 'Bank Transfer',
    fields: [
      { key: 'accountName', label: 'Account name', placeholder: 'Jane Doe LLC' },
      { key: 'accountNumber', label: 'Account number', placeholder: '000123456789' },
      { key: 'routingNumber', label: 'Routing number (ACH)', placeholder: '110000000' },
      { key: 'iban', label: 'IBAN / SWIFT (international)', placeholder: 'Optional' },
      { key: 'bankName', label: 'Bank name', placeholder: 'Chase' },
    ],
  },
  paypal: {
    label: 'PayPal',
    fields: [
      { key: 'email', label: 'PayPal email or @username', placeholder: 'you@example.com' },
    ],
  },
  payment_link: {
    label: 'Payment Link (Stripe, Square, …)',
    fields: [
      { key: 'url', label: 'Checkout URL', placeholder: 'https://buy.stripe.com/…' },
      { key: 'label', label: 'Display label', placeholder: 'Pay by card' },
    ],
  },
  venmo: {
    label: 'Venmo',
    fields: [
      { key: 'handle', label: 'Venmo handle', placeholder: '@your-handle' },
    ],
  },
  zelle: {
    label: 'Zelle',
    fields: [
      { key: 'contact', label: 'Zelle email or phone', placeholder: 'you@example.com' },
    ],
  },
  check: {
    label: 'Check',
    fields: [
      { key: 'payableTo', label: 'Make payable to', placeholder: 'Jane Doe LLC' },
      { key: 'mailTo', label: 'Mail to address', placeholder: '123 Main St, Austin TX 78701' },
    ],
  },
  other: {
    label: 'Other',
    fields: [
      { key: 'label', label: 'Method name', placeholder: 'Wise, crypto, …' },
      { key: 'details', label: 'Instructions', placeholder: 'How to pay' },
    ],
  },
}

const ENVELOPE_PREFIX = '{"version":1'

/** Parse stored payment_instructions: structured JSON or legacy freeform text. */
export function parsePaymentInstructions(raw: string | null | undefined): {
  structured: StructuredInstructions | null
  legacyText: string | null
} {
  if (!raw || !raw.trim()) return { structured: null, legacyText: null }
  const trimmed = raw.trim()
  if (trimmed.startsWith(ENVELOPE_PREFIX)) {
    try {
      const parsed = JSON.parse(trimmed) as StructuredInstructions
      if (parsed.version === 1 && Array.isArray(parsed.methods)) {
        return { structured: parsed, legacyText: null }
      }
    } catch { /* fall through to legacy */ }
  }
  return { structured: null, legacyText: raw }
}

export function serializePaymentInstructions(data: StructuredInstructions): string {
  return JSON.stringify(data)
}

/** Flatten instructions to plain text (PDF + plain-text contexts). */
export function paymentInstructionsToPlainText(raw: string | null | undefined): string | null {
  const { structured, legacyText } = parsePaymentInstructions(raw)
  if (!structured) return legacyText
  const blocks = structured.methods.map((m) => {
    const { title, lines } = methodSummary(m)
    return [title, ...lines.map((l) => `  ${l}`)].join('\n')
  })
  if (structured.note?.trim()) blocks.push(structured.note.trim())
  return blocks.length ? blocks.join('\n\n') : null
}

/** Human-readable summary line for a method (used in lists/PDF). */
export function methodSummary(m: PaymentMethodEntry): { title: string; lines: string[] } {
  const meta = PAYMENT_METHOD_META[m.type] ?? PAYMENT_METHOD_META.other
  const f = m.fields
  switch (m.type) {
    case 'bank_transfer':
      return {
        title: 'Bank Transfer',
        lines: [
          f.accountName && `Account name: ${f.accountName}`,
          f.bankName && `Bank: ${f.bankName}`,
          f.accountNumber && `Account number: ${f.accountNumber}`,
          f.routingNumber && `Routing (ACH): ${f.routingNumber}`,
          f.iban && `IBAN/SWIFT: ${f.iban}`,
        ].filter(Boolean) as string[],
      }
    case 'paypal':
      return { title: 'PayPal', lines: [f.email && `Send to: ${f.email}`].filter(Boolean) as string[] }
    case 'payment_link':
      return { title: f.label || 'Pay Online', lines: [f.url].filter(Boolean) as string[] }
    case 'venmo':
      return { title: 'Venmo', lines: [f.handle].filter(Boolean) as string[] }
    case 'zelle':
      return { title: 'Zelle', lines: [f.contact].filter(Boolean) as string[] }
    case 'check':
      return {
        title: 'Check',
        lines: [
          f.payableTo && `Payable to: ${f.payableTo}`,
          f.mailTo && `Mail to: ${f.mailTo}`,
        ].filter(Boolean) as string[],
      }
    default:
      return { title: f.label || meta.label, lines: [f.details].filter(Boolean) as string[] }
  }
}
