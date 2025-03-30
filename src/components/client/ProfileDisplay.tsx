import { User } from '@/payload-types'
import { User as UserIcon } from 'lucide-react'

interface ProfileDisplayProps {
  user: number | User
}

const ProfileDisplay = ({ user }: ProfileDisplayProps) => {
  return (
    <div className="flex items-center gap-1 bg-gray-100 p-2 rounded-md">
      <UserIcon className="w-5 h-5 text-gray-500" />
      <span className="text-xs font-normal">{typeof user === 'object' ? user.name : 'User'}</span>
    </div>
  )
}

export default ProfileDisplay
