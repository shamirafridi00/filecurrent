'use client'

import { useState } from 'react'
import { MessageSquare, Send } from 'lucide-react'
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

export default function FeedbackPage() {
  const [type, setType] = useState('')
  const [message, setMessage] = useState('')
  const [sending, setSending] = useState(false)

  const handleSubmit = async () => {
    if (!type || !message.trim()) { toast.error('Please fill in all fields'); return }
    setSending(true)
    await new Promise((r) => setTimeout(r, 600))
    toast.success('Thank you for your feedback!')
    setType('')
    setMessage('')
    setSending(false)
  }

  return (
    <div>
      <PageHeader
        title="Feedback"
        subtitle="Help us make FileCurrent better"
        icon={<MessageSquare size={24} />}
      />

      <Card className="max-w-lg">
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
            <Label htmlFor="fb-msg">Message</Label>
            <Textarea
              id="fb-msg"
              rows={5}
              placeholder="Tell us what you think, what's broken, or what you'd like to see…"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
            />
          </div>
          <Button onClick={handleSubmit} disabled={sending} className="w-full">
            <Send className="mr-1 h-4 w-4" />
            {sending ? 'Sending…' : 'Send Feedback'}
          </Button>
          <p className="text-xs text-center text-muted-foreground">
            Or email us at{' '}
            <a href="mailto:hello@filecurrent.io" className="text-primary underline">hello@filecurrent.io</a>
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
