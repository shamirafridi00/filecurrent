export const theme = {
  primary: '#635BFF',
  primaryDark: '#0D6B64',
  primaryLight: '#F0FDFA',
  success: '#16A34A',
  successBg: '#F0FDF4',
  warning: '#D97706',
  warningBg: '#FFFBEB',
  danger: '#DC2626',
  dangerBg: '#FEF2F2',
  info: '#2563EB',
  infoBg: '#EFF6FF',
  textPrimary: '#111827',
  textSecondary: '#6B7280',
  textMuted: '#9CA3AF',
  border: '#E5E7EB',
  background: '#FAFAFA',
  surface: '#FFFFFF',
  sidebar: '#FFFFFF',
} as const

export const APP_NAME = 'FileCurrent'

export const APP_DESCRIPTION = 'Contracts. Invoices. Signatures. Done.'

export const APP_TAGLINE = 'Contracts. Invoices. Signatures. Done.'

export const APP_URL = 'https://filecurrent.com'

// Must match the `profiles.trial_ends_at` DB default (now() + 5 days).
export const TRIAL_DAYS = 5

export const LIFETIME_PRICE = 49

export const DAILY_EMAIL_LIMIT = Number.POSITIVE_INFINITY

export const MAX_FEEDBACK_PER_DAY = 3

export const MAX_IMPORT_FILE_SIZE_MB = 10

export const MAIN_NAV_ITEMS = [
  { label: 'Dashboard', href: '/dashboard', icon: 'LayoutDashboard' },
  { label: 'Clients', href: '/clients', icon: 'Users' },
  { label: 'Contracts', href: '/contracts', icon: 'FileText' },
  { label: 'Invoices', href: '/invoices', icon: 'Receipt' },
  { label: 'Client Activity', href: '/client-activity', icon: 'Activity' },
  { label: 'Export Data', href: '/exports', icon: 'Download' },
  { label: 'Import Clients', href: '/imports', icon: 'Upload' },
  { label: 'Payment Reminders', href: '/reminders', icon: 'Bell' },
] as const

export const ACCOUNT_NAV_ITEMS = [
  { label: 'Settings', href: '/settings', icon: 'Settings' },
  { label: 'Feedback', href: '/feedback', icon: 'MessageSquare' },
] as const

export const SYSTEM_TEMPLATE_KEYS = [
  'default_due_3_days_before',
  'default_due_on_date',
  'manual_followup_generic',
  'default_overdue_7_days',
] as const

export const EMAIL_PLACEHOLDERS = [
  { key: '{{user_name}}', label: 'Freelancer name' },
  { key: '{{brand_name}}', label: 'Business name' },
  { key: '{{invoice_number}}', label: 'Invoice number' },
  { key: '{{invoice_amount}}', label: 'Total invoice amount' },
  { key: '{{invoice_balance}}', label: 'Outstanding amount' },
  { key: '{{due_date}}', label: 'Invoice due date (formatted)' },
  { key: '{{client_name}}', label: 'Client name' },
  { key: '{{client_company}}', label: 'Client company' },
  { key: '{{days_overdue}}', label: 'Number of days overdue' },
  { key: '{{payment_link}}', label: 'Secure payment page URL' },
  { key: '{{invoice_link}}', label: 'Public invoice view URL' },
  { key: '{{support_email}}', label: 'Support email address' },
  { key: '{{site_url}}', label: `${APP_NAME} URL` },
  { key: '{{today_date}}', label: "Today's date (formatted)" },
] as const

export const CONTRACT_PLACEHOLDERS = [
  { key: '{{client_name}}', label: "Client's full name" },
  { key: '{{client_company}}', label: "Client's company" },
  { key: '{{client_email}}', label: "Client's email" },
  { key: '{{freelancer_name}}', label: 'Your name' },
  { key: '{{freelancer_business}}', label: 'Your business name' },
  { key: '{{project_description}}', label: 'Project details' },
  { key: '{{rate}}', label: 'Contract amount' },
  { key: '{{currency}}', label: 'Currency code' },
  { key: '{{start_date}}', label: 'Contract start date' },
  { key: '{{end_date}}', label: 'Contract end date' },
  { key: '{{payment_terms}}', label: 'Payment terms' },
] as const

export const CONTRACT_STYLING_GUIDE = [
  { label: 'Bold', syntax: '**Important clause**' },
  { label: 'Italic', syntax: '__Confidential__' },
  { label: 'Underline', syntax: '__u:Notice required__' },
  { label: 'Section heading', syntax: '## Payment Terms' },
  { label: 'Subsection', syntax: '### Scope of Work' },
  { label: 'Bullet list', syntax: '- First point\n-- Sub point' },
  { label: 'Numbered list', syntax: '1. First item\n2. Second item' },
  { label: 'Divider', syntax: '---' },
] as const
