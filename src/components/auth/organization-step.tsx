"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { AlertCircle } from "lucide-react"

interface OrganizationStepProps {
  onContinue: (code: string) => void
}

export default function OrganizationStep({ onContinue }: OrganizationStepProps) {
  const [code, setCode] = useState("")
  const [error, setError] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (code.length < 3) {
      setError(true)
      return
    }
    localStorage.setItem("organizationCode", code)
    onContinue(code)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Input
          placeholder="Organization Code"
          value={code}
          onChange={(e) => {
            setCode(e.target.value)
            setError(false)
          }}
          className={`border-2 ${error ? "border-red-500" : "border-[#dfe3e8] focus-visible:ring-[#00a76f]"}`}
        />
        {error && (
          <div className="flex items-center gap-2 text-red-500 text-sm">
            <AlertCircle className="w-4 h-4" />
            Please enter your organization code
          </div>
        )}
      </div>
      <Button type="submit" className="w-full bg-[#00a76f] hover:bg-[#00a76f]/90">
        Continue
      </Button>
    </form>
  )
}

