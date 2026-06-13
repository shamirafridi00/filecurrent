import type { Metadata } from 'next'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'

export const metadata: Metadata = {
  title: 'Help & FAQ | FileCurrent',
  description: 'Find answers to common questions about FileCurrent contracts, invoices, e-signatures, and payment reminders.',
}

const FAQ_SECTIONS = [
  {
    title: 'Getting Started',
    items: [
      { q: 'Is there a free trial?', a: 'Yes. Every new account gets a 5-day free trial with full access to every feature, and no credit card is required to start. When the trial ends, you can upgrade to keep going.' },
      { q: 'How do I get started?', a: "Sign up at filecurrent.com, complete the quick onboarding (select your profession, add your business details), and you're ready to create your first contract or invoice." },
      { q: 'What professions does FileCurrent support?', a: 'FileCurrent has profession-specific templates for web developers, photographers, consultants, designers, copywriters, and marketers. Each template includes the clauses and line items most relevant to your type of work.' },
      { q: 'Can I import my clients from HoneyBook or Bonsai?', a: 'Yes. Go to Import Clients in your dashboard and upload a CSV file. FileCurrent accepts standard CSV exports from most tools.' },
    ],
  },
  {
    title: 'Contracts & E-Signatures',
    items: [
      { q: 'Are the e-signatures legally binding?', a: "Yes. FileCurrent's e-signatures comply with the ESIGN Act (15 U.S.C. § 7001) and UETA. Each signature captures the signer's name, email, IP address, browser, and exact timestamp. A SHA-256 hash of the document proves it hasn't been altered after signing. Both parties receive a signed PDF with a full audit trail." },
      { q: 'What happens after a client signs?', a: 'Both you and your client receive an email with the signed contract PDF and a separate audit trail PDF attached. The contract status in your dashboard updates to Signed immediately.' },
      { q: 'Can clients sign on mobile?', a: 'Yes. The signing page is fully mobile-responsive. Clients can sign from any device, with no app download required.' },
      { q: 'Can I edit a contract after sending it?', a: 'No. Once a contract is sent for signature, it is locked to preserve the document integrity required for legal compliance. Create a new contract if changes are needed.' },
    ],
  },
  {
    title: 'Invoices & Payments',
    items: [
      { q: 'Can FileCurrent collect payments from clients?', a: 'FileCurrent does not process payments directly. You can include your payment details (bank account, PayPal, Stripe link, Wise) in the invoice notes field, and clients can pay you directly through your preferred method.' },
      { q: 'How do payment reminders work?', a: 'Set your reminder schedule once in Payment Reminders → Settings. FileCurrent automatically emails your clients before the due date, on the due date, and at intervals after it becomes overdue. There is no daily limit on reminders.' },
      { q: 'Can I customize my invoice appearance?', a: 'Yes. Go to Invoices → Templates to create branded invoice templates with your logo, business colors, and contact information. You can have multiple templates for different client types.' },
      { q: 'What currencies does FileCurrent support?', a: 'FileCurrent supports USD, EUR, GBP, CAD, AUD, PKR, and other major currencies. Set your default currency in Settings.' },
    ],
  },
  {
    title: 'Billing',
    items: [
      { q: 'Who processes my payment?', a: 'Paddle.com is our Merchant of Record. Paddle securely processes your payment, calculates and remits any applicable tax, and handles billing inquiries, returns, and refunds. Your purchase receipt will come from Paddle.' },
      { q: "What's the difference between the monthly and annual plans?", a: 'Both plans include every feature. Monthly is $15/month and is the most flexible. Annual is $129/year (about $10.75/month), which saves 28% compared to paying monthly.' },
      { q: 'How do I cancel my subscription?', a: 'Go to Settings, then Plan & Billing, and click Cancel Subscription. Your access continues until the end of your current billing period, and there are no cancellation fees.' },
      { q: 'Do you offer refunds?', a: 'Yes. We offer an unconditional 30-day money-back guarantee on all paid plans. Email support@filecurrent.com within 30 days of your purchase and Paddle will refund you to your original payment method, no questions asked.' },
    ],
  },
]

export default function HelpPage() {
  return (
    <div className="pt-32 pb-24">
      <div className="max-w-3xl mx-auto px-6">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold tracking-[-0.02em] text-foreground mb-3">Help Center</h1>
          <p className="text-muted-foreground">Find answers to common questions about FileCurrent.</p>
        </div>

        <div className="space-y-10">
          {FAQ_SECTIONS.map((section) => (
            <div key={section.title}>
              <h2 className="text-lg font-semibold text-foreground mb-4 pb-2 border-b border-border">
                {section.title}
              </h2>
              <Accordion type="single" collapsible className="space-y-2">
                {section.items.map((item, i) => (
                  <AccordionItem
                    key={i}
                    value={`${section.title}-${i}`}
                    className="rounded-xl border border-border bg-card px-4"
                  >
                    <AccordionTrigger className="text-foreground text-sm font-semibold hover:no-underline py-4">
                      {item.q}
                    </AccordionTrigger>
                    <AccordionContent className="text-muted-foreground text-sm leading-relaxed pb-4">
                      {item.a}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </div>
          ))}
        </div>

        <div className="mt-16 text-center rounded-2xl border border-border bg-[#F6F9FC] p-8">
          <h3 className="text-foreground font-semibold text-lg mb-2">Still have questions?</h3>
          <p className="text-muted-foreground text-sm mb-5">Our support team is here to help.</p>
          <Button asChild className="bg-primary hover:bg-[#5145E5] text-white">
            <Link href="/contact">Email support →</Link>
          </Button>
        </div>
      </div>
    </div>
  )
}
