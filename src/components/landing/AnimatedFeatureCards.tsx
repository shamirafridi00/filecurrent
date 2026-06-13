'use client'

import { motion, useReducedMotion } from 'framer-motion'

interface Feature {
  icon: React.ReactNode
  title: string
  desc: string
  stat?: string
}

const EASE = [0.22, 1, 0.36, 1] as const

export function AnimatedFeatureCards({ features }: { features: Feature[] }) {
  const reduce = useReducedMotion()

  return (
    <motion.div
      className="grid grid-cols-1 gap-5 md:grid-cols-3"
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: '-80px' }}
      variants={{ show: { transition: { staggerChildren: 0.12 } } }}
    >
      {features.map((feature, i) => (
        <motion.div
          key={i}
          variants={{
            hidden: { opacity: 0, y: reduce ? 0 : 28 },
            show: { opacity: 1, y: 0, transition: { duration: 0.55, ease: EASE } },
          }}
          whileHover={reduce ? undefined : { y: -4 }}
          className="card-elevated-hover group flex h-full flex-col rounded-2xl border border-border bg-card p-6"
        >
          <div className="mb-5 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-accent transition-transform duration-300 group-hover:scale-110">
            {feature.icon}
          </div>
          <h3 className="mb-2 text-lg font-semibold tracking-tight text-foreground">
            {feature.title}
          </h3>
          <p className="flex-1 text-sm leading-relaxed text-muted-foreground">{feature.desc}</p>
          {feature.stat && (
            <p className="mt-5 inline-flex w-fit items-center rounded-full border border-primary/20 bg-accent px-3 py-1 text-xs font-medium text-primary">
              {feature.stat}
            </p>
          )}
        </motion.div>
      ))}
    </motion.div>
  )
}
