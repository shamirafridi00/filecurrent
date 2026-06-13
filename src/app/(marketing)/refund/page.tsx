import type { Metadata } from 'next'
import Link from 'next/link'
import { Check } from '@/components/icons'
import { Button } from '@/components/ui/button'

export const metadata: Metadata = {
  title: 'Refund Policy | FileCurrent',
  description: '30-day money-back guarantee on all FileCurrent paid plans. No questions asked.',
}

export default function RefundPage() {
  return (
    <div className="pt-32 pb-24">
      <div className="max-w-3xl mx-auto px-6">
        <div className="text-center mb-10">
          <h1 className="text-4xl font-bold tracking-[-0.02em] text-foreground mb-3">Refund Policy</h1>
        </div>

        {/* Guarantee banner */}
        <div className="rounded-xl border border-[#A3E6C0] bg-[#F0FBF4] p-6 mb-10">
          <div className="flex items-start gap-3">
            <div className="w-9 h-9 rounded-full bg-white flex items-center justify-center shrink-0 mt-0.5 ring-1 ring-[#A3E6C0]">
              <Check className="h-4 w-4 text-[#1DB954]" weight="bold" />
            </div>
            <div>
              <h2 className="text-[#0A2540] font-bold text-lg mb-1">30-Day Money-Back Guarantee</h2>
              <p className="text-[#1DB954] text-sm leading-relaxed">
                We stand behind FileCurrent. If it&apos;s not right for you, we&apos;ll refund your payment
                in full, with no questions asked.
              </p>
            </div>
          </div>
        </div>

        {/* Policy details */}
        <div className="space-y-8">
          <div className="border-b border-border pb-8">
            <h2 className="text-lg font-semibold text-foreground mb-4">Our Refund Policy</h2>
            <ul className="space-y-3">
              {[
                ['30-Day Window', 'Request a refund within 30 days of purchase'],
                ['Full Refund', '100% of your payment back, with no partial refunds'],
                ['No Questions Asked', 'No lengthy explanations required'],
                ['Fast Processing', 'Processed within 5 to 7 business days'],
              ].map(([title, desc]) => (
                <li key={title} className="flex items-start gap-3">
                  <Check className="h-4 w-4 text-primary mt-0.5 shrink-0" weight="bold" />
                  <div>
                    <span className="text-foreground font-medium text-sm">{title}:</span>
                    <span className="text-muted-foreground text-sm ml-1">{desc}</span>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          <div className="border-b border-border pb-8">
            <h2 className="text-lg font-semibold text-foreground mb-4">How to Request a Refund</h2>
            <ol className="space-y-4">
              {[
                ['Contact Us', 'Email billing@filecurrent.com'],
                ['Include Details', 'Your account email + "Refund Request" in the subject line'],
                ['Confirmation', 'We confirm within 1 to 2 business days'],
                ['Processing', 'Refund processed to your original payment method'],
              ].map(([step, desc], i) => (
                <li key={step} className="flex items-start gap-4">
                  <div className="w-7 h-7 rounded-full bg-accent border border-primary/30 flex items-center justify-center shrink-0 text-primary text-xs font-bold">
                    {i + 1}
                  </div>
                  <div>
                    <p className="text-foreground font-medium text-sm">{step}</p>
                    <p className="text-muted-foreground text-sm">{desc}</p>
                  </div>
                </li>
              ))}
            </ol>
          </div>

          <div className="border-b border-border pb-8">
            <h2 className="text-lg font-semibold text-foreground mb-4">Important Notes</h2>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>• Refunds are available within 30 days of purchase date only</li>
              <li>• Account access ends upon refund processing</li>
              <li>• One refund per customer</li>
              <li>• The 5-day trial is free, so no refund is needed before you pay</li>
            </ul>
          </div>

          <div className="rounded-xl border border-primary/20 bg-accent p-6">
            <p className="text-primary text-sm font-semibold mb-1">Try before you buy</p>
            <p className="text-muted-foreground text-sm mb-4">
              Every account starts with a 5-day free trial of every feature. No credit card required.
            </p>
            <Button asChild className="bg-primary hover:bg-[#5145E5] text-white">
              <Link href="/signup">Start free →</Link>
            </Button>
          </div>

          <div className="text-center pt-4">
            <h3 className="text-foreground font-semibold mb-2">Our Promise</h3>
            <p className="text-muted-foreground text-sm leading-relaxed max-w-xl mx-auto">
              We built FileCurrent to help freelancers succeed. If it&apos;s not the right fit for your business,
              we want you to get your money back, with no hassle and no hard feelings.
            </p>
            <p className="text-primary text-sm mt-3">billing@filecurrent.com</p>
          </div>
        </div>
      </div>
    </div>
  )
}
