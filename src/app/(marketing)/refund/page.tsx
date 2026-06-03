import type { Metadata } from 'next'
import Link from 'next/link'
import { Check } from '@/components/icons'
import { Button } from '@/components/ui/button'

export const metadata: Metadata = {
  title: 'Refund Policy — FileCurrent',
  description: '30-day money-back guarantee on all FileCurrent paid plans. No questions asked.',
}

export default function RefundPage() {
  return (
    <div className="pt-24 pb-20">
      <div className="max-w-3xl mx-auto px-6">
        <div className="text-center mb-10">
          <h1 className="text-4xl font-bold text-white mb-3">Refund Policy</h1>
        </div>

        {/* Guarantee banner */}
        <div className="rounded-xl border border-green-800/50 bg-green-900/20 p-6 mb-10">
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-full bg-green-600/20 flex items-center justify-center shrink-0 mt-0.5">
              <Check className="h-4 w-4 text-green-400" />
            </div>
            <div>
              <h2 className="text-green-300 font-bold text-lg mb-1">30-Day Money-Back Guarantee</h2>
              <p className="text-green-400/80 text-sm leading-relaxed">
                We stand behind FileCurrent. If it&apos;s not right for you, we&apos;ll refund your payment
                in full — no questions asked.
              </p>
            </div>
          </div>
        </div>

        {/* Policy details */}
        <div className="space-y-8">
          <div className="border-b border-[#1A3A5C] pb-8">
            <h2 className="text-lg font-semibold text-white mb-4">Our Refund Policy</h2>
            <ul className="space-y-3">
              {[
                ['30-Day Window', 'Request a refund within 30 days of purchase'],
                ['Full Refund', '100% of your payment back — no partial refunds'],
                ['No Questions Asked', 'No lengthy explanations required'],
                ['Fast Processing', 'Processed within 5–7 business days'],
              ].map(([title, desc]) => (
                <li key={title} className="flex items-start gap-3">
                  <Check className="h-4 w-4 text-[#635BFF] mt-0.5 shrink-0" />
                  <div>
                    <span className="text-white font-medium text-sm">{title}:</span>
                    <span className="text-gray-400 text-sm ml-1">{desc}</span>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          <div className="border-b border-[#1A3A5C] pb-8">
            <h2 className="text-lg font-semibold text-white mb-4">How to Request a Refund</h2>
            <ol className="space-y-4">
              {[
                ['Contact Us', 'Email billing@filecurrent.io'],
                ['Include Details', 'Your account email + "Refund Request" in the subject line'],
                ['Confirmation', 'We confirm within 1–2 business days'],
                ['Processing', 'Refund processed to your original payment method'],
              ].map(([step, desc], i) => (
                <li key={step} className="flex items-start gap-4">
                  <div className="w-7 h-7 rounded-full bg-[#635BFF]/20 border border-[#635BFF] flex items-center justify-center shrink-0 text-[#635BFF] text-xs font-bold">
                    {i + 1}
                  </div>
                  <div>
                    <p className="text-white font-medium text-sm">{step}</p>
                    <p className="text-gray-400 text-sm">{desc}</p>
                  </div>
                </li>
              ))}
            </ol>
          </div>

          <div className="border-b border-[#1A3A5C] pb-8">
            <h2 className="text-lg font-semibold text-white mb-4">Important Notes</h2>
            <ul className="space-y-2 text-sm text-gray-400">
              <li>• Refunds are available within 30 days of purchase date only</li>
              <li>• Account access ends upon refund processing</li>
              <li>• One refund per customer</li>
              <li>• The free tier is free — no refund needed</li>
            </ul>
          </div>

          <div className="rounded-xl border border-[#5145E5]/50 bg-[#0A2540]/20 p-6">
            <p className="text-[#A5B4FC] text-sm font-medium mb-1">Try before you buy</p>
            <p className="text-gray-400 text-sm mb-4">
              FileCurrent is free for up to 3 documents per month, forever. No credit card required.
            </p>
            <Button asChild className="bg-[#635BFF] hover:bg-[#635BFF] text-white">
              <Link href="/signup">Start Free →</Link>
            </Button>
          </div>

          <div className="text-center pt-4">
            <h3 className="text-white font-semibold mb-2">Our Promise</h3>
            <p className="text-gray-400 text-sm leading-relaxed max-w-xl mx-auto">
              We built FileCurrent to help freelancers succeed. If it&apos;s not the right fit for your business,
              we want you to get your money back — no hassle, no hard feelings.
            </p>
            <p className="text-[#635BFF] text-sm mt-3">billing@filecurrent.io</p>
          </div>
        </div>
      </div>
    </div>
  )
}
