'use client'
import DailyMeasurementForm from './DailyMeasurementForm'
import DailyMeasurementCard from './DailyMeasurementCard'
import { useState } from 'react'
import { AddButton } from './AddButton'
import { DailyMeasurementCreate } from '../../interfaces'
import { DailyMeasurement } from '@/payload-types'

interface DailyMeasurementListProps {
  dailyMeasurements: DailyMeasurement[]
  branchId: number
  addDailyMeasurementToBranch: (
    dailyMeasurement: DailyMeasurementCreate,
  ) => Promise<false | undefined>
  editDailyMeasurement: (dailyMeasurement: DailyMeasurement) => Promise<void>
  deleteDailyMeasurement: (id: number) => Promise<void>
}

const DailyMeasurementList: React.FC<DailyMeasurementListProps> = ({
  dailyMeasurements,
  branchId,
  addDailyMeasurementToBranch,
  editDailyMeasurement,
  deleteDailyMeasurement,
}) => {
  const [isOpen, setIsOpen] = useState(false)
  const [dailyMeasurementToEdit, setDailyMeasurementToEdit] = useState<DailyMeasurement | null>(
    null,
  )

  const setSelectedInputForm = (inputForm: DailyMeasurement) => {
    setDailyMeasurementToEdit(inputForm)
    setIsOpen(true)
  }

  const handleClose = () => {
    setIsOpen(false)
    setDailyMeasurementToEdit(null)
  }

  return (
    <div className="p-6 border border-gray-200 shadow-sm rounded-lg">
      <div className="flex justify-between">
        <h1 className="text-sm font-bold text-[#212b36]">Daily Input</h1>
        <AddButton openDialog={() => setIsOpen(true)} />
      </div>
      {dailyMeasurements.length > 0 && (
        <ul className="flex flex-col gap-4 mt-6">
          {dailyMeasurements.map((dailyMeasurement) => (
            <li
              className="cursor-pointer"
              key={dailyMeasurement.id}
              onClick={() => setSelectedInputForm(dailyMeasurement)}
            >
              <DailyMeasurementCard
                inputForm={dailyMeasurement}
                onDelete={deleteDailyMeasurement}
              />
            </li>
          ))}
        </ul>
      )}
      <DailyMeasurementForm
        isOpen={isOpen}
        setIsOpen={handleClose}
        branchId={branchId}
        addDailyMeasurement={addDailyMeasurementToBranch}
        editDailyMeasurement={editDailyMeasurement}
        dailyMeasurementToEdit={dailyMeasurementToEdit ?? undefined}
      />
    </div>
  )
}

export default DailyMeasurementList
