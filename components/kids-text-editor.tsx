"use client"

import type React from "react"
import { useState, useEffect, useRef } from "react"
import { Toolbar } from "./toolbar"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Printer, Save } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

export function KidsTextEditor() {
  // Start with default values and update from localStorage only on the client
  const [text, setText] = useState("")
  const [fontFamily, setFontFamily] = useState("Comic Sans MS")
  const [fontSize, setFontSize] = useState("24px")
  const [textColor, setTextColor] = useState("#FF5733")
  const [rainbowMode, setRainbowMode] = useState(false)
  const [letterColors, setLetterColors] = useState<string[]>([])
  const [isClient, setIsClient] = useState(false)
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const { toast } = useToast()

  const colors = [
    "#FF5733", // Red
    "#33FF57", // Green
    "#3357FF", // Blue
    "#FF33F5", // Pink
    "#F5B700", // Yellow
    "#8B33FF", // Purple
    "#FF9933", // Orange
    "#33FFF5", // Cyan
  ]

  // Set isClient to true once component mounts
  useEffect(() => {
    setIsClient(true)
  }, [])

  // Load saved content only after component mounts (client-side only)
  useEffect(() => {
    if (typeof window !== "undefined") {
      const savedText = localStorage.getItem("kidsEditorText")
      const savedFontFamily = localStorage.getItem("kidsEditorFontFamily")
      const savedFontSize = localStorage.getItem("kidsEditorFontSize")
      const savedTextColor = localStorage.getItem("kidsEditorTextColor")
      const savedRainbowMode = localStorage.getItem("kidsEditorRainbowMode")
      const savedLetterColors = localStorage.getItem("kidsEditorLetterColors")

      if (savedText) setText(savedText)
      if (savedFontFamily) setFontFamily(savedFontFamily)
      if (savedFontSize) setFontSize(savedFontSize)
      if (savedTextColor) setTextColor(savedTextColor)
      if (savedRainbowMode) setRainbowMode(savedRainbowMode === "true")
      if (savedLetterColors) {
        try {
          setLetterColors(JSON.parse(savedLetterColors))
        } catch (e) {
          console.error("Error parsing saved letter colors", e)
          setLetterColors([])
        }
      }
    }
  }, [])

  // Auto-save content when it changes (client-side only)
  useEffect(() => {
    if (typeof window !== "undefined") {
      const saveTimer = setTimeout(() => {
        localStorage.setItem("kidsEditorText", text)
        localStorage.setItem("kidsEditorFontFamily", fontFamily)
        localStorage.setItem("kidsEditorFontSize", fontSize)
        localStorage.setItem("kidsEditorTextColor", textColor)
        localStorage.setItem("kidsEditorRainbowMode", rainbowMode.toString())
        localStorage.setItem("kidsEditorLetterColors", JSON.stringify(letterColors))
      }, 1000)

      return () => clearTimeout(saveTimer)
    }
  }, [text, fontFamily, fontSize, textColor, rainbowMode, letterColors])

  // Move random color generation to client-side only
  const getRandomColor = () => {
    if (!isClient) return colors[0] // Default for SSR

    // Use the custom color occasionally in rainbow mode
    if (Math.random() > 0.7) {
      return textColor
    }
    return colors[Math.floor(Math.random() * colors.length)]
  }

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newText = e.target.value
    setText(newText)

    // If rainbow mode is on and text is getting longer, add a random color for the new letter
    if (rainbowMode && newText.length > text.length) {
      const newColors = [...letterColors]
      for (let i = letterColors.length; i < newText.length; i++) {
        newColors.push(getRandomColor())
      }
      setLetterColors(newColors)
    } else if (newText.length < letterColors.length) {
      // If text is deleted, remove the corresponding colors
      setLetterColors(letterColors.slice(0, newText.length))
    }
  }

  const handleSave = () => {
    if (typeof window !== "undefined") {
      localStorage.setItem("kidsEditorText", text)
      localStorage.setItem("kidsEditorFontFamily", fontFamily)
      localStorage.setItem("kidsEditorFontSize", fontSize)
      localStorage.setItem("kidsEditorTextColor", textColor)
      localStorage.setItem("kidsEditorRainbowMode", rainbowMode.toString())
      localStorage.setItem("kidsEditorLetterColors", JSON.stringify(letterColors))

      toast({
        title: "Saved!",
        description: "Your story has been saved.",
        duration: 2000,
      })
    }
  }

  const handlePrint = () => {
    if (typeof window !== "undefined") {
      const printWindow = window.open("", "_blank")
      if (printWindow) {
        printWindow.document.write(`
          <html>
            <head>
              <title>My Story</title>
              <style>
                body {
                  font-family: ${fontFamily}, sans-serif;
                  font-size: ${fontSize};
                  padding: 20px;
                  line-height: 1.5;
                }
                .rainbow-text {
                  display: inline-block;
                }
              </style>
            </head>
            <body>
              ${
                rainbowMode
                  ? text
                      .split("")
                      .map((char, i) =>
                        char === "\n"
                          ? "<br>"
                          : `<span style="color: ${letterColors[i] || textColor}">${char === " " ? "&nbsp;" : char}</span>`,
                      )
                      .join("")
                  : text.replace(/\n/g, "<br>")
              }
            </body>
          </html>
        `)
        printWindow.document.close()
        printWindow.focus()
        printWindow.print()
        printWindow.close()
      }
    }
  }

  const renderRainbowText = () => {
    return text.split("").map((char, i) => (
      <span
        key={i}
        style={{
          color: letterColors[i] || textColor,
          whiteSpace: char === " " ? "pre" : "normal",
        }}
      >
        {char === "\n" ? <br /> : char}
      </span>
    ))
  }

  // Ensure fontSize always has 'px' suffix
  const normalizedFontSize = fontSize.endsWith("px") ? fontSize : `${fontSize}px`

  return (
    <div className="space-y-4">
      <Toolbar
        fontFamily={fontFamily}
        setFontFamily={setFontFamily}
        fontSize={normalizedFontSize}
        setFontSize={setFontSize}
        textColor={textColor}
        setTextColor={setTextColor}
        rainbowMode={rainbowMode}
        setRainbowMode={setRainbowMode}
      />

      <Card className="border-4 border-yellow-400 shadow-lg">
        <CardContent className="p-4 relative">
          <textarea
            ref={textareaRef}
            className="w-full min-h-[300px] p-4 rounded-lg focus:outline-none resize-none"
            value={text}
            onChange={handleTextChange}
            placeholder="Write your story here..."
            style={{
              fontFamily: fontFamily,
              fontSize: normalizedFontSize,
              color: rainbowMode ? "transparent" : textColor,
              border: "none",
              background: "transparent",
              caretColor: textColor, // Make cursor visible even in rainbow mode
              position: "relative",
              zIndex: 1,
            }}
          />

          {rainbowMode && (
            <div
              className="absolute top-0 left-0 w-full h-full p-8 pointer-events-none"
              style={{
                fontFamily: fontFamily,
                fontSize: normalizedFontSize,
                zIndex: 0,
              }}
            >
              {renderRainbowText()}
            </div>
          )}
        </CardContent>
      </Card>

      <div className="flex justify-end space-x-4">
        <Button
          onClick={handleSave}
          className="bg-green-500 hover:bg-green-600 text-white rounded-full px-6 py-2 text-lg flex items-center gap-2"
        >
          <Save className="h-5 w-5" />
          Save
        </Button>
        <Button
          onClick={handlePrint}
          className="bg-blue-500 hover:bg-blue-600 text-white rounded-full px-6 py-2 text-lg flex items-center gap-2"
        >
          <Printer className="h-5 w-5" />
          Print
        </Button>
      </div>
    </div>
  )
}

