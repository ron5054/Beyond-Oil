'use server'
import payload from '@/payloadClient'
import { revalidatePath } from 'next/cache'

export const addFryerReport = async (data: {
  fryer: number
  branch: number
  createdBy: number
  newOil: boolean
  tpmLevel: number
}) => {
  try {
    const report = await payload.create({
      collection: 'fryer-reports',
      data: {
        fryer: data.fryer,
        branch: data.branch,
        createdBy: data.createdBy,
        newOil: data.newOil,
        tpmLevel: data.tpmLevel,
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

export const addDailyMeasurementReport = async (data: {
  branch: number
  user: number
  fryer: number
  name: string
  measurementId: number
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
