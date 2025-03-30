'use client'

import { Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useState } from 'react'
import ProfileForm from './ProfileForm'
import { Dialog, DialogContent, DialogTitle, DialogTrigger } from '@/components/ui/dialog'

interface AddUserButtonProps {
  currentUser: {
    id: number
    role?: string
  }
  branchId?: string | number
}

const AddUserButton = ({ currentUser, branchId }: AddUserButtonProps) => {
  const [open, setOpen] = useState(false)

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="default" className="gap-1">
          <Plus className="h-4 w-4" />
          Add
        </Button>
      </DialogTrigger>
      <DialogContent
        className="sm:max-w-[500px] bg-white p-0 border-none"
        aria-describedby={undefined}
      >
        <DialogTitle></DialogTitle>
        <ProfileForm
          isAddForm
          currentUser={currentUser}
          branchId={branchId}
          onCancel={() => setOpen(false)}
          onSuccess={() => setOpen(false)}
        />
      </DialogContent>
    </Dialog>
  )
}

export default AddUserButton
