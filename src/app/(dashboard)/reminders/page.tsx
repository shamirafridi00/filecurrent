export const dynamic = 'force-dynamic'

import Link from 'next/link'
import { Bell, Lightning, Envelope, GearSix, PaperPlaneTilt, ArrowsClockwise, CheckCircle } from '@phosphor-icons/react/dist/ssr'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { getReminderLogs } from '@/lib/db/supabase'
import { Button } from '@/components/ui/button'

export default async function RemindersPage() {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const logs = await getReminderLogs(user.id)

  return (
    <div>
      {/* Page header */}
      <div className="mb-6 flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground flex items-center gap-2">
            <Bell size={24} weight="duotone" className="text-primary" />
            Payment Reminders
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Automated reminders sent to clients for unpaid invoices
          </p>
        </div>
        <Button asChild variant="outline">
          <Link href="/reminders/settings">
            <GearSix className="mr-1.5 h-4 w-4" />
            Settings
          </Link>
        </Button>
      </div>

      {/* No-limits banner */}
      <div className="bg-teal-50 border border-teal-200 rounded-xl p-4 flex items-start gap-3 mb-6">
        <Lightning size={20} weight="fill" className="text-teal-600 mt-0.5 shrink-0" />
        <div>
          <p className="font-semibold text-teal-900 text-sm">
            Unlimited payment reminders — no daily cap
          </p>
          <p className="text-teal-700 text-sm mt-0.5">
            FileCurrent sends reminders automatically with no daily limits.
            Freelancers with 20+ active invoices are never penalized.
          </p>
        </div>
      </div>

      {/* 3 action cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <Link href="/reminders/settings">
          <div className="bg-white border border-slate-200 rounded-xl p-5 hover:border-teal-300 hover:shadow-sm transition-all cursor-pointer group">
            <div className="w-10 h-10 rounded-lg bg-teal-50 flex items-center justify-center mb-3 group-hover:bg-teal-100 transition-colors">
              <GearSix size={20} weight="duotone" className="text-teal-600" />
            </div>
            <p className="font-semibold text-slate-800">Automation Settings</p>
            <p className="text-sm text-slate-500 mt-1">Configure your before-due and overdue schedule</p>
          </div>
        </Link>

        <Link href="/invoices">
          <div className="bg-white border border-slate-200 rounded-xl p-5 hover:border-teal-300 hover:shadow-sm transition-all cursor-pointer group">
            <div className="w-10 h-10 rounded-lg bg-teal-50 flex items-center justify-center mb-3 group-hover:bg-teal-100 transition-colors">
              <PaperPlaneTilt size={20} weight="duotone" className="text-teal-600" />
            </div>
            <p className="font-semibold text-slate-800">Send Reminder</p>
            <p className="text-sm text-slate-500 mt-1">Send a manual reminder from any invoice page</p>
          </div>
        </Link>

        <div className="bg-white border border-slate-200 rounded-xl p-5">
          <div className="w-10 h-10 rounded-lg bg-teal-50 flex items-center justify-center mb-3">
            <Bell size={20} weight="duotone" className="text-teal-600" />
          </div>
          <p className="font-semibold text-slate-800">Total Sent</p>
          <p className="text-2xl font-bold text-slate-900 mt-1">{logs.length}</p>
          <p className="text-sm text-slate-500 mt-0.5">reminders to date</p>
        </div>
      </div>

      {/* Recent reminders table */}
      <div className="bg-white border border-slate-200 rounded-xl mb-6">
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
          <h2 className="font-semibold text-slate-800">Recent Reminders</h2>
        </div>

        {logs.length === 0 ? (
          <div className="py-12 text-center">
            <Bell size={40} weight="duotone" className="text-slate-300 mx-auto mb-3" />
            <p className="text-slate-500 font-medium">No reminders sent yet</p>
            <p className="text-sm text-slate-400 mt-1">
              Reminders will appear here once sent automatically or manually
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-100">
                  <th className="text-left px-6 py-3 text-xs font-semibold uppercase tracking-wide text-slate-500">Invoice</th>
                  <th className="text-left px-6 py-3 text-xs font-semibold uppercase tracking-wide text-slate-500">Client</th>
                  <th className="text-left px-6 py-3 text-xs font-semibold uppercase tracking-wide text-slate-500">Recipient</th>
                  <th className="text-left px-6 py-3 text-xs font-semibold uppercase tracking-wide text-slate-500">Status</th>
                  <th className="text-left px-6 py-3 text-xs font-semibold uppercase tracking-wide text-slate-500">Sent</th>
                </tr>
              </thead>
              <tbody>
                {logs.map((r) => (
                  <tr key={r.id} className="border-b border-slate-50 hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-3">
                      <span className="text-sm text-teal-600 font-medium">
                        {r.invoiceNumber}
                      </span>
                    </td>
                    <td className="px-6 py-3 text-sm text-slate-700">{r.clientName}</td>
                    <td className="px-6 py-3 text-sm text-slate-500">{r.recipientEmail}</td>
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
                    <td className="px-6 py-3 text-sm text-slate-500">
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
      </div>

      {/* How It Works */}
      <div className="bg-white border border-slate-200 rounded-xl p-6">
        <h3 className="font-semibold text-slate-800 mb-4">How It Works</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[
            {
              icon: <PaperPlaneTilt size={18} weight="duotone" className="text-teal-600" />,
              title: 'Manual Reminders',
              desc: 'Send a reminder instantly from any invoice page',
            },
            {
              icon: <ArrowsClockwise size={18} weight="duotone" className="text-teal-600" />,
              title: 'Automated Schedule',
              desc: 'Runs daily — sends reminders before due, on due, and after overdue',
            },
            {
              icon: <Lightning size={18} weight="duotone" className="text-teal-600" />,
              title: 'No Daily Limits',
              desc: "Unlike other tools, FileCurrent never caps how many reminders you can send",
            },
            {
              icon: <CheckCircle size={18} weight="duotone" className="text-teal-600" />,
              title: 'Auto-stops on Payment',
              desc: 'When an invoice is marked paid, all future reminders cancel automatically',
            },
          ].map((item, i) => (
            <div key={i} className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-lg bg-teal-50 flex items-center justify-center shrink-0">
                {item.icon}
              </div>
              <div>
                <p className="font-medium text-slate-800 text-sm">{item.title}</p>
                <p className="text-xs text-slate-500 mt-0.5">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
