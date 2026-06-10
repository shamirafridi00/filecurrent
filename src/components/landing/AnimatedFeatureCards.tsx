'use client'
import { useEffect, useRef, useState } from 'react'

interface Feature {
  icon: React.ReactNode
  title: string
  desc: string
  stat?: string
}

function AnimatedCard({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) {
  const ref = useRef<HTMLDivElement>(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setVisible(true) },
      { threshold: 0.1 }
    )
    if (ref.current) observer.observe(ref.current)
    return () => observer.disconnect()
  }, [])

  return (
    <div
      ref={ref}
      className="h-full"
      style={{
        transitionDelay: `${delay}ms`,
        opacity: visible ? 1 : 0,
        transform: visible ? 'translateY(0)' : 'translateY(24px)',
        transition: 'opacity 0.5s ease, transform 0.5s ease',
      }}
    >
      {children}
    </div>
  )
}

export function AnimatedFeatureCards({ features }: { features: Feature[] }) {
  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
      {features.map((feature, i) => (
        <AnimatedCard key={i} delay={i * 120}>
          <div className="flex h-full flex-col rounded-xl border border-[#1A3A5C] bg-[#0A2540] p-6 transition-colors hover:border-[#635BFF]/50">
            <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-full bg-[#635BFF]/10">
              {feature.icon}
            </div>
            <h3 className="mb-2 text-lg font-semibold text-white">{feature.title}</h3>
            <p className="flex-1 text-sm leading-relaxed text-gray-400">{feature.desc}</p>
            {feature.stat && (
              <p className="mt-4 inline-flex items-center rounded-full border border-[#635BFF]/30 bg-[#635BFF]/10 px-3 py-1 text-xs font-medium text-[#A5B4FC]">
                {feature.stat}
              </p>
            )}
          </div>
        </AnimatedCard>
      ))}
    </div>
  )
}
