'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  ChartLine,
  Bell,
  DownloadSimple,
  FileText,
  SquaresFour,
  Receipt,
  UploadSimple,
  Users,
  Rows,
} from '@phosphor-icons/react'
import { cn } from '@/lib/utils'
import { LogoFullInverse } from '@/components/logo/LogoMark'

const ICON_MAP = {
  Activity: ChartLine,
  Bell,
  Download: DownloadSimple,
  FileText,
  LayoutDashboard: SquaresFour,
  Receipt,
  Upload: UploadSimple,
  Users,
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

function NavItem({ entry, active }: { entry: NavEntry; active: boolean }) {
  if (entry.sub) {
    return (
      <Link
        href={entry.href}
        className={cn(
          'flex w-full items-center gap-2 rounded-md py-1.5 pl-9 pr-3 text-xs transition-colors duration-150',
          active
            ? 'bg-[#1A3A5C] text-white font-semibold'
            : 'text-[#8898AA] hover:bg-[#1A3A5C] hover:text-white'
        )}
      >
        <Rows size={13} className={cn('shrink-0', active && 'text-[#635BFF]')} />
        <span>{entry.label}</span>
      </Link>
    )
  }

  const Icon = ICON_MAP[entry.icon]

  return (
    <Link
      href={entry.href}
      className={cn(
        'flex w-full items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors duration-150',
        active
          ? 'bg-[#1A3A5C] text-white font-semibold'
          : 'text-[#8898AA] hover:bg-[#1A3A5C] hover:text-white'
      )}
    >
      <Icon
        size={18}
        weight={active ? 'fill' : 'regular'}
        className={cn('shrink-0', active ? 'text-[#635BFF]' : '')}
      />
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
      <p className="mb-2 px-3 text-[10px] font-semibold uppercase tracking-widest text-[#4F6B8A]">
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

export function Sidebar() {
  return (
    <aside className="fixed bottom-0 left-0 top-14 z-40 flex w-56 flex-col border-r border-[#0D2D4A] bg-[#0A2540]">
      <div className="sidebar-scroll flex-1 overflow-y-auto p-3">
        <div className="mb-5 px-1">
          <LogoFullInverse size={28} />
        </div>
        <div className="space-y-6">
          <NavSection title="Main Menu" items={MAIN_NAV} />
          <NavSection title="Tools" items={TOOL_NAV} />
        </div>
      </div>
    </aside>
  )
}
