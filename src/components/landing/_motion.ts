import type { Variants } from 'framer-motion'

// Shared Framer Motion variants for the landing sections.
// Components using these must be Client Components ('use client') and should
// honor useReducedMotion() by rendering static when reduced motion is set.

export const fadeUp: Variants = {
  hidden: { opacity: 0, y: 24 },
  show: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, delay: i * 0.12, ease: [0.22, 1, 0.36, 1] },
  }),
}

export const heroRise: Variants = {
  hidden: { opacity: 0, y: 28 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } },
}

// Shared scroll-reveal viewport config: trigger once, slightly before fully in view.
export const REVEAL_VIEWPORT = { once: true, margin: '-80px' } as const
