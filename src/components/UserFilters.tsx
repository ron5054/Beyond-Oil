'use client'

import { Search } from 'lucide-react'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { ChangeEvent } from 'react'

interface UserFiltersProps {
  searchQuery: string
  setSearchQuery: (query: string) => void
  roleFilter: string
  setRoleFilter: (role: string) => void
}

const UserFilters = ({
  searchQuery,
  setSearchQuery,
  roleFilter,
  setRoleFilter,
}: UserFiltersProps) => {
  const handleSearchChange = (e: ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value)
  }

  return (
    <div className="flex gap-4 mb-6">
      <div className="w-64">
        <Select value={roleFilter} onValueChange={setRoleFilter}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Role">Role</SelectValue>
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Roles</SelectItem>
            <SelectItem value="chef">Chef</SelectItem>
            <SelectItem value="manager">Manager</SelectItem>
            <SelectItem value="admin">Admin</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="flex-1 relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search by name or email..."
          className="pl-9"
          value={searchQuery}
          onChange={handleSearchChange}
        />
      </div>
    </div>
  )
}

export default UserFilters
