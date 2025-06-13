"use client"

import { useEffect, useState } from "react"
import { app } from "@/lib/firebase"

export function FirebaseInit() {
  const [initialized, setInitialized] = useState(false)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    try {
      // Check if Firebase app is initialized
      if (app) {
        setInitialized(true)
      }
    } catch (err) {
      console.error("Firebase initialization error:", err)
      setError(err instanceof Error ? err : new Error("Unknown Firebase initialization error"))
    }
  }, [])

  // This component doesn't render anything visible
  return null
}
