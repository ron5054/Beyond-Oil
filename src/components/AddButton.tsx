import { Plus } from 'lucide-react'
import type { ButtonHTMLAttributes } from 'react'
import { cn } from '@/lib/utils'

interface AddButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  className?: string
  openDialog: () => void
}

export function AddButton({ openDialog, className, disabled, ...props }: AddButtonProps) {
  return (
    <button
      className={cn(
        'inline-flex items-center gap-2 px-3 py-2 bg-gray-50 hover:bg-gray-100 text-gray-700 text-sm font-medium rounded-md transition-colors',
        disabled ? 'cursor-not-allowed opacity-60' : 'cursor-pointer',
        className,
      )}
      onClick={openDialog}
      disabled={disabled}
      {...props}
    >
      <span>Add</span>
      <Plus className="h-4 w-4" />
    </button>
  )
}
