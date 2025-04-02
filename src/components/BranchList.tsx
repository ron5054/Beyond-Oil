'use client'

import { useState } from 'react'
import { Search, ChevronLeft, ChevronRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Branch, User, FryerReport } from '@/payload-types'
import BranchForm from './BranchForm'
import BranchPreview from './BranchPreview'
import BranchTableHeader from './BranchTableHeader'
import ClientNavigationWrapper from './client/ClientNavigationWrapper'

interface BranchListProps {
  branches: Branch[]
  fryers: number[]
  todayBranchReports: FryerReport[][]
  yesterdaysBranchReports: FryerReport[][]
  users?: User[]
}

const BranchList = ({
  branches,
  fryers,
  todayBranchReports,
  yesterdaysBranchReports,
  users = [],
}: BranchListProps) => {
  const [rowsPerPage, setRowsPerPage] = useState('5')
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedChain, setSelectedChain] = useState('all')

  const filteredBranches = branches.filter(
    (branch) =>
      (selectedChain === 'all' || branch.chainName === selectedChain) &&
      (!searchQuery || branch.branchName.toLowerCase().includes(searchQuery.toLowerCase())),
  )

  return (
    <ClientNavigationWrapper>
      <div className="!text-black container border shadow-sm p-6 rounded-lg">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-xl font-semibold text-gray-900">Branches</h1>
          <BranchForm isAddForm users={users} />
        </div>

        <div className="flex flex-col md:flex-row gap-4 mb-6 items-center">
          <div className="w-full md:w-60">
            <div className="flex flex-col">
              <Select defaultValue="all" value={selectedChain} onValueChange={setSelectedChain}>
                <SelectTrigger className="w-full bg-white h-10">
                  <SelectValue placeholder="All" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Chains</SelectItem>
                  {Array.from(new Set(branches.map((branch) => branch.chainName))).map(
                    (chainName) => (
                      <SelectItem key={chainName} value={chainName}>
                        {chainName}
                      </SelectItem>
                    ),
                  )}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="w-full relative">
            <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search..."
              className="pl-10 pr-4 py-[5px] w-full border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        <div className="bg-white rounded-md shadow overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <BranchTableHeader />
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredBranches.map((branch, index) => (
                  <BranchPreview
                    key={branch.id}
                    branch={branch}
                    fryersNum={fryers[index]}
                    todayBranchReports={todayBranchReports[index] || []}
                    yesterdaysBranchReports={yesterdaysBranchReports[index] || []}
                  />
                ))}
              </tbody>
            </table>
          </div>

          {/* <div className="px-6 py-3 flex items-center justify-between border-t border-gray-200">
            <div className="flex items-center">
              <span className="text-sm text-gray-700 mr-2">Rows per page:</span>
              <Select value={rowsPerPage} onValueChange={setRowsPerPage}>
                <SelectTrigger className="w-16 h-8">
                  <SelectValue placeholder="5" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="5">5</SelectItem>
                  <SelectItem value="10">10</SelectItem>
                  <SelectItem value="25">25</SelectItem>
                  <SelectItem value="50">50</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center">
              <span className="text-sm text-gray-700 mr-4">6-10 of 11</span>
              <div className="flex items-center space-x-2">
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div> */}
        </div>
      </div>
    </ClientNavigationWrapper>
  )
}

export default BranchList
