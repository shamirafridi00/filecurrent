'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Envelope, Clock, Question, PaperPlaneTilt, MapPin, CreditCard } from '@/components/icons'
import { SUPPORT_EMAIL, LEGAL_ENTITY, BUSINESS_ADDRESS } from '@/lib/constants'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent } from '@/components/ui/card'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

export default function ContactPage() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [subject, setSubject] = useState('')
  const [message, setMessage] = useState('')
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (message.length < 20) return
    setStatus('loading')
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, subject, message }),
      })
      setStatus(res.ok ? 'success' : 'error')
    } catch {
      setStatus('error')
    }
  }

  return (
    <div className="pt-32 pb-24">
      <div className="max-w-5xl mx-auto px-6">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold tracking-[-0.02em] text-foreground mb-3">Get in touch</h1>
          <p className="text-muted-foreground">Have a question? Need help? We&apos;ll get back to you within 24 hours.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-5 gap-8">
          {/* Form */}
          <div className="md:col-span-3">
            <Card className="card-elevated border-border">
              <CardContent className="p-6">
                {status === 'success' ? (
                  <div className="text-center py-8">
                    <div className="w-12 h-12 rounded-full bg-accent flex items-center justify-center mx-auto mb-4">
                      <PaperPlaneTilt className="h-5 w-5 text-primary" weight="fill" />
                    </div>
                    <h3 className="text-foreground font-semibold text-lg mb-2">Message sent!</h3>
                    <p className="text-muted-foreground text-sm">Thanks! We&apos;ll be in touch within 24 hours.</p>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-1.5">
                      <Label htmlFor="name">Your name</Label>
                      <Input id="name" value={name} onChange={e => setName(e.target.value)}
                        placeholder="Jane Smith" required />
                    </div>
                    <div className="space-y-1.5">
                      <Label htmlFor="email">Email address</Label>
                      <Input id="email" type="email" autoComplete="email" value={email} onChange={e => setEmail(e.target.value)}
                        placeholder="you@example.com" required />
                    </div>
                    <div className="space-y-1.5">
                      <Label>Subject</Label>
                      <Select onValueChange={setSubject}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a subject" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="General question">General question</SelectItem>
                          <SelectItem value="Billing & payments">Billing & payments</SelectItem>
                          <SelectItem value="Technical issue">Technical issue</SelectItem>
                          <SelectItem value="Feature request">Feature request</SelectItem>
                          <SelectItem value="Refund request">Refund request</SelectItem>
                          <SelectItem value="Other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-1.5">
                      <Label htmlFor="message">Message</Label>
                      <Textarea id="message" value={message} onChange={e => setMessage(e.target.value)}
                        placeholder="Tell us how we can help..." rows={5} required />
                    </div>
                    {status === 'error' && (
                      <p className="text-destructive text-sm">Something went wrong. Email us at support@filecurrent.com</p>
                    )}
                    <Button type="submit" className="w-full bg-primary hover:bg-[#5145E5] text-white"
                      disabled={status === 'loading' || message.length < 20}>
                      {status === 'loading' ? 'Sending…' : 'Send message'}
                    </Button>
                  </form>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Info */}
          <div className="md:col-span-2 space-y-4">
            {[
              {
                icon: <Envelope className="h-5 w-5 text-primary" weight="duotone" />,
                title: 'Email Support',
                content: <><p className="text-primary font-medium">{SUPPORT_EMAIL}</p><p className="text-muted-foreground text-sm mt-1">For general questions, account help, and refund requests</p></>,
              },
              {
                icon: <CreditCard className="h-5 w-5 text-primary" weight="duotone" />,
                title: 'Billing & Payments',
                content: (
                  <p className="text-sm text-muted-foreground">
                    Payments are handled by <span className="text-foreground font-medium">Paddle</span>, our Merchant of Record.
                    For any order or billing question you can reply to your Paddle receipt, or email us and we&apos;ll help.
                  </p>
                ),
              },
              {
                icon: <MapPin className="h-5 w-5 text-primary" weight="duotone" />,
                title: 'Business Details',
                content: (
                  <div className="text-sm text-muted-foreground space-y-0.5">
                    <p className="text-foreground font-medium">{LEGAL_ENTITY}</p>
                    <p>Trading as FileCurrent</p>
                    <p>{BUSINESS_ADDRESS}</p>
                  </div>
                ),
              },
              {
                icon: <Clock className="h-5 w-5 text-primary" weight="duotone" />,
                title: 'Support Hours',
                content: (
                  <div className="text-sm text-muted-foreground space-y-1">
                    <p>Mon to Fri: 9AM to 6PM EST</p>
                    <p>Saturday: 10AM to 4PM EST</p>
                    <p>Sunday: Closed</p>
                    <p className="text-muted-foreground mt-2">Email support available 24/7. We respond within 24 hours.</p>
                  </div>
                ),
              },
              {
                icon: <Question className="h-5 w-5 text-primary" weight="duotone" />,
                title: 'Helpful Links',
                content: (
                  <div className="text-sm space-y-2">
                    <Link href="/help" className="block text-primary hover:underline">Help & FAQ →</Link>
                    <Link href="/#pricing" className="block text-primary hover:underline">Pricing →</Link>
                    <Link href="/refund" className="block text-primary hover:underline">Refund Policy →</Link>
                  </div>
                ),
              },
            ].map((card) => (
              <Card key={card.title} className="border-border">
                <CardContent className="p-5">
                  <div className="flex items-center gap-2 mb-3">
                    {card.icon}
                    <h3 className="font-semibold text-foreground text-sm">{card.title}</h3>
                  </div>
                  {card.content}
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
