import Sidebar from '@/components/Sidebar'
import Image from 'next/image'
import MainHeader from '@/components/MainHeader'

interface DashboardLayoutProps {
  children: React.ReactNode
  searchParams?: { [key: string]: string | string[] | undefined }
}

export default function DashboardLayout({ children, searchParams }: DashboardLayoutProps) {
  return (
    <main className="grid grid-cols-[400px_1fr] grid-rows-[5rem_1fr] h-screen">
      <div className="p-6 border-r border-gray-200 h-screen">
        <div className="p-1">
          <Image src="/logo.svg" alt="Logo" width={150} height={55} priority />
        </div>
        <Sidebar />
      </div>
      <MainHeader searchParams={searchParams} />
      <div className="overflow-auto col-start-2 row-start-2">{children}</div>
    </main>
  )
}
