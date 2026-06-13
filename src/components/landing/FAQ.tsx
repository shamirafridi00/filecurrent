import Link from 'next/link'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'

const ITEMS = [
  {
    q: 'Wait, I can’t collect payments inside FileCurrent?',
    a: (
      <>
        Correct, and that&apos;s on purpose. Your clients pay you directly through your own methods,
        so you keep 100% with no added platform fee and no waiting days for a platform to release
        your money.
      </>
    ),
  },
  {
    q: 'Are the e-signatures legally binding?',
    a: (
      <>
        Yes. They&apos;re ESIGN Act compliant, and each one captures IP address, timestamp, and a
        document hash for a full audit trail.
      </>
    ),
  },
  {
    q: 'Can I bring my existing clients?',
    a: <>Yes. Bulk-import from CSV or Excel with column mapping in one step.</>,
  },
  {
    q: 'What happens after the 5-day trial?',
    a: (
      <>
        You get full access for 5 days. After that you pick a plan to keep going. Nothing is
        deleted, it just locks until you upgrade.
      </>
    ),
  },
  {
    q: 'How does billing for my FileCurrent subscription work?',
    a: (
      <>
        Your subscription is billed securely through Paddle, our Merchant of Record. Paddle handles
        payment, tax, and your receipt. (This is separate from how your own clients pay you for
        invoices, which always goes directly to you.) Plans renew automatically until you cancel,
        and you can cancel anytime from Settings.
      </>
    ),
  },
  {
    q: 'Is there a refund policy?',
    a: (
      <>
        Yes. See our{' '}
        <Link href="/refund" className="font-medium text-[#635BFF] hover:underline">
          refund policy
        </Link>{' '}
        for the full details.
      </>
    ),
  },
]

export function FAQ() {
  return (
    <section id="faq" className="bg-white px-4 py-24">
      <div className="mx-auto max-w-2xl">
        <h2 className="mb-12 text-center text-3xl font-bold tracking-[-0.02em] text-[#0A2540] md:text-4xl">
          Questions, answered.
        </h2>

        <Accordion type="single" collapsible className="space-y-3">
          {ITEMS.map((item, i) => (
            <AccordionItem
              key={i}
              value={`faq-${i}`}
              className="rounded-xl border border-[#E6EBF1] bg-white px-5"
            >
              <AccordionTrigger className="py-5 text-left text-sm font-semibold text-[#0A2540] hover:no-underline">
                {item.q}
              </AccordionTrigger>
              <AccordionContent className="pb-5 text-sm leading-relaxed text-[#425466]">
                {item.a}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  )
}
