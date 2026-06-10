'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import {
  ChartBar,
  Briefcase,
  Camera,
  Code,
  DotsThree,
  FileText,
  Palette,
  PenNib,
  Receipt,
} from '@phosphor-icons/react'
import type { Profession } from '@/types'
import { TRIAL_DAYS } from '@/lib/constants'
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

const TOTAL_STEPS = 3

function StepDots({ step }: { step: number }) {
  return (
    <div className="flex items-center justify-center gap-1.5 pt-1" aria-label={`Step ${step} of ${TOTAL_STEPS}`}>
      {Array.from({ length: TOTAL_STEPS }, (_, i) => (
        <span
          key={i}
          className={cn(
            'h-1.5 rounded-full transition-all duration-200',
            i + 1 === step ? 'w-6 bg-primary' : 'w-1.5 bg-muted-foreground/30',
            i + 1 < step && 'bg-primary/50'
          )}
        />
      ))}
    </div>
  )
}

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
  const [firstDoc, setFirstDoc] = useState<'contract' | 'invoice'>('contract')
  const [error, setError] = useState('')
  const [isPending, startTransition] = useTransition()

  const complete = (destination?: string) => {
    startTransition(async () => {
      setError('')
      try {
        await onComplete({
          profession: profession ?? 'other',
          businessName: businessNameValue.trim() || fullNameValue.trim() || fullName,
          fullName: fullNameValue.trim() || fullName,
          phone: phoneValue,
        })
        if (destination) {
          router.push(destination)
        }
        router.refresh()
      } catch {
        setError('Could not save your setup. Please try again.')
      }
    })
  }

  const skipLink = (
    <button
      type="button"
      disabled={isPending}
      onClick={() => complete()}
      className="text-xs text-muted-foreground transition-colors hover:text-foreground"
    >
      Skip for now →
    </button>
  )

  return (
    <Dialog open>
      <DialogContent
        aria-describedby="forced-modal-description"
        className="max-w-2xl"
        onEscapeKeyDown={(event) => event.preventDefault()}
        onInteractOutside={(event) => event.preventDefault()}
      >
        <StepDots step={step} />

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

            <DialogFooter className="items-center gap-3 sm:justify-between">
              {skipLink}
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

            <DialogFooter className="items-center gap-3 sm:justify-between">
              {skipLink}
              <div className="flex gap-2">
                <Button variant="outline" onClick={() => setStep(1)}>
                  Back
                </Button>
                <Button
                  disabled={!businessNameValue.trim() || !fullNameValue.trim()}
                  onClick={() => setStep(3)}
                >
                  Next
                </Button>
              </div>
            </DialogFooter>
          </>
        )}

        {step === 3 && (
          <>
            <DialogHeader>
              <DialogTitle>Your first document</DialogTitle>
              <DialogDescription id="forced-modal-description">
                Which would you like to start with? Your {TRIAL_DAYS}-day free
                trial includes everything — no credit card required.
              </DialogDescription>
            </DialogHeader>

            <div className="grid gap-3 sm:grid-cols-2">
              <button
                type="button"
                onClick={() => setFirstDoc('contract')}
                className={cn(
                  'flex flex-col items-start gap-2 rounded-lg border bg-card p-5 text-left transition hover:bg-accent',
                  firstDoc === 'contract' && 'border-primary bg-accent'
                )}
              >
                <FileText className="h-6 w-6 text-primary" />
                <span className="font-semibold text-foreground">A Contract</span>
                <span className="text-sm text-muted-foreground">
                  Protect the engagement before work starts. Client signs online.
                </span>
              </button>
              <button
                type="button"
                onClick={() => setFirstDoc('invoice')}
                className={cn(
                  'flex flex-col items-start gap-2 rounded-lg border bg-card p-5 text-left transition hover:bg-accent',
                  firstDoc === 'invoice' && 'border-primary bg-accent'
                )}
              >
                <Receipt className="h-6 w-6 text-primary" />
                <span className="font-semibold text-foreground">An Invoice</span>
                <span className="text-sm text-muted-foreground">
                  Bill for finished work. Reminders chase payment automatically.
                </span>
              </button>
            </div>

            {error && <p className="text-sm text-destructive">{error}</p>}

            <DialogFooter className="items-center gap-3 sm:justify-between">
              {skipLink}
              <div className="flex gap-2">
                <Button variant="outline" disabled={isPending} onClick={() => setStep(2)}>
                  Back
                </Button>
                <Button
                  disabled={isPending}
                  onClick={() => complete(firstDoc === 'contract' ? '/contracts/new' : '/invoices/new')}
                >
                  {isPending
                    ? 'Setting up…'
                    : firstDoc === 'contract'
                      ? 'Create My First Contract →'
                      : 'Create My First Invoice →'}
                </Button>
              </div>
            </DialogFooter>
          </>
        )}
      </DialogContent>
    </Dialog>
  )
}
