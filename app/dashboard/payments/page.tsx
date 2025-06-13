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
import { Search, Plus, MoreHorizontal, FileText, Download } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useToast } from "@/components/ui/use-toast"
import { useAuth } from "@/lib/auth-provider"
import { format } from "date-fns"
import {
  subscribeToPayments,
  subscribeToBookings,
  getMockPayments,
  type Payment,
  type Booking,
} from "@/lib/firebase-db"

export default function PaymentsPage() {
  const router = useRouter()
  const { toast } = useToast()
  const { user } = useAuth()
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [dateFilter, setDateFilter] = useState("all")
  const [payments, setPayments] = useState<Payment[]>([])
  const [bookings, setBookings] = useState<Booking[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!user) return

    // Subscribe to real-time payments updates
    const unsubscribePayments = subscribeToPayments((updatedPayments) => {
      setPayments(updatedPayments)
    })

    // Subscribe to bookings to calculate payments correctly
    const unsubscribeBookings = subscribeToBookings((updatedBookings) => {
      setBookings(updatedBookings)
      setLoading(false)
    })

    // Fallback to mock data if no payments are returned after 2 seconds
    const timeout = setTimeout(() => {
      if (loading) {
        setPayments(getMockPayments())
        setLoading(false)
      }
    }, 2000)

    return () => {
      unsubscribePayments()
      unsubscribeBookings()
      clearTimeout(timeout)
    }
  }, [user, loading])

  const filteredPayments = payments.filter((payment) => {
    // Apply search filter
    const matchesSearch =
      payment.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      payment.vehicleName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      payment.invoiceNumber.toLowerCase().includes(searchQuery.toLowerCase())

    // Apply status filter
    const matchesStatus = statusFilter === "all" || payment.status === statusFilter

    // Apply date filter
    let matchesDate = true
    const today = new Date()
    const yesterday = new Date(today)
    yesterday.setDate(yesterday.getDate() - 1)
    const lastWeek = new Date(today)
    lastWeek.setDate(lastWeek.getDate() - 7)
    const paymentDate = payment.date.toDate()

    if (dateFilter === "today") {
      matchesDate = paymentDate.toDateString() === today.toDateString()
    } else if (dateFilter === "yesterday") {
      matchesDate = paymentDate.toDateString() === yesterday.toDateString()
    } else if (dateFilter === "week") {
      matchesDate = paymentDate >= lastWeek && paymentDate <= today
    }

    return matchesSearch && matchesStatus && matchesDate
  })

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "completed":
        return (
          <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
            Completed
          </Badge>
        )
      case "pending":
        return (
          <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">
            Pending
          </Badge>
        )
      case "failed":
        return (
          <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">
            Failed
          </Badge>
        )
      case "refunded":
        return (
          <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
            Refunded
          </Badge>
        )
      default:
        return <Badge variant="outline">Unknown</Badge>
    }
  }

  const getPaymentMethodBadge = (method: string) => {
    switch (method) {
      case "cash":
        return (
          <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
            Cash
          </Badge>
        )
      case "card":
        return (
          <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
            Card
          </Badge>
        )
      case "bank_transfer":
        return (
          <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200">
            Bank Transfer
          </Badge>
        )
      case "online":
        return (
          <Badge variant="outline" className="bg-indigo-50 text-indigo-700 border-indigo-200">
            Online
          </Badge>
        )
      default:
        return <Badge variant="outline">Unknown</Badge>
    }
  }

  // Function to get booking details for a payment
  const getBookingDetails = (bookingId: string) => {
    return bookings.find((b) => b.id === bookingId)
  }

  // Calculate total amount due for a booking (including days until return)
  const calculateTotalDue = (booking: Booking | undefined) => {
    if (!booking) return 0

    const pickupDate = booking.pickupDate.toDate()
    const returnDate = booking.returnDate.toDate()
    const today = new Date()

    // If the booking is active and today is before the return date
    if (booking.status === "active" && today < returnDate) {
      // Calculate days elapsed so far
      const daysElapsed = Math.max(1, differenceInDays(today, pickupDate))
      // Get daily rate (total amount / total days)
      const dailyRate = booking.totalAmount / booking.totalDays
      // Calculate amount due so far
      return Math.round(daysElapsed * dailyRate)
    }

    // Otherwise return the total amount
    return booking.totalAmount
  }

  // Calculate amount paid so far for a booking
  const calculateAmountPaid = (bookingId: string) => {
    return payments
      .filter((p) => p.bookingId === bookingId && p.status === "completed")
      .reduce((sum, payment) => sum + payment.amount, 0)
  }

  // Calculate balance due for a booking
  const calculateBalanceDue = (booking: Booking | undefined) => {
    if (!booking) return 0

    const totalDue = calculateTotalDue(booking)
    const amountPaid = calculateAmountPaid(booking.id)

    return Math.max(0, totalDue - amountPaid)
  }

  // Helper function to calculate days difference
  const differenceInDays = (date1: Date, date2: Date) => {
    const diffTime = Math.abs(date1.getTime() - date2.getTime())
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24))
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Payments</h1>
        <Button className="bg-primary hover:bg-primary/90" onClick={() => router.push("/dashboard/payments/new")}>
          <Plus className="mr-2 h-4 w-4" />
          New Payment
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Payments</CardTitle>
          <CardDescription>View and manage all payment transactions.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div className="flex w-full max-w-sm items-center space-x-2">
              <Search className="h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search payments..."
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
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="failed">Failed</SelectItem>
                  <SelectItem value="refunded">Refunded</SelectItem>
                </SelectContent>
              </Select>
              <Select value={dateFilter} onValueChange={setDateFilter}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Filter by date" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Dates</SelectItem>
                  <SelectItem value="today">Today</SelectItem>
                  <SelectItem value="yesterday">Yesterday</SelectItem>
                  <SelectItem value="week">Last 7 Days</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <Tabs defaultValue="all" className="mt-6">
            <TabsList>
              <TabsTrigger value="all">All Payments</TabsTrigger>
              <TabsTrigger value="pending">Pending</TabsTrigger>
              <TabsTrigger value="outstanding">Outstanding</TabsTrigger>
            </TabsList>
            <TabsContent value="all" className="mt-4">
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Invoice #</TableHead>
                      <TableHead>Customer</TableHead>
                      <TableHead>Vehicle</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead>Method</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Status</TableHead>
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
                    ) : filteredPayments.length > 0 ? (
                      filteredPayments.map((payment) => (
                        <TableRow key={payment.id}>
                          <TableCell className="font-medium">{payment.invoiceNumber}</TableCell>
                          <TableCell>{payment.customerName}</TableCell>
                          <TableCell>{payment.vehicleName}</TableCell>
                          <TableCell>₹{payment.amount.toLocaleString()}</TableCell>
                          <TableCell>{getPaymentMethodBadge(payment.paymentMethod)}</TableCell>
                          <TableCell>{format(payment.date.toDate(), "dd MMM yyyy")}</TableCell>
                          <TableCell>{getStatusBadge(payment.status)}</TableCell>
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
                                <DropdownMenuItem onClick={() => router.push(`/dashboard/payments/${payment.id}`)}>
                                  <FileText className="mr-2 h-4 w-4" />
                                  View Details
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                  onClick={() => router.push(`/dashboard/payments/${payment.id}/receipt`)}
                                >
                                  <Download className="mr-2 h-4 w-4" />
                                  Download Receipt
                                </DropdownMenuItem>
                                {payment.bookingId && (
                                  <DropdownMenuItem
                                    onClick={() => router.push(`/dashboard/bookings/${payment.bookingId}`)}
                                  >
                                    <FileText className="mr-2 h-4 w-4" />
                                    View Booking
                                  </DropdownMenuItem>
                                )}
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={8} className="h-24 text-center">
                          No payments found.
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            </TabsContent>
            <TabsContent value="pending">
              {/* Similar table structure but filtered for pending payments */}
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Invoice #</TableHead>
                      <TableHead>Customer</TableHead>
                      <TableHead>Vehicle</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead>Method</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {!loading && filteredPayments.filter((p) => p.status === "pending").length > 0 ? (
                      filteredPayments
                        .filter((p) => p.status === "pending")
                        .map((payment) => (
                          <TableRow key={payment.id}>
                            <TableCell className="font-medium">{payment.invoiceNumber}</TableCell>
                            <TableCell>{payment.customerName}</TableCell>
                            <TableCell>{payment.vehicleName}</TableCell>
                            <TableCell>₹{payment.amount.toLocaleString()}</TableCell>
                            <TableCell>{getPaymentMethodBadge(payment.paymentMethod)}</TableCell>
                            <TableCell>{format(payment.date.toDate(), "dd MMM yyyy")}</TableCell>
                            <TableCell className="text-right">
                              <Button variant="outline" size="sm">
                                Process Payment
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
                            "No pending payments found."
                          )}
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            </TabsContent>
            <TabsContent value="outstanding">
              {/* Table for outstanding balances */}
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Booking ID</TableHead>
                      <TableHead>Customer</TableHead>
                      <TableHead>Vehicle</TableHead>
                      <TableHead>Total Due</TableHead>
                      <TableHead>Amount Paid</TableHead>
                      <TableHead>Balance Due</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {!loading ? (
                      bookings
                        .filter((b) => {
                          // Only show active or confirmed bookings with outstanding balance
                          if (b.status !== "active" && b.status !== "confirmed") return false
                          const balanceDue = calculateBalanceDue(b)
                          return balanceDue > 0
                        })
                        .map((booking) => {
                          const totalDue = calculateTotalDue(booking)
                          const amountPaid = calculateAmountPaid(booking.id)
                          const balanceDue = calculateBalanceDue(booking)

                          return (
                            <TableRow key={booking.id}>
                              <TableCell className="font-medium">{booking.id}</TableCell>
                              <TableCell>{booking.customerName}</TableCell>
                              <TableCell>{booking.vehicleName}</TableCell>
                              <TableCell>₹{totalDue.toLocaleString()}</TableCell>
                              <TableCell>₹{amountPaid.toLocaleString()}</TableCell>
                              <TableCell className="font-medium text-destructive">
                                ₹{balanceDue.toLocaleString()}
                              </TableCell>
                              <TableCell className="text-right">
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => router.push(`/dashboard/payments/new?bookingId=${booking.id}`)}
                                >
                                  Collect Payment
                                </Button>
                              </TableCell>
                            </TableRow>
                          )
                        })
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
