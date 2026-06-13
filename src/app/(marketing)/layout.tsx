import { NavBar } from '@/components/landing/NavBar'
import { Footer } from '@/components/landing/LandingContent'

export default function MarketingLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col bg-white text-foreground">
      <NavBar />
      <div className="flex-1">{children}</div>
      <Footer />
    </div>
  )
}
