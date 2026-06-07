import type { Metadata } from 'next'
import { SpeedInsights } from '@vercel/speed-insights/next'
import { Toaster } from '@/components/ui/sonner'
import { APP_DESCRIPTION, APP_NAME } from '@/lib/constants'
import './globals.css'

export const metadata: Metadata = {
  title: APP_NAME,
  description: APP_DESCRIPTION,
  icons: {
    icon: [
      { url: '/favicon.svg?v=2', type: 'image/svg+xml' },
      { url: '/favicon.ico', sizes: 'any' },
    ],
    shortcut: '/favicon.svg?v=2',
    apple: '/favicon.svg?v=2',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body>
        {children}
        <Toaster />
        <SpeedInsights />
      </body>
    </html>
  )
}
