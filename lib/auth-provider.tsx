"use client"

import type React from "react"
import { createContext, useContext, useEffect, useState } from "react"
import { onAuthStateChanged, type User } from "firebase/auth"
import { getFirebaseAuth } from "./firebase"

interface AuthContextType {
  user: User | null
  loading: boolean
  auth: any
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  auth: null,
})

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [auth, setAuth] = useState<any>(null)

  useEffect(() => {
    // Only run in browser environment
    if (typeof window === "undefined") {
      setLoading(false)
      return
    }

    try {
      // Get auth instance
      const authInstance = getFirebaseAuth()
      setAuth(authInstance)

      if (!authInstance) {
        console.error("Firebase Auth could not be initialized")
        setLoading(false)
        return
      }

      // Set up auth state listener
      const unsubscribe = onAuthStateChanged(
        authInstance,
        (user) => {
          setUser(user)
          setLoading(false)
        },
        (error) => {
          console.error("Auth state change error:", error)
          setLoading(false)
        },
      )

      return () => unsubscribe()
    } catch (error) {
      console.error("Auth provider error:", error)
      setLoading(false)
    }
  }, [])

  return <AuthContext.Provider value={{ user, loading, auth }}>{children}</AuthContext.Provider>
}

export const useAuth = () => useContext(AuthContext)
