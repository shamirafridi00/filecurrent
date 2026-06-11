'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { FloppyDisk, ArrowSquareOut, Lightning, Star } from '@phosphor-icons/react'
import { useCheckout } from '@/hooks/useCheckout'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import { PageHeader } from '@/components/ui'
import { toast } from 'sonner'
import { CURRENCIES, TIMEZONES } from '@/types'
import type { Plan, Profession } from '@/types'

const PROFESSIONS: { value: Profession; label: string }[] = [
  { value: 'web_developer', label: 'Web Developer' },
  { value: 'photographer', label: 'Photographer' },
  { value: 'consultant', label: 'Consultant' },
  { value: 'designer', label: 'Designer' },
  { value: 'copywriter', label: 'Copywriter' },
  { value: 'marketer', label: 'Marketer' },
  { value: 'other', label: 'Other' },
]

const NOTIFICATION_OPTIONS = [
  { key: 'contract_opened', label: 'When a client opens my contract' },
  { key: 'contract_signed', label: 'When a client signs my contract' },
  { key: 'invoice_opened', label: 'When a client opens my invoice' },
  { key: 'invoice_overdue', label: 'When an invoice becomes overdue' },
  { key: 'payment_received', label: 'When a client reports a payment' },
  { key: 'proposal_accepted', label: 'When a client accepts my proposal' },
  { key: 'proposal_declined', label: 'When a client declines my proposal' },
  { key: 'intake_submitted', label: 'When a client submits an intake form' },
  { key: 'daily_summary', label: 'Daily summary (overdue invoices + pending reminders)' },
]

const PLAN_LABELS: Record<Plan, string> = {
  trial: 'Free Trial',
  free: 'Free Plan',
  pro: 'Pro',
  pro_monthly: 'Pro Monthly',
  pro_annual: 'Pro Annual',
  lifetime: 'Lifetime',
}

interface Props {
  profile: {
    fullName: string; email: string; phone: string; businessName: string
    address: string; city: string; state: string; postalCode: string
    country: string; taxId: string; defaultCurrency: string
    defaultTaxRate: number; timezone: string; profession: Profession | null
    plan: Plan; trialEndsAt: string | null; planExpiresAt: string | null
    businessLogo: string
  }
  notificationPrefs: Record<string, boolean>
}

export function SettingsTabs({ profile: initial, notificationPrefs: initialPrefs }: Props) {
  const router = useRouter()
  const { startCheckout, loading: checkoutLoading } = useCheckout()

  // Profile state
  const [fullName, setFullName] = useState(initial.fullName)
  const [phone, setPhone] = useState(initial.phone)
  const [businessName, setBusinessName] = useState(initial.businessName)
  const [address, setAddress] = useState(initial.address)
  const [city, setCity] = useState(initial.city)
  const [state, setState] = useState(initial.state)
  const [postalCode, setPostalCode] = useState(initial.postalCode)
  const [country, setCountry] = useState(initial.country)
  const [taxId, setTaxId] = useState(initial.taxId)
  const [defaultCurrency, setDefaultCurrency] = useState(initial.defaultCurrency)
  const [defaultTaxRate, setDefaultTaxRate] = useState(String(initial.defaultTaxRate))
  const [timezone, setTimezone] = useState(initial.timezone)
  const [profession, setProfession] = useState<Profession | ''>(initial.profession ?? '')
  const [businessLogo, setBusinessLogo] = useState<string>(initial.businessLogo ?? '')
  const [uploadingLogo, setUploadingLogo] = useState(false)
  const [logoError, setLogoError] = useState<string | null>(null)
  const [savingProfile, setSavingProfile] = useState(false)

  // Notification prefs
  const [notifPrefs, setNotifPrefs] = useState<Record<string, boolean>>(() => {
    const defaults: Record<string, boolean> = {}
    NOTIFICATION_OPTIONS.forEach((o) => { defaults[o.key] = initialPrefs[o.key] ?? true })
    return defaults
  })
  const [savingNotifs, setSavingNotifs] = useState(false)

  const saveProfile = async () => {
    setSavingProfile(true)
    try {
      const res = await fetch('/api/profile', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fullName, phone, businessName, address, city, state, postalCode,
          country, taxId, defaultCurrency,
          defaultTaxRate: parseFloat(defaultTaxRate) || 0,
          timezone, profession: profession || undefined,
        }),
      })
      if (!res.ok) throw new Error()
      toast.success('Profile saved')
      router.refresh()
    } catch {
      toast.error('Failed to save profile')
    } finally {
      setSavingProfile(false)
    }
  }

  const saveNotifications = async () => {
    setSavingNotifs(true)
    try {
      const res = await fetch('/api/profile', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ notificationPrefs: notifPrefs }),
      })
      if (!res.ok) throw new Error()
      toast.success('Notification preferences saved')
    } catch {
      toast.error('Failed to save preferences')
    } finally {
      setSavingNotifs(false)
    }
  }

  const isPro = initial.plan === 'pro' || initial.plan === 'pro_monthly' || initial.plan === 'pro_annual' || initial.plan === 'lifetime'
  const isTrial = initial.plan === 'trial'
  const trialDaysLeft = isTrial && initial.trialEndsAt
    ? Math.max(0, Math.ceil((new Date(initial.trialEndsAt).getTime() - Date.now()) / 86400000))
    : 0

  return (
    <div>
      <PageHeader title="Settings" />

      <Tabs defaultValue="profile" className="space-y-5">
        <TabsList>
          <TabsTrigger value="profile">Profile</TabsTrigger>
          <TabsTrigger value="billing">Plan &amp; Billing</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
        </TabsList>

        {/* ── Profile Tab ── */}
        <TabsContent value="profile" className="space-y-5 max-w-2xl">
          <Card>
            <CardHeader><CardTitle className="text-base">Personal Information</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label>Full Name</Label>
                  <Input value={fullName} onChange={(e) => setFullName(e.target.value)} />
                </div>
                <div className="space-y-1.5">
                  <Label>Email</Label>
                  <Input value={initial.email} disabled className="opacity-60" />
                </div>
                <div className="space-y-1.5">
                  <Label>Phone</Label>
                  <Input value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="+1 (555) 000-0000" />
                </div>
                <div className="space-y-1.5">
                  <Label>Profession</Label>
                  <Select value={profession} onValueChange={(v) => setProfession(v as Profession)}>
                    <SelectTrigger><SelectValue placeholder="Select profession…" /></SelectTrigger>
                    <SelectContent>
                      {PROFESSIONS.map((p) => <SelectItem key={p.value} value={p.value}>{p.label}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader><CardTitle className="text-base">Business Information</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Business Logo</Label>
                <div className="flex items-center gap-4">
                  {businessLogo ? (
                    <img src={businessLogo} alt="Business logo" className="h-14 w-auto max-w-[140px] rounded border object-contain p-1" />
                  ) : (
                    <div className="flex h-14 w-14 items-center justify-center rounded border bg-muted text-xs text-muted-foreground">
                      No logo
                    </div>
                  )}
                  <div className="flex flex-col gap-1.5">
                    <label className="cursor-pointer">
                      <input
                        type="file"
                        accept="image/png,image/jpeg"
                        className="hidden"
                        disabled={uploadingLogo}
                        onChange={async (e) => {
                          const file = e.target.files?.[0]
                          if (!file) return
                          setLogoError(null)
                          if (file.type !== 'image/png' && file.type !== 'image/jpeg') {
                            setLogoError('Only PNG or JPG files are supported.')
                            return
                          }
                          if (file.size > 2 * 1024 * 1024) {
                            setLogoError('Logo must be under 2MB. Please choose a smaller image.')
                            return
                          }
                          setUploadingLogo(true)
                          const fd = new FormData()
                          fd.append('file', file)
                          try {
                            const res = await fetch('/api/profile/logo', { method: 'POST', body: fd })
                            if (!res.ok) {
                              const json = await res.json().catch(() => ({}))
                              setLogoError(json.error ?? 'Upload failed. Please check your connection and try again.')
                              return
                            }
                            const json = await res.json()
                            if (json.url) {
                              setBusinessLogo(json.url)
                              toast.success('Logo updated successfully')
                            } else {
                              setLogoError(json.error ?? 'Upload failed. Please check your connection and try again.')
                            }
                          } catch {
                            setLogoError('Upload failed. Please check your connection and try again.')
                          } finally {
                            setUploadingLogo(false)
                          }
                        }}
                      />
                      <Button type="button" variant="outline" size="sm" disabled={uploadingLogo} asChild>
                        <span>{uploadingLogo ? 'Uploading…' : businessLogo ? 'Replace Logo' : 'Upload Logo'}</span>
                      </Button>
                    </label>
                    {businessLogo && (
                      <button
                        type="button"
                        className="text-xs text-muted-foreground hover:text-destructive"
                        onClick={async () => {
                          await fetch('/api/profile', { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ businessLogo: '' }) })
                          setBusinessLogo('')
                          toast.success('Logo removed')
                        }}
                      >
                        Remove
                      </button>
                    )}
                    <p className="text-xs text-muted-foreground">PNG or JPG, max 2MB</p>
                  </div>
                </div>
                {logoError && <p className="text-sm text-destructive mt-1">{logoError}</p>}
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label>Business Name</Label>
                  <Input value={businessName} onChange={(e) => setBusinessName(e.target.value)} />
                </div>
                <div className="space-y-1.5">
                  <Label>Tax ID / VAT Number</Label>
                  <Input value={taxId} onChange={(e) => setTaxId(e.target.value)} placeholder="Optional" />
                </div>
              </div>
              <div className="space-y-1.5">
                <Label>Address</Label>
                <Textarea rows={2} value={address} onChange={(e) => setAddress(e.target.value)} />
              </div>
              <div className="grid grid-cols-3 gap-3">
                <div className="space-y-1.5">
                  <Label>City</Label>
                  <Input value={city} onChange={(e) => setCity(e.target.value)} />
                </div>
                <div className="space-y-1.5">
                  <Label>State</Label>
                  <Input value={state} onChange={(e) => setState(e.target.value)} />
                </div>
                <div className="space-y-1.5">
                  <Label>Postal Code</Label>
                  <Input value={postalCode} onChange={(e) => setPostalCode(e.target.value)} />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader><CardTitle className="text-base">Invoice &amp; Payment Defaults</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-1.5">
                  <Label>Default Currency</Label>
                  <Select value={defaultCurrency} onValueChange={setDefaultCurrency}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {CURRENCIES.map((c) => <SelectItem key={c.value} value={c.value}>{c.label}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-1.5">
                  <Label>Default Tax Rate (%)</Label>
                  <Input type="number" min="0" max="100" step="0.1" value={defaultTaxRate} onChange={(e) => setDefaultTaxRate(e.target.value)} />
                  <p className="text-xs text-muted-foreground">Applied automatically when creating new invoices.</p>
                </div>
                <div className="space-y-1.5">
                  <Label>Timezone</Label>
                  <Select value={timezone} onValueChange={setTimezone}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {TIMEZONES.map((t) => <SelectItem key={t.value} value={t.value}>{t.label}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="flex justify-end">
            <Button onClick={saveProfile} disabled={savingProfile}>
              <FloppyDisk className="mr-1 h-4 w-4" />
              {savingProfile ? 'Saving…' : 'Save Profile'}
            </Button>
          </div>
        </TabsContent>

        {/* ── Plan & Billing Tab ── */}
        <TabsContent value="billing" className="max-w-2xl space-y-5">
          {isTrial ? (
            <Card className="mx-auto max-w-lg">
              <CardContent className="p-6">
                <div className="mb-5 flex flex-col items-center gap-2 text-center">
                  <div className="flex items-center gap-2">
                    <Lightning className="h-5 w-5 text-muted-foreground" />
                    <p className="font-semibold text-lg">Free Trial</p>
                    <Badge variant="secondary">
                      {trialDaysLeft} day{trialDaysLeft !== 1 ? 's' : ''} remaining
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">Full access to all features during your trial</p>
                </div>

                <ul className="mb-5 space-y-2">
                  {[
                    'Unlimited contracts & invoices',
                    'Digital e-signatures with audit trail',
                    'Automated payment reminders',
                    'Client portal & signing page',
                    'PDF generation & download',
                    'No FileCurrent branding on Pro',
                  ].map((feature) => (
                    <li key={feature} className="flex items-center gap-2 text-sm text-muted-foreground">
                      <span className="text-primary">✓</span> {feature}
                    </li>
                  ))}
                </ul>

                <div className="border-t border-border my-5" />

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div className="rounded-lg border bg-card p-4 space-y-3">
                    <div>
                      <p className="text-xl font-bold">$9 <span className="text-sm font-normal text-muted-foreground">/ month</span></p>
                      <p className="text-xs text-muted-foreground mt-0.5">Billed monthly, cancel anytime</p>
                    </div>
                    <Button
                      className="w-full"
                      disabled={checkoutLoading !== null}
                      onClick={() => startCheckout('monthly')}
                    >
                      {checkoutLoading === 'monthly' ? 'Redirecting…' : 'Upgrade to Pro'}
                    </Button>
                  </div>

                  <div className="rounded-lg border-2 border-primary bg-card p-4 space-y-3">
                    <div>
                      <div className="flex items-center gap-2 mb-0.5">
                        <p className="text-xl font-bold">$79 <span className="text-sm font-normal text-muted-foreground">/ year</span></p>
                        <Badge className="bg-primary text-primary-foreground text-xs">Best Value</Badge>
                      </div>
                      <p className="text-xs text-muted-foreground">Save 27% — just $6.58/month</p>
                    </div>
                    <Button
                      className="w-full"
                      disabled={checkoutLoading !== null}
                      onClick={() => startCheckout('annual')}
                    >
                      {checkoutLoading === 'annual' ? 'Redirecting…' : 'Get Annual Plan'}
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ) : isPro ? (
            <Card>
              <CardContent className="p-5">
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <Star className="h-5 w-5 text-primary" />
                      <p className="font-semibold text-lg">{PLAN_LABELS[initial.plan]}</p>
                    </div>
                    {initial.planExpiresAt && (
                      <p className="text-sm text-muted-foreground">
                        Renews: {new Date(initial.planExpiresAt).toLocaleDateString()}
                      </p>
                    )}
                    <p className="text-sm text-muted-foreground">Unlimited documents · No FileCurrent branding</p>
                    <Button variant="outline" size="sm" className="mt-3">
                      Cancel subscription
                    </Button>
                  </div>
                  <Badge variant="default" className="bg-primary">
                    {PLAN_LABELS[initial.plan]}
                  </Badge>
                </div>
              </CardContent>
            </Card>
          ) : null}
        </TabsContent>

        {/* ── Notifications Tab ── */}
        <TabsContent value="notifications" className="max-w-2xl">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Email Notifications</CardTitle>
              <CardDescription>Choose which events trigger an email to you</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {NOTIFICATION_OPTIONS.map((opt) => (
                <div key={opt.key} className="flex items-center justify-between">
                  <Label htmlFor={`notif-${opt.key}`} className="cursor-pointer text-sm font-normal">
                    {opt.label}
                  </Label>
                  <Switch
                    id={`notif-${opt.key}`}
                    checked={notifPrefs[opt.key] ?? true}
                    onCheckedChange={(v) => setNotifPrefs((p) => ({ ...p, [opt.key]: v }))}
                  />
                </div>
              ))}
            </CardContent>
          </Card>
          <div className="mt-4 flex justify-end">
            <Button onClick={saveNotifications} disabled={savingNotifs}>
              <FloppyDisk className="mr-1 h-4 w-4" />
              {savingNotifs ? 'Saving…' : 'Save Preferences'}
            </Button>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
