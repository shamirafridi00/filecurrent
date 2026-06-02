export const dynamic = 'force-dynamic'

import Link from 'next/link'
import { Plus, Rows, Globe, Star } from '@/components/icons'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { PageHeader, EmptyState, GlobalBadge } from '@/components/ui'
import { truncate, formatDate } from '@/lib/utils'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { getCurrentProfile, getContractTemplates } from '@/lib/db/supabase'
import { TemplatePreviewDialog } from '@/components/contracts/TemplatePreviewDialog'

export default async function ContractTemplatesPage() {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const profile = await getCurrentProfile(user.id)
  const { my, global } = await getContractTemplates(user.id, profile.profession)

  return (
    <div>
      <PageHeader
        title="Contract Templates"
        subtitle="Browse profession-matched templates or create your own"
        icon={<Rows size={24} />}
        action={
          <Button asChild>
            <Link href="/contracts/templates/new">
              <Plus className="mr-1 h-4 w-4" />
              New Template
            </Link>
          </Button>
        }
      />

      <Tabs defaultValue="library">
        <TabsList className="mb-5">
          <TabsTrigger value="library">
            <Globe className="mr-1.5 h-4 w-4" />
            Library ({global.length})
          </TabsTrigger>
          <TabsTrigger value="my">
            <Star className="mr-1.5 h-4 w-4" />
            My Templates ({my.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="library">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {global.map((t) => (
              <Card key={t.id} className="flex flex-col">
                <CardHeader className="pb-2">
                  <div className="flex items-start justify-between gap-2">
                    <CardTitle className="text-base leading-snug">{t.name}</CardTitle>
                    <GlobalBadge />
                  </div>
                  {t.description && (
                    <p className="text-sm text-muted-foreground">{t.description}</p>
                  )}
                </CardHeader>
                <CardContent className="flex flex-1 flex-col justify-between gap-4 pt-0">
                  <p className="text-sm text-muted-foreground italic leading-relaxed">
                    &ldquo;{truncate(t.content.replace(/[#*_\-]+/g, '').trim(), 120)}&rdquo;
                  </p>
                  <div className="space-y-3">
                    {t.profession && (
                      <Badge variant="secondary" className="text-xs">
                        {t.profession.replace('_', ' ')}
                      </Badge>
                    )}
                    <div className="flex gap-2">
                      <TemplatePreviewDialog template={t} />
                      <Button asChild size="sm" className="flex-1">
                        <Link href={`/contracts/new?templateId=${t.id}`}>
                          Use Template →
                        </Link>
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="my">
          {my.length === 0 ? (
            <Card>
              <CardContent className="p-8">
                <EmptyState
                  icon={<Rows size={40} />}
                  title="No custom templates yet"
                  description="Create your own template with custom clauses and branding."
                  action={
                    <Button asChild>
                      <Link href="/contracts/templates/new">
                        <Plus className="mr-1 h-4 w-4" />
                        Create Template
                      </Link>
                    </Button>
                  }
                />
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
              {my.map((t) => (
                <Card key={t.id} className="flex flex-col">
                  <CardHeader className="pb-2">
                    <div className="flex items-start justify-between gap-2">
                      <CardTitle className="text-base leading-snug">{t.name}</CardTitle>
                      {t.isDefault && <Badge className="bg-primary text-primary-foreground text-xs">Default</Badge>}
                    </div>
                    {t.description && (
                      <p className="text-sm text-muted-foreground">{t.description}</p>
                    )}
                  </CardHeader>
                  <CardContent className="flex flex-1 flex-col justify-between gap-4 pt-0">
                    <p className="text-sm text-muted-foreground italic leading-relaxed">
                      &ldquo;{truncate(t.content.replace(/[#*_\-]+/g, '').trim(), 120)}&rdquo;
                    </p>
                    <div className="space-y-3">
                      <p className="text-xs text-muted-foreground">Created {formatDate(t.createdAt)}</p>
                      <div className="flex gap-2">
                        <TemplatePreviewDialog template={t} />
                        <Button asChild variant="outline" size="sm">
                          <Link href={`/contracts/templates/${t.id}/edit`}>Edit</Link>
                        </Button>
                        <Button asChild size="sm" className="flex-1">
                          <Link href={`/contracts/new?templateId=${t.id}`}>
                            Use →
                          </Link>
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}
