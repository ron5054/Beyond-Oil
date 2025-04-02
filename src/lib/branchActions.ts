'use server'
import payload from '@/payloadClient'
import { headers as getHeaders } from 'next/headers.js'
import { User } from '../payload-types'

import { Config } from '@/payload-types'

type CollectionSlug = keyof Config['collections']

import { BranchCreate } from 'interfaces'
import { Branch } from '@/payload-types'
import { add, getAll, remove } from '@/lib/crudActions'
import { revalidatePath } from 'next/cache'
import { branchSchema } from 'schemas'

export const addBranch = async (collection: CollectionSlug, branch: BranchCreate) => {
  try {
    const validatedBranch = branchSchema.parse(branch)

    const data = await payload.create({
      collection,
      data: validatedBranch,
    })
    revalidatePath('/dashboard/overview')
    return data
  } catch (error) {
    console.log('error', error)
    throw error
  }
}

export const getUser = async () => {
  const headers = await getHeaders()
  const { user } = await payload.auth({ headers })
  return user
}

export const getUsers = async () => {
  try {
    const users = await payload.find({
      collection: 'users',
      where: {
        role: {
          in: ['admin', 'manager'],
        },
        isActive: {
          equals: true,
        },
      },
    })
    return users.docs
  } catch (error) {
    console.error('Error fetching users:', error)
    return []
  }
}

export const getUserBranches = async (user?: User) => {
  try {
    if (!user || !user.role) return []

    type QueryType = {
      manager?: {
        equals: number | null
      }
    }

    const query: QueryType = user.role === 'admin' ? {} : { manager: { equals: user.id } }

    const { docs } = await payload.find({
      collection: 'branches',
      where: query,
    })

    return docs
  } catch (error) {
    console.error('Error fetching branches:', error)
    throw error
  }
}

export const getBranchById = async (branchId: string) => {
  try {
    // Step 1: Find the branch by ID
    const branchResult = await payload.find({
      collection: 'branches',
      where: { id: { equals: branchId } }, // Querying by branch ID
    })

    if (!branchResult.docs.length) {
      console.error(`No branch found with ID: ${branchId}`)
      return null
    }

    // Step 2: Fetch related collections
    const fryersResult = await payload.find({
      collection: 'fryers',
      where: { branch: { equals: branchId } },
    })

    const dailyMeasurements = await payload.find({
      collection: 'dailyMeasurements',
      where: { branch: { equals: branchId } },
    })

    const foodSampleResult = await payload.find({
      collection: 'foodSamples',
      where: { branch: { equals: branchId } },
    })

    const res = {
      branch: branchResult.docs[0],
      fryers: fryersResult.docs,
      dailyMeasurements: dailyMeasurements.docs,
      foodSamples: foodSampleResult.docs,
    }

    return res
  } catch (error) {
    console.error('Error fetching branch or related data:', error)
    return null
  }
}

export const getBranchUsers = async (branchId: string) => {
  const users = await payload.find({
    collection: 'users',
    where: { branch: { equals: branchId } },
  })
  return users.docs
}

export const getBranchFryers = async (branchId: string) => {
  const fryers = await payload.find({
    collection: 'fryers',
    where: {
      branch: { equals: branchId },
      isActive: { equals: true },
    },
  })

  return fryers.docs
}

export const getFryerReportsByDate = async (branchId: string, date?: Date) => {
  if (!branchId || branchId === 'undefined' || branchId === 'null' || branchId === 'NaN') {
    console.error('Invalid branch ID provided:', branchId)
    return []
  }

  // Use provided date or default to today
  const reportDate = date || new Date()
  const startDate = new Date(reportDate)
  startDate.setHours(0, 0, 0, 0)

  const endDate = new Date(startDate)
  endDate.setDate(endDate.getDate() + 1)

  const reports = await payload.find({
    collection: 'fryer-reports',
    where: {
      createdAt: {
        greater_than_equal: startDate,
        less_than: endDate,
      },
      branch: {
        equals: branchId,
      },
    },
  })
  return reports.docs
}

export const getBranchDailyMeasurements = async (branchId: string) => {
  const dailyMeasurements = await payload.find({
    collection: 'dailyMeasurements',
    where: { branch: { equals: branchId } },
  })
  return dailyMeasurements.docs
}

export const duplicateBranchWithRelations = async (branch: Branch) => {
  try {
    const newBranch = await duplicateBranch(branch)
    if (!newBranch) throw new Error('Failed to create new branch')

    await Promise.all([
      duplicateRelatedItems('dailyMeasurements', String(branch.id), String(newBranch.id)),
      duplicateRelatedItems('fryers', String(branch.id), String(newBranch.id)),
      duplicateRelatedItems('foodSamples', String(branch.id), String(newBranch.id)),
    ])

    revalidatePath('/dashboard')
    return { success: true }
  } catch (error) {
    console.error('Error duplicating branch and related items:', error)
    return { success: false, error }
  }
}

const duplicateBranch = async (branch: Branch) => {
  const { id, createdAt, updatedAt, ...branchData } = branch
  return await add('branches', {
    ...branchData,
    branchName: `Copy of ${branch.branchName}`,
  })
}

const duplicateRelatedItems = async (
  collection: CollectionSlug,
  oldBranchId: string,
  newBranchId: string,
) => {
  const items = await getAll(collection, {
    branch: {
      equals: oldBranchId,
    },
  })

  if (items?.docs?.length) {
    await Promise.all(
      items.docs.map((item) => {
        const { id, createdAt, updatedAt, ...itemData } = item

        // Check if the collection is 'fryers' and if lastOilChangeDate exists
        if (collection === 'fryers' && 'lastOilChangeDate' in itemData) {
          const { lastOilChangeDate, ...rest } = itemData
          return add(collection, {
            ...rest,
            branch: Number(newBranchId),
          })
        }

        return add(collection, {
          ...itemData,
          branch: Number(newBranchId),
        })
      }),
    )
  }
}

export const removeBranchWithRelations = async (branchId: string) => {
  try {
    await Promise.all([
      removeRelatedItems('dailyMeasurements', branchId),
      removeRelatedItems('fryers', branchId),
      removeRelatedItems('foodSamples', branchId),
      removeRelatedItems('fryer-reports', branchId),
      removeRelatedItems('foodSampleReports', branchId),
      removeRelatedItems('dailyMeasurementReports', branchId),
    ])
    await remove('branches', Number(branchId))
    revalidatePath('/dashboard/overview')
    return { success: true }
  } catch (error) {
    console.error('Error removing branch and related items:', error)
    return { success: false, error }
  }
}

const removeRelatedItems = async (collection: CollectionSlug, branchId: string) => {
  try {
    await payload.delete({
      collection,
      where: {
        branch: {
          equals: branchId,
        },
      },
    })
  } catch (error) {
    console.error(`Error bulk deleting ${collection} items:`, error)
  }
}
