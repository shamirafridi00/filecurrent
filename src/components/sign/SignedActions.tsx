'use client'

import { Button } from '@/components/ui/button'

interface Props {
  pdfUrl: string
}

export function SignedActions({ pdfUrl }: Props) {
  return (
    <div className="mt-6 flex justify-center gap-3">
      <a href={pdfUrl} download>
        <Button variant="default">Download Signed PDF</Button>
      </a>
      <Button variant="outline" onClick={() => window.print()}>Print</Button>
    </div>
  )
}
