'use client'

import { DownloadSimple } from '@/components/icons'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { PageHeader } from '@/components/ui'
import { toast } from 'sonner'

const EXPORT_ITEMS = [
  { label: 'Clients', desc: 'All client contact info' },
  { label: 'Contracts', desc: 'Contract status and amounts' },
  { label: 'Invoices', desc: 'Invoice details and payments' },
]

export default function ExportsPage() {

  return (
    <div>
      <PageHeader
        title="Export Data"
        subtitle="Download your data as CSV or JSON"
        icon={<DownloadSimple size={24} />}
      />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3 max-w-2xl">
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
                onClick={() => toast.info(`${item.label} CSV export coming soon`)}
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
