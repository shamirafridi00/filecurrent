export const dynamic = 'force-dynamic'
import Link from 'next/link'
import { redirect, notFound } from 'next/navigation'
import { ClipboardText } from '@phosphor-icons/react/dist/ssr'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { PageHeader, EmptyState } from '@/components/ui'
import { formatDate } from '@/lib/utils'
import { createClient } from '@/lib/supabase/server'
import { getIntakeFormById, getIntakeResponses } from '@/lib/db/supabase'

export default async function IntakeResponsesPage({ params }: { params: { id: string } }) {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const [form, responses] = await Promise.all([
    getIntakeFormById(params.id, user.id),
    getIntakeResponses(params.id, user.id),
  ])
  if (!form) notFound()

  return (
    <div>
      <PageHeader
        title={`${form.title} — Responses`}
        backHref="/intake-forms"
        backLabel="All Forms"
        icon={<ClipboardText size={24} weight="duotone" className="text-primary" />}
      />

      {responses.length === 0 ? (
        <Card>
          <CardContent className="p-8">
            <EmptyState
              title="No responses yet"
              description="Share your form link with clients to start collecting responses."
            />
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {responses.map((r) => (
            <Card key={r.id}>
              <CardHeader className="pb-2">
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-base">
                      {r.respondentName ?? 'Anonymous'}
                    </CardTitle>
                    <p className="text-sm text-muted-foreground">
                      {r.respondentEmail && <span>{r.respondentEmail} · </span>}
                      Submitted {formatDate(r.submittedAt)}
                      {r.clientName && (
                        <span className="ml-2 text-primary">→ <Link href={`/clients/${r.clientId}`} className="hover:underline">{r.clientName}</Link></span>
                      )}
                    </p>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {form.fields.filter((f) => f.type !== 'heading').map((field) => {
                    const answer = r.answers[field.id]
                    if (answer === undefined || answer === '' || answer === false) return null
                    return (
                      <div key={field.id} className="grid grid-cols-[180px_1fr] gap-2 text-sm">
                        <span className="text-muted-foreground font-medium truncate">{field.label}</span>
                        <span className="text-foreground break-words">
                          {typeof answer === 'boolean' ? (answer ? 'Yes' : 'No') : String(answer)}
                        </span>
                      </div>
                    )
                  })}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
