// Shared navigation config for Sidebar (desktop) and MobileSidebar (drawer).
// Icon names map to ICON_MAP in each sidebar component.

export type NavEntry =
  | { label: string; href: string; icon: NavIconName; sub?: never }
  | { label: string; href: string; icon?: never; sub: true }

export type NavIconName =
  | 'Activity'
  | 'Bell'
  | 'ClipboardText'
  | 'CurrencyDollar'
  | 'Download'
  | 'FileText'
  | 'LayoutDashboard'
  | 'Note'
  | 'Receipt'
  | 'Timer'
  | 'Upload'
  | 'Users'

export interface NavGroup {
  label: string | null
  items: NavEntry[]
}

export const NAV_GROUPS: NavGroup[] = [
  {
    label: null,
    items: [
      { label: 'Dashboard', href: '/dashboard', icon: 'LayoutDashboard' },
    ],
  },
  {
    label: 'Clients',
    items: [
      { label: 'Clients', href: '/clients', icon: 'Users' },
      { label: 'Proposals', href: '/proposals', icon: 'Note' },
      { label: 'Intake Forms', href: '/intake-forms', icon: 'ClipboardText' },
    ],
  },
  {
    label: 'Money',
    items: [
      { label: 'Contracts', href: '/contracts', icon: 'FileText' },
      { label: 'Templates', href: '/contracts/templates', sub: true },
      { label: 'Invoices', href: '/invoices', icon: 'Receipt' },
      { label: 'Templates', href: '/invoices/templates', sub: true },
    ],
  },
  {
    label: 'Track',
    items: [
      { label: 'Time Tracking', href: '/time-tracking', icon: 'Timer' },
      { label: 'Expenses', href: '/expenses', icon: 'CurrencyDollar' },
      { label: 'Client Activity', href: '/client-activity', icon: 'Activity' },
    ],
  },
  {
    label: 'Communicate',
    items: [
      { label: 'Payment Reminders', href: '/reminders', icon: 'Bell' },
    ],
  },
]

export const TOOL_NAV: NavEntry[] = [
  { label: 'Export Data', href: '/exports', icon: 'Download' },
  { label: 'Import Clients', href: '/imports', icon: 'Upload' },
]
