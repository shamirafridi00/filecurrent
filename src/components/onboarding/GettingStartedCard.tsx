'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { CheckCircle, Circle, X } from '@phosphor-icons/react'
import { Card, CardContent } from '@/components/ui/card'

const DISMISS_KEY = 'fc-getting-started-dismissed'

interface GettingStartedCardProps {
  hasClients: boolean
  hasContracts: boolean
  hasInvoices: boolean
}

export function GettingStartedCard({ hasClients, hasContracts, hasInvoices }: GettingStartedCardProps) {
  // Render nothing until mounted so localStorage state never mismatches SSR.
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    setVisible(localStorage.getItem(DISMISS_KEY) !== '1')
  }, [])

  if (!visible) return null

  const items = [
    { label: 'Add your first client', href: '/clients/new', done: hasClients },
    { label: 'Create a contract', href: '/contracts/new', done: hasContracts },
    { label: 'Send an invoice', href: '/invoices/new', done: hasInvoices },
    { label: 'Set up payment reminders', href: '/reminders/settings', done: false },
  ]

  return (
    <Card className="border-primary/30 bg-accent/40">
      <CardContent className="relative p-5">
        <button
          type="button"
          onClick={() => {
            localStorage.setItem(DISMISS_KEY, '1')
            setVisible(false)
          }}
          className="absolute right-3 top-3 text-muted-foreground transition-colors hover:text-foreground"
          aria-label="Dismiss getting started checklist"
        >
          <X size={16} />
        </button>
        <p className="font-semibold text-foreground">Welcome to FileCurrent — here&apos;s how to get started:</p>
        <ul className="mt-3 space-y-2">
          {items.map((item) => (
            <li key={item.href}>
              <Link
                href={item.href}
                className="group inline-flex items-center gap-2 text-sm text-foreground transition-colors hover:text-primary"
              >
                {item.done ? (
                  <CheckCircle size={18} weight="fill" className="shrink-0 text-[#1DB954]" />
                ) : (
                  <Circle size={18} className="shrink-0 text-muted-foreground group-hover:text-primary" />
                )}
                <span className={item.done ? 'text-muted-foreground line-through' : ''}>{item.label}</span>
                {!item.done && <span className="text-xs text-primary opacity-0 transition-opacity group-hover:opacity-100">→</span>}
              </Link>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  )
}
