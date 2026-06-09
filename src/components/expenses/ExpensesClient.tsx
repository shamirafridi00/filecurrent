'use client'

import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { CurrencyDollar, Plus, PencilSimple, Trash } from '@phosphor-icons/react'
import { StatCard, PageHeader, EmptyState, ConfirmDialog } from '@/components/ui'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { toast } from 'sonner'
import { formatCurrency, formatDate, cn } from '@/lib/utils'
import { EXPENSE_CATEGORIES } from '@/types'
import type { ExpenseRow } from '@/lib/db/supabase'

const CATEGORY_COLORS: Record<string, string> = {
  software: 'bg-blue-50 text-blue-700 border-blue-200',
  hardware: 'bg-indigo-50 text-indigo-700 border-indigo-200',
  travel: 'bg-amber-50 text-amber-700 border-amber-200',
  meals: 'bg-orange-50 text-orange-700 border-orange-200',
  marketing: 'bg-purple-50 text-purple-700 border-purple-200',
  office: 'bg-teal-50 text-teal-700 border-teal-200',
  professional_services: 'bg-cyan-50 text-cyan-700 border-cyan-200',
  education: 'bg-green-50 text-green-700 border-green-200',
  utilities: 'bg-slate-50 text-slate-600 border-slate-200',
  other: 'bg-muted text-muted-foreground border-border',
}

function getCategoryLabel(value: string): string {
  return EXPENSE_CATEGORIES.find((c) => c.value === value)?.label ?? value
}

interface ExpenseSummary {
  totalExpenses: number
  byCategory: { category: string; total: number }[]
  byMonth: { month: string; total: number }[]
}

interface ExpensesClientProps {
  expenses: ExpenseRow[]
  summary: ExpenseSummary
}

interface FormState {
  date: string
  description: string
  amount: string
  category: string
  notes: string
}

const BLANK_FORM: FormState = {
  date: new Date().toISOString().slice(0, 10),
  description: '',
  amount: '',
  category: 'other',
  notes: '',
}

function ExpenseForm({
  initial,
  onSave,
  onCancel,
  isSubmitting,
}: {
  initial: FormState
  onSave: (data: FormState) => void
  onCancel: () => void
  isSubmitting: boolean
}) {
  const [form, setForm] = useState<FormState>(initial)

  function set(field: keyof FormState, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }))
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!form.date || !form.description || !form.amount || !form.category) {
      toast.error('Please fill in all required fields')
      return
    }
    if (Number(form.amount) <= 0) {
      toast.error('Amount must be greater than 0')
      return
    }
    onSave(form)
  }

  return (
    <Card className="mb-6">
      <CardHeader className="pb-3">
        <CardTitle className="text-base">
          {initial.description ? 'Edit Expense' : 'Add Expense'}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label htmlFor="expense-date">Date *</Label>
              <Input
                id="expense-date"
                type="date"
                value={form.date}
                onChange={(e) => set('date', e.target.value)}
                required
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="expense-amount">Amount *</Label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">$</span>
                <Input
                  id="expense-amount"
                  type="number"
                  step="0.01"
                  min="0.01"
                  placeholder="0.00"
                  value={form.amount}
                  onChange={(e) => set('amount', e.target.value)}
                  onWheel={(e) => e.currentTarget.blur()}
                  className="pl-7"
                  required
                />
              </div>
            </div>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="expense-description">Description *</Label>
            <Input
              id="expense-description"
              type="text"
              autoComplete="off"
              placeholder="e.g. Adobe Creative Cloud subscription"
              value={form.description}
              onChange={(e) => set('description', e.target.value)}
              required
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="expense-category">Category *</Label>
            <Select value={form.category} onValueChange={(v) => set('category', v)}>
              <SelectTrigger id="expense-category">
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                {EXPENSE_CATEGORIES.map((cat) => (
                  <SelectItem key={cat.value} value={cat.value}>
                    {cat.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="expense-notes">Notes</Label>
            <Textarea
              id="expense-notes"
              placeholder="Optional notes..."
              value={form.notes}
              onChange={(e) => set('notes', e.target.value)}
              rows={2}
            />
          </div>

          <div className="flex items-center gap-2 pt-1">
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Saving...' : 'Save Expense'}
            </Button>
            <Button type="button" variant="outline" onClick={onCancel}>
              Cancel
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}

const CURRENT_YEAR = new Date().getFullYear()
const YEAR_OPTIONS = [CURRENT_YEAR, CURRENT_YEAR - 1, CURRENT_YEAR - 2]

export function ExpensesClient({ expenses: initialExpenses, summary: initialSummary }: ExpensesClientProps) {
  const searchParams = useSearchParams()
  const router = useRouter()

  const [expenses, setExpenses] = useState<ExpenseRow[]>(initialExpenses)
  const [summary, setSummary] = useState<ExpenseSummary>(initialSummary)
  const [showForm, setShowForm] = useState(false)
  const [editingExpense, setEditingExpense] = useState<ExpenseRow | null>(null)
  const [filterCategory, setFilterCategory] = useState(searchParams.get('cat') ?? '')
  const [filterYear, setFilterYear] = useState(
    searchParams.get('year') ? Number(searchParams.get('year')) : CURRENT_YEAR
  )
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null)

  useEffect(() => {
    const params = new URLSearchParams()
    if (filterYear !== CURRENT_YEAR) params.set('year', String(filterYear))
    if (filterCategory) params.set('cat', filterCategory)
    const qs = params.toString()
    router.replace(qs ? `/expenses?${qs}` : '/expenses', { scroll: false })
  }, [filterYear, filterCategory, router])

  const topCategory = summary.byCategory[0]
    ? getCategoryLabel(summary.byCategory[0].category)
    : '—'

  const monthlyAverage = summary.byMonth.length > 0
    ? summary.totalExpenses / summary.byMonth.length
    : 0

  const filteredExpenses = expenses.filter((e) => {
    const yearMatch = e.date.startsWith(String(filterYear))
    const catMatch = filterCategory === '' || e.category === filterCategory
    return yearMatch && catMatch
  })

  const activeCategoriesInYear = Array.from(
    new Set(expenses.filter((e) => e.date.startsWith(String(filterYear))).map((e) => e.category))
  )

  async function reloadSummary() {
    try {
      const res = await fetch('/api/expenses')
      if (!res.ok) return
      const data: ExpenseRow[] = await res.json()
      setExpenses(data)

      const year = filterYear
      const yearExpenses = data.filter((e) => e.date.startsWith(String(year)))
      const total = yearExpenses.reduce((s, e) => s + e.amount, 0)
      const catMap: Record<string, number> = {}
      const monthMap: Record<string, number> = {}
      for (const e of yearExpenses) {
        catMap[e.category] = (catMap[e.category] ?? 0) + e.amount
        const month = e.date.slice(0, 7)
        monthMap[month] = (monthMap[month] ?? 0) + e.amount
      }
      setSummary({
        totalExpenses: total,
        byCategory: Object.entries(catMap).map(([category, t]) => ({ category, total: t })).sort((a, b) => b.total - a.total),
        byMonth: Object.entries(monthMap).map(([month, t]) => ({ month, total: t })).sort((a, b) => a.month.localeCompare(b.month)),
      })
    } catch {
      // ignore
    }
  }

  async function handleSave(form: FormState) {
    setIsSubmitting(true)
    try {
      if (editingExpense) {
        const res = await fetch(`/api/expenses/${editingExpense.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            date: form.date,
            description: form.description,
            amount: Number(form.amount),
            category: form.category,
            notes: form.notes || undefined,
          }),
        })
        if (!res.ok) throw new Error('Failed to update')
        setExpenses((prev) =>
          prev.map((e) =>
            e.id === editingExpense.id
              ? {
                  ...e,
                  date: form.date,
                  description: form.description,
                  amount: Number(form.amount),
                  category: form.category,
                  notes: form.notes || null,
                }
              : e
          )
        )
        toast.success('Expense updated')
        setEditingExpense(null)
        setShowForm(false)
        await reloadSummary()
      } else {
        const res = await fetch('/api/expenses', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            date: form.date,
            description: form.description,
            amount: Number(form.amount),
            category: form.category,
            notes: form.notes || undefined,
          }),
        })
        if (!res.ok) throw new Error('Failed to create')
        toast.success('Expense added')
        setShowForm(false)
        await reloadSummary()
      }
    } catch {
      toast.error('Something went wrong. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  async function handleDelete(id: string) {
    setDeletingId(id)
    try {
      const res = await fetch(`/api/expenses/${id}`, { method: 'DELETE' })
      if (!res.ok) throw new Error('Failed to delete')
      setExpenses((prev) => prev.filter((e) => e.id !== id))
      toast.success('Expense deleted')
      await reloadSummary()
    } catch {
      toast.error('Failed to delete expense')
    } finally {
      setDeletingId(null)
      setConfirmDeleteId(null)
    }
  }

  function startEdit(expense: ExpenseRow) {
    setEditingExpense(expense)
    setShowForm(true)
  }

  function cancelForm() {
    setShowForm(false)
    setEditingExpense(null)
  }

  const formInitial: FormState = editingExpense
    ? {
        date: editingExpense.date,
        description: editingExpense.description,
        amount: String(editingExpense.amount),
        category: editingExpense.category,
        notes: editingExpense.notes ?? '',
      }
    : BLANK_FORM

  return (
    <div>
      <PageHeader
        title="Expenses"
        subtitle="Track your business expenses for tax time"
        icon={<CurrencyDollar size={24} weight="duotone" className="text-primary" />}
        action={
          !showForm ? (
            <Button onClick={() => { setShowForm(true); setEditingExpense(null) }}>
              <Plus className="mr-1.5 h-4 w-4" />
              Add Expense
            </Button>
          ) : undefined
        }
      />

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <StatCard
          label="Total This Year"
          value={formatCurrency(summary.totalExpenses)}
          accent="border-l-destructive"
          valueColor="text-destructive"
        />
        <StatCard
          label="Largest Category"
          value={topCategory}
          accent="border-l-[#635BFF]"
        />
        <StatCard
          label="Monthly Average"
          value={formatCurrency(monthlyAverage)}
          accent="border-l-[#8898AA]"
        />
      </div>

      {showForm && (
        <ExpenseForm
          initial={formInitial}
          onSave={handleSave}
          onCancel={cancelForm}
          isSubmitting={isSubmitting}
        />
      )}

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-3 mb-4">
        <div className="flex items-center gap-2">
          <Select
            value={String(filterYear)}
            onValueChange={(v) => setFilterYear(Number(v))}
          >
            <SelectTrigger className="w-28 h-8 text-sm">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {YEAR_OPTIONS.map((y) => (
                <SelectItem key={y} value={String(y)}>{y}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="flex flex-wrap gap-1.5">
          <button
            onClick={() => setFilterCategory('')}
            className={cn(
              'rounded-full border px-3 py-1 text-xs font-medium transition-colors duration-150',
              filterCategory === ''
                ? 'bg-primary text-primary-foreground border-primary'
                : 'border-border hover:bg-muted/30 text-foreground'
            )}
          >
            All
          </button>
          {activeCategoriesInYear.map((cat) => (
            <button
              key={cat}
              onClick={() => setFilterCategory(cat === filterCategory ? '' : cat)}
              className={cn(
                'rounded-full border px-3 py-1 text-xs font-medium transition-colors duration-150',
                filterCategory === cat
                  ? 'bg-primary text-primary-foreground border-primary'
                  : 'border-border hover:bg-muted/30 text-foreground'
              )}
            >
              {getCategoryLabel(cat)}
            </button>
          ))}
        </div>
      </div>

      {/* Expense list */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
          <CardTitle className="flex items-center gap-2 text-base">
            <CurrencyDollar size={16} />
            {filteredExpenses.length} Expense{filteredExpenses.length !== 1 ? 's' : ''}
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          {filteredExpenses.length === 0 ? (
            <div className="px-6 pb-6">
              <EmptyState
                icon={<CurrencyDollar size={40} weight="duotone" className="text-muted-foreground" />}
                title="No expenses yet"
                description="Add your first business expense to start tracking."
                action={
                  !showForm ? (
                    <Button onClick={() => { setShowForm(true); setEditingExpense(null) }}>
                      <Plus className="mr-1.5 h-4 w-4" />
                      Add Expense
                    </Button>
                  ) : undefined
                }
              />
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left px-6 py-3 text-xs font-semibold uppercase tracking-wide text-muted-foreground">Date</th>
                    <th className="text-left px-6 py-3 text-xs font-semibold uppercase tracking-wide text-muted-foreground">Description</th>
                    <th className="text-left px-6 py-3 text-xs font-semibold uppercase tracking-wide text-muted-foreground hidden sm:table-cell">Category</th>
                    <th className="text-right px-6 py-3 text-xs font-semibold uppercase tracking-wide text-muted-foreground">Amount</th>
                    <th className="px-6 py-3 text-xs font-semibold uppercase tracking-wide text-muted-foreground w-20"></th>
                  </tr>
                </thead>
                <tbody>
                  {filteredExpenses.map((expense) => (
                    <tr
                      key={expense.id}
                      className="border-b border-border/50 hover:bg-muted/30 transition-colors"
                    >
                      <td className="px-6 py-3 text-sm text-muted-foreground whitespace-nowrap">
                        {formatDate(expense.date)}
                      </td>
                      <td className="px-6 py-3">
                        <p className="text-sm text-foreground font-medium">{expense.description}</p>
                        {expense.notes && (
                          <p className="text-xs text-muted-foreground mt-0.5">{expense.notes}</p>
                        )}
                        <div className="sm:hidden mt-1">
                          <Badge
                            variant="secondary"
                            className={cn('text-xs border', CATEGORY_COLORS[expense.category] ?? CATEGORY_COLORS.other)}
                          >
                            {getCategoryLabel(expense.category)}
                          </Badge>
                        </div>
                      </td>
                      <td className="px-6 py-3 hidden sm:table-cell">
                        <Badge
                          variant="secondary"
                          className={cn('text-xs border', CATEGORY_COLORS[expense.category] ?? CATEGORY_COLORS.other)}
                        >
                          {getCategoryLabel(expense.category)}
                        </Badge>
                      </td>
                      <td className="px-6 py-3 text-right text-sm font-semibold text-destructive whitespace-nowrap">
                        {formatCurrency(expense.amount)}
                      </td>
                      <td className="px-6 py-3">
                        <div className="flex items-center justify-end gap-1">
                          <button
                            onClick={() => startEdit(expense)}
                            className="flex h-7 w-7 items-center justify-center rounded-md text-muted-foreground hover:bg-muted/50 hover:text-foreground transition-colors duration-150"
                            aria-label="Edit expense"
                          >
                            <PencilSimple size={14} />
                          </button>
                          <button
                            onClick={() => setConfirmDeleteId(expense.id)}
                            disabled={deletingId === expense.id}
                            className="flex h-7 w-7 items-center justify-center rounded-md text-muted-foreground hover:bg-destructive/10 hover:text-destructive transition-colors duration-150 disabled:opacity-50"
                            aria-label="Delete expense"
                          >
                            <Trash size={14} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>

      <ConfirmDialog
        open={confirmDeleteId !== null}
        title="Delete Expense"
        description="Are you sure you want to delete this expense? This action cannot be undone."
        confirmLabel={deletingId ? 'Deleting...' : 'Delete'}
        cancelLabel="Cancel"
        variant="danger"
        onConfirm={() => confirmDeleteId && handleDelete(confirmDeleteId)}
        onCancel={() => setConfirmDeleteId(null)}
      />
    </div>
  )
}
