'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Save, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { PageHeader } from '@/components/ui'
import { toast } from 'sonner'
import type { InvoiceTemplateRow } from '@/lib/db/supabase'

const THEMES = [
  { id: 'summit', label: 'Summit', desc: 'Clean & minimal' },
  { id: 'aurora', label: 'Aurora', desc: 'Modern gradient' },
  { id: 'ledger', label: 'Ledger', desc: 'Classic tabular' },
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
  const [primaryColor, setPrimaryColor] = useState(initial?.primaryColor ?? '#0F766E')
  const [secondaryColor, setSecondaryColor] = useState(initial?.secondaryColor ?? '#111827')
  const [brandName, setBrandName] = useState(initial?.brandName ?? '')
  const [brandAddress, setBrandAddress] = useState(initial?.brandAddress ?? '')
  const [phone, setPhone] = useState(initial?.phone ?? '')
  const [website, setWebsite] = useState(initial?.website ?? '')
  const [taxId, setTaxId] = useState(initial?.taxId ?? '')
  const [defaultNotes, setDefaultNotes] = useState(initial?.defaultNotes ?? '')
  const [defaultPaymentTerms, setDefaultPaymentTerms] = useState(initial?.defaultPaymentTerms ?? '')
  const [defaultTaxRate, setDefaultTaxRate] = useState(String(initial?.defaultTaxRate ?? 0))
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
          defaultTaxRate: parseFloat(defaultTaxRate) || 0, isDefault,
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
                <div className="grid grid-cols-3 gap-3">
                  {THEMES.map((t) => (
                    <button
                      key={t.id}
                      type="button"
                      onClick={() => setTheme(t.id)}
                      className={`rounded-lg border p-3 text-left transition-colors ${
                        theme === t.id
                          ? 'border-primary bg-accent ring-2 ring-primary'
                          : 'border-border hover:bg-muted'
                      }`}
                    >
                      <p className="font-medium text-sm">{t.label}</p>
                      <p className="text-xs text-muted-foreground">{t.desc}</p>
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
          <Save className="mr-1 h-4 w-4" />
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

  return (
    <div className="rounded-lg border bg-white overflow-hidden text-xs shadow-sm">
      {/* Header */}
      <div
        className="px-4 py-3"
        style={{
          background: isAurora
            ? `linear-gradient(135deg, ${primaryColor}, ${secondaryColor})`
            : primaryColor,
          color: 'white',
        }}
      >
        <div className="flex justify-between items-start">
          <div>
            <p className="font-bold text-sm">{brandName || 'Your Business'}</p>
            <p className="opacity-75 text-xs">INVOICE</p>
          </div>
          <div className="text-right opacity-90">
            <p>INV-2026-0001</p>
            <p className="opacity-75">Jun 1, 2026</p>
          </div>
        </div>
      </div>

      {/* Body */}
      <div className="p-4 space-y-3">
        <div className="flex justify-between text-xs">
          <div>
            <p className="text-muted-foreground">Bill To</p>
            <p className="font-medium" style={{ color: secondaryColor }}>Client Name</p>
            <p className="text-muted-foreground">client@example.com</p>
          </div>
          <div className="text-right">
            <p className="text-muted-foreground">Amount Due</p>
            <p className="text-lg font-bold" style={{ color: primaryColor }}>$1,500.00</p>
          </div>
        </div>

        <div className={`rounded text-xs overflow-hidden ${isLedger ? 'border' : ''}`}>
          <div className="py-1.5 px-2 text-white text-xs font-medium flex justify-between"
            style={{ backgroundColor: isLedger ? secondaryColor : primaryColor }}>
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
