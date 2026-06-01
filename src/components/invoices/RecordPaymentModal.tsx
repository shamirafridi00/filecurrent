'use client'

import { useState } from 'react'
import { Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'
import { formatCurrency } from '@/lib/utils'
import { PAYMENT_METHODS } from '@/types'

interface Props {
  invoiceId: string
  currency: string
  balance: number
}

export function RecordPaymentModal({ invoiceId, currency, balance }: Props) {
  const router = useRouter()
  const [amount, setAmount] = useState('')
  const [paymentDate, setPaymentDate] = useState(new Date().toISOString().split('T')[0])
  const [method, setMethod] = useState('bank_transfer')
  const [notes, setNotes] = useState('')
  const [saving, setSaving] = useState(false)

  const handleRecord = async () => {
    const amt = parseFloat(amount)
    if (!amt || amt <= 0) { toast.error('Enter a valid amount'); return }
    setSaving(true)
    try {
      const res = await fetch(`/api/invoices/${invoiceId}/payments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount: amt, paymentDate, method, notes }),
      })
      if (!res.ok) throw new Error()
      toast.success('Payment recorded')
      setAmount('')
      setNotes('')
      router.refresh()
    } catch {
      toast.error('Failed to record payment')
    } finally {
      setSaving(false)
    }
  }

  if (balance <= 0) {
    return <p className="text-sm text-green-600 font-medium">Invoice fully paid ✓</p>
  }

  return (
    <div className="space-y-3">
      <p className="text-xs text-muted-foreground">
        Balance due: <span className="font-medium text-foreground">{formatCurrency(balance, currency)}</span>
      </p>
      <div className="space-y-2">
        <div className="space-y-1">
          <Label className="text-xs">Amount</Label>
          <Input type="number" min="0" step="0.01" placeholder="0.00" value={amount}
            onChange={(e) => setAmount(e.target.value)} />
        </div>
        <div className="space-y-1">
          <Label className="text-xs">Date</Label>
          <Input type="date" value={paymentDate} onChange={(e) => setPaymentDate(e.target.value)} />
        </div>
        <div className="space-y-1">
          <Label className="text-xs">Method</Label>
          <Select value={method} onValueChange={setMethod}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              {PAYMENT_METHODS.map((m) => <SelectItem key={m.value} value={m.value}>{m.label}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-1">
          <Label className="text-xs">Notes (optional)</Label>
          <Input placeholder="Transaction ID, reference…" value={notes} onChange={(e) => setNotes(e.target.value)} />
        </div>
      </div>
      <Button onClick={handleRecord} disabled={saving} size="sm" className="w-full">
        <Plus className="mr-1 h-3.5 w-3.5" />
        {saving ? 'Recording…' : 'Record Payment'}
      </Button>
    </div>
  )
}
