'use client'

import { useState, useEffect } from 'react'
import { UrlStateUpdater } from './UrlStateUpdater'
import { Check, ChevronDown, Search } from 'lucide-react'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { Branch } from '@/payload-types'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Input } from '@/components/ui/input'
import Image from 'next/image'
import SearchParamsWrapper from './client/SearchParamsWrapper'
import BranchLogo from './BranchLogo'
interface BranchPickerProps {
  branches: Branch[]
  currentBranch: Branch | undefined
}

const BranchPickerContent = ({ branches, currentBranch }: BranchPickerProps) => {
  const pathname = usePathname()
  const router = useRouter()
  const urlSearchParams = useSearchParams()
  const [searchQuery, setSearchQuery] = useState('')
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const [selectedBranch, setSelectedBranch] = useState<Branch | undefined>(currentBranch)

  // Update selectedBranch when currentBranch changes
  useEffect(() => {
    setSelectedBranch(currentBranch)
  }, [currentBranch])

  // Reset search query when dropdown closes
  useEffect(() => {
    if (!dropdownOpen) {
      setSearchQuery('')
    }
  }, [dropdownOpen])

  // Handle branch selection on component mount and URL changes
  useEffect(() => {
    // Only run this effect on the client side
    if (typeof window === 'undefined' || branches.length === 0) return

    // Get the branchId from URL parameters
    const branchIdParam = urlSearchParams.get('branchId')

    if (branchIdParam) {
      // If branchId exists in URL, find the corresponding branch
      const branchId = Number(branchIdParam)
      const branch = branches.find((b) => b.id === branchId)

      if (branch) {
        // If branch exists, set it as selected
        setSelectedBranch(branch)
      } else {
        // If branch doesn't exist (invalid ID), set first branch and update URL
        console.log('Invalid branch ID in URL, setting first branch:', branches[0])
        setSelectedBranch(branches[0])

        const url = new URL(window.location.href)
        url.searchParams.set('branchId', branches[0].id.toString())
        router.replace(url.pathname + url.search)
      }
    } else {
      // If no branchId in URL, set first branch and update URL
      setSelectedBranch(branches[0])

      const url = new URL(window.location.href)
      url.searchParams.set('branchId', branches[0].id.toString())
      router.replace(url.pathname + url.search)
    }
  }, [branches, router, urlSearchParams])

  // Filter branches based on search query
  const filteredBranches = branches.filter(
    (branch) =>
      branch.branchName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (branch.branchCode && branch.branchCode.toLowerCase().includes(searchQuery.toLowerCase())),
  )

  const isShowBranchPicker =
    pathname?.toLowerCase().includes('settings') || pathname?.toLowerCase().includes('daily-input')

  if (!isShowBranchPicker) return <></>

  // Determine which branch to display in the UI
  const displayBranch = selectedBranch || (branches.length > 0 ? branches[0] : undefined)

  return (
    <div className="branch-picker">
      <UrlStateUpdater>
        {(updateUrlState) => (
          <DropdownMenu onOpenChange={setDropdownOpen}>
            <DropdownMenuTrigger asChild>
              <div className="flex items-center space-x-3 cursor-pointer group hover:bg-gray-50 p-2 rounded-lg transition-colors">
                <div className="w-[40px] h-[40px] !object-cover relative overflow-hidden !rounded-full border border-gray-200">
                  <BranchLogo logo={displayBranch?.logo} />
                </div>
                <div className="font-bold text-lg text-gray-800 flex items-center">
                  {displayBranch?.branchName || 'Select Branch'}
                  <ChevronDown className="ml-2 h-4 w-4 text-gray-500 group-hover:text-gray-700 transition-colors" />
                </div>
              </div>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="start"
              className="w-[280px]"
              onCloseAutoFocus={(e) => {
                // Prevent focus issues when closing the dropdown
                e.preventDefault()
              }}
            >
              <div className="p-2">
                <div className="relative">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Search branches..."
                    className="pl-8 h-9 focus-visible:ring-blue-500"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
              </div>

              <DropdownMenuSeparator />

              <div className="max-h-[300px] overflow-y-auto py-1">
                {filteredBranches.length === 0 ? (
                  <div className="px-2 py-4 text-center text-sm text-gray-500">
                    No branches found
                  </div>
                ) : (
                  filteredBranches.map((branch) => (
                    <DropdownMenuItem
                      key={branch.id}
                      className={`flex items-center gap-2 cursor-pointer px-3 py-2 ${
                        branch.id === selectedBranch?.id ? 'bg-blue-50' : ''
                      }`}
                      onClick={() => {
                        // Update URL state
                        updateUrlState(
                          { branchId: branch.id.toString() },
                          { preserveExisting: true },
                        )

                        // Update local state immediately for UI responsiveness
                        setSelectedBranch(branch)
                        setDropdownOpen(false)
                      }}
                    >
                      <div className="relative overflow-hidden object-cover rounded-full border border-gray-200 flex-shrink-0">
                        <BranchLogo logo={branch.logo} />
                      </div>
                      <div className="flex-grow min-w-0 font-medium text-sm truncate">
                        {branch.branchName}
                      </div>
                      {branch.id === selectedBranch?.id && (
                        <Check className="h-4 w-4 text-blue-500 flex-shrink-0" />
                      )}
                    </DropdownMenuItem>
                  ))
                )}
              </div>
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </UrlStateUpdater>
    </div>
  )
}

// Wrapper component that handles the Suspense boundary
const BranchPicker = (props: BranchPickerProps) => {
  return (
    <SearchParamsWrapper>
      <BranchPickerContent {...props} />
    </SearchParamsWrapper>
  )
}

export default BranchPicker
