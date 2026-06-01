'use client'

import { useState } from 'react'
import { Eye } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import type { ContractTemplateRow } from '@/lib/db/sqlite'

interface Props {
  template: ContractTemplateRow
}

export function TemplatePreviewDialog({ template }: Props) {
  const [open, setOpen] = useState(false)

  return (
    <>
      <Button variant="outline" size="sm" onClick={() => setOpen(true)}>
        <Eye className="mr-1 h-3.5 w-3.5" />
        Preview
      </Button>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-h-[80vh] max-w-2xl overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{template.name}</DialogTitle>
          </DialogHeader>
          <ContractPreview content={template.content} />
        </DialogContent>
      </Dialog>
    </>
  )
}

function ContractPreview({ content }: { content: string }) {
  const lines = content.split('\n')
  return (
    <div className="space-y-2 text-sm leading-relaxed text-foreground">
      {lines.map((line, i) => {
        if (line.startsWith('## ')) {
          return (
            <h2 key={i} className="mt-4 font-semibold text-base text-foreground">
              {line.slice(3)}
            </h2>
          )
        }
        if (line.startsWith('### ')) {
          return (
            <h3 key={i} className="mt-3 font-medium text-foreground">
              {line.slice(4)}
            </h3>
          )
        }
        if (line === '---') {
          return <hr key={i} className="my-3 border-border" />
        }
        return (
          <p key={i} className="whitespace-pre-wrap">
            {renderPlaceholders(line)}
          </p>
        )
      })}
    </div>
  )
}

function renderPlaceholders(text: string) {
  const parts = text.split(/({{[^}]+}})/)
  return parts.map((part, i) => {
    if (part.startsWith('{{') && part.endsWith('}}')) {
      return (
        <span key={i} className="inline-flex items-center rounded-md bg-accent px-1.5 py-0.5 text-xs font-medium text-primary">
          {part}
        </span>
      )
    }
    // bold: **text**
    if (part.includes('**')) {
      const segments = part.split(/(\*\*[^*]+\*\*)/)
      return segments.map((seg, j) => {
        if (seg.startsWith('**') && seg.endsWith('**')) {
          return <strong key={j}>{seg.slice(2, -2)}</strong>
        }
        return <span key={j}>{seg}</span>
      })
    }
    return part
  })
}
