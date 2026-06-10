'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  ChartLine,
  Bell,
  ClipboardText,
  CurrencyDollar,
  DownloadSimple,
  FileText,
  GearSix,
  SquaresFour,
  Receipt,
  UploadSimple,
  Users,
  Rows,
  Note,
  Timer,
} from '@phosphor-icons/react'
import { cn } from '@/lib/utils'
import { NAV_GROUPS, TOOL_NAV, type NavEntry } from './nav-items'

const ICON_MAP = {
  Activity: ChartLine,
  Bell,
  ClipboardText,
  CurrencyDollar,
  Download: DownloadSimple,
  FileText,
  LayoutDashboard: SquaresFour,
  Note,
  Receipt,
  Timer,
  Upload: UploadSimple,
  Users,
}

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

function useIsActive() {
  const pathname = usePathname()
  return (href: string) => {
    if (href === '/dashboard') return pathname === '/dashboard'
    return pathname === href || pathname.startsWith(href + '/')
  }
}

function GroupedNav() {
  const isActive = useIsActive()
  return (
    <nav>
      {NAV_GROUPS.map((group, gi) => (
        <div key={group.label ?? gi}>
          {group.label && (
            <p className="px-3 mb-1 mt-3 text-[10px] font-semibold uppercase tracking-wider text-[#4F6B8A]">
              {group.label}
            </p>
          )}
          <div className="space-y-0.5">
            {group.items.map((item) => (
              <NavItem key={item.href} entry={item} active={isActive(item.href)} />
            ))}
          </div>
        </div>
      ))}
    </nav>
  )
}

function ToolNav() {
  const isActive = useIsActive()
  return (
    <nav className="space-y-0.5">
      {TOOL_NAV.map((item) => (
        <NavItem key={item.href} entry={item} active={isActive(item.href)} />
      ))}
    </nav>
  )
}

function SettingsLink() {
  const pathname = usePathname()
  const active = pathname === '/settings' || pathname.startsWith('/settings/')

  return (
    <Link
      href="/settings"
      className={cn(
        'flex w-full items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors duration-150',
        active
          ? 'bg-[#1A3A5C] text-white font-semibold'
          : 'text-[#8898AA] hover:bg-[#1A3A5C] hover:text-white'
      )}
    >
      <GearSix
        size={18}
        weight={active ? 'fill' : 'regular'}
        className={cn('shrink-0', active && 'text-[#635BFF]')}
      />
      <span>Settings</span>
    </Link>
  )
}

export function Sidebar() {
  return (
    <aside className="fixed bottom-0 left-0 top-14 z-40 hidden md:flex w-56 flex-col border-r border-[#0D2D4A] bg-[#0A2540]">
      <div className="sidebar-scroll flex-1 overflow-y-auto p-3 pt-4">
        <div className="space-y-4">
          <GroupedNav />
          <div className="border-t border-[#0D2D4A] pt-3">
            <ToolNav />
          </div>
        </div>
      </div>
      <div className="shrink-0 border-t border-[#0D2D4A] p-3">
        <SettingsLink />
      </div>
    </aside>
  )
}
