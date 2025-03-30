import { getFryerReportsByDate, getUser, getUsers } from '@/lib/branchActions'
import BranchList from '@/components/BranchList'
import { getUserBranches, getBranchFryers } from '@/lib/branchActions'
import { Suspense } from 'react'
import { redirect } from 'next/navigation'
import Loader from '@/components/Loader'

interface PageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}

const OverviewContent = async () => {
  const user = await getUser()
  if (!user) redirect('/')

  const [branches, users] = await Promise.all([getUserBranches(user), getUsers()])

  const BranchesFryersNum = await Promise.all(
    branches.map(async (branch) => {
      const fryers = await getBranchFryers(String(branch.id))
      return fryers.length
    }),
  )

  const todayBranchReports = await Promise.all(
    branches.map(async (branch) => {
      const reports = await getFryerReportsByDate(String(branch.id))
      return reports
    }),
  )

  const yesterdaysBranchReports = await Promise.all(
    branches.map(async (branch) => {
      const reports = await getFryerReportsByDate(
        String(branch.id),
        new Date(Date.now() - 24 * 60 * 60 * 1000),
      )
      return reports
    }),
  )

  return (
    <div className="px-6 max-w-[85rem]">
      <h1 className="text-2xl font-semibold text-[#212b36]">Hi, {user.name} 👋</h1>
      <p className="text-[#637381] !mt-2 !mb-10">Here you can manage all your branches</p>
      <BranchList
        branches={branches}
        fryers={BranchesFryersNum}
        todayBranchReports={todayBranchReports}
        yesterdaysBranchReports={yesterdaysBranchReports}
        users={users}
      />
    </div>
  )
}

export default async function Overview({ searchParams }: PageProps) {
  await searchParams

  return (
    <Suspense fallback={<Loader size={100} speed={0.5} />}>
      <OverviewContent />
    </Suspense>
  )
}
