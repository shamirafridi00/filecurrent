export const dynamic = 'force-dynamic'

import Link from 'next/link'
import { Bell, Settings, Mail, CheckCircle, Clock } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { PageHeader, EmptyState } from '@/components/ui'
import { formatDate } from '@/lib/utils'
import { getCurrentProfile, getReminderLogs } from '@/lib/db/sqlite'

export default function RemindersPage() {
  const profile = getCurrentProfile()
  const logs = getReminderLogs(profile.id)

  return (
    <div>
      <PageHeader
        title="Payment Reminders"
        subtitle="Automated reminders sent to clients for unpaid invoices"
        icon={<Bell size={24} />}
        action={
          <Button asChild variant="outline">
            <Link href="/reminders/settings">
              <Settings className="mr-1 h-4 w-4" />
              Reminder Settings
            </Link>
          </Button>
        }
      />

      {/* No-cap differentiator banner */}
      <Card className="mb-6 border-l-4 border-l-primary">
        <CardContent className="flex items-start gap-3 p-4">
          <Bell className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
          <div>
            <p className="font-semibold text-foreground">FileCurrent sends reminders with no daily limits</p>
            <p className="text-sm text-muted-foreground">
              You&apos;ll never miss a late payment because of an artificial cap. Reminders are sent
              automatically and stop as soon as an invoice is marked paid.
            </p>
          </div>
        </CardContent>
      </Card>

      {logs.length === 0 ? (
        <Card>
          <CardContent className="p-8">
            <EmptyState
              icon={<Mail size={40} />}
              title="No reminders sent yet"
              description="Reminders are sent automatically when invoices become due or overdue."
              action={
                <Button asChild variant="outline">
                  <Link href="/reminders/settings">Configure schedule →</Link>
                </Button>
              }
            />
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base">{logs.length} reminder{logs.length !== 1 ? 's' : ''} sent</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="divide-y">
              {logs.map((log) => (
                <div key={log.id} className="flex items-center justify-between px-5 py-3.5">
                  <div className="flex items-center gap-3 min-w-0">
                    <Mail className="h-4 w-4 shrink-0 text-muted-foreground" />
                    <div className="min-w-0">
                      <p className="font-medium text-sm">
                        {log.invoiceNumber} · {log.clientName}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {log.recipientEmail} · {formatDate(log.sentAt)}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    {log.openedAt ? (
                      <Badge variant="secondary" className="bg-green-50 text-green-700 border-green-200">
                        <CheckCircle className="mr-1 h-3 w-3" /> Opened
                      </Badge>
                    ) : (
                      <Badge variant="secondary" className="bg-muted text-muted-foreground">
                        <Clock className="mr-1 h-3 w-3" />
                        {log.status === 'sent' ? 'Delivered' : 'Failed'}
                      </Badge>
                    )}
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
