'use client'

import { User } from '@/payload-types'
import { useState, useMemo } from 'react'
import UserPreview from './UserPreview'
import UserFilters from './UserFilters'
import UserTabs from './UserTabs'
import UserPagination from './UserPagination'
import AddUserButton from './AddUserButton'

interface UsersListProps {
  users: User[]
  currentUser: {
    id: number
    role?: string
  }
  branchId?: string | number
}

const UsersList = ({ users, currentUser, branchId }: UsersListProps) => {
  const [activeTab, setActiveTab] = useState<'all' | 'active'>('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [roleFilter, setRoleFilter] = useState('all')

  // Filter users based on active tab, search query, and role filter
  const filteredUsers = useMemo(() => {
    // First filter by active status
    let filtered = activeTab === 'all' ? users : users.filter((user) => user.isActive)

    // Then filter by role if not 'all'
    if (roleFilter !== 'all') {
      filtered = filtered.filter((user) => user.role === roleFilter)
    }

    // Finally filter by search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase().trim()
      filtered = filtered.filter(
        (user) =>
          (user.name && user.name.toLowerCase().includes(query)) ||
          (user.email && user.email.toLowerCase().includes(query)),
      )
    }

    return filtered
  }, [users, activeTab, searchQuery, roleFilter])

  return (
    <div className="w-full border rounded-lg p-6 bg-white text-black shadow-sm">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold">Branch Members</h2>
        <AddUserButton currentUser={currentUser} branchId={branchId} />
      </div>

      <UserTabs users={users} activeTab={activeTab} setActiveTab={setActiveTab} />

      <UserFilters
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        roleFilter={roleFilter}
        setRoleFilter={setRoleFilter}
      />

      <div className="border rounded-lg overflow-hidden">
        <table className="w-full">
          <thead className="bg-muted/50">
            <tr>
              <th className="text-left p-4 font-medium">Name</th>
              <th className="text-left p-4 font-medium">Phone number</th>
              <th className="text-left p-4 font-medium">Role</th>
              <th className="text-left p-4 font-medium">Status</th>
              <th className="w-12 p-4"></th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.length > 0 ? (
              filteredUsers.map((user) => (
                <UserPreview
                  key={user.id}
                  user={user}
                  currentUser={currentUser}
                  branchId={branchId}
                />
              ))
            ) : (
              <tr>
                <td colSpan={5} className="p-4 text-center text-muted-foreground">
                  No users found matching your search criteria
                </td>
              </tr>
            )}
          </tbody>
        </table>
        <UserPagination />
      </div>
    </div>
  )
}

export default UsersList
