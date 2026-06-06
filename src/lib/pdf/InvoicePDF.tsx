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
    headerText: '#111827',
    tableHeaderBg: '#F3F4F6',
    tableHeaderText: '#374151',
    tableRowAlt: '#F9FAFB',
    borderColor: '#E5E7EB',
  },
  aurora: {
    headerText: '#FFFFFF',
    tableHeaderBg: '__aurora_tint__',
    tableHeaderText: '__primary__',
    tableRowAlt: '__aurora_row__',
    borderColor: '__aurora_border__',
  },
  ledger: {
    headerText: '#FFFFFF',
    tableHeaderBg: '#1F2937',
    tableHeaderText: '#FFFFFF',
    tableRowAlt: '#F9FAFB',
    borderColor: '#374151',
  },
  // slate & ivory tableHeaderBg depends on primaryColor — resolved at render time
  slate: {
    headerText: '#FFFFFF',
    tableHeaderBg: '__primary__',
    tableHeaderText: '#FFFFFF',
    tableRowAlt: '#F8FAFC',
    borderColor: '#CBD5E1',
  },
  ivory: {
    headerText: '#111827',
    tableHeaderBg: '#F9FAFB',
    tableHeaderText: '#111827',
    tableRowAlt: '#FFFFFF',
    borderColor: '#E5E7EB',
  },
}

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
  page: { fontFamily: 'Helvetica', fontSize: 10, color: '#111827', paddingBottom: 48 },
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
  // ledger sidebar
  ledgerPage: { fontFamily: 'Helvetica', fontSize: 10, color: '#111827', paddingBottom: 48, flexDirection: 'row' },
  ledgerSidebar: { width: 130, backgroundColor: '#111827', paddingTop: 28, paddingBottom: 28, paddingLeft: 18, paddingRight: 18, flexDirection: 'column', justifyContent: 'space-between' },
  ledgerContent: { flex: 1, paddingBottom: 48 },
})

// ── Component ──────────────────────────────────────────────

export function InvoicePDF({ invoice, template, freelancerName, isPro }: InvoicePDFProps) {
  const themeName = (template?.theme ?? 'summit') as keyof typeof themes
  const themeBase = themes[themeName] ?? themes.summit
  const primary = template?.primaryColor ?? '#635BFF'
  const brandName = template?.brandName?.trim() || freelancerName

  // Resolve dynamic placeholders
  const theme = {
    ...themeBase,
    tableHeaderBg:
      themeBase.tableHeaderBg === '__primary__' ? primary
      : themeBase.tableHeaderBg === '__aurora_tint__' ? primary + '25'
      : themeBase.tableHeaderBg,
    tableHeaderText:
      themeBase.tableHeaderText === '__primary__' ? primary
      : themeBase.tableHeaderText,
    tableRowAlt:
      themeBase.tableRowAlt === '__aurora_row__' ? primary + '10'
      : themeBase.tableRowAlt,
    borderColor:
      themeBase.borderColor === '__aurora_border__' ? primary + '25'
      : themeBase.borderColor,
  }

  const isIvory = themeName === 'ivory'
  const isSummit = themeName === 'summit'
  const isLedger = themeName === 'ledger'
  const balance = invoice.total - (invoice.paidAmount ?? 0)
  const items = invoice.items ?? []

  // ── Ledger: two-column sidebar PDF ──────────────────────
  if (isLedger) {
    return (
      <Document>
        <Page size="A4" style={s.ledgerPage}>
          {/* Left dark sidebar */}
          <View style={s.ledgerSidebar}>
            <View>
              {template?.logoUrl && (
                // eslint-disable-next-line jsx-a11y/alt-text
                <Image src={template.logoUrl} style={[s.logo, { marginBottom: 12 }]} />
              )}
              <Text style={{ fontSize: 13, fontWeight: 600, color: '#FFFFFF', marginBottom: 4 }}>{brandName}</Text>
              <Text style={{ fontSize: 8, color: '#9CA3AF', marginBottom: 12, textTransform: 'uppercase', letterSpacing: 1 }}>INVOICE</Text>
              <Text style={{ fontSize: 10, color: '#D1D5DB', marginBottom: 2 }}>#{invoice.invoiceNumber}</Text>
            </View>
            <View>
              <Text style={{ fontSize: 7, color: '#6B7280', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 2 }}>Date</Text>
              <Text style={{ fontSize: 9, color: '#D1D5DB', marginBottom: 8 }}>{invoice.invoiceDate}</Text>
              <Text style={{ fontSize: 7, color: '#6B7280', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 2 }}>Due</Text>
              <Text style={{ fontSize: 9, color: '#D1D5DB', marginBottom: 8 }}>{invoice.dueDate ?? '—'}</Text>
              {template?.phone && (
                <Text style={{ fontSize: 8, color: '#6B7280', marginBottom: 2 }}>{template.phone}</Text>
              )}
              {template?.website && (
                <Text style={{ fontSize: 8, color: '#6B7280', marginBottom: 2 }}>{template.website}</Text>
              )}
              {template?.taxId && (
                <Text style={{ fontSize: 8, color: '#6B7280' }}>Tax: {template.taxId}</Text>
              )}
            </View>
          </View>

          {/* Right content */}
          <View style={s.ledgerContent}>
            {/* Parties */}
            <View style={[s.parties, { marginTop: 28 }]}>
              <View style={s.partyBlock}>
                <Text style={s.partyLabel}>Bill To</Text>
                <Text style={s.partyName}>{invoice.clientName}</Text>
                {invoice.clientCompany && <Text style={s.partyDetail}>{invoice.clientCompany}</Text>}
                {invoice.clientEmail && <Text style={s.partyDetail}>{invoice.clientEmail}</Text>}
                {invoice.clientAddress && <Text style={s.partyDetail}>{invoice.clientAddress}</Text>}
              </View>
              <View style={s.partyBlock}>
                <Text style={s.partyLabel}>From</Text>
                <Text style={s.partyName}>{brandName}</Text>
                {template?.brandAddress && <Text style={s.partyDetail}>{template.brandAddress}</Text>}
              </View>
            </View>

            {/* Line items table */}
            <View style={[s.table, { borderColor: theme.borderColor }]}>
              <View style={[s.tableHeaderRow, { backgroundColor: theme.tableHeaderBg, borderBottomColor: theme.borderColor }]}>
                <Text style={[s.tableCell, s.descCol, { color: theme.tableHeaderText, fontWeight: 600 }]}>DESCRIPTION</Text>
                <Text style={[s.tableCell, s.qtyCol, { color: theme.tableHeaderText, fontWeight: 600 }]}>QTY</Text>
                <Text style={[s.tableCell, s.priceCol, { color: theme.tableHeaderText, fontWeight: 600 }]}>UNIT PRICE</Text>
                <Text style={[s.tableCell, s.amtCol, { color: theme.tableHeaderText, fontWeight: 600 }]}>AMOUNT</Text>
              </View>
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
            {invoice.paymentInstructions && (
              <View style={s.notesRow}>
                <View style={[s.noteBox, { borderColor: '#BBF7D0', flex: 1 }]}>
                  <Text style={[s.noteLabel, { color: '#15803D' }]}>HOW TO PAY</Text>
                  <Text style={s.noteText}>{invoice.paymentInstructions}</Text>
                </View>
              </View>
            )}

            {/* Footer */}
            <View style={s.footer}>
              {!isPro && (
                <Text style={s.footerBranding}>Created with FileCurrent — filecurrent.com</Text>
              )}
              <Text style={s.footerText}>Thank you for your business.</Text>
            </View>
          </View>
        </Page>
      </Document>
    )
  }

  return (
    <Document>
      <Page size="A4" style={s.page}>

        {/* Header */}
        {isSummit ? (
          <View style={[s.header, { backgroundColor: '#FFFFFF', borderLeftWidth: 4, borderLeftColor: primary }]}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
              {template?.logoUrl && (
                // eslint-disable-next-line jsx-a11y/alt-text
                <Image src={template.logoUrl} style={s.logo} />
              )}
              <View>
                <Text style={[s.headerBrand, { color: '#111827', fontSize: 15 }]}>{brandName}</Text>
                {template?.brandAddress && (
                  <Text style={[s.headerAddr, { color: '#6B7280' }]}>{template.brandAddress}</Text>
                )}
                <Text style={{ fontSize: 9, color: '#9CA3AF', marginTop: 4, textTransform: 'uppercase', letterSpacing: 1 }}>INVOICE</Text>
              </View>
            </View>
            <View style={s.headerRight}>
              <Text style={[s.headerSub, { color: '#6B7280', fontSize: 11 }]}>#{invoice.invoiceNumber}</Text>
            </View>
          </View>
        ) : isIvory ? (
          <View style={[s.header, { backgroundColor: '#FFFFFF', borderTopWidth: 3, borderTopColor: primary }]}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
              {template?.logoUrl && (
                // eslint-disable-next-line jsx-a11y/alt-text
                <Image src={template.logoUrl} style={s.logo} />
              )}
              <View>
                <Text style={[s.headerBrand, { color: '#111827', fontSize: 15 }]}>{brandName}</Text>
                {template?.brandAddress && (
                  <Text style={[s.headerAddr, { color: '#6B7280' }]}>{template.brandAddress}</Text>
                )}
              </View>
            </View>
            <View style={s.headerRight}>
              <Text style={[s.headerTitle, { color: primary, fontSize: 20, letterSpacing: 3 }]}>INVOICE</Text>
              <Text style={[s.headerSub, { color: '#6B7280' }]}>#{invoice.invoiceNumber}</Text>
            </View>
          </View>
        ) : (
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
        )}

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
        <View style={[s.table, { borderColor: theme.borderColor }]}>
          {/* Header */}
          <View style={[s.tableHeaderRow, { backgroundColor: theme.tableHeaderBg, borderBottomColor: theme.borderColor }]}>
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

        {/* Payment Instructions */}
        {invoice.paymentInstructions && (
          <View style={s.notesRow}>
            <View style={[s.noteBox, { borderColor: '#BBF7D0', flex: 1 }]}>
              <Text style={[s.noteLabel, { color: '#15803D' }]}>HOW TO PAY</Text>
              <Text style={s.noteText}>{invoice.paymentInstructions}</Text>
            </View>
          </View>
        )}

        {/* Footer */}
        <View style={s.footer}>
          {!isPro && (
            <Text style={s.footerBranding}>Created with FileCurrent — filecurrent.com</Text>
          )}
          <Text style={s.footerText}>Thank you for your business.</Text>
        </View>

      </Page>
    </Document>
  )
}
