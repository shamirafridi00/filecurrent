'use client'

import { useState } from 'react'
import { LogOut, Settings, User } from 'lucide-react'
import { APP_NAME } from '@/lib/constants'
import { getInitials } from '@/lib/utils'
import type { LayoutUser } from './AppLayout'
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
  free: 'Free',
  pro_monthly: 'Pro',
  pro_annual: 'Pro Annual',
  lifetime: 'Lifetime',
}

export function Topbar({ user, onLogout }: TopbarProps) {
  const [confirmLogoutOpen, setConfirmLogoutOpen] = useState(false)

  return (
    <header className="fixed left-0 right-0 top-0 z-50 flex h-14 items-center justify-between border-b bg-card px-4">
      <div className="flex items-center gap-2">
        <div className="flex h-8 w-8 items-center justify-center rounded-md bg-primary text-xs font-bold text-primary-foreground">
          FC
        </div>
        <span className="text-sm font-bold text-foreground">{APP_NAME}</span>
      </div>

      <div className="flex items-center gap-3">
        <Badge variant={user.plan === 'free' ? 'secondary' : 'default'}>
          {planLabels[user.plan]}
        </Badge>

        <DropdownMenu>
          <DropdownMenuTrigger className="rounded-full outline-none ring-offset-background focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2">
            <Avatar className="h-8 w-8">
              <AvatarFallback className="bg-primary text-xs font-semibold text-primary-foreground">
                {getInitials(user.fullName)}
              </AvatarFallback>
            </Avatar>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            <DropdownMenuLabel>{user.fullName}</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <User className="mr-2 h-4 w-4" />
              Profile
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Settings className="mr-2 h-4 w-4" />
              Settings
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              className="text-destructive focus:text-destructive"
              onSelect={(event) => {
                event.preventDefault()
                setConfirmLogoutOpen(true)
              }}
            >
              <LogOut className="mr-2 h-4 w-4" />
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
