import type { Metadata } from 'next'
import { APP_NAME } from '@/lib/constants'
import { NavBar } from '@/components/landing/NavBar'
import { Footer } from '@/components/landing/LandingContent'
import { Hero } from '@/components/landing/Hero'
import { ProblemSection } from '@/components/landing/ProblemSection'
import { HowItWorks } from '@/components/landing/HowItWorks'
import { NoCutSection } from '@/components/landing/NoCutSection'
import { FeatureBento } from '@/components/landing/FeatureBento'
import { ComparisonTable } from '@/components/landing/ComparisonTable'
import { WhyFileCurrent } from '@/components/landing/WhyFileCurrent'
import { Pricing } from '@/components/landing/Pricing'
import { FAQ } from '@/components/landing/FAQ'
import { FinalCTA } from '@/components/landing/FinalCTA'

export const metadata: Metadata = {
  title: 'FileCurrent: Get Paid, Keep 100%, for $15/month',
  description:
    'FileCurrent runs your whole freelance client trail: proposals, signed contracts, invoices, and automatic reminders. No payment cut, no per-seat fees. Just $15/month with a 5-day free trial.',
  keywords: [
    'freelance contract software',
    'freelance invoice software',
    'honeybook alternative',
    'bonsai alternative',
    'e-signature for freelancers',
    'freelance invoice generator',
  ],
  openGraph: {
    title: 'FileCurrent: Get Paid, Keep 100%, for $15/month',
    description:
      'Proposals, signed contracts, invoices, and automatic reminders for US freelancers. No payment cut. Start free for 5 days.',
    url: 'https://filecurrent.com',
    siteName: APP_NAME,
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'FileCurrent: Get Paid, Keep 100%',
    description: 'The freelance document trail that never takes a cut of your money. $15/month.',
  },
  alternates: { canonical: 'https://filecurrent.com' },
}

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white text-[#0A2540]">
      <NavBar />
      <Hero />
      <ProblemSection />
      <HowItWorks />
      <NoCutSection />
      <FeatureBento />
      <ComparisonTable />
      <WhyFileCurrent />
      <Pricing />
      <FAQ />
      <FinalCTA />
      <Footer />
    </div>
  )
}
