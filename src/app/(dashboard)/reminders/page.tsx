export const dynamic = 'force-dynamic'

import Link from 'next/link'
import { Bell, Lightning, GearSix, PaperPlaneTilt, ArrowsClockwise, CheckCircle } from '@phosphor-icons/react/dist/ssr'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { getReminderLogs } from '@/lib/db/supabase'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { EmptyState } from '@/components/ui'
import { HelpHint } from '@/components/ui/HelpHint'

export default async function RemindersPage() {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const logs = await getReminderLogs(user.id)

  return (
    <div>
      {/* Page header */}
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground flex items-center gap-2">
            <Bell size={24} weight="duotone" className="text-primary" />
            Reminder Logs
            <HelpHint
              title="Payment Reminders"
              example="An invoice due June 20 gets a friendly nudge June 17, a due-date notice June 20, and escalating follow-ups until paid."
            >
              FileCurrent sends automatic emails to clients with unpaid
              invoices. Unlike other tools, there is no daily sending cap —
              reminders run on your configured schedule until the invoice is
              paid.
            </HelpHint>
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            All automated reminder emails sent from your account
          </p>
        </div>
        <Button asChild variant="outline">
          <Link href="/reminders/settings">
            <GearSix className="mr-1.5 h-4 w-4" />
            Settings
          </Link>
        </Button>
      </div>

      {/* 3 action cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <Link href="/reminders/settings">
          <Card className="p-5 hover:border-primary/40 hover:shadow-sm transition-all cursor-pointer group">
            <div className="w-10 h-10 rounded-lg bg-accent flex items-center justify-center mb-3 group-hover:bg-accent/80 transition-colors">
              <GearSix size={20} weight="duotone" className="text-primary" />
            </div>
            <p className="font-semibold text-foreground">Automation Settings</p>
            <p className="text-sm text-muted-foreground mt-1">Configure your before-due and overdue schedule</p>
          </Card>
        </Link>

        <Link href="/invoices">
          <Card className="p-5 hover:border-primary/40 hover:shadow-sm transition-all cursor-pointer group">
            <div className="w-10 h-10 rounded-lg bg-accent flex items-center justify-center mb-3 group-hover:bg-accent/80 transition-colors">
              <PaperPlaneTilt size={20} weight="duotone" className="text-primary" />
            </div>
            <p className="font-semibold text-foreground">Send Reminder</p>
            <p className="text-sm text-muted-foreground mt-1">Send a manual reminder from any invoice page</p>
          </Card>
        </Link>

        <Card className="p-5">
          <div className="w-10 h-10 rounded-lg bg-accent flex items-center justify-center mb-3">
            <Bell size={20} weight="duotone" className="text-primary" />
          </div>
          <p className="font-semibold text-foreground">Total Sent</p>
          <p className="text-2xl font-bold text-foreground mt-1">{logs.length}</p>
          <p className="text-sm text-muted-foreground mt-0.5">reminders to date</p>
        </Card>
      </div>

      {/* Recent reminders table */}
      <Card className="mb-6 overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-border">
          <h2 className="font-semibold text-foreground">Recent Reminders</h2>
        </div>

        {logs.length === 0 ? (
          <EmptyState
            icon={<Bell size={40} weight="duotone" className="text-muted-foreground" />}
            title="No reminders sent yet"
            description="Reminders will appear here once sent automatically or manually"
            action={
              <Button asChild variant="outline">
                <Link href="/reminders/settings">Configure schedule</Link>
              </Button>
            }
            tip="Tip: reminders only go out for invoices with a due date and a client email on file."
          />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left px-6 py-3 text-xs font-semibold uppercase tracking-wide text-muted-foreground">Invoice</th>
                  <th className="text-left px-6 py-3 text-xs font-semibold uppercase tracking-wide text-muted-foreground">Client</th>
                  <th className="text-left px-6 py-3 text-xs font-semibold uppercase tracking-wide text-muted-foreground">Recipient</th>
                  <th className="text-left px-6 py-3 text-xs font-semibold uppercase tracking-wide text-muted-foreground">Status</th>
                  <th className="text-left px-6 py-3 text-xs font-semibold uppercase tracking-wide text-muted-foreground">Sent</th>
                </tr>
              </thead>
              <tbody>
                {logs.map((r) => (
                  <tr key={r.id} className="border-b border-border/50 hover:bg-muted/30 transition-colors">
                    <td className="px-6 py-3">
                      <Link href={`/invoices/${r.invoiceId}`} className="text-sm text-primary font-medium hover:underline">
                        {r.invoiceNumber}
                      </Link>
                    </td>
                    <td className="px-6 py-3 text-sm text-foreground">{r.clientName}</td>
                    <td className="px-6 py-3 text-sm text-muted-foreground">{r.recipientEmail}</td>
                    <td className="px-6 py-3">
                      {r.openedAt ? (
                        <span className="text-xs px-2 py-0.5 rounded-full font-medium border bg-[#EEF2FF] text-[#4F6AE6] border-[#C7D2FE]">
                          Opened
                        </span>
                      ) : (
                        <span className={`text-xs px-2 py-0.5 rounded-full font-medium border ${
                          r.status === 'sent'
                            ? 'bg-[#EEF2FF] text-[#4F6AE6] border-[#C7D2FE]'
                            : 'bg-red-50 text-red-600 border-red-200'
                        }`}>
                          {r.status === 'sent' ? 'Sent' : 'Failed'}
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-3 text-sm text-muted-foreground">
                      {new Date(r.sentAt).toLocaleDateString('en-US', {
                        month: 'short', day: 'numeric', year: 'numeric'
                      })}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>

      {/* How It Works */}
      <Card className="p-6">
        <h3 className="font-semibold text-foreground mb-4">How It Works</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[
            {
              icon: <PaperPlaneTilt size={18} weight="duotone" className="text-primary" />,
              title: 'Manual Reminders',
              desc: 'Send a reminder instantly from any invoice page',
            },
            {
              icon: <ArrowsClockwise size={18} weight="duotone" className="text-primary" />,
              title: 'Automated Schedule',
              desc: 'Runs daily — sends reminders before due, on due, and after overdue',
            },
            {
              icon: <Lightning size={18} weight="duotone" className="text-primary" />,
              title: 'No Daily Limits',
              desc: "Unlike other tools, FileCurrent never caps how many reminders you can send",
            },
            {
              icon: <CheckCircle size={18} weight="duotone" className="text-primary" />,
              title: 'Auto-stops on Payment',
              desc: 'When an invoice is marked paid, all future reminders cancel automatically',
            },
          ].map((item, i) => (
            <div key={i} className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-lg bg-accent flex items-center justify-center shrink-0">
                {item.icon}
              </div>
              <div>
                <p className="font-medium text-foreground text-sm">{item.title}</p>
                <p className="text-xs text-muted-foreground mt-0.5">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  )
}
