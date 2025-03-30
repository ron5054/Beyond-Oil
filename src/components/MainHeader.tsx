import { Suspense } from 'react'
import Notifications from './Notifications'
import { Building2 } from 'lucide-react'
import { getUserBranches, getUser } from '@/lib/branchActions'
import BranchPicker from '@/components/BranchPicker'

interface MainHeaderProps {
  searchParams?: { [key: string]: string | string[] | undefined } | null
}

const MainHeader = async ({ searchParams }: MainHeaderProps) => {
  const user = await getUser()
  const branches = user ? await getUserBranches(user) : []

  // Safely access branchId from searchParams
  const branchIdParam = searchParams?.branchId
  const branchIdString =
    typeof branchIdParam === 'string'
      ? branchIdParam
      : Array.isArray(branchIdParam)
        ? branchIdParam[0]
        : undefined

  const branchId = branchIdString ? Number(branchIdString) : undefined
  const currentBranch =
    branchId && branches.length > 0
      ? branches.find((branch) => branch.id === branchId) || branches[0]
      : branches[0]

  return (
    <div className="text-black flex justify-between items-center px-6 py-3 col-start-2 row-start-1 max-w-[85rem]">
      <div>
        {branches.length === 0 ? (
          <div className="flex items-center space-x-2">
            <Building2 className="w-5 h-5 text-gray-400" />
            <span className="text-gray-500">No branches available</span>
          </div>
        ) : (
          <Suspense
            fallback={
              <div className="flex items-center space-x-2">
                <div className="w-10 h-10 bg-gray-100 rounded-full animate-pulse"></div>
                <div className="h-5 w-32 bg-gray-100 rounded animate-pulse"></div>
              </div>
            }
          >
            <BranchPicker branches={branches} currentBranch={currentBranch} />
          </Suspense>
        )}
      </div>
      <Notifications />
    </div>
  )
}

export default MainHeader
