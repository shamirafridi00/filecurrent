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

  const finish = () => {
    if (!profession) return

    startTransition(async () => {
      setError('')
      try {
        await onComplete({
          profession,
          businessName: businessNameValue,
          fullName: fullNameValue,
          phone: phoneValue,
        })
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
              <DialogTitle>You&apos;re all set!</DialogTitle>
              <DialogDescription id="forced-modal-description">
                You have 5 days of full access — no credit card required.
              </DialogDescription>
            </DialogHeader>

            <div className="rounded-xl border border-[#C7C4FF] bg-[#F0EFFF] p-5 space-y-2">
              <p className="font-semibold text-[#0A2540]">Your 5-day free trial includes:</p>
              <ul className="space-y-1.5 text-sm text-[#5145E5]">
                <li>✓ Unlimited invoices &amp; contracts</li>
                <li>✓ E-signatures</li>
                <li>✓ Automated payment reminders</li>
                <li>✓ All invoice &amp; contract templates</li>
              </ul>
            </div>

            {error && <p className="text-sm text-destructive">{error}</p>}

            <DialogFooter>
              <Button variant="outline" disabled={isPending} onClick={() => setStep(2)}>
                Back
              </Button>
              <Button disabled={isPending} onClick={finish}>
                {isPending ? 'Setting up…' : 'Start My Trial →'}
              </Button>
            </DialogFooter>
          </>
        )}
      </DialogContent>
    </Dialog>
  )
}

