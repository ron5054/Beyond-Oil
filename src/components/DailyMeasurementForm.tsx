import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { DailyMeasurement } from '@/payload-types'
import { DailyMeasurementCreate } from 'interfaces'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import Dropdown from '@/components/Dropdown'

interface DailyMeasurementFormProps {
  isOpen: boolean
  setIsOpen: (isOpen: boolean) => void
  branchId: number
  addDailyMeasurement: (formData: DailyMeasurementCreate) => void
  editDailyMeasurement: (formData: DailyMeasurement) => void
  dailyMeasurementToEdit?: DailyMeasurement
}

const DailyMeasurementForm: React.FC<DailyMeasurementFormProps> = ({
  isOpen,
  setIsOpen,
  branchId,
  addDailyMeasurement,
  editDailyMeasurement,
  dailyMeasurementToEdit,
}) => {
  const [formData, setFormData] = useState<DailyMeasurementCreate>({
    name: '',
    type: 'text',
    label: '',
    isActive: true,
    branch: branchId,
  })

  useEffect(() => {
    if (dailyMeasurementToEdit) {
      setFormData(dailyMeasurementToEdit)
    } else {
      setFormData({
        name: '',
        type: 'text',
        label: '',
        isActive: true,
        branch: branchId,
      })
    }
  }, [dailyMeasurementToEdit, branchId])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.id]: e.target.value }))
  }

  const handleSaveDailyMeasurement = () => {
    if (dailyMeasurementToEdit && 'id' in formData)
      editDailyMeasurement(formData as DailyMeasurement)
    else addDailyMeasurement(formData)
    setIsOpen(false)
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl font-medium text-black">
            {dailyMeasurementToEdit ? 'Edit Daily Measurement' : 'Add Daily Measurement'}
          </DialogTitle>
          <DialogDescription>Fill in the details</DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-2 text-black">
          <div className="space-y-1">
            <label htmlFor="name" className="text-sm text-gray-500">
              Name
            </label>
            <Input id="name" value={formData.name} onChange={handleChange} className="w-full" />
          </div>

          <div className="space-y-1">
            <Dropdown
              id="type"
              label="Type"
              options={['text', 'image']}
              value={formData.type}
              onChange={handleChange}
            />
          </div>

          <div className="space-y-1">
            <label htmlFor="label" className="text-sm text-gray-500">
              Label
            </label>
            <Input id="label" value={formData.label} onChange={handleChange} className="w-full" />
          </div>
        </div>

        <div className="mt-4 flex justify-end gap-2">
          <Button variant="outline" className="text-black" onClick={() => setIsOpen(false)}>
            Cancel
          </Button>
          <Button
            className="bg-green-500 hover:bg-green-600 disabled:bg-gray-300 disabled:cursor-not-allowed"
            onClick={handleSaveDailyMeasurement}
            disabled={!formData.name.trim() || !formData.label.trim()}
          >
            {dailyMeasurementToEdit ? 'Save' : 'Add'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default DailyMeasurementForm
