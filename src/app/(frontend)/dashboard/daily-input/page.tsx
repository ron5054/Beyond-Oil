import { getFoodSampleReportsByBranchId, getFoodSamplesNeeded } from '@/lib/foodSampleReportActions'
import FoodSampleReportList from '@/components/FoodSampleReportList'
import { Suspense } from 'react'
import FryerDashboard from '@/components/FryerDashboard'
import { getFryerReportsByDate, getUser, getBranchById } from '@/lib/branchActions'
import { redirect } from 'next/navigation'
import Loader from '@/components/Loader'
import TMPChart from '@/components/TPMChart'
import { getLastDaysFryerReports } from '@/lib/dailyReportActions'

interface SearchParams {
  branchId?: string
}

interface PageProps {
  searchParams: Promise<SearchParams>
}

const DailyInputContent = async ({ branchId }: { branchId?: string }) => {
  try {
    const user = await getUser()
    if (!user) redirect('/')

    if (!branchId) {
      return (
        <div className="p-6 max-w-[85rem]">
          <h1 className="text-2xl font-semibold text-[#212b36]">Hi, {user.name} 👋</h1>
          <p>No branch selected</p>
        </div>
      )
    }

    if (branchId === 'undefined' || branchId === 'null' || branchId === 'NaN') {
      return (
        <div className="p-6 max-w-[85rem]">
          <h1 className="text-2xl font-semibold text-[#212b36]">Hi, {user.name} 👋</h1>
          <p>Invalid branch ID. Please select a valid branch.</p>
        </div>
      )
    }

    const reports = await getLastDaysFryerReports(Number(branchId), 10)

    const [foodSampleReports, foodSamplesNeeded, todayReports, yesterdayReports, branchData] =
      await Promise.all([
        getFoodSampleReportsByBranchId(branchId),
        getFoodSamplesNeeded(branchId),
        getFryerReportsByDate(String(branchId)),
        getFryerReportsByDate(String(branchId), new Date(Date.now() - 24 * 60 * 60 * 1000)),
        getBranchById(branchId),
      ])

    if (!branchData) {
      return (
        <div className="p-6 max-w-[85rem]">
          <h1 className="text-2xl font-semibold text-[#212b36]">Hi, {user.name} 👋</h1>
          <p>Branch not found. Please select a different branch.</p>
        </div>
      )
    }

    const branchActiveFryers = branchData?.fryers.filter((fryer) => fryer.isActive) || []

    return (
      <div className="p-6 max-w-[85rem]">
        <h1 className="text-2xl font-semibold text-[#212b36]">Hi, {user.name} 👋</h1>
        <FryerDashboard
          todayReports={todayReports}
          yesterdayReports={yesterdayReports}
          branchFryers={branchActiveFryers}
        />
        <FoodSampleReportList
          foodSampleReports={foodSampleReports}
          foodSamplesNeeded={foodSamplesNeeded}
        />
        <TMPChart reports={reports} />
      </div>
    )
  } catch (error) {
    console.error('Error in DailyInputContent:', error)
    return (
      <div className="p-6 max-w-[85rem]">
        <h1 className="text-2xl font-semibold text-[#212b36]">Error</h1>
        <p>Something went wrong loading the daily input data. Please try refreshing the page.</p>
      </div>
    )
  }
}

export default async function DailyInput({ searchParams }: PageProps) {
  const params = await searchParams
  const branchId = params.branchId

  return (
    <Suspense fallback={<Loader size={100} speed={0.5} />}>
      <DailyInputContent branchId={branchId} />
    </Suspense>
  )
}
