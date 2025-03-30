'use client'

import { Copy, Eye, Settings, Trash } from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Button } from '@/components/ui/button'
import { MoreVertical } from 'lucide-react'
import { Branch } from '@/payload-types'
import { useRouter } from 'next/navigation'
import { removeBranchWithRelations } from '@/lib/branchActions'
import ClientNavigationWrapper from './client/ClientNavigationWrapper'
import { duplicateBranchWithRelations } from '@/lib/branchActions'
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

const BranchContextMenu = ({ branch }: { branch: Branch }) => {
  const router = useRouter()

  const removeBranch = async () => {
    await removeBranchWithRelations(String(branch.id))
  }

  const handleDuplicate = async () => {
    try {
      await duplicateBranchWithRelations(branch)
    } catch (error) {
      console.error('Error duplicating branch:', error)
    }
  }

  return (
    <ClientNavigationWrapper>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon">
            <MoreVertical className="h-4 w-4" />
            <span className="sr-only">Open menu</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-[214px] mr-18">
          <DropdownMenuItem
            className="flex items-center gap-3 py-3 text-base"
            onClick={() => router.push(`/dashboard/daily-input?branchId=${branch.id}`)}
          >
            <Eye className="h-5 w-5" />
            View
          </DropdownMenuItem>
          <DropdownMenuItem
            className="flex items-center gap-3 py-3 text-base"
            onClick={() => router.push(`/dashboard/settings?branchId=${branch.id}`)}
          >
            <Settings className="h-5 w-5 text-muted-foreground" />
            Settings
          </DropdownMenuItem>
          <DropdownMenuItem
            className="flex items-center gap-3 py-3 text-base"
            onClick={handleDuplicate}
          >
            <Copy className="h-5 w-5" />
            Duplicate
          </DropdownMenuItem>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <DropdownMenuItem
                className="flex items-center gap-3 py-3 text-base text-red-500"
                onSelect={(e) => e.preventDefault()}
              >
                <Trash className="h-5 w-5" />
                Delete
              </DropdownMenuItem>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                <AlertDialogDescription>
                  This action cannot be undone. This will permanently delete this branch and all
                  associated data from the system.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={removeBranch}>Delete</AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </DropdownMenuContent>
      </DropdownMenu>
    </ClientNavigationWrapper>
  )
}

export default BranchContextMenu
