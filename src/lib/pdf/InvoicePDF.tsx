import React from 'react'
import {
  Document, Page, Text, View, StyleSheet, Image,
} from '@react-pdf/renderer'
import { registerFonts } from './fonts'
import type { InvoiceDetailRow, InvoiceTemplateRow } from '@/lib/db/supabase'

registerFonts()

// ── Theme definitions ──────────────────────────────────────

const themes = {
  summit: {
    headerText: '#FFFFFF',
    tableHeaderBg: '#F3F4F6',
    tableHeaderText: '#374151',
    tableRowAlt: '#F9FAFB',
    borderColor: '#E5E7EB',
  },
  aurora: {
    headerText: '#FFFFFF',
    tableHeaderBg: '#ECFDF5',
    tableHeaderText: '#065F46',
    tableRowAlt: '#F0FDF4',
    borderColor: '#D1FAE5',
  },
  ledger: {
    headerText: '#FFFFFF',
    tableHeaderBg: '#111827',
    tableHeaderText: '#FFFFFF',
    tableRowAlt: '#F9FAFB',
    borderColor: '#E5E7EB',
  },
} as const

function fmt(amount: number, currency = 'USD'): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
    minimumFractionDigits: 2,
  }).format(amount)
}

// ── Props ──────────────────────────────────────────────────

interface InvoicePDFProps {
  invoice: InvoiceDetailRow & {
    clientAddress?: string | null
  }
  template: InvoiceTemplateRow | null
  freelancerName: string
  isPro: boolean
}

// ── Styles ─────────────────────────────────────────────────

const s = StyleSheet.create({
  page: { fontFamily: 'Inter', fontSize: 10, color: '#111827', paddingBottom: 48 },
  // header
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 28 },
  logo: { width: 56, height: 56, objectFit: 'contain' },
  headerRight: { alignItems: 'flex-end' },
  headerTitle: { fontSize: 28, fontWeight: 700, letterSpacing: 2 },
  headerSub: { fontSize: 12, opacity: 0.85, marginTop: 2 },
  headerBrand: { fontSize: 13, fontWeight: 600 },
  headerAddr: { fontSize: 10, opacity: 0.8, marginTop: 2 },
  // parties
  parties: { flexDirection: 'row', paddingHorizontal: 28, marginBottom: 20, gap: 12 },
  partyBlock: { flex: 1 },
  partyLabel: { fontSize: 8, fontWeight: 600, color: '#9CA3AF', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 4 },
  partyName: { fontSize: 12, fontWeight: 600, marginBottom: 2 },
  partyDetail: { fontSize: 9, color: '#6B7280', marginBottom: 1 },
  // meta row
  meta: { flexDirection: 'row', paddingHorizontal: 28, marginBottom: 20, gap: 12 },
  metaBlock: { flex: 1 },
  metaLabel: { fontSize: 8, fontWeight: 600, color: '#9CA3AF', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 3 },
  metaValue: { fontSize: 11, fontWeight: 600 },
  // table
  table: { marginHorizontal: 28, marginBottom: 16, borderWidth: 1, borderColor: '#E5E7EB', borderRadius: 4 },
  tableRow: { flexDirection: 'row' },
  tableHeaderRow: { flexDirection: 'row', borderBottomWidth: 1, borderBottomColor: '#E5E7EB' },
  tableCell: { padding: 9, fontSize: 9 },
  descCol: { flex: 3 },
  qtyCol: { flex: 1, textAlign: 'center' },
  priceCol: { flex: 1.5, textAlign: 'right' },
  amtCol: { flex: 1.5, textAlign: 'right', fontWeight: 600 },
  // totals
  totals: { marginHorizontal: 28, marginBottom: 20, alignItems: 'flex-end' },
  totalRow: { flexDirection: 'row', paddingVertical: 2 },
  totalLabel: { width: 130, fontSize: 9, color: '#6B7280', textAlign: 'right', paddingRight: 14 },
  totalValue: { width: 90, fontSize: 9, textAlign: 'right', fontWeight: 500 },
  grandTotalRow: { flexDirection: 'row', paddingVertical: 6, marginTop: 4, borderTopWidth: 1, borderTopColor: '#E5E7EB' },
  grandLabel: { width: 130, fontSize: 12, fontWeight: 700, textAlign: 'right', paddingRight: 14 },
  grandValue: { width: 90, fontSize: 14, fontWeight: 700, textAlign: 'right' },
  // notes
  notesRow: { flexDirection: 'row', gap: 10, marginHorizontal: 28, marginBottom: 20 },
  noteBox: { flex: 1, borderWidth: 1, borderRadius: 4, padding: 10 },
  noteLabel: { fontSize: 8, fontWeight: 600, marginBottom: 3 },
  noteText: { fontSize: 9, color: '#374151', lineHeight: 1.5 },
  // footer
  footer: { position: 'absolute', bottom: 16, left: 28, right: 28, alignItems: 'center', borderTopWidth: 1, borderTopColor: '#E5E7EB', paddingTop: 10 },
  footerBranding: { fontSize: 8, color: '#9CA3AF', marginBottom: 2 },
  footerText: { fontSize: 8, color: '#9CA3AF' },
})

// ── Component ──────────────────────────────────────────────

export function InvoicePDF({ invoice, template, freelancerName, isPro }: InvoicePDFProps) {
  const themeName = (template?.theme ?? 'summit') as keyof typeof themes
  const theme = themes[themeName] ?? themes.summit
  const primary = template?.primaryColor ?? '#635BFF'
  const brandName = template?.brandName ?? freelancerName

  const balance = invoice.total - (invoice.paidAmount ?? 0)
  const items = invoice.items ?? []

  return (
    <Document>
      <Page size="A4" style={s.page}>

        {/* Header */}
        <View style={[s.header, { backgroundColor: primary }]}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
            {template?.logoUrl && (
              // eslint-disable-next-line jsx-a11y/alt-text
              <Image src={template.logoUrl} style={s.logo} />
            )}
            <View>
              <Text style={[s.headerTitle, { color: theme.headerText }]}>INVOICE</Text>
              <Text style={[s.headerSub, { color: theme.headerText }]}>#{invoice.invoiceNumber}</Text>
            </View>
          </View>
          <View style={s.headerRight}>
            <Text style={[s.headerBrand, { color: theme.headerText }]}>{brandName}</Text>
            {template?.brandAddress && (
              <Text style={[s.headerAddr, { color: theme.headerText }]}>{template.brandAddress}</Text>
            )}
          </View>
        </View>

        {/* Parties */}
        <View style={s.parties}>
          <View style={s.partyBlock}>
            <Text style={s.partyLabel}>FROM</Text>
            <Text style={s.partyName}>{brandName}</Text>
            {template?.phone && <Text style={s.partyDetail}>{template.phone}</Text>}
            {template?.website && <Text style={s.partyDetail}>{template.website}</Text>}
            {template?.taxId && <Text style={s.partyDetail}>Tax ID: {template.taxId}</Text>}
          </View>
          <View style={s.partyBlock}>
            <Text style={s.partyLabel}>BILL TO</Text>
            <Text style={s.partyName}>{invoice.clientName}</Text>
            {invoice.clientCompany && <Text style={s.partyDetail}>{invoice.clientCompany}</Text>}
            {invoice.clientEmail && <Text style={s.partyDetail}>{invoice.clientEmail}</Text>}
            {invoice.clientAddress && <Text style={s.partyDetail}>{invoice.clientAddress}</Text>}
          </View>
          <View style={s.partyBlock}>
            <Text style={s.partyLabel}>INVOICE DATE</Text>
            <Text style={[s.metaValue, { marginBottom: 8 }]}>{invoice.invoiceDate}</Text>
            <Text style={s.partyLabel}>DUE DATE</Text>
            <Text style={s.metaValue}>{invoice.dueDate ?? '—'}</Text>
          </View>
        </View>

        {/* Line items table */}
        <View style={s.table}>
          {/* Header */}
          <View style={[s.tableHeaderRow, { backgroundColor: theme.tableHeaderBg }]}>
            <Text style={[s.tableCell, s.descCol, { color: theme.tableHeaderText, fontWeight: 600 }]}>DESCRIPTION</Text>
            <Text style={[s.tableCell, s.qtyCol, { color: theme.tableHeaderText, fontWeight: 600 }]}>QTY</Text>
            <Text style={[s.tableCell, s.priceCol, { color: theme.tableHeaderText, fontWeight: 600 }]}>UNIT PRICE</Text>
            <Text style={[s.tableCell, s.amtCol, { color: theme.tableHeaderText, fontWeight: 600 }]}>AMOUNT</Text>
          </View>
          {/* Rows */}
          {items.map((item, i) => (
            <View
              key={i}
              style={[
                s.tableRow,
                { backgroundColor: i % 2 === 0 ? '#FFFFFF' : theme.tableRowAlt },
                i < items.length - 1 ? { borderBottomWidth: 1, borderBottomColor: theme.borderColor } : {},
              ]}
            >
              <Text style={[s.tableCell, s.descCol]}>{item.description}</Text>
              <Text style={[s.tableCell, s.qtyCol, { color: '#6B7280' }]}>{item.quantity}</Text>
              <Text style={[s.tableCell, s.priceCol, { color: '#6B7280' }]}>{fmt(item.unitPrice, invoice.currency)}</Text>
              <Text style={[s.tableCell, s.amtCol]}>{fmt(item.amount, invoice.currency)}</Text>
            </View>
          ))}
        </View>

        {/* Totals */}
        <View style={s.totals}>
          <View style={s.totalRow}>
            <Text style={s.totalLabel}>Subtotal</Text>
            <Text style={s.totalValue}>{fmt(invoice.subtotal, invoice.currency)}</Text>
          </View>
          {invoice.taxRate > 0 && (
            <View style={s.totalRow}>
              <Text style={s.totalLabel}>Tax ({invoice.taxRate}%)</Text>
              <Text style={s.totalValue}>{fmt(invoice.taxAmount, invoice.currency)}</Text>
            </View>
          )}
          {invoice.discountAmount > 0 && (
            <View style={s.totalRow}>
              <Text style={s.totalLabel}>Discount</Text>
              <Text style={[s.totalValue, { color: '#DC2626' }]}>−{fmt(invoice.discountAmount, invoice.currency)}</Text>
            </View>
          )}
          {(invoice.paidAmount ?? 0) > 0 && (
            <View style={s.totalRow}>
              <Text style={s.totalLabel}>Paid</Text>
              <Text style={[s.totalValue, { color: '#16A34A' }]}>−{fmt(invoice.paidAmount, invoice.currency)}</Text>
            </View>
          )}
          <View style={s.grandTotalRow}>
            <Text style={[s.grandLabel, { color: '#111827' }]}>
              {(invoice.paidAmount ?? 0) > 0 ? 'BALANCE DUE' : 'TOTAL'}
            </Text>
            <Text style={[s.grandValue, { color: primary }]}>
              {fmt(balance, invoice.currency)}
            </Text>
          </View>
        </View>

        {/* Notes + Payment Terms */}
        {(invoice.notes || invoice.paymentTerms) && (
          <View style={s.notesRow}>
            {invoice.notes && (
              <View style={[s.noteBox, { borderColor: '#BFDBFE' }]}>
                <Text style={[s.noteLabel, { color: '#1D4ED8' }]}>NOTES</Text>
                <Text style={s.noteText}>{invoice.notes}</Text>
              </View>
            )}
            {invoice.paymentTerms && (
              <View style={[s.noteBox, { borderColor: '#FDE68A' }]}>
                <Text style={[s.noteLabel, { color: '#92400E' }]}>PAYMENT TERMS</Text>
                <Text style={s.noteText}>{invoice.paymentTerms}</Text>
              </View>
            )}
          </View>
        )}

        {/* Footer */}
        <View style={s.footer}>
          {!isPro && (
            <Text style={s.footerBranding}>Created with FileCurrent — filecurrent.io</Text>
          )}
          <Text style={s.footerText}>Thank you for your business.</Text>
        </View>

      </Page>
    </Document>
  )
}
