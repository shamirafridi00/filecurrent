'use client'

import { useRef } from 'react'
import {
  TextB,
  TextItalic,
  TextHOne,
  TextHTwo,
  ListBullets,
  ListNumbers,
} from '@phosphor-icons/react'
import { Textarea } from '@/components/ui/textarea'

// ── Renderer ────────────────────────────────────────────────
// Markdown-lite, same dialect as contracts: # ## ### headings, **bold**,
// *italic*, - bullets, 1. numbered, blank-line paragraphs.

function inlineParts(text: string) {
  const parts = text.split(/(\*\*[^*]+\*\*|\*[^*]+\*)/)
  return parts.map((part, j) => {
    if (part.startsWith('**') && part.endsWith('**')) return <strong key={j}>{part.slice(2, -2)}</strong>
    if (part.startsWith('*') && part.endsWith('*') && part.length > 2) return <em key={j}>{part.slice(1, -1)}</em>
    return part
  })
}

export function RichTextContent({ text, className }: { text: string; className?: string }) {
  return (
    <div className={className}>
      {text.replace(/\r\n/g, '\n').split('\n').map((line, i) => {
        const trimmed = line.trim()
        if (trimmed === '') return <div key={i} className="h-2" />
        if (trimmed.startsWith('## ')) return (
          <h3 key={i} className="mt-3 mb-1 text-sm font-semibold text-gray-900">{inlineParts(trimmed.slice(3))}</h3>
        )
        if (trimmed.startsWith('# ')) return (
          <h2 key={i} className="mt-4 mb-1 text-base font-bold text-gray-900">{inlineParts(trimmed.slice(2))}</h2>
        )
        if (trimmed.startsWith('- ') || trimmed.startsWith('* ')) return (
          <div key={i} className="ml-4 flex items-start gap-2 text-sm">
            <span className="mt-[7px] h-1.5 w-1.5 shrink-0 rounded-full bg-gray-400" />
            <span>{inlineParts(trimmed.slice(2))}</span>
          </div>
        )
        if (/^\d+\.\s/.test(trimmed)) return (
          <p key={i} className="ml-4 text-sm">{inlineParts(trimmed)}</p>
        )
        return <p key={i} className="text-sm leading-relaxed">{inlineParts(trimmed)}</p>
      })}
    </div>
  )
}

// ── Editor ──────────────────────────────────────────────────

interface EditorProps {
  id?: string
  value: string
  onChange: (value: string) => void
  rows?: number
  placeholder?: string
}

/**
 * Lightweight rich-text editor: a textarea with a formatting toolbar that
 * inserts markdown-lite markers (same dialect contracts already use), rendered
 * by RichTextContent on the public page. Keeps content portable plain text —
 * no heavy editor dependency.
 */
export function RichTextEditor({ id, value, onChange, rows = 5, placeholder }: EditorProps) {
  const ref = useRef<HTMLTextAreaElement>(null)

  // Wrap the selection with markers (bold/italic) or prefix selected lines (headings/lists)
  const apply = (action: 'bold' | 'italic' | 'h1' | 'h2' | 'bullet' | 'numbered') => {
    const el = ref.current
    if (!el) return
    const start = el.selectionStart ?? 0
    const end = el.selectionEnd ?? 0
    const selected = value.slice(start, end)
    let next = value
    let cursorStart = start
    let cursorEnd = end

    if (action === 'bold' || action === 'italic') {
      const marker = action === 'bold' ? '**' : '*'
      const inner = selected || (action === 'bold' ? 'bold text' : 'italic text')
      next = value.slice(0, start) + marker + inner + marker + value.slice(end)
      cursorStart = start + marker.length
      cursorEnd = cursorStart + inner.length
    } else {
      // Line-prefix actions: operate on each selected line (or the current line)
      const lineStart = value.lastIndexOf('\n', start - 1) + 1
      const lineEndIdx = value.indexOf('\n', end)
      const lineEnd = lineEndIdx === -1 ? value.length : lineEndIdx
      const block = value.slice(lineStart, lineEnd)
      const prefix = action === 'h1' ? '# ' : action === 'h2' ? '## ' : action === 'bullet' ? '- ' : null
      const prefixed = block.split('\n').map((line, i) => {
        const clean = line.replace(/^(#{1,3}\s|-\s|\d+\.\s)/, '')
        if (action === 'numbered') return `${i + 1}. ${clean}`
        return `${prefix}${clean}`
      }).join('\n')
      next = value.slice(0, lineStart) + prefixed + value.slice(lineEnd)
      cursorStart = lineStart
      cursorEnd = lineStart + prefixed.length
    }

    onChange(next)
    requestAnimationFrame(() => {
      el.focus()
      el.setSelectionRange(cursorStart, cursorEnd)
    })
  }

  const tools: Array<{ action: Parameters<typeof apply>[0]; icon: React.ReactNode; title: string }> = [
    { action: 'h1', icon: <TextHOne size={15} />, title: 'Heading' },
    { action: 'h2', icon: <TextHTwo size={15} />, title: 'Subheading' },
    { action: 'bold', icon: <TextB size={15} />, title: 'Bold' },
    { action: 'italic', icon: <TextItalic size={15} />, title: 'Italic' },
    { action: 'bullet', icon: <ListBullets size={15} />, title: 'Bullet list' },
    { action: 'numbered', icon: <ListNumbers size={15} />, title: 'Numbered list' },
  ]

  return (
    <div className="rounded-md border border-input focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2">
      <div className="flex items-center gap-0.5 border-b bg-muted/30 px-1.5 py-1">
        {tools.map((t) => (
          <button
            key={t.action}
            type="button"
            title={t.title}
            onClick={() => apply(t.action)}
            className="flex h-7 w-7 items-center justify-center rounded text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
          >
            {t.icon}
          </button>
        ))}
        <span className="ml-auto pr-1 text-[10px] text-muted-foreground">Formatting shows on the client&apos;s view</span>
      </div>
      <Textarea
        id={id}
        ref={ref}
        rows={rows}
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="border-0 focus-visible:ring-0 focus-visible:ring-offset-0 rounded-t-none"
      />
    </div>
  )
}
