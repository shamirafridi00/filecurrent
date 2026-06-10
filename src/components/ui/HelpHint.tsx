'use client'

import { Question } from '@phosphor-icons/react'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'

interface HelpHintProps {
  title: string
  children: React.ReactNode
  /** Concrete usage example shown below the explanation. */
  example?: string
}

/**
 * Contextual help trigger — a small (?) icon that opens a short explanation
 * popover. One per feature, next to the section or page title.
 */
export function HelpHint({ title, children, example }: HelpHintProps) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <button
          type="button"
          className="inline-flex items-center text-muted-foreground transition-colors hover:text-foreground"
          aria-label={`What is ${title}?`}
          title="What is this?"
        >
          <Question size={16} />
        </button>
      </PopoverTrigger>
      <PopoverContent align="start" className="w-80 text-sm">
        <p className="mb-1 font-semibold text-foreground">{title}</p>
        <div className="text-muted-foreground leading-relaxed">{children}</div>
        {example && (
          <p className="mt-2 rounded-md bg-muted/50 p-2 text-xs leading-relaxed text-muted-foreground">
            <span className="font-medium text-foreground">Example:</span> {example}
          </p>
        )}
      </PopoverContent>
    </Popover>
  )
}
