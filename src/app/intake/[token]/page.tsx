export const dynamic = 'force-dynamic'
import { notFound } from 'next/navigation'
import { getIntakeFormByToken } from '@/lib/db/supabase'
import { APP_NAME } from '@/lib/constants'
import { IntakeSubmitForm } from '@/components/intake-forms/IntakeSubmitForm'

export default async function PublicIntakeFormPage({ params }: { params: { token: string } }) {
  const form = await getIntakeFormByToken(params.token)
  if (!form) notFound()

  return (
    <div className="min-h-screen bg-neutral-50">
      <header className="border-b bg-white shadow-sm">
        <div className="mx-auto flex max-w-2xl items-center justify-between px-4 py-4">
          <p className="font-semibold text-gray-900 text-sm">{APP_NAME}</p>
          <p className="text-xs text-gray-500">Client Intake Form</p>
        </div>
      </header>

      <main className="mx-auto max-w-2xl px-4 py-8">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">{form.title}</h1>
          {form.description && (
            <p className="mt-2 text-gray-600">{form.description}</p>
          )}
        </div>

        <IntakeSubmitForm form={form} token={params.token} />

        <p className="mt-8 text-center text-xs text-gray-400">
          Powered by <a href="https://filecurrent.com" className="hover:underline">{APP_NAME}</a>
        </p>
      </main>
    </div>
  )
}
