import type { Metadata } from 'next'
import Link from 'next/link'
import { Check, ShieldCheck, Lightning, Users, FileText } from '@/components/icons'
import { Button } from '@/components/ui/button'

export const metadata: Metadata = {
  title: 'About FileCurrent — Built for Freelancers',
  description: 'FileCurrent is a simple, affordable contract and invoice tool for freelancers. No bloat, no complexity — just the document workflow every freelancer needs.',
}

export default function AboutPage() {
  return (
    <div className="pt-24 pb-20">
      <div className="max-w-4xl mx-auto px-6">
        {/* Hero */}
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold text-white mb-4">
            Built for freelancers, by someone who gets it.
          </h1>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            Professional contracts, invoices, and e-signatures — without the enterprise price tag.
          </p>
        </div>

        {/* Story */}
        <div className="border-l-4 border-l-teal-600 bg-[#0d1614] rounded-r-xl p-8 mb-12">
          <h2 className="text-xl font-bold text-white mb-4">The Story</h2>
          <div className="space-y-4 text-gray-400 leading-relaxed">
            <p>
              FileCurrent was born from a simple frustration: freelancers were paying $36 to $60 per month
              for tools packed with features they&apos;d never use — just to send a contract and get paid.
            </p>
            <p>
              We built FileCurrent to do exactly four things extremely well: generate professional contracts,
              create clean invoices, collect legally-binding e-signatures, and send automated payment reminders.
              Nothing else.
            </p>
            <p>
              No project management. No CRM pipeline. No time tracking. Just the document workflow that every
              freelancer needs.
            </p>
          </div>
        </div>

        {/* Mission */}
        <div className="mb-12">
          <h2 className="text-xl font-bold text-white mb-4">The Mission</h2>
          <div className="space-y-4 text-gray-400 leading-relaxed">
            <p>
              Our mission is simple: give every freelancer access to professional-grade document tools
              without the enterprise price tag.
            </p>
            <p className="text-teal-300 font-medium">
              Your success should depend on your skills and hard work — not your ability to afford a
              $432/year software subscription.
            </p>
          </div>
        </div>

        {/* Why FileCurrent */}
        <div className="mb-16">
          <h2 className="text-xl font-bold text-white mb-8">Why FileCurrent</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              {
                icon: <Lightning className="h-5 w-5 text-teal-400" />,
                title: 'One price, full access',
                desc: '$9/month or $79/year. No hidden tiers. No feature locks except unlimited volume.',
              },
              {
                icon: <Users className="h-5 w-5 text-teal-400" />,
                title: 'Built for all freelancers',
                desc: 'Web developers, photographers, consultants, designers, copywriters, marketers — profession-specific templates for all of them.',
              },
              {
                icon: <ShieldCheck className="h-5 w-5 text-teal-400" />,
                title: 'ESIGN Act compliant',
                desc: 'E-signatures that hold up legally. Typed name, audit trail, SHA-256 document hash. No DocuSign account needed.',
              },
              {
                icon: <FileText className="h-5 w-5 text-teal-400" />,
                title: 'No daily limits',
                desc: 'Payment reminders run on your schedule, not ours. No 20/day cap. No arbitrary restrictions.',
              },
            ].map((card) => (
              <div key={card.title} className="rounded-xl border border-[#1a2a28] bg-[#0d1614] p-6">
                <div className="flex items-center gap-3 mb-3">
                  {card.icon}
                  <h3 className="font-semibold text-white">{card.title}</h3>
                </div>
                <p className="text-gray-400 text-sm leading-relaxed">{card.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="text-center rounded-xl border border-teal-800/50 bg-teal-900/20 p-10">
          <h2 className="text-2xl font-bold text-white mb-2">Ready to simplify your freelance paperwork?</h2>
          <p className="text-gray-400 mb-6">Join thousands of freelancers who&apos;ve made the switch.</p>
          <div className="flex items-center justify-center gap-3">
            <Button asChild className="bg-teal-600 hover:bg-teal-700 text-white">
              <Link href="/signup">Start Free →</Link>
            </Button>
            <Button asChild variant="outline" className="border-[#1a2a28] text-gray-300 hover:bg-white/5">
              <Link href="/pricing">See Pricing</Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
