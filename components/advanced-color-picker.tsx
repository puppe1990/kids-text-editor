"use client"

import type React from "react"

import { useEffect, useRef, useState } from "react"
import { cn } from "@/lib/utils"
import { Copy } from "lucide-react"
import { Button } from "@/components/ui/button"

interface ColorPickerProps {
  value: string
  onChange: (color: string) => void
  className?: string
}

interface Position {
  x: number
  y: number
}

interface RGB {
  r: number
  g: number
  b: number
}

interface HSV {
  h: number
  s: number
  v: number
}

export function AdvancedColorPicker({ value, onChange, className }: ColorPickerProps) {
  const [isDragging, setIsDragging] = useState(false)
  const [isSliderDragging, setIsSliderDragging] = useState(false)
  const [position, setPosition] = useState<Position>({ x: 0, y: 0 })
  const [sliderPosition, setSliderPosition] = useState(0)
  const [currentHue, setCurrentHue] = useState(0)
  const [currentColor, setCurrentColor] = useState<RGB>({ r: 255, g: 0, b: 0 })

  const gradientRef = useRef<HTMLCanvasElement>(null)
  const sliderRef = useRef<HTMLCanvasElement>(null)
  const gradientWrapperRef = useRef<HTMLDivElement>(null)
  const sliderWrapperRef = useRef<HTMLDivElement>(null)

  // Convert hex to RGB
  const hexToRgb = (hex: string): RGB => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
    return result
      ? {
          r: Number.parseInt(result[1], 16),
          g: Number.parseInt(result[2], 16),
          b: Number.parseInt(result[3], 16),
        }
      : { r: 255, g: 0, b: 0 }
  }

  // Convert RGB to hex
  const rgbToHex = (r: number, g: number, b: number): string => {
    return (
      "#" +
      [r, g, b]
        .map((x) => {
          const hex = x.toString(16)
          return hex.length === 1 ? "0" + hex : hex
        })
        .join("")
    )
  }

  // Convert RGB to HSV
  const rgbToHsv = (r: number, g: number, b: number): HSV => {
    r /= 255
    g /= 255
    b /= 255

    const max = Math.max(r, g, b)
    const min = Math.min(r, g, b)
    const d = max - min
    let h = 0
    const s = max === 0 ? 0 : d / max
    const v = max

    if (max !== min) {
      switch (max) {
        case r:
          h = (g - b) / d + (g < b ? 6 : 0)
          break
        case g:
          h = (b - r) / d + 2
          break
        case b:
          h = (r - g) / d + 4
          break
      }
      h /= 6
    }

    return {
      h: h * 360,
      s: s * 100,
      v: v * 100,
    }
  }

  // Convert RGB to HSL
  const rgbToHsl = (r: number, g: number, b: number): { h: number; s: number; l: number } => {
    r /= 255
    g /= 255
    b /= 255

    const max = Math.max(r, g, b)
    const min = Math.min(r, g, b)
    let h = 0
    let s = 0
    const l = (max + min) / 2

    if (max !== min) {
      const d = max - min
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min)

      switch (max) {
        case r:
          h = (g - b) / d + (g < b ? 6 : 0)
          break
        case g:
          h = (b - r) / d + 2
          break
        case b:
          h = (r - g) / d + 4
          break
      }
      h /= 6
    }

    return {
      h: Math.round(h * 360),
      s: Math.round(s * 100),
      l: Math.round(l * 100),
    }
  }

  // Convert RGB to CMYK
  const rgbToCmyk = (r: number, g: number, b: number): { c: number; m: number; y: number; k: number } => {
    if (r === 0 && g === 0 && b === 0) {
      return { c: 0, m: 0, y: 0, k: 100 }
    }

    let c = 1 - r / 255
    let m = 1 - g / 255
    let y = 1 - b / 255

    const k = Math.min(c, m, y)

    c = Math.round(((c - k) / (1 - k)) * 100) || 0
    m = Math.round(((m - k) / (1 - k)) * 100) || 0
    y = Math.round(((y - k) / (1 - k)) * 100) || 0
    const kPercent = Math.round(k * 100)

    return { c, m, y, k: kPercent }
  }

  // Draw the rainbow slider
  const drawSlider = () => {
    const canvas = sliderRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    const gradient = ctx.createLinearGradient(0, 0, canvas.width, 0)
    gradient.addColorStop(0, "#ff0000")
    gradient.addColorStop(1 / 6, "#ffff00")
    gradient.addColorStop(2 / 6, "#00ff00")
    gradient.addColorStop(3 / 6, "#00ffff")
    gradient.addColorStop(4 / 6, "#0000ff")
    gradient.addColorStop(5 / 6, "#ff00ff")
    gradient.addColorStop(1, "#ff0000")

    ctx.fillStyle = gradient
    ctx.fillRect(0, 0, canvas.width, canvas.height)
  }

  // Draw the main color gradient
  const drawGradient = () => {
    const canvas = gradientRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Draw pure hue on the left side
    const hueGradient = ctx.createLinearGradient(0, 0, canvas.width / 2, 0)
    const hueColor = `hsl(${currentHue}, 100%, 50%)`
    hueGradient.addColorStop(0, hueColor)
    hueGradient.addColorStop(1, hueColor)
    ctx.fillStyle = hueGradient
    ctx.fillRect(0, 0, canvas.width / 2, canvas.height)

    // Draw black gradient on the right side
    const blackGradient = ctx.createLinearGradient(canvas.width / 2, 0, canvas.width, 0)
    blackGradient.addColorStop(0, hueColor)
    blackGradient.addColorStop(1, "#000000")
    ctx.fillStyle = blackGradient
    ctx.fillRect(canvas.width / 2, 0, canvas.width / 2, canvas.height)

    // Draw white to transparent vertical gradient
    const whiteGradient = ctx.createLinearGradient(0, 0, 0, canvas.height)
    whiteGradient.addColorStop(0, "rgba(255, 255, 255, 1)")
    whiteGradient.addColorStop(1, "rgba(255, 255, 255, 0)")
    ctx.fillStyle = whiteGradient
    ctx.fillRect(0, 0, canvas.width, canvas.height)
  }

  // Get color at position
  const getColorAtPosition = (pos: Position): RGB => {
    const canvas = gradientRef.current
    if (!canvas) return { r: 0, g: 0, b: 0 }

    const ctx = canvas.getContext("2d")
    if (!ctx) return { r: 0, g: 0, b: 0 }

    const imageData = ctx.getImageData(pos.x, pos.y, 1, 1).data
    return { r: imageData[0], g: imageData[1], b: imageData[2] }
  }

  // Handle mouse events for the main gradient
  const handleGradientMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    setIsDragging(true)
    const rect = gradientWrapperRef.current?.getBoundingClientRect()
    if (rect) {
      const x = Math.max(0, Math.min(e.clientX - rect.left, rect.width))
      const y = Math.max(0, Math.min(e.clientY - rect.top, rect.height))
      setPosition({ x, y })
      const color = getColorAtPosition({ x, y })
      setCurrentColor(color)
      onChange(rgbToHex(color.r, color.g, color.b))
    }
  }

  // Handle mouse events for the rainbow slider
  const handleSliderMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    setIsSliderDragging(true)
    const rect = sliderWrapperRef.current?.getBoundingClientRect()
    if (rect) {
      const x = Math.max(0, Math.min(e.clientX - rect.left, rect.width))
      setSliderPosition(x)
      const hue = (x / rect.width) * 360
      setCurrentHue(hue)
    }
  }

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (isDragging && gradientWrapperRef.current) {
        const rect = gradientWrapperRef.current.getBoundingClientRect()
        const x = Math.max(0, Math.min(e.clientX - rect.left, rect.width))
        const y = Math.max(0, Math.min(e.clientY - rect.top, rect.height))
        setPosition({ x, y })
        const color = getColorAtPosition({ x, y })
        setCurrentColor(color)
        onChange(rgbToHex(color.r, color.g, color.b))
      }

      if (isSliderDragging && sliderWrapperRef.current) {
        const rect = sliderWrapperRef.current.getBoundingClientRect()
        const x = Math.max(0, Math.min(e.clientX - rect.left, rect.width))
        setSliderPosition(x)
        const hue = (x / rect.width) * 360
        setCurrentHue(hue)
      }
    }

    const handleMouseUp = () => {
      setIsDragging(false)
      setIsSliderDragging(false)
    }

    window.addEventListener("mousemove", handleMouseMove)
    window.addEventListener("mouseup", handleMouseUp)

    return () => {
      window.removeEventListener("mousemove", handleMouseMove)
      window.removeEventListener("mouseup", handleMouseUp)
    }
  }, [isDragging, isSliderDragging, onChange])

  // Initialize canvases
  useEffect(() => {
    if (gradientRef.current && sliderRef.current) {
      // Set canvas sizes
      const setCanvasSize = () => {
        if (gradientRef.current && sliderRef.current) {
          const gradientRect = gradientRef.current.parentElement?.getBoundingClientRect()
          const sliderRect = sliderRef.current.parentElement?.getBoundingClientRect()

          if (gradientRect && sliderRect) {
            gradientRef.current.width = gradientRect.width
            gradientRef.current.height = gradientRect.height
            sliderRef.current.width = sliderRect.width
            sliderRef.current.height = sliderRect.height
          }
        }
      }

      setCanvasSize()
      drawSlider()
      drawGradient()

      window.addEventListener("resize", setCanvasSize)
      return () => window.removeEventListener("resize", setCanvasSize)
    }
  }, [])

  // Update gradient when hue changes
  useEffect(() => {
    drawGradient()
  }, [currentHue])

  // Initialize from provided value
  useEffect(() => {
    const rgb = hexToRgb(value)
    const hsv = rgbToHsv(rgb.r, rgb.g, rgb.b)
    setCurrentHue(hsv.h)
    setCurrentColor(rgb)

    if (sliderWrapperRef.current) {
      setSliderPosition((hsv.h / 360) * sliderWrapperRef.current.clientWidth)
    }
  }, [value])

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
  }

  const { r, g, b } = currentColor
  const hex = rgbToHex(r, g, b)
  const hsv = rgbToHsv(r, g, b)
  const hsl = rgbToHsl(r, g, b)
  const cmyk = rgbToCmyk(r, g, b)

  return (
    <div className={cn("w-full max-w-md", className)}>
      <div
        ref={gradientWrapperRef}
        className="relative w-full h-64 rounded-lg mb-4 cursor-crosshair"
        onMouseDown={handleGradientMouseDown}
      >
        <canvas ref={gradientRef} className="absolute top-0 left-0 w-full h-full rounded-lg" />
        <div
          className="absolute w-4 h-4 border-2 border-white rounded-full shadow-md pointer-events-none"
          style={{
            left: position.x - 8,
            top: position.y - 8,
            backgroundColor: hex,
          }}
        />
      </div>

      <div
        ref={sliderWrapperRef}
        className="relative h-4 rounded-full mb-6 cursor-pointer"
        onMouseDown={handleSliderMouseDown}
      >
        <canvas ref={sliderRef} className="absolute top-0 left-0 w-full h-full rounded-full" />
        <div
          className="absolute w-6 h-6 -mt-1 -ml-3 border-2 border-white rounded-full shadow-md pointer-events-none"
          style={{
            left: sliderPosition,
            backgroundColor: `hsl(${currentHue}, 100%, 50%)`,
          }}
        />
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <span className="font-medium">HEX</span>
          <div className="flex items-center gap-2">
            <input
              type="text"
              value={hex}
              onChange={(e) => {
                const newValue = e.target.value
                if (/^#[0-9A-Fa-f]{6}$/.test(newValue)) {
                  onChange(newValue)
                }
              }}
              className="w-28 px-2 py-1 font-mono text-sm border rounded"
            />
            <Button variant="outline" size="icon" className="h-8 w-8" onClick={() => copyToClipboard(hex)}>
              <Copy className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <span className="font-medium">RGB</span>
          <div className="flex items-center gap-2">
            <span className="font-mono text-sm">{`${r}, ${g}, ${b}`}</span>
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8"
              onClick={() => copyToClipboard(`${r}, ${g}, ${b}`)}
            >
              <Copy className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <span className="font-medium">CMYK</span>
          <div className="flex items-center gap-2">
            <span className="font-mono text-sm">{`${cmyk.c}%, ${cmyk.m}%, ${cmyk.y}%, ${cmyk.k}%`}</span>
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8"
              onClick={() => copyToClipboard(`${cmyk.c}%, ${cmyk.m}%, ${cmyk.y}%, ${cmyk.k}%`)}
            >
              <Copy className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <span className="font-medium">HSV</span>
          <div className="flex items-center gap-2">
            <span className="font-mono text-sm">
              {`${Math.round(hsv.h)}°, ${Math.round(hsv.s)}%, ${Math.round(hsv.v)}%`}
            </span>
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8"
              onClick={() => copyToClipboard(`${Math.round(hsv.h)}°, ${Math.round(hsv.s)}%, ${Math.round(hsv.v)}%`)}
            >
              <Copy className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <span className="font-medium">HSL</span>
          <div className="flex items-center gap-2">
            <span className="font-mono text-sm">{`${hsl.h}°, ${hsl.s}%, ${hsl.l}%`}</span>
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8"
              onClick={() => copyToClipboard(`${hsl.h}°, ${hsl.s}%, ${hsl.l}%`)}
            >
              <Copy className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

