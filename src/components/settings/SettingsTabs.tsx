'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { FloppyDisk, ArrowSquareOut, Lightning, Star, ShieldCheck } from '@phosphor-icons/react'
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
  { key: 'daily_summary', label: 'Daily summary (overdue invoices + pending reminders)' },
]

const PLAN_LABELS: Record<Plan, string> = {
  trial: 'Free Trial',
  free: 'Free Plan',
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

  const isPro = initial.plan === 'pro_monthly' || initial.plan === 'pro_annual' || initial.plan === 'lifetime'
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
          <Card>
            <CardContent className="p-5">
              <div className="flex items-start justify-between">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    {isPro
                      ? <Star className="h-5 w-5 text-primary" />
                      : <Lightning className="h-5 w-5 text-muted-foreground" />}
                    <p className="font-semibold text-lg">{PLAN_LABELS[initial.plan]}</p>
                  </div>
                  {isTrial ? (
                    <>
                      <p className="text-sm text-muted-foreground">
                        {trialDaysLeft} day{trialDaysLeft !== 1 ? 's' : ''} remaining · Full access to all features
                      </p>
                      <div className="mt-3 flex flex-wrap gap-2">
                        <Button
                          className="w-full sm:w-auto"
                          disabled={checkoutLoading !== null}
                          onClick={() => startCheckout('monthly')}
                        >
                          {checkoutLoading === 'monthly' ? 'Redirecting…' : 'Upgrade to Pro — $9/month'}
                        </Button>
                        <Button
                          variant="outline"
                          className="w-full sm:w-auto"
                          disabled={checkoutLoading !== null}
                          onClick={() => startCheckout('annual')}
                        >
                          {checkoutLoading === 'annual' ? 'Redirecting…' : 'Get Annual — $79/year (save 27%)'}
                        </Button>
                      </div>
                    </>
                  ) : isPro ? (
                    <>
                      {initial.planExpiresAt && (
                        <p className="text-sm text-muted-foreground">
                          Renews: {new Date(initial.planExpiresAt).toLocaleDateString()}
                        </p>
                      )}
                      <p className="text-sm text-muted-foreground">Unlimited documents · No FileCurrent branding</p>
                      <Button variant="outline" size="sm" className="mt-3">
                        Cancel subscription
                      </Button>
                    </>
                  ) : null}
                </div>
                <Badge variant={isPro ? 'default' : 'secondary'} className={isPro ? 'bg-primary' : ''}>
                  {PLAN_LABELS[initial.plan]}
                </Badge>
              </div>
            </CardContent>
          </Card>

          {(isTrial || !isPro) && (
            <Card className="border-primary/20 bg-accent/30">
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <ShieldCheck className="h-4 w-4 text-primary" /> Launch Lifetime Deal
                </CardTitle>
                <CardDescription>Available for a limited time</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-3">
                  Pay once, use FileCurrent Pro forever. $49 one-time payment — limited to the first 90 days.
                </p>
                <Button
                  disabled={checkoutLoading !== null}
                  onClick={() => startCheckout('lifetime')}
                >
                  {checkoutLoading === 'lifetime' ? 'Redirecting…' : 'Get Lifetime Access — $49'}
                </Button>
              </CardContent>
            </Card>
          )}
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
