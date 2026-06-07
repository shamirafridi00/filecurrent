import { formatCurrency, formatDate } from '@/lib/utils'

export interface InvoiceDocumentData {
  invoiceNumber: string
  invoiceDate: string
  dueDate?: string | null
  currency: string
  items: Array<{ description: string; quantity: number; unitPrice: number; amount: number }>
  subtotal: number
  taxRate: number
  taxAmount: number
  discountAmount: number
  depositAmount: number
  total: number
  paidAmount: number
  notes?: string | null
  paymentTerms?: string | null
  paymentInstructions?: string | null
  clientName: string
  clientEmail?: string | null
  clientCompany?: string | null
  clientAddress?: string | null
  fromName: string
  fromAddress?: string | null
  fromPhone?: string | null
  fromWebsite?: string | null
}

export interface InvoiceDocumentTheme {
  theme: 'summit' | 'aurora' | 'ledger' | 'slate' | 'ivory'
  primaryColor: string
}

interface Props {
  data: InvoiceDocumentData
  theme: InvoiceDocumentTheme
}

export function InvoiceDocument({ data, theme }: Props) {
  const { theme: themeName, primaryColor } = theme
  const isSummit = themeName === 'summit'
  const isAurora = themeName === 'aurora'
  const isLedger = themeName === 'ledger'
  const isIvory = themeName === 'ivory'

  const tableHeaderBg = isLedger ? 'transparent'
    : isIvory ? '#F9FAFB'
    : isSummit ? '#F3F4F6'
    : isAurora ? `${primaryColor}18`
    : primaryColor
  const tableHeaderColor = (isLedger || isIvory || isSummit) ? '#374151'
    : isAurora ? primaryColor
    : 'white'

  const balance = data.total - data.depositAmount - data.paidAmount

  return (
    <>
      {/* Header */}
      {isSummit ? (
        <div className="px-6 py-5 bg-white flex items-start justify-between"
             style={{ borderLeft: `4px solid ${primaryColor}` }}>
          <div>
            <p className="font-bold text-xl text-slate-800">{data.fromName}</p>
            {data.fromAddress && (
              <p className="text-xs text-slate-400 mt-0.5">{data.fromAddress}</p>
            )}
            <p className="text-xs text-slate-400 mt-0.5 tracking-wide">INVOICE</p>
          </div>
          <p className="text-slate-500 text-sm">{data.invoiceNumber}</p>
        </div>
      ) : isIvory ? (
        <div className="px-6 py-5 bg-white flex items-start justify-between"
             style={{ borderTop: `3px solid ${primaryColor}` }}>
          <div>
            <p className="font-bold text-xl text-slate-800">{data.fromName}</p>
            {data.fromAddress && (
              <p className="text-xs text-slate-400 mt-0.5">{data.fromAddress}</p>
            )}
          </div>
          <div className="text-right">
            <p className="font-bold text-lg tracking-wide" style={{ color: primaryColor }}>INVOICE</p>
            <p className="text-slate-400 text-sm mt-0.5">{data.invoiceNumber}</p>
          </div>
        </div>
      ) : isLedger ? (
        <div className="flex">
          <div className="w-32 shrink-0 flex flex-col justify-between px-5 py-5"
               style={{ backgroundColor: '#111827' }}>
            <div>
              <p className="text-white font-bold text-base leading-tight">{data.fromName}</p>
              <p className="text-gray-400 text-xs mt-1.5 tracking-wide">INVOICE</p>
              <p className="text-gray-400 text-xs mt-0.5">{data.invoiceNumber}</p>
            </div>
          </div>
          <div className="flex-1 px-6 py-5 bg-white flex items-center justify-end">
            {data.fromAddress && (
              <p className="text-xs text-slate-400 text-right">{data.fromAddress}</p>
            )}
          </div>
        </div>
      ) : isAurora ? (
        <div className="px-6 py-5 flex items-start justify-between"
             style={{ background: `linear-gradient(135deg, ${primaryColor}, #14b8a6)` }}>
          <div>
            <p className="text-white font-bold text-xl tracking-wide">INVOICE</p>
            <p className="text-white/70 text-sm mt-0.5">{data.invoiceNumber}</p>
          </div>
          <div className="text-right">
            <p className="text-white font-semibold text-lg">{data.fromName}</p>
            {data.fromAddress && (
              <p className="text-white/70 text-xs mt-0.5">{data.fromAddress}</p>
            )}
          </div>
        </div>
      ) : (
        <div className="px-6 py-5 flex items-start justify-between"
             style={{ backgroundColor: primaryColor }}>
          <div>
            <p className="text-white font-bold text-xl tracking-wide">INVOICE</p>
            <p className="text-white/70 text-sm mt-0.5">{data.invoiceNumber}</p>
          </div>
          <div className="text-right">
            <p className="text-white font-semibold text-lg">{data.fromName}</p>
            {data.fromAddress && (
              <p className="text-white/70 text-xs mt-0.5">{data.fromAddress}</p>
            )}
          </div>
        </div>
      )}

      {/* Body */}
      <div className="p-6">
        {/* FROM / BILL TO */}
        <div className="grid grid-cols-2 gap-6 mb-6">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-1">From</p>
            <p className="font-semibold">{data.fromName}</p>
            {data.fromPhone && <p className="text-sm text-muted-foreground">{data.fromPhone}</p>}
            {data.fromWebsite && <p className="text-sm text-muted-foreground">{data.fromWebsite}</p>}
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-1">Bill To</p>
            <p className="font-semibold">{data.clientName}</p>
            {data.clientCompany && <p className="text-sm text-muted-foreground">{data.clientCompany}</p>}
            {data.clientEmail && <p className="text-sm text-muted-foreground">{data.clientEmail}</p>}
            {data.clientAddress && <p className="text-sm text-muted-foreground">{data.clientAddress}</p>}
          </div>
        </div>

        {/* Meta row */}
        <div className="grid grid-cols-4 gap-4 mb-6 pb-6 border-b text-sm">
          <div>
            <p className="text-xs text-muted-foreground uppercase tracking-wide">Invoice Date</p>
            <p className="font-medium mt-1">{formatDate(data.invoiceDate)}</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground uppercase tracking-wide">Due Date</p>
            <p className="font-medium mt-1">{data.dueDate ? formatDate(data.dueDate) : '—'}</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground uppercase tracking-wide">Currency</p>
            <p className="font-medium mt-1">{data.currency}</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground uppercase tracking-wide">Total</p>
            <p className="font-bold mt-1 text-base" style={{ color: primaryColor }}>
              {formatCurrency(data.total, data.currency)}
            </p>
          </div>
        </div>

        {/* Items table */}
        <table className="w-full mb-6 text-sm">
          <thead>
            {isLedger ? (
              <tr style={{ color: '#374151' }}>
                <th className="text-left p-2.5 font-medium border-b-2 border-slate-800">Description</th>
                <th className="text-right p-2.5 font-medium w-14 border-b-2 border-slate-800">Qty</th>
                <th className="text-right p-2.5 font-medium w-28 border-b-2 border-slate-800">Unit Price</th>
                <th className="text-right p-2.5 font-medium w-28 border-b-2 border-slate-800">Amount</th>
              </tr>
            ) : (
              <tr style={{ color: tableHeaderColor }}>
                <th className="text-left p-2.5 rounded-tl-md font-medium" style={{ backgroundColor: tableHeaderBg }}>Description</th>
                <th className="text-right p-2.5 font-medium w-14" style={{ backgroundColor: tableHeaderBg }}>Qty</th>
                <th className="text-right p-2.5 font-medium w-28" style={{ backgroundColor: tableHeaderBg }}>Unit Price</th>
                <th className="text-right p-2.5 rounded-tr-md font-medium w-28" style={{ backgroundColor: tableHeaderBg }}>Amount</th>
              </tr>
            )}
          </thead>
          <tbody>
            {data.items.map((item, i) => (
              <tr key={i} className="border-b border-border">
                <td className="p-2.5 text-foreground">{item.description}</td>
                <td className="p-2.5 text-right text-muted-foreground">{item.quantity}</td>
                <td className="p-2.5 text-right text-muted-foreground">{formatCurrency(item.unitPrice, data.currency)}</td>
                <td className="p-2.5 text-right font-medium">{formatCurrency(item.amount, data.currency)}</td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr>
              <td colSpan={3} className="p-2.5 text-right text-sm text-muted-foreground">Subtotal</td>
              <td className="p-2.5 text-right">{formatCurrency(data.subtotal, data.currency)}</td>
            </tr>
            {data.taxRate > 0 && (
              <tr>
                <td colSpan={3} className="px-2.5 pb-2 text-right text-sm text-muted-foreground">Tax ({data.taxRate}%)</td>
                <td className="px-2.5 pb-2 text-right">{formatCurrency(data.taxAmount, data.currency)}</td>
              </tr>
            )}
            {data.discountAmount > 0 && (
              <tr>
                <td colSpan={3} className="px-2.5 pb-2 text-right text-sm text-muted-foreground">Discount</td>
                <td className="px-2.5 pb-2 text-right text-destructive">−{formatCurrency(data.discountAmount, data.currency)}</td>
              </tr>
            )}
            {data.depositAmount > 0 && (
              <tr>
                <td colSpan={3} className="px-2.5 pb-2 text-right text-sm text-muted-foreground">Deposit Paid</td>
                <td className="px-2.5 pb-2 text-right text-[#4F6AE6]">−{formatCurrency(data.depositAmount, data.currency)}</td>
              </tr>
            )}
            <tr className="border-t">
              <td colSpan={3} className="p-2.5 text-right font-bold">Total</td>
              <td className="p-2.5 text-right font-bold text-base" style={{ color: primaryColor }}>
                {formatCurrency(data.total, data.currency)}
              </td>
            </tr>
            {data.paidAmount > 0 && (
              <tr>
                <td colSpan={3} className="px-2.5 pb-1 text-right text-sm text-muted-foreground">Amount Paid</td>
                <td className="px-2.5 pb-1 text-right text-[#4F6AE6]">−{formatCurrency(data.paidAmount, data.currency)}</td>
              </tr>
            )}
            {(data.depositAmount > 0 || data.paidAmount > 0) && balance > 0 && (
              <tr>
                <td colSpan={3} className="px-2.5 pb-2 text-right font-bold">Balance Due</td>
                <td className="px-2.5 pb-2 text-right font-bold" style={{ color: primaryColor }}>
                  {formatCurrency(balance, data.currency)}
                </td>
              </tr>
            )}
          </tfoot>
        </table>

        {/* Footer boxes */}
        {(data.notes || data.paymentTerms) && (
          <div className="grid grid-cols-2 gap-4 mb-4">
            {data.notes && (
              <div className="rounded-lg bg-muted/40 border p-3">
                <p className="text-xs font-semibold text-muted-foreground mb-1">Notes</p>
                <p className="text-sm">{data.notes}</p>
              </div>
            )}
            {data.paymentTerms && (
              <div className="rounded-lg bg-muted/40 border p-3">
                <p className="text-xs font-semibold text-muted-foreground mb-1">Payment Terms</p>
                <p className="text-sm">{data.paymentTerms}</p>
              </div>
            )}
          </div>
        )}

        {data.paymentInstructions && (
          <div className="border-l-4 border-green-500 rounded-lg bg-green-50 p-4">
            <p className="text-xs font-semibold uppercase tracking-wide text-green-700 mb-1">How to Pay</p>
            <p className="text-sm text-green-900 whitespace-pre-wrap">{data.paymentInstructions}</p>
          </div>
        )}
      </div>
    </>
  )
}
