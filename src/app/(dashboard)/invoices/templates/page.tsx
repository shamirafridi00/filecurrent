export const dynamic = 'force-dynamic'

import Link from 'next/link'
import { Plus, Rows, Star } from '@/components/icons'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { PageHeader, EmptyState } from '@/components/ui'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { getInvoiceTemplates } from '@/lib/db/supabase'
import { seedDefaultInvoiceTemplates, seedMissingThemes } from '@/lib/db/seedUserDefaults'
import { SummitPreview, AuroraPreview, LedgerPreview, SlatePreview, IvoryPreview } from '@/components/invoices/InvoiceThemePreviews'

const THEME_LABELS: Record<string, string> = {
  summit: 'Summit — Minimal',
  aurora: 'Aurora — Gradient',
  ledger: 'Ledger — Classic',
  slate: 'Slate — Bold',
  ivory: 'Ivory — Premium',
}

function ThemePreview({ theme, primaryColor, brandName }: { theme: string; primaryColor: string; brandName?: string }) {
  const props = { primaryColor, brandName }
  if (theme === 'aurora') return <AuroraPreview {...props} />
  if (theme === 'ledger') return <LedgerPreview {...props} />
  if (theme === 'slate') return <SlatePreview {...props} />
  if (theme === 'ivory') return <IvoryPreview {...props} />
  return <SummitPreview {...props} />
}

export default async function InvoiceTemplatesPage() {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  let templates = await getInvoiceTemplates(user.id)

  // Seed all defaults if user has none
  if (templates.length === 0) {
    try { await seedDefaultInvoiceTemplates(user.id) } catch {}
    templates = await getInvoiceTemplates(user.id)
  } else {
    // For existing users: add Slate and Ivory if they don't have them yet
    const existingThemes = new Set(templates.map((t) => t.theme))
    const missingThemes = (['slate', 'ivory'] as const).filter((th) => !existingThemes.has(th))
    if (missingThemes.length > 0) {
      try {
        await seedMissingThemes(user.id, missingThemes)
      } catch (err) {
        console.error('[templates page] seedMissingThemes failed:', err)
      }
      templates = await getInvoiceTemplates(user.id)
    }
  }

  return (
    <div>
      <PageHeader
        title="Invoice Templates"
        subtitle="Control how your invoices look — logo, colors, and business info"
        icon={<Rows size={24} />}
        action={
          <Button asChild>
            <Link href="/invoices/templates/new">
              <Plus className="mr-1 h-4 w-4" />
              New Template
            </Link>
          </Button>
        }
      />

      {templates.length === 0 ? (
        <Card>
          <CardContent className="p-8">
            <EmptyState
              icon={<Rows size={40} />}
              title="No invoice templates yet"
              description="Your invoice template controls how your invoice looks — logo, colors, and business info."
              action={
                <Button asChild>
                  <Link href="/invoices/templates/new">Create Your First Template</Link>
                </Button>
              }
            />
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {templates.map((t) => (
            <Card key={t.id} className="flex flex-col overflow-hidden">
              {/* Theme preview thumbnail */}
              <div className="h-32 overflow-hidden bg-white border-b">
                <ThemePreview
                  theme={t.theme}
                  primaryColor={t.primaryColor}
                  brandName={t.brandName ?? undefined}
                />
              </div>
              <CardContent className="flex flex-1 flex-col justify-between gap-3 p-4">
                <div>
                  <div className="flex items-start justify-between gap-2 mb-1">
                    <p className="font-semibold text-sm">{t.name}</p>
                    {t.isDefault && (
                      <Badge className="shrink-0 bg-primary text-primary-foreground text-xs">
                        <Star className="mr-1 h-3 w-3" />
                        Default
                      </Badge>
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground">{THEME_LABELS[t.theme] ?? t.theme}</p>
                </div>
                <div className="flex gap-2">
                  <Button asChild variant="outline" size="sm">
                    <Link href={`/invoices/templates/${t.id}/edit`}>Edit</Link>
                  </Button>
                  <Button asChild size="sm" className="flex-1">
                    <Link href={`/invoices/new?templateId=${t.id}`}>Use Template</Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
