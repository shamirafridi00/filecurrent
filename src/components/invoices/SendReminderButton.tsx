'use client'

import { useState } from 'react'
import { Bell } from '@phosphor-icons/react'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'

interface Props { invoiceId: string; disabled?: boolean }

export function SendReminderButton({ invoiceId, disabled }: Props) {
  const [loading, setLoading] = useState(false)

  const handleSend = async () => {
    setLoading(true)
    try {
      const res = await fetch(`/api/invoices/${invoiceId}/remind`, { method: 'POST' })
      const json = await res.json()
      if (!res.ok) throw new Error(json.error ?? 'Failed to send')
      toast.success('Reminder sent')
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Failed to send reminder')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Button variant="outline" size="sm" onClick={handleSend} disabled={disabled || loading}>
      <Bell className="mr-1 h-4 w-4" />
      {loading ? 'Sending…' : 'Send Reminder'}
    </Button>
  )
}
