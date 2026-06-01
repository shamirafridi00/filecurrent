'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  Activity,
  Bell,
  Download,
  FileText,
  LayoutDashboard,
  MessageSquare,
  Receipt,
  Settings,
  Upload,
  Users,
  LayoutTemplate,
} from 'lucide-react'
import { APP_NAME } from '@/lib/constants'
import { cn } from '@/lib/utils'
import type { LayoutUser } from './AppLayout'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'

const ICON_MAP = {
  Activity,
  Bell,
  Download,
  FileText,
  LayoutDashboard,
  MessageSquare,
  Receipt,
  Settings,
  Upload,
  Users,
  LayoutTemplate,
}

type NavEntry =
  | { label: string; href: string; icon: keyof typeof ICON_MAP; sub?: never }
  | { label: string; href: string; icon?: never; sub: true }

const MAIN_NAV: NavEntry[] = [
  { label: 'Dashboard', href: '/dashboard', icon: 'LayoutDashboard' },
  { label: 'Clients', href: '/clients', icon: 'Users' },
  { label: 'Contracts', href: '/contracts', icon: 'FileText' },
  { label: 'Templates', href: '/contracts/templates', sub: true },
  { label: 'Invoices', href: '/invoices', icon: 'Receipt' },
  { label: 'Templates', href: '/invoices/templates', sub: true },
  { label: 'Client Activity', href: '/client-activity', icon: 'Activity' },
  { label: 'Payment Reminders', href: '/reminders', icon: 'Bell' },
]

const TOOL_NAV: NavEntry[] = [
  { label: 'Export Data', href: '/exports', icon: 'Download' },
  { label: 'Import Clients', href: '/imports', icon: 'Upload' },
]

const ACCOUNT_NAV: NavEntry[] = [
  { label: 'Settings', href: '/settings', icon: 'Settings' },
  { label: 'Feedback', href: '/feedback', icon: 'MessageSquare' },
]

function NavItem({ entry, active }: { entry: NavEntry; active: boolean }) {
  if (entry.sub) {
    return (
      <Link
        href={entry.href}
        className={cn(
          'flex w-full items-center gap-2 rounded-md py-1.5 pl-9 pr-3 text-xs transition-colors',
          active
            ? 'font-medium text-primary'
            : 'text-muted-foreground hover:text-foreground'
        )}
      >
        <LayoutTemplate size={13} className="shrink-0" />
        <span>{entry.label}</span>
      </Link>
    )
  }

  const Icon = ICON_MAP[entry.icon]

  return (
    <Link
      href={entry.href}
      className={cn(
        'flex w-full items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors',
        active
          ? 'bg-accent font-medium text-primary'
          : 'text-muted-foreground hover:bg-muted hover:text-foreground'
      )}
    >
      <Icon size={18} className="shrink-0" />
      <span>{entry.label}</span>
    </Link>
  )
}

function NavSection({ title, items }: { title: string; items: NavEntry[] }) {
  const pathname = usePathname()
  const isActive = (href: string) => {
    if (href === '/dashboard') return pathname === '/dashboard'
    return pathname === href || pathname.startsWith(href + '/')
  }

  return (
    <div>
      <p className="mb-2 px-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
        {title}
      </p>
      <nav className="space-y-0.5">
        {items.map((item) => (
          <NavItem key={item.href} entry={item} active={isActive(item.href)} />
        ))}
      </nav>
    </div>
  )
}

function FreeUsage({ user }: { user: LayoutUser }) {
  if (user.plan !== 'free') return null

  const used = user.docsUsedThisMonth ?? 0
  const limit = user.monthlyDocLimit ?? 3
  const progress = Math.min((used / limit) * 100, 100)

  return (
    <div className="rounded-lg border bg-card p-3">
      <div className="mb-2 flex items-center justify-between text-sm">
        <span className="font-medium">Free Plan</span>
        <span className="text-muted-foreground">
          {used} / {limit}
        </span>
      </div>
      <Progress value={progress} className="mb-3 h-2" />
      <Button asChild size="sm" className="w-full">
        <Link href="/pricing">Upgrade to Pro</Link>
      </Button>
    </div>
  )
}

export function Sidebar({ user }: { user: LayoutUser }) {
  return (
    <aside className="fixed bottom-0 left-0 top-14 z-40 flex w-56 flex-col border-r bg-card">
      <div className="flex-1 overflow-y-auto p-3">
        <div className="mb-5 px-3 text-xs font-medium text-muted-foreground">
          {APP_NAME} workspace
        </div>
        <div className="space-y-6">
          <NavSection title="Main Menu" items={MAIN_NAV} />
          <NavSection title="Tools" items={TOOL_NAV} />
          <NavSection title="Account" items={ACCOUNT_NAV} />
        </div>
      </div>
      <div className="p-3">
        <FreeUsage user={user} />
      </div>
    </aside>
  )
}
