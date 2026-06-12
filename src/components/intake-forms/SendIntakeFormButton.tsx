'use client'

import { useState } from 'react'
import { PaperPlaneTilt } from '@phosphor-icons/react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { toast } from 'sonner'

interface ClientOption {
  id: string
  name: string
  email: string | null
}

interface Props {
  formId: string
  clients: ClientOption[]
}

const MANUAL = '__manual__'

export function SendIntakeFormButton({ formId, clients }: Props) {
  const [open, setOpen] = useState(false)
  const [sending, setSending] = useState(false)
  const [selection, setSelection] = useState<string>(clients.length > 0 ? '' : MANUAL)
  const [manualEmail, setManualEmail] = useState('')
  const [manualName, setManualName] = useState('')

  const usingManual = selection === MANUAL
  const selectedClient = clients.find((c) => c.id === selection)

  async function handleSend() {
    let payload: Record<string, string> = {}
    if (usingManual) {
      const email = manualEmail.trim()
      if (!email || !email.includes('@')) { toast.error('Enter a valid email'); return }
      payload = { email, name: manualName.trim() }
    } else {
      if (!selectedClient) { toast.error('Choose a client'); return }
      if (!selectedClient.email) { toast.error(`${selectedClient.name} has no email address`); return }
      payload = { clientId: selectedClient.id }
    }

    setSending(true)
    try {
      const res = await fetch(`/api/intake-forms/${formId}/send`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
      if (!res.ok) {
        const data = await res.json().catch(() => ({}))
        throw new Error(data.error || 'Failed to send')
      }
      toast.success('Form sent')
      setOpen(false)
      setManualEmail('')
      setManualName('')
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Failed to send')
    } finally {
      setSending(false)
    }
  }

  return (
    <>
      <Button variant="outline" size="sm" onClick={() => setOpen(true)} data-tour="send-intake">
        <PaperPlaneTilt className="mr-1.5 h-3.5 w-3.5" /> Send
      </Button>

      <Dialog open={open} onOpenChange={(v) => { if (!sending) setOpen(v) }}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Send Form to Client</DialogTitle>
            <DialogDescription>
              Email this intake form so your client can fill it out.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-2">
            <div className="space-y-1.5">
              <Label className="text-sm">Recipient</Label>
              <Select value={selection} onValueChange={setSelection}>
                <SelectTrigger>
                  <SelectValue placeholder="Choose a client…" />
                </SelectTrigger>
                <SelectContent>
                  {clients.map((c) => (
                    <SelectItem key={c.id} value={c.id}>
                      {c.name}{c.email ? '' : ' (no email)'}
                    </SelectItem>
                  ))}
                  <SelectItem value={MANUAL}>Enter email manually…</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {usingManual && (
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label className="text-sm">Name</Label>
                  <Input
                    placeholder="Client name"
                    value={manualName}
                    onChange={(e) => setManualName(e.target.value)}
                  />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-sm">Email</Label>
                  <Input
                    type="email"
                    placeholder="client@example.com"
                    value={manualEmail}
                    onChange={(e) => setManualEmail(e.target.value)}
                  />
                </div>
              </div>
            )}

            {!usingManual && selectedClient && !selectedClient.email && (
              <p className="text-sm text-destructive">
                {selectedClient.name} has no email address on file.
              </p>
            )}
          </div>

          <DialogFooter>
            <Button type="button" variant="ghost" onClick={() => setOpen(false)} disabled={sending}>
              Cancel
            </Button>
            <Button type="button" onClick={handleSend} disabled={sending}>
              <PaperPlaneTilt className="mr-1.5 h-4 w-4" />
              {sending ? 'Sending…' : 'Send Form'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
