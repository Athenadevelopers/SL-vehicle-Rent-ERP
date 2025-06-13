"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { DatePicker } from "@/components/ui/date-picker"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useToast } from "@/components/ui/use-toast"
import { useAuth } from "@/lib/auth-provider"
import { differenceInDays, addDays } from "date-fns"
import { Timestamp } from "firebase/firestore"
import {
  getVehicles,
  addBooking,
  addCustomer,
  getCustomers,
  addPayment,
  type Vehicle,
  type Customer,
} from "@/lib/firebase-db"
import { sendBookingConfirmation } from "@/lib/notification-service"

export default function NewBookingPage() {
  const router = useRouter()
  const { toast } = useToast()
  const { user } = useAuth()
  const [vehicles, setVehicles] = useState<Vehicle[]>([])
  const [customers, setCustomers] = useState<Customer[]>([])
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | null>(null)
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null)
  const [isNewCustomer, setIsNewCustomer] = useState(false)
  const [pickupDate, setPickupDate] = useState<Date>(new Date())
  const [returnDate, setReturnDate] = useState<Date>(addDays(new Date(), 1))
  const [totalDays, setTotalDays] = useState(1)
  const [totalAmount, setTotalAmount] = useState(0)
  const [paymentType, setPaymentType] = useState<"total" | "advance">("advance")
  const [advanceAmount, setAdvanceAmount] = useState(0)
  const [balanceAmount, setBalanceAmount] = useState(0)
  const [paymentMethod, setPaymentMethod] = useState<"cash" | "card" | "bank_transfer" | "online">("cash")
  const [notes, setNotes] = useState("")

  // Customer form fields
  const [customerName, setCustomerName] = useState("")
  const [customerEmail, setCustomerEmail] = useState("")
  const [customerPhone, setCustomerPhone] = useState("")
  const [customerAddress, setCustomerAddress] = useState("")
  const [customerIdType, setCustomerIdType] = useState("")
  const [customerIdNumber, setCustomerIdNumber] = useState("")

  useEffect(() => {
    if (!user) return

    const fetchData = async () => {
      try {
        const [vehiclesData, customersData] = await Promise.all([getVehicles(), getCustomers()])

        // Filter only available vehicles
        const availableVehicles = vehiclesData.filter((v) => v.status === "available")
        setVehicles(availableVehicles)
        setCustomers(customersData)
      } catch (error) {
        console.error("Error fetching data:", error)
        toast({
          title: "Error loading data",
          description: "There was an error loading the necessary data. Please try again.",
          variant: "destructive",
        })
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [user, toast])

  useEffect(() => {
    if (pickupDate && returnDate) {
      const days = Math.max(1, differenceInDays(returnDate, pickupDate))
      setTotalDays(days)

      if (selectedVehicle) {
        const amount = days * selectedVehicle.dailyRate
        setTotalAmount(amount)

        // Set default advance amount (50% of total)
        const defaultAdvance = Math.round(amount * 0.5)
        setAdvanceAmount(defaultAdvance)
        setBalanceAmount(amount - defaultAdvance)
      }
    }
  }, [pickupDate, returnDate, selectedVehicle])

  useEffect(() => {
    if (totalAmount > 0) {
      if (paymentType === "total") {
        setAdvanceAmount(totalAmount)
        setBalanceAmount(0)
      } else {
        // Default to 50% advance
        const defaultAdvance = Math.round(totalAmount * 0.5)
        setAdvanceAmount(defaultAdvance)
        setBalanceAmount(totalAmount - defaultAdvance)
      }
    }
  }, [paymentType, totalAmount])

  useEffect(() => {
    if (totalAmount > 0) {
      setBalanceAmount(totalAmount - advanceAmount)
    }
  }, [advanceAmount, totalAmount])

  const handleVehicleSelect = (vehicleId: string) => {
    const vehicle = vehicles.find((v) => v.id === vehicleId)
    setSelectedVehicle(vehicle || null)

    if (vehicle && pickupDate && returnDate) {
      const days = Math.max(1, differenceInDays(returnDate, pickupDate))
      const amount = days * vehicle.dailyRate
      setTotalAmount(amount)

      // Set default advance amount (50% of total)
      const defaultAdvance = Math.round(amount * 0.5)
      setAdvanceAmount(defaultAdvance)
      setBalanceAmount(amount - defaultAdvance)
    }
  }

  const handleCustomerSelect = (customerId: string) => {
    if (customerId === "new") {
      setIsNewCustomer(true)
      setSelectedCustomer(null)
      // Clear customer form fields
      setCustomerName("")
      setCustomerEmail("")
      setCustomerPhone("")
      setCustomerAddress("")
      setCustomerIdType("")
      setCustomerIdNumber("")
    } else {
      setIsNewCustomer(false)
      const customer = customers.find((c) => c.id === customerId)
      setSelectedCustomer(customer || null)

      if (customer) {
        // Fill customer form fields
        setCustomerName(customer.name)
        setCustomerEmail(customer.email)
        setCustomerPhone(customer.phone)
        setCustomerAddress(customer.address || "")
        setCustomerIdType(customer.idType || "")
        setCustomerIdNumber(customer.idNumber || "")
      }
    }
  }

  const handleAdvanceAmountChange = (value: string) => {
    const amount = Number.parseFloat(value) || 0
    // Ensure advance amount doesn't exceed total amount
    const validAmount = Math.min(amount, totalAmount)
    setAdvanceAmount(validAmount)
    setBalanceAmount(totalAmount - validAmount)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!user) {
      toast({
        title: "Authentication required",
        description: "You must be logged in to create a booking.",
        variant: "destructive",
      })
      return
    }

    if (!selectedVehicle) {
      toast({
        title: "Vehicle required",
        description: "Please select a vehicle for the booking.",
        variant: "destructive",
      })
      return
    }

    if (!isNewCustomer && !selectedCustomer) {
      toast({
        title: "Customer required",
        description: "Please select a customer or create a new one.",
        variant: "destructive",
      })
      return
    }

    if (isNewCustomer && (!customerName || !customerEmail || !customerPhone)) {
      toast({
        title: "Customer information required",
        description: "Please fill in all required customer information.",
        variant: "destructive",
      })
      return
    }

    try {
      setSubmitting(true)

      // Create new customer if needed
      let customerId = selectedCustomer?.id
      if (isNewCustomer) {
        customerId = await addCustomer({
          name: customerName,
          email: customerEmail,
          phone: customerPhone,
          address: customerAddress,
          idType: customerIdType,
          idNumber: customerIdNumber,
        })
      }

      // Create booking
      const bookingData = {
        customerName: isNewCustomer ? customerName : selectedCustomer!.name,
        customerEmail: isNewCustomer ? customerEmail : selectedCustomer!.email,
        customerPhone: isNewCustomer ? customerPhone : selectedCustomer!.phone,
        customerAddress: isNewCustomer ? customerAddress : selectedCustomer?.address,
        customerIdType: isNewCustomer ? customerIdType : selectedCustomer?.idType,
        customerIdNumber: isNewCustomer ? customerIdNumber : selectedCustomer?.idNumber,
        vehicleId: selectedVehicle.id,
        vehicleName: selectedVehicle.name,
        pickupDate: Timestamp.fromDate(pickupDate),
        returnDate: Timestamp.fromDate(returnDate),
        totalDays,
        totalAmount,
        paymentType,
        advanceAmount,
        balanceAmount,
        paymentStatus: advanceAmount >= totalAmount ? "paid" : advanceAmount > 0 ? "partial" : "unpaid",
        status: "pending",
        notes,
        createdBy: user.uid,
      }

      const bookingId = await addBooking(bookingData)

      // Create payment record if advance amount is paid
      if (advanceAmount > 0) {
        await addPayment({
          bookingId,
          customerName: isNewCustomer ? customerName : selectedCustomer!.name,
          vehicleName: selectedVehicle.name,
          amount: advanceAmount,
          paymentMethod,
          status: "completed",
          date: Timestamp.fromDate(new Date()),
        })
      }

      // Send confirmation email and SMS
      await sendBookingConfirmation({
        customerName: isNewCustomer ? customerName : selectedCustomer!.name,
        customerEmail: isNewCustomer ? customerEmail : selectedCustomer!.email,
        customerPhone: isNewCustomer ? customerPhone : selectedCustomer!.phone,
        bookingId,
        vehicleName: selectedVehicle.name,
        pickupDate: pickupDate.toLocaleDateString(),
        returnDate: returnDate.toLocaleDateString(),
        totalAmount,
        paymentStatus: advanceAmount >= totalAmount ? "paid" : advanceAmount > 0 ? "partial" : "unpaid",
      })

      toast({
        title: "Booking created successfully",
        description: `Booking ID: ${bookingId}`,
      })

      // Redirect to bookings page
      router.push("/dashboard/bookings")
    } catch (error) {
      console.error("Error creating booking:", error)
      toast({
        title: "Error creating booking",
        description: "There was an error creating the booking. Please try again.",
        variant: "destructive",
      })
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">New Booking</h1>
        <Button variant="outline" onClick={() => router.back()}>
          Cancel
        </Button>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Vehicle Selection</CardTitle>
              <CardDescription>Select a vehicle for the booking.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="vehicle">Select Vehicle</Label>
                <Select onValueChange={handleVehicleSelect}>
                  <SelectTrigger id="vehicle">
                    <SelectValue placeholder="Select a vehicle" />
                  </SelectTrigger>
                  <SelectContent>
                    {vehicles.length > 0 ? (
                      vehicles.map((vehicle) => (
                        <SelectItem key={vehicle.id} value={vehicle.id}>
                          {vehicle.name} - {vehicle.licensePlate} (₹{vehicle.dailyRate}/day)
                        </SelectItem>
                      ))
                    ) : (
                      <SelectItem value="none" disabled>
                        No available vehicles
                      </SelectItem>
                    )}
                  </SelectContent>
                </Select>
              </div>

              {selectedVehicle && (
                <div className="rounded-lg border p-4 space-y-3">
                  <div className="flex justify-between">
                    <span className="font-medium">Vehicle:</span>
                    <span>{selectedVehicle.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium">License Plate:</span>
                    <span>{selectedVehicle.licensePlate}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium">Type:</span>
                    <span>{selectedVehicle.type}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium">Daily Rate:</span>
                    <span>₹{selectedVehicle.dailyRate}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium">Fuel Type:</span>
                    <span>{selectedVehicle.fuelType}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium">Transmission:</span>
                    <span>{selectedVehicle.transmission}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium">Seats:</span>
                    <span>{selectedVehicle.seats}</span>
                  </div>
                </div>
              )}

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="pickup-date">Pickup Date</Label>
                  <DatePicker id="pickup-date" date={pickupDate} onDateChange={setPickupDate} minDate={new Date()} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="return-date">Return Date</Label>
                  <DatePicker id="return-date" date={returnDate} onDateChange={setReturnDate} minDate={pickupDate} />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="notes">Notes</Label>
                <Textarea
                  id="notes"
                  placeholder="Additional notes or requirements"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                />
              </div>
            </CardContent>
          </Card>

          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Customer Information</CardTitle>
                <CardDescription>Select an existing customer or create a new one.</CardDescription>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="existing" onValueChange={(value) => setIsNewCustomer(value === "new")}>
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="existing">Existing Customer</TabsTrigger>
                    <TabsTrigger value="new">New Customer</TabsTrigger>
                  </TabsList>
                  <TabsContent value="existing" className="space-y-4 pt-4">
                    <div className="space-y-2">
                      <Label htmlFor="customer">Select Customer</Label>
                      <Select onValueChange={handleCustomerSelect}>
                        <SelectTrigger id="customer">
                          <SelectValue placeholder="Select a customer" />
                        </SelectTrigger>
                        <SelectContent>
                          {customers.length > 0 ? (
                            customers.map((customer) => (
                              <SelectItem key={customer.id} value={customer.id}>
                                {customer.name} - {customer.phone}
                              </SelectItem>
                            ))
                          ) : (
                            <SelectItem value="none" disabled>
                              No customers found
                            </SelectItem>
                          )}
                          <SelectItem value="new">+ Add New Customer</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    {selectedCustomer && (
                      <div className="rounded-lg border p-4 space-y-3">
                        <div className="flex justify-between">
                          <span className="font-medium">Name:</span>
                          <span>{selectedCustomer.name}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="font-medium">Email:</span>
                          <span>{selectedCustomer.email}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="font-medium">Phone:</span>
                          <span>{selectedCustomer.phone}</span>
                        </div>
                        {selectedCustomer.address && (
                          <div className="flex justify-between">
                            <span className="font-medium">Address:</span>
                            <span>{selectedCustomer.address}</span>
                          </div>
                        )}
                        {selectedCustomer.idType && selectedCustomer.idNumber && (
                          <div className="flex justify-between">
                            <span className="font-medium">ID:</span>
                            <span>
                              {selectedCustomer.idType}: {selectedCustomer.idNumber}
                            </span>
                          </div>
                        )}
                      </div>
                    )}
                  </TabsContent>
                  <TabsContent value="new" className="space-y-4 pt-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="customer-name">Name</Label>
                        <Input
                          id="customer-name"
                          placeholder="Full name"
                          value={customerName}
                          onChange={(e) => setCustomerName(e.target.value)}
                          required={isNewCustomer}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="customer-email">Email</Label>
                        <Input
                          id="customer-email"
                          type="email"
                          placeholder="Email address"
                          value={customerEmail}
                          onChange={(e) => setCustomerEmail(e.target.value)}
                          required={isNewCustomer}
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="customer-phone">Phone</Label>
                        <Input
                          id="customer-phone"
                          placeholder="Phone number"
                          value={customerPhone}
                          onChange={(e) => setCustomerPhone(e.target.value)}
                          required={isNewCustomer}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="customer-address">Address</Label>
                        <Input
                          id="customer-address"
                          placeholder="Address"
                          value={customerAddress}
                          onChange={(e) => setCustomerAddress(e.target.value)}
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="customer-id-type">ID Type</Label>
                        <Select value={customerIdType} onValueChange={setCustomerIdType}>
                          <SelectTrigger id="customer-id-type">
                            <SelectValue placeholder="Select ID type" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="passport">Passport</SelectItem>
                            <SelectItem value="driving_license">Driving License</SelectItem>
                            <SelectItem value="national_id">National ID</SelectItem>
                            <SelectItem value="other">Other</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="customer-id-number">ID Number</Label>
                        <Input
                          id="customer-id-number"
                          placeholder="ID number"
                          value={customerIdNumber}
                          onChange={(e) => setCustomerIdNumber(e.target.value)}
                        />
                      </div>
                    </div>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Payment Details</CardTitle>
                <CardDescription>Calculate and process payment.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="rounded-lg border p-4 space-y-3">
                  <div className="flex justify-between">
                    <span className="font-medium">Total Days:</span>
                    <span>{totalDays}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium">Daily Rate:</span>
                    <span>₹{selectedVehicle?.dailyRate || 0}</span>
                  </div>
                  <div className="flex justify-between text-lg font-semibold">
                    <span>Total Amount:</span>
                    <span>₹{totalAmount}</span>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="payment-type">Payment Type</Label>
                  <Select value={paymentType} onValueChange={(value) => setPaymentType(value as "total" | "advance")}>
                    <SelectTrigger id="payment-type">
                      <SelectValue placeholder="Select payment type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="total">Full Payment</SelectItem>
                      <SelectItem value="advance">Advance Payment</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {paymentType === "advance" && (
                  <div className="space-y-2">
                    <Label htmlFor="advance-amount">Advance Amount</Label>
                    <Input
                      id="advance-amount"
                      type="number"
                      min="0"
                      max={totalAmount}
                      value={advanceAmount}
                      onChange={(e) => handleAdvanceAmountChange(e.target.value)}
                    />
                  </div>
                )}

                <div className="space-y-2">
                  <Label htmlFor="payment-method">Payment Method</Label>
                  <Select
                    value={paymentMethod}
                    onValueChange={(value) => setPaymentMethod(value as "cash" | "card" | "bank_transfer" | "online")}
                  >
                    <SelectTrigger id="payment-method">
                      <SelectValue placeholder="Select payment method" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="cash">Cash</SelectItem>
                      <SelectItem value="card">Card</SelectItem>
                      <SelectItem value="bank_transfer">Bank Transfer</SelectItem>
                      <SelectItem value="online">Online Payment</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="rounded-lg border p-4 space-y-3">
                  <div className="flex justify-between">
                    <span className="font-medium">Advance Amount:</span>
                    <span>₹{advanceAmount}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium">Balance Amount:</span>
                    <span>₹{balanceAmount}</span>
                  </div>
                  <div className="flex justify-between font-semibold">
                    <span>Payment Status:</span>
                    <span>{advanceAmount >= totalAmount ? "Paid" : advanceAmount > 0 ? "Partial" : "Unpaid"}</span>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button type="submit" className="w-full" disabled={submitting}>
                  {submitting ? "Creating Booking..." : "Create Booking"}
                </Button>
              </CardFooter>
            </Card>
          </div>
        </div>
      </form>
    </div>
  )
}
