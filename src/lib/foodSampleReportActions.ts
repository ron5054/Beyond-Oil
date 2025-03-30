'use server'
import payload from '@/payloadClient'
import { revalidatePath } from 'next/cache'
import { supabase } from './supabaseStorage'

export const getFoodSampleReportsByBranchId = async (branchId: string, date?: Date) => {
  try {
    if (!branchId || branchId === 'undefined' || branchId === 'null' || branchId === 'NaN') {
      console.error('Invalid branch ID provided to getFoodSampleReportsByBranchId:', branchId)
      return []
    }

    // Use provided date or default to today
    const targetDate = date || new Date()
    // Set to start of the day
    targetDate.setHours(0, 0, 0, 0)

    // Get end of the day
    const endDate = new Date(targetDate)
    endDate.setHours(23, 59, 59, 999)

    const foodSampleReports = await payload.find({
      collection: 'foodSampleReports',
      where: {
        branch: { equals: branchId },
        createdAt: {
          greater_than_equal: targetDate.toISOString(),
          less_than_equal: endDate.toISOString(),
        },
      },
    })
    return foodSampleReports.docs
  } catch (error) {
    console.error('Error fetching food sample reports:', error)
    return []
  }
}

export const getFoodSamplesNeeded = async (branchId: string) => {
  try {
    if (!branchId || branchId === 'undefined' || branchId === 'null' || branchId === 'NaN') {
      console.error('Invalid branch ID provided to getFoodSamplesNeeded:', branchId)
      return []
    }

    const foodSamplesNeeded = await payload.find({
      collection: 'foodSamples',
      where: { branch: { equals: branchId }, isActive: { equals: true } },
    })
    return foodSamplesNeeded.docs
  } catch (error) {
    console.error('Error fetching food samples needed:', error)
    return []
  }
}

export const addFoodSampleReport = async (data: {
  branch: number
  user: number
  name: string
  image: string
  fryer?: number
}) => {
  try {
    const report = await payload.create({
      collection: 'foodSampleReports',
      data: {
        branch: data.branch,
        user: data.user,
        name: data.name,
        image: data.image,
        fryer: data.fryer || null,
      },
    })
    revalidatePath('/client')
    return report
  } catch (error: unknown) {
    console.error('Error creating food sample report:', error)
    return {
      error: error instanceof Error ? error.message : 'An error occurred',
      status: 500,
    }
  }
}

export const uploadMedia = async (formData: FormData) => {
  try {
    const file = formData.get('file')

    if (!file || typeof file === 'string') return { error: 'No valid file provided', status: 400 }

    try {
      const bytes = await file.arrayBuffer()
      const buffer = Buffer.from(bytes)
      const filename = `${Date.now()}-${file.name}`

      const { data: uploadData, error } = await supabase.storage
        .from('images')
        .upload(`media/${filename}`, buffer, {
          contentType: file.type,
          upsert: true,
        })

      if (error) {
        console.error('Supabase upload error:', error)
        return {
          error: error.message || 'Error uploading to storage',
          status: 500,
        }
      }

      const { data: publicUrl } = supabase.storage.from('images').getPublicUrl(`media/${filename}`)

      if (!publicUrl || !publicUrl.publicUrl) {
        throw new Error('Failed to get public URL for uploaded image')
      }

      return {
        data: { url: publicUrl.publicUrl },
        status: 200,
      }
    } catch (uploadError) {
      console.error('Upload processing error:', uploadError)
      return {
        error: uploadError instanceof Error ? uploadError.message : 'Error processing upload',
        status: 500,
      }
    }
  } catch (error: unknown) {
    console.error('Error uploading media:', error)
    return {
      error: error instanceof Error ? error.message : 'An error occurred during upload',
      status: 500,
    }
  }
}
