'use client'
import React from 'react'
import { ChevronDown } from 'lucide-react'

interface DropdownProps {
  id: string
  label: string
  options: readonly string[]
  value: string
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void
}

const Dropdown: React.FC<DropdownProps> = ({ id, label, options, value, onChange }) => (
  <div className="space-y-1">
    <label htmlFor={id} className="text-sm text-gray-500">
      {label}
    </label>
    <div className="relative">
      <select
        id={id}
        value={value}
        onChange={onChange}
        className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm appearance-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
      >
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
      <ChevronDown className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
    </div>
  </div>
)

export default Dropdown
