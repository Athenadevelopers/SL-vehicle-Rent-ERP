"use client"

import type React from "react"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { signInWithEmailAndPassword } from "firebase/auth"
import { auth } from "@/lib/firebase"
import { AlertCircle, Car } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"

export default function LoginPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [firebaseInitialized, setFirebaseInitialized] = useState(true)

  useEffect(() => {
    // Check if Firebase is properly initialized
    if (!auth) {
      setFirebaseInitialized(false)
      setError("Firebase authentication is not available. Please try again later.")
    }
  }, [])

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setLoading(true)

    if (!firebaseInitialized) {
      setError("Firebase authentication is not available. Please try again later.")
      setLoading(false)
      return
    }

    try {
      await signInWithEmailAndPassword(auth, email, password)
      toast({
        title: "Login successful",
        description: "Welcome back to SL Vehicle Rental ERP.",
      })
      router.push("/dashboard")
    } catch (error: any) {
      console.error("Login error:", error)
      setError(getErrorMessage(error.code))
    } finally {
      setLoading(false)
    }
  }

  const getErrorMessage = (errorCode: string) => {
    switch (errorCode) {
      case "auth/invalid-email":
        return "Invalid email address."
      case "auth/user-disabled":
        return "This account has been disabled."
      case "auth/user-not-found":
        return "No account found with this email."
      case "auth/wrong-password":
        return "Incorrect password."
      case "auth/api-key-not-valid":
        return "System configuration error. Please contact support."
      case "auth/network-request-failed":
        return "Network error. Please check your internet connection."
      default:
        return `An error occurred during login (${errorCode}). Please try again.`
    }
  }

  // Demo credentials for testing
  const fillDemoCredentials = () => {
    setEmail("demo@slvehiclerental.com")
    setPassword("demo123")
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 dark:bg-gray-900 p-4">
      <div className="w-full max-w-md">
        <div className="flex justify-center mb-6">
          <Link href="/" className="flex items-center gap-2">
            <Car className="h-8 w-8 text-primary" />
            <span className="text-2xl font-bold">SL Vehicle Rental</span>
          </Link>
        </div>
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">Login</CardTitle>
            <CardDescription>Enter your credentials to access your account</CardDescription>
          </CardHeader>
          <form onSubmit={handleLogin}>
            <CardContent className="space-y-4">
              {error && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password">Password</Label>
                  <Link href="/forgot-password" className="text-sm text-primary hover:underline">
                    Forgot password?
                  </Link>
                </div>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
            </CardContent>
            <CardFooter className="flex flex-col space-y-4">
              <Button
                type="submit"
                className="w-full bg-primary hover:bg-primary/90"
                disabled={loading || !firebaseInitialized}
              >
                {loading ? "Logging in..." : "Login"}
              </Button>
              <Button type="button" variant="outline" className="w-full" onClick={fillDemoCredentials}>
                Use Demo Credentials
              </Button>
              <div className="text-center text-sm">
                Don&apos;t have an account?{" "}
                <Link href="/register" className="text-primary hover:underline">
                  Register
                </Link>
              </div>
            </CardFooter>
          </form>
        </Card>
      </div>
    </div>
  )
}
