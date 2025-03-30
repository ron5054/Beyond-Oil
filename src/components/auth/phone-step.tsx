"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface PhoneStepProps {
  onContinue: (phone: string) => void
}

export default function PhoneStep({ onContinue }: PhoneStepProps) {
  const [phone, setPhone] = useState("")
  const [location, setLocation] = useState("tel-aviv")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (phone) {
      onContinue(phone)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Select value={location} onValueChange={setLocation}>
        <SelectTrigger className="w-full">
          <SelectValue>
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-full bg-[#ffab00] flex items-center justify-center text-white">M</div>
              Tel Aviv
            </div>
          </SelectValue>
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="tel-aviv">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-full bg-[#ffab00] flex items-center justify-center text-white">M</div>
              Tel Aviv
            </div>
          </SelectItem>
        </SelectContent>
      </Select>

      <Input
        type="tel"
        placeholder="Phone Number"
        value={phone}
        onChange={(e) => setPhone(e.target.value)}
        className="border-2 border-[#dfe3e8] focus-visible:ring-[#00a76f]"
      />

      <Button type="submit" className="w-full bg-[#00a76f] hover:bg-[#00a76f]/90" disabled={!phone}>
        Continue
      </Button>
    </form>
  )
}

