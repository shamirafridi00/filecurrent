'use client'

interface InvoiceTemplateData {
  primaryColor?: string | null
  brandName?: string | null
  brandAddress?: string | null
  phone?: string | null
  website?: string | null
  theme?: string | null
  name?: string | null
}

interface PreviewItem {
  description: string
  quantity: number
  unitPrice: number
}

interface PreviewData {
  invoiceNumber: string
  invoiceDate: string
  dueDate?: string
  clientName: string
  items: PreviewItem[]
  subtotal: number
  taxRate: number
  taxAmount: number
  discountAmount: number
  depositAmount: number
  total: number
  balanceDue: number
  notes?: string
  paymentTerms?: string
  currency: string
}

interface InvoicePreviewProps {
  data: PreviewData
  template: InvoiceTemplateData | null
  freelancerName?: string
}

export function InvoicePreview({ data, template, freelancerName }: InvoicePreviewProps) {
  const primaryColor = template?.primaryColor ?? '#635BFF'
  const brandName = template?.brandName || freelancerName || 'Your Business'

  const formatAmount = (n: number) =>
    new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: data.currency || 'USD',
      minimumFractionDigits: 2,
    }).format(n)

  const isIvory = template?.theme === 'ivory'

  return (
    <div className="sticky top-6">
      <p className="text-xs font-semibold uppercase tracking-wide text-slate-400 mb-3">
        Live Preview
      </p>

      <div className="rounded-xl border border-slate-200 shadow-lg overflow-hidden bg-white text-xs">
        {/* Header */}
        {isIvory ? (
          <div
            className="px-5 py-4 flex items-start justify-between bg-white"
            style={{ borderTop: `3px solid ${primaryColor}` }}
          >
            <div>
              <p className="font-bold text-sm text-slate-800">{brandName}</p>
              {template?.brandAddress && (
                <p className="text-slate-400 text-[10px] mt-0.5 max-w-[140px]">
                  {template.brandAddress}
                </p>
              )}
            </div>
            <div className="text-right">
              <p className="font-bold text-base tracking-wide" style={{ color: primaryColor }}>INVOICE</p>
              <p className="text-slate-400 text-[11px] mt-0.5">
                #{data.invoiceNumber || 'INV-2026-0001'}
              </p>
            </div>
          </div>
        ) : (
          <div
            className="px-5 py-4 flex items-start justify-between"
            style={{ backgroundColor: primaryColor }}
          >
            <div>
              <p className="text-white font-bold text-base tracking-wide">INVOICE</p>
              <p className="text-white/70 text-[11px] mt-0.5">
                #{data.invoiceNumber || 'INV-2026-0001'}
              </p>
            </div>
            <div className="text-right">
              <p className="text-white font-semibold text-sm">{brandName}</p>
              {template?.brandAddress && (
                <p className="text-white/70 text-[10px] mt-0.5 max-w-[140px]">
                  {template.brandAddress}
                </p>
              )}
            </div>
          </div>
        )}

        {/* Bill to + dates */}
        <div className="px-5 py-3 grid grid-cols-2 gap-3 border-b border-slate-100">
          <div>
            <p className="text-[10px] uppercase tracking-wide text-slate-400 font-semibold mb-1">Bill To</p>
            <p className="font-semibold text-slate-800">{data.clientName || 'Client Name'}</p>
          </div>
          <div>
            <div className="flex justify-between">
              <span className="text-[10px] text-slate-400">Date</span>
              <span className="text-[10px] text-slate-700">{data.invoiceDate || '—'}</span>
            </div>
            {data.dueDate && (
              <div className="flex justify-between mt-0.5">
                <span className="text-[10px] text-slate-400">Due</span>
                <span className="text-[10px] text-slate-700">{data.dueDate}</span>
              </div>
            )}
          </div>
        </div>

        {/* Line items */}
        <div className="px-5 py-3">
          <div className="grid grid-cols-[1fr_40px_60px_60px] gap-1 pb-1 border-b border-slate-200">
            <span className="text-[10px] text-slate-400 uppercase tracking-wide font-semibold">Description</span>
            <span className="text-[10px] text-slate-400 uppercase tracking-wide font-semibold text-center">Qty</span>
            <span className="text-[10px] text-slate-400 uppercase tracking-wide font-semibold text-right">Rate</span>
            <span className="text-[10px] text-slate-400 uppercase tracking-wide font-semibold text-right">Amount</span>
          </div>
          {data.items.length > 0 ? (
            data.items.slice(0, 5).map((item, i) => (
              <div key={i} className="grid grid-cols-[1fr_40px_60px_60px] gap-1 py-1.5 border-b border-slate-50">
                <span className="text-[11px] text-slate-700 truncate">{item.description || 'Service'}</span>
                <span className="text-[11px] text-slate-600 text-center">{item.quantity}</span>
                <span className="text-[11px] text-slate-600 text-right">{formatAmount(item.unitPrice)}</span>
                <span className="text-[11px] font-medium text-right">{formatAmount(item.quantity * item.unitPrice)}</span>
              </div>
            ))
          ) : (
            <div className="py-3 text-center text-[11px] text-slate-300">
              Add line items to see them here
            </div>
          )}
          {data.items.length > 5 && (
            <p className="text-[10px] text-slate-400 text-center pt-1">+{data.items.length - 5} more items</p>
          )}
        </div>

        {/* Totals */}
        <div className="px-5 pb-4 space-y-1">
          <div className="flex justify-between">
            <span className="text-[11px] text-slate-500">Subtotal</span>
            <span className="text-[11px]">{formatAmount(data.subtotal)}</span>
          </div>
          {data.taxRate > 0 && (
            <div className="flex justify-between">
              <span className="text-[11px] text-slate-500">Tax ({data.taxRate}%)</span>
              <span className="text-[11px]">{formatAmount(data.taxAmount)}</span>
            </div>
          )}
          {data.discountAmount > 0 && (
            <div className="flex justify-between">
              <span className="text-[11px] text-slate-500">Discount</span>
              <span className="text-[11px] text-red-500">−{formatAmount(data.discountAmount)}</span>
            </div>
          )}
          {data.depositAmount > 0 && (
            <div className="flex justify-between">
              <span className="text-[11px] text-slate-500">Deposit Received</span>
              <span className="text-[11px] text-red-500">−{formatAmount(data.depositAmount)}</span>
            </div>
          )}
          <div className="flex justify-between pt-2 border-t border-slate-200">
            <span className="text-[12px] font-bold text-slate-800">
              {data.depositAmount > 0 ? 'Balance Due' : 'Total'}
            </span>
            <span className="text-[14px] font-bold" style={{ color: primaryColor }}>
              {formatAmount(data.balanceDue)}
            </span>
          </div>
        </div>

        {data.notes && (
          <div className="px-5 pb-3">
            <div className="bg-slate-50 rounded-lg p-2.5">
              <p className="text-[10px] text-slate-400 font-semibold mb-1">Notes</p>
              <p className="text-[11px] text-slate-600 leading-relaxed line-clamp-2">{data.notes}</p>
            </div>
          </div>
        )}

        <div className="px-5 py-2 border-t border-slate-100 text-center">
          <p className="text-[9px] text-slate-300">Created with FileCurrent — filecurrent.com</p>
        </div>
      </div>

      {template && (
        <p className="text-[11px] text-slate-400 text-center mt-2">
          Using template: <span className="font-medium text-slate-600">{template.name}</span>
        </p>
      )}
    </div>
  )
}
