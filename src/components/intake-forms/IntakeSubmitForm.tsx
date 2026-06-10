'use client'

import { useState } from 'react'
import type { IntakeForm, IntakeField } from '@/types'

interface IntakeSubmitFormProps {
  form: IntakeForm
  token: string
}

type Answers = Record<string, string | boolean>

export function IntakeSubmitForm({ form, token }: IntakeSubmitFormProps) {
  const [answers, setAnswers] = useState<Answers>({})
  const [respondentName, setRespondentName] = useState('')
  const [respondentEmail, setRespondentEmail] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})

  function setAnswer(fieldId: string, value: string | boolean) {
    setAnswers((prev) => ({ ...prev, [fieldId]: value }))
    if (errors[fieldId]) setErrors((prev) => { const next = { ...prev }; delete next[fieldId]; return next })
  }

  function validate(): boolean {
    const newErrors: Record<string, string> = {}
    if (!respondentName.trim()) newErrors._name = 'Your name is required'
    for (const field of form.fields) {
      if (field.type === 'heading') continue
      if (field.required) {
        const val = answers[field.id]
        if (val === undefined || val === '' || val === false) {
          newErrors[field.id] = `${field.label} is required`
        }
      }
    }
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!validate()) return
    setSubmitting(true)
    try {
      const res = await fetch(`/api/intake/${token}/submit`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          respondentName,
          respondentEmail,
          answers,
          createClient: true,
        }),
      })
      if (!res.ok) {
        const body = await res.json().catch(() => ({}))
        throw new Error(body.error ?? 'Submission failed')
      }
      setSubmitted(true)
    } catch (err) {
      setErrors({ _submit: err instanceof Error ? err.message : 'Failed to submit. Please try again.' })
    } finally {
      setSubmitting(false)
    }
  }

  if (submitted) {
    return (
      <div className="rounded-lg border border-green-200 bg-green-50 p-8 text-center">
        <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
          <svg className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h2 className="text-lg font-semibold text-gray-900">Thank you!</h2>
        <p className="mt-2 text-gray-600">Your information has been submitted successfully.</p>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {/* Always-present name + email */}
      <div className="rounded-lg border border-gray-200 bg-white p-5 shadow-sm space-y-4">
        <h2 className="text-sm font-semibold text-gray-700 uppercase tracking-wide">Your Details</h2>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Full Name <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={respondentName}
            onChange={(e) => {
              setRespondentName(e.target.value)
              if (errors._name) setErrors((p) => { const n = { ...p }; delete n._name; return n })
            }}
            autoComplete="off"
            placeholder="Your full name"
            className="w-full rounded-md border border-gray-200 px-3 py-2 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          {errors._name && <p className="mt-1 text-xs text-red-600">{errors._name}</p>}
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
          <input
            type="email"
            value={respondentEmail}
            onChange={(e) => setRespondentEmail(e.target.value)}
            autoComplete="off"
            placeholder="your@email.com"
            className="w-full rounded-md border border-gray-200 px-3 py-2 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>
      </div>

      {/* Dynamic fields */}
      {form.fields.length > 0 && (
        <div className="rounded-lg border border-gray-200 bg-white p-5 shadow-sm space-y-5">
          {form.fields.map((field) => (
            <IntakeFieldInput
              key={field.id}
              field={field}
              value={answers[field.id]}
              onChange={(val) => setAnswer(field.id, val)}
              error={errors[field.id]}
            />
          ))}
        </div>
      )}

      {errors._submit && (
        <p className="rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{errors._submit}</p>
      )}

      <button
        type="submit"
        disabled={submitting}
        className="w-full rounded-md bg-indigo-600 px-4 py-3 text-sm font-semibold text-white hover:bg-indigo-700 disabled:opacity-60 transition-colors"
      >
        {submitting ? 'Submitting...' : 'Submit'}
      </button>
    </form>
  )
}

function IntakeFieldInput({
  field,
  value,
  onChange,
  error,
}: {
  field: IntakeField
  value: string | boolean | undefined
  onChange: (val: string | boolean) => void
  error?: string
}) {
  const inputClass = 'w-full rounded-md border border-gray-200 px-3 py-2 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500'

  if (field.type === 'heading') {
    return (
      <div className="pt-2">
        <h3 className="text-sm font-semibold text-gray-800 uppercase tracking-wide border-b border-gray-100 pb-2">{field.label}</h3>
      </div>
    )
  }

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">
        {field.label}
        {field.required && <span className="text-red-500 ml-0.5">*</span>}
      </label>
      {field.helpText && <p className="text-xs text-gray-500 mb-1">{field.helpText}</p>}

      {field.type === 'textarea' && (
        <textarea
          value={typeof value === 'string' ? value : ''}
          onChange={(e) => onChange(e.target.value)}
          placeholder={field.placeholder}
          rows={4}
          className={inputClass}
        />
      )}

      {field.type === 'select' && (
        <select
          value={typeof value === 'string' ? value : ''}
          onChange={(e) => onChange(e.target.value)}
          className={inputClass}
        >
          <option value="">Select an option...</option>
          {field.options?.map((opt) => (
            <option key={opt} value={opt}>{opt}</option>
          ))}
        </select>
      )}

      {field.type === 'checkbox' && (
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={typeof value === 'boolean' ? value : false}
            onChange={(e) => onChange(e.target.checked)}
            className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
          />
          <span className="text-sm text-gray-700">{field.placeholder || 'Yes'}</span>
        </label>
      )}

      {['text', 'email', 'phone', 'number', 'date'].includes(field.type) && (
        <input
          type={field.type === 'phone' ? 'tel' : field.type}
          value={typeof value === 'string' ? value : ''}
          onChange={(e) => onChange(e.target.value)}
          placeholder={field.placeholder}
          autoComplete="off"
          className={inputClass}
          onWheel={field.type === 'number' ? (e) => e.currentTarget.blur() : undefined}
        />
      )}

      {error && <p className="mt-1 text-xs text-red-600">{error}</p>}
    </div>
  )
}
