import { headers as getHeaders } from 'next/headers.js'
import { redirect } from 'next/navigation'
import './styles.css'
import LoginForm from '@/components/LoginForm'
import Image from 'next/image'
import payload from '@/payloadClient'
import Message from '@/components/Message'

const HomePage = async () => {
  const headers = await getHeaders()
  const userAgent = headers.get('user-agent') || ''
  const isMobile =
    /Mobile|webOS|BlackBerry|IEMobile|MeeGo|mini|Fennec|Android|iP(ad|od|hone)|Windows Phone|Opera Mini|SamsungBrowser|UCBrowser|Chrome Mobile|Firefox Mobile|Safari Mobile|Edge Mobile|Sony|LG|HTC|Nexus|OnePlus|Xiaomi|Huawei|ZTE|Vivo|OPPO|Realme|Asus|Lenovo|Motorola|Nokia|Samsung/i.test(
      userAgent,
    )

  const { user } = await payload.auth({ headers })

  if (user) {
    if ((user.role === 'admin' || user.role === 'manager') && isMobile)
      return <Message user={user} />
    else if (user.role === 'admin' || user.role === 'manager') redirect('/dashboard/overview')
    else if (user.role === 'chef') redirect('/client')
  }

  return (
    <div className="bg-[#eff4f9] w-screen h-screen px-10 py-6">
      <Image src="/logo.svg" alt="Logo" width={150} height={55} priority />
      {!user && <LoginForm />}
    </div>
  )
}

export default HomePage
