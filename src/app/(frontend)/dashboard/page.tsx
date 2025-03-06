import Image from 'next/image'
import Sidebar from '@/components/Sidebar'
import AddEditBranchForm from '@/components/AddEditBranchForm'

const Dashboard = () => {
  const addBranch = (branch: any) => {
    console.log('branch', branch)
  }

  return (
    <main className="grid grid-cols-[400px_1fr] min-h-screen">
      <div className="p-6">
        <Image src="/logo.svg" alt="Placeholder" width={150} height={55} />
        <Sidebar />
      </div>
      <div className="bg-green-300 p-10">
        <h1>Overview</h1>
        <h1 className="text-2xl font-semibold text-[#212b36]">Hi, Hudson 👋</h1>
        <p className="text-[#637381]">6/45 Days Of Pilot</p>
        <AddEditBranchForm isAddForm={true} addBranch={addBranch} />
      </div>
    </main>
  )
}

export default Dashboard
