"use client"

import type React from "react"

import { useState } from "react"
import { Paintbrush, Plus, Check } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"

interface ColorPickerProps {
  value: string
  onChange: (value: string) => void
  disabled?: boolean
}

export function ColorPicker({ value, onChange, disabled = false }: ColorPickerProps) {
  const [customColor, setCustomColor] = useState("#000000")
  const [isValidHex, setIsValidHex] = useState(true)

  const colors = [
    { value: "#FF5733", label: "Red" },
    { value: "#33FF57", label: "Green" },
    { value: "#3357FF", label: "Blue" },
    { value: "#FF33F5", label: "Pink" },
    { value: "#F5B700", label: "Yellow" },
    { value: "#8B33FF", label: "Purple" },
    { value: "#000000", label: "Black" },
  ]

  const validateHex = (hex: string) => {
    // Basic hex validation with regex
    return /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/.test(hex)
  }

  const handleCustomColorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newColor = e.target.value
    setCustomColor(newColor)

    // Add # if it's missing
    const colorWithHash = newColor.startsWith("#") ? newColor : `#${newColor}`

    // Validate the hex color
    const isValid = validateHex(colorWithHash)
    setIsValidHex(isValid)
  }

  const applyCustomColor = () => {
    if (isValidHex && !disabled) {
      // Ensure the color has a # prefix
      const colorWithHash = customColor.startsWith("#") ? customColor : `#${customColor}`
      onChange(colorWithHash)
    }
  }

  return (
    <div className={`flex items-center gap-3 ${disabled ? "opacity-50" : ""}`}>
      <Paintbrush className="h-6 w-6 text-red-600" />
      <div className="flex flex-wrap gap-2">
        {colors.map((color) => (
          <button
            key={color.value}
            onClick={() => !disabled && onChange(color.value)}
            className={`w-10 h-10 rounded-full transition-transform ${
              value === color.value ? "scale-110 ring-4 ring-gray-300" : ""
            }`}
            style={{ backgroundColor: color.value }}
            aria-label={`Set text color to ${color.label}`}
            title={color.label}
            disabled={disabled}
          />
        ))}

        <Popover>
          <PopoverTrigger asChild>
            <button
              className={`w-10 h-10 rounded-full bg-white border-2 border-dashed border-gray-300 flex items-center justify-center transition-transform hover:scale-110 ${disabled ? "cursor-not-allowed opacity-50" : ""}`}
              disabled={disabled}
              aria-label="Choose custom color"
              title="Custom Color"
            >
              <Plus className="h-5 w-5 text-gray-500" />
            </button>
          </PopoverTrigger>
          <PopoverContent className="w-80">
            <div className="space-y-4">
              <h3 className="font-bold text-lg">Custom Color</h3>
              <div className="flex items-center gap-2">
                <div
                  className="w-10 h-10 rounded-full border border-gray-200"
                  style={{ backgroundColor: isValidHex ? customColor : "#cccccc" }}
                />
                <div className="flex-1">
                  <Input
                    value={customColor}
                    onChange={handleCustomColorChange}
                    placeholder="#FF5733"
                    className={`font-mono ${!isValidHex ? "border-red-500" : ""}`}
                    disabled={disabled}
                  />
                  {!isValidHex && (
                    <p className="text-xs text-red-500 mt-1">Please enter a valid hex color (e.g., #FF5733)</p>
                  )}
                </div>
                <Button size="sm" onClick={applyCustomColor} disabled={!isValidHex || disabled} className="px-2">
                  <Check className="h-4 w-4" />
                </Button>
              </div>
              <div className="text-xs text-muted-foreground">
                Tip: You can enter any color code like #FF5733 or FF5733
              </div>
            </div>
          </PopoverContent>
        </Popover>
      </div>
    </div>
  )
}

