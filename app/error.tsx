"use client"

import { useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { AlertTriangle } from "lucide-react"

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background">
      <div className="container flex max-w-md flex-col items-center justify-center space-y-4 text-center">
        <div className="flex h-20 w-20 items-center justify-center rounded-full bg-destructive/10">
          <AlertTriangle className="h-10 w-10 text-destructive" />
        </div>
        <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl">Something went wrong!</h1>
        <p className="max-w-[600px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed dark:text-gray-400">
          We apologize for the inconvenience. Please try again or contact support if the problem persists.
        </p>
        <div className="flex flex-col gap-2 min-[400px]:flex-row">
          <Button onClick={reset} size="lg" className="px-8 bg-primary hover:bg-primary/90">
            Try Again
          </Button>
          <Link href="/">
            <Button size="lg" variant="outline" className="px-8">
              Go Home
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}
