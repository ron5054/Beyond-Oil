'use client'

import { useState } from 'react'
import { FoodSample, FoodSampleReport } from '@/payload-types'
import FoodImageUploader from '@/components/client/FoodImageUploader'
import { Button } from '@/components/ui/button'
import { uploadMedia } from '@/lib/foodSampleReportActions'
import { addFoodSampleReport } from '@/lib/foodSampleReportActions'
import SubmittedFoodSampleCard from '@/components/client/SubmittedFoodSampleCard'
import InfoMark from '@/components/InfoMark'
import CheckMark from '@/components/CheckMark'
interface FoodSampleWithLocalImage {
  name: string
  image: { url: string; name: string; file: File } | null
}

const ClientFoodSampleList = ({
  foodSamplesNeeded,
  branchId,
  userId,
  submittedSamples,
}: {
  foodSamplesNeeded: FoodSample[]
  branchId: number
  userId: number
  submittedSamples: FoodSampleReport[]
}) => {
  const [foodSamplesWithImages, setFoodSamplesWithImages] = useState<FoodSampleWithLocalImage[]>([])
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Check if a sample was already submitted
  const isSubmitted = (sampleName: string) => {
    return submittedSamples.some((report) => report.name === sampleName)
  }

  const handleImageChange = (data: {
    foodSampleName: string
    image: { url: string; name: string; file: File } | null
  }) => {
    // Don't allow changes for already submitted samples
    if (isSubmitted(data.foodSampleName)) {
      return
    }

    setFoodSamplesWithImages((prev) => {
      const existingIndex = prev.findIndex((item) => item.name === data.foodSampleName)

      if (existingIndex >= 0) {
        const newArray = [...prev]
        newArray[existingIndex] = { name: data.foodSampleName, image: data.image }
        return newArray
      } else {
        return [...prev, { name: data.foodSampleName, image: data.image }]
      }
    })
  }

  const handleSubmit = async () => {
    try {
      setIsSubmitting(true)

      // Filter out samples without images and already submitted samples
      const samplesToSubmit = foodSamplesWithImages.filter(
        (sample) => sample.image !== null && !isSubmitted(sample.name),
      )

      if (samplesToSubmit.length === 0) {
        setIsSubmitting(false)
        return
      }

      const successfulReports = []

      // Process each food sample one by one
      for (const foodSample of samplesToSubmit) {
        try {
          // Create a FormData object for the file upload
          const formData = new FormData()

          // Add the file
          if (foodSample.image && foodSample.image.file) {
            formData.append('file', foodSample.image.file)

            // Add the alt text as a separate field
            formData.append('alt', `Food sample image for ${foodSample.name}`)

            const mediaResult = await uploadMedia(formData)

            if (mediaResult.error || mediaResult.status !== 200 || !mediaResult.data) {
              throw new Error(mediaResult.error || 'Failed to upload image')
            }

            const uploadedMedia = mediaResult.data
            console.log(`Uploaded image for ${foodSample.name}:`, uploadedMedia)

            // Now create the food sample report with the uploaded image using the server action
            const reportResult = await addFoodSampleReport({
              branch: branchId,
              user: userId,
              name: foodSample.name,
              image: uploadedMedia.url,
            })

            successfulReports.push(reportResult)
          }
        } catch (error: unknown) {
          console.error('Error processing food sample:', error)
        }
      }

      if (successfulReports.length > 0) {
        // Reset form after all uploads
        setFoodSamplesWithImages([])
      }
    } catch (error) {
      console.error('Error submitting food samples:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  // Helper function to get the submitted report for a food sample
  const getSubmittedReport = (sampleName: string) => {
    return submittedSamples.find((report) => report.name === sampleName)
  }

  return (
    <div className="flex flex-col w-full mt-6">
      <ul className="flex flex-col gap-8 w-full">
        {foodSamplesNeeded.map((foodSample) => {
          const sampleIsSubmitted = isSubmitted(foodSample.name)
          const submittedReport = getSubmittedReport(foodSample.name)
          return (
            <li
              key={foodSample.id}
              className="text-xs border-b border-gray-200 shadow-sm p-2 rounded-md"
            >
              <div className="text-sm font-semibold mb-2 flex justify-between">
                <div>{foodSample.name}</div>
                {sampleIsSubmitted ? <CheckMark /> : <InfoMark />}
              </div>
              {sampleIsSubmitted && submittedReport ? (
                <SubmittedFoodSampleCard report={submittedReport} sampleName={foodSample.name} />
              ) : (
                <FoodImageUploader
                  foodSampleName={foodSample.name}
                  onImageChange={handleImageChange}
                />
              )}
            </li>
          )
        })}
      </ul>
      {foodSamplesWithImages.length > 0 && (
        <Button
          onClick={handleSubmit}
          disabled={
            !foodSamplesWithImages.some((item) => item.image !== null && !isSubmitted(item.name)) ||
            isSubmitting
          }
          className={`mt-6 w-full font-medium py-6 rounded-md ${
            foodSamplesWithImages.some((item) => item.image !== null && !isSubmitted(item.name)) &&
            !isSubmitting
              ? 'bg-green-500 hover:bg-green-600 text-white'
              : 'bg-gray-300 text-gray-500 cursor-not-allowed'
          }`}
        >
          {isSubmitting ? 'Submitting...' : 'Submit'}
        </Button>
      )}
    </div>
  )
}

export default ClientFoodSampleList
