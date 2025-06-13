import Link from "next/link"
import { Car, Mail, Phone, MapPin } from "lucide-react"

export function Footer() {
  return (
    <footer className="bg-gray-100 dark:bg-gray-900">
      <div className="container px-4 md:px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Car className="h-6 w-6 text-primary" />
              <span className="font-bold text-xl">SL Vehicle Rental</span>
            </div>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Sri Lanka's premier vehicle rental service, offering a wide range of vehicles for all your travel needs.
            </p>
          </div>
          <div>
            <h3 className="font-semibold text-lg mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/vehicles" className="text-sm text-gray-500 hover:text-primary dark:text-gray-400">
                  Vehicles
                </Link>
              </li>
              <li>
                <Link href="/services" className="text-sm text-gray-500 hover:text-primary dark:text-gray-400">
                  Services
                </Link>
              </li>
              <li>
                <Link href="/about" className="text-sm text-gray-500 hover:text-primary dark:text-gray-400">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-sm text-gray-500 hover:text-primary dark:text-gray-400">
                  Contact
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold text-lg mb-4">Contact Us</h3>
            <ul className="space-y-2">
              <li className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                <MapPin className="h-4 w-4 text-primary" />
                <span>123 Main Street, Colombo, Sri Lanka</span>
              </li>
              <li className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                <Phone className="h-4 w-4 text-primary" />
                <span>+94 11 234 5678</span>
              </li>
              <li className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                <Mail className="h-4 w-4 text-primary" />
                <span>info@slvehiclerental.com</span>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold text-lg mb-4">Business Hours</h3>
            <ul className="space-y-2">
              <li className="text-sm text-gray-500 dark:text-gray-400">Monday - Friday: 8:00 AM - 6:00 PM</li>
              <li className="text-sm text-gray-500 dark:text-gray-400">Saturday: 9:00 AM - 5:00 PM</li>
              <li className="text-sm text-gray-500 dark:text-gray-400">Sunday: 10:00 AM - 4:00 PM</li>
            </ul>
          </div>
        </div>
        <div className="border-t mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            &copy; {new Date().getFullYear()} SL Vehicle Rental. All rights reserved.
          </p>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-2 md:mt-0">
            Developed by: Sahan Weerasinghe @ Athena Development (Pvt) Ltd 2025
          </p>
        </div>
      </div>
    </footer>
  )
}
