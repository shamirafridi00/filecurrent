export const dynamic = 'force-dynamic'

import Link from 'next/link'
import { Plus, LayoutTemplate, Star } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { PageHeader, EmptyState } from '@/components/ui'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { getInvoiceTemplates } from '@/lib/db/supabase'

const THEME_LABELS: Record<string, string> = {
  summit: 'Summit — Minimal',
  aurora: 'Aurora — Gradient',
  ledger: 'Ledger — Classic',
}

export default async function InvoiceTemplatesPage() {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const templates = await getInvoiceTemplates(user.id)

  return (
    <div>
      <PageHeader
        title="Invoice Templates"
        subtitle="Control how your invoices look — logo, colors, and business info"
        icon={<LayoutTemplate size={24} />}
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
              icon={<LayoutTemplate size={40} />}
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
            <Card key={t.id} className="flex flex-col">
              {/* Color preview strip */}
              <div
                className="h-2 rounded-t-lg"
                style={{ backgroundColor: t.primaryColor }}
              />
              <CardHeader className="pb-2">
                <div className="flex items-start justify-between gap-2">
                  <CardTitle className="text-base">{t.name}</CardTitle>
                  {t.isDefault && (
                    <Badge className="shrink-0 bg-primary text-primary-foreground text-xs">
                      <Star className="mr-1 h-3 w-3" />
                      Default
                    </Badge>
                  )}
                </div>
                <CardDescription>
                  {THEME_LABELS[t.theme] ?? t.theme}
                  {t.brandName && ` · ${t.brandName}`}
                </CardDescription>
              </CardHeader>
              <CardContent className="flex flex-1 flex-col justify-between gap-3 pt-0">
                <div className="space-y-1 text-sm text-muted-foreground">
                  {t.defaultTaxRate > 0 && <p>Default tax: {t.defaultTaxRate}%</p>}
                  {t.defaultPaymentTerms && (
                    <p className="truncate">Terms: {t.defaultPaymentTerms}</p>
                  )}
                </div>
                <div className="flex gap-2 flex-wrap">
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
