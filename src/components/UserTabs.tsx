'use client'

import { User } from '@/payload-types'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

interface UserTabsProps {
  users: User[]
  activeTab: 'all' | 'active'
  setActiveTab: (tab: 'all' | 'active') => void
}

const UserTabs = ({ users, activeTab, setActiveTab }: UserTabsProps) => {
  // Calculate counts
  const allCount = users.length
  const activeCount = users.filter((user) => user.isActive).length

  return (
    <div className="border-b mb-6">
      <div className="flex gap-4 mb-[-1px]">
        <Button
          variant="ghost"
          className={cn(
            'rounded-none relative px-4 h-10',
            activeTab === 'all' && 'border-b-2 border-primary',
          )}
          onClick={() => setActiveTab('all')}
        >
          All
          <span className="ml-1 bg-zinc-800 text-white rounded-full px-2 py-0.5 text-xs">
            {allCount}
          </span>
        </Button>
        <Button
          variant="ghost"
          className={cn(
            'rounded-none relative px-4 h-10',
            activeTab === 'active' && 'border-b-2 border-primary',
          )}
          onClick={() => setActiveTab('active')}
        >
          Active
          <span className="ml-1 bg-emerald-100 text-emerald-700 rounded-full px-2 py-0.5 text-xs">
            {activeCount}
          </span>
        </Button>
      </div>
    </div>
  )
}

export default UserTabs
