export const dynamic = 'force-dynamic'
import Link from 'next/link'
import { redirect } from 'next/navigation'
import { Plus, ClipboardText } from '@phosphor-icons/react/dist/ssr'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { PageHeader, EmptyState } from '@/components/ui'
import { HelpHint } from '@/components/ui/HelpHint'
import { formatDate } from '@/lib/utils'
import { createClient } from '@/lib/supabase/server'
import { getIntakeForms, getClients } from '@/lib/db/supabase'
import { IntakeFormActions } from '@/components/intake-forms/IntakeFormActions'
import { SendIntakeFormButton } from '@/components/intake-forms/SendIntakeFormButton'
import { FeatureTour } from '@/components/ui/FeatureTour'

export default async function IntakeFormsPage() {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const [forms, clients] = await Promise.all([
    getIntakeForms(user.id),
    getClients(user.id),
  ])
  const clientOptions = clients.map((c) => ({ id: c.id, name: c.name, email: c.email ?? null }))

  return (
    <div>
      <PageHeader
        title="Intake Forms"
        subtitle="Collect client info before starting a project"
        icon={<ClipboardText size={24} weight="duotone" className="text-primary" />}
        help={
          <HelpHint
            title="Intake Forms"
            example="A 'New Project Questionnaire' asking for project goals, timeline, and budget — submissions create the client record automatically."
          >
            Intake forms let you collect project details from new clients
            before starting work — preferred communication, project
            requirements, budget range.
          </HelpHint>
        }
        action={
          <div className="flex items-center gap-2">
            <FeatureTour
              tourId="intake-forms"
              autoStartOnFirstVisit={false}
              steps={[
                { title: 'Collect project details automatically', description: 'Intake forms gather everything you need from a new client before the work starts — no email back-and-forth.' },
                { element: 'a[href="/intake-forms/new"]', title: 'Build a form in minutes', description: 'Drag in 9 field types (text, dropdowns, dates…) with a live preview, plus a "Preview as client" mode.' },
                { element: '[data-tour="send-intake"]', title: 'Send it to a client', description: 'Email the form straight to a client, or copy the public link into any conversation.' },
                { title: 'Submissions become clients', description: 'Every submission auto-creates the client record, appears in their activity feed, and emails you a notification.' },
              ]}
            />
            <Button asChild>
              <Link href="/intake-forms/new">
                <Plus className="mr-1.5 h-4 w-4" /> New Form
              </Link>
            </Button>
          </div>
        }
      />

      {forms.length === 0 ? (
        <Card>
          <CardContent className="p-8">
            <EmptyState
              icon={<ClipboardText size={40} weight="duotone" className="text-muted-foreground" />}
              title="No intake forms yet"
              description="Create a form to collect client info before starting a project."
              action={
                <Button asChild>
                  <Link href="/intake-forms/new">
                    <Plus className="mr-1.5 h-4 w-4" /> New Form
                  </Link>
                </Button>
              }
              tip="Tip: submissions automatically create a client record — no copy-pasting from email."
            />
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base">{forms.length} form{forms.length !== 1 ? 's' : ''}</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="divide-y divide-border">
              {forms.map((form) => (
                <div key={form.id} className="flex items-center justify-between px-5 py-4 hover:bg-muted/40 transition-colors">
                  <div className="min-w-0">
                    <Link href={`/intake-forms/${form.id}`} className="font-medium text-foreground hover:text-primary transition-colors">
                      {form.title}
                    </Link>
                    <p className="text-sm text-muted-foreground mt-0.5">
                      {form.fields.length} field{form.fields.length !== 1 ? 's' : ''} · {form.responseCount ?? 0} response{(form.responseCount ?? 0) !== 1 ? 's' : ''} · Created {formatDate(form.createdAt)}
                    </p>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <Badge variant="secondary" className={form.isActive ? 'bg-green-50 text-green-700 border-green-200' : 'bg-muted text-muted-foreground border-border'}>
                      {form.isActive ? 'Active' : 'Paused'}
                    </Badge>
                    <SendIntakeFormButton formId={form.id} clients={clientOptions} />
                    <Button asChild variant="outline" size="sm">
                      <Link href={`/intake-forms/${form.id}/responses`}>
                        Responses ({form.responseCount ?? 0})
                      </Link>
                    </Button>
                    <Button asChild variant="ghost" size="sm">
                      <Link href={`/intake-forms/${form.id}`}>Edit →</Link>
                    </Button>
                    <IntakeFormActions formId={form.id} formTitle={form.title} />
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
