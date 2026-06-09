export const dynamic = 'force-dynamic'

import Link from 'next/link'
import { redirect } from 'next/navigation'
import { Plus, Users, Buildings, Envelope } from '@/components/icons'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { PageHeader, EmptyState } from '@/components/ui'
import { createClient } from '@/lib/supabase/server'
import { getClients } from '@/lib/db/supabase'
import { PortalCopyButton } from '@/components/clients/PortalCopyButton'

export default async function ClientsPage() {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const clients = await getClients(user.id)

  return (
    <div>
      <PageHeader
        title="Clients"
        subtitle="Manage your client relationships"
        icon={<Users size={24} />}
        action={
          <Button asChild>
            <Link href="/clients/new">
              <Plus className="mr-1 h-4 w-4" />
              Add Client
            </Link>
          </Button>
        }
      />

      {clients.length === 0 ? (
        <Card>
          <CardContent className="p-8">
            <EmptyState
              icon={<Users size={40} />}
              title="No clients yet"
              description="Add your first client to start creating contracts and invoices."
              action={
                <Button asChild>
                  <Link href="/clients/new">
                    <Plus className="mr-1 h-4 w-4" />
                    Add Client
                  </Link>
                </Button>
              }
            />
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base">{clients.length} client{clients.length !== 1 ? 's' : ''}</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="divide-y">
              {clients.map((c) => (
                <div key={c.id} className="flex items-center justify-between px-5 py-4 hover:bg-muted/40 transition-colors">
                  <div className="min-w-0">
                    <Link href={`/clients/${c.id}`} className="font-medium text-foreground hover:text-primary transition-colors">
                      {c.name}
                    </Link>
                    <div className="flex items-center gap-3 mt-0.5">
                      {c.company && (
                        <span className="flex items-center gap-1 text-xs text-muted-foreground">
                          <Buildings size={11} /> {c.company}
                        </span>
                      )}
                      {c.email && (
                        <span className="flex items-center gap-1 text-xs text-muted-foreground">
                          <Envelope size={11} /> {c.email}
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="flex flex-wrap items-center gap-2 shrink-0">
                    <Button asChild variant="outline" size="sm">
                      <Link href={`/contracts/new?clientId=${c.id}`}>+ Contract</Link>
                    </Button>
                    <Button asChild variant="outline" size="sm">
                      <Link href={`/invoices/new?clientId=${c.id}`}>+ Invoice</Link>
                    </Button>
                    {c.portalToken && (
                      <PortalCopyButton portalToken={c.portalToken} clientName={c.name} />
                    )}
                    <Button asChild variant="ghost" size="sm">
                      <Link href={`/clients/${c.id}`}>View →</Link>
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
