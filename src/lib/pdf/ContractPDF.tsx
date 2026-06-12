import React from 'react'
import { Document, Page, Text, View, StyleSheet, Image } from '@react-pdf/renderer'
import { registerFonts } from './fonts'

registerFonts()

interface AuditEvent {
  eventType: string
  signerName: string | null
  signerEmail: string | null
  ipAddress: string | null
  timestamp: string
}

interface ContractPDFProps {
  contractTitle: string
  contractContent: string
  contractId: string
  freelancerName: string
  freelancerBusiness: string | null
  freelancerLogo: string | null
  clientName: string
  clientEmail: string | null
  amount: number
  currency: string
  startDate: string | null
  endDate: string | null
  paymentTerms: string | null
  signerName: string
  signedAt: string
  auditEvents: AuditEvent[]
  documentHash: string
}

const s = StyleSheet.create({
  page: { fontFamily: 'Helvetica', fontSize: 10, color: '#111827', padding: 48, paddingBottom: 60 },
  // header
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 28, paddingBottom: 16, borderBottomWidth: 2, borderBottomColor: '#635BFF' },
  brand: { fontSize: 16, fontWeight: 700, color: '#635BFF' },
  signedBadge: { fontSize: 9, color: '#16A34A', fontWeight: 600, backgroundColor: '#F0FDF4', padding: 6, borderRadius: 4, borderWidth: 1, borderColor: '#BBF7D0' },
  // title
  docTitle: { fontSize: 18, fontWeight: 700, textAlign: 'center', marginBottom: 6 },
  docSubtitle: { fontSize: 10, color: '#6B7280', textAlign: 'center', marginBottom: 28 },
  // parties
  partiesRow: { flexDirection: 'row', gap: 16, marginBottom: 24 },
  partyBox: { flex: 1, borderWidth: 1, borderColor: '#E5E7EB', borderRadius: 4, padding: 12 },
  partyLabel: { fontSize: 8, fontWeight: 600, color: '#9CA3AF', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 6 },
  partyName: { fontSize: 11, fontWeight: 600, marginBottom: 2 },
  partyDetail: { fontSize: 9, color: '#6B7280', marginBottom: 1 },
  // content
  contentSection: { marginBottom: 24 },
  sectionLabel: { fontSize: 8, fontWeight: 600, color: '#9CA3AF', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 10, borderBottomWidth: 1, borderBottomColor: '#F3F4F6', paddingBottom: 4 },
  h2: { fontSize: 12, fontWeight: 700, marginTop: 14, marginBottom: 4 },
  h3: { fontSize: 10, fontWeight: 600, marginTop: 10, marginBottom: 3 },
  para: { fontSize: 9, color: '#374151', lineHeight: 1.6, marginBottom: 4 },
  hr: { borderTopWidth: 1, borderTopColor: '#E5E7EB', marginVertical: 10 },
  // audit
  auditPage: { fontFamily: 'Helvetica', fontSize: 10, color: '#111827', padding: 48 },
  auditHeader: { backgroundColor: '#111827', padding: 20, marginBottom: 24, borderRadius: 4 },
  auditTitle: { fontSize: 16, fontWeight: 700, color: '#FFFFFF' },
  auditSub: { fontSize: 9, color: '#9CA3AF', marginTop: 4 },
  hashBox: { borderWidth: 1, borderColor: '#E5E7EB', borderRadius: 4, padding: 12, marginBottom: 20, backgroundColor: '#F9FAFB' },
  hashLabel: { fontSize: 8, fontWeight: 600, color: '#9CA3AF', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 4 },
  hashValue: { fontSize: 8, color: '#374151', fontFamily: 'Courier' },
  eventTable: { borderWidth: 1, borderColor: '#E5E7EB', borderRadius: 4 },
  eventHeader: { flexDirection: 'row', backgroundColor: '#F3F4F6', borderBottomWidth: 1, borderBottomColor: '#E5E7EB' },
  eventRow: { flexDirection: 'row', borderBottomWidth: 1, borderBottomColor: '#F3F4F6' },
  eventCell: { padding: 8, fontSize: 8 },
  colEvent: { flex: 1.5 },
  colName: { flex: 2 },
  colIp: { flex: 1.5 },
  colTime: { flex: 2 },
  // sig block
  sigBlock: { marginTop: 32, borderTopWidth: 2, borderTopColor: '#635BFF', paddingTop: 20 },
  sigRow: { flexDirection: 'row', gap: 20 },
  sigBox: { flex: 1 },
  sigLabel: { fontSize: 8, color: '#9CA3AF', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 6 },
  sigName: { fontSize: 13, fontWeight: 700, color: '#635BFF' },
  sigDetail: { fontSize: 8, color: '#6B7280', marginTop: 2 },
  // footer
  footer: { position: 'absolute', bottom: 20, left: 48, right: 48, flexDirection: 'row', justifyContent: 'space-between', borderTopWidth: 1, borderTopColor: '#E5E7EB', paddingTop: 8 },
  footerText: { fontSize: 8, color: '#9CA3AF' },
})

const s1 = StyleSheet.create({
  h1: { fontSize: 15, fontWeight: 700, marginTop: 18, marginBottom: 6 },
})

function cleanLine(line: string): string {
  return line
    .replace(/\*\*([^*]+)\*\*/g, '$1')  // bold ** (first, so single-* doesn't corrupt it)
    .replace(/\*([^*]+)\*/g, '$1')      // italic *
    .replace(/__([^_]+)__/g, '$1')      // bold __
    .replace(/_([^_]+)_/g, '$1')        // italic _ (won't touch ____ signature lines)
    .replace(/`([^`]+)`/g, '$1')        // inline code
}

function renderContent(content: string) {
  return content.split('\n').map((line, i) => {
    if (line.startsWith('### ')) return <Text key={i} style={s.h3}>{cleanLine(line.slice(4))}</Text>
    if (line.startsWith('## ')) return <Text key={i} style={s.h2}>{cleanLine(line.slice(3))}</Text>
    if (line.startsWith('# ')) return <Text key={i} style={s1.h1}>{cleanLine(line.slice(2))}</Text>
    if (/^---+$/.test(line.trim())) return <View key={i} style={s.hr} />
    if (line.trim() === '') return <Text key={i} style={{ fontSize: 4 }}> </Text>
    // Strip leading list markers (- or *)
    const body = line.replace(/^\s*[-*]\s+/, '')
    return <Text key={i} style={s.para}>{cleanLine(body)}</Text>
  })
}

export function ContractPDF({
  contractTitle, contractContent, contractId,
  freelancerName, freelancerBusiness, freelancerLogo,
  clientName, clientEmail,
  amount, currency,
  startDate, endDate, paymentTerms,
  signerName, signedAt,
  auditEvents, documentHash,
}: ContractPDFProps) {
  const formattedAmount = new Intl.NumberFormat('en-US', { style: 'currency', currency }).format(amount)
  const brandLabel = freelancerBusiness ?? freelancerName

  return (
    <Document>
      {/* Page 1: Contract content */}
      <Page size="A4" style={s.page}>
        {/* Header */}
        <View style={s.header}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
            {freelancerLogo ? (
              <Image src={freelancerLogo} style={{ height: 28, maxWidth: 80, objectFit: 'contain' }} />
            ) : null}
            <Text style={s.brand}>{brandLabel}</Text>
          </View>
          <Text style={s.signedBadge}>✓ SIGNED DOCUMENT</Text>
        </View>

        {/* Title */}
        <Text style={s.docTitle}>{contractTitle}</Text>
        <Text style={s.docSubtitle}>Electronically signed on {signedAt}</Text>

        {/* Parties */}
        <View style={s.partiesRow}>
          <View style={s.partyBox}>
            <Text style={s.partyLabel}>Service Provider</Text>
            <Text style={s.partyName}>{freelancerName}</Text>
            {freelancerBusiness && <Text style={s.partyDetail}>{freelancerBusiness}</Text>}
          </View>
          <View style={s.partyBox}>
            <Text style={s.partyLabel}>Client</Text>
            <Text style={s.partyName}>{clientName}</Text>
            {clientEmail && <Text style={s.partyDetail}>{clientEmail}</Text>}
          </View>
          <View style={s.partyBox}>
            <Text style={s.partyLabel}>Project Value</Text>
            <Text style={[s.partyName, { color: '#635BFF' }]}>{formattedAmount}</Text>
            {startDate && <Text style={s.partyDetail}>Start: {startDate}</Text>}
            {endDate && <Text style={s.partyDetail}>End: {endDate}</Text>}
          </View>
        </View>

        {/* Contract body */}
        <View style={s.contentSection}>
          <Text style={s.sectionLabel}>Contract Terms</Text>
          {renderContent(contractContent)}
        </View>

        {/* Signature block */}
        <View style={s.sigBlock}>
          <Text style={[s.sectionLabel, { marginBottom: 16 }]}>Electronic Signatures</Text>
          <View style={s.sigRow}>
            <View style={s.sigBox}>
              <Text style={s.sigLabel}>Client Signature</Text>
              <Text style={s.sigName}>{signerName}</Text>
              <Text style={s.sigDetail}>Signed electronically on {signedAt}</Text>
            </View>
            <View style={s.sigBox}>
              <Text style={s.sigLabel}>Service Provider</Text>
              <Text style={s.sigName}>{freelancerName}</Text>
              <Text style={s.sigDetail}>Sent via FileCurrent</Text>
            </View>
          </View>
        </View>

        <View style={s.footer}>
          <Text style={s.footerText}>FileCurrent — Electronically Signed Document</Text>
          <Text style={s.footerText}>Doc ID: {contractId.slice(0, 8)}...</Text>
        </View>
      </Page>

      {/* Page 2: Audit trail */}
      <Page size="A4" style={s.auditPage}>
        <View style={s.auditHeader}>
          <Text style={s.auditTitle}>Audit Trail</Text>
          <Text style={s.auditSub}>FileCurrent · Document Signing Certificate</Text>
        </View>

        <View style={s.hashBox}>
          <Text style={s.hashLabel}>Document Hash (SHA-256)</Text>
          <Text style={s.hashValue}>{documentHash}</Text>
          <Text style={[s.hashLabel, { marginTop: 8 }]}>Document ID</Text>
          <Text style={s.hashValue}>{contractId}</Text>
        </View>

        <Text style={[s.sectionLabel, { marginBottom: 12 }]}>Signing Events</Text>
        <View style={s.eventTable}>
          <View style={s.eventHeader}>
            <Text style={[s.eventCell, s.colEvent, { fontWeight: 600, color: '#374151' }]}>Event</Text>
            <Text style={[s.eventCell, s.colName, { fontWeight: 600, color: '#374151' }]}>Signer</Text>
            <Text style={[s.eventCell, s.colIp, { fontWeight: 600, color: '#374151' }]}>IP Address</Text>
            <Text style={[s.eventCell, s.colTime, { fontWeight: 600, color: '#374151' }]}>Timestamp</Text>
          </View>
          {auditEvents.map((e, i) => (
            <View key={i} style={[s.eventRow, { backgroundColor: i % 2 === 0 ? '#FFFFFF' : '#F9FAFB' }]}>
              <Text style={[s.eventCell, s.colEvent, { textTransform: 'capitalize' }]}>{e.eventType}</Text>
              <Text style={[s.eventCell, s.colName]}>{e.signerName || e.signerEmail || '—'}</Text>
              <Text style={[s.eventCell, s.colIp]}>{e.ipAddress || '—'}</Text>
              <Text style={[s.eventCell, s.colTime]}>{e.timestamp}</Text>
            </View>
          ))}
        </View>

        <Text style={{ fontSize: 7, color: '#9CA3AF', marginTop: 8, lineHeight: 1.5 }}>
          IP addresses are captured from the signer&apos;s network connection at the moment of each event
          (via standard request headers). If the signer used a VPN or proxy, the address shown reflects
          that service rather than their physical location.
        </Text>

        <View style={{ marginTop: 24, borderWidth: 1, borderColor: '#E5E7EB', borderRadius: 4, padding: 14, backgroundColor: '#F9FAFB' }}>
          <Text style={[s.sectionLabel, { marginBottom: 6 }]}>Legal Statement</Text>
          <Text style={{ fontSize: 8, color: '#6B7280', lineHeight: 1.6 }}>
            This document was signed electronically in accordance with the Electronic Signatures in Global and
            National Commerce Act (ESIGN Act, 15 U.S.C. § 7001 et seq.) and the Uniform Electronic Transactions
            Act (UETA). The electronic signature is legally binding and equivalent to a handwritten signature.
            This audit trail serves as the certificate of completion for this transaction.
          </Text>
        </View>

        <View style={s.footer}>
          <Text style={s.footerText}>Generated by FileCurrent — filecurrent.com</Text>
          <Text style={s.footerText}>Audit Trail · {signedAt}</Text>
        </View>
      </Page>
    </Document>
  )
}
