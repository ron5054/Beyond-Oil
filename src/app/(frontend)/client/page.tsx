import {
  getUser,
  getBranchFryers,
  getFryerReportsByDate,
  getBranchDailyMeasurements,
} from '@/lib/branchActions'
import Link from 'next/link'
import FryersList from '@/components/client/FryersList'
import ClientFoodSampleList from '@/components/client/ClientFoodSampleList'
import { getFoodSamplesNeeded, getFoodSampleReportsByBranchId } from '@/lib/foodSampleReportActions'
import { redirect } from 'next/navigation'
import { Suspense } from 'react'
import Loader from '@/components/Loader'

interface SearchParams {
  tab?: string
}

interface PageProps {
  searchParams: Promise<SearchParams>
}

const ClientPage = async ({ searchParams }: PageProps) => {
  const user = await getUser()

  if (!user) redirect('/')

  const params = await searchParams
  const tab = params?.tab || 'fryers'

  const branchId = typeof user?.branch === 'object' ? user?.branch?.id : user?.branch

  return (
    <div className="text-2xl font-bold flex flex-col items-center text-black p-4 max-w-xl mx-auto">
      <h1>Daily Input</h1>
      <TabSelector activeTab={tab} />

      {tab === 'fryers' && (
        <Suspense fallback={<Loader size={80} speed={0.5} />}>
          <FryersTabContent branchId={String(branchId)} userId={Number(user.id)} />
        </Suspense>
      )}

      {tab === 'food-samples' && (
        <Suspense fallback={<Loader size={80} speed={0.5} />}>
          <FoodSamplesTabContent branchId={String(branchId)} userId={Number(user.id)} />
        </Suspense>
      )}
    </div>
  )
}

// Separate components for each tab to enable Suspense boundaries
const FryersTabContent = async ({ branchId, userId }: { branchId: string; userId: number }) => {
  try {
    if (!branchId || branchId === 'undefined' || branchId === 'null' || branchId === 'NaN') {
      return <div>Invalid branch ID. Please contact support.</div>
    }

    const [branchFryers, todayReports, dailyMeasurements] = await Promise.all([
      getBranchFryers(branchId),
      getFryerReportsByDate(branchId),
      getBranchDailyMeasurements(branchId),
    ])

    return (
      <FryersList
        fryers={branchFryers || []}
        todayReports={todayReports}
        dailyMeasurements={dailyMeasurements}
        branchId={Number(branchId)}
        userId={userId}
      />
    )
  } catch (error) {
    console.error('Error loading fryer content:', error)
    return <div>Something went wrong loading fryer data. Please try refreshing the page.</div>
  }
}

const FoodSamplesTabContent = async ({
  branchId,
  userId,
}: {
  branchId: string
  userId: number
}) => {
  try {
    if (!branchId || branchId === 'undefined' || branchId === 'null' || branchId === 'NaN') {
      return <div>Invalid branch ID. Please contact support.</div>
    }

    const [foodSamplesNeeded, submittedSamples] = await Promise.all([
      getFoodSamplesNeeded(branchId),
      getFoodSampleReportsByBranchId(branchId),
    ])

    return (
      <ClientFoodSampleList
        foodSamplesNeeded={foodSamplesNeeded}
        branchId={Number(branchId)}
        userId={userId}
        submittedSamples={submittedSamples}
      />
    )
  } catch (error) {
    console.error('Error loading food samples content:', error)
    return (
      <div>Something went wrong loading food samples data. Please try refreshing the page.</div>
    )
  }
}

export default ClientPage

const TabSelector = ({ activeTab = 'fryers' }: { activeTab?: string }) => {
  return (
    <div className="flex flex-row items-center justify-center space-x-4 mt-6">
      <Link
        href="?tab=fryers"
        className={`pb-1 !font-medium !text-sm ${activeTab === 'fryers' ? 'border-b-2 border-black ' : 'text-gray-500'}`}
      >
        Fryers
      </Link>
      <Link
        href="?tab=food-samples"
        className={`pb-1 !font-medium !text-sm ${activeTab === 'food-samples' ? 'border-b-2 border-black ' : 'text-gray-500'}`}
      >
        Food Samples
      </Link>
    </div>
  )
}
