'use client'

import { useState, useEffect } from 'react'
import {
  Globe, Camera, Heart, PenNib, PencilLine,
  VideoCamera, ChartBar, FileText, Check,
  type Icon,
} from '@phosphor-icons/react'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { CONTRACT_TEMPLATES, type ContractTemplate, type ContractNiche } from '@/lib/contracts/templates'

const ICON_MAP: Record<string, Icon> = {
  Globe,
  Camera,
  Heart,
  PenNib,
  PencilLine,
  VideoCamera,
  ChartBar,
  FileText,
}

// Maps Profession DB values → niche template IDs
const PROFESSION_TO_TEMPLATE: Record<string, ContractNiche> = {
  web_developer: 'web-designer',
  photographer:  'photographer',
  designer:      'graphic-designer',
  copywriter:    'copywriter',
  marketer:      'social-media-manager',
}

interface Props {
  open: boolean
  onSelect: (template: ContractTemplate) => void
  onSkip: () => void
  profession?: string | null
}

export function TemplateSelector({ open, onSelect, onSkip, profession }: Props) {
  const professionTemplateId = profession ? (PROFESSION_TO_TEMPLATE[profession] ?? null) : null
  const defaultSelected = professionTemplateId
    ? (CONTRACT_TEMPLATES.find((t) => t.id === professionTemplateId) ?? null)
    : null

  const [selected, setSelected] = useState<ContractTemplate | null>(defaultSelected)

  // When dialog opens, reset to profession-based default (so re-opens always start fresh)
  useEffect(() => {
    if (open) setSelected(defaultSelected)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open])

  const handleUse = () => {
    if (!selected) return
    onSelect(selected)
    setSelected(null)
  }

  const handleSkip = () => {
    setSelected(null)
    onSkip()
  }

  const nicheTemplates = CONTRACT_TEMPLATES.filter((t) => t.id !== 'blank')
  const blankTemplate = CONTRACT_TEMPLATES.find((t) => t.id === 'blank')!

  return (
    <Dialog open={open} onOpenChange={(v) => { if (!v) handleSkip() }}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto p-0">
        <DialogHeader className="px-6 pt-6 pb-4 border-b sticky top-0 bg-background z-10">
          <DialogTitle className="text-xl font-semibold">Choose a Contract Template</DialogTitle>
          <p className="mt-1 text-sm text-muted-foreground">
            Start with a professionally written template for your niche, or begin from scratch.
          </p>
        </DialogHeader>

        <div className="p-6 space-y-4">
          {/* Niche templates — 2 cols mobile, 3 cols desktop */}
          <div className="grid grid-cols-2 gap-3 lg:grid-cols-3 xl:grid-cols-4">
            {nicheTemplates.map((template) => {
              const IconComp = ICON_MAP[template.icon] ?? FileText
              const isSelected = selected?.id === template.id
              return (
                <button
                  key={template.id}
                  type="button"
                  onClick={() => setSelected(template)}
                  className={`relative flex flex-col items-start gap-3 rounded-xl border-2 p-4 text-left transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-primary ${
                    isSelected
                      ? 'border-primary bg-primary/5 shadow-md'
                      : 'border-border bg-card hover:border-primary/60 hover:bg-muted/40 hover:shadow-sm'
                  }`}
                >
                  {isSelected && (
                    <span className="absolute top-2.5 right-2.5 flex h-5 w-5 items-center justify-center rounded-full bg-primary">
                      <Check className="h-3 w-3 text-white" weight="bold" />
                    </span>
                  )}
                  <div className={`flex h-10 w-10 items-center justify-center rounded-lg transition-colors ${
                    isSelected ? 'bg-primary/15' : 'bg-muted'
                  }`}>
                    <IconComp
                      className={`h-5 w-5 transition-colors ${isSelected ? 'text-primary' : 'text-muted-foreground'}`}
                    />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className={`text-sm font-semibold leading-snug ${isSelected ? 'text-primary' : 'text-foreground'}`}>
                      {template.label}
                    </p>
                    <p className="mt-1 text-xs text-muted-foreground leading-relaxed">
                      {template.description}
                    </p>
                  </div>
                </button>
              )
            })}

            {/* Start from scratch — dashed, muted */}
            <button
              type="button"
              onClick={() => setSelected(blankTemplate)}
              className={`relative flex flex-col items-start gap-3 rounded-xl border-2 border-dashed p-4 text-left transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-primary ${
                selected?.id === 'blank'
                  ? 'border-primary bg-primary/5 shadow-md'
                  : 'border-border bg-muted/20 hover:border-muted-foreground/40 hover:bg-muted/40'
              }`}
            >
              {selected?.id === 'blank' && (
                <span className="absolute top-2.5 right-2.5 flex h-5 w-5 items-center justify-center rounded-full bg-primary">
                  <Check className="h-3 w-3 text-white" weight="bold" />
                </span>
              )}
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-muted">
                <FileText className="h-5 w-5 text-muted-foreground" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-semibold text-muted-foreground leading-snug">
                  {blankTemplate.label}
                </p>
                <p className="mt-1 text-xs text-muted-foreground leading-relaxed">
                  {blankTemplate.description}
                </p>
              </div>
            </button>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between pt-2 border-t">
            <button
              type="button"
              onClick={handleSkip}
              className="text-sm text-muted-foreground underline-offset-4 hover:underline focus:outline-none"
            >
              Skip for now
            </button>
            <Button
              onClick={handleUse}
              disabled={!selected}
              className="min-w-36"
            >
              {selected
                ? selected.id === 'blank'
                  ? 'Start from Scratch'
                  : `Use ${selected.label}`
                : 'Select a Template'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
