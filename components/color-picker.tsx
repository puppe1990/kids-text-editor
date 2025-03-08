"use client"

import { useState, useEffect } from "react"
import { Paintbrush, Plus, X } from "lucide-react"
import { AdvancedColorPicker } from "./advanced-color-picker"

interface ColorPickerProps {
  value: string
  onChange: (value: string) => void
  disabled?: boolean
}

export function ColorPicker({ value, onChange, disabled = false }: ColorPickerProps) {
  const [showColorPicker, setShowColorPicker] = useState(false)
  const [mounted, setMounted] = useState(false)

  // Set mounted to true once component mounts
  useEffect(() => {
    setMounted(true)
  }, [])

  const colors = [
    { value: "#FF5733", label: "Red" },
    { value: "#33FF57", label: "Green" },
    { value: "#3357FF", label: "Blue" },
    { value: "#FF33F5", label: "Pink" },
    { value: "#F5B700", label: "Yellow" },
    { value: "#8B33FF", label: "Purple" },
    { value: "#000000", label: "Black" },
  ]

  const toggleColorPicker = () => {
    setShowColorPicker(!showColorPicker)
  }

  // If not mounted yet (during SSR), render a simplified version
  if (!mounted) {
    return (
      <div className={`flex items-center gap-3 ${disabled ? "opacity-50" : ""}`}>
        <Paintbrush className="h-6 w-6 text-red-600" />
        <div className="flex flex-wrap gap-2">
          {colors.map((color) => (
            <div key={color.value} className="w-10 h-10 rounded-full" style={{ backgroundColor: color.value }} />
          ))}
          <div className="w-10 h-10 rounded-full bg-white border-2 border-dashed border-gray-300 flex items-center justify-center">
            <Plus className="h-5 w-5 text-gray-500" />
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className={`flex flex-col gap-3 ${disabled ? "opacity-50" : ""}`}>
      <div className="flex items-center gap-3">
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
              type="button"
            />
          ))}

          <button
            type="button"
            onClick={toggleColorPicker}
            className={`w-10 h-10 rounded-full flex items-center justify-center transition-transform hover:scale-110 ${
              showColorPicker ? "ring-4 ring-blue-300 scale-110" : ""
            } ${disabled ? "cursor-not-allowed opacity-50" : ""}`}
            style={{ backgroundColor: value }}
            disabled={disabled}
            aria-label="More colors"
            title="More Colors"
          >
            <Plus className="h-5 w-5 text-white drop-shadow-[0_0_1px_rgba(0,0,0,0.5)]" />
          </button>
        </div>
      </div>

      {showColorPicker && (
        <div className="mt-2 p-4 bg-white border rounded-lg shadow-md">
          <div className="flex justify-between items-center mb-3">
            <h3 className="font-bold text-lg">Color Picker</h3>
            <button
              type="button"
              onClick={() => setShowColorPicker(false)}
              className="text-gray-500 hover:text-gray-700"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <AdvancedColorPicker value={value} onChange={onChange} />
        </div>
      )}
    </div>
  )
}

