'use client'

import { useState } from 'react'
import Link from 'next/link'
import { UploadSimple, DownloadSimple, CheckCircle, Warning } from '@/components/icons'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { PageHeader, DropZone } from '@/components/ui'
import { toast } from 'sonner'

const SAMPLE_CSV = [
  'Name,Email,Phone,Company,Address,Notes',
  'Jane Cooper,jane@acme.com,(555) 010-2030,Acme Co,123 Main St Austin TX,Referred by Mike',
  'Devon Lane,devon@studioco.com,,Studio Co,,Monthly retainer client',
].join('\n')

interface ParsedRow {
  name: string
  email: string
  phone: string
  company: string
  address: string
  notes: string
}

// Minimal CSV parser — handles quoted fields with commas and escaped quotes.
function parseCsv(text: string): string[][] {
  const rows: string[][] = []
  let row: string[] = []
  let field = ''
  let inQuotes = false
  for (let i = 0; i < text.length; i++) {
    const ch = text[i]
    if (inQuotes) {
      if (ch === '"') {
        if (text[i + 1] === '"') { field += '"'; i++ }
        else inQuotes = false
      } else field += ch
    } else if (ch === '"') {
      inQuotes = true
    } else if (ch === ',') {
      row.push(field); field = ''
    } else if (ch === '\n' || ch === '\r') {
      if (ch === '\r' && text[i + 1] === '\n') i++
      row.push(field); field = ''
      if (row.some((c) => c.trim() !== '')) rows.push(row)
      row = []
    } else {
      field += ch
    }
  }
  row.push(field)
  if (row.some((c) => c.trim() !== '')) rows.push(row)
  return rows
}

function toClientRows(rows: string[][]): { clients: ParsedRow[]; error?: string } {
  if (rows.length < 2) return { clients: [], error: 'File has no data rows.' }
  const header = rows[0].map((h) => h.trim().toLowerCase())
  const idx = (name: string) => header.indexOf(name)
  if (idx('name') === -1) return { clients: [], error: 'Missing required "Name" column.' }

  const clients: ParsedRow[] = []
  for (const row of rows.slice(1)) {
    const get = (name: string) => (idx(name) >= 0 ? (row[idx(name)] ?? '').trim() : '')
    const name = get('name')
    if (!name) continue
    clients.push({
      name,
      email: get('email'),
      phone: get('phone'),
      company: get('company'),
      address: get('address'),
      notes: get('notes'),
    })
  }
  return { clients }
}

export default function ImportsPage() {
  const [importing, setImporting] = useState(false)
  const [result, setResult] = useState<{ imported: number; failed: number } | null>(null)

  function downloadSample() {
    const blob = new Blob([SAMPLE_CSV], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'filecurrent-client-import-template.csv'
    a.click()
    URL.revokeObjectURL(url)
  }

  async function handleFile(file: File) {
    if (file.size > 10 * 1024 * 1024) {
      toast.error('File is larger than 10 MB.')
      return
    }
    setImporting(true)
    setResult(null)
    try {
      const text = await file.text()
      const { clients, error } = toClientRows(parseCsv(text))
      if (error) { toast.error(error); return }
      if (clients.length === 0) { toast.error('No valid rows found — every client needs a Name.'); return }

      let imported = 0
      let failed = 0
      for (const client of clients) {
        try {
          const res = await fetch('/api/clients', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(client),
          })
          if (res.ok) imported++
          else failed++
        } catch {
          failed++
        }
      }
      setResult({ imported, failed })
      if (imported > 0) {
        toast.success(`Imported ${imported} client${imported !== 1 ? 's' : ''}${failed ? ` (${failed} failed)` : ''}`)
      } else {
        toast.error('No clients could be imported. Check the file format.')
      }
    } catch {
      toast.error('Could not read that file. Make sure it is a valid CSV.')
    } finally {
      setImporting(false)
    }
  }

  return (
    <div>
      <PageHeader
        title="Import Clients"
        subtitle="Bring your client list over from HoneyBook, Bonsai, or a spreadsheet"
        icon={<UploadSimple size={24} />}
        action={
          <Button variant="outline" onClick={downloadSample}>
            <DownloadSimple className="mr-1.5 h-4 w-4" />
            Download sample CSV
          </Button>
        }
      />

      <Card className="max-w-lg">
        <CardHeader>
          <CardTitle className="text-base">CSV Import</CardTitle>
          <CardDescription>
            Upload a CSV with columns: Name, Email, Phone, Company, Address, Notes
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <DropZone
            onFile={handleFile}
            accept=".csv"
            helperText={importing ? 'Importing…' : 'CSV format only — max 10 MB'}
          />

          {result && (
            <div className={`flex items-start gap-2 rounded-lg border p-3 text-sm ${
              result.failed === 0
                ? 'border-green-200 bg-green-50 text-green-800'
                : 'border-amber-200 bg-amber-50 text-amber-800'
            }`}>
              {result.failed === 0
                ? <CheckCircle size={16} className="mt-0.5 shrink-0" />
                : <Warning size={16} className="mt-0.5 shrink-0" />}
              <p>
                Imported {result.imported} client{result.imported !== 1 ? 's' : ''}
                {result.failed > 0 && ` — ${result.failed} row${result.failed !== 1 ? 's' : ''} failed`}.{' '}
                <Link href="/clients" className="font-medium underline">View clients →</Link>
              </p>
            </div>
          )}

          <div className="rounded-lg bg-muted/40 border p-3 text-xs text-muted-foreground space-y-1">
            <p className="font-medium">Columns:</p>
            <p><code>Name</code> — Client full name (required)</p>
            <p><code>Email</code> — Contact email</p>
            <p><code>Phone</code> — Phone number</p>
            <p><code>Company</code> — Company name</p>
            <p><code>Address</code> — Street address</p>
            <p><code>Notes</code> — Anything else worth keeping</p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
