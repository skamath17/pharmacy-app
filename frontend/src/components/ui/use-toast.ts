import { useState, useEffect, useCallback } from 'react'

export interface Toast {
  id: string
  title?: string
  description?: string
  variant?: 'default' | 'destructive'
  duration?: number
}

const listeners = new Set<(toasts: Toast[]) => void>()
let toasts: Toast[] = []

function notify() {
  listeners.forEach((listener) => listener([...toasts]))
}

export function useToast() {
  const [state, setState] = useState<Toast[]>([])

  useEffect(() => {
    listeners.add(setState)
    setState([...toasts])
    return () => {
      listeners.delete(setState)
    }
  }, [])

  const toast = useCallback(
    ({ title, description, variant = 'default', duration = 5000 }: Omit<Toast, 'id'>) => {
      const id = Math.random().toString(36).substring(2, 9)
      const newToast: Toast = {
        id,
        title,
        description,
        variant,
        duration,
      }

      toasts = [...toasts, newToast]
      notify()

      if (duration > 0) {
        setTimeout(() => {
          toasts = toasts.filter((t) => t.id !== id)
          notify()
        }, duration)
      }

      return {
        id,
        dismiss: () => {
          toasts = toasts.filter((t) => t.id !== id)
          notify()
        },
      }
    },
    []
  )

  const dismiss = useCallback((toastId?: string) => {
    if (toastId) {
      toasts = toasts.filter((t) => t.id !== toastId)
    } else {
      toasts = []
    }
    notify()
  }, [])

  return {
    toast,
    dismiss,
    toasts: state,
  }
}

