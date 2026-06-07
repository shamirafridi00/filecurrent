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
  const isSummit = template?.theme === 'summit' || (!template?.theme)
  const isAurora = template?.theme === 'aurora'
  const isLedger = template?.theme === 'ledger'

  // ── Ledger: two-column sidebar layout ──────────────────────
  if (isLedger) {
    return (
      <div className="sticky top-6">
        <p className="text-xs font-semibold uppercase tracking-wide text-slate-400 mb-3">
          Live Preview
        </p>
        <div className="rounded-xl border border-slate-200 shadow-lg overflow-hidden bg-white">
          {/* Header: dark sidebar + white right */}
          <div className="flex">
            <div className="w-24 shrink-0 px-3 py-3" style={{ backgroundColor: '#111827' }}>
              <p className="text-white font-bold text-[11px] leading-tight break-words">{brandName}</p>
              <p className="text-gray-400 text-[9px] mt-1.5 tracking-wide">INVOICE</p>
              <p className="text-gray-400 text-[9px] mt-0.5 break-all">
                #{data.invoiceNumber || 'INV-001'}
              </p>
            </div>
            <div className="flex-1 px-3 py-3 bg-white flex items-center justify-end">
              {template?.brandAddress && (
                <p className="text-[9px] text-slate-400 text-right">{template.brandAddress}</p>
              )}
            </div>
          </div>

          {/* FROM / BILL TO */}
          <div className="px-3 py-2 grid grid-cols-2 gap-3 border-b border-slate-100">
            <div>
              <p className="text-[8px] uppercase tracking-wide text-slate-400 font-semibold mb-0.5">From</p>
              <p className="text-[10px] font-semibold text-slate-800 truncate">{brandName}</p>
            </div>
            <div>
              <p className="text-[8px] uppercase tracking-wide text-slate-400 font-semibold mb-0.5">Bill To</p>
              <p className="text-[10px] font-semibold text-slate-800 truncate">{data.clientName || 'Client Name'}</p>
            </div>
          </div>

          {/* Line items */}
          <div className="px-3 py-2 flex-1">
            <div className="grid grid-cols-[1fr_24px_52px_52px] gap-1 pb-1 border-b-2 border-slate-800 mb-1">
              <span className="text-[8px] text-slate-700 font-semibold uppercase">Desc</span>
              <span className="text-[8px] text-slate-700 font-semibold text-center">Q</span>
              <span className="text-[8px] text-slate-700 font-semibold text-right">Rate</span>
              <span className="text-[8px] text-slate-700 font-semibold text-right">Amt</span>
            </div>
            {data.items.length > 0 ? (
              data.items.slice(0, 4).map((item, i) => (
                <div key={i} className="grid grid-cols-[1fr_24px_52px_52px] gap-1 py-1 border-b border-slate-50">
                  <span className="text-[9px] text-slate-700 truncate">{item.description || 'Service'}</span>
                  <span className="text-[9px] text-slate-500 text-center">{item.quantity}</span>
                  <span className="text-[9px] text-slate-500 text-right">{formatAmount(item.unitPrice)}</span>
                  <span className="text-[9px] font-medium text-right">{formatAmount(item.quantity * item.unitPrice)}</span>
                </div>
              ))
            ) : (
              <div className="py-3 text-center text-[9px] text-slate-300">Add line items</div>
            )}
            {data.items.length > 4 && (
              <p className="text-[8px] text-slate-400 pt-1">+{data.items.length - 4} more</p>
            )}
          </div>

          {/* Totals */}
          <div className="px-3 py-2 border-t border-slate-200 space-y-0.5">
            <div className="flex justify-between">
              <span className="text-[9px] text-slate-500">Subtotal</span>
              <span className="text-[9px]">{formatAmount(data.subtotal)}</span>
            </div>
            {data.taxRate > 0 && (
              <div className="flex justify-between">
                <span className="text-[9px] text-slate-500">Tax ({data.taxRate}%)</span>
                <span className="text-[9px]">{formatAmount(data.taxAmount)}</span>
              </div>
            )}
            {data.discountAmount > 0 && (
              <div className="flex justify-between">
                <span className="text-[9px] text-slate-500">Discount</span>
                <span className="text-[9px] text-red-500">−{formatAmount(data.discountAmount)}</span>
              </div>
            )}
            {data.depositAmount > 0 && (
              <div className="flex justify-between">
                <span className="text-[9px] text-slate-500">Deposit Paid</span>
                <span className="text-[9px] text-[#4F6AE6]">−{formatAmount(data.depositAmount)}</span>
              </div>
            )}
            <div className="flex justify-between pt-1.5 border-t border-slate-200">
              <span className="text-[10px] font-bold text-slate-800">Total</span>
              <span className="text-[11px] font-bold" style={{ color: primaryColor }}>
                {formatAmount(data.balanceDue)}
              </span>
            </div>
          </div>

          <div className="px-4 py-1.5 border-t border-slate-100 text-center">
            <p className="text-[8px] text-slate-300">Created with FileCurrent — filecurrent.com</p>
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

  // ── Standard layout (Summit, Aurora, Ivory, Slate) ─────────
  return (
    <div className="sticky top-6">
      <p className="text-xs font-semibold uppercase tracking-wide text-slate-400 mb-3">
        Live Preview
      </p>

      <div className="rounded-xl border border-slate-200 shadow-lg overflow-hidden bg-white text-xs">
        {/* Header */}
        {isSummit ? (
          <div
            className="px-5 py-4 flex items-start justify-between bg-white"
            style={{ borderLeft: `4px solid ${primaryColor}` }}
          >
            <div>
              <p className="font-bold text-base text-slate-800">{brandName}</p>
              {template?.brandAddress && (
                <p className="text-slate-400 text-[10px] mt-0.5 max-w-[140px]">{template.brandAddress}</p>
              )}
              <p className="text-slate-400 text-[10px] mt-0.5">INVOICE</p>
            </div>
            <div className="text-right">
              <p className="text-slate-500 text-[11px]">#{data.invoiceNumber || 'INV-2026-0001'}</p>
            </div>
          </div>
        ) : isIvory ? (
          <div
            className="px-5 py-4 flex items-start justify-between bg-white"
            style={{ borderTop: `3px solid ${primaryColor}` }}
          >
            <div>
              <p className="font-bold text-sm text-slate-800">{brandName}</p>
              {template?.brandAddress && (
                <p className="text-slate-400 text-[10px] mt-0.5 max-w-[140px]">{template.brandAddress}</p>
              )}
            </div>
            <div className="text-right">
              <p className="font-bold text-base tracking-wide" style={{ color: primaryColor }}>INVOICE</p>
              <p className="text-slate-400 text-[11px] mt-0.5">#{data.invoiceNumber || 'INV-2026-0001'}</p>
            </div>
          </div>
        ) : isAurora ? (
          <div
            className="px-5 py-4 flex items-start justify-between"
            style={{ background: `linear-gradient(135deg, ${primaryColor}, #14b8a6)` }}
          >
            <div>
              <p className="text-white font-bold text-base tracking-wide">INVOICE</p>
              <p className="text-white/70 text-[11px] mt-0.5">#{data.invoiceNumber || 'INV-2026-0001'}</p>
            </div>
            <div className="text-right">
              <p className="text-white font-semibold text-sm">{brandName}</p>
              {template?.brandAddress && (
                <p className="text-white/70 text-[10px] mt-0.5 max-w-[140px]">{template.brandAddress}</p>
              )}
            </div>
          </div>
        ) : (
          /* Slate and any other theme */
          <div
            className="px-5 py-4 flex items-start justify-between"
            style={{ backgroundColor: primaryColor }}
          >
            <div>
              <p className="text-white font-bold text-base tracking-wide">INVOICE</p>
              <p className="text-white/70 text-[11px] mt-0.5">#{data.invoiceNumber || 'INV-2026-0001'}</p>
            </div>
            <div className="text-right">
              <p className="text-white font-semibold text-sm">{brandName}</p>
              {template?.brandAddress && (
                <p className="text-white/70 text-[10px] mt-0.5 max-w-[140px]">{template.brandAddress}</p>
              )}
            </div>
          </div>
        )}

        {/* Bill to + dates */}
        <div
          className="px-5 py-3 grid grid-cols-2 gap-3 border-b border-slate-100"
          style={isAurora ? { backgroundColor: `${primaryColor}10` } : undefined}
        >
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
          <div
            className="grid grid-cols-[1fr_40px_60px_60px] gap-1 pb-1 border-b"
            style={
              isAurora
                ? { borderColor: `${primaryColor}30`, backgroundColor: `${primaryColor}18`, padding: '4px 6px', borderRadius: '4px 4px 0 0' }
                : isSummit
                ? { backgroundColor: '#F3F4F6', padding: '4px 6px', borderRadius: '4px 4px 0 0', borderColor: '#E5E7EB' }
                : { borderColor: '#e2e8f0' }
            }
          >
            <span
              className="text-[10px] uppercase tracking-wide font-semibold"
              style={{ color: isAurora ? primaryColor : isSummit ? '#374151' : '#94a3b8' }}
            >
              Description
            </span>
            <span
              className="text-[10px] uppercase tracking-wide font-semibold text-center"
              style={{ color: isAurora ? primaryColor : isSummit ? '#374151' : '#94a3b8' }}
            >
              Qty
            </span>
            <span
              className="text-[10px] uppercase tracking-wide font-semibold text-right"
              style={{ color: isAurora ? primaryColor : isSummit ? '#374151' : '#94a3b8' }}
            >
              Rate
            </span>
            <span
              className="text-[10px] uppercase tracking-wide font-semibold text-right"
              style={{ color: isAurora ? primaryColor : isSummit ? '#374151' : '#94a3b8' }}
            >
              Amount
            </span>
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
