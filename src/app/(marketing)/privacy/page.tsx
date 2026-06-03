import type { Metadata } from 'next'
import { ShieldCheck, Database, ShareNetwork, Lock, CalendarBlank, UserCircle, Envelope } from '@/components/icons'

export const metadata: Metadata = {
  title: 'Privacy Policy — FileCurrent',
  description: 'Learn how FileCurrent collects, uses, and protects your personal data.',
}

const sections = [
  {
    icon: <Database className="h-5 w-5 text-[#635BFF]" />,
    title: '1. Information We Collect',
    content: `We collect information you provide directly: your name, email address, business details, and the content of documents you create (contracts and invoices). We also collect usage data such as pages visited and features used. Payment processing is handled entirely by Lemon Squeezy — we never see or store your credit card details.`,
  },
  {
    icon: <ShieldCheck className="h-5 w-5 text-[#635BFF]" />,
    title: '2. How We Use Your Information',
    content: `We use your information to provide and improve the FileCurrent service, send transactional emails (such as contract signature requests, invoice delivery, and payment reminders), and provide customer support. We do not use your data for advertising.`,
  },
  {
    icon: <ShareNetwork className="h-5 w-5 text-[#635BFF]" />,
    title: '3. Information Sharing',
    content: `We share data only with the services required to operate FileCurrent: Supabase (database and authentication), Resend (transactional email delivery), Lemon Squeezy (payment processing), and Vercel (hosting). We do not sell, rent, or trade your personal data to any third party.`,
  },
  {
    icon: <Lock className="h-5 w-5 text-[#635BFF]" />,
    title: '4. Data Security',
    content: `All data is transmitted over HTTPS/TLS encryption. Our database uses row-level security — each user can only access their own data. Access to production systems is restricted to authorized personnel only.`,
  },
  {
    icon: <CalendarBlank className="h-5 w-5 text-[#635BFF]" />,
    title: '5. Data Retention',
    content: `We retain your account data for as long as your account is active. Upon account deletion, your personal data is removed from our systems within 30 days. Document content (contracts, invoices) may be retained for legal compliance purposes for up to 7 years.`,
  },
  {
    icon: <UserCircle className="h-5 w-5 text-[#635BFF]" />,
    title: '6. Your Rights',
    content: `You have the right to access, correct, and delete your personal data. You can export all your data at any time from the dashboard (Exports section). To request account deletion or data correction, contact privacy@filecurrent.io.`,
  },
  {
    icon: <Envelope className="h-5 w-5 text-[#635BFF]" />,
    title: '7. Contact',
    content: `For privacy-related inquiries, contact us at privacy@filecurrent.io. We will respond within 5 business days.`,
  },
]

export default function PrivacyPage() {
  return (
    <div className="pt-24 pb-20">
      <div className="max-w-3xl mx-auto px-6">
        <div className="text-center mb-10">
          <h1 className="text-4xl font-bold text-white mb-3">Privacy Policy</h1>
          <p className="text-gray-500 text-sm">Last updated: June 2026</p>
        </div>

        <div className="rounded-xl border border-blue-800/50 bg-blue-900/20 p-5 mb-10">
          <p className="text-blue-300 text-sm leading-relaxed">
            <strong className="text-blue-200">Your privacy matters.</strong> FileCurrent is committed to protecting your data.
            This policy explains what we collect, how we use it, and your rights as a user.
          </p>
        </div>

        <div className="space-y-8">
          {sections.map((section) => (
            <div key={section.title} className="border-b border-[#1A3A5C] pb-8 last:border-0">
              <div className="flex items-center gap-3 mb-3">
                {section.icon}
                <h2 className="text-lg font-semibold text-white">{section.title}</h2>
              </div>
              <p className="text-gray-400 leading-relaxed text-sm">{section.content}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
