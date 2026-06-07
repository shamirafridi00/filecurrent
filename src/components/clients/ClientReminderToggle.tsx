'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'
import { toast } from 'sonner'

interface Props {
  clientId: string
  remindersPaused: boolean
}

export function ClientReminderToggle({ clientId, remindersPaused: initial }: Props) {
  const router = useRouter()
  const [paused, setPaused] = useState(initial)
  const [toggling, setToggling] = useState(false)

  const handleToggle = async (checked: boolean) => {
    // Switch checked = reminders ACTIVE (paused=false)
    // Switch unchecked = reminders PAUSED (paused=true)
    const next = !checked
    setToggling(true)
    try {
      const res = await fetch(`/api/clients/${clientId}/remind-pause`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ paused: next }),
      })
      if (!res.ok) throw new Error()
      setPaused(next)
      toast.success(next ? 'Reminders paused for this client' : 'Reminders resumed for this client')
      router.refresh()
    } catch {
      toast.error('Failed to update reminder setting')
    } finally {
      setToggling(false)
    }
  }

  return (
    <div className="flex items-center justify-between py-1">
      <Label htmlFor={`client-pause-${clientId}`} className="text-sm cursor-pointer">
        Pause all reminders
      </Label>
      <Switch
        id={`client-pause-${clientId}`}
        checked={!paused}
        onCheckedChange={handleToggle}
        disabled={toggling}
      />
    </div>
  )
}
