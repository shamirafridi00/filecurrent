'use client'

import { Upload } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { PageHeader, DropZone } from '@/components/ui'

export default function ImportsPage() {
  return (
    <div>
      <PageHeader
        title="Import Clients"
        subtitle="Upload a CSV file to bulk-import clients"
        icon={<Upload size={24} />}
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
            onFile={(file) => {
              console.log('File selected:', file.name)
            }}
            accept=".csv"
            helperText="CSV format only — max 10 MB"
          />
          <div className="rounded-lg bg-muted/40 border p-3 text-xs text-muted-foreground space-y-1">
            <p className="font-medium">Required columns:</p>
            <p><code>Name</code> — Client full name (required)</p>
            <p><code>Email</code> — Contact email</p>
            <p><code>Phone</code> — Phone number</p>
            <p><code>Company</code> — Company name</p>
            <p><code>Address</code> — Street address</p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
