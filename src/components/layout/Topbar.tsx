'use client'

import { useState } from 'react'
import Link from 'next/link'
import { SignOut, GearSix, User } from '@phosphor-icons/react'
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
import { Badge } from '@/components/ui/badge'
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

const planLabels: Record<LayoutUser['plan'], string> = {
  trial: 'Trial',
  free: 'Free',
  pro_monthly: 'Pro',
  pro_annual: 'Pro Annual',
  lifetime: 'Lifetime',
}

export function Topbar({ user, onLogout }: TopbarProps) {
  const [confirmLogoutOpen, setConfirmLogoutOpen] = useState(false)

  return (
    <header className="fixed left-0 right-0 top-0 z-50 flex h-14 items-center justify-between border-b border-[#E6EBF1] bg-white px-4 shadow-sm">
      <Link href="/dashboard">
        <LogoFull className="text-[#0A2540]" />
      </Link>

      <div className="flex items-center gap-3">
        <Badge
          variant="secondary"
          className={
            user.plan === 'pro_monthly' || user.plan === 'pro_annual'
              ? 'bg-[#F0EFFF] text-[#635BFF] border border-[#C7C4FF]'
              : user.plan === 'lifetime'
              ? 'bg-[#F0FBF4] text-[#1DB954] border border-[#A3E6C0]'
              : 'bg-[#FFF9ED] text-[#E6A817] border border-[#FDD87A]'
          }
        >
          {planLabels[user.plan]}
        </Badge>

        <DropdownMenu>
          <DropdownMenuTrigger className="rounded-full outline-none ring-offset-background focus-visible:ring-2 focus-visible:ring-[#635BFF] focus-visible:ring-offset-2">
            <Avatar className="h-8 w-8">
              <AvatarFallback className="bg-[#635BFF] text-xs font-semibold text-white">
                {getInitials(user.fullName)}
              </AvatarFallback>
            </Avatar>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            <DropdownMenuLabel>{user.fullName}</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link href="/settings">
                <User className="mr-2 h-4 w-4" />
                Profile
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href="/settings">
                <GearSix className="mr-2 h-4 w-4" />
                Settings
              </Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              className="text-destructive focus:text-destructive"
              onSelect={(event) => {
                event.preventDefault()
                setConfirmLogoutOpen(true)
              }}
            >
              <SignOut className="mr-2 h-4 w-4" />
              Log out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <AlertDialog open={confirmLogoutOpen} onOpenChange={setConfirmLogoutOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure you want to log out?</AlertDialogTitle>
            <AlertDialogDescription>
              You will need to sign in again before accessing your FileCurrent workspace.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={onLogout}>Log out</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </header>
  )
}
