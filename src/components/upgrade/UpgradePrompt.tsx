'use client'

import { Lightning, Star } from '@phosphor-icons/react'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog'
import { useCheckout } from '@/hooks/useCheckout'

interface Props {
  open: boolean
  onClose: () => void
}

export function UpgradePrompt({ open, onClose }: Props) {
  const { startCheckout, loading } = useCheckout()

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Lightning className="h-5 w-5 text-primary" />
            Your free trial has ended
          </DialogTitle>
          <DialogDescription>
            Upgrade to Pro to continue using FileCurrent — unlimited documents,
            no branding, and automated payment reminders.
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
              size="sm"
              className="w-full"
              disabled={loading !== null}
              onClick={() => startCheckout('monthly')}
            >
              {loading === 'monthly' ? 'Redirecting…' : 'Upgrade Now'}
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
              size="sm"
              className="w-full"
              disabled={loading !== null}
              onClick={() => startCheckout('annual')}
            >
              {loading === 'annual' ? 'Redirecting…' : 'Get Annual'}
            </Button>
          </div>
        </div>

        <p className="text-center text-xs text-muted-foreground">
          Questions? Email support@filecurrent.com
        </p>

        <Button variant="outline" size="sm" className="w-full border-border text-muted-foreground hover:text-foreground hover:bg-muted" onClick={onClose}>
          Maybe later
        </Button>
      </DialogContent>
    </Dialog>
  )
}
