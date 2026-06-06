'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Copy } from '@phosphor-icons/react'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'

interface Props { invoiceId: string }

export function DuplicateInvoiceButton({ invoiceId }: Props) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  const handleDuplicate = async () => {
    setLoading(true)
    try {
      const res = await fetch(`/api/invoices/${invoiceId}/duplicate`, { method: 'POST' })
      if (!res.ok) throw new Error()
      const { id } = await res.json()
      toast.success('Invoice duplicated')
      router.push(`/invoices/${id}`)
    } catch {
      toast.error('Failed to duplicate invoice')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Button variant="outline" size="sm" onClick={handleDuplicate} disabled={loading}>
      <Copy className="mr-1 h-4 w-4" />
      {loading ? 'Duplicating…' : 'Duplicate'}
    </Button>
  )
}
