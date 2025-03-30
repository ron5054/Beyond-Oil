'use client'

import { useFormStatus } from 'react-dom'
import { useRouter } from 'next/navigation'
import { Button } from './ui/button'
import { LogOut } from 'lucide-react'
import { logout } from '@/lib/authActions'

const LogoutButton = () => {
  const router = useRouter()
  const { pending } = useFormStatus()

  const handleLogout = async () => {
    await logout()
    router.refresh()
    router.push('/')
  }

  return (
    <form action={handleLogout}>
      <Button
        variant="outline"
        type="submit"
        disabled={pending}
        className="flex items-center gap-2"
      >
        <LogOut size={16} />
        {pending ? 'Logging out...' : 'Logout'}
      </Button>
    </form>
  )
}

export default LogoutButton
