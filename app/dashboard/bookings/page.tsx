"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Search, Plus, MoreHorizontal, Eye, FileText, CheckCircle, XCircle } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useToast } from "@/components/ui/use-toast"
import { useAuth } from "@/lib/auth-provider"
import { format } from "date-fns"
import { subscribeToBookings, updateBookingStatus, getMockBookings, type Booking } from "@/lib/firebase-db"
import { sendBookingConfirmation } from "@/lib/notification-service"

export default function BookingsPage() {
  const router = useRouter()
  const { toast } = useToast()
  const { user } = useAuth()
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [dateFilter, setDateFilter] = useState("all")
  const [bookings, setBookings] = useState<Booking[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!user) return

    // Subscribe to real-time bookings updates
    const unsubscribe = subscribeToBookings((updatedBookings) => {
      setBookings(updatedBookings)
      setLoading(false)
    })

    // Fallback to mock data if no bookings are returned after 2 seconds
    const timeout = setTimeout(() => {
      if (loading) {
        setBookings(getMockBookings())
        setLoading(false)
      }
    }, 2000)

    return () => {
      unsubscribe()
      clearTimeout(timeout)
    }
  }, [user, loading])

  const filteredBookings = bookings.filter((booking) => {
    // Apply search filter
    const matchesSearch =
      booking.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      booking.vehicleName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      booking.id.toLowerCase().includes(searchQuery.toLowerCase())

    // Apply status filter
    const matchesStatus = statusFilter === "all" || booking.status === statusFilter

    // Apply date filter
    let matchesDate = true
    const today = new Date()
    const tomorrow = new Date(today)
    tomorrow.setDate(tomorrow.getDate() + 1)
    const nextWeek = new Date(today)
    nextWeek.setDate(nextWeek.getDate() + 7)
    const pickupDate = booking.pickupDate.toDate()

    if (dateFilter === "today") {
      matchesDate = pickupDate.toDateString() === today.toDateString()
    } else if (dateFilter === "tomorrow") {
      matchesDate = pickupDate.toDateString() === tomorrow.toDateString()
    } else if (dateFilter === "week") {
      matchesDate = pickupDate >= today && pickupDate <= nextWeek
    }

    return matchesSearch && matchesStatus && matchesDate
  })

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return (
          <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">
            Pending
          </Badge>
        )
      case "confirmed":
        return (
          <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
            Confirmed
          </Badge>
        )
      case "active":
        return (
          <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
            Active
          </Badge>
        )
      case "completed":
        return (
          <Badge variant="outline" className="bg-gray-50 text-gray-700 border-gray-200">
            Completed
          </Badge>
        )
      case "cancelled":
        return (
          <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">
            Cancelled
          </Badge>
        )
      default:
        return <Badge variant="outline">Unknown</Badge>
    }
  }

  const getPaymentStatusBadge = (status: string) => {
    switch (status) {
      case "unpaid":
        return (
          <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">
            Unpaid
          </Badge>
        )
      case "partial":
        return (
          <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">
            Partial
          </Badge>
        )
      case "paid":
        return (
          <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
            Paid
          </Badge>
        )
      default:
        return <Badge variant="outline">Unknown</Badge>
    }
  }

  const handleStatusChange = async (
    booking: Booking,
    newStatus: "confirmed" | "active" | "completed" | "cancelled",
  ) => {
    try {
      await updateBookingStatus(booking.id, newStatus)

      toast({
        title: `Booking status updated to ${newStatus}`,
        description: `Booking #${booking.id} status has been updated.`,
      })

      // If confirmed, send email and SMS
      if (newStatus === "confirmed") {
        await sendBookingConfirmation({
          customerName: booking.customerName,
          customerEmail: booking.customerEmail,
          customerPhone: booking.customerPhone,
          bookingId: booking.id,
          vehicleName: booking.vehicleName,
          pickupDate: format(booking.pickupDate.toDate(), "dd MMM yyyy"),
          returnDate: format(booking.returnDate.toDate(), "dd MMM yyyy"),
          totalAmount: booking.totalAmount,
          paymentStatus: booking.paymentStatus,
        })

        toast({
          title: "Confirmation sent",
          description: `Confirmation email and SMS sent to ${booking.customerName}.`,
        })
      }
    } catch (error) {
      console.error("Error updating booking status:", error)
      toast({
        title: "Error updating booking status",
        description: "There was an error updating the booking status. Please try again.",
        variant: "destructive",
      })
    }
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Bookings</h1>
        <Button className="bg-primary hover:bg-primary/90" onClick={() => router.push("/dashboard/bookings/new")}>
          <Plus className="mr-2 h-4 w-4" />
          New Booking
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Bookings</CardTitle>
          <CardDescription>View and manage all vehicle bookings.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div className="flex w-full max-w-sm items-center space-x-2">
              <Search className="h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search bookings..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full"
              />
            </div>
            <div className="flex flex-col gap-4 sm:flex-row">
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="confirmed">Confirmed</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="cancelled">Cancelled</SelectItem>
                </SelectContent>
              </Select>
              <Select value={dateFilter} onValueChange={setDateFilter}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Filter by date" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Dates</SelectItem>
                  <SelectItem value="today">Today</SelectItem>
                  <SelectItem value="tomorrow">Tomorrow</SelectItem>
                  <SelectItem value="week">Next 7 Days</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <Tabs defaultValue="all" className="mt-6">
            <TabsList>
              <TabsTrigger value="all">All Bookings</TabsTrigger>
              <TabsTrigger value="pending">Pending</TabsTrigger>
              <TabsTrigger value="active">Active</TabsTrigger>
              <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
            </TabsList>
            <TabsContent value="all" className="mt-4">
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Booking ID</TableHead>
                      <TableHead>Customer</TableHead>
                      <TableHead>Vehicle</TableHead>
                      <TableHead>Pickup Date</TableHead>
                      <TableHead>Return Date</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Payment</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {loading ? (
                      <TableRow>
                        <TableCell colSpan={8} className="h-24 text-center">
                          <div className="flex justify-center items-center h-full">
                            <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
                          </div>
                        </TableCell>
                      </TableRow>
                    ) : filteredBookings.length > 0 ? (
                      filteredBookings.map((booking) => (
                        <TableRow key={booking.id}>
                          <TableCell className="font-medium">{booking.id}</TableCell>
                          <TableCell>{booking.customerName}</TableCell>
                          <TableCell>{booking.vehicleName}</TableCell>
                          <TableCell>{format(booking.pickupDate.toDate(), "dd MMM yyyy")}</TableCell>
                          <TableCell>{format(booking.returnDate.toDate(), "dd MMM yyyy")}</TableCell>
                          <TableCell>{getStatusBadge(booking.status)}</TableCell>
                          <TableCell>{getPaymentStatusBadge(booking.paymentStatus)}</TableCell>
                          <TableCell className="text-right">
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon">
                                  <MoreHorizontal className="h-4 w-4" />
                                  <span className="sr-only">Open menu</span>
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                <DropdownMenuItem onClick={() => router.push(`/dashboard/bookings/${booking.id}`)}>
                                  <Eye className="mr-2 h-4 w-4" />
                                  View Details
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => router.push(`/dashboard/bookings/${booking.id}/edit`)}>
                                  <FileText className="mr-2 h-4 w-4" />
                                  Edit Booking
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuLabel>Status Actions</DropdownMenuLabel>
                                {booking.status === "pending" && (
                                  <DropdownMenuItem onClick={() => handleStatusChange(booking, "confirmed")}>
                                    <CheckCircle className="mr-2 h-4 w-4" />
                                    Confirm Booking
                                  </DropdownMenuItem>
                                )}
                                {(booking.status === "confirmed" || booking.status === "pending") && (
                                  <DropdownMenuItem onClick={() => handleStatusChange(booking, "active")}>
                                    <CheckCircle className="mr-2 h-4 w-4" />
                                    Mark as Active
                                  </DropdownMenuItem>
                                )}
                                {booking.status === "active" && (
                                  <DropdownMenuItem onClick={() => handleStatusChange(booking, "completed")}>
                                    <CheckCircle className="mr-2 h-4 w-4" />
                                    Mark as Completed
                                  </DropdownMenuItem>
                                )}
                                {(booking.status === "pending" || booking.status === "confirmed") && (
                                  <DropdownMenuItem onClick={() => handleStatusChange(booking, "cancelled")}>
                                    <XCircle className="mr-2 h-4 w-4" />
                                    Cancel Booking
                                  </DropdownMenuItem>
                                )}
                                <DropdownMenuSeparator />
                                <DropdownMenuItem
                                  onClick={() => router.push(`/dashboard/bookings/${booking.id}/invoice`)}
                                >
                                  <FileText className="mr-2 h-4 w-4" />
                                  Generate Invoice
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={8} className="h-24 text-center">
                          No bookings found.
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            </TabsContent>
            <TabsContent value="pending">
              {/* Similar table structure but filtered for pending bookings */}
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Booking ID</TableHead>
                      <TableHead>Customer</TableHead>
                      <TableHead>Vehicle</TableHead>
                      <TableHead>Pickup Date</TableHead>
                      <TableHead>Return Date</TableHead>
                      <TableHead>Payment</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {!loading && filteredBookings.filter((b) => b.status === "pending").length > 0 ? (
                      filteredBookings
                        .filter((b) => b.status === "pending")
                        .map((booking) => (
                          <TableRow key={booking.id}>
                            <TableCell className="font-medium">{booking.id}</TableCell>
                            <TableCell>{booking.customerName}</TableCell>
                            <TableCell>{booking.vehicleName}</TableCell>
                            <TableCell>{format(booking.pickupDate.toDate(), "dd MMM yyyy")}</TableCell>
                            <TableCell>{format(booking.returnDate.toDate(), "dd MMM yyyy")}</TableCell>
                            <TableCell>{getPaymentStatusBadge(booking.paymentStatus)}</TableCell>
                            <TableCell className="text-right">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleStatusChange(booking, "confirmed")}
                              >
                                Confirm
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={7} className="h-24 text-center">
                          {loading ? (
                            <div className="flex justify-center items-center h-full">
                              <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
                            </div>
                          ) : (
                            "No pending bookings found."
                          )}
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            </TabsContent>
            <TabsContent value="active">
              {/* Similar table structure but filtered for active bookings */}
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Booking ID</TableHead>
                      <TableHead>Customer</TableHead>
                      <TableHead>Vehicle</TableHead>
                      <TableHead>Pickup Date</TableHead>
                      <TableHead>Return Date</TableHead>
                      <TableHead>Payment</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {!loading && filteredBookings.filter((b) => b.status === "active").length > 0 ? (
                      filteredBookings
                        .filter((b) => b.status === "active")
                        .map((booking) => (
                          <TableRow key={booking.id}>
                            <TableCell className="font-medium">{booking.id}</TableCell>
                            <TableCell>{booking.customerName}</TableCell>
                            <TableCell>{booking.vehicleName}</TableCell>
                            <TableCell>{format(booking.pickupDate.toDate(), "dd MMM yyyy")}</TableCell>
                            <TableCell>{format(booking.returnDate.toDate(), "dd MMM yyyy")}</TableCell>
                            <TableCell>{getPaymentStatusBadge(booking.paymentStatus)}</TableCell>
                            <TableCell className="text-right">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleStatusChange(booking, "completed")}
                              >
                                Complete
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={7} className="h-24 text-center">
                          {loading ? (
                            <div className="flex justify-center items-center h-full">
                              <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
                            </div>
                          ) : (
                            "No active bookings found."
                          )}
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            </TabsContent>
            <TabsContent value="upcoming">
              {/* Similar table structure but filtered for upcoming bookings */}
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Booking ID</TableHead>
                      <TableHead>Customer</TableHead>
                      <TableHead>Vehicle</TableHead>
                      <TableHead>Pickup Date</TableHead>
                      <TableHead>Return Date</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {!loading ? (
                      filteredBookings
                        .filter((b) => {
                          const today = new Date()
                          const pickupDate = b.pickupDate.toDate()
                          return pickupDate > today && (b.status === "confirmed" || b.status === "pending")
                        })
                        .map((booking) => (
                          <TableRow key={booking.id}>
                            <TableCell className="font-medium">{booking.id}</TableCell>
                            <TableCell>{booking.customerName}</TableCell>
                            <TableCell>{booking.vehicleName}</TableCell>
                            <TableCell>{format(booking.pickupDate.toDate(), "dd MMM yyyy")}</TableCell>
                            <TableCell>{format(booking.returnDate.toDate(), "dd MMM yyyy")}</TableCell>
                            <TableCell>{getStatusBadge(booking.status)}</TableCell>
                            <TableCell className="text-right">
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button variant="ghost" size="icon">
                                    <MoreHorizontal className="h-4 w-4" />
                                    <span className="sr-only">Open menu</span>
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                  <DropdownMenuItem onClick={() => router.push(`/dashboard/bookings/${booking.id}`)}>
                                    <Eye className="mr-2 h-4 w-4" />
                                    View Details
                                  </DropdownMenuItem>
                                  <DropdownMenuItem
                                    onClick={() => router.push(`/dashboard/bookings/${booking.id}/edit`)}
                                  >
                                    <FileText className="mr-2 h-4 w-4" />
                                    Edit Booking
                                  </DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </TableCell>
                          </TableRow>
                        ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={7} className="h-24 text-center">
                          <div className="flex justify-center items-center h-full">
                            <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
                          </div>
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}
