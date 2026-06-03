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
      <Topbar user={user} onLogout={onLogout} />
      <Sidebar />
      <main className="ml-56 mt-14 min-h-[calc(100vh-56px)]">
        <div className="p-6">{children}</div>
      </main>
    </div>
  )
}
