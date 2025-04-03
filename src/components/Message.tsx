'use client'

import { redirect } from 'next/navigation'
import { Button } from './ui/button'
import { User } from '@/payload-types'
import { ChefHat } from 'lucide-react'

const Message = ({ user }: { user: User }) => {
  return (
    <div className="flex items-center justify-center flex-col gap-8 bg-[#eff4f9] p-4 h-[100dvh]">
      <h1 className="text-2xl font-bold text-green-500 text-center mt-10">
        Wellcom, {user.name} 👋
      </h1>
      <h2 className="text-lg font-medium text-center">
        Dashboard access is restricted to desktop devices
      </h2>
      <p className="text-lg  text-gray-500 text-center">
        For the best experience, please access the admin dashboard from your desktop browser. The
        dashboard contains advanced features that require a larger screen.
      </p>
      <p className="text-lg text-gray-500 text-center">
        While on mobile, you can access our Chef interface
      </p>
      <Button className="bg-green-500 !py-6" onClick={() => redirect('/client')}>
        <ChefHat className="size-4" />
        Open Chef Interface
      </Button>
    </div>
  )
}

export default Message
