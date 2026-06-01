'use client'

// ============================================================
// src/components/reminders/ReminderSettings.tsx
// ============================================================

import { useState } from 'react'
import { Button, Card, Input, PageHeader } from '@/components/ui'
import type { ReminderSettings } from '@/types'

const DEFAULT_SETTINGS: ReminderSettings = {
  userId: '',
  enabled: true,
  daysBefore: [3, 1],
  sendOnDueDate: true,
  daysAfterOverdue: [3, 7, 14],
  maxRemindersPerInvoice: 5,
  skipBelowBalance: 10,
}

export function ReminderSettingsForm() {
  const [settings, setSettings] = useState<ReminderSettings>(DEFAULT_SETTINGS)
  const [saving, setSaving] = useState(false)

  const setField = <K extends keyof ReminderSettings>(field: K, value: ReminderSettings[K]) => {
    setSettings((prev) => ({ ...prev, [field]: value }))
  }

  const handleSave = async () => {
    setSaving(true)
    await new Promise((r) => setTimeout(r, 800))
    setSaving(false)
  }

  return (
    <div className="max-w-2xl">
      <PageHeader
        title="Reminder Automation Settings"
        subtitle="Configure when payment reminders are automatically sent"
      />

      <div className="space-y-4">
        {/* Enable toggle */}
        <Card>
          <label className="flex items-start gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={settings.enabled}
              onChange={(e) => setField('enabled', e.target.checked)}
              className="w-4 h-4 mt-0.5 rounded accent-indigo-600"
            />
            <div>
              <p className="font-medium text-slate-900 text-sm">Enable automated payment reminders</p>
              <p className="text-xs text-slate-500 mt-0.5">
                When enabled, reminders will be sent automatically based on the schedule below
              </p>
            </div>
          </label>
        </Card>

        {/* Before due date */}
        <Card>
          <h3 className="font-semibold text-slate-800 mb-1">Send Reminders Before Due Date</h3>
          <p className="text-sm text-slate-500 mb-3">Specify how many days before the due date to send reminders</p>
          <Input
            label="Days before due date"
            value={JSON.stringify(settings.daysBefore)}
            onChange={(e) => {
              try {
                const parsed = JSON.parse(e.target.value)
                if (Array.isArray(parsed)) setField('daysBefore', parsed)
              } catch {}
            }}
            helper="Enter as JSON array: [3,1] = send reminders 3 days and 1 day before due date"
          />
        </Card>

        {/* On due date */}
        <Card>
          <label className="flex items-start gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={settings.sendOnDueDate}
              onChange={(e) => setField('sendOnDueDate', e.target.checked)}
              className="w-4 h-4 mt-0.5 rounded accent-indigo-600"
            />
            <div>
              <p className="font-medium text-slate-900 text-sm">Send reminder on due date</p>
              <p className="text-xs text-slate-500 mt-0.5">Send a reminder on the day the invoice is due</p>
            </div>
          </label>
        </Card>

        {/* After overdue */}
        <Card>
          <h3 className="font-semibold text-slate-800 mb-1">Send Reminders After Overdue</h3>
          <p className="text-sm text-slate-500 mb-3">Specify how many days after due date to send overdue reminders</p>
          <Input
            label="Days after overdue"
            value={JSON.stringify(settings.daysAfterOverdue)}
            onChange={(e) => {
              try {
                const parsed = JSON.parse(e.target.value)
                if (Array.isArray(parsed)) setField('daysAfterOverdue', parsed)
              } catch {}
            }}
            helper="Enter as JSON array: [3,7,14] = send reminders 3, 7, and 14 days after invoice becomes overdue"
          />
        </Card>

        {/* Max reminders */}
        <Card>
          <h3 className="font-semibold text-slate-800 mb-1">Limit Reminders Per Invoice</h3>
          <p className="text-sm text-slate-500 mb-3">Maximum number of reminders to send per invoice to prevent spam</p>
          <Input
            label="Maximum reminders per invoice"
            type="number"
            min={1}
            max={20}
            value={settings.maxRemindersPerInvoice}
            onChange={(e) => setField('maxRemindersPerInvoice', parseInt(e.target.value) || 5)}
            helper="Default: 5 reminders. Prevents excessive emails for the same invoice."
          />
        </Card>

        {/* Skip small balances */}
        <Card>
          <h3 className="font-semibold text-slate-800 mb-1">Skip Small Balances</h3>
          <p className="text-sm text-slate-500 mb-3">Do not send reminders if outstanding balance is below this amount</p>
          <Input
            label="Skip if remaining balance ≤"
            type="number"
            min={0}
            step={0.01}
            prefix="$"
            value={settings.skipBelowBalance}
            onChange={(e) => setField('skipBelowBalance', parseFloat(e.target.value) || 0)}
            helper="Default: $10.00. Useful for skipping reminders on nearly-paid invoices."
          />
        </Card>

        {/* Buttons */}
        <div className="flex gap-3">
          <Button variant="primary" loading={saving} onClick={handleSave}>
            Save Settings
          </Button>
          <Button variant="ghost">Cancel</Button>
        </div>

        {/* How it works */}
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-5">
          <h4 className="font-semibold text-blue-800 mb-3">How Automated Reminders Work</h4>
          <ul className="space-y-1.5">
            {[
              'Reminders are processed daily (recommended: 9 AM in your timezone)',
              'Each client receives maximum 1 reminder per day (across all invoices)',
              'Reminders respect your daily email limit (default: 20/day)',
              'Invoices with outstanding balance below threshold are skipped',
              'Each invoice can receive up to the maximum number of reminders',
            ].map((tip, i) => (
              <li key={i} className="text-sm text-blue-700 flex items-start gap-2">
                <span className="text-blue-400 mt-0.5">•</span>
                {tip}
              </li>
            ))}
            <li className="text-sm text-blue-700 flex items-start gap-2 mt-2">
              <span className="text-blue-400 mt-0.5">•</span>
              Configure your cron job to run:{' '}
              <code className="text-xs bg-blue-100 px-1 rounded font-mono">
                0 9 * * * /usr/bin/php /path/to/cron/process_payment_reminders.php
              </code>
            </li>
          </ul>
        </div>
      </div>
    </div>
  )
}
