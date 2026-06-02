'use client'

import Link from 'next/link'
import { Check, X, FileText, PencilLine, Bell, Star } from '@phosphor-icons/react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { APP_TAGLINE } from '@/lib/constants'
import { FaqItem } from '@/components/landing/FaqItem'
import { NavBar } from '@/components/landing/NavBar'
import { AnimatedFeatureCards } from '@/components/landing/AnimatedFeatureCards'
import { LogoFull } from '@/components/logo/LogoMark'

const FEATURES = [
  {
    icon: <FileText className="h-7 w-7 text-teal-400" />,
    title: 'Profession Templates',
    desc: 'Contracts built for your exact freelance niche — web dev, photography, consulting, design, and more.',
  },
  {
    icon: <PencilLine className="h-7 w-7 text-teal-400" />,
    title: 'Legal E-Signatures',
    desc: 'ESIGN Act compliant. Clients sign directly in the browser. No DocuSign account needed.',
  },
  {
    icon: <Bell className="h-7 w-7 text-teal-400" />,
    title: 'Automated Reminders',
    desc: 'No daily cap. Escalating tone. Auto-stops when the invoice is paid. Zero manual follow-up.',
  },
]

const COMPARISON = [
  { feature: 'Price', fc: '$9/mo', bonsai: '$21/mo', honeybook: '$36/mo' },
  { feature: 'Contracts', fc: true, bonsai: true, honeybook: true },
  { feature: 'E-Signatures', fc: true, bonsai: true, honeybook: true },
  { feature: 'Auto Reminders', fc: '✓ (no cap)', bonsai: '✓', honeybook: '✓' },
  { feature: 'No Daily Email Cap', fc: true, bonsai: true, honeybook: false },
  { feature: 'Profession Templates', fc: true, bonsai: 'Partial', honeybook: false },
  { feature: 'Free Tier', fc: '✓ (3/mo)', bonsai: false, honeybook: 'Trial only' },
]

const FREE_FEATURES = [
  '3 documents/month',
  'All contract & invoice templates',
  'E-signatures',
  'FileCurrent branding on docs',
]

const PRO_FEATURES = [
  'Unlimited documents',
  'No FileCurrent branding',
  'Automated payment reminders',
  'Invoice share links',
  'Priority support',
]

const ANNUAL_FEATURES = [...PRO_FEATURES, 'Save $29/year vs monthly']

const FAQS = [
  { q: 'Is FileCurrent free?', a: 'Yes — the Free plan lets you create 3 documents per month (contracts + invoices combined) with no credit card required.' },
  { q: 'Are the e-signatures legally binding?', a: 'Yes. FileCurrent uses the ESIGN Act (15 U.S.C. § 7001) standard. Each signature is logged with IP address, timestamp, and a document hash for tamper detection.' },
  { q: 'What happens if I go over 3 documents on the free plan?', a: "You'll see an upgrade prompt. Your existing documents are never deleted — you just need to upgrade to create new ones that month." },
  { q: 'Can I import clients from HoneyBook or Bonsai?', a: 'Yes — use the Import Clients feature (CSV format) to bring your existing client list into FileCurrent.' },
  { q: 'Do you have profession-specific contract templates?', a: 'Yes. FileCurrent pre-filters templates based on your profession (web developer, photographer, consultant, designer, copywriter, or marketer) so you always see the most relevant ones first.' },
  { q: 'Is there a daily limit on payment reminders?', a: 'No. Unlike some competitors, FileCurrent has no daily email cap. Reminders are sent on your configured schedule without any artificial limit.' },
  { q: 'What is the lifetime deal?', a: "The lifetime deal ($49) gives you permanent Pro access for a one-time payment. It's available for the first 90 days only." },
]

function CheckIcon() { return <Check className="h-4 w-4 text-teal-400" /> }
function XIcon() { return <X className="h-4 w-4 text-gray-600" /> }

function CellValue({ val }: { val: boolean | string }) {
  if (val === true) return <CheckIcon />
  if (val === false) return <XIcon />
  return <span className="text-sm">{val}</span>
}

export function LandingContent() {
  return (
    <div className="min-h-screen bg-[#0a0f0e] text-gray-100">
      <NavBar />

      {/* Hero */}
      <section className="hero-bg pt-28 pb-20 px-4">
        <div className="mx-auto max-w-4xl text-center">
          <Badge variant="secondary" className="mb-6 text-xs font-medium bg-white/10 text-teal-300 border-teal-800">
            Cheaper than HoneyBook. Simpler than Bonsai.
          </Badge>
          <h1 className="hero-headline text-5xl font-bold tracking-tight text-white mb-4 leading-tight">
            Contracts. Invoices.<br />
            <span className="text-[#2dd4bf]">E-Signatures. Done.</span>
          </h1>
          <p className="hero-subtitle text-xl text-gray-400 mb-8 leading-relaxed">
            The freelance document tool that does exactly what you need<br />
            and nothing you don&apos;t. $9/month or free forever.
          </p>
          <div className="hero-ctas flex items-center justify-center gap-4 flex-wrap">
            <Button asChild size="lg" className="text-base px-8 bg-white text-teal-800 hover:bg-gray-100">
              <Link href="/signup">Start Free — No card needed</Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="text-base border-white/40 text-white hover:bg-white/10 bg-transparent">
              <a href="#features">See how it works ↓</a>
            </Button>
          </div>
          <div className="mt-8 flex items-center justify-center gap-6 text-sm text-gray-500">
            <span>Trusted by thousands of freelancers across the US</span>
            <span className="text-teal-400">★★★★★</span>
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-20 px-4 bg-[#0d1614]">
        <div className="mx-auto max-w-5xl">
          <h2 className="text-3xl font-bold text-center mb-3 text-white">
            Everything a freelancer needs. Nothing you don&apos;t.
          </h2>
          <p className="text-center text-gray-400 mb-12 text-sm">Built for web developers, photographers, consultants, designers, copywriters, and marketers.</p>
          <AnimatedFeatureCards features={FEATURES} />
        </div>
      </section>

      {/* Comparison table */}
      <section className="py-20 px-4 bg-[#0a0f0e]">
        <div className="mx-auto max-w-3xl">
          <h2 className="text-3xl font-bold text-center mb-3 text-white">Why freelancers choose FileCurrent</h2>
          <p className="text-center text-gray-400 mb-10 text-sm">See how we compare to the leading alternatives</p>
          <div className="overflow-x-auto rounded-xl border border-[#1a2a28]">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-[#1a2a28]">
                  <th className="p-3 text-left font-semibold text-gray-400">Feature</th>
                  <th className="p-3 text-center font-semibold text-white bg-[#0F766E]/20">FileCurrent</th>
                  <th className="p-3 text-center text-gray-500 font-normal">Bonsai</th>
                  <th className="p-3 text-center text-gray-500 font-normal">HoneyBook</th>
                </tr>
              </thead>
              <tbody>
                {COMPARISON.map((row, i) => (
                  <tr key={row.feature} className={i % 2 === 0 ? 'bg-[#0a0f0e]' : 'bg-[#0d1614]'}>
                    <td className="p-3 font-medium text-gray-300">{row.feature}</td>
                    <td className="p-3 text-center bg-[#0F766E]/10">
                      <span className="flex justify-center"><CellValue val={row.fc} /></span>
                    </td>
                    <td className="p-3 text-center text-gray-500">
                      <span className="flex justify-center"><CellValue val={row.bonsai} /></span>
                    </td>
                    <td className="p-3 text-center text-gray-500">
                      <span className="flex justify-center"><CellValue val={row.honeybook} /></span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="py-20 px-4 bg-[#0d1614]">
        <div className="mx-auto max-w-5xl">
          <h2 className="text-3xl font-bold text-center mb-3 text-white">Simple, honest pricing</h2>
          <p className="text-center text-gray-400 mb-12 text-sm">No hidden fees. Cancel anytime.</p>

          <div className="grid grid-cols-1 gap-5 md:grid-cols-3 mb-5">
            {/* Free */}
            <div className="rounded-xl border border-[#1a2a28] bg-[#0a1410] p-6 space-y-4">
              <div>
                <p className="font-semibold text-lg text-white">Free</p>
                <p className="text-3xl font-bold mt-1 text-white">$0<span className="text-base font-normal text-gray-500">/mo</span></p>
                <p className="text-sm text-gray-500 mt-1">Forever</p>
              </div>
              <ul className="space-y-2">
                {FREE_FEATURES.map((f) => (
                  <li key={f} className="flex items-center gap-2 text-sm text-gray-400">
                    <Check className="h-4 w-4 text-teal-500 shrink-0" /> {f}
                  </li>
                ))}
              </ul>
              <Button asChild variant="outline" className="w-full border-[#1a2a28] text-gray-300 hover:bg-white/5">
                <Link href="/signup">Get started free</Link>
              </Button>
            </div>

            {/* Pro Monthly */}
            <div className="rounded-xl border-2 border-teal-600 bg-[#0a1410] p-6 space-y-4 shadow-lg shadow-teal-900/20">
              <div className="flex items-start justify-between">
                <div>
                  <p className="font-semibold text-lg text-white">Pro</p>
                  <p className="text-3xl font-bold mt-1 text-white">$9<span className="text-base font-normal text-gray-500">/mo</span></p>
                  <p className="text-sm text-gray-500 mt-1">Billed monthly</p>
                </div>
                <Badge className="bg-teal-600 text-white">Popular</Badge>
              </div>
              <ul className="space-y-2">
                {PRO_FEATURES.map((f) => (
                  <li key={f} className="flex items-center gap-2 text-sm text-gray-400">
                    <Check className="h-4 w-4 text-teal-500 shrink-0" /> {f}
                  </li>
                ))}
              </ul>
              <Button asChild className="w-full bg-teal-600 hover:bg-teal-700 text-white">
                <Link href="/signup">Start Pro Trial</Link>
              </Button>
            </div>

            {/* Annual */}
            <div className="rounded-xl border border-[#1a2a28] bg-[#0a1410] p-6 space-y-4">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <Star className="h-4 w-4 text-amber-400" />
                  <span className="text-xs font-medium text-amber-400">Best Value</span>
                </div>
                <p className="font-semibold text-lg text-white">Pro Annual</p>
                <p className="text-3xl font-bold mt-1 text-white">$79<span className="text-base font-normal text-gray-500">/yr</span></p>
                <p className="text-sm text-green-400 mt-1">Save 27% vs monthly</p>
              </div>
              <ul className="space-y-2">
                {ANNUAL_FEATURES.map((f) => (
                  <li key={f} className="flex items-center gap-2 text-sm text-gray-400">
                    <Check className="h-4 w-4 text-teal-500 shrink-0" /> {f}
                  </li>
                ))}
              </ul>
              <Button asChild variant="outline" className="w-full border-[#1a2a28] text-gray-300 hover:bg-white/5">
                <Link href="/signup">Get Annual</Link>
              </Button>
            </div>
          </div>

          {/* Lifetime deal */}
          <div className="rounded-xl border border-teal-800/50 bg-teal-900/20 p-6 flex items-center justify-between gap-4 flex-wrap">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <Badge variant="secondary" className="text-teal-300 bg-teal-900/50 border-teal-700">Limited Time</Badge>
              </div>
              <p className="font-bold text-xl text-white">Launch Lifetime Deal — $49 one-time</p>
              <p className="text-sm text-gray-400 mt-0.5">
                Pay once, use FileCurrent Pro forever. Available for the first 90 days only.
              </p>
            </div>
            <Button asChild size="lg" className="bg-teal-600 hover:bg-teal-700 text-white">
              <Link href="/signup">Get Lifetime Access</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 px-4 bg-[#0a0f0e]">
        <div className="mx-auto max-w-4xl">
          <h2 className="text-3xl font-bold text-center mb-12 text-white">What freelancers say</h2>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            {[
              { name: 'Sarah K.', role: 'Web Developer', body: 'Finally a tool that has web dev contract templates out of the box. Saved me hours on my first client.' },
              { name: 'James T.', role: 'Photographer', body: 'The reminder system is excellent — no cap, no hassle. My overdue invoice rate dropped by 60%.' },
              { name: 'Maria L.', role: 'Copywriter', body: "I switched from Bonsai and I'm paying 57% less for basically the same features. The e-signature flow is cleaner too." },
            ].map((t) => (
              <div key={t.name} className="rounded-xl border border-[#1a2a28] bg-[#0d1614] p-5 space-y-3">
                <div className="text-teal-400 text-sm">★★★★★</div>
                <p className="text-sm text-gray-400 leading-relaxed">&ldquo;{t.body}&rdquo;</p>
                <div>
                  <p className="font-medium text-sm text-white">{t.name}</p>
                  <p className="text-xs text-gray-500">{t.role}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="py-20 px-4 bg-[#0d1614]">
        <div className="mx-auto max-w-2xl">
          <h2 className="text-3xl font-bold text-center mb-10 text-white">Frequently asked questions</h2>
          <div className="space-y-2">
            {FAQS.map((faq) => (
              <FaqItem key={faq.q} question={faq.q} answer={faq.a} />
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#0a0f0e] text-gray-400 border-t border-[#1a2a28]">
        <div className="max-w-6xl mx-auto px-6 py-16">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-8">
            <div className="col-span-2 md:col-span-1">
              <LogoFull className="text-white mb-3" />
              <p className="text-sm text-gray-500 leading-relaxed">{APP_TAGLINE}</p>
              <p className="text-xs text-gray-600 mt-3">Made for freelancers.</p>
            </div>
            <div>
              <h4 className="text-white text-sm font-semibold mb-4">Product</h4>
              <ul className="space-y-3 text-sm">
                <li><a href="/#features" className="hover:text-white transition-colors">Features</a></li>
                <li><a href="/#pricing" className="hover:text-white transition-colors">Pricing</a></li>
                <li><Link href="/blog" className="hover:text-white transition-colors">Blog</Link></li>
                <li><Link href="/dashboard" className="hover:text-white transition-colors">Dashboard</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white text-sm font-semibold mb-4">Resources</h4>
              <ul className="space-y-3 text-sm">
                <li><a href="https://www.sba.gov/" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">US Small Business Admin ↗</a></li>
                <li><a href="https://www.irs.gov/" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">IRS Tax Guidelines ↗</a></li>
                <li><a href="https://www.usa.gov/" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">USA.gov ↗</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white text-sm font-semibold mb-4">Legal</h4>
              <ul className="space-y-3 text-sm">
                <li><Link href="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link></li>
                <li><Link href="/terms" className="hover:text-white transition-colors">Terms of Service</Link></li>
                <li><Link href="/refund" className="hover:text-white transition-colors">Refund Policy</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white text-sm font-semibold mb-4">Company</h4>
              <ul className="space-y-3 text-sm">
                <li><Link href="/about" className="hover:text-white transition-colors">About</Link></li>
                <li><Link href="/contact" className="hover:text-white transition-colors">Contact</Link></li>
                <li><Link href="/help" className="hover:text-white transition-colors">Help & FAQ</Link></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-[#1a2a28] mt-12 pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-gray-600">
            <span>© {new Date().getFullYear()} FileCurrent. All rights reserved.</span>
            <span>Made for freelancers worldwide.</span>
          </div>
        </div>
      </footer>
    </div>
  )
}
