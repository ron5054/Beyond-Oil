'use client'
import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { FryerCreate } from '../../interfaces'
import { Fryer } from '@/payload-types'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import Dropdown from '@/components/Dropdown'

interface FryerFormProps {
  isOpen: boolean
  setIsOpen: (isOpen: boolean) => void
  branchId: number
  addFryer: (formData: FryerCreate) => void
  editFryer: (formData: Fryer) => void
  fryerToEdit?: Fryer
}

const fryerTypes = ['Winston (25L)', 'Frymaster (30L)', 'Pitco (20L)'] as const
const foodItems = ['Chicken', 'French Fries', 'Onion Rings', 'Fish'] as const

const FryerForm: React.FC<FryerFormProps> = ({
  isOpen,
  setIsOpen,
  branchId,
  addFryer,
  editFryer,
  fryerToEdit,
}) => {
  const [formData, setFormData] = useState<Fryer | FryerCreate>({
    name: '',
    itemsFried: foodItems[0],
    type: fryerTypes[0],
    isActive: true,
    branch: branchId,
  })

  useEffect(() => {
    if (fryerToEdit) {
      setFormData(fryerToEdit)
    } else {
      setFormData({
        name: '',
        itemsFried: foodItems[0],
        type: fryerTypes[0],
        isActive: true,
        branch: branchId,
      })
    }
  }, [fryerToEdit, branchId])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.id]: e.target.value }))
  }

  const handleSaveFryer = () => {
    if (fryerToEdit && 'id' in formData) editFryer(formData as Fryer)
    else addFryer(formData)
    setIsOpen(false)
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl font-medium text-black">
            {fryerToEdit ? 'Edit Fryer' : 'Add Fryer'}
          </DialogTitle>
          <DialogDescription>Fill in the details</DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-2 text-black">
          <div className="space-y-1">
            <label htmlFor="name" className="text-sm text-gray-500">
              Nickname
            </label>
            <Input id="name" value={formData.name} onChange={handleChange} className="w-full" />
          </div>

          <Dropdown
            id="type"
            label="Type"
            options={fryerTypes}
            value={formData.type}
            onChange={handleChange}
          />
          <Dropdown
            id="itemsFried"
            label="Items Fried"
            options={foodItems}
            value={formData.itemsFried}
            onChange={handleChange}
          />
        </div>

        <div className="flex justify-end gap-2 pt-4">
          <Button variant="outline" className="text-black" onClick={() => setIsOpen(false)}>
            Cancel
          </Button>
          <Button
            className="bg-green-500 hover:bg-green-600 disabled:bg-gray-300 disabled:cursor-not-allowed"
            onClick={handleSaveFryer}
            disabled={!formData.name.trim()}
          >
            {fryerToEdit ? 'Save' : 'Add'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default FryerForm
