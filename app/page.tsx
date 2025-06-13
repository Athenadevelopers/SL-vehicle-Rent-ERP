import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Car, Calendar, CreditCard, MapPin, Shield, Users, ChevronRight, Star } from "lucide-react"
import { Footer } from "@/components/footer"

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center gap-2">
            <Link href="/" className="font-bold text-xl flex items-center">
              <Car className="h-6 w-6 text-primary mr-2" />
              <span>SL Vehicle Rental</span>
            </Link>
          </div>
          <nav className="hidden md:flex items-center gap-6">
            <Link href="/vehicles" className="text-sm font-medium hover:text-primary transition-colors">
              Vehicles
            </Link>
            <Link href="/services" className="text-sm font-medium hover:text-primary transition-colors">
              Services
            </Link>
            <Link href="/about" className="text-sm font-medium hover:text-primary transition-colors">
              About
            </Link>
            <Link href="/contact" className="text-sm font-medium hover:text-primary transition-colors">
              Contact
            </Link>
          </nav>
          <div className="flex items-center gap-4">
            <Link href="/login">
              <Button variant="outline" className="hidden sm:flex">
                Login
              </Button>
            </Link>
            <Link href="/register">
              <Button className="bg-primary hover:bg-primary/90">Register</Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="w-full py-12 md:py-24 lg:py-32 bg-gradient-to-b from-white to-gray-100 dark:from-gray-900 dark:to-gray-800 animate-fade-in">
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
                  <Button size="lg" className="px-8 bg-primary hover:bg-primary/90">
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
            <div className="relative h-[300px] md:h-[400px] lg:h-[500px] rounded-xl overflow-hidden animate-float">
              <Image
                src="/images/hero-car.jpg"
                alt="Sri Lankan landscape with vehicles"
                fill
                className="object-cover"
                priority
              />
            </div>
          </div>
        </div>
      </section>

      {/* Search Section */}
      <section className="w-full py-12 bg-white dark:bg-gray-950">
        <div className="container px-4 md:px-6">
          <div className="mx-auto max-w-5xl">
            <div className="rounded-xl border bg-card p-6 shadow-sm">
              <div className="grid gap-4 md:grid-cols-4">
                <div className="space-y-2 md:col-span-2">
                  <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                    Pick-up Date
                  </label>
                  <input
                    type="date"
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  />
                </div>
                <div className="space-y-2 md:col-span-2">
                  <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                    Return Date
                  </label>
                  <input
                    type="date"
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  />
                </div>
                <div className="flex items-end md:col-span-4">
                  <Button className="w-full bg-primary hover:bg-primary/90">Search Vehicles</Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Popular Vehicles Section */}
      <section className="w-full py-12 md:py-24 lg:py-32 bg-gray-50 dark:bg-gray-900">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <div className="space-y-2">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">Popular Vehicles</h2>
              <p className="max-w-[900px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed dark:text-gray-400">
                Explore our most popular rental options for your journey across Sri Lanka.
              </p>
            </div>
          </div>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4 mt-12">
            {[
              {
                name: "Toyota Corolla",
                type: "Sedan",
                price: 5000,
                image: "/images/toyota-corolla.jpg",
                features: ["AC", "5 Seats", "Automatic"],
              },
              {
                name: "Bajaj RE",
                type: "Tuk-Tuk",
                price: 2000,
                image: "/images/tuk-tuk.jpg",
                features: ["3 Seats", "Compact", "Fuel Efficient"],
              },
              {
                name: "Toyota HiAce",
                type: "Van",
                price: 8000,
                image: "/images/toyota-hiace.jpg",
                features: ["AC", "15 Seats", "Spacious"],
              },
              {
                name: "Honda Dio",
                type: "Scooter",
                price: 1500,
                image: "/images/honda-dio.jpg",
                features: ["Helmet", "Fuel Efficient", "Easy to Ride"],
              },
            ].map((vehicle, index) => (
              <div
                key={index}
                className="group relative overflow-hidden rounded-lg border bg-white dark:bg-gray-800 shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="aspect-video overflow-hidden">
                  <Image
                    src={vehicle.image || "/placeholder.svg"}
                    alt={vehicle.name}
                    width={300}
                    height={200}
                    className="object-cover w-full h-full transition-transform group-hover:scale-105"
                  />
                </div>
                <div className="p-4">
                  <h3 className="font-semibold text-lg">{vehicle.name}</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">{vehicle.type}</p>
                  <div className="mt-2 flex items-center justify-between">
                    <p className="font-bold text-primary">Rs. {vehicle.price.toLocaleString()}/day</p>
                    <div className="flex items-center">
                      <Star className="h-4 w-4 fill-primary text-primary" />
                      <Star className="h-4 w-4 fill-primary text-primary" />
                      <Star className="h-4 w-4 fill-primary text-primary" />
                      <Star className="h-4 w-4 fill-primary text-primary" />
                      <Star className="h-4 w-4 fill-primary text-primary" />
                    </div>
                  </div>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {vehicle.features.map((feature, i) => (
                      <span
                        key={i}
                        className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold text-gray-700 dark:text-gray-300"
                      >
                        {feature}
                      </span>
                    ))}
                  </div>
                  <Button className="w-full mt-4 bg-primary hover:bg-primary/90">View Details</Button>
                </div>
              </div>
            ))}
          </div>
          <div className="flex justify-center mt-8">
            <Link href="/vehicles">
              <Button variant="outline" className="flex items-center gap-2">
                View All Vehicles
                <ChevronRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="w-full py-12 md:py-24 lg:py-32 animate-slide-in">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <div className="space-y-2">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">Why Choose Our Service</h2>
              <p className="max-w-[900px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed dark:text-gray-400">
                We provide the best vehicle rental experience in Sri Lanka with our wide range of options and excellent
                service.
              </p>
            </div>
          </div>
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3 mt-12">
            {[
              {
                icon: <Car className="h-6 w-6" />,
                title: "Wide Vehicle Selection",
                description: "From luxury cars to budget-friendly tuk-tuks, we have it all.",
              },
              {
                icon: <Calendar className="h-6 w-6" />,
                title: "Easy Booking",
                description: "Book your vehicle in minutes with our simple online system.",
              },
              {
                icon: <MapPin className="h-6 w-6" />,
                title: "Central Location",
                description: "Our main office is conveniently located in central Colombo.",
              },
              {
                icon: <Shield className="h-6 w-6" />,
                title: "Fully Insured",
                description: "All our vehicles come with comprehensive insurance coverage.",
              },
              {
                icon: <CreditCard className="h-6 w-6" />,
                title: "Flexible Payment",
                description: "Pay online or in cash with competitive rates.",
              },
              {
                icon: <Users className="h-6 w-6" />,
                title: "24/7 Support",
                description: "Our customer service team is always ready to assist you.",
              },
            ].map((feature, index) => (
              <div
                key={index}
                className="flex flex-col items-center space-y-2 border rounded-lg p-6 bg-white dark:bg-gray-800 shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="p-3 rounded-full bg-primary/10 text-primary">{feature.icon}</div>
                <h3 className="text-xl font-bold">{feature.title}</h3>
                <p className="text-gray-500 dark:text-gray-400 text-center">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="w-full py-12 md:py-24 lg:py-32 bg-primary text-primary-foreground">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <div className="space-y-2">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">Ready to Start Your Journey?</h2>
              <p className="max-w-[900px] md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                Join thousands of satisfied customers who have experienced our premium vehicle rental service.
              </p>
            </div>
            <div className="flex flex-col gap-2 min-[400px]:flex-row">
              <Link href="/register">
                <Button size="lg" className="px-8 bg-white text-primary hover:bg-white/90">
                  Create Account
                </Button>
              </Link>
              <Link href="/contact">
                <Button size="lg" variant="outline" className="px-8 border-white text-white hover:bg-white/10">
                  Contact Us
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <Footer />
    </main>
  )
}
