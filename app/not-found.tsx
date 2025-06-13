import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Car } from "lucide-react"

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background">
      <div className="container flex max-w-md flex-col items-center justify-center space-y-4 text-center">
        <div className="flex h-20 w-20 items-center justify-center rounded-full bg-primary/10">
          <Car className="h-10 w-10 text-primary" />
        </div>
        <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl">404 - Page Not Found</h1>
        <p className="max-w-[600px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed dark:text-gray-400">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <div className="flex flex-col gap-2 min-[400px]:flex-row">
          <Link href="/">
            <Button size="lg" className="px-8 bg-primary hover:bg-primary/90">
              Go Home
            </Button>
          </Link>
          <Link href="/dashboard">
            <Button size="lg" variant="outline" className="px-8">
              Dashboard
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}
