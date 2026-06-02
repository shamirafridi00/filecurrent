import { adminClient } from '@/lib/supabase/admin'

export async function seedDefaultInvoiceTemplates(userId: string): Promise<void> {
  const defaults = [
    {
      user_id: userId,
      name: 'Clean',
      description: 'Minimal and professional. Great for most freelancers.',
      theme: 'summit',
      primary_color: '#0F766E',
      secondary_color: '#111827',
      is_default: true,
    },
    {
      user_id: userId,
      name: 'Bold',
      description: 'High-contrast dark header. Good for agencies and developers.',
      theme: 'ledger',
      primary_color: '#111827',
      secondary_color: '#0F766E',
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
  ]

  const { error } = await adminClient.from('invoice_templates').insert(defaults)
  if (error) console.error('Failed to seed default invoice templates:', error)
}
