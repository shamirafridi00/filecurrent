'use client'

import { useEffect, useState } from 'react'
import { Sparkle } from '@phosphor-icons/react'
import { driver, type DriveStep } from 'driver.js'
import 'driver.js/dist/driver.css'

export interface TourStep {
  /** CSS selector of the element to spotlight; omit for a centered intro card */
  element?: string
  title: string
  description: string
}

interface Props {
  /** Unique key — remembers per browser whether the tour was completed */
  tourId: string
  steps: TourStep[]
  /** Start automatically on the user's first visit to this page */
  autoStartOnFirstVisit?: boolean
}

const SEEN_PREFIX = 'filecurrent_tour_'

/**
 * Animated feature walkthrough built on driver.js (industry-standard product
 * tour library — smooth spotlight transitions between elements, ~5kB). Renders
 * a "Tour" button; steps highlight real UI elements with an animated cutout
 * and explain the feature in place.
 */
export function FeatureTour({ tourId, steps, autoStartOnFirstVisit = true }: Props) {
  const [mounted, setMounted] = useState(false)

  const start = () => {
    const present: DriveStep[] = steps
      .filter((s) => !s.element || document.querySelector(s.element))
      .map((s) => ({
        element: s.element,
        popover: { title: s.title, description: s.description },
      }))
    if (present.length === 0) return

    const tour = driver({
      showProgress: true,
      progressText: '{{current}} of {{total}}',
      nextBtnText: 'Next →',
      prevBtnText: '← Back',
      doneBtnText: 'Got it ✓',
      animate: true,
      smoothScroll: true,
      stagePadding: 6,
      stageRadius: 10,
      overlayOpacity: 0.55,
      popoverClass: 'fc-tour',
      steps: present,
      onDestroyed: () => {
        try { localStorage.setItem(SEEN_PREFIX + tourId, '1') } catch { /* ignore */ }
      },
    })
    tour.drive()
  }

  useEffect(() => {
    setMounted(true)
    if (!autoStartOnFirstVisit) return
    let seen = '1'
    try { seen = localStorage.getItem(SEEN_PREFIX + tourId) ?? '' } catch { /* ignore */ }
    if (!seen) {
      // Give the page a beat to settle before spotlighting elements
      const t = setTimeout(start, 800)
      return () => clearTimeout(t)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tourId])

  if (!mounted) return null

  return (
    <button
      type="button"
      onClick={start}
      className="inline-flex items-center gap-1.5 rounded-md border border-border px-2.5 py-1.5 text-xs font-medium text-muted-foreground transition-colors hover:border-primary/50 hover:text-primary"
      title="Take a quick tour of this page"
    >
      <Sparkle size={13} weight="duotone" />
      Tour
    </button>
  )
}
