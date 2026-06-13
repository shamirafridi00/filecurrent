'use client'

import { motion, useReducedMotion, type Variants } from 'framer-motion'
import type { ReactNode } from 'react'

/* Shared Framer Motion primitives for the marketing surface.
   Everything respects prefers-reduced-motion. */

const EASE = [0.22, 1, 0.36, 1] as const

export const fadeUp: Variants = {
  hidden: { opacity: 0, y: 28 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: EASE } },
}

export const fadeIn: Variants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { duration: 0.6, ease: EASE } },
}

export const scaleIn: Variants = {
  hidden: { opacity: 0, scale: 0.94 },
  show: { opacity: 1, scale: 1, transition: { duration: 0.55, ease: EASE } },
}

/** Reveals children on scroll-into-view with a single fade-up. */
export function Reveal({
  children,
  delay = 0,
  className,
  variant = fadeUp,
}: {
  children: ReactNode
  delay?: number
  className?: string
  variant?: Variants
}) {
  const reduce = useReducedMotion()
  return (
    <motion.div
      className={className}
      variants={reduce ? fadeIn : variant}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: '-80px' }}
      transition={{ delay }}
    >
      {children}
    </motion.div>
  )
}

/** Wraps a group whose direct children should stagger in. Pair with <Item>. */
export function Stagger({
  children,
  className,
  gap = 0.1,
}: {
  children: ReactNode
  className?: string
  gap?: number
}) {
  return (
    <motion.div
      className={className}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: '-80px' }}
      variants={{ show: { transition: { staggerChildren: gap } } }}
    >
      {children}
    </motion.div>
  )
}

export function Item({
  children,
  className,
  variant = fadeUp,
}: {
  children: ReactNode
  className?: string
  variant?: Variants
}) {
  const reduce = useReducedMotion()
  return (
    <motion.div className={className} variants={reduce ? fadeIn : variant}>
      {children}
    </motion.div>
  )
}

export { motion }
