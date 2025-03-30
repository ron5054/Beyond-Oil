import BranchForm from '@/components/BranchForm'
import SettingsHeader from '../../../../components/SettingsHeader'
import FryerList from '@/components/FryerList'
import DailyMeasurementList from '@/components/DailyMeasurementList'
import FoodSampleList from '@/components/FoodSampleList'
import { getBranchById, getUser, getUsers, getBranchUsers } from '@/lib/branchActions'
import {
  AddFryerToBranch,
  editFryer,
  addDailyMeasurementToBranch,
  addFoodSampleToBranch,
  editDailyMeasurement,
  editFoodSample,
  deleteFryer,
  deleteDailyMeasurement,
  deleteFoodSample,
} from './actions'
import UserList from '@/components/UsersList'
import { Suspense } from 'react'
import { redirect } from 'next/navigation'
import Loader from '@/components/Loader'
import ProfileForm from '@/components/ProfileForm'

interface PageProps {
  searchParams: Promise<{ branchId?: string; tab?: string }>
}

const BranchContent = async ({ branchId }: { branchId: string }) => {
  const res = await getBranchById(branchId)
  const allUsers = await getUsers()

  if (!res) return null

  const { branch, fryers, foodSamples, dailyMeasurements } = res

  return (
    <>
      <BranchForm isAddForm={false} branch={branch} users={allUsers} />
      <FryerList
        fryers={fryers}
        branchId={branch.id}
        addFryerToBranch={AddFryerToBranch}
        editFryer={editFryer}
        deleteFryer={deleteFryer}
      />
      <FoodSampleList
        branchId={branch.id}
        addFoodSampleToBranch={addFoodSampleToBranch}
        foodSamples={foodSamples}
        editFoodSample={editFoodSample}
        deleteFoodSample={deleteFoodSample}
      />
      <DailyMeasurementList
        dailyMeasurements={dailyMeasurements}
        branchId={branch.id}
        addDailyMeasurementToBranch={addDailyMeasurementToBranch}
        editDailyMeasurement={editDailyMeasurement}
        deleteDailyMeasurement={deleteDailyMeasurement}
      />
    </>
  )
}

const MembersContent = async ({ branchId }: { branchId: string }) => {
  const [branchUsers, currentUser, branch] = await Promise.all([
    getBranchUsers(branchId),
    getUser(),
    getBranchById(branchId),
  ])

  if (!currentUser) return null

  return (
    <UserList
      key={`users-list-${branchUsers.length}-${branchId}`}
      users={branchUsers}
      currentUser={currentUser}
      branchId={branch?.branch.id}
    />
  )
}

const ProfileContent = async () => {
  const user = await getUser()

  if (!user) return null

  return <ProfileForm user={user} currentUser={user} />
}

const SettingsContent = async ({ branchId, tab }: { branchId?: string; tab?: string }) => {
  const user = await getUser()
  if (!user) redirect('/')
  if (user?.role !== 'admin' && user?.role !== 'manager') redirect('/client')

  if (!branchId && tab !== 'profile') {
    return <div className="text-red-500 p-6">No branch selected</div>
  }

  return (
    <div className="px-6 max-w-[85rem]">
      <SettingsHeader />
      <div className="overflow-y-auto">
        <div className="flex flex-col gap-y-[3rem] my-4">
          {tab === 'branch' && (
            <Suspense fallback={<Loader size={50} speed={0.5} />}>
              <BranchContent branchId={branchId!} />
            </Suspense>
          )}

          {tab === 'members' && (
            <Suspense fallback={<Loader size={50} speed={0.5} />}>
              <MembersContent branchId={branchId!} />
            </Suspense>
          )}

          {tab === 'profile' && (
            <Suspense fallback={<Loader size={50} speed={0.5} />}>
              <ProfileContent />
            </Suspense>
          )}
        </div>
      </div>
    </div>
  )
}

export default async function Settings({ searchParams }: PageProps) {
  const params = await searchParams
  return (
    <Suspense fallback={<Loader size={100} speed={0.5} />}>
      <SettingsContent branchId={params.branchId} tab={params.tab} />
    </Suspense>
  )
}
