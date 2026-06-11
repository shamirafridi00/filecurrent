'use client'

import { APP_NAME } from '@/lib/constants'
import type { IntakeField } from '@/types'

interface Props {
  title: string
  description?: string | null
  fields: IntakeField[]
}

/**
 * Renders an intake form exactly as the client sees it at /intake/[token],
 * but read-only (inputs disabled). Used inside the builder's "Preview as Client"
 * modal so the freelancer understands the end result before sharing.
 * Visual structure mirrors IntakeSubmitForm.
 */
export function ClientFormPreview({ title, description, fields }: Props) {
  return (
    <div className="bg-neutral-50 rounded-lg overflow-hidden border border-border">
      {/* Public-page header */}
      <div className="border-b bg-white shadow-sm">
        <div className="flex items-center justify-between px-4 py-3">
          <p className="font-semibold text-gray-900 text-sm">{APP_NAME}</p>
          <p className="text-xs text-gray-500">Client Intake Form</p>
        </div>
      </div>

      <div className="px-4 py-6 max-h-[70vh] overflow-y-auto">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">{title || 'Untitled form'}</h1>
          {description && <p className="mt-2 text-gray-600">{description}</p>}
        </div>

        <div className="space-y-5 pointer-events-none select-none">
          {/* Always-present name + email */}
          <div className="rounded-lg border border-gray-200 bg-white p-5 shadow-sm space-y-4">
            <h2 className="text-sm font-semibold text-gray-700 uppercase tracking-wide">Your Details</h2>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Full Name <span className="text-red-500">*</span>
              </label>
              <input disabled placeholder="Your full name"
                className="w-full rounded-md border border-gray-200 px-3 py-2 text-sm text-gray-900 placeholder-gray-400 bg-gray-50" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
              <input disabled placeholder="your@email.com"
                className="w-full rounded-md border border-gray-200 px-3 py-2 text-sm text-gray-900 placeholder-gray-400 bg-gray-50" />
            </div>
          </div>

          {fields.length > 0 && (
            <div className="rounded-lg border border-gray-200 bg-white p-5 shadow-sm space-y-5">
              {fields.map((field) => <PreviewField key={field.id} field={field} />)}
            </div>
          )}

          <button disabled
            className="w-full rounded-md bg-indigo-600 px-4 py-3 text-sm font-semibold text-white opacity-90">
            Submit
          </button>
        </div>
      </div>
    </div>
  )
}

function PreviewField({ field }: { field: IntakeField }) {
  const inputClass = 'w-full rounded-md border border-gray-200 px-3 py-2 text-sm text-gray-900 placeholder-gray-400 bg-gray-50'

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
        <textarea disabled placeholder={field.placeholder} rows={4} className={inputClass} />
      )}

      {field.type === 'select' && (
        <select disabled className={inputClass}>
          <option>Select an option...</option>
        </select>
      )}

      {field.type === 'checkbox' && (
        <label className="flex items-center gap-2">
          <input type="checkbox" disabled className="h-4 w-4 rounded border-gray-300" />
          <span className="text-sm text-gray-700">{field.placeholder || 'Yes'}</span>
        </label>
      )}

      {['text', 'email', 'phone', 'number', 'date'].includes(field.type) && (
        <input disabled placeholder={field.placeholder} className={inputClass} />
      )}
    </div>
  )
}
