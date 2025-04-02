'use server'

import payload from '@/payloadClient'
import twilio from 'twilio'
import { cookies } from 'next/headers'
import { User } from '@/payload-types'
import { update } from '@/lib/crudActions'
import { revalidatePath } from 'next/cache'
import { sendOTPSchema, verifyOTPSchema } from 'schemas'

const twilioClient = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN)

export interface OTPResponse {
  success: boolean
  error?: string
  message?: string
  user?: User
}

export const sendOTP = async (countryCode: string, phoneNumber: string): Promise<OTPResponse> => {
  const validatedData = sendOTPSchema.parse({ countryCode, phoneNumber })

  try {
    const { user, error: userError } = await _findUserByPhoneNumber(validatedData.phoneNumber)

    if (userError || !user) {
      return {
        success: false,
        error: 'No user found with this phone number',
      }
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString()
    console.log('OTP:', otp)

    // Store OTP in user document with 5-minute expiration
    await update('users', Number(user.id), {
      otp,
      otpExpires: new Date(Date.now() + 5 * 60 * 1000).toISOString(),
    })

    // Use the actual production domain for Web OTP API
    const domain = 'beyond-oil-ten.vercel.app'

    await twilioClient.messages.create({
      body: `${otp} is your Beyond Oil verification code. Valid for 5 minutes. @${domain} #${otp}`,
      to: `${countryCode}${phoneNumber.replace(/[^\d]/g, '')}`,
      from: process.env.TWILIO_PHONE_NUMBER || '',
    })

    return {
      success: true,
      message: 'OTP sent successfully',
    }
  } catch (error) {
    console.error('Error sending OTP:', error)
    return {
      success: false,
      error: 'Failed to send OTP',
    }
  }
}

export const _findUserByPhoneNumber = async (
  phoneNumber: string,
): Promise<{ user?: User; error?: string }> => {
  const users = await payload.find({
    collection: 'users',
    where: {
      and: [
        {
          or: [
            { phoneNumber: { equals: phoneNumber } },
            { phoneNumber: { equals: `0${phoneNumber}` } },
          ],
        },
        { isActive: { equals: true } },
      ],
    },
  })

  if (users.totalDocs === 0) return { error: 'User not found' }

  const user = users.docs[0]
  return { user }
}

export const _validateOTP = async (
  user: User,
  otp: string,
): Promise<{ valid: boolean; error?: string }> => {
  if (!user.otp || !user.otpExpires) {
    return { valid: false, error: 'No OTP request found' }
  }

  if (new Date() > new Date(user.otpExpires)) {
    await update('users', Number(user.id), {
      otp: null,
      otpExpires: null,
    })
    return { valid: false, error: 'OTP has expired' }
  }

  if (user.otp !== otp) {
    console.log('Invalid OTP')
    return { valid: false, error: 'Invalid OTP' }
  }

  return { valid: true }
}

const clearOTP = async (userId: string | number): Promise<void> => {
  await update('users', Number(userId), {
    otp: null,
    otpExpires: null,
  })
}

const _generateAuthToken = async (user: User): Promise<{ token?: string; error?: string }> => {
  try {
    // Set password to a random value that we don't need to remember
    const randomPassword = Math.random().toString(36).slice(-10)

    await update('users', Number(user.id), {
      password: randomPassword,
    })

    // Login using the password we just set
    const result = await payload.login({
      collection: 'users',
      data: {
        email: user.email,
        password: randomPassword,
      },
    })

    return { token: result.token }
  } catch (error) {
    console.error('Error generating token:', error)
    return { error: 'Failed to generate authentication token' }
  }
}

const _setAuthCookie = async (token: string): Promise<void> => {
  const cookieStore = await cookies()
  cookieStore.set('payload-token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: 60 * 60 * 24 * 7, // 7 days
  })
}

export const verifyOTP = async (phoneNumber: string, otp: string): Promise<OTPResponse> => {
  try {
    const validatedData = verifyOTPSchema.parse({ phoneNumber, countryCode: '+1', otp })

    const { user, error: userError } = await _findUserByPhoneNumber(validatedData.phoneNumber)
    if (userError || !user) {
      return {
        success: false,
        error: userError,
      }
    }

    const { valid, error: otpError } = await _validateOTP(user, validatedData.otp as string)
    if (!valid) {
      return {
        success: false,
        error: otpError,
      }
    }

    await clearOTP(user.id)

    const { token, error: tokenError } = await _generateAuthToken(user)
    if (tokenError || !token) {
      return {
        success: false,
        error: tokenError,
      }
    }

    await _setAuthCookie(token)

    return {
      success: true,
      user,
    }
  } catch (error) {
    console.error('Error verifying OTP:', error)
    return {
      success: false,
      error: 'Failed to verify OTP',
    }
  }
}

export const logout = async () => {
  const cookieStore = await cookies()
  cookieStore.delete('payload-token')
  revalidatePath('/')
  return { success: true }
}
