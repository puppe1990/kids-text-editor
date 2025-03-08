"use client"
import { KidsTextEditor } from "@/components/kids-text-editor"
import { ThemeProvider } from "@/components/theme-provider"

export default function Home() {
  return (
    <ThemeProvider>
      <main className="min-h-screen bg-gradient-to-b from-blue-100 to-purple-100 p-4 md:p-8">
        <div className="max-w-5xl mx-auto">
          <h1 className="text-3xl md:text-4xl font-bold text-center mb-6 text-purple-600">My Fun Text Editor</h1>
          <KidsTextEditor />
        </div>
      </main>
    </ThemeProvider>
  )
}

