'use client'

import { Printer } from '@phosphor-icons/react'
import { Button } from '@/components/ui/button'

interface Props {
  signedPdfUrl?: string | null
}

export function PrintButton({ signedPdfUrl }: Props) {
  const handlePrint = () => {
    if (signedPdfUrl) {
      // Open the signed PDF in a new tab — the browser's native PDF viewer
      // has its own print button which prints the actual signed document.
      window.open(signedPdfUrl, '_blank')
    } else {
      window.print()
    }
  }

  return (
    <Button variant="outline" size="sm" onClick={handlePrint}>
      <Printer className="mr-1.5 h-3.5 w-3.5" />
      {signedPdfUrl ? 'Print Signed PDF' : 'Print'}
    </Button>
  )
}
