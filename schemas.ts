import { z } from 'zod'

export const branchSchema = z.object({
  branchName: z.string().min(1, 'Branch name is required'),
  branchCode: z.string().min(1, 'Branch code is required'),
  phoneNumber: z.string().min(4, 'Invalid phone number'),
  address: z.string().min(1, 'Address is required'),
  city: z.string().min(3, 'City is required'),
  state: z.string().min(1, 'State is required'),
  zipCode: z.string().min(1, 'Zip code is required'),
  country: z.enum(['il', 'us']),
  chainName: z.enum([
    'KFC',
    'McDonalds',
    'Burger King',
    'Wendys',
    'Taco Bell',
    'Subway',
    'Papa Johns',
    'Other',
  ]),
  logo: z.string().nullable(),
  filterTime: z.enum([
    '0:00',
    '1:00',
    '2:00',
    '3:00',
    '4:00',
    '5:00',
    '6:00',
    '7:00',
    '8:00',
    '9:00',
    '10:00',
    '11:00',
    '12:00',
    '13:00',
    '14:00',
    '15:00',
    '16:00',
    '17:00',
    '18:00',
    '19:00',
    '20:00',
    '21:00',
    '22:00',
    '23:00',
  ]),
  timezone: z.enum([
    'Jerusalem (GMT+2)',
    'New York (GMT-5)',
    'Los Angeles (GMT-8)',
    'Chicago (GMT-6)',
    'Denver (GMT-7)',
    'Phoenix (GMT-7, no DST)',
    'Anchorage (GMT-9)',
    'Honolulu (GMT-10)',
  ]),
  manager: z.number().nullable(),
})

// Define TypeScript type for better autocomplete support
export type BranchFormData = z.infer<typeof branchSchema>

export const loginSchema = z.object({
  phoneNumber: z.string().min(1, 'Phone number is required'),
  countryCode: z.string().min(1, 'Country code is required'),
  otp: z.string().optional(),
})

export const verifyOTPSchema = z.object({
  phoneNumber: z.string().min(1, 'Phone number is required'),
  countryCode: z.string().min(1, 'Country code is required'),
  otp: z.string().length(6, 'OTP must be 6 digits'),
})

export const sendOTPSchema = z.object({
  phoneNumber: z.string().min(1, 'Phone number is required'),
  countryCode: z.string().min(1, 'Country code is required'),
})

export type LoginFormData = z.infer<typeof loginSchema>
