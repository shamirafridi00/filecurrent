// ============================================================
// src/hooks/useConfirm.ts
// Imperative confirm dialog hook — replaces window.confirm()
// ============================================================

import { useState, useCallback } from 'react'
import type { ConfirmOptions } from '@/types'

interface ConfirmState extends ConfirmOptions {
  open: boolean
  resolve: (value: boolean) => void
}

export function useConfirm() {
  const [state, setState] = useState<ConfirmState>({
    open: false,
    title: '',
    description: '',
    resolve: () => {},
  })

  const confirm = useCallback((options: ConfirmOptions): Promise<boolean> => {
    return new Promise((resolve) => {
      setState({ ...options, open: true, resolve })
    })
  }, [])

  const handleConfirm = useCallback(() => {
    state.resolve(true)
    setState((prev) => ({ ...prev, open: false }))
  }, [state])

  const handleCancel = useCallback(() => {
    state.resolve(false)
    setState((prev) => ({ ...prev, open: false }))
  }, [state])

  return {
    confirm,
    dialogProps: {
      open: state.open,
      title: state.title,
      description: state.description,
      confirmLabel: state.confirmLabel,
      cancelLabel: state.cancelLabel,
      variant: state.variant,
      onConfirm: handleConfirm,
      onCancel: handleCancel,
    },
  }
}

// ============================================================
// src/hooks/useToast.ts
// Simple toast notification hook
// ============================================================

import type { ToastMessage } from '@/types'

export function useToast() {
  const [toasts, setToasts] = useState<ToastMessage[]>([])

  const addToast = useCallback(
    (type: ToastMessage['type'], message: string, duration = 4000) => {
      const id = crypto.randomUUID()
      const toast: ToastMessage = { id, type, message, duration }
      setToasts((prev) => [...prev, toast])
      setTimeout(() => {
        setToasts((prev) => prev.filter((t) => t.id !== id))
      }, duration)
    },
    []
  )

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id))
  }, [])

  return {
    toasts,
    toast: {
      success: (msg: string) => addToast('success', msg),
      error: (msg: string) => addToast('error', msg),
      info: (msg: string) => addToast('info', msg),
      warning: (msg: string) => addToast('warning', msg),
    },
    removeToast,
  }
}
