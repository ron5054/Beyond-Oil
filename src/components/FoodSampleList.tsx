'use client'

import { FoodSampleCreate } from 'interfaces'
import { FoodSample } from '@/payload-types'
import FoodSampleCard from './FoodSampleCard'
import { useState } from 'react'
import { AddButton } from './AddButton'
import FoodSampleForm from './FoodSampleForm'

interface FoodSampleListProps {
  foodSamples: FoodSample[]
  addFoodSampleToBranch: (formData: FoodSampleCreate) => void
  editFoodSample: (formData: FoodSample) => void
  deleteFoodSample: (id: number) => Promise<void>
  branchId: number
}

const FoodSampleList: React.FC<FoodSampleListProps> = ({
  foodSamples,
  addFoodSampleToBranch,
  editFoodSample,
  deleteFoodSample,
  branchId,
}) => {
  const [isOpen, setIsOpen] = useState(false)
  const [foodSampleToEdit, setFoodSampleToEdit] = useState<FoodSample | null>(null)

  const handleClose = () => {
    setIsOpen(false)
    setFoodSampleToEdit(null)
  }

  const setSelectedFoodSample = (foodSample: FoodSample) => {
    setFoodSampleToEdit(foodSample)
    setIsOpen(true)
  }

  return (
    <div className="p-6 border border-gray-200 shadow-sm rounded-lg">
      <div className="flex justify-between">
        <h1 className="text-sm font-bold text-[#212b36]">Food Samples</h1>
        <AddButton openDialog={() => setIsOpen(true)} disabled={foodSamples.length >= 5} />
      </div>
      {foodSamples.length > 0 && (
        <ul className="flex flex-col gap-4 mt-6">
          {foodSamples.map((foodSample) => (
            <li
              key={foodSample.id}
              className="cursor-pointer"
              onClick={() => setSelectedFoodSample(foodSample)}
            >
              <FoodSampleCard foodSample={foodSample} onDelete={deleteFoodSample} />
            </li>
          ))}
        </ul>
      )}
      <FoodSampleForm
        isOpen={isOpen}
        setIsOpen={handleClose}
        branchId={branchId}
        addFoodSample={(formData) => addFoodSampleToBranch(formData)}
        editFoodSample={(formData) => editFoodSample(formData)}
        foodSampleToEdit={foodSampleToEdit ?? undefined}
      />
    </div>
  )
}

export default FoodSampleList
