'use client'

import { useState } from 'react'
import { ChatCircle, PaperPlaneTilt, CheckCircle } from '@/components/icons'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { PageHeader } from '@/components/ui'
import { toast } from 'sonner'
import { FEEDBACK_TYPES } from '@/types'

const MAX_LENGTH = 2000
const MIN_LENGTH = 10

export default function FeedbackPage() {
  const [type, setType] = useState('')
  const [message, setMessage] = useState('')
  const [sending, setSending] = useState(false)

  const handleSubmit = async () => {
    if (!type) { toast.error('Choose a feedback type'); return }
    if (message.trim().length < MIN_LENGTH) {
      toast.error(`Message must be at least ${MIN_LENGTH} characters`)
      return
    }
    setSending(true)
    try {
      const res = await fetch('/api/feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type, message: message.trim() }),
      })
      if (!res.ok) {
        const data = await res.json().catch(() => ({}))
        throw new Error(data.error || 'Failed to send feedback')
      }
      toast.success('Thank you for your feedback!')
      setType('')
      setMessage('')
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Failed to send feedback')
    } finally {
      setSending(false)
    }
  }

  return (
    <div>
      <PageHeader
        title="Feedback"
        subtitle="Help us make FileCurrent better"
        icon={<ChatCircle size={24} weight="duotone" className="text-primary" />}
      />

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-[minmax(0,28rem)_minmax(0,20rem)] items-start">
        <Card>
          <CardHeader><CardTitle className="text-base">Send Feedback</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-1.5">
              <Label>Type</Label>
              <Select value={type} onValueChange={setType}>
                <SelectTrigger><SelectValue placeholder="Select type…" /></SelectTrigger>
                <SelectContent>
                  {FEEDBACK_TYPES.map((t) => <SelectItem key={t.value} value={t.value}>{t.label}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <Label htmlFor="fb-msg">Message</Label>
                <span className={`text-xs ${message.length > MAX_LENGTH ? 'text-destructive' : 'text-muted-foreground'}`}>
                  {message.length} / {MAX_LENGTH}
                </span>
              </div>
              <Textarea
                id="fb-msg"
                rows={6}
                maxLength={MAX_LENGTH}
                placeholder="Tell us what you think, what's broken, or what you'd like to see…"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
              />
            </div>
            <Button
              onClick={handleSubmit}
              disabled={sending || !type || message.trim().length < MIN_LENGTH}
              className="w-full"
            >
              <PaperPlaneTilt className="mr-1.5 h-4 w-4" />
              {sending ? 'Sending…' : 'Submit Feedback'}
            </Button>
            <p className="text-xs text-center text-muted-foreground">
              Or email us at{' '}
              <a href="mailto:hello@filecurrent.com" className="text-primary hover:underline">hello@filecurrent.com</a>
            </p>
          </CardContent>
        </Card>

        <Card className="bg-muted/30">
          <CardContent className="p-5 space-y-3">
            <p className="text-sm font-semibold text-foreground">Your feedback helps us improve</p>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li className="flex items-start gap-2">
                <CheckCircle size={16} className="mt-0.5 shrink-0 text-primary" />
                We read every submission and use them to prioritize what gets built next.
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle size={16} className="mt-0.5 shrink-0 text-primary" />
                Bug reports go straight to the top of the fix queue.
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle size={16} className="mt-0.5 shrink-0 text-primary" />
                You can submit up to 3 messages per day.
              </li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
