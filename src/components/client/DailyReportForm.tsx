'use client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { DailyMeasurement, Fryer } from '@/payload-types'
import { useState } from 'react'
import FoodImageUploader from './FoodImageUploader'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { format } from 'date-fns'
import { cn } from '@/lib/utils'
import { CalendarIcon } from 'lucide-react'
import { DayPicker } from 'react-day-picker'
import 'react-day-picker/dist/style.css'
import { processCompleteReport } from '@/lib/dailyReportActions'
import { toast } from 'sonner'

interface FoodSampleImage {
  url: string
  name: string
  file: File
  selectedFryer: Fryer
}

interface DailyReportFormProps {
  dailyMeasurements: DailyMeasurement[]
  selectedFryer: Fryer
  branchId: number
  userId: number
  onFormSubmitted?: () => void
}

const DailyReportForm = ({
  dailyMeasurements,
  selectedFryer,
  branchId,
  userId,
  onFormSubmitted,
}: DailyReportFormProps) => {
  const [newOil, setNewOil] = useState(false)
  const [newOilDate, setNewOilDate] = useState<Date | undefined>(undefined)
  const [tpmLevel, setTpmLevel] = useState<string>('')
  const [measurementValues, setMeasurementValues] = useState<Record<string, string>>({})
  const [foodImages, setFoodImages] = useState<Record<string, FoodSampleImage | null>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submissionError, setSubmissionError] = useState<string | null>(null)

  const handleNewOilChange = (checked: boolean) => {
    setNewOil(checked)
    if (checked) {
      setNewOilDate(new Date())
    }
  }

  const handleMeasurementChange = (label: string, value: string) => {
    setMeasurementValues((prev) => ({
      ...prev,
      [label]: value,
    }))
  }

  const handleImageChange = (data: {
    foodSampleName: string
    image: { url: string; name: string; file: File } | null
  }) => {
    setFoodImages((prev) => ({
      ...prev,
      [data.foodSampleName]: data.image
        ? {
            ...data.image,
            selectedFryer,
          }
        : null,
    }))
  }

  const handleSubmit = async () => {
    try {
      setIsSubmitting(true)
      setSubmissionError(null)

      const result = await processCompleteReport({
        tpmLevel,
        newOil,
        newOilDate: newOilDate ? format(newOilDate, 'yyyy-MM-dd') : null,
        measurementValues,
        foodImages,
        selectedFryer,
        branchId,
        userId,
      })

      if (!result.success) {
        throw new Error(result.error || 'Failed to submit report')
      }

      // Show success message
      toast.success('Report submitted successfully')

      // Reset form
      setTpmLevel('')
      setNewOil(false)
      setNewOilDate(undefined)
      setMeasurementValues({})
      setFoodImages({})

      // Call onFormSubmitted if provided to reset the selected fryer
      if (onFormSubmitted) {
        onFormSubmitted()
      }
    } catch (error) {
      console.error('Error submitting report:', error)
      setSubmissionError(error instanceof Error ? error.message : 'Failed to submit report')
      toast.error(error instanceof Error ? error.message : 'Failed to submit report')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="w-full space-y-4">
      <div className="space-y-4">
        <div className="flex items-center gap-3 items-center px-2">
          <Label className="text-sm font-medium">New oil?</Label>
          <input
            type="checkbox"
            checked={newOil}
            onChange={(e) => handleNewOilChange(e.target.checked)}
            className="border-0 shadow-none text-gray-500 focus-visible:ring-0 p-0 text-sm h-8"
          />
        </div>

        {newOil && (
          <div>
            <Label className="text-sm font-medium">Date of oil change</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    'w-full justify-start text-left font-normal',
                    !newOilDate && 'text-muted-foreground',
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {newOilDate ? format(newOilDate, 'PPP') : 'Select date'}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-[.5rem]">
                <DayPicker
                  mode="single"
                  selected={newOilDate}
                  onSelect={setNewOilDate}
                  footer={
                    <Button
                      variant="outline"
                      className="w-full mt-2"
                      onClick={() => setNewOilDate(new Date())}
                    >
                      Today
                    </Button>
                  }
                />
              </PopoverContent>
            </Popover>
          </div>
        )}

        <div className="border rounded-lg px-4 py-2">
          <Input
            type="number"
            placeholder="TPM Level"
            value={tpmLevel}
            onChange={(e) => setTpmLevel(e.target.value)}
            className="border-0 shadow-none text-gray-500 focus-visible:ring-0 p-0 text-sm h-8"
          />
        </div>

        {dailyMeasurements.map((measurement) =>
          measurement.type === 'text' ? (
            <div key={measurement.id} className="">
              <Label className="text-sm font-medium">{measurement.label}</Label>
              <div className="border rounded-lg px-4 py-2">
                <Input
                  type="text"
                  placeholder={measurement.label}
                  value={measurementValues[measurement.label] || ''}
                  onChange={(e) => handleMeasurementChange(measurement.label, e.target.value)}
                  className="border-0 shadow-none text-gray-500 focus-visible:ring-0 p-0 text-sm h-8"
                />
              </div>
            </div>
          ) : (
            <div key={measurement.id} className="flex flex-col gap-2">
              <Label className="text-sm font-medium">{measurement.label}</Label>
              <FoodImageUploader
                foodSampleName={measurement.label}
                onImageChange={handleImageChange}
              />
            </div>
          ),
        )}
      </div>

      {submissionError && <div className="text-red-500 text-sm mt-2">{submissionError}</div>}

      <Button
        onClick={handleSubmit}
        disabled={isSubmitting || !tpmLevel}
        className={`mt-6 w-full font-medium py-6 rounded-md ${
          !isSubmitting && tpmLevel
            ? 'bg-green-500 hover:bg-green-600 text-white'
            : 'bg-gray-300 text-gray-500 cursor-not-allowed'
        }`}
      >
        {isSubmitting ? 'Submitting...' : 'Submit'}
      </Button>
    </div>
  )
}

export default DailyReportForm
