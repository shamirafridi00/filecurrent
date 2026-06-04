import type { Metadata } from 'next'
import { APP_NAME } from '@/lib/constants'
import { LandingContent } from '@/components/landing/LandingContent'

export const metadata: Metadata = {
  title: 'FileCurrent — Freelance Contract & Invoice Software | $9/month',
  description: 'Create professional freelance contracts, invoices, and e-signatures. Automated payment reminders with no daily cap. Cheaper than HoneyBook and Bonsai. Free plan available.',
  keywords: [
    'freelance contract software',
    'freelance invoice software',
    'honeybook alternative',
    'bonsai alternative',
    'freelance contract generator',
    'e-signature for freelancers',
    'freelance invoice generator',
  ],
  openGraph: {
    title: 'FileCurrent — Freelance Contracts, Invoices & E-Signatures',
    description: "The freelance document tool that does exactly what you need and nothing you don't. $9/month or free forever.",
    url: 'https://filecurrent.com',
    siteName: APP_NAME,
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'FileCurrent — Freelance Contracts & Invoices',
    description: 'Cheaper than HoneyBook. Simpler than Bonsai. $9/month.',
  },
  alternates: { canonical: 'https://filecurrent.com' },
  icons: { icon: '/favicon.svg', shortcut: '/favicon.svg', apple: '/favicon.svg' },
}

export default function LandingPage() {
  return <LandingContent />
}
