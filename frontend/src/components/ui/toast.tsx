import { X } from 'lucide-react'
import { Toast } from './use-toast'
import { Button } from './button'
import { cn } from '@/lib/utils'

interface ToastProps {
  toast: Toast
  onDismiss: (id: string) => void
}

export function ToastComponent({ toast, onDismiss }: ToastProps) {
  return (
    <div
      className={cn(
        'group pointer-events-auto relative flex w-full items-center justify-between space-x-4 overflow-hidden rounded-md border p-6 pr-8 shadow-lg transition-all',
        toast.variant === 'destructive'
          ? 'border-destructive bg-destructive text-destructive-foreground'
          : 'border bg-background text-foreground'
      )}
    >
      <div className="grid gap-1 flex-1">
        {toast.title && (
          <div className="text-sm font-semibold">{toast.title}</div>
        )}
        {toast.description && (
          <div className="text-sm opacity-90">{toast.description}</div>
        )}
      </div>
      <Button
        variant="ghost"
        size="icon"
        className={cn(
          'absolute right-2 top-2 rounded-md p-1 opacity-0 transition-opacity group-hover:opacity-100',
          toast.variant === 'destructive'
            ? 'text-destructive-foreground hover:bg-destructive-foreground/20'
            : 'text-foreground/50 hover:bg-foreground/10'
        )}
        onClick={() => onDismiss(toast.id)}
      >
        <X className="h-4 w-4" />
      </Button>
    </div>
  )
}

