'use client'

import { Button } from '@/components/ui/button'

interface Props {
  pdfUrl: string
}

export function SignedActions({ pdfUrl }: Props) {
  return (
    <div className="mt-6 flex justify-center gap-3">
      <a href={pdfUrl} target="_blank" rel="noreferrer">
        <Button variant="default">View Signed PDF</Button>
      </a>
    </div>
  )
}
