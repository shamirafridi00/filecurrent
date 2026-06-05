'use client'

import { useState } from 'react'
import {
  Monitor, Camera, Heart, PaintBrush, PencilLine,
  VideoCamera, ChartBar, FileText, X,
  type Icon,
} from '@phosphor-icons/react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { NICHE_CONTRACT_TEMPLATES, type NicheContractTemplate } from '@/lib/contracts/templates'

const ICON_MAP: Record<string, Icon> = {
  Monitor,
  Camera,
  Heart,
  PaintBrush,
  PencilLine,
  VideoCamera,
  ChartBar,
  FileText,
}

interface Props {
  open: boolean
  onClose: () => void
  onSelect: (template: NicheContractTemplate | null) => void
}

export function TemplateSelector({ open, onClose, onSelect }: Props) {
  const [hovered, setHovered] = useState<string | null>(null)

  const handleSelect = (template: NicheContractTemplate | null) => {
    onSelect(template)
    onClose()
  }

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="max-w-3xl max-h-[85vh] overflow-y-auto p-0">
        <DialogHeader className="px-6 pt-6 pb-4 border-b">
          <div className="flex items-center justify-between">
            <div>
              <DialogTitle className="text-lg font-semibold">Choose a Contract Template</DialogTitle>
              <p className="mt-1 text-sm text-muted-foreground">
                Start with a niche-specific template — all clauses written for US freelancers.
              </p>
            </div>
            <Button variant="ghost" size="sm" className="h-8 w-8 p-0 shrink-0" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        </DialogHeader>

        <div className="p-6">
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            {/* Start from scratch */}
            <button
              type="button"
              className={`group relative flex items-start gap-4 rounded-xl border-2 p-4 text-left transition-all ${
                hovered === '__scratch'
                  ? 'border-primary bg-primary/5'
                  : 'border-border bg-card hover:border-primary/50 hover:bg-muted/40'
              }`}
              onMouseEnter={() => setHovered('__scratch')}
              onMouseLeave={() => setHovered(null)}
              onClick={() => handleSelect(null)}
            >
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-muted">
                <FileText className="h-5 w-5 text-muted-foreground" />
              </div>
              <div className="min-w-0">
                <p className="font-semibold text-foreground text-sm">Start from Scratch</p>
                <p className="mt-0.5 text-xs text-muted-foreground leading-relaxed">
                  Blank contract — write your own clauses from the ground up.
                </p>
              </div>
            </button>

            {/* Niche templates */}
            {NICHE_CONTRACT_TEMPLATES.map((template) => {
              const IconComp = ICON_MAP[template.icon] ?? FileText
              const isHovered = hovered === template.id
              return (
                <button
                  key={template.id}
                  type="button"
                  className={`group relative flex items-start gap-4 rounded-xl border-2 p-4 text-left transition-all ${
                    isHovered
                      ? 'border-primary bg-primary/5'
                      : 'border-border bg-card hover:border-primary/50 hover:bg-muted/40'
                  }`}
                  onMouseEnter={() => setHovered(template.id)}
                  onMouseLeave={() => setHovered(null)}
                  onClick={() => handleSelect(template)}
                >
                  <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg transition-colors ${
                    isHovered ? 'bg-primary/10' : 'bg-muted'
                  }`}>
                    <IconComp className={`h-5 w-5 transition-colors ${isHovered ? 'text-primary' : 'text-muted-foreground'}`} />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-start justify-between gap-2">
                      <p className="font-semibold text-foreground text-sm leading-snug">{template.label}</p>
                      <Badge variant="secondary" className="shrink-0 text-[10px] px-1.5 py-0">Full</Badge>
                    </div>
                    <p className="mt-0.5 text-xs text-muted-foreground leading-relaxed">
                      {template.description}
                    </p>
                  </div>
                </button>
              )
            })}
          </div>

          <p className="mt-4 text-center text-xs text-muted-foreground">
            All templates include professional US-compliant clauses. You can edit any field after selecting.
          </p>
        </div>
      </DialogContent>
    </Dialog>
  )
}
