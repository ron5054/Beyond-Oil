import { headers as getHeaders } from 'next/headers'
import { redirect } from 'next/navigation'
import payload from '@/payloadClient'

export default async function DashboardPage() {
  const headers = await getHeaders()
  const { user } = await payload.auth({ headers })

  if (!user) redirect('/')

  if (user.role === 'admin' || user.role === 'manager') redirect('/dashboard/overview')

  if (user.role === 'chef') redirect('/client')
}
