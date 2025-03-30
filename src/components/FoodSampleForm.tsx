'use client'
import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { FoodSampleCreate } from '../../interfaces'
import { FoodSample } from '@/payload-types'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'

interface FoodSampleFormProps {
  isOpen: boolean
  setIsOpen: (isOpen: boolean) => void
  branchId: number
  addFoodSample: (formData: FoodSampleCreate) => void
  editFoodSample: (formData: FoodSample) => void
  foodSampleToEdit?: FoodSample
}

const FoodSampleForm: React.FC<FoodSampleFormProps> = ({
  isOpen,
  setIsOpen,
  branchId,
  addFoodSample,
  editFoodSample,
  foodSampleToEdit,
}) => {
  const [formData, setFormData] = useState<FoodSampleCreate>({
    name: '',
    branch: branchId,
    isActive: true,
  })

  useEffect(() => {
    if (foodSampleToEdit) {
      setFormData(foodSampleToEdit)
    } else {
      setFormData({
        name: '',
        branch: branchId,
        isActive: true,
      })
    }
  }, [foodSampleToEdit, branchId])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.id]: e.target.value }))
  }

  const handleSaveFoodSample = () => {
    if (foodSampleToEdit && 'id' in formData) editFoodSample(formData as FoodSample)
    else addFoodSample(formData)
    setIsOpen(false)
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl font-medium text-black">
            {foodSampleToEdit ? 'Edit Food Sample' : 'Add Food Sample'}
          </DialogTitle>
          <DialogDescription>Fill in the details</DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-2 text-black">
          <div className="space-y-1">
            <label htmlFor="name" className="text-sm text-gray-500">
              Food Sample Name
            </label>
            <Input id="name" value={formData.name} onChange={handleChange} className="w-full" />
          </div>
        </div>

        <div className="flex justify-end gap-2 pt-4">
          <Button variant="outline" className="text-black" onClick={() => setIsOpen(false)}>
            Cancel
          </Button>
          <Button
            className="bg-green-500 hover:bg-green-600 disabled:bg-gray-300 disabled:cursor-not-allowed"
            onClick={handleSaveFoodSample}
            disabled={!formData.name.trim()}
          >
            {foodSampleToEdit ? 'Save' : 'Add'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default FoodSampleForm
