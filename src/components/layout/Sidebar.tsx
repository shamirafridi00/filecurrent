'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  ChartLine,
  Bell,
  DownloadSimple,
  FileText,
  SquaresFour,
  ChatCircle,
  Receipt,
  GearSix,
  UploadSimple,
  Users,
  Rows,
  Lightning,
} from '@phosphor-icons/react'
import { cn } from '@/lib/utils'
import type { LayoutUser } from './AppLayout'
import { LogoFullInverse } from '@/components/logo/LogoMark'

const ICON_MAP = {
  Activity: ChartLine,
  Bell,
  Download: DownloadSimple,
  FileText,
  LayoutDashboard: SquaresFour,
  MessageSquare: ChatCircle,
  Receipt,
  Settings: GearSix,
  Upload: UploadSimple,
  Users,
  LayoutTemplate: Rows,
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
            ? 'bg-[#0F766E] text-white font-medium'
            : 'text-[#a8c5c2] hover:bg-[#162b28] hover:text-white'
        )}
      >
        <Rows size={13} className="shrink-0" />
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
          ? 'bg-[#0F766E] text-white font-medium'
          : 'text-[#a8c5c2] hover:bg-[#162b28] hover:text-white'
      )}
    >
      <Icon size={18} weight={active ? 'fill' : 'regular'} className="shrink-0" />
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
      <p className="mb-2 px-3 text-xs font-semibold uppercase tracking-wider text-[#4a7c78]">
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
    <div className="rounded-lg border border-[#1a3330] bg-[#0a1917] p-3">
      <div className="mb-2 flex items-center justify-between">
        <span className="text-sm font-medium text-[#a8c5c2]">Free Plan</span>
        <span className="text-xs text-white">{used} / {limit}</span>
      </div>
      <div className="mb-3 h-1.5 w-full rounded-full bg-[#1a3330]">
        <div
          className="h-1.5 rounded-full bg-[#0F766E] transition-all"
          style={{ width: `${progress}%` }}
        />
      </div>
      <Link
        href="/pricing"
        className="flex w-full items-center justify-center gap-1.5 rounded-lg bg-[#0F766E] py-2 text-sm font-medium text-white transition-colors hover:bg-[#0d6b64]"
      >
        <Lightning size={13} weight="fill" />
        Upgrade to Pro
      </Link>
    </div>
  )
}

export function Sidebar({ user }: { user: LayoutUser }) {
  return (
    <aside className="fixed bottom-0 left-0 top-14 z-40 flex w-56 flex-col border-r border-[#1a3330] bg-[#0D1F1E]">
      <div className="sidebar-scroll flex-1 overflow-y-auto p-3">
        <div className="mb-5 px-1">
          <LogoFullInverse />
        </div>
        <div className="space-y-6">
          <NavSection title="Main Menu" items={MAIN_NAV} />
          <NavSection title="Tools" items={TOOL_NAV} />
          <NavSection title="Account" items={ACCOUNT_NAV} />
        </div>
      </div>
      <div className="border-t border-[#1a3330] p-3">
        <FreeUsage user={user} />
      </div>
    </aside>
  )
}
