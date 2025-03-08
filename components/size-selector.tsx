"use client"

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { TextIcon as TextSize } from "lucide-react"

interface SizeSelectorProps {
  value: string
  onChange: (value: string) => void
}

export function SizeSelector({ value, onChange }: SizeSelectorProps) {
  const sizes = [
    { value: "18px", label: "Small" },
    { value: "24px", label: "Medium" },
    { value: "32px", label: "Large" },
    { value: "42px", label: "Extra Large" },
  ]

  return (
    <div className="flex items-center gap-2">
      <TextSize className="h-6 w-6 text-blue-600" />
      <Select value={value} onValueChange={onChange}>
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
    </div>
  )
}

