"use client"

import { useState } from "react"

interface Toast {
  title: string
  description?: string
  duration?: number
}

export function useToast() {
  const [toasts, setToasts] = useState<Toast[]>([])

  const toast = ({ title, description, duration = 3000 }: Toast) => {
    const id = Date.now()
    const newToast = { id, title, description, duration }

    setToasts((prevToasts) => [...prevToasts, newToast])

    setTimeout(() => {
      setToasts((prevToasts) => prevToasts.filter((toast) => toast.id !== id))
    }, duration)
  }

  return { toast, toasts }
}

