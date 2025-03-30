'use client'

import { User } from '@/payload-types'
import { MoreVertical, Trash } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'
import { remove } from '@/lib/crudActions'
import EditUserButton from './EditUserButton'
import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog'

interface UserPreviewProps {
  user: User
  currentUser: {
    id: number
    role?: string
  }
  branchId?: string | number
}

const UserPreview = ({ user, currentUser, branchId }: UserPreviewProps) => {
  const [menuOpen, setMenuOpen] = useState(false)
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const [showDeleteAlert, setShowDeleteAlert] = useState(false)

  const handleDelete = async () => {
    await remove('users', user.id)
    setMenuOpen(false)

    // Refresh the page to update the user list
    startTransition(() => {
      router.refresh()
    })
  }

  return (
    <tr className="border-t">
      <td className="p-4">
        <div>
          <div className="font-medium">{user.name}</div>
          <div className="text-sm text-muted-foreground">{user.email}</div>
        </div>
      </td>
      <td className="p-4">{user.phoneNumber}</td>
      <td className="p-4">{user.role}</td>
      <td className="p-4">
        <Badge
          variant="outline"
          className={cn(
            'px-3 py-1 rounded-full',
            user.isActive
              ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
              : 'bg-red-50 text-red-700 border-red-200',
          )}
        >
          {user.isActive ? 'Active' : 'Inactive'}
        </Badge>
      </td>
      <td className="p-4">
        <AlertDialog>
          <DropdownMenu open={menuOpen} onOpenChange={setMenuOpen}>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon">
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <EditUserButton
                user={user}
                currentUser={currentUser}
                branchId={branchId}
                onActionComplete={() => setMenuOpen(false)}
              />
              <AlertDialogTrigger asChild>
                <DropdownMenuItem className="text-red-600" onSelect={(e) => e.preventDefault()}>
                  <Trash className="h-4 w-4 mr-2" />
                  Delete
                </DropdownMenuItem>
              </AlertDialogTrigger>
            </DropdownMenuContent>
          </DropdownMenu>

          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Delete Member</AlertDialogTitle>
              <AlertDialogDescription>
                Are you sure you want to delete {user.name}? This action cannot be undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel onClick={() => setMenuOpen(false)}>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={handleDelete} className="bg-red-600 hover:bg-red-700">
                Delete
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </td>
    </tr>
  )
}

export default UserPreview
