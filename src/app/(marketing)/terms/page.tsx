import type { Metadata } from 'next'
import { LEGAL_ENTITY, SUPPORT_EMAIL, MOR_DISCLOSURE } from '@/lib/constants'

export const metadata: Metadata = {
  title: 'Terms of Service | FileCurrent',
  description: 'Terms of Service for FileCurrent, software for US freelancers to create contracts, invoices, and e-signatures.',
}

const sections = [
  { title: '1. Who We Are', content: `FileCurrent is software-as-a-service (SaaS) operated by ${LEGAL_ENTITY}, a sole proprietor trading as "FileCurrent" ("we," "us," "our"). FileCurrent is a web application that lets independent professionals create contracts, send proposals, generate invoices, collect legally binding e-signatures, and automate payment reminders. We sell access to software only; we do not provide legal, accounting, or consulting services.` },
  { title: '2. Merchant of Record', content: `${MOR_DISCLOSURE} When you purchase a FileCurrent subscription, your order is placed with and fulfilled by Paddle, and your contract for the purchase is with Paddle. For any billing, payment, invoice, cancellation, or refund question, you may contact Paddle directly or contact us at ${SUPPORT_EMAIL} and we will assist.` },
  { title: '3. Acceptance of Terms', content: 'By accessing or using FileCurrent, you agree to be bound by these Terms of Service and our Privacy Policy. If you do not agree to these terms, do not use the service.' },
  { title: '4. Account Registration', content: 'You must provide accurate information when creating an account. You are responsible for maintaining the security of your account credentials and for all activity under your account. You must be at least 18 years old to use FileCurrent.' },
  { title: '5. Free Trial', content: 'New accounts receive a 5-day free trial with full access to all features. No credit card is required to begin the trial. When the trial ends, continued use of paid features requires an active paid subscription.' },
  { title: '6. Subscriptions, Billing & Auto-Renewal', content: 'FileCurrent is offered as a monthly plan at $15/month (USD) and an annual plan at $129/year (USD). Both plans include every feature. Subscriptions renew automatically at the end of each billing period (monthly or annually) using your payment method on file, at the then-current price, until you cancel. All payments are processed by Paddle as Merchant of Record, and applicable taxes are calculated and collected by Paddle at checkout. Prices may change with at least 30 days advance notice to existing subscribers.' },
  { title: '7. Cancellation', content: `You may cancel your subscription at any time from your account Settings, or by contacting us at ${SUPPORT_EMAIL}. When you cancel, your subscription remains active until the end of the current billing period and is not renewed afterward. We do not charge cancellation fees. Refunds, where applicable, are governed by our Refund Policy.` },
  { title: '8. Refunds', content: 'We offer a 30-day money-back guarantee on paid plans, as described in our Refund Policy. Refunds are issued by Paddle, our Merchant of Record, to your original payment method.' },
  { title: '9. Acceptable Use', content: 'You agree not to use FileCurrent for any illegal purpose, to create fraudulent documents, to impersonate any person or entity, to send spam or unsolicited messages, or to violate any applicable law. We reserve the right to suspend or terminate accounts that violate these terms.' },
  { title: '10. Intellectual Property', content: 'The documents and content you create using FileCurrent belong to you. FileCurrent retains ownership of the platform, its code, design, templates, and trademarks. You grant us a limited license to store and process your content solely to provide the service to you.' },
  { title: '11. E-Signature Legal Notice', content: 'E-signatures created through FileCurrent are intended to be legally binding under the Electronic Signatures in Global and National Commerce Act (ESIGN Act, 15 U.S.C. § 7001 et seq.) and the Uniform Electronic Transactions Act (UETA). FileCurrent provides tools for document creation and signature collection. Our templates do not constitute legal advice. Consult a qualified attorney for complex projects or legal matters.' },
  { title: '12. Disclaimer & Limitation of Liability', content: 'FileCurrent is provided "as is" and "as available" without warranties of any kind, express or implied. To the maximum extent permitted by law, we shall not be liable for indirect, incidental, special, or consequential damages arising from your use of the service. Our total liability shall not exceed the amount you paid for the service in the 3 months preceding the claim.' },
  { title: '13. Termination', content: 'You may cancel your account at any time from Settings. We may suspend or terminate accounts that violate these terms. Upon termination, your access ends and your data is deleted in accordance with our Privacy Policy. You may export your data before terminating.' },
  { title: '14. Governing Law', content: 'These terms are governed by the laws applicable at the place of business of the operator, without regard to conflict-of-law principles. Nothing in these terms limits any mandatory consumer-protection rights you may have in your country of residence.' },
  { title: '15. Changes to These Terms', content: 'We may update these Terms from time to time. Material changes will be communicated by updating the "Last updated" date below and, where appropriate, by email. Continued use after changes take effect constitutes acceptance.' },
  { title: '16. Contact', content: `Questions about these Terms: ${SUPPORT_EMAIL}. Operated by ${LEGAL_ENTITY}, trading as FileCurrent.` },
]

export default function TermsPage() {
  return (
    <div className="pt-32 pb-24">
      <div className="max-w-3xl mx-auto px-6">
        <div className="text-center mb-10">
          <h1 className="text-4xl font-bold tracking-[-0.02em] text-foreground mb-3">Terms of Service</h1>
          <p className="text-muted-foreground text-sm">Last updated: June 2026</p>
        </div>
        <div className="space-y-8">
          {sections.map((section) => (
            <div key={section.title} className="border-b border-border pb-8 last:border-0">
              <h2 className="text-lg font-semibold text-foreground mb-3">{section.title}</h2>
              <p className="text-muted-foreground leading-relaxed text-sm">{section.content}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
