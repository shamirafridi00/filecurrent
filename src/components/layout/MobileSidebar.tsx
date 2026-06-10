'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { List, X, ChartLine, Bell, ClipboardText, CurrencyDollar, DownloadSimple, FileText, Note, SquaresFour, Receipt, UploadSimple, Users, Rows, Timer } from '@phosphor-icons/react'
import { cn } from '@/lib/utils'
import { LogoFull } from '@/components/logo/LogoMark'

const ICON_MAP = {
  Activity: ChartLine, Bell, ClipboardText, CurrencyDollar, Download: DownloadSimple, FileText,
  LayoutDashboard: SquaresFour, Note, Receipt, Timer, Upload: UploadSimple, Users,
}

type NavEntry =
  | { label: string; href: string; icon: keyof typeof ICON_MAP; sub?: never }
  | { label: string; href: string; icon?: never; sub: true }

const MAIN_NAV: NavEntry[] = [
  { label: 'Dashboard', href: '/dashboard', icon: 'LayoutDashboard' },
  { label: 'Clients', href: '/clients', icon: 'Users' },
  { label: 'Proposals', href: '/proposals', icon: 'Note' },
  { label: 'Contracts', href: '/contracts', icon: 'FileText' },
  { label: 'Templates', href: '/contracts/templates', sub: true },
  { label: 'Invoices', href: '/invoices', icon: 'Receipt' },
  { label: 'Templates', href: '/invoices/templates', sub: true },
  { label: 'Client Activity', href: '/client-activity', icon: 'Activity' },
  { label: 'Payment Reminders', href: '/reminders', icon: 'Bell' },
  { label: 'Expenses', href: '/expenses', icon: 'CurrencyDollar' },
  { label: 'Time Tracking', href: '/time-tracking', icon: 'Timer' },
  { label: 'Intake Forms', href: '/intake-forms', icon: 'ClipboardText' },
]

const TOOL_NAV: NavEntry[] = [
  { label: 'Export Data', href: '/exports', icon: 'Download' },
  { label: 'Import Clients', href: '/imports', icon: 'Upload' },
]

export function MobileSidebar() {
  const [open, setOpen] = useState(false)
  const pathname = usePathname()

  const isActive = (href: string) => {
    if (href === '/dashboard') return pathname === '/dashboard'
    return pathname === href || pathname.startsWith(href + '/')
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
        'fixed inset-y-0 left-0 z-50 w-64 bg-[#0A2540] transform transition-transform duration-200 md:hidden',
        open ? 'translate-x-0' : '-translate-x-full'
      )}>
        <div className="flex items-center justify-between p-4 border-b border-[#0D2D4A]">
          <LogoFull size={24} />
          <button
            onClick={() => setOpen(false)}
            className="text-[#8898AA] hover:text-white"
            aria-label="Close menu"
          >
            <X size={20} />
          </button>
        </div>

        <div className="overflow-y-auto p-3 pt-4 space-y-4">
          <nav className="space-y-0.5">
            {MAIN_NAV.map((item) => {
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
            })}
          </nav>

          <div className="border-t border-[#0D2D4A] pt-3">
            <nav className="space-y-0.5">
              {TOOL_NAV.map((item) => {
                const Icon = ICON_MAP[item.icon!]
                return (
                  <Link key={item.href} href={item.href} onClick={() => setOpen(false)}
                    className={cn(
                      'flex w-full items-center gap-3 rounded-md px-3 py-2.5 text-sm transition-colors',
                      isActive(item.href) ? 'bg-[#1A3A5C] text-white font-semibold' : 'text-[#8898AA] hover:bg-[#1A3A5C] hover:text-white'
                    )}>
                    <Icon size={18} />
                    <span>{item.label}</span>
                  </Link>
                )
              })}
            </nav>
          </div>
        </div>
      </div>
    </>
  )
}
