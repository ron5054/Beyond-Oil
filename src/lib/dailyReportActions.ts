'use server'

import payload from '@/payloadClient'
import { revalidatePath } from 'next/cache'
import { uploadMedia } from './foodSampleReportActions'
import { DailyReportResults } from '@/../interfaces'
import { Fryer } from '@/payload-types'
import { editFryer } from '@/app/(frontend)/dashboard/settings/actions'

export const addFryerReport = async (data: {
  fryer: number
  branch: number
  tpmLevel: number
  newOil?: boolean
  newOilDate?: string | null
  userId: number
}) => {
  try {
    const report = await payload.create({
      collection: 'fryer-reports',
      data: {
        fryer: data.fryer,
        branch: data.branch,
        tpmLevel: data.tpmLevel,
        newOil: data.newOil || false,
        newOilDate: data.newOilDate,
        createdBy: data.userId,
      },
    })

    revalidatePath('/client')
    return report
  } catch (error: unknown) {
    console.error('Error creating fryer report:', error)
    return {
      error: error instanceof Error ? error.message : 'An error occurred',
      status: 500,
    }
  }
}

// Add a daily measurement report (text-based measurements)
export const addDailyMeasurementReport = async (data: {
  branch: number
  user: number
  fryer: number
  name: string
  value: string
}) => {
  try {
    const report = await payload.create({
      collection: 'dailyMeasurementReports',
      data: {
        branch: data.branch,
        user: data.user,
        fryer: data.fryer,
        name: data.name,
        value: data.value,
      },
    })

    revalidatePath('/client')
    return report
  } catch (error: unknown) {
    console.error('Error creating daily measurement report:', error)
    return {
      error: error instanceof Error ? error.message : 'An error occurred',
      status: 500,
    }
  }
}

// Process the complete daily report form submission
export const processCompleteReport = async ({
  tpmLevel,
  newOil,
  newOilDate,
  measurementValues,
  foodImages,
  selectedFryer,
  branchId,
  userId,
}: {
  tpmLevel: string
  newOil: boolean
  newOilDate?: string | null
  measurementValues: Record<string, string>
  foodImages: Record<string, { url: string; name: string; file: File; selectedFryer: Fryer } | null>
  selectedFryer: Fryer
  branchId: number
  userId: number
}) => {
  try {
    const results: DailyReportResults = {
      fryerReport: null,
      dailyMeasurementReports: [],
      foodSampleReports: [],
    }

    // 1. Create fryer report with TPM level and new oil info
    if (tpmLevel) {
      results.fryerReport = await addFryerReport({
        fryer: selectedFryer.id,
        branch: branchId,
        tpmLevel: parseFloat(tpmLevel),
        newOil,
        newOilDate,
        userId,
      })

      if (newOil && newOilDate) {
        await editFryer({
          ...selectedFryer,
          lastOilChangeDate: newOilDate,
        })
      }
    }

    // 2. Create daily measurement reports for all text inputs
    for (const [name, value] of Object.entries(measurementValues)) {
      if (value) {
        const report = await addDailyMeasurementReport({
          branch: branchId,
          user: userId,
          fryer: selectedFryer.id,
          name,
          value,
        })
        results.dailyMeasurementReports.push(report)
      }
    }

    // 3. Upload images and create food sample reports
    for (const [name, imageData] of Object.entries(foodImages)) {
      if (imageData && imageData.file) {
        // Create a FormData object for the file upload
        const formData = new FormData()
        formData.append('file', imageData.file)
        formData.append('alt', `Food sample image for ${name}`)

        // Upload the image to media collection
        const mediaResult = await uploadMedia(formData)

        if (mediaResult.error || mediaResult.status !== 200 || !mediaResult.data) {
          throw new Error(mediaResult.error || 'Failed to upload image')
        }

        // Get the uploaded media ID
        const uploadedMedia = mediaResult.data

        // Create the food sample report with the uploaded image
        const reportResult = await payload.create({
          collection: 'foodSampleReports',
          data: {
            branch: branchId,
            user: userId,
            fryer: selectedFryer.id,
            name,
            image: uploadedMedia.url,
          },
        })

        results.foodSampleReports.push(reportResult)
      }
    }

    revalidatePath('/client')
    return { success: true, results }
  } catch (error: unknown) {
    console.error('Error processing complete report:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'An error occurred',
    }
  }
}

export async function getLastDaysFryerReports(branchId: number, days = 10) {
  const reports = await payload.find({
    collection: 'fryer-reports',
    where: {
      branch: { equals: branchId },
      createdAt: { greater_than: new Date(Date.now() - days * 24 * 60 * 60 * 1000) },
    },
    sort: '-createdAt',
    limit: days,
  })

  const fryerReports: { [key: string]: any[] } = {}

  // Group reports by fryer.name
  reports.docs.forEach((report) => {
    const fryer = typeof report.fryer === 'object' ? report.fryer : { name: report.fryer } // Ensure fryer is an object
    const fryerName = fryer.name || 'Unknown Fryer' // Default to 'Unknown Fryer' if name is not present

    if (!fryerReports[fryerName]) {
      fryerReports[fryerName] = []
    }
    fryerReports[fryerName].push(report)
  })

  return fryerReports
}
