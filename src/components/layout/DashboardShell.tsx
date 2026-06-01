'use client'

import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { AppLayout, type LayoutUser } from './AppLayout'

interface DashboardShellProps {
  children: React.ReactNode
  user: LayoutUser
}

export function DashboardShell({ children, user }: DashboardShellProps) {
  const router = useRouter()

  const handleLogout = async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push('/login')
    router.refresh()
  }

  return (
    <AppLayout user={user} onLogout={handleLogout}>
      {children}
    </AppLayout>
  )
}
