'use client'

import Link from 'next/link'
import {
  Check,
  X,
  FileText,
  PencilLine,
  Bell,
  CaretDown,
  UserPlus,
  PaperPlaneTilt,
  Receipt,
  CurrencyDollar,
  XLogo,
} from '@phosphor-icons/react'
import { Button } from '@/components/ui/button'
import { FaqItem } from '@/components/landing/FaqItem'
import { NavBar } from '@/components/landing/NavBar'
import { AnimatedFeatureCards } from '@/components/landing/AnimatedFeatureCards'
import { LogoFullInverse } from '@/components/logo/LogoMark'

const FEATURES = [
  {
    icon: <FileText className="h-6 w-6 text-[#635BFF]" />,
    title: 'Contracts that protect you',
    desc: 'Profession-specific contract templates with legally binding e-signatures. Clients sign in the browser — no DocuSign account needed.',
    stat: '7 profession templates · ESIGN Act compliant',
  },
  {
    icon: <PencilLine className="h-6 w-6 text-[#635BFF]" />,
    title: 'Invoices clients actually pay',
    desc: 'Five polished themes, payment instructions on every invoice, and a public link your client can open from any device.',
    stat: '5 themes · automated reminders included',
  },
  {
    icon: <Bell className="h-6 w-6 text-[#635BFF]" />,
    title: 'Reminders with no cap',
    desc: 'Escalating tone, auto-stops when paid, and no daily sending limit. Set the schedule once and stop chasing clients.',
    stat: 'Freelancers get paid up to 11 days faster',
  },
]

const HOW_IT_WORKS = [
  { icon: UserPlus, title: 'Add Client', desc: 'Name and email is all it takes.' },
  { icon: PaperPlaneTilt, title: 'Send Contract', desc: 'Pick a template, send for e-signature.' },
  { icon: Receipt, title: 'Issue Invoice', desc: 'One click from the signed contract.' },
  { icon: CurrencyDollar, title: 'Get Paid', desc: 'Reminders chase the client for you.' },
]

const MARQUEE_ITEMS = [
  'web developers', 'photographers', 'consultants',
  'designers', 'copywriters', 'marketers',
]

const COMPARISON = [
  { feature: 'Price', fc: '$9/mo', bonsai: '$21/mo', honeybook: '$36/mo †' },
  { feature: 'Contracts', fc: true, bonsai: true, honeybook: true },
  { feature: 'E-Signatures', fc: true, bonsai: true, honeybook: true },
  { feature: 'Auto Reminders', fc: '✓ (no cap)', bonsai: '✓', honeybook: '✓' },
  { feature: 'No Daily Email Cap', fc: true, bonsai: true, honeybook: false },
  { feature: 'Profession Templates', fc: true, bonsai: 'Partial', honeybook: false },
  { feature: 'Time Tracking', fc: true, bonsai: true, honeybook: false },
  { feature: 'Instant Setup', fc: '5 minutes', bonsai: 'Hours', honeybook: '15–25 hours*' },
  { feature: 'Data Export', fc: true, bonsai: 'Partial', honeybook: 'Partial' },
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

const TESTIMONIALS = [
  {
    before: 'I was chasing clients for 2 weeks after every invoice.',
    after: 'Now reminders run automatically and I get paid in 3 days on average.',
    name: 'Sarah K.',
    role: 'Web Developer',
  },
  {
    before: 'Sending contracts meant exporting PDFs and praying clients printed and scanned them.',
    after: 'Clients sign in the browser in under a minute — signed copy lands in both inboxes.',
    name: 'James T.',
    role: 'Photographer',
  },
  {
    before: 'I paid $21/month for features I never opened.',
    after: "Switched and I'm paying 57% less for the parts I actually use every week.",
    name: 'Maria L.',
    role: 'Copywriter',
  },
]

const FAQS = [
  { q: 'Is FileCurrent free?', a: 'Yes — the Free plan lets you create 3 documents per month (contracts + invoices combined) with no credit card required.' },
  { q: 'Are the e-signatures legally binding?', a: 'Yes. FileCurrent uses the ESIGN Act (15 U.S.C. § 7001) standard. Each signature is logged with IP address, timestamp, and a document hash for tamper detection.' },
  { q: 'What happens if I go over 3 documents on the free plan?', a: "You'll see an upgrade prompt. Your existing documents are never deleted — you just need to upgrade to create new ones that month." },
  { q: 'Can I import clients from HoneyBook or Bonsai?', a: 'Yes — use the Import Clients feature (CSV format) to bring your existing client list into FileCurrent.' },
  { q: 'Do you have profession-specific contract templates?', a: 'Yes. FileCurrent pre-filters templates based on your profession (web developer, photographer, consultant, designer, copywriter, or marketer) so you always see the most relevant ones first.' },
  { q: 'Is there a daily limit on payment reminders?', a: 'No. Unlike some competitors, FileCurrent has no daily email cap. Reminders are sent on your configured schedule until the invoice is paid.' },
]

function CheckIcon() { return <Check className="h-4 w-4 text-[#635BFF]" /> }
function XIcon() { return <X className="h-4 w-4 text-gray-600" /> }

function CellValue({ val }: { val: boolean | string }) {
  if (val === true) return <CheckIcon />
  if (val === false) return <XIcon />
  return <span className="text-sm">{val}</span>
}

export function LandingContent() {
  return (
    <div className="min-h-screen bg-[#0A2540] text-gray-100">
      <NavBar />

      {/* Hero */}
      <section className="hero-grid-bg relative flex min-h-screen flex-col items-center justify-center px-4 pt-28 pb-16">
        <div className="mx-auto max-w-3xl text-center">
          <div className="hero-headline mb-6 inline-flex items-center rounded-full border border-[#635BFF]/40 bg-[#635BFF]/10 px-4 py-1.5 text-xs font-medium text-[#A5B4FC]">
            Built for US freelancers · $9/month
          </div>
          <h1 className="hero-headline mb-5 text-5xl font-bold leading-[1.08] text-white md:text-6xl" style={{ letterSpacing: '-0.02em' }}>
            Get paid faster.<br />
            <span className="text-[#635BFF]">Look professional doing it.</span>
          </h1>
          <p className="hero-subtitle mx-auto mb-8 max-w-xl text-lg leading-relaxed text-gray-400">
            Contracts, e-signatures, invoices, and reminders that chase your
            clients so you don&apos;t have to. Your money goes straight to you —
            no platform delays.
          </p>
          <div className="hero-ctas flex flex-wrap items-center justify-center gap-3">
            <Button asChild className="rounded-lg bg-[#635BFF] px-8 py-3 text-base font-semibold text-white hover:bg-[#5145E5] h-auto">
              <Link href="/signup">Start Free — No card needed</Link>
            </Button>
            <Button asChild variant="outline" className="rounded-lg border-white/20 bg-transparent px-8 py-3 text-base text-white/80 hover:bg-white/5 hover:text-white h-auto">
              <a href="#features">See a live demo ↓</a>
            </Button>
          </div>
          <div className="hero-ctas mt-8 flex flex-wrap items-center justify-center gap-x-4 gap-y-1 text-sm text-gray-500">
            <span>Trusted by 500+ freelancers</span>
            <span aria-hidden>·</span>
            <span className="text-[#635BFF]">★★★★★</span>
            <span aria-hidden>·</span>
            <span>ESIGN Act compliant</span>
          </div>
        </div>
        <a href="#features" aria-label="Scroll to features" className="scroll-indicator absolute bottom-6 text-gray-500 hover:text-gray-300">
          <CaretDown size={22} />
        </a>
      </section>

      {/* Social proof marquee */}
      <section className="border-y border-[#1A3A5C] bg-[#071929] py-5">
        <div className="marquee mx-auto max-w-6xl">
          <div className="marquee-track gap-8 text-sm text-gray-500">
            {[...MARQUEE_ITEMS, ...MARQUEE_ITEMS].map((item, i) => (
              <span key={i} className="flex items-center gap-8 whitespace-nowrap">
                Used by {item} <span className="text-[#1A3A5C]">·</span>
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="bg-[#071929] px-4 py-20">
        <div className="mx-auto max-w-5xl">
          <h2 className="mb-3 text-center text-3xl font-bold text-white" style={{ letterSpacing: '-0.02em' }}>
            Everything a freelancer needs. Nothing you don&apos;t.
          </h2>
          <p className="mb-12 text-center text-sm text-gray-400">Built for web developers, photographers, consultants, designers, copywriters, and marketers.</p>
          <AnimatedFeatureCards features={FEATURES} />
        </div>
      </section>

      {/* How it works */}
      <section className="bg-[#0A2540] px-4 py-20">
        <div className="mx-auto max-w-5xl">
          <h2 className="mb-3 text-center text-3xl font-bold text-white" style={{ letterSpacing: '-0.02em' }}>
            From handshake to paid — in four steps
          </h2>
          <p className="mb-12 text-center text-sm text-gray-400">The whole flow lives in one tool. No copy-pasting between apps.</p>
          <div className="grid grid-cols-1 gap-8 md:grid-cols-4 md:gap-4">
            {HOW_IT_WORKS.map((step, i) => {
              const Icon = step.icon
              return (
                <div key={step.title} className="relative flex flex-col items-center text-center">
                  {i < HOW_IT_WORKS.length - 1 && (
                    <div className="absolute left-[calc(50%+32px)] top-6 hidden h-px w-[calc(100%-64px)] border-t border-dashed border-[#1A3A5C] md:block" aria-hidden />
                  )}
                  <div className="relative mb-4 flex h-12 w-12 items-center justify-center rounded-full border border-[#635BFF]/40 bg-[#635BFF]/10">
                    <Icon className="h-5 w-5 text-[#635BFF]" />
                    <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-[#635BFF] text-[10px] font-bold text-white">
                      {i + 1}
                    </span>
                  </div>
                  <h3 className="mb-1 font-semibold text-white">{step.title}</h3>
                  <p className="text-sm text-gray-400">{step.desc}</p>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Comparison table */}
      <section className="bg-[#071929] px-4 py-20">
        <div className="mx-auto max-w-3xl">
          <h2 className="mb-3 text-center text-3xl font-bold text-white" style={{ letterSpacing: '-0.02em' }}>Why freelancers choose FileCurrent</h2>
          <p className="mb-10 text-center text-sm text-gray-400">See how we compare to the leading alternatives</p>
          <div className="overflow-x-auto rounded-xl border border-[#1A3A5C]">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-[#1A3A5C]">
                  <th className="p-3 text-left font-semibold text-gray-400">Feature</th>
                  <th className="bg-[#635BFF]/20 p-3 text-center font-semibold text-white">FileCurrent</th>
                  <th className="p-3 text-center font-normal text-gray-500">Bonsai</th>
                  <th className="p-3 text-center font-normal text-gray-500">HoneyBook</th>
                </tr>
              </thead>
              <tbody>
                {COMPARISON.map((row, i) => (
                  <tr key={row.feature} className={i % 2 === 0 ? 'bg-[#071929]' : 'bg-[#0A2540]'}>
                    <td className="p-3 font-medium text-gray-300">{row.feature}</td>
                    <td className="bg-[#635BFF]/10 p-3 text-center">
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
          <p className="mt-3 text-xs text-gray-600">
            † HoneyBook Starter was $19/mo, raised to $36/mo in 2024 — an 89% price increase.
            &nbsp;* Based on reported Dubsado/HoneyBook setup times from user reviews.
          </p>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="bg-[#0A2540] px-4 py-20">
        <div className="mx-auto max-w-5xl">
          <h2 className="mb-3 text-center text-3xl font-bold text-white" style={{ letterSpacing: '-0.02em' }}>Simple, honest pricing</h2>
          <p className="mb-12 text-center text-sm text-gray-400">No hidden fees. Cancel anytime.</p>

          <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
            {/* Free */}
            <div className="space-y-4 rounded-xl border border-[#1A3A5C] bg-[#071929] p-6">
              <div>
                <p className="text-lg font-semibold text-white">Free</p>
                <p className="mt-1 text-3xl font-bold text-white">$0<span className="text-base font-normal text-gray-500">/mo</span></p>
                <p className="mt-1 text-sm text-gray-500">Forever</p>
              </div>
              <ul className="space-y-2">
                {FREE_FEATURES.map((f) => (
                  <li key={f} className="flex items-center gap-2 text-sm text-gray-400">
                    <Check className="h-4 w-4 shrink-0 text-[#635BFF]" /> {f}
                  </li>
                ))}
              </ul>
              <Button asChild variant="outline" className="w-full border-[#1A3A5C] text-gray-300 hover:bg-white/5">
                <Link href="/signup">Get started free</Link>
              </Button>
            </div>

            {/* Pro Monthly */}
            <div className="space-y-4 rounded-xl border-2 border-[#635BFF] bg-[#071929] p-6 shadow-lg shadow-[#0A2540]/20">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-lg font-semibold text-white">Pro</p>
                  <p className="mt-1 text-3xl font-bold text-white">$9<span className="text-base font-normal text-gray-500">/mo</span></p>
                  <p className="mt-1 text-sm text-gray-500">Billed monthly</p>
                </div>
                <span className="rounded-full bg-[#635BFF] px-2.5 py-0.5 text-xs font-semibold text-white">Popular</span>
              </div>
              <ul className="space-y-2">
                {PRO_FEATURES.map((f) => (
                  <li key={f} className="flex items-center gap-2 text-sm text-gray-400">
                    <Check className="h-4 w-4 shrink-0 text-[#635BFF]" /> {f}
                  </li>
                ))}
              </ul>
              <Button asChild className="w-full bg-[#635BFF] text-white hover:bg-[#5145E5]">
                <Link href="/signup">Start Pro Trial</Link>
              </Button>
              <p className="text-center text-xs text-gray-500">30-day free trial · No credit card required</p>
            </div>

            {/* Annual */}
            <div className="space-y-4 rounded-xl border border-[#1A3A5C] bg-[#071929] p-6">
              <div>
                <p className="mb-1 text-xs font-medium text-amber-400">★ Best Value</p>
                <p className="text-lg font-semibold text-white">Pro Annual</p>
                <p className="mt-1 text-3xl font-bold text-white">$79<span className="text-base font-normal text-gray-500">/yr</span></p>
                <p className="mt-1 text-sm text-gray-500">$6.58/mo effective · <span className="text-green-400">save 27%</span></p>
              </div>
              <ul className="space-y-2">
                {ANNUAL_FEATURES.map((f) => (
                  <li key={f} className="flex items-center gap-2 text-sm text-gray-400">
                    <Check className="h-4 w-4 shrink-0 text-[#635BFF]" /> {f}
                  </li>
                ))}
              </ul>
              <Button asChild variant="outline" className="w-full border-[#1A3A5C] text-gray-300 hover:bg-white/5">
                <Link href="/signup">Get Annual</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials — before/after */}
      <section className="bg-[#071929] px-4 py-20">
        <div className="mx-auto max-w-4xl">
          <h2 className="mb-12 text-center text-3xl font-bold text-white" style={{ letterSpacing: '-0.02em' }}>Before and after FileCurrent</h2>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            {TESTIMONIALS.map((t) => (
              <div key={t.name} className="space-y-3 rounded-xl border border-[#1A3A5C] bg-[#0A2540] p-5">
                <div>
                  <p className="mb-1 text-[10px] font-semibold uppercase tracking-wider text-gray-600">Before</p>
                  <p className="text-sm leading-relaxed text-gray-500">&ldquo;{t.before}&rdquo;</p>
                </div>
                <div>
                  <p className="mb-1 text-[10px] font-semibold uppercase tracking-wider text-[#635BFF]">After</p>
                  <p className="text-sm leading-relaxed text-gray-300">&ldquo;{t.after}&rdquo;</p>
                </div>
                <div className="border-t border-[#1A3A5C] pt-3">
                  <p className="text-sm font-medium text-white">— {t.name}, {t.role}</p>
                  <p className="text-xs text-gray-600">via FileCurrent</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="bg-[#0A2540] px-4 py-20">
        <div className="mx-auto max-w-2xl">
          <h2 className="mb-10 text-center text-3xl font-bold text-white" style={{ letterSpacing: '-0.02em' }}>Frequently asked questions</h2>
          <div className="space-y-2">
            {FAQS.map((faq) => (
              <FaqItem key={faq.q} question={faq.q} answer={faq.a} />
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-[#1A3A5C] bg-[#0A2540] text-gray-400">
        <div className="mx-auto max-w-6xl px-6 py-16">
          <div className="grid grid-cols-2 gap-8 md:grid-cols-5">
            <div className="col-span-2 md:col-span-1">
              <LogoFullInverse size={28} className="mb-3" />
              <p className="text-sm leading-relaxed text-gray-500">Helping freelancers get paid since 2024.</p>
              <a
                href="https://x.com/filecurrent"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="FileCurrent on X"
                className="mt-3 inline-flex h-8 w-8 items-center justify-center rounded-md border border-[#1A3A5C] text-gray-500 transition-colors hover:border-[#635BFF]/50 hover:text-white"
              >
                <XLogo size={16} />
              </a>
            </div>
            <div>
              <h4 className="mb-4 text-sm font-semibold text-white">Product</h4>
              <ul className="space-y-3 text-sm">
                <li><a href="/#features" className="transition-colors hover:text-white">Features</a></li>
                <li><a href="/#pricing" className="transition-colors hover:text-white">Pricing</a></li>
                <li><Link href="/blog" className="transition-colors hover:text-white">Blog</Link></li>
                <li><Link href="/dashboard" className="transition-colors hover:text-white">Dashboard</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="mb-4 text-sm font-semibold text-white">Resources</h4>
              <ul className="space-y-3 text-sm">
                <li><a href="https://www.sba.gov/" target="_blank" rel="noopener noreferrer" className="transition-colors hover:text-white">US Small Business Admin ↗</a></li>
                <li><a href="https://www.irs.gov/" target="_blank" rel="noopener noreferrer" className="transition-colors hover:text-white">IRS Tax Guidelines ↗</a></li>
                <li><a href="https://status.vercel.com/" target="_blank" rel="noopener noreferrer" className="transition-colors hover:text-white">Status ↗</a></li>
              </ul>
            </div>
            <div>
              <h4 className="mb-4 text-sm font-semibold text-white">Legal</h4>
              <ul className="space-y-3 text-sm">
                <li><Link href="/privacy" className="transition-colors hover:text-white">Privacy Policy</Link></li>
                <li><Link href="/terms" className="transition-colors hover:text-white">Terms of Service</Link></li>
                <li><Link href="/refund" className="transition-colors hover:text-white">Refund Policy</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="mb-4 text-sm font-semibold text-white">Company</h4>
              <ul className="space-y-3 text-sm">
                <li><Link href="/about" className="transition-colors hover:text-white">About</Link></li>
                <li><Link href="/contact" className="transition-colors hover:text-white">Contact</Link></li>
                <li><Link href="/help" className="transition-colors hover:text-white">Help & FAQ</Link></li>
              </ul>
            </div>
          </div>
          <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-[#1A3A5C] pt-8 text-xs text-gray-600 md:flex-row">
            <span>© {new Date().getFullYear()} FileCurrent. All rights reserved.</span>
            <span>Made for freelancers worldwide.</span>
          </div>
        </div>
      </footer>
    </div>
  )
}
