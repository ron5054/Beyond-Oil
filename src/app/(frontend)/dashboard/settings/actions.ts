'use server'

import { revalidatePath } from 'next/cache'
import { add, update, remove } from '@/lib/crudActions'
import { FoodSampleCreate } from 'interfaces'
import { FoodSample } from '@/payload-types'
import { Fryer, DailyMeasurement } from '@/payload-types'
import { DailyMeasurementCreate, FryerCreate } from 'interfaces'

export async function AddFryerToBranch(fryer: FryerCreate) {
  try {
    await add('fryers', fryer)
    revalidatePath('/dashboard/settings')
  } catch (error) {
    console.error('Error adding fryer to branch:', error)
    return false
  }
}

export async function editFryer(fryer: Fryer) {
  try {
    const { id, ...data } = fryer
    await update('fryers', id, data)
    revalidatePath('/dashboard/settings')
  } catch (error) {
    console.error('Error editing fryer:', error)
  }
}

export async function deleteFryer(id: number) {
  try {
    await remove('fryers', id)
    revalidatePath('/dashboard/settings')
  } catch (error) {
    console.error('Error deleting fryer:', error)
  }
}

export async function addDailyMeasurementToBranch(dailyMeasurement: DailyMeasurementCreate) {
  try {
    await add('dailyMeasurements', dailyMeasurement)
    revalidatePath('/dashboard/settings')
  } catch (error) {
    console.error('Error adding daily measurement to branch:', error)
    return false
  }
}

export async function editDailyMeasurement(dailyMeasurement: DailyMeasurement) {
  try {
    const { id, ...data } = dailyMeasurement
    await update('dailyMeasurements', id, data)
    revalidatePath('/dashboard/settings')
  } catch (error) {
    console.error('Error editing daily measurement:', error)
  }
}

export async function deleteDailyMeasurement(id: number) {
  try {
    await remove('dailyMeasurements', id)
    revalidatePath('/dashboard/settings')
  } catch (error) {
    console.error('Error deleting daily measurement:', error)
  }
}

export async function addFoodSampleToBranch(foodSample: FoodSampleCreate) {
  try {
    await add('foodSamples', foodSample)
    revalidatePath('/dashboard/settings')
  } catch (error) {
    console.error('Error adding food sample to branch:', error)
    return false
  }
}

export async function editFoodSample(foodSample: FoodSample) {
  try {
    const { id, ...data } = foodSample
    await update('foodSamples', id, data)
    revalidatePath('/dashboard/settings')
  } catch (error) {
    console.error('Error editing food sample:', error)
  }
}

export async function deleteFoodSample(id: number) {
  try {
    await remove('foodSamples', id)
    revalidatePath('/dashboard/settings')
  } catch (error) {
    console.error('Error deleting food sample:', error)
  }
}

export async function updateUser(formData: FormData) {
  const userId = Number(formData.get('userId'))

  const userData = {
    name: formData.get('name'),
    email: formData.get('email'),
    phoneNumber: formData.get('phoneNumber'),
  }

  try {
    await update('users', userId, userData)
    revalidatePath('/dashboard/settings')
  } catch (error) {
    console.error('Error updating user:', error)
  }
}

export async function addUser(formData: FormData) {
  const userData = {
    name: formData.get('name'),
    email: formData.get('email'),
    phoneNumber: formData.get('phoneNumber'),
    role: formData.get('role'),
    isActive: true,
    password: 'someRandomPassword',
    branch: formData.get('branchId') ? Number(formData.get('branchId')) : undefined,
  }

  try {
    await add('users', userData)
    revalidatePath('/dashboard/settings')
  } catch (error) {
    console.error('Error adding user:', error)
  }
}
