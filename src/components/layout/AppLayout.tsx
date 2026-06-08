'use client'

import { Sidebar } from './Sidebar'
import { Topbar } from './Topbar'
import type { Plan } from '@/types'

export interface LayoutUser {
  fullName: string
  email: string
  plan: Plan
  trialEndsAt?: string | null
}

interface AppLayoutProps {
  children: React.ReactNode
  user: LayoutUser
  onLogout: () => void
}

export function AppLayout({ children, user, onLogout }: AppLayoutProps) {
  return (
    <div className="min-h-screen bg-background">
      <Sidebar />
      <Topbar user={user} onLogout={onLogout} />
      <main className="ml-0 md:ml-56 pt-14 min-h-screen">
        <div className="p-6">{children}</div>
      </main>
    </div>
  )
}
