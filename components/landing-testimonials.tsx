import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Card, CardContent } from "@/components/ui/card"

export function LandingTestimonials() {
  const testimonials = [
    {
      name: "Kumara Perera",
      role: "Business Traveler",
      content:
        "The service was excellent! I rented a car for my business trip from Colombo to Kandy, and everything was perfect.",
      avatar: "KP",
    },
    {
      name: "Priya Jayawardena",
      role: "Tourist",
      content:
        "As a tourist, I was worried about transportation in Sri Lanka. This service made it so easy to explore the beautiful country!",
      avatar: "PJ",
    },
    {
      name: "Mohamed Farook",
      role: "Local Resident",
      content:
        "I regularly rent vehicles for family trips. The prices are reasonable and the vehicles are always in great condition.",
      avatar: "MF",
    },
  ]

  return (
    <section className="w-full py-12 md:py-24 lg:py-32 bg-gray-50 dark:bg-gray-900">
      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center justify-center space-y-4 text-center">
          <div className="space-y-2">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">What Our Customers Say</h2>
            <p className="max-w-[900px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed dark:text-gray-400">
              Don&apos;t just take our word for it. Here&apos;s what our customers have to say about our service.
            </p>
          </div>
        </div>
        <div className="grid grid-cols-1 gap-8 md:grid-cols-3 mt-12">
          {testimonials.map((testimonial, index) => (
            <Card key={index} className="border-none shadow-md">
              <CardContent className="p-6 flex flex-col items-center text-center space-y-4">
                <Avatar className="h-16 w-16">
                  <AvatarFallback>{testimonial.avatar}</AvatarFallback>
                </Avatar>
                <div>
                  <p className="text-gray-700 dark:text-gray-300 mb-4">&quot;{testimonial.content}&quot;</p>
                  <h3 className="font-semibold">{testimonial.name}</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">{testimonial.role}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
