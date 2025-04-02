'use client'

import React, { useRef, KeyboardEvent, ClipboardEvent, useEffect } from 'react'
import { Input } from '@/components/ui/input'

interface OTPInputProps {
  length: number
  value: string
  onChange: (value: string) => void
}

const OTPInput: React.FC<OTPInputProps> = ({ length, value, onChange }) => {
  const inputRefs = useRef<(HTMLInputElement | null)[]>([])

  // Initialize array with current value or empty strings
  const valueArray = value.split('')
  while (valueArray.length < length) {
    valueArray.push('')
  }

  // Auto-focus the first input field when component mounts
  useEffect(() => {
    // Short timeout to ensure DOM is fully rendered
    const timer = setTimeout(() => {
      if (inputRefs.current[0]) {
        inputRefs.current[0].focus()
      }
    }, 100)

    return () => clearTimeout(timer)
  }, [])

  // Set up Web OTP API for automatic SMS code capture
  useEffect(() => {
    // Skip if browser doesn't support AbortController or Web OTP API
    if (typeof AbortController === 'undefined' || !('OTPCredential' in window)) {
      return
    }

    const ac = new AbortController()

    const setupOTPListener = async () => {
      try {
        // Use the appropriate type for navigator.credentials.get
        // Without specifying the exact credential type that TypeScript doesn't know about
        const credential = await (navigator.credentials as any).get({
          otp: { transport: ['sms'] },
          signal: ac.signal,
        })

        // Extract the code if available
        if (credential && 'code' in credential) {
          // Fill the OTP inputs with the received code
          const otpCode = credential.code.slice(0, length)
          onChange(otpCode)

          // Log success for debugging
          console.log('OTP auto-filled successfully:', otpCode)
        }
      } catch (error: unknown) {
        // Only log non-abort errors
        if (!(error instanceof DOMException && error.name === 'AbortError')) {
          console.error('Error with Web OTP API:', error)
        }
      }
    }

    // Call the setup function
    setupOTPListener()

    // Clean up by aborting the credential request
    return () => ac.abort()
  }, [length, onChange])

  // Handle input change
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
    const newChar = e.target.value.slice(-1)
    if (newChar && !/^\d$/.test(newChar)) return

    // Create a new array from the current value
    const newValue = [...valueArray]
    newValue[index] = newChar

    // Update parent component
    onChange(newValue.join(''))

    // Move to next input if this one is filled and not the last
    if (newChar && index < length - 1) {
      inputRefs.current[index + 1]?.focus()
    }
  }

  // Handle backspace
  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>, index: number) => {
    if (e.key === 'Backspace') {
      if (!valueArray[index] && index > 0) {
        // If current input is empty and backspace is pressed, move to previous input
        const newValue = [...valueArray]
        newValue[index - 1] = ''
        onChange(newValue.join(''))
        inputRefs.current[index - 1]?.focus()
      }
    } else if (e.key === 'ArrowLeft' && index > 0) {
      // Move to previous input on left arrow
      inputRefs.current[index - 1]?.focus()
    } else if (e.key === 'ArrowRight' && index < length - 1) {
      // Move to next input on right arrow
      inputRefs.current[index + 1]?.focus()
    }
  }

  // Handle paste event
  const handlePaste = (e: ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault()
    const pastedData = e.clipboardData.getData('text/plain').trim()

    // Only use numeric characters and limit to our length
    const numericData = pastedData.replace(/\D/g, '').slice(0, length)

    if (numericData) {
      // Fill as many inputs as we have characters
      const newValue = numericData.padEnd(length, '').split('').slice(0, length)
      onChange(newValue.join(''))

      // Focus the next empty input or the last one if all filled
      const nextIndex = Math.min(numericData.length, length - 1)
      inputRefs.current[nextIndex]?.focus()
    }
  }

  return (
    <div className="flex gap-2 justify-center">
      {Array.from({ length }).map((_, index) => (
        <div key={index} className="w-16">
          <Input
            ref={(el) => {
              // Store the input element in the array
              inputRefs.current[index] = el
            }}
            type="text"
            inputMode="numeric"
            pattern="[0-9]*"
            maxLength={1}
            value={valueArray[index] || ''}
            onChange={(e) => handleChange(e, index)}
            onKeyDown={(e) => handleKeyDown(e, index)}
            onPaste={handlePaste}
            className="text-center text-xl h-16 font-semibold"
            aria-label={`OTP digit ${index + 1}`}
            autoComplete={index === 0 ? 'one-time-code' : 'off'}
          />
        </div>
      ))}
    </div>
  )
}

export default OTPInput
