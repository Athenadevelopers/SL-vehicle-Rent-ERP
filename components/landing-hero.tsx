import { Button } from "@/components/ui/button"
import Link from "next/link"
import Image from "next/image"

export function LandingHero() {
  return (
    <section className="w-full py-12 md:py-24 lg:py-32 bg-gradient-to-b from-white to-gray-100 dark:from-gray-900 dark:to-gray-800">
      <div className="container px-4 md:px-6">
        <div className="grid gap-6 lg:grid-cols-2 lg:gap-12 xl:grid-cols-2">
          <div className="flex flex-col justify-center space-y-4">
            <div className="space-y-2">
              <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl/none">
                Sri Lanka&apos;s Premier Vehicle Rental Service
              </h1>
              <p className="max-w-[600px] text-gray-500 md:text-xl dark:text-gray-400">
                Explore Sri Lanka with ease. Rent cars, vans, tuk-tuks, and more with our simple booking system.
              </p>
            </div>
            <div className="flex flex-col gap-2 min-[400px]:flex-row">
              <Link href="/vehicles">
                <Button size="lg" className="px-8">
                  Browse Vehicles
                </Button>
              </Link>
              <Link href="/register">
                <Button size="lg" variant="outline" className="px-8">
                  Create Account
                </Button>
              </Link>
            </div>
          </div>
          <div className="relative h-[300px] md:h-[400px] lg:h-[500px] rounded-xl overflow-hidden">
            <Image
              src="/placeholder.svg?height=500&width=800"
              alt="Sri Lankan landscape with vehicles"
              fill
              className="object-cover"
              priority
            />
          </div>
        </div>
      </div>
    </section>
  )
}
