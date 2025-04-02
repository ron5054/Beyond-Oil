'use client'

import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import OTPInput from './OTPInput'
import { sendOTP, verifyOTP } from '@/lib/authActions'
import CountryCodeCombobox from './CountryCodeCombobox'
import { useForm } from '@tanstack/react-form'
import { LoginFormData } from 'schemas'

const LoginForm = () => {
  const router = useRouter()
  const [showOtpInput, setShowOtpInput] = useState(false)
  const [isVerifying, setIsVerifying] = useState(false)
  const [isLoggingIn, setIsLoggingIn] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [message, setMessage] = useState<string | null>(null)

  // @ts-ignore - Workaround for type issues with zod schema
  const form = useForm<LoginFormData>({
    defaultValues: {
      phoneNumber: '',
      countryCode: '+1',
      otp: '',
    },
    onSubmit: async ({ value }) => {
      try {
        await handleSendOTP(value)
      } catch (error) {
        console.error('Error in form submission:', error)
        setError(error instanceof Error ? error.message : 'An unexpected error occurred')
      }
    },
  })

  const handleSendOTP = async (values: LoginFormData) => {
    if (!values.phoneNumber) return

    try {
      setIsVerifying(true)
      setError(null)
      setMessage(null)

      const { success, error, message } = await sendOTP(values.countryCode, values.phoneNumber)

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

  const handleVerifyOTP = async (values: LoginFormData) => {
    if (!values.phoneNumber || !values.otp || values.otp.length < 6) return

    try {
      setIsVerifying(true)
      setError(null)
      setMessage(null)

      const { success, error, user } = await verifyOTP(values.phoneNumber, values.otp)

      if (success && user) {
        setIsLoggingIn(true)

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

      const result = await sendOTP(form.state.values.countryCode, form.state.values.phoneNumber)

      if (result.success) setMessage('Verification code resent')
      else setError(result.error || 'Failed to resend verification code')
    } catch (err) {
      setError('An unexpected error occurred')
    } finally {
      setIsVerifying(false)
    }
  }

  const getButtonText = (
    isShowingOtp: boolean,
    isVerifyingState: boolean,
    isLoggingInState: boolean,
  ) => {
    if (isShowingOtp) {
      if (isLoggingInState) return 'Logging in...'
      if (isVerifyingState) return 'Verifying...'
      return 'Verify'
    } else {
      if (isVerifyingState) return 'Sending code...'
      return 'Send Code'
    }
  }

  const getHeadingText = (
    isShowingOtp: boolean,
    isVerifyingState: boolean,
    isLoggingInState: boolean,
  ) => {
    if (isLoggingInState) return 'Logging in...'
    if (isVerifyingState && isShowingOtp) return 'Verifying...'
    if (isShowingOtp) return 'Verify Your Number'
    return 'Enter Your Phone Number'
  }

  return (
    <>
      <form
        onSubmit={(e) => {
          e.preventDefault()
          e.stopPropagation()
          form.handleSubmit()
        }}
        className="space-y-4 py-4 bg-white rounded-lg p-6 border border-gray-200 shadow-sm absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[95%] max-w-md sm:max-w-lg md:max-w-xl lg:max-w-2xl !max-w-[26rem]"
      >
        {error && <div className="bg-red-50 text-red-600 p-3 rounded-md text-sm">{error}</div>}
        {message && (
          <div className="bg-green-50 text-green-600 p-3 rounded-md text-sm">{message}</div>
        )}

        <h1 className="text-2xl font-bold text-center">
          {getHeadingText(showOtpInput, isVerifying, isLoggingIn)}
        </h1>

        {showOtpInput ? (
          <>
            <p className="text-gray-500 text-center">
              Enter the verification code we sent to your phone
            </p>

            <div className="py-4">
              <form.Field name="otp">
                {(field) => (
                  <>
                    <OTPInput
                      length={6}
                      value={field.state.value || ''}
                      onChange={(value: string) => {
                        handleVerifyOTP({ ...form.state.values, otp: value })
                        field.handleChange(value)
                      }}
                    />
                    {field.state.meta.errors && field.state.meta.errors.length > 0 && (
                      <div className="text-xs text-red-500 text-center mt-2">
                        {typeof field.state.meta.errors[0] === 'string'
                          ? field.state.meta.errors[0]
                          : 'Invalid value'}
                      </div>
                    )}
                  </>
                )}
              </form.Field>
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
            <div className="grid grid-cols-[1fr_1.5fr] gap-2">
              <form.Field name="countryCode">
                {(field) => (
                  <CountryCodeCombobox
                    value={field.state.value}
                    onChange={(value) => field.handleChange(value)}
                  />
                )}
              </form.Field>

              <form.Field name="phoneNumber">
                {(field) => (
                  <>
                    <Input
                      id={field.name}
                      name={field.name}
                      value={field.state.value}
                      onChange={(e) => field.handleChange(e.target.value.replace(/[^0-9]/g, ''))}
                      onBlur={field.handleBlur}
                      disabled={isVerifying}
                      required
                      placeholder="xxxxxxxxx"
                    />
                    {field.state.meta.errors && field.state.meta.errors.length > 0 && (
                      <div className="text-xs text-red-500">
                        {typeof field.state.meta.errors[0] === 'string'
                          ? field.state.meta.errors[0]
                          : 'Invalid value'}
                      </div>
                    )}
                  </>
                )}
              </form.Field>
            </div>

            <div className="pt-2">
              <form.Subscribe
                selector={(state) => [
                  !showOtpInput ? !!state.values.phoneNumber : state.values.otp?.length === 6,
                  isVerifying,
                  isLoggingIn,
                ]}
              >
                {([isValid, isVerifyingState, isLoggingInState]) => (
                  <>
                    <Button
                      type="submit"
                      disabled={!isValid || isVerifyingState || isLoggingInState}
                      className={`w-full !cursor-pointer ${
                        !isValid || isVerifyingState || isLoggingInState
                          ? 'bg-gray-400 text-white cursor-not-allowed'
                          : 'bg-[#55bb47] text-white'
                      }`}
                    >
                      {getButtonText(showOtpInput, isVerifyingState, isLoggingInState)}
                    </Button>
                  </>
                )}
              </form.Subscribe>
            </div>
          </>
        )}
      </form>
    </>
  )
}

export default LoginForm
