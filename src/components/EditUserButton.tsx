'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import ProfileForm from './ProfileForm'
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog'
import { User } from '@/payload-types'
import { DropdownMenuItem } from '@/components/ui/dropdown-menu'
import { Pencil } from 'lucide-react'

interface EditUserButtonProps {
  user: User
  currentUser: {
    id: number
    role?: string
  }
  branchId?: string | number
  onActionComplete?: () => void
}

const EditUserButton = ({ user, currentUser, branchId, onActionComplete }: EditUserButtonProps) => {
  const [open, setOpen] = useState(false)
  const router = useRouter()
  const [isPending, startTransition] = useTransition()

  const handleSuccess = () => {
    // Close the dialog
    setOpen(false)

    // Notify parent component
    if (onActionComplete) {
      onActionComplete()
    }

    // Refresh the data
    startTransition(() => {
      router.refresh()
    })
  }

  return (
    <>
      <DropdownMenuItem
        onSelect={(e) => {
          e.preventDefault()
          setOpen(true)
        }}
      >
        <Pencil className="h-4 w-4 mr-2" />
        Edit
      </DropdownMenuItem>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent
          className="sm:max-w-[700px] bg-white p-0 border-none"
          aria-describedby={undefined}
        >
          <DialogTitle></DialogTitle>
          <ProfileForm
            user={user}
            currentUser={currentUser}
            branchId={branchId}
            onSuccess={handleSuccess}
          />
        </DialogContent>
      </Dialog>
    </>
  )
}

export default EditUserButton
