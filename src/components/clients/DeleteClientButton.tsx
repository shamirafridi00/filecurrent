'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel,
  AlertDialogContent, AlertDialogDescription, AlertDialogFooter,
  AlertDialogHeader, AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { toast } from 'sonner'

export function DeleteClientButton({ clientId, clientName }: { clientId: string; clientName: string }) {
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const [deleting, setDeleting] = useState(false)

  const handleDelete = async () => {
    setDeleting(true)
    try {
      const res = await fetch(`/api/clients/${clientId}`, { method: 'DELETE' })
      if (!res.ok) throw new Error()
      toast.success('Client deleted')
      router.push('/clients')
      router.refresh()
    } catch {
      toast.error('Failed to delete client')
    } finally {
      setDeleting(false)
      setOpen(false)
    }
  }

  return (
    <>
      <Button variant="outline" size="sm" className="w-full text-destructive hover:text-destructive" onClick={() => setOpen(true)}>
        <Trash2 className="mr-1 h-3.5 w-3.5" /> Delete Client
      </Button>
      <AlertDialog open={open} onOpenChange={setOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete {clientName}?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete the client. Contracts and invoices linked to this client cannot be deleted and will remain in your account.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {deleting ? 'Deleting…' : 'Delete Client'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
