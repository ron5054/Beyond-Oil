'use client'

import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import OTPInput from './OTPInput'
import { sendOTP, verifyOTP } from '@/lib/authActions'
import { User } from '@/payload-types'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

const LoginForm = () => {
  const router = useRouter()
  const [phoneNumber, setPhoneNumber] = useState('')
  const [countryCode, setCountryCode] = useState('+1')
  const [otp, setOtp] = useState('')
  const [showOtpInput, setShowOtpInput] = useState(false)
  const [isVerifying, setIsVerifying] = useState(false)
  const [isLoggingIn, setIsLoggingIn] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [message, setMessage] = useState<string | null>(null)
  const [user, setUser] = useState<User | null>(null)

  useEffect(() => {
    if (otp.length === 6) handleVerifyOTP()
  }, [otp])

  const handleSendOTP = async (e?: React.FormEvent) => {
    e?.preventDefault()

    if (!phoneNumber) return

    try {
      setIsVerifying(true)
      setError(null)
      setMessage(null)

      const { success, error, message } = await sendOTP(countryCode, phoneNumber)

      if (success) {
        setMessage(message || 'Verification code sent')
        setShowOtpInput(true)
      } else setError(error || 'Failed to send verification code')
    } catch (err) {
      setError('An unexpected error occurred')
    } finally {
      setIsVerifying(false)
    }
  }

  const handleVerifyOTP = async (e?: React.FormEvent) => {
    e?.preventDefault()

    if (!phoneNumber || !otp || otp.length < 6) return

    try {
      setIsVerifying(true)
      setError(null)
      setMessage(null)

      const { success, error, user } = await verifyOTP(phoneNumber, otp)

      if (success && user) {
        setIsLoggingIn(true)
        setUser(user)

        if (user.role === 'admin') {
          router.push('/dashboard')
        } else if (user.role === 'chef') {
          router.push('/client')
        } else {
          router.push('/')
        }
      } else setError(error || 'Invalid verification code')
    } catch (err) {
      setError('An unexpected error occurred')
    } finally {
      setIsVerifying(false)
    }
  }

  const handleResendOTP = async () => {
    try {
      setIsVerifying(true)
      setError(null)

      const result = await sendOTP(countryCode, phoneNumber)

      if (result.success) setMessage('Verification code resent')
      else setError(result.error || 'Failed to resend verification code')
    } catch (err) {
      setError('An unexpected error occurred')
    } finally {
      setIsVerifying(false)
    }
  }

  const getButtonText = () => {
    if (showOtpInput) {
      if (isLoggingIn) return 'Logging in...'
      if (isVerifying) return 'Verifying...'
      return 'Verify'
    } else {
      if (isVerifying) return 'Sending code...'
      return 'Send Code'
    }
  }

  return (
    <>
      <form
        onSubmit={showOtpInput ? handleVerifyOTP : handleSendOTP}
        className="space-y-4 py-4 bg-white rounded-lg p-6 border border-gray-200 shadow-sm absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[95%] max-w-md sm:max-w-lg md:max-w-xl lg:max-w-2xl !max-w-[26rem]"
      >
        {error && <div className="bg-red-50 text-red-600 p-3 rounded-md text-sm">{error}</div>}
        {message && (
          <div className="bg-green-50 text-green-600 p-3 rounded-md text-sm">{message}</div>
        )}

        <h1 className="text-2xl font-bold text-center">
          {showOtpInput ? 'Verify Your Number' : 'Enter Your Phone Number'}
        </h1>

        {showOtpInput ? (
          <>
            <p className="text-gray-500 text-center">
              Enter the verification code we sent to your phone
            </p>

            <div className="py-4">
              <OTPInput length={6} value={otp} onChange={setOtp} />
            </div>

            <div className="flex justify-center gap-2 pt-2 text-sm">
              <span className="text-gray-600">Did you receive a code?</span>
              <button
                type="button"
                onClick={handleResendOTP}
                disabled={isVerifying || isLoggingIn}
                className={`font-medium ${
                  isVerifying || isLoggingIn ? 'text-gray-400 cursor-not-allowed' : 'text-[#55bb47]'
                }`}
              >
                Resend code
              </button>
            </div>

            <button
              type="button"
              onClick={() => setShowOtpInput(false)}
              disabled={isVerifying || isLoggingIn}
              className={`flex items-center justify-center gap-2 w-full mt-4 ${
                isVerifying || isLoggingIn ? 'text-gray-400 cursor-not-allowed' : 'text-gray-600'
              }`}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="w-4 h-4"
              >
                <path d="m15 18-6-6 6-6" />
              </svg>
              Back
            </button>
          </>
        ) : (
          <>
            <div className="grid grid-cols-[1fr_2fr] gap-2">
              <Select name="countryCode" value={countryCode} onValueChange={setCountryCode}>
                <SelectTrigger>
                  <SelectValue placeholder="+1" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="+1">+1</SelectItem>
                  <SelectItem value="+972">+972</SelectItem>
                </SelectContent>
              </Select>
              <Input
                id="phoneNumber"
                name="phoneNumber"
                onChange={(e) => setPhoneNumber(e.target.value.replace(/[^0-9]/g, ''))}
                disabled={isVerifying}
                required
                placeholder="xxxxxxxxx"
              />
            </div>

            <div className="pt-2">
              <Button
                type="submit"
                disabled={!phoneNumber || isVerifying}
                className={`w-full !cursor-pointer ${
                  !phoneNumber || isVerifying
                    ? 'bg-gray-400 text-white cursor-not-allowed'
                    : 'bg-[#55bb47] text-white'
                }`}
              >
                {getButtonText()}
              </Button>
            </div>
          </>
        )}
      </form>
    </>
  )
}

export default LoginForm
