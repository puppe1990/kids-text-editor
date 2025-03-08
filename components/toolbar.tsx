"use client"

import { FontSelector } from "./font-selector"
import { ColorPicker } from "./color-picker"
import { SizeSelector } from "./size-selector"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"

interface ToolbarProps {
  fontFamily: string
  setFontFamily: (font: string) => void
  fontSize: string
  setFontSize: (size: string) => void
  textColor: string
  setTextColor: (color: string) => void
  rainbowMode: boolean
  setRainbowMode: (enabled: boolean) => void
}

export function Toolbar({
  fontFamily,
  setFontFamily,
  fontSize,
  setFontSize,
  textColor,
  setTextColor,
  rainbowMode,
  setRainbowMode,
}: ToolbarProps) {
  return (
    <div className="bg-white p-4 rounded-xl shadow-md border-4 border-purple-400 flex flex-col gap-4">
      <div className="flex flex-wrap gap-4 items-center justify-between">
        <FontSelector value={fontFamily} onChange={setFontFamily} />
        <SizeSelector value={fontSize} onChange={setFontSize} />
        <div className="flex items-center space-x-2">
          <Switch
            id="rainbow-mode"
            checked={rainbowMode}
            onCheckedChange={setRainbowMode}
            className="data-[state=checked]:bg-gradient-to-r data-[state=checked]:from-red-500 data-[state=checked]:via-green-500 data-[state=checked]:to-blue-500"
          />
          <Label
            htmlFor="rainbow-mode"
            className="text-lg font-bold bg-gradient-to-r from-red-500 via-green-500 to-blue-500 bg-clip-text text-transparent"
          >
            Rainbow Mode
          </Label>
        </div>
      </div>

      <ColorPicker value={textColor} onChange={setTextColor} disabled={rainbowMode} />
    </div>
  )
}

