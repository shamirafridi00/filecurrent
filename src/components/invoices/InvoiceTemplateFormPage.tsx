'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { FloppyDisk, X } from '@phosphor-icons/react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { PageHeader } from '@/components/ui'
import { toast } from 'sonner'
import type { InvoiceTemplateRow } from '@/lib/db/supabase'
import { SummitPreview, AuroraPreview, LedgerPreview, SlatePreview, IvoryPreview } from './InvoiceThemePreviews'

const THEME_OPTIONS = [
  { value: 'summit' as const, label: 'Summit', desc: 'Clean & minimal', Preview: SummitPreview },
  { value: 'aurora' as const, label: 'Aurora', desc: 'Modern gradient', Preview: AuroraPreview },
  { value: 'ledger' as const, label: 'Ledger', desc: 'Classic tabular', Preview: LedgerPreview },
  { value: 'slate' as const, label: 'Slate', desc: 'Bold & brand-forward', Preview: SlatePreview },
  { value: 'ivory' as const, label: 'Ivory', desc: 'Premium & minimal', Preview: IvoryPreview },
]

interface Props {
  mode: 'create' | 'edit'
  templateId?: string
  initial?: Partial<InvoiceTemplateRow>
}

export function InvoiceTemplateFormPage({ mode, templateId, initial }: Props) {
  const router = useRouter()
  const [saving, setSaving] = useState(false)
  const [name, setName] = useState(initial?.name ?? '')
  const [theme, setTheme] = useState(initial?.theme ?? 'summit')
  const [primaryColor, setPrimaryColor] = useState(initial?.primaryColor ?? '#635BFF')
  const [secondaryColor, setSecondaryColor] = useState(initial?.secondaryColor ?? '#111827')
  const [brandName, setBrandName] = useState(initial?.brandName ?? '')
  const [brandAddress, setBrandAddress] = useState(initial?.brandAddress ?? '')
  const [phone, setPhone] = useState(initial?.phone ?? '')
  const [website, setWebsite] = useState(initial?.website ?? '')
  const [taxId, setTaxId] = useState(initial?.taxId ?? '')
  const [defaultNotes, setDefaultNotes] = useState(initial?.defaultNotes ?? '')
  const [defaultPaymentTerms, setDefaultPaymentTerms] = useState(initial?.defaultPaymentTerms ?? '')
  const [defaultTaxRate, setDefaultTaxRate] = useState(String(initial?.defaultTaxRate ?? 0))
  const [paymentInstructions, setPaymentInstructions] = useState(initial?.paymentInstructions ?? '')
  const [isDefault, setIsDefault] = useState(initial?.isDefault ?? false)

  const handleSubmit = async () => {
    if (!name.trim()) { toast.error('Template name is required'); return }
    setSaving(true)
    try {
      const url = mode === 'create' ? '/api/invoice-templates' : `/api/invoice-templates/${templateId}`
      const res = await fetch(url, {
        method: mode === 'create' ? 'POST' : 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name, theme, primaryColor, secondaryColor, brandName, brandAddress,
          phone, website, taxId, defaultNotes, defaultPaymentTerms,
          defaultTaxRate: parseFloat(defaultTaxRate) || 0,
          paymentInstructions: paymentInstructions || null,
          isDefault,
        }),
      })
      if (!res.ok) throw new Error()
      toast.success(mode === 'create' ? 'Template created' : 'Template updated')
      router.push('/invoices/templates')
      router.refresh()
    } catch {
      toast.error('Failed to save template')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div>
      <PageHeader
        title={mode === 'create' ? 'New Invoice Template' : 'Edit Invoice Template'}
        backHref="/invoices/templates"
        backLabel="Back to Templates"
      />

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-[1fr_340px]">
        <div className="space-y-5">
          <Card>
            <CardHeader><CardTitle className="text-base">Template Name</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-1.5">
                <Label htmlFor="tpl-name">Template Name</Label>
                <Input id="tpl-name" placeholder="e.g., Client Invoices" value={name} onChange={(e) => setName(e.target.value)} />
              </div>
              <div className="flex items-center gap-3">
                <Switch id="tpl-default" checked={isDefault} onCheckedChange={setIsDefault} />
                <Label htmlFor="tpl-default" className="cursor-pointer">Set as default template</Label>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader><CardTitle className="text-base">Appearance</CardTitle></CardHeader>
            <CardContent className="space-y-5">
              <div>
                <Label className="mb-3 block">Theme</Label>
                <div className="grid grid-cols-3 gap-3 sm:grid-cols-5">
                  {THEME_OPTIONS.map(({ value, label, desc, Preview }) => (
                    <button
                      key={value}
                      type="button"
                      onClick={() => setTheme(value)}
                      className={`relative text-left rounded-xl border-2 p-3 transition-all w-full ${
                        theme === value
                          ? 'border-[#635BFF] bg-[#F0EFFF] shadow-sm'
                          : 'border-slate-200 hover:border-slate-300 bg-white'
                      }`}
                    >
                      {theme === value && (
                        <div className="absolute top-2 right-2 w-5 h-5 rounded-full bg-[#635BFF] flex items-center justify-center">
                          <span className="text-white text-[9px] font-bold">✓</span>
                        </div>
                      )}
                      <div className="rounded-lg overflow-hidden border border-slate-100 mb-2.5 shadow-sm">
                        <Preview primaryColor={primaryColor} />
                      </div>
                      <p className="font-semibold text-sm text-slate-800">{label}</p>
                      <p className="text-xs text-slate-500 mt-0.5">{desc}</p>
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label htmlFor="primary-color">Primary Color</Label>
                  <div className="flex gap-2">
                    <input type="color" value={primaryColor} onChange={(e) => setPrimaryColor(e.target.value)}
                      className="h-10 w-12 cursor-pointer rounded border border-input" />
                    <Input value={primaryColor} onChange={(e) => setPrimaryColor(e.target.value)} className="font-mono" />
                  </div>
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="secondary-color">Secondary Color</Label>
                  <div className="flex gap-2">
                    <input type="color" value={secondaryColor} onChange={(e) => setSecondaryColor(e.target.value)}
                      className="h-10 w-12 cursor-pointer rounded border border-input" />
                    <Input value={secondaryColor} onChange={(e) => setSecondaryColor(e.target.value)} className="font-mono" />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader><CardTitle className="text-base">Business Information</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label>Business Name</Label>
                  <Input placeholder="Acme Creative Studio" value={brandName} onChange={(e) => setBrandName(e.target.value)} />
                </div>
                <div className="space-y-1.5">
                  <Label>Phone</Label>
                  <Input placeholder="+1 (555) 000-0000" value={phone} onChange={(e) => setPhone(e.target.value)} />
                </div>
                <div className="space-y-1.5">
                  <Label>Website</Label>
                  <Input placeholder="https://yourdomain.com" value={website} onChange={(e) => setWebsite(e.target.value)} />
                </div>
                <div className="space-y-1.5">
                  <Label>Tax ID / VAT Number</Label>
                  <Input placeholder="Optional" value={taxId} onChange={(e) => setTaxId(e.target.value)} />
                </div>
              </div>
              <div className="space-y-1.5">
                <Label>Business Address</Label>
                <Textarea rows={2} placeholder="123 Main St, City, State 12345" value={brandAddress} onChange={(e) => setBrandAddress(e.target.value)} />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader><CardTitle className="text-base">Invoice Defaults</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-1.5">
                <Label>Default Notes</Label>
                <Textarea rows={2} placeholder="Thank you for your business!" value={defaultNotes} onChange={(e) => setDefaultNotes(e.target.value)} />
              </div>
              <div className="space-y-1.5">
                <Label>Default Payment Terms</Label>
                <Textarea rows={2} placeholder="Payment due within 30 days of invoice date" value={defaultPaymentTerms} onChange={(e) => setDefaultPaymentTerms(e.target.value)} />
              </div>
              <div className="w-40 space-y-1.5">
                <Label>Default Tax Rate (%)</Label>
                <Input type="number" min="0" max="100" step="0.1" value={defaultTaxRate} onChange={(e) => setDefaultTaxRate(e.target.value)} />
              </div>
              <div className="space-y-1.5">
                <Label>Payment Instructions</Label>
                <Textarea
                  rows={3}
                  placeholder="e.g. Pay via Zelle to email@example.com, PayPal @handle, or bank transfer. Include invoice number as reference."
                  value={paymentInstructions}
                  onChange={(e) => setPaymentInstructions(e.target.value)}
                />
                <p className="text-xs text-muted-foreground">Shown on the invoice so clients always know how to pay.</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Live Preview */}
        <div>
          <Card className="sticky top-20">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm text-muted-foreground">Live Preview</CardTitle>
            </CardHeader>
            <CardContent className="p-4">
              <InvoicePreview
                theme={theme} primaryColor={primaryColor} secondaryColor={secondaryColor}
                brandName={brandName}
              />
            </CardContent>
          </Card>
        </div>
      </div>

      <div className="mt-6 flex justify-end gap-3">
        <Button variant="outline" onClick={() => router.push('/invoices/templates')}>
          <X className="mr-1 h-4 w-4" /> Cancel
        </Button>
        <Button onClick={handleSubmit} disabled={saving}>
          <FloppyDisk className="mr-1 h-4 w-4" />
          {saving ? 'Saving…' : mode === 'create' ? 'Create Template' : 'Save Changes'}
        </Button>
      </div>
    </div>
  )
}

function InvoicePreview({ theme, primaryColor, secondaryColor, brandName }: {
  theme: string; primaryColor: string; secondaryColor: string; brandName: string
}) {
  const isAurora = theme === 'aurora'
  const isLedger = theme === 'ledger'
  const isSlate = theme === 'slate'
  const isIvory = theme === 'ivory'

  const headerStyle = isIvory
    ? { backgroundColor: '#ffffff', borderTop: `3px solid ${primaryColor}` }
    : isAurora
    ? { background: `linear-gradient(135deg, ${primaryColor}, ${secondaryColor})`, color: 'white' }
    : { backgroundColor: primaryColor, color: 'white' }

  return (
    <div className="rounded-lg border bg-white overflow-hidden text-xs shadow-sm">
      {/* Header */}
      <div className="px-4 py-3" style={headerStyle}>
        {isIvory ? (
          <div className="flex justify-between items-start">
            <p className="font-bold text-sm text-slate-800">{brandName || 'Your Business Name'}</p>
            <div className="text-right">
              <p className="font-bold text-xs" style={{ color: primaryColor }}>INVOICE</p>
              <p className="text-slate-400 text-[10px]">INV-2026-0001</p>
            </div>
          </div>
        ) : isSlate ? (
          <div className="flex justify-between items-end">
            <p className="font-bold text-sm text-white">{brandName || 'Your Business Name'}</p>
            <p className="text-white/70 text-[10px] font-semibold">INVOICE</p>
          </div>
        ) : (
          <div className="flex justify-between items-start">
            <div>
              <p className="font-bold text-sm">{brandName || 'Your Business Name'}</p>
              <p className="opacity-75 text-xs">INVOICE</p>
            </div>
            <div className="text-right opacity-90">
              <p>INV-2026-0001</p>
              <p className="opacity-75">Jun 1, 2026</p>
            </div>
          </div>
        )}
      </div>

      {/* Body */}
      <div className="p-4 space-y-3">
        <div className="flex justify-between text-xs">
          <div>
            <p className="text-muted-foreground">Bill To</p>
            <p className="font-medium" style={{ color: isIvory ? '#111827' : secondaryColor }}>Client Name</p>
            <p className="text-muted-foreground">client@example.com</p>
          </div>
          <div className="text-right">
            <p className="text-muted-foreground">Amount Due</p>
            <p className="text-lg font-bold" style={{ color: primaryColor }}>$1,500.00</p>
          </div>
        </div>

        <div className={`rounded text-xs overflow-hidden ${isLedger ? 'border' : ''}`}>
          <div
            className="py-1.5 px-2 text-xs font-medium flex justify-between"
            style={{
              backgroundColor: isLedger ? secondaryColor : isIvory ? '#F9FAFB' : primaryColor,
              color: isIvory ? '#374151' : 'white',
            }}
          >
            <span>Description</span>
            <span>Amount</span>
          </div>
          <div className="px-2 py-1.5 flex justify-between border-b border-border">
            <span className="text-muted-foreground">Sample Service</span>
            <span>$1,500.00</span>
          </div>
          <div className="px-2 py-1.5 flex justify-between font-bold" style={{ color: primaryColor }}>
            <span>Total</span>
            <span>$1,500.00</span>
          </div>
        </div>
      </div>
    </div>
  )
}
