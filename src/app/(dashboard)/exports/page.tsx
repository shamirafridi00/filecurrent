'use client'

import { DownloadSimple, Users, FileText, Receipt, CurrencyDollar } from '@/components/icons'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { PageHeader } from '@/components/ui'
import { toast } from 'sonner'

function jsonToCsv(rows: Record<string, unknown>[], columns: { key: string; label: string }[]): string {
  const header = columns.map((c) => `"${c.label}"`).join(',')
  const body = rows.map((row) =>
    columns.map((c) => {
      const val = row[c.key] ?? ''
      return `"${String(val).replace(/"/g, '""')}"`
    }).join(',')
  )
  return [header, ...body].join('\n')
}

function downloadCsv(csv: string, filename: string) {
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  a.click()
  URL.revokeObjectURL(url)
}

async function exportClients() {
  const res = await fetch('/api/clients')
  if (!res.ok) throw new Error('Failed to fetch clients')
  const data = await res.json()
  const csv = jsonToCsv(data, [
    { key: 'name', label: 'Name' },
    { key: 'email', label: 'Email' },
    { key: 'phone', label: 'Phone' },
    { key: 'company', label: 'Company' },
    { key: 'address', label: 'Address' },
    { key: 'notes', label: 'Notes' },
  ])
  downloadCsv(csv, 'clients.csv')
}

async function exportContracts() {
  const res = await fetch('/api/contracts')
  if (!res.ok) throw new Error('Failed to fetch contracts')
  const data = await res.json()
  const csv = jsonToCsv(data, [
    { key: 'title', label: 'Title' },
    { key: 'clientName', label: 'Client' },
    { key: 'status', label: 'Status' },
    { key: 'amount', label: 'Amount' },
    { key: 'currency', label: 'Currency' },
    { key: 'startDate', label: 'Start Date' },
    { key: 'endDate', label: 'End Date' },
    { key: 'createdAt', label: 'Created At' },
  ])
  downloadCsv(csv, 'contracts.csv')
}

async function exportInvoices() {
  const res = await fetch('/api/invoices')
  if (!res.ok) throw new Error('Failed to fetch invoices')
  const data = await res.json()
  const csv = jsonToCsv(data, [
    { key: 'invoiceNumber', label: 'Invoice Number' },
    { key: 'clientName', label: 'Client' },
    { key: 'status', label: 'Status' },
    { key: 'total', label: 'Total' },
    { key: 'paidAmount', label: 'Paid' },
    { key: 'balance', label: 'Balance' },
    { key: 'currency', label: 'Currency' },
    { key: 'invoiceDate', label: 'Invoice Date' },
    { key: 'dueDate', label: 'Due Date' },
  ])
  downloadCsv(csv, 'invoices.csv')
}

async function exportExpenses() {
  const res = await fetch('/api/expenses')
  if (!res.ok) throw new Error('Failed to fetch expenses')
  const data = await res.json()
  const csv = jsonToCsv(data, [
    { key: 'date', label: 'Date' },
    { key: 'description', label: 'Description' },
    { key: 'category', label: 'Category' },
    { key: 'amount', label: 'Amount' },
    { key: 'notes', label: 'Notes' },
  ])
  downloadCsv(csv, 'expenses.csv')
}

const EXPORT_ITEMS = [
  { label: 'Clients', desc: 'Names, emails, phone numbers, companies, addresses, and notes', fn: exportClients, icon: Users },
  { label: 'Contracts', desc: 'Titles, clients, statuses, amounts, and start/end dates', fn: exportContracts, icon: FileText },
  { label: 'Invoices', desc: 'Invoice numbers, totals, paid amounts, balances, and due dates', fn: exportInvoices, icon: Receipt },
  { label: 'Expenses', desc: 'Dates, descriptions, categories, and amounts — ready for your tax preparer', fn: exportExpenses, icon: CurrencyDollar },
]

export default function ExportsPage() {
  async function handleExport(item: typeof EXPORT_ITEMS[0]) {
    try {
      await item.fn()
      toast.success(`${item.label} downloaded successfully`)
    } catch {
      toast.error(`Failed to export ${item.label.toLowerCase()}`)
    }
  }

  return (
    <div>
      <PageHeader
        title="Export Data"
        subtitle="Download your data as CSV — opens in Excel, Google Sheets, or any accounting tool"
        icon={<DownloadSimple size={24} />}
      />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 max-w-3xl">
        {EXPORT_ITEMS.map((item) => {
          const Icon = item.icon
          return (
            <Card key={item.label} className="transition-all hover:border-primary/50 hover:shadow-sm">
              <CardContent className="flex h-full flex-col p-5">
                <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-lg bg-accent">
                  <Icon size={20} className="text-primary" />
                </div>
                <p className="text-base font-semibold text-foreground">{item.label}</p>
                <p className="mt-1 flex-1 text-sm text-muted-foreground">{item.desc}</p>
                <Button
                  variant="outline"
                  size="sm"
                  className="mt-4 w-full"
                  onClick={() => handleExport(item)}
                >
                  <DownloadSimple className="mr-1.5 h-3.5 w-3.5" />
                  Export CSV
                </Button>
              </CardContent>
            </Card>
          )
        })}
      </div>

      <p className="mt-4 max-w-3xl text-xs text-muted-foreground">
        Exports include all records in your account at the time of download. CSV files open
        in Excel, Google Sheets, Numbers, and any accounting tool.
      </p>
    </div>
  )
}
