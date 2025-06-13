import Link from "next/link"
import { Facebook, Instagram, Twitter, Phone, Mail, MapPin } from "lucide-react"

export function LandingFooter() {
  return (
    <footer className="w-full border-t bg-background">
      <div className="container px-4 md:px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">SL Vehicle Rental</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Your trusted vehicle rental service in Sri Lanka since 2010.
            </p>
            <div className="flex space-x-4">
              <Link href="#" className="text-gray-500 hover:text-primary">
                <Facebook className="h-5 w-5" />
                <span className="sr-only">Facebook</span>
              </Link>
              <Link href="#" className="text-gray-500 hover:text-primary">
                <Instagram className="h-5 w-5" />
                <span className="sr-only">Instagram</span>
              </Link>
              <Link href="#" className="text-gray-500 hover:text-primary">
                <Twitter className="h-5 w-5" />
                <span className="sr-only">Twitter</span>
              </Link>
            </div>
          </div>
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/vehicles" className="text-gray-500 hover:text-primary dark:text-gray-400">
                  Browse Vehicles
                </Link>
              </li>
              <li>
                <Link href="/about" className="text-gray-500 hover:text-primary dark:text-gray-400">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-gray-500 hover:text-primary dark:text-gray-400">
                  Contact Us
                </Link>
              </li>
              <li>
                <Link href="/terms" className="text-gray-500 hover:text-primary dark:text-gray-400">
                  Terms & Conditions
                </Link>
              </li>
            </ul>
          </div>
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Vehicle Types</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/vehicles/cars" className="text-gray-500 hover:text-primary dark:text-gray-400">
                  Cars
                </Link>
              </li>
              <li>
                <Link href="/vehicles/vans" className="text-gray-500 hover:text-primary dark:text-gray-400">
                  Vans
                </Link>
              </li>
              <li>
                <Link href="/vehicles/tuk-tuks" className="text-gray-500 hover:text-primary dark:text-gray-400">
                  Tuk-Tuks
                </Link>
              </li>
              <li>
                <Link href="/vehicles/motorcycles" className="text-gray-500 hover:text-primary dark:text-gray-400">
                  Motorcycles
                </Link>
              </li>
            </ul>
          </div>
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Contact Us</h3>
            <ul className="space-y-2 text-sm">
              <li className="flex items-center space-x-2">
                <Phone className="h-4 w-4 text-gray-500" />
                <span className="text-gray-500 dark:text-gray-400">+94 11 234 5678</span>
              </li>
              <li className="flex items-center space-x-2">
                <Mail className="h-4 w-4 text-gray-500" />
                <span className="text-gray-500 dark:text-gray-400">info@slvehiclerental.com</span>
              </li>
              <li className="flex items-start space-x-2">
                <MapPin className="h-4 w-4 text-gray-500 mt-1" />
                <span className="text-gray-500 dark:text-gray-400">123 Galle Road, Colombo 03, Sri Lanka</span>
              </li>
            </ul>
          </div>
        </div>
        <div className="mt-8 border-t pt-8 text-center text-sm text-gray-500 dark:text-gray-400">
          &copy; {new Date().getFullYear()} SL Vehicle Rental. All rights reserved.
        </div>
      </div>
    </footer>
  )
}
