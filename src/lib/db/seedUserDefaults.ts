import { adminClient } from '@/lib/supabase/admin'

export async function seedDefaultInvoiceTemplates(userId: string): Promise<void> {
  const defaults = [
    {
      user_id: userId,
      name: 'Clean',
      description: 'Minimal and professional. Great for most freelancers.',
      theme: 'summit',
      primary_color: '#635BFF',
      secondary_color: '#111827',
      is_default: true,
    },
    {
      user_id: userId,
      name: 'Bold',
      description: 'High-contrast dark header. Good for agencies and developers.',
      theme: 'ledger',
      primary_color: '#111827',
      secondary_color: '#635BFF',
      is_default: false,
    },
    {
      user_id: userId,
      name: 'Warm',
      description: 'Soft gradient style. Great for photographers and creatives.',
      theme: 'aurora',
      primary_color: '#7C3AED',
      secondary_color: '#111827',
      is_default: false,
    },
    {
      user_id: userId,
      name: 'Slate',
      description: 'Bold, brand-forward layout. Great for agencies and studios.',
      theme: 'slate',
      primary_color: '#0F172A',
      secondary_color: '#475569',
      is_default: false,
    },
    {
      user_id: userId,
      name: 'Ivory',
      description: 'Premium minimal layout. Great for consultants and designers.',
      theme: 'ivory',
      primary_color: '#635BFF',
      secondary_color: '#111827',
      is_default: false,
    },
  ]

  const { error } = await adminClient.from('invoice_templates').insert(defaults)
  if (error) console.error('Failed to seed default invoice templates:', error)
}

const NEW_THEME_DEFAULTS = {
  slate: {
    name: 'Slate',
    description: 'Bold, brand-forward layout. Great for agencies and studios.',
    theme: 'slate',
    primary_color: '#0F172A',
    secondary_color: '#475569',
    is_default: false,
  },
  ivory: {
    name: 'Ivory',
    description: 'Premium minimal layout. Great for consultants and designers.',
    theme: 'ivory',
    primary_color: '#635BFF',
    secondary_color: '#111827',
    is_default: false,
  },
} as const

export async function seedMissingThemes(userId: string, themes: ReadonlyArray<'slate' | 'ivory'>): Promise<void> {
  const rows = themes.map((theme) => ({ user_id: userId, ...NEW_THEME_DEFAULTS[theme] }))
  const { error } = await adminClient.from('invoice_templates').insert(rows)
  if (error) console.error('Failed to seed missing themes:', error)
}
