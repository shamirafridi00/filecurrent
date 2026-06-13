import type { Metadata } from 'next'
import { APP_NAME } from '@/lib/constants'
import { LandingContent } from '@/components/landing/LandingContent'

export const metadata: Metadata = {
  title: 'FileCurrent: Freelance Contract & Invoice Software for US Freelancers',
  description: 'Create professional freelance contracts, invoices, and e-signatures. Automated payment reminders with no daily cap. Simpler than HoneyBook and Bonsai. Start with a 5-day free trial, no card required.',
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
    title: 'FileCurrent: Freelance Contracts, Invoices & E-Signatures',
    description: 'The freelance document tool that does exactly what you need and nothing you don’t. $15/month. Start free for 5 days, no card required.',
    url: 'https://filecurrent.com',
    siteName: APP_NAME,
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'FileCurrent: Freelance Contracts & Invoices',
    description: 'Simpler than HoneyBook. Leaner than Bonsai. $15/month with a 5-day free trial.',
  },
  alternates: { canonical: 'https://filecurrent.com' },
  icons: {
    icon: [
      { url: '/favicon.svg?v=3', type: 'image/svg+xml' },
      { url: '/favicon.ico?v=3', sizes: '16x16 32x32 48x48' },
    ],
    shortcut: '/favicon.ico?v=3',
    apple: '/apple-touch-icon.png?v=3',
  },
}

export default function LandingPage() {
  return <LandingContent />
}
