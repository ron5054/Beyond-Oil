"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

interface OtpStepProps {
  onVerify: (code: string) => void
}

export default function OtpStep({ onVerify }: OtpStepProps) {
  const [otp, setOtp] = useState(["", "", "", "", "", ""])
  const inputRefs = useRef<(HTMLInputElement | null)[]>([])

  const handleChange = (index: number, value: string) => {
    if (value.length > 1) return

    const newOtp = [...otp]
    newOtp[index] = value
    setOtp(newOtp)

    // Move to next input if value is entered
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus()
    }
  }

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    // Move to previous input on backspace if current input is empty
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus()
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const code = otp.join("")
    if (code.length === 6) {
      onVerify(code)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <p className="text-[#637381] text-sm text-center">We've sent a verification code to your phone</p>

      <div className="flex justify-center gap-2">
        {otp.map((digit, index) => (
          <Input
            key={index}
            type="text"
            inputMode="numeric"
            pattern="\d*"
            maxLength={1}
            value={digit}
            onChange={(e) => handleChange(index, e.target.value)}
            onKeyDown={(e) => handleKeyDown(index, e)}
            ref={(el) => (inputRefs.current[index] = el)}
            className="w-10 h-12 text-center text-lg border-2 border-[#dfe3e8] focus-visible:ring-[#00a76f]"
          />
        ))}
      </div>

      <Button
        type="submit"
        className="w-full bg-[#00a76f] hover:bg-[#00a76f]/90"
        disabled={otp.some((digit) => !digit)}
      >
        Verify
      </Button>

      <div className="text-center space-y-1">
        <p className="text-sm text-[#637381]">Don't have a code?</p>
        <Button variant="link" className="text-[#00a76f] font-medium" onClick={() => setOtp(["", "", "", "", "", ""])}>
          Resend code
        </Button>
      </div>
    </form>
  )
}

