'use client'

import { Zap, Star } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog'

interface Props {
  open: boolean
  onClose: () => void
  used?: number
  limit?: number
}

export function UpgradePrompt({ open, onClose, used = 3, limit = 3 }: Props) {
  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Zap className="h-5 w-5 text-primary" />
            You&apos;ve used your {limit} free documents this month
          </DialogTitle>
          <DialogDescription>
            Upgrade to Pro to create unlimited documents, remove FileCurrent branding,
            and unlock automated payment reminders.
          </DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-2 gap-3 py-2">
          <div className="rounded-lg border p-4 space-y-3">
            <div>
              <p className="font-semibold">$9 / month</p>
              <p className="text-xs text-muted-foreground">Monthly Pro</p>
            </div>
            <ul className="space-y-1 text-xs text-muted-foreground">
              <li>✓ Unlimited documents</li>
              <li>✓ No FileCurrent branding</li>
              <li>✓ Automated reminders</li>
              <li>✓ Priority support</li>
            </ul>
            <Button
              asChild
              size="sm"
              className="w-full"
            >
              <a href={process.env.NEXT_PUBLIC_LEMONSQUEEZY_MONTHLY_URL ?? '/pricing'}>
                Upgrade Now
              </a>
            </Button>
          </div>

          <div className="rounded-lg border-2 border-primary bg-accent/20 p-4 space-y-3">
            <div>
              <div className="flex items-center gap-1 mb-1">
                <Star className="h-3.5 w-3.5 text-primary" />
                <span className="text-xs font-medium text-primary">Best Value</span>
              </div>
              <p className="font-semibold">$79 / year</p>
              <p className="text-xs text-muted-foreground">Annual Pro · Save 27%</p>
            </div>
            <ul className="space-y-1 text-xs text-muted-foreground">
              <li>✓ Everything in Monthly</li>
              <li>✓ Save $29/year</li>
              <li>✓ Invoice analytics</li>
            </ul>
            <Button
              asChild
              size="sm"
              className="w-full"
            >
              <a href={process.env.NEXT_PUBLIC_LEMONSQUEEZY_ANNUAL_URL ?? '/pricing'}>
                Get Annual
              </a>
            </Button>
          </div>
        </div>

        <p className="text-center text-xs text-muted-foreground">
          No credit card required for free tier.
        </p>

        <Button variant="ghost" size="sm" className="w-full" onClick={onClose}>
          Maybe later
        </Button>
      </DialogContent>
    </Dialog>
  )
}
