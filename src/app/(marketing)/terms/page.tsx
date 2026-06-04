import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Terms of Service — FileCurrent',
  description: 'Terms of Service for FileCurrent freelance contract and invoice software.',
}

const sections = [
  { title: '1. Acceptance of Terms', content: 'By accessing or using FileCurrent, you agree to be bound by these Terms of Service. If you do not agree to these terms, do not use the service.' },
  { title: '2. Description of Service', content: 'FileCurrent is a web-based platform that enables freelancers to create contracts, invoices, collect e-signatures, and manage payment reminders. The service is provided on a subscription basis with a free tier available.' },
  { title: '3. Account Registration', content: 'You must provide accurate information when creating an account. You are responsible for maintaining the security of your account credentials. You must be at least 18 years old to use FileCurrent.' },
  { title: '4. Free Tier Limitations', content: 'The free plan allows creation of up to 3 documents (contracts and invoices combined) per calendar month. Free tier documents include FileCurrent branding. Automated payment reminders are available on paid plans only.' },
  { title: '5. Paid Plans', content: 'FileCurrent offers monthly ($9/month), annual ($79/year), and lifetime ($49 one-time, limited availability) paid plans. Subscriptions automatically renew unless cancelled. Prices may change with 30 days advance notice to existing subscribers.' },
  { title: '6. Acceptable Use', content: 'You agree not to use FileCurrent for illegal purposes, to create fraudulent documents, to impersonate other individuals, or to violate any applicable laws. FileCurrent reserves the right to suspend accounts that violate these terms.' },
  { title: '7. Intellectual Property', content: 'The documents you create using FileCurrent belong to you. FileCurrent retains ownership of the platform, its code, design, and trademarks. You grant FileCurrent a limited license to store and process your documents to provide the service.' },
  { title: '8. E-Signature Legal Notice', content: 'E-signatures created through FileCurrent are legally binding under the Electronic Signatures in Global and National Commerce Act (ESIGN Act, 15 U.S.C. § 7001 et seq.) and the Uniform Electronic Transactions Act (UETA). FileCurrent provides tools for document creation and signature collection. Our templates do not constitute legal advice. Consult a qualified attorney for complex projects or legal matters.' },
  { title: '9. Limitation of Liability', content: 'FileCurrent is provided "as is" without warranties of any kind. To the maximum extent permitted by law, FileCurrent shall not be liable for indirect, incidental, or consequential damages arising from your use of the service. Our total liability shall not exceed the amount you paid in the 3 months preceding the claim.' },
  { title: '10. Termination', content: 'You may cancel your account at any time from Settings. FileCurrent may suspend or terminate accounts that violate these terms. Upon termination, your access ends and data will be deleted per our privacy policy.' },
  { title: '11. Governing Law', content: 'These terms are governed by the laws of the State of Delaware, USA. Any disputes shall be resolved in the courts of Delaware.' },
  { title: '12. Contact', content: 'For legal inquiries: legal@filecurrent.com' },
]

export default function TermsPage() {
  return (
    <div className="pt-24 pb-20">
      <div className="max-w-3xl mx-auto px-6">
        <div className="text-center mb-10">
          <h1 className="text-4xl font-bold text-white mb-3">Terms of Service</h1>
          <p className="text-gray-500 text-sm">Last updated: June 2026</p>
        </div>
        <div className="space-y-8">
          {sections.map((section) => (
            <div key={section.title} className="border-b border-[#1A3A5C] pb-8 last:border-0">
              <h2 className="text-lg font-semibold text-white mb-3">{section.title}</h2>
              <p className="text-gray-400 leading-relaxed text-sm">{section.content}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
