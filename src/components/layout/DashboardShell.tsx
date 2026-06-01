'use client'

import { useRouter } from 'next/navigation'
import { AppLayout, type LayoutUser } from './AppLayout'

interface DashboardShellProps {
  children: React.ReactNode
  user: LayoutUser
}

export function DashboardShell({ children, user }: DashboardShellProps) {
  const router = useRouter()

  const handleLogout = async () => {
    router.push('/login')
    router.refresh()
  }

  return (
    <AppLayout user={user} onLogout={handleLogout}>
      {children}
    </AppLayout>
  )
}
