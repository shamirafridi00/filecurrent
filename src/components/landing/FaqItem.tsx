'use client'
import { useState } from 'react'
import { CaretDown } from '@phosphor-icons/react'
import { cn } from '@/lib/utils'

interface FaqItemProps {
  question: string
  answer: string
}

export function FaqItem({ question, answer }: FaqItemProps) {
  const [open, setOpen] = useState(false)
  return (
    <div className="rounded-lg border border-[#1A3A5C] bg-[#071929]">
      <button
        className="flex w-full items-center justify-between p-4 text-left"
        onClick={() => setOpen((o) => !o)}
      >
        <span className="font-medium text-white text-sm">{question}</span>
        <CaretDown
          size={16}
          className={cn('shrink-0 text-gray-500 transition-transform', open && 'rotate-180')}
        />
      </button>
      {open && (
        <div className="px-4 pb-4 text-sm text-gray-400 leading-relaxed">
          {answer}
        </div>
      )}
    </div>
  )
}
