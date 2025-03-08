"use client"

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { BoldIcon as FontBold } from "lucide-react"

interface FontSelectorProps {
  value: string
  onChange: (value: string) => void
}

export function FontSelector({ value, onChange }: FontSelectorProps) {
  const fonts = [
    { name: "Comic Sans MS", label: "Comic Sans" },
    { name: "Arial", label: "Arial" },
    { name: "Verdana", label: "Verdana" },
    { name: "Courier New", label: "Courier" },
    { name: "Georgia", label: "Georgia" },
  ]

  return (
    <div className="flex items-center gap-2">
      <FontBold className="h-6 w-6 text-purple-600" />
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger className="w-[180px] text-lg border-2 border-purple-300 rounded-lg">
          <SelectValue placeholder="Select Font" />
        </SelectTrigger>
        <SelectContent>
          {fonts.map((font) => (
            <SelectItem key={font.name} value={font.name} style={{ fontFamily: font.name }} className="text-lg">
              {font.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  )
}

