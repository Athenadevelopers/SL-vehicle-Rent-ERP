"use client"

import { useEffect, useState } from "react"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { getRecentBookings } from "@/lib/firebase-db"

type Booking = {
  id: string
  customerName: string
  vehicleName: string
  startDate: string
  endDate: string
  status: "active" | "completed" | "cancelled" | "pending"
  amount: number
}

export function RecentBookings() {
  const [bookings, setBookings] = useState<Booking[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const data = await getRecentBookings()
        setBookings(data)
      } catch (error) {
        console.error("Error fetching bookings:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchBookings()
  }, [])

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[200px]">
        <div className="h-6 w-6 animate-spin rounded-full border-2 border-primary border-t-transparent"></div>
      </div>
    )
  }

  // If no data from Firebase yet, show mock data
  const mockBookings: Booking[] = [
    {
      id: "B001",
      customerName: "Amal Perera",
      vehicleName: "Toyota Corolla",
      startDate: "2023-06-10",
      endDate: "2023-06-15",
      status: "active",
      amount: 25000,
    },
    {
      id: "B002",
      customerName: "Nimal Silva",
      vehicleName: "Honda Civic",
      startDate: "2023-06-08",
      endDate: "2023-06-12",
      status: "completed",
      amount: 20000,
    },
    {
      id: "B003",
      customerName: "Kamala Jayawardena",
      vehicleName: "Suzuki Alto",
      startDate: "2023-06-15",
      endDate: "2023-06-18",
      status: "pending",
      amount: 15000,
    },
    {
      id: "B004",
      customerName: "Sunil Rathnayake",
      vehicleName: "Bajaj Tuk-Tuk",
      startDate: "2023-06-05",
      endDate: "2023-06-07",
      status: "completed",
      amount: 8000,
    },
    {
      id: "B005",
      customerName: "Priya Fernando",
      vehicleName: "Toyota HiAce",
      startDate: "2023-06-20",
      endDate: "2023-06-25",
      status: "cancelled",
      amount: 35000,
    },
  ]

  const displayBookings = bookings.length > 0 ? bookings : mockBookings

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "default"
      case "completed":
        return "outline"
      case "cancelled":
        return "destructive"
      case "pending":
        return "secondary"
      default:
        return "default"
    }
  }

  return (
    <div className="space-y-4">
      {displayBookings.map((booking) => (
        <div key={booking.id} className="flex items-center gap-4 p-2 hover:bg-muted/50 rounded-lg transition-colors">
          <Avatar className="hidden h-9 w-9 sm:flex">
            <AvatarFallback>{booking.customerName.charAt(0)}</AvatarFallback>
          </Avatar>
          <div className="grid gap-1">
            <p className="text-sm font-medium leading-none">{booking.customerName}</p>
            <p className="text-sm text-muted-foreground">{booking.vehicleName}</p>
            <p className="text-xs text-muted-foreground">
              {booking.startDate} to {booking.endDate}
            </p>
          </div>
          <div className="ml-auto text-right">
            <Badge variant={getStatusColor(booking.status)}>{booking.status}</Badge>
            <p className="mt-1 text-xs text-muted-foreground">Rs. {booking.amount.toLocaleString()}</p>
          </div>
        </div>
      ))}
    </div>
  )
}
