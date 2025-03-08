"use client"

import type React from "react"

import { useState } from "react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { TextIcon as TextSize } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

interface SizeSelectorProps {
  value: string
  onChange: (value: string) => void
}

export function SizeSelector({ value, onChange }: SizeSelectorProps) {
  const [customSize, setCustomSize] = useState("")
  const [showCustomInput, setShowCustomInput] = useState(false)

  const sizes = [
    { value: "18px", label: "Small" },
    { value: "24px", label: "Medium" },
    { value: "32px", label: "Large" },
    { value: "42px", label: "Extra Large" },
    { value: "custom", label: "Custom Size..." },
  ]

  const handleSelectChange = (newValue: string) => {
    if (newValue === "custom") {
      setShowCustomInput(true)
      // Extract current size number for initial value
      const currentSize = Number.parseInt(value.replace("px", ""))
      setCustomSize(currentSize.toString())
    } else {
      setShowCustomInput(false)
      onChange(newValue)
    }
  }

  const handleCustomSizeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newSize = e.target.value.replace(/[^0-9]/g, "")
    setCustomSize(newSize)
  }

  const applyCustomSize = () => {
    if (customSize) {
      const size = Number.parseInt(customSize)
      // Limit size to reasonable range
      if (size >= 8 && size <= 72) {
        onChange(`${size}px`)
        setShowCustomInput(false)
      }
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      applyCustomSize()
    }
  }

  // Get the display value for the select
  const getDisplayValue = () => {
    // Check if current value matches any preset
    const preset = sizes.find((size) => size.value === value)
    if (preset && preset.value !== "custom") {
      return preset.value
    }

    // If it's a custom size, show "Custom"
    if (value.endsWith("px")) {
      return "custom"
    }

    return value
  }

  return (
    <div className="flex items-center gap-2">
      <TextSize className="h-6 w-6 text-blue-600" />
      <div className="flex flex-col">
        <Select value={getDisplayValue()} onValueChange={handleSelectChange}>
          <SelectTrigger className="w-[180px] text-lg border-2 border-blue-300 rounded-lg">
            <SelectValue placeholder="Select Size" />
          </SelectTrigger>
          <SelectContent>
            {sizes.map((size) => (
              <SelectItem key={size.value} value={size.value} className="text-lg">
                {size.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {showCustomInput && (
          <div className="flex items-center gap-2 mt-2">
            <Input
              type="text"
              value={customSize}
              onChange={handleCustomSizeChange}
              onKeyDown={handleKeyDown}
              className="w-20 text-lg"
              placeholder="Size"
              autoFocus
            />
            <span className="text-sm">px</span>
            <Button onClick={applyCustomSize} size="sm" className="ml-2">
              Apply
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}

