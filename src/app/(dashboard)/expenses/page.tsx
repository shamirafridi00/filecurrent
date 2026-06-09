export const dynamic = 'force-dynamic'

import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import { getExpenses, getExpenseSummary } from '@/lib/db/supabase'
import { ExpensesClient } from '@/components/expenses/ExpensesClient'

export default async function ExpensesPage() {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) notFound()

  const [expenses, summary] = await Promise.all([
    getExpenses(user.id),
    getExpenseSummary(user.id),
  ])

  return <ExpensesClient expenses={expenses} summary={summary} />
}
