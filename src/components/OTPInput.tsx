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
    // Skip if browser doesn't support Web OTP API
    if (typeof window === 'undefined') {
      return
    }

    // Check if OTP API is available (since TypeScript doesn't know about it)
    if (!('credentials' in navigator) || !('OTPCredential' in window)) {
      console.log('Web OTP API not supported in this browser')
      return
    }

    // Create abort controller for cleanup
    const ac = new AbortController()

    const setupOTPListener = async () => {
      try {
        console.log('Setting up Web OTP API listener...')

        // Type definition for OTP credential
        interface OTPCredential {
          code: string
        }

        // Use any type for now since TypeScript doesn't recognize the OTP property
        const credential = (await (navigator.credentials as any).get({
          otp: { transport: ['sms'] },
          signal: ac.signal,
        })) as OTPCredential | null

        if (!credential) {
          console.log('No OTP credential received')
          return
        }

        console.log('OTP credential received:', credential)

        // Check if we received a valid credential with code
        if ('code' in credential) {
          // Get the OTP code and limit to our expected length
          const otpCode = credential.code.slice(0, length)
          console.log('Received OTP code:', otpCode)

          // Apply the OTP manually to each input field to ensure UI updates
          for (let i = 0; i < otpCode.length && i < length; i++) {
            const inputRef = inputRefs.current[i]
            if (inputRef) {
              const nativeInputValueSetter = Object.getOwnPropertyDescriptor(
                window.HTMLInputElement.prototype,
                'value',
              )?.set

              if (nativeInputValueSetter) {
                nativeInputValueSetter.call(inputRef, otpCode[i])

                // Dispatch input event to trigger React's synthetic events
                const event = new Event('input', { bubbles: true })
                inputRef.dispatchEvent(event)
              }
            }
          }

          // Update the state once to ensure proper form state
          onChange(otpCode)

          // Focus the last input to indicate completion to the user
          if (inputRefs.current[length - 1]) {
            inputRefs.current[length - 1]?.focus()
          }
        }
      } catch (error) {
        // Only log non-abort errors
        if (!(error instanceof DOMException && error.name === 'AbortError')) {
          console.error('Error with Web OTP API:', error)
        }
      }
    }

    // Start listening for OTP
    setupOTPListener()

    // Clean up by aborting the credential request when component unmounts
    return () => {
      console.log('Cleaning up Web OTP listener')
      ac.abort()
    }
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
      onChange(numericData.padEnd(length, '').slice(0, length))

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
