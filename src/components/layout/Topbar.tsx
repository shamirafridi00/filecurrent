'use client'

import { useState } from 'react'
import Link from 'next/link'
import { SignOut, GearSix, ChatCircle, Lightning } from '@phosphor-icons/react'
import { getInitials } from '@/lib/utils'
import type { LayoutUser } from './AppLayout'
import { LogoFull } from '@/components/logo/LogoMark'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

interface TopbarProps {
  user: LayoutUser
  onLogout: () => void
}

function PlanBadge({ user }: { user: LayoutUser }) {
  const base = 'inline-flex items-center whitespace-nowrap rounded-full border px-3 py-1 text-xs font-semibold'

  if (user.plan === 'trial') {
    const daysLeft = user.trialEndsAt
      ? Math.max(0, Math.ceil((new Date(user.trialEndsAt).getTime() - Date.now()) / 86400000))
      : 0
    return (
      <span className={`${base} bg-[#FFF9ED] text-[#E6A817] border-[#FDD87A]`}>
        Trial · {daysLeft} day{daysLeft !== 1 ? 's' : ''}
      </span>
    )
  }
  if (user.plan === 'free') {
    return <span className={`${base} bg-[#FFF9ED] text-[#E6A817] border-[#FDD87A]`}>Free</span>
  }
  if (user.plan === 'pro' || user.plan === 'pro_monthly' || user.plan === 'pro_annual') {
    return <span className={`${base} bg-[#F0EFFF] text-[#635BFF] border-[#C7C4FF]`}>Pro</span>
  }
  if (user.plan === 'lifetime') {
    return <span className={`${base} bg-[#F0FBF4] text-[#1DB954] border-[#A3E6C0]`}>Lifetime</span>
  }
  return null
}

function PlanStatusLine({ user }: { user: LayoutUser }) {
  if (user.plan === 'trial') {
    const daysLeft = user.trialEndsAt
      ? Math.max(0, Math.ceil((new Date(user.trialEndsAt).getTime() - Date.now()) / 86400000))
      : 0
    const expired = daysLeft === 0

    if (expired) {
      return (
        <span className="text-xs text-[#DF1B41]">Trial ended — upgrade to continue</span>
      )
    }
    if (daysLeft <= 2) {
      return (
        <span className="text-xs text-[#E6A817]">⚠ Trial ends in {daysLeft} day{daysLeft !== 1 ? 's' : ''}</span>
      )
    }
    return (
      <span className="text-xs text-muted-foreground">Trial — {daysLeft} day{daysLeft !== 1 ? 's' : ''} left</span>
    )
  }

  if (user.plan === 'pro') {
    return (
      <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
        <span className="h-1.5 w-1.5 rounded-full bg-[#635BFF]" />
        Pro
      </span>
    )
  }
  if (user.plan === 'pro_monthly') {
    return (
      <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
        <span className="h-1.5 w-1.5 rounded-full bg-[#635BFF]" />
        Pro Monthly
      </span>
    )
  }
  if (user.plan === 'pro_annual') {
    return (
      <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
        <span className="h-1.5 w-1.5 rounded-full bg-[#635BFF]" />
        Pro Annual
      </span>
    )
  }
  if (user.plan === 'lifetime') {
    return (
      <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
        <span className="h-1.5 w-1.5 rounded-full bg-[#1DB954]" />
        Lifetime Access
      </span>
    )
  }

  return null
}

function showUpgradeButton(user: LayoutUser): boolean {
  if (user.plan === 'pro' || user.plan === 'pro_monthly' || user.plan === 'pro_annual' || user.plan === 'lifetime') {
    return false
  }
  return true
}

export function Topbar({ user, onLogout }: TopbarProps) {
  const [confirmLogoutOpen, setConfirmLogoutOpen] = useState(false)

  return (
    <header className="fixed left-0 right-0 top-0 z-50 flex h-14 items-center justify-between border-b border-[#E6EBF1] bg-white px-4 shadow-sm">
      <div className="flex w-56 items-center">
        <Link href="/dashboard">
          <LogoFull size={28} />
        </Link>
      </div>

      <div className="flex items-center gap-3">
        <PlanBadge user={user} />

        <DropdownMenu>
          <DropdownMenuTrigger className="rounded-full outline-none ring-offset-background focus-visible:ring-2 focus-visible:ring-[#635BFF] focus-visible:ring-offset-2">
            <Avatar className="h-9 w-9 cursor-pointer">
              <AvatarFallback className="bg-[#635BFF] text-sm font-semibold text-white">
                {getInitials(user.fullName || user.email)}
              </AvatarFallback>
            </Avatar>
          </DropdownMenuTrigger>

          <DropdownMenuContent align="end" className="w-56">
            {/* Name + email */}
            <DropdownMenuLabel className="pb-0">
              <p className="font-semibold text-foreground leading-tight">{user.fullName}</p>
              <p className="text-xs font-normal text-muted-foreground truncate">{user.email}</p>
            </DropdownMenuLabel>

            {/* Plan status */}
            <div className="px-2 py-1.5">
              <PlanStatusLine user={user} />
            </div>

            <DropdownMenuSeparator />

            <DropdownMenuItem asChild>
              <Link href="/settings" className="cursor-pointer">
                <GearSix className="mr-2 h-4 w-4" />
                Settings
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href="/feedback" className="cursor-pointer">
                <ChatCircle className="mr-2 h-4 w-4" />
                Feedback
              </Link>
            </DropdownMenuItem>

            {showUpgradeButton(user) && (
              <>
                <DropdownMenuSeparator />
                <div className="px-2 py-1.5">
                  <Link
                    href="/trial-expired"
                    className="flex w-full items-center justify-center gap-1.5 rounded-md bg-[#635BFF] px-3 py-1.5 text-xs font-semibold text-white transition-colors hover:bg-[#5145E5]"
                  >
                    <Lightning size={12} weight="fill" />
                    Upgrade to Pro →
                  </Link>
                </div>
              </>
            )}

            <DropdownMenuSeparator />

            <DropdownMenuItem
              className="text-destructive focus:text-destructive cursor-pointer"
              onSelect={(e) => {
                e.preventDefault()
                setConfirmLogoutOpen(true)
              }}
            >
              <SignOut className="mr-2 h-4 w-4" />
              Sign out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <AlertDialog open={confirmLogoutOpen} onOpenChange={setConfirmLogoutOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Sign out of FileCurrent?</AlertDialogTitle>
            <AlertDialogDescription>
              You will need to sign in again to access your account.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              onClick={onLogout}
            >
              Sign Out
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </header>
  )
}
