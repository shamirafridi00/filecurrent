import { NavBar } from '@/components/landing/NavBar'

export default function MarketingLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-[#0A2540] text-gray-100">
      <NavBar />
      {children}
    </div>
  )
}
