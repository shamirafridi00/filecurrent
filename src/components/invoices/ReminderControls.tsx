'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Bell } from '@phosphor-icons/react'
import { Button } from '@/components/ui/button'
import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'
import { toast } from 'sonner'

interface Props {
  invoiceId: string
  isPaid: boolean
  remindersPaused: boolean
}

export function ReminderControls({ invoiceId, isPaid, remindersPaused }: Props) {
  const router = useRouter()
  const [sending, setSending] = useState(false)
  const [paused, setPaused] = useState(remindersPaused)
  const [toggling, setToggling] = useState(false)

  const handleSend = async () => {
    setSending(true)
    try {
      const res = await fetch(`/api/invoices/${invoiceId}/remind`, { method: 'POST' })
      const json = await res.json()
      if (!res.ok) throw new Error(json.error ?? 'Failed to send')
      toast.success('Reminder sent')
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Failed to send reminder')
    } finally {
      setSending(false)
    }
  }

  const handleTogglePause = async (checked: boolean) => {
    setToggling(true)
    const next = !checked // switch ON = reminders active = paused:false
    try {
      const res = await fetch(`/api/invoices/${invoiceId}/remind-pause`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ paused: next }),
      })
      if (!res.ok) throw new Error()
      setPaused(next)
      router.refresh()
    } catch {
      toast.error('Failed to update reminder setting')
    } finally {
      setToggling(false)
    }
  }

  return (
    <div className="space-y-3">
      <Button
        variant="outline"
        size="sm"
        onClick={handleSend}
        disabled={isPaid || sending}
        className="w-full"
      >
        <Bell className="mr-2 h-4 w-4" />
        {sending ? 'Sending…' : 'Send Reminder'}
      </Button>

      <div className="flex items-center justify-between">
        <Label htmlFor={`pause-${invoiceId}`} className="text-sm text-muted-foreground cursor-pointer">
          Pause reminders
        </Label>
        <Switch
          id={`pause-${invoiceId}`}
          checked={!paused}
          onCheckedChange={(checked) => handleTogglePause(checked)}
          disabled={toggling}
        />
      </div>
    </div>
  )
}
