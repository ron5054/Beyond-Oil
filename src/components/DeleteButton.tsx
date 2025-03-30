'use client'
import { Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

interface DeleteButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  size?: 'sm' | 'xs'
  onDelete?: () => void
}

export function DeleteButton({ size = 'sm', onDelete, className, ...props }: DeleteButtonProps) {
  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault()
    e.stopPropagation()
    onDelete?.()
  }

  return (
    <Button
      variant="ghost"
      size={size === 'xs' ? 'icon' : 'sm'}
      className={cn(size === 'xs' ? 'h-6 w-6 p-0' : 'h-8 w-8 p-0', 'cursor-pointer', className)}
      onClick={handleClick}
      aria-label="Delete"
      {...props}
    >
      <Trash2 className={cn(size === 'xs' ? 'h-3 w-3' : 'h-4 w-4')} />
    </Button>
  )
}
