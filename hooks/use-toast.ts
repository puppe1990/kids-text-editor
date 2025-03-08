"use client"

import { useState, useEffect } from "react"

interface Toast {
  id?: number
  title: string
  description?: string
  duration?: number
}

export function useToast() {
  const [toasts, setToasts] = useState<Toast[]>([])
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const toast = ({ title, description, duration = 3000 }: Toast) => {
    if (!mounted) return // Don't show toasts during SSR

    const id = Date.now()
    const newToast = { id, title, description, duration }

    setToasts((prevToasts) => [...prevToasts, newToast])

    setTimeout(() => {
      setToasts((prevToasts) => prevToasts.filter((toast) => toast.id !== id))
    }, duration)
  }

  return { toast, toasts }
}

