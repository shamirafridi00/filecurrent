'use client'
import { useEffect, useRef, useState } from 'react'

interface Feature {
  icon: React.ReactNode
  title: string
  desc: string
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
    <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
      {features.map((feature, i) => (
        <AnimatedCard key={i} delay={i * 120}>
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-white/10 mb-4">
              {feature.icon}
            </div>
            <h3 className="font-semibold text-lg mb-2 text-white">{feature.title}</h3>
            <p className="text-gray-400 text-sm leading-relaxed">{feature.desc}</p>
          </div>
        </AnimatedCard>
      ))}
    </div>
  )
}
