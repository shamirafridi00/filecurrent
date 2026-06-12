'use client'

import { useMemo } from 'react'
import { Plus, Trash } from '@phosphor-icons/react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  PAYMENT_METHOD_META,
  parsePaymentInstructions,
  serializePaymentInstructions,
  type PaymentMethodEntry,
  type PaymentMethodType,
  type StructuredInstructions,
} from '@/lib/payment-methods'

interface Props {
  /** Raw stored value — structured JSON envelope or legacy freeform text */
  value: string
  onChange: (raw: string) => void
}

/**
 * Structured payment-method editor for invoices. Freelancers add one or more
 * methods (bank transfer with account/routing/IBAN, PayPal, Stripe/checkout
 * link, Venmo, Zelle, check, other) instead of a single freeform textarea.
 * Legacy freeform values keep working — they load into the note field.
 */
export function PaymentMethodsEditor({ value, onChange }: Props) {
  const data: StructuredInstructions = useMemo(() => {
    const { structured, legacyText } = parsePaymentInstructions(value)
    if (structured) return structured
    return { version: 1, methods: [], note: legacyText ?? undefined }
  }, [value])

  const update = (next: StructuredInstructions) => {
    const isEmpty = next.methods.length === 0 && !next.note?.trim()
    onChange(isEmpty ? '' : serializePaymentInstructions(next))
  }

  const addMethod = (type: PaymentMethodType) => {
    update({ ...data, methods: [...data.methods, { type, fields: {} }] })
  }

  const updateMethod = (index: number, patch: Partial<PaymentMethodEntry>) => {
    const methods = data.methods.map((m, i) => (i === index ? { ...m, ...patch } : m))
    update({ ...data, methods })
  }

  const setField = (index: number, key: string, fieldValue: string) => {
    const m = data.methods[index]
    updateMethod(index, { fields: { ...m.fields, [key]: fieldValue } })
  }

  const removeMethod = (index: number) => {
    update({ ...data, methods: data.methods.filter((_, i) => i !== index) })
  }

  const availableTypes = Object.entries(PAYMENT_METHOD_META) as Array<[
    PaymentMethodType, (typeof PAYMENT_METHOD_META)[PaymentMethodType]
  ]>

  return (
    <div className="space-y-3">
      {data.methods.map((method, i) => {
        const meta = PAYMENT_METHOD_META[method.type] ?? PAYMENT_METHOD_META.other
        return (
          <div key={i} className="rounded-lg border border-border p-3 space-y-3">
            <div className="flex items-center justify-between gap-2">
              <Select
                value={method.type}
                onValueChange={(t) => updateMethod(i, { type: t as PaymentMethodType, fields: {} })}
              >
                <SelectTrigger className="h-8 w-56 text-sm">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {availableTypes.map(([t, m]) => (
                    <SelectItem key={t} value={t}>{m.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Button
                type="button" variant="ghost" size="sm" className="h-8 w-8 p-0"
                onClick={() => removeMethod(i)}
              >
                <Trash className="h-3.5 w-3.5 text-destructive" />
              </Button>
            </div>
            <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
              {meta.fields.map((f) => (
                <div key={f.key} className="space-y-1">
                  <Label className="text-xs">{f.label}</Label>
                  <Input
                    className="h-8 text-sm"
                    placeholder={f.placeholder}
                    value={method.fields[f.key] ?? ''}
                    onChange={(e) => setField(i, f.key, e.target.value)}
                  />
                </div>
              ))}
            </div>
          </div>
        )
      })}

      <div className="flex flex-wrap gap-2">
        {availableTypes.map(([t, m]) => (
          <button
            key={t}
            type="button"
            onClick={() => addMethod(t)}
            className="flex items-center gap-1 rounded-md border border-dashed border-border px-2.5 py-1.5 text-xs font-medium text-muted-foreground transition-colors hover:border-primary/50 hover:text-primary"
          >
            <Plus className="h-3 w-3" /> {m.label}
          </button>
        ))}
      </div>

      <div className="space-y-1">
        <Label className="text-xs">Additional note <span className="text-muted-foreground">(optional)</span></Label>
        <Textarea
          rows={2}
          placeholder="e.g. Please include the invoice number as the payment reference."
          value={data.note ?? ''}
          onChange={(e) => update({ ...data, note: e.target.value })}
        />
      </div>
    </div>
  )
}
