'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import {
  ChartBar,
  Briefcase,
  Camera,
  Code,
  DotsThree,
  Palette,
  PenNib,
} from '@phosphor-icons/react'
import type { Profession } from '@/types'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { cn } from '@/lib/utils'

interface OnboardingModalProps {
  firstName: string
  fullName: string
  email: string
  businessName?: string | null
  phone?: string | null
  onComplete: (input: {
    profession: Profession
    businessName: string
    fullName: string
    phone?: string
    plan: 'free' | 'pro_monthly'
  }) => Promise<{ checkoutUrl: string | null }>
}

const professions: Array<{
  value: Profession
  label: string
  icon: React.ComponentType<{ className?: string }>
}> = [
  { value: 'web_developer', label: 'Web Developer', icon: Code },
  { value: 'photographer', label: 'Photographer', icon: Camera },
  { value: 'consultant', label: 'Consultant', icon: Briefcase },
  { value: 'designer', label: 'Designer', icon: Palette },
  { value: 'copywriter', label: 'Copywriter', icon: PenNib },
  { value: 'marketer', label: 'Marketer', icon: ChartBar },
  { value: 'other', label: 'Other', icon: DotsThree },
]

export function OnboardingModal({
  firstName,
  fullName,
  email,
  businessName,
  phone,
  onComplete,
}: OnboardingModalProps) {
  const router = useRouter()
  const [step, setStep] = useState(1)
  const [profession, setProfession] = useState<Profession | null>(null)
  const [businessNameValue, setBusinessNameValue] = useState(businessName || '')
  const [fullNameValue, setFullNameValue] = useState(fullName)
  const [phoneValue, setPhoneValue] = useState(phone || '')
  const [error, setError] = useState('')
  const [isPending, startTransition] = useTransition()

  const finish = (plan: 'free' | 'pro_monthly') => {
    if (!profession) return

    startTransition(async () => {
      setError('')
      try {
        const result = await onComplete({
          profession,
          businessName: businessNameValue,
          fullName: fullNameValue,
          phone: phoneValue,
          plan,
        })

        if (result.checkoutUrl) {
          window.location.href = result.checkoutUrl
          return
        }

        router.refresh()
      } catch {
        setError('Could not save onboarding. Please try again.')
      }
    })
  }

  return (
    <Dialog open>
      <DialogContent
        aria-describedby="forced-modal-description"
        className="max-w-2xl"
        onEscapeKeyDown={(event) => event.preventDefault()}
        onInteractOutside={(event) => event.preventDefault()}
      >
        {step === 1 && (
          <>
            <DialogHeader>
              <DialogTitle>Welcome to FileCurrent, {firstName}!</DialogTitle>
              <DialogDescription id="forced-modal-description">
                Tell us what kind of work you do so we can set up the right templates.
              </DialogDescription>
            </DialogHeader>

            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {professions.map((item) => {
                const Icon = item.icon
                const selected = profession === item.value

                return (
                  <button
                    key={item.value}
                    type="button"
                    className={cn(
                      'flex items-center gap-3 rounded-lg border bg-card p-4 text-left transition hover:bg-accent',
                      selected && 'border-primary bg-accent text-primary'
                    )}
                    onClick={() => setProfession(item.value)}
                  >
                    <Icon className="h-5 w-5" />
                    <span className="font-medium">{item.label}</span>
                  </button>
                )
              })}
            </div>

            <DialogFooter>
              <Button disabled={!profession} onClick={() => setStep(2)}>
                Next
              </Button>
            </DialogFooter>
          </>
        )}

        {step === 2 && (
          <>
            <DialogHeader>
              <DialogTitle>Set up your business profile</DialogTitle>
              <DialogDescription id="forced-modal-description">
                These details appear on your contracts and invoices.
              </DialogDescription>
            </DialogHeader>

            <div className="grid gap-4">
              <div className="space-y-2">
                <Label htmlFor="business-name">Business Name</Label>
                <Input
                  id="business-name"
                  value={businessNameValue}
                  onChange={(event) => setBusinessNameValue(event.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="full-name">Your Full Name</Label>
                <Input
                  id="full-name"
                  value={fullNameValue}
                  onChange={(event) => setFullNameValue(event.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" value={email} readOnly />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Phone (optional)</Label>
                <Input
                  id="phone"
                  value={phoneValue}
                  onChange={(event) => setPhoneValue(event.target.value)}
                />
              </div>
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={() => setStep(1)}>
                Back
              </Button>
              <Button
                disabled={!businessNameValue.trim() || !fullNameValue.trim()}
                onClick={() => setStep(3)}
              >
                Next
              </Button>
            </DialogFooter>
          </>
        )}

        {step === 3 && (
          <>
            <DialogHeader>
              <DialogTitle>You&apos;re all set. Choose how to get started.</DialogTitle>
              <DialogDescription id="forced-modal-description">
                No credit card required for the free tier.
              </DialogDescription>
            </DialogHeader>

            <div className="grid gap-4 md:grid-cols-2">
              <PlanCard
                title="Free"
                price="$0"
                features={[
                  '3 documents/month',
                  'All templates',
                  'E-signatures',
                  'FileCurrent branding',
                ]}
                action="Start for free"
                loading={isPending}
                onClick={() => finish('free')}
              />
              <PlanCard
                highlighted
                title="Pro"
                price="$9/month"
                features={[
                  'Unlimited documents',
                  'No FileCurrent branding',
                  'Automated reminders',
                  'Priority support',
                ]}
                action="Start Pro Trial"
                loading={isPending}
                onClick={() => finish('pro_monthly')}
              />
            </div>
            {error && <p className="text-sm text-destructive">{error}</p>}

            <DialogFooter>
              <Button variant="outline" disabled={isPending} onClick={() => setStep(2)}>
                Back
              </Button>
            </DialogFooter>
          </>
        )}
      </DialogContent>
    </Dialog>
  )
}

function PlanCard({
  title,
  price,
  features,
  action,
  highlighted,
  loading,
  onClick,
}: {
  title: string
  price: string
  features: string[]
  action: string
  highlighted?: boolean
  loading?: boolean
  onClick: () => void
}) {
  return (
    <div
      className={cn(
        'rounded-lg border bg-card p-5',
        highlighted && 'border-primary shadow-sm'
      )}
    >
      <div className="mb-4">
        <h3 className="font-semibold">{title}</h3>
        <p className="mt-1 text-2xl font-bold">{price}</p>
      </div>
      <ul className="mb-5 space-y-2 text-sm text-muted-foreground">
        {features.map((feature) => (
          <li key={feature}>{feature}</li>
        ))}
      </ul>
      <Button className="w-full" variant={highlighted ? 'default' : 'outline'} disabled={loading} onClick={onClick}>
        {action}
      </Button>
    </div>
  )
}
