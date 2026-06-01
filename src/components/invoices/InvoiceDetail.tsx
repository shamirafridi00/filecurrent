'use client'

// ============================================================
// src/components/invoices/InvoiceDetail.tsx
// Full invoice view — all sections including payment recording
// ============================================================

import { useState } from 'react'
import Link from 'next/link'
import {
  Edit,
  Trash2,
  Send,
  Bell,
  Download,
  Printer,
  Eye,
  CheckCircle,
} from 'lucide-react'
import {
  Button,
  Card,
  InvoiceBadge,
  AlertBanner,
  ConfirmDialog,
  Modal,
  Select,
  Input,
  Textarea,
} from '@/components/ui'
import { formatCurrency, formatDate, formatDatetime } from '@/lib/utils'
import { PAYMENT_METHODS } from '@/types'
import type { Invoice, Payment } from '@/types'

interface InvoiceDetailProps {
  invoice: Invoice
  payments: Payment[]
  showSuccess?: boolean
}

export function InvoiceDetail({ invoice, payments, showSuccess = false }: InvoiceDetailProps) {
  const [successDismissed, setSuccessDismissed] = useState(false)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [showSendConfirm, setShowSendConfirm] = useState(false)
  const [showReminderModal, setShowReminderModal] = useState(false)
  const [paymentAmount, setPaymentAmount] = useState('')
  const [paymentDate, setPaymentDate] = useState('')
  const [paymentMethod, setPaymentMethod] = useState('')
  const [paymentNotes, setPaymentNotes] = useState('')
  const [recordingPayment, setRecordingPayment] = useState(false)

  const handleRecordPayment = async () => {
    setRecordingPayment(true)
    await new Promise((r) => setTimeout(r, 800))
    setRecordingPayment(false)
  }

  const handleDelete = async () => {
    setShowDeleteConfirm(false)
    // API call here
  }

  const handleSendInvoice = async () => {
    setShowSendConfirm(false)
    // API call here
  }

  return (
    <div className="max-w-3xl">
      {/* Success toast */}
      {showSuccess && !successDismissed && (
        <AlertBanner
          type="success"
          message="Invoice created successfully!"
          onClose={() => setSuccessDismissed(true)}
        />
      )}

      {/* Back link */}
      <Link
        href="/invoices"
        className="inline-flex items-center gap-1 text-sm text-slate-500 hover:text-slate-700 mb-4"
      >
        ← Back to Invoices
      </Link>

      {/* Invoice card */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden mb-5">
        {/* Header bar */}
        <div className="bg-indigo-600 text-white px-6 py-5 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-wide">INVOICE</h1>
            <p className="text-indigo-200 text-sm mt-0.5">{invoice.invoiceNumber}</p>
          </div>
          <span className="bg-white text-indigo-600 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
            {invoice.status}
          </span>
        </div>

        <div className="p-6">
          {/* FROM / BILL TO */}
          <div className="grid grid-cols-2 gap-8 mb-6">
            <div>
              <p className="text-xs uppercase tracking-wide text-slate-500 font-semibold mb-2">From</p>
              <p className="font-semibold text-slate-800">{invoice.client?.name ?? 'Your Business'}</p>
              <p className="text-sm text-slate-500">{invoice.client?.email ?? ''}</p>
            </div>
            <div>
              <p className="text-xs uppercase tracking-wide text-slate-500 font-semibold mb-2">Bill To</p>
              <div className="bg-slate-50 rounded-lg p-3 border border-slate-200">
                <p className="font-semibold text-slate-800">{invoice.client?.name}</p>
                {invoice.client?.address && (
                  <p className="text-sm text-slate-500">{invoice.client.address}</p>
                )}
                {invoice.client?.email && (
                  <p className="text-sm text-slate-500">{invoice.client.email}</p>
                )}
              </div>
            </div>
          </div>

          {/* Meta row */}
          <div className="grid grid-cols-4 gap-4 mb-6 pb-6 border-b border-slate-100">
            <div>
              <p className="text-xs text-slate-500 uppercase tracking-wide">Invoice Date</p>
              <p className="font-medium text-sm mt-1">{formatDate(invoice.invoiceDate)}</p>
            </div>
            <div>
              <p className="text-xs text-slate-500 uppercase tracking-wide">Due Date</p>
              <p className="font-medium text-sm mt-1">{invoice.dueDate ? formatDate(invoice.dueDate) : '—'}</p>
            </div>
            <div>
              <p className="text-xs text-slate-500 uppercase tracking-wide">Currency</p>
              <p className="font-medium text-sm mt-1">{invoice.currency}</p>
            </div>
            <div>
              <p className="text-xs text-slate-500 uppercase tracking-wide">Total Amount</p>
              <p className="font-bold text-indigo-600 text-base mt-1">
                {formatCurrency(invoice.total, invoice.currency)}
              </p>
            </div>
          </div>

          {/* Items table */}
          <h3 className="font-semibold text-slate-800 mb-3">Items</h3>
          <table className="w-full mb-6 text-sm">
            <thead>
              <tr className="bg-slate-800 text-white">
                <th className="text-left p-3 rounded-tl-lg font-medium">Description</th>
                <th className="text-right p-3 font-medium w-16">Qty</th>
                <th className="text-right p-3 font-medium w-28">Unit Price</th>
                <th className="text-right p-3 rounded-tr-lg font-medium w-28">Amount</th>
              </tr>
            </thead>
            <tbody>
              {invoice.items.map((item) => (
                <tr key={item.id} className="border-b border-slate-100">
                  <td className="p-3 text-slate-700">{item.description}</td>
                  <td className="p-3 text-right text-slate-600">{item.quantity.toFixed(2)}</td>
                  <td className="p-3 text-right text-slate-600">
                    {formatCurrency(item.unitPrice, invoice.currency)}
                  </td>
                  <td className="p-3 text-right font-medium">
                    {formatCurrency(item.amount, invoice.currency)}
                  </td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr className="border-t border-slate-200">
                <td colSpan={3} className="p-3 text-right text-slate-600 text-sm">Subtotal:</td>
                <td className="p-3 text-right">{formatCurrency(invoice.subtotal, invoice.currency)}</td>
              </tr>
              {invoice.taxRate > 0 && (
                <tr>
                  <td colSpan={3} className="px-3 pb-2 text-right text-slate-600 text-sm">
                    Tax ({invoice.taxRate}%):
                  </td>
                  <td className="px-3 pb-2 text-right">{formatCurrency(invoice.taxAmount, invoice.currency)}</td>
                </tr>
              )}
              {invoice.discountAmount > 0 && (
                <tr>
                  <td colSpan={3} className="px-3 pb-2 text-right text-slate-600 text-sm">Discount:</td>
                  <td className="px-3 pb-2 text-right text-red-500">
                    -{formatCurrency(invoice.discountAmount, invoice.currency)}
                  </td>
                </tr>
              )}
              <tr className="border-t border-slate-300">
                <td colSpan={3} className="p-3 text-right font-bold text-slate-900">TOTAL:</td>
                <td className="p-3 text-right font-bold text-indigo-600 text-lg">
                  {formatCurrency(invoice.total, invoice.currency)}
                </td>
              </tr>
            </tfoot>
          </table>

          {/* Notes + Payment Terms */}
          {(invoice.notes || invoice.paymentTerms) && (
            <div className="grid grid-cols-2 gap-4 mb-6">
              {invoice.notes && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <p className="text-xs font-semibold text-blue-600 mb-1">📋 Notes</p>
                  <p className="text-sm text-blue-800">{invoice.notes}</p>
                </div>
              )}
              {invoice.paymentTerms && (
                <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                  <p className="text-xs font-semibold text-amber-600 mb-1">📋 Payment Terms</p>
                  <p className="text-sm text-amber-800">{invoice.paymentTerms}</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Payment History */}
      <Card className="mb-4">
        <h3 className="font-semibold text-slate-800 mb-4 flex items-center gap-2">
          💰 Payment History
        </h3>
        {payments.length === 0 ? (
          <div className="text-center py-6 text-slate-400">
            <div className="text-4xl mb-2">📋</div>
            <p className="text-sm">No payments recorded yet</p>
          </div>
        ) : (
          <div className="space-y-2">
            {payments.map((p) => (
              <div key={p.id} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                <div>
                  <p className="text-sm font-medium">{formatCurrency(p.amount, invoice.currency)}</p>
                  <p className="text-xs text-slate-500">{p.method} · {p.notes}</p>
                </div>
                <p className="text-xs text-slate-500">{formatDate(p.paymentDate)}</p>
              </div>
            ))}
          </div>
        )}
      </Card>

      {/* Record a Payment */}
      <Card className="mb-4">
        <h3 className="font-semibold text-slate-800 mb-4 flex items-center gap-2">
          <CheckCircle size={18} className="text-green-600" /> Record a Payment
        </h3>
        <div className="grid grid-cols-2 gap-4 mb-4">
          <Input
            label="Amount"
            required
            type="number"
            min={0}
            step={0.01}
            placeholder={invoice.currency}
            value={paymentAmount}
            onChange={(e) => setPaymentAmount(e.target.value)}
            helper={`Balance Due: ${formatCurrency(invoice.balance, invoice.currency)}`}
          />
          <Input
            label="Payment Date"
            required
            type="date"
            value={paymentDate}
            onChange={(e) => setPaymentDate(e.target.value)}
          />
          <Select
            label="Payment Method"
            required
            value={paymentMethod}
            onChange={(e) => setPaymentMethod(e.target.value)}
            options={PAYMENT_METHODS}
            placeholder="Select method..."
          />
          <Input
            label="Notes (Optional)"
            placeholder="e.g. Transaction ID, reference number"
            value={paymentNotes}
            onChange={(e) => setPaymentNotes(e.target.value)}
          />
        </div>
        <Button
          variant="success"
          className="w-full justify-center"
          loading={recordingPayment}
          onClick={handleRecordPayment}
          icon={<CheckCircle size={16} />}
        >
          Record Payment
        </Button>
      </Card>

      {/* Action buttons */}
      <div className="flex flex-wrap gap-2 mb-4">
        <Button variant="primary" icon={<Edit size={15} />}>
          <Link href={`/invoices/${invoice.id}/edit`}>Edit Invoice</Link>
        </Button>
        {invoice.status === 'draft' && (
          <Button variant="danger" onClick={() => setShowDeleteConfirm(true)} icon={<Trash2 size={15} />}>
            Delete Draft
          </Button>
        )}
        <Button variant="primary" onClick={() => setShowSendConfirm(true)} icon={<Send size={15} />}>
          Send Invoice to Client
        </Button>
        <Button variant="warning" onClick={() => setShowReminderModal(true)} icon={<Bell size={15} />}>
          Send Reminder
        </Button>
        <Button variant="success" icon={<Download size={15} />}>
          Download PDF
        </Button>
        <Button variant="ghost" icon={<Eye size={15} />}>
          <Link href={`/clients/${invoice.clientId}`}>View Client</Link>
        </Button>
        <Button variant="secondary" icon={<Printer size={15} />} onClick={() => window.print()}>
          Print
        </Button>
      </div>

      {/* Payment Reminders section */}
      <Card>
        <h3 className="font-semibold text-slate-800 mb-4">Payment Reminders</h3>
        <div className="text-center py-4 text-sm text-slate-400">
          No reminders sent for this invoice yet
        </div>
        <Button variant="primary" className="mt-2">
          Send First Reminder
        </Button>
      </Card>

      {/* Footer */}
      <div className="text-center text-xs text-slate-400 mt-4">
        <p>Created on {formatDatetime(invoice.createdAt)}</p>
        <p>Thank you for your business!</p>
      </div>

      {/* Dialogs */}
      <ConfirmDialog
        open={showDeleteConfirm}
        title="Delete Draft Invoice"
        description="Are you sure you want to delete this draft invoice? This action cannot be undone."
        confirmLabel="Delete"
        variant="danger"
        onConfirm={handleDelete}
        onCancel={() => setShowDeleteConfirm(false)}
      />

      <ConfirmDialog
        open={showSendConfirm}
        title="Send Invoice to Client"
        description={`This will send the invoice to ${invoice.client?.email ?? 'the client'}. Continue?`}
        confirmLabel="Send Invoice"
        variant="primary"
        onConfirm={handleSendInvoice}
        onCancel={() => setShowSendConfirm(false)}
      />
    </div>
  )
}
