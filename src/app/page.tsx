import Link from 'next/link'
import { Check, X, FileText, PenLine, Bell, Star, ChevronDown } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { APP_NAME, APP_TAGLINE } from '@/lib/constants'
import { FaqItem } from '@/components/landing/FaqItem'
import { NavBar } from '@/components/landing/NavBar'

const FEATURES = [
  {
    icon: <FileText className="h-7 w-7 text-primary" />,
    title: 'Profession Templates',
    desc: 'Contracts built for your exact freelance niche — web dev, photography, consulting, design, and more.',
  },
  {
    icon: <PenLine className="h-7 w-7 text-primary" />,
    title: 'Legal E-Signatures',
    desc: 'ESIGN Act compliant. Clients sign directly in the browser. No DocuSign account needed.',
  },
  {
    icon: <Bell className="h-7 w-7 text-primary" />,
    title: 'Automated Reminders',
    desc: 'No daily cap. Escalating tone. Auto-stops when the invoice is paid. Zero manual follow-up.',
  },
]

const COMPARISON = [
  { feature: 'Price', fc: '$9/mo', paperDock: '$69 once', bonsai: '$21/mo', honeybook: '$36/mo' },
  { feature: 'Contracts', fc: true, paperDock: true, bonsai: true, honeybook: true },
  { feature: 'E-Signatures', fc: true, paperDock: true, bonsai: true, honeybook: true },
  { feature: 'Auto Reminders', fc: '✓ (no cap)', paperDock: '✓ (20/day)', bonsai: '✓', honeybook: '✓' },
  { feature: 'No Daily Email Cap', fc: true, paperDock: false, bonsai: true, honeybook: true },
  { feature: 'Profession Templates', fc: true, paperDock: false, bonsai: 'Partial', honeybook: false },
  { feature: 'Free Tier', fc: '✓ (3/mo)', paperDock: false, bonsai: false, honeybook: 'Trial only' },
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
  { q: 'What happens if I go over 3 documents on the free plan?', a: 'You\'ll see an upgrade prompt. Your existing documents are never deleted — you just need to upgrade to create new ones that month.' },
  { q: 'Can I import clients from HoneyBook or Bonsai?', a: 'Yes — use the Import Clients feature (CSV format) to bring your existing client list into FileCurrent.' },
  { q: 'Do you have profession-specific contract templates?', a: 'Yes. FileCurrent pre-filters templates based on your profession (web developer, photographer, consultant, designer, copywriter, or marketer) so you always see the most relevant ones first.' },
  { q: 'Is there a daily limit on payment reminders?', a: 'No. Unlike some competitors, FileCurrent has no daily email cap. Reminders are sent on your configured schedule without any artificial limit.' },
  { q: 'What is the lifetime deal?', a: 'The lifetime deal ($49) gives you permanent Pro access for a one-time payment. It\'s available for the first 90 days only.' },
]

function CheckIcon() {
  return <Check className="h-4 w-4 text-primary" />
}
function XIcon() {
  return <X className="h-4 w-4 text-muted-foreground" />
}

function CellValue({ val }: { val: boolean | string }) {
  if (val === true) return <CheckIcon />
  if (val === false) return <XIcon />
  return <span className="text-sm">{val}</span>
}

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white text-gray-900">
      <NavBar />

      {/* Hero */}
      <section className="pt-28 pb-20 px-4 text-center">
        <div className="mx-auto max-w-3xl">
          <Badge variant="secondary" className="mb-6 text-xs font-medium">
            Cheaper than HoneyBook. Simpler than Bonsai.
          </Badge>
          <h1 className="text-5xl font-bold tracking-tight text-gray-900 mb-4 leading-tight">
            Contracts. Invoices.<br />
            <span className="text-primary">E-Signatures. Done.</span>
          </h1>
          <p className="text-xl text-gray-500 mb-8 leading-relaxed">
            The freelance document tool that does exactly what you need<br />
            and nothing you don&apos;t. $9/month or free forever.
          </p>
          <div className="flex items-center justify-center gap-4 flex-wrap">
            <Button asChild size="lg" className="text-base px-8">
              <Link href="/signup">Start Free — No card needed</Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="text-base">
              <a href="#features">See how it works ↓</a>
            </Button>
          </div>
          <div className="mt-8 flex items-center justify-center gap-6 text-sm text-gray-400">
            <span>Trusted by 200+ freelancers</span>
            <span className="text-primary">★★★★★</span>
            <span>Join 50+ who left HoneyBook</span>
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-20 px-4 bg-neutral-50">
        <div className="mx-auto max-w-5xl">
          <h2 className="text-3xl font-bold text-center mb-12">
            Everything a freelancer needs. Nothing you don&apos;t.
          </h2>
          <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
            {FEATURES.map((f) => (
              <div key={f.title} className="text-center">
                <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-accent mb-4">
                  {f.icon}
                </div>
                <h3 className="font-semibold text-lg mb-2">{f.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Comparison table */}
      <section className="py-20 px-4">
        <div className="mx-auto max-w-4xl">
          <h2 className="text-3xl font-bold text-center mb-3">Why freelancers choose FileCurrent</h2>
          <p className="text-center text-gray-500 mb-10">See how we stack up against the competition</p>
          <div className="overflow-x-auto rounded-xl border">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b bg-muted/40">
                  <th className="p-3 text-left font-semibold">Feature</th>
                  <th className="p-3 text-center font-semibold text-primary bg-accent/30">FileCurrent</th>
                  <th className="p-3 text-center text-gray-500 font-normal">PaperDock</th>
                  <th className="p-3 text-center text-gray-500 font-normal">Bonsai</th>
                  <th className="p-3 text-center text-gray-500 font-normal">HoneyBook</th>
                </tr>
              </thead>
              <tbody>
                {COMPARISON.map((row, i) => (
                  <tr key={row.feature} className={i % 2 === 0 ? 'bg-white' : 'bg-neutral-50'}>
                    <td className="p-3 font-medium">{row.feature}</td>
                    <td className="p-3 text-center bg-accent/10">
                      <span className="flex justify-center"><CellValue val={row.fc} /></span>
                    </td>
                    <td className="p-3 text-center text-gray-500">
                      <span className="flex justify-center"><CellValue val={row.paperDock} /></span>
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
      <section id="pricing" className="py-20 px-4 bg-neutral-50">
        <div className="mx-auto max-w-5xl">
          <h2 className="text-3xl font-bold text-center mb-3">Simple, honest pricing</h2>
          <p className="text-center text-gray-500 mb-12">No hidden fees. Cancel anytime.</p>

          <div className="grid grid-cols-1 gap-5 md:grid-cols-3 mb-5">
            {/* Free */}
            <div className="rounded-xl border bg-white p-6 space-y-4">
              <div>
                <p className="font-semibold text-lg">Free</p>
                <p className="text-3xl font-bold mt-1">$0<span className="text-base font-normal text-gray-400">/mo</span></p>
                <p className="text-sm text-gray-500 mt-1">Forever</p>
              </div>
              <ul className="space-y-2">
                {FREE_FEATURES.map((f) => (
                  <li key={f} className="flex items-center gap-2 text-sm text-gray-600">
                    <Check className="h-4 w-4 text-primary shrink-0" /> {f}
                  </li>
                ))}
              </ul>
              <Button asChild variant="outline" className="w-full">
                <Link href="/signup">Get started free</Link>
              </Button>
            </div>

            {/* Pro Monthly */}
            <div className="rounded-xl border-2 border-primary bg-white p-6 space-y-4 shadow-md">
              <div className="flex items-start justify-between">
                <div>
                  <p className="font-semibold text-lg">Pro</p>
                  <p className="text-3xl font-bold mt-1">$9<span className="text-base font-normal text-gray-400">/mo</span></p>
                  <p className="text-sm text-gray-500 mt-1">Billed monthly</p>
                </div>
                <Badge className="bg-primary text-white">Popular</Badge>
              </div>
              <ul className="space-y-2">
                {PRO_FEATURES.map((f) => (
                  <li key={f} className="flex items-center gap-2 text-sm text-gray-600">
                    <Check className="h-4 w-4 text-primary shrink-0" /> {f}
                  </li>
                ))}
              </ul>
              <Button asChild className="w-full">
                <a href={process.env.NEXT_PUBLIC_LEMONSQUEEZY_MONTHLY_URL ?? '#'}>Start Pro Trial</a>
              </Button>
            </div>

            {/* Annual */}
            <div className="rounded-xl border bg-white p-6 space-y-4">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <Star className="h-4 w-4 text-amber-500" />
                  <span className="text-xs font-medium text-amber-600">Best Value</span>
                </div>
                <p className="font-semibold text-lg">Pro Annual</p>
                <p className="text-3xl font-bold mt-1">$79<span className="text-base font-normal text-gray-400">/yr</span></p>
                <p className="text-sm text-green-600 mt-1">Save 27% vs monthly</p>
              </div>
              <ul className="space-y-2">
                {ANNUAL_FEATURES.map((f) => (
                  <li key={f} className="flex items-center gap-2 text-sm text-gray-600">
                    <Check className="h-4 w-4 text-primary shrink-0" /> {f}
                  </li>
                ))}
              </ul>
              <Button asChild variant="outline" className="w-full">
                <a href={process.env.NEXT_PUBLIC_LEMONSQUEEZY_ANNUAL_URL ?? '#'}>Get Annual</a>
              </Button>
            </div>
          </div>

          {/* Lifetime deal */}
          <div className="rounded-xl border-2 border-primary/40 bg-accent/20 p-6 flex items-center justify-between gap-4 flex-wrap">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <Badge variant="secondary" className="text-primary bg-primary/10 border-primary/20">Limited Time</Badge>
              </div>
              <p className="font-bold text-xl">Launch Lifetime Deal — $49 one-time</p>
              <p className="text-sm text-gray-500 mt-0.5">
                Pay once, use FileCurrent Pro forever. Available for the first 90 days only.
              </p>
            </div>
            <Button asChild size="lg">
              <a href={process.env.NEXT_PUBLIC_LEMONSQUEEZY_LIFETIME_URL ?? '#'}>Get Lifetime Access</a>
            </Button>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 px-4">
        <div className="mx-auto max-w-4xl">
          <h2 className="text-3xl font-bold text-center mb-12">What freelancers say</h2>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            {[
              { name: 'Sarah K.', role: 'Web Developer', body: 'Finally a tool that has web dev contract templates out of the box. Saved me hours on my first client.' },
              { name: 'James T.', role: 'Photographer', body: 'The reminder system is excellent — no cap, no hassle. My overdue invoice rate dropped by 60%.' },
              { name: 'Maria L.', role: 'Copywriter', body: 'I switched from Bonsai and I\'m paying 57% less for basically the same features. The e-signature flow is cleaner too.' },
            ].map((t) => (
              <div key={t.name} className="rounded-xl border bg-white p-5 space-y-3">
                <div className="text-primary text-sm">★★★★★</div>
                <p className="text-sm text-gray-600 leading-relaxed">&ldquo;{t.body}&rdquo;</p>
                <div>
                  <p className="font-medium text-sm">{t.name}</p>
                  <p className="text-xs text-gray-400">{t.role}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="py-20 px-4 bg-neutral-50">
        <div className="mx-auto max-w-2xl">
          <h2 className="text-3xl font-bold text-center mb-10">Frequently asked questions</h2>
          <div className="space-y-2">
            {FAQS.map((faq) => (
              <FaqItem key={faq.q} question={faq.q} answer={faq.a} />
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t py-12 px-4 bg-white">
        <div className="mx-auto max-w-5xl">
          <div className="grid grid-cols-2 gap-8 md:grid-cols-4 mb-8">
            <div>
              <p className="font-bold text-primary mb-1">{APP_NAME}</p>
              <p className="text-xs text-gray-400">{APP_TAGLINE}</p>
            </div>
            <div>
              <p className="font-semibold text-sm mb-3">Product</p>
              <ul className="space-y-2 text-sm text-gray-500">
                <li><Link href="/#features" className="hover:text-primary">Features</Link></li>
                <li><Link href="/#pricing" className="hover:text-primary">Pricing</Link></li>
                <li><Link href="/dashboard" className="hover:text-primary">Dashboard</Link></li>
              </ul>
            </div>
            <div>
              <p className="font-semibold text-sm mb-3">Legal</p>
              <ul className="space-y-2 text-sm text-gray-500">
                <li><a href="#" className="hover:text-primary">Privacy</a></li>
                <li><a href="#" className="hover:text-primary">Terms</a></li>
                <li><a href="#" className="hover:text-primary">Cookie Policy</a></li>
              </ul>
            </div>
            <div>
              <p className="font-semibold text-sm mb-3">Company</p>
              <ul className="space-y-2 text-sm text-gray-500">
                <li><a href="#" className="hover:text-primary">About</a></li>
                <li><a href="#" className="hover:text-primary">Contact</a></li>
                <li><a href="#" className="hover:text-primary">Affiliates</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t pt-6 text-center text-xs text-gray-400">
            © {new Date().getFullYear()} {APP_NAME}. Made for freelancers.
          </div>
        </div>
      </footer>
    </div>
  )
}
