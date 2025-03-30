import { z } from 'zod'

export const branchSchema = z.object({
  branchName: z.string().min(1, 'Branch name is required'),
  branchCode: z.string().min(1, 'Branch code is required'),
  phoneNumber: z.string().regex(/^\+?\d{7,15}$/, 'Invalid phone number'),
  address: z.string().min(1, 'Address is required'),
  city: z.string().min(1, 'City is required'),
  state: z.string().min(1, 'State is required'),
  zipCode: z.string().min(1, 'Zip code is required'),
  country: z.string().min(1, 'Country is required'),
})

// Define TypeScript type for better autocomplete support
export type BranchFormData = z.infer<typeof branchSchema>
