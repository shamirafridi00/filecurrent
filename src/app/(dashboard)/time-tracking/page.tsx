export const dynamic = 'force-dynamic'

import { Suspense } from 'react'
import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import { getTimeEntries, getTimeTrackingSummary, getClients } from '@/lib/db/supabase'
import { TimeTrackingClient } from '@/components/time-tracking/TimeTrackingClient'

export default async function TimeTrackingPage() {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) notFound()

  const [entries, summary, clients] = await Promise.all([
    getTimeEntries(user.id),
    getTimeTrackingSummary(user.id),
    getClients(user.id),
  ])

  return (
    <Suspense>
      <TimeTrackingClient entries={entries} summary={summary} clients={clients} />
    </Suspense>
  )
}
