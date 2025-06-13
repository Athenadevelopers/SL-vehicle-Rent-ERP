import { Car, Calendar, CreditCard, MapPin, Shield, Users } from "lucide-react"

export function LandingFeatures() {
  const features = [
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
      title: "Island-wide Service",
      description: "Pick up and drop off locations across Sri Lanka.",
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
  ]

  return (
    <section className="w-full py-12 md:py-24 lg:py-32">
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
          {features.map((feature, index) => (
            <div
              key={index}
              className="flex flex-col items-center space-y-2 border rounded-lg p-6 bg-white dark:bg-gray-800 shadow-sm"
            >
              <div className="p-3 rounded-full bg-primary/10 text-primary">{feature.icon}</div>
              <h3 className="text-xl font-bold">{feature.title}</h3>
              <p className="text-gray-500 dark:text-gray-400 text-center">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
