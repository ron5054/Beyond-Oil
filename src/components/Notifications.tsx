'use client'

import { Bell } from 'lucide-react'
import LogoutButton from './LogoutButton'

interface NotificationsProps {
  count?: number
}

const Notifications = ({ count = 4 }: NotificationsProps) => {
  return (
    <div className="flex items-center gap-4">
      {/* <div className="relative cursor-pointer">
        <Bell className="w-5 h-5 text-gray-500" />
        {count > 0 && (
          <div className="absolute -top-3 -right-3 w-5 h-5 bg-orange-500 rounded-full flex items-center justify-center text-white font-bold text-xs">
            {count}
          </div>
        )}
      </div> */}
      <LogoutButton />
    </div>
  )
}

export default Notifications
