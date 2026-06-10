'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { List, X, ChartLine, Bell, ClipboardText, CurrencyDollar, DownloadSimple, FileText, Note, SquaresFour, Receipt, UploadSimple, Users, Rows, Timer } from '@phosphor-icons/react'
import { cn } from '@/lib/utils'
import { LogoFull } from '@/components/logo/LogoMark'
import { NAV_GROUPS, TOOL_NAV, type NavEntry } from './nav-items'

const ICON_MAP = {
  Activity: ChartLine, Bell, ClipboardText, CurrencyDollar, Download: DownloadSimple, FileText,
  LayoutDashboard: SquaresFour, Note, Receipt, Timer, Upload: UploadSimple, Users,
}

export function MobileSidebar() {
  const [open, setOpen] = useState(false)
  const pathname = usePathname()

  const isActive = (href: string) => {
    if (href === '/dashboard') return pathname === '/dashboard'
    return pathname === href || pathname.startsWith(href + '/')
  }

  const renderEntry = (item: NavEntry) => {
    if (item.sub) {
      return (
        <Link key={item.href} href={item.href} onClick={() => setOpen(false)}
          className={cn(
            'flex w-full items-center gap-2 rounded-md py-1.5 pl-9 pr-3 text-xs transition-colors',
            isActive(item.href) ? 'bg-[#1A3A5C] text-white font-semibold' : 'text-[#8898AA] hover:bg-[#1A3A5C] hover:text-white'
          )}>
          <Rows size={13} />
          <span>{item.label}</span>
        </Link>
      )
    }
    const Icon = ICON_MAP[item.icon]
    return (
      <Link key={item.href} href={item.href} onClick={() => setOpen(false)}
        className={cn(
          'flex w-full items-center gap-3 rounded-md px-3 py-2.5 text-sm transition-colors',
          isActive(item.href) ? 'bg-[#1A3A5C] text-white font-semibold' : 'text-[#8898AA] hover:bg-[#1A3A5C] hover:text-white'
        )}>
        <Icon size={18} weight={isActive(item.href) ? 'fill' : 'regular'}
          className={cn('shrink-0', isActive(item.href) && 'text-[#635BFF]')} />
        <span>{item.label}</span>
      </Link>
    )
  }

  return (
    <>
      {/* Hamburger button — shown in Topbar on mobile */}
      <button
        onClick={() => setOpen(true)}
        className="flex h-9 w-9 items-center justify-center rounded-md text-muted-foreground hover:bg-muted md:hidden"
        aria-label="Open menu"
      >
        <List size={22} />
      </button>

      {/* Overlay */}
      {open && (
        <div
          className="fixed inset-0 z-50 bg-black/50 md:hidden"
          onClick={() => setOpen(false)}
        />
      )}

      {/* Drawer */}
      <div className={cn(
        'fixed inset-y-0 left-0 z-50 w-64 bg-[#0A2540] transform transition-transform duration-200 md:hidden flex flex-col',
        open ? 'translate-x-0' : '-translate-x-full'
      )}>
        <div className="flex items-center justify-between p-4 border-b border-[#0D2D4A] shrink-0">
          <LogoFull size={24} />
          <button
            onClick={() => setOpen(false)}
            className="text-[#8898AA] hover:text-white"
            aria-label="Close menu"
          >
            <X size={20} />
          </button>
        </div>

        <div className="overflow-y-auto flex-1 p-3 pt-4 space-y-4">
          <nav>
            {NAV_GROUPS.map((group, gi) => (
              <div key={group.label ?? gi}>
                {group.label && (
                  <p className="px-3 mb-1 mt-3 text-[10px] font-semibold uppercase tracking-wider text-[#4F6B8A]">
                    {group.label}
                  </p>
                )}
                <div className="space-y-0.5">
                  {group.items.map(renderEntry)}
                </div>
              </div>
            ))}
          </nav>

          <div className="border-t border-[#0D2D4A] pt-3">
            <nav className="space-y-0.5">
              {TOOL_NAV.map(renderEntry)}
            </nav>
          </div>
        </div>
      </div>
    </>
  )
}
