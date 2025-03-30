'use server'
import payload from '@/payloadClient'
import { Config } from '@/payload-types'
import { revalidatePath } from 'next/cache'

type CollectionSlug = keyof Config['collections']
type PayloadData = Record<string, unknown>
type PayloadWhere = Record<string, any>

export const toggle = async (collection: CollectionSlug, id: number, isActive: boolean) => {
  const response = await payload.update({
    collection,
    id,
    data: { isActive },
  })
  return response
}

export const add = async (collection: CollectionSlug, data: PayloadData) => {
  const response = await payload.create({
    collection,
    data,
  })
  return response
}

export const update = async (collection: CollectionSlug, id: number, data: PayloadData) => {
  const response = await payload.update({
    collection,
    id,
    data,
  })
  revalidatePath('/dashboard/settings')
  return response
}

export const remove = async (collection: CollectionSlug, id: number) => {
  await payload.delete({
    collection,
    id,
  })
  revalidatePath('/dashboard/settings')
}

export const getAll = async (collection: CollectionSlug, where?: PayloadWhere) => {
  const response = await payload.find({
    collection,
    where,
  })
  return response
}
