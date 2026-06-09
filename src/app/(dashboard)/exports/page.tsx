'use client'

import { DownloadSimple } from '@/components/icons'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
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
  { label: 'Clients', desc: 'All client contact info', fn: exportClients },
  { label: 'Contracts', desc: 'Contract status and amounts', fn: exportContracts },
  { label: 'Invoices', desc: 'Invoice details and payments', fn: exportInvoices },
  { label: 'Expenses', desc: 'All expense records by category', fn: exportExpenses },
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
        subtitle="Download your data as CSV"
        icon={<DownloadSimple size={24} />}
      />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 max-w-3xl">
        {EXPORT_ITEMS.map((item) => (
          <Card key={item.label}>
            <CardHeader className="pb-2">
              <CardTitle className="text-base">{item.label}</CardTitle>
              <CardDescription>{item.desc}</CardDescription>
            </CardHeader>
            <CardContent>
              <Button
                variant="outline"
                size="sm"
                className="w-full"
                onClick={() => handleExport(item)}
              >
                <DownloadSimple className="mr-1 h-3.5 w-3.5" />
                Export CSV
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
