'use client'

import { useState } from 'react'
import { Trash } from '@phosphor-icons/react'
import { Button } from '@/components/ui/button'
import { ConfirmDialog } from '@/components/ui'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'

interface IntakeFormActionsProps {
  formId: string
  formTitle: string
}

export function IntakeFormActions({ formId, formTitle }: IntakeFormActionsProps) {
  const router = useRouter()
  const [confirmDelete, setConfirmDelete] = useState(false)
  const [deleting, setDeleting] = useState(false)

  async function handleDelete() {
    setDeleting(true)
    try {
      const res = await fetch(`/api/intake-forms/${formId}`, { method: 'DELETE' })
      if (!res.ok) throw new Error()
      toast.success('Form deleted')
      router.refresh()
    } catch {
      toast.error('Failed to delete form')
    } finally {
      setDeleting(false)
      setConfirmDelete(false)
    }
  }

  return (
    <>
      <Button variant="ghost" size="sm" onClick={() => setConfirmDelete(true)}>
        <Trash className="h-3.5 w-3.5 text-destructive" />
      </Button>
      <ConfirmDialog
        open={confirmDelete}
        title="Delete Form?"
        description={`"${formTitle}" and all its responses will be permanently deleted.`}
        confirmLabel={deleting ? 'Deleting...' : 'Delete'}
        cancelLabel="Cancel"
        variant="danger"
        onConfirm={handleDelete}
        onCancel={() => setConfirmDelete(false)}
      />
    </>
  )
}
