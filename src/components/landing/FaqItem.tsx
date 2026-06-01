'use client'

import { useState } from 'react'
import { ChevronDown } from 'lucide-react'
import { cn } from '@/lib/utils'

export function FaqItem({ question, answer }: { question: string; answer: string }) {
  const [open, setOpen] = useState(false)

  return (
    <div className="rounded-lg border bg-white">
      <button
        className="flex w-full items-center justify-between p-4 text-left text-sm font-medium hover:bg-muted/40 transition-colors"
        onClick={() => setOpen((o) => !o)}
      >
        {question}
        <ChevronDown className={cn('h-4 w-4 shrink-0 text-muted-foreground transition-transform', open && 'rotate-180')} />
      </button>
      {open && (
        <div className="px-4 pb-4 text-sm text-gray-500 leading-relaxed">
          {answer}
        </div>
      )}
    </div>
  )
}
