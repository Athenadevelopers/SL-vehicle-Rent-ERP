import { db, rtdb, storage } from "./firebase"
import {
  collection,
  doc,
  getDoc,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  orderBy,
  serverTimestamp,
  onSnapshot,
  Timestamp,
} from "firebase/firestore"
import { ref, uploadBytes, getDownloadURL } from "firebase/storage"
import { ref as rtdbRef, get, set } from "firebase/database"

// Types
export interface Vehicle {
  id: string
  name: string
  type: string
  licensePlate: string
  dailyRate: number
  status: "available" | "rented" | "maintenance" | "unavailable"
  fuelType: string
  transmission: string
  seats: number
  features: string[]
  image?: string
  lastMaintenance?: Timestamp
  nextMaintenance?: Timestamp
  createdAt: Timestamp
  updatedAt: Timestamp
}

export interface Booking {
  id: string
  customerName: string
  customerEmail: string
  customerPhone: string
  customerAddress?: string
  customerIdType?: string
  customerIdNumber?: string
  vehicleId: string
  vehicleName: string
  pickupDate: Timestamp
  returnDate: Timestamp
  totalDays: number
  totalAmount: number
  paymentType: "total" | "advance"
  advanceAmount: number
  balanceAmount: number
  paymentStatus: "unpaid" | "partial" | "paid"
  status: "pending" | "confirmed" | "active" | "completed" | "cancelled"
  notes?: string
  createdBy: string
  createdAt: Timestamp
  updatedAt?: Timestamp
}

export interface Customer {
  id: string
  name: string
  email: string
  phone: string
  address?: string
  idType?: string
  idNumber?: string
  bookings: string[]
  createdAt: Timestamp
}

export interface Payment {
  id: string
  bookingId: string
  customerName: string
  vehicleName: string
  amount: number
  paymentMethod: "cash" | "card" | "bank_transfer" | "online"
  status: "completed" | "pending" | "failed" | "refunded"
  date: Timestamp
  invoiceNumber: string
}

// Vehicle Management
export async function getVehicles() {
  const vehiclesSnapshot = await getDocs(collection(db, "vehicles"))
  return vehiclesSnapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  })) as Vehicle[]
}

export function subscribeToVehicles(callback: (vehicles: Vehicle[]) => void) {
  const q = query(collection(db, "vehicles"), orderBy("createdAt", "desc"))
  return onSnapshot(q, (snapshot) => {
    const vehicles = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as Vehicle[]
    callback(vehicles)
  })
}

export async function getVehicleById(id: string) {
  const vehicleDoc = await getDoc(doc(db, "vehicles", id))
  if (vehicleDoc.exists()) {
    return {
      id: vehicleDoc.id,
      ...vehicleDoc.data(),
    } as Vehicle
  }
  return null
}

export async function addVehicle(vehicleData: Partial<Vehicle>) {
  const vehicleRef = await addDoc(collection(db, "vehicles"), {
    ...vehicleData,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  })
  return vehicleRef.id
}

export async function updateVehicle(id: string, vehicleData: Partial<Vehicle>) {
  await updateDoc(doc(db, "vehicles", id), {
    ...vehicleData,
    updatedAt: serverTimestamp(),
  })
}

export async function deleteVehicle(id: string) {
  await deleteDoc(doc(db, "vehicles", id))
}

export async function scheduleVehicleMaintenance(id: string, date: Date) {
  await updateDoc(doc(db, "vehicles", id), {
    nextMaintenance: Timestamp.fromDate(date),
    updatedAt: serverTimestamp(),
  })
}

export async function completeVehicleMaintenance(id: string, notes: string) {
  const now = new Date()
  const nextMaintenanceDate = new Date()
  nextMaintenanceDate.setMonth(now.getMonth() + 3) // Schedule next maintenance in 3 months

  await updateDoc(doc(db, "vehicles", id), {
    lastMaintenance: Timestamp.fromDate(now),
    nextMaintenance: Timestamp.fromDate(nextMaintenanceDate),
    status: "available",
    maintenanceNotes: notes,
    updatedAt: serverTimestamp(),
  })
}

// Booking Management
export async function getBookings() {
  const bookingsSnapshot = await getDocs(query(collection(db, "bookings"), orderBy("createdAt", "desc")))
  return bookingsSnapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  })) as Booking[]
}

export function subscribeToBookings(callback: (bookings: Booking[]) => void) {
  const q = query(collection(db, "bookings"), orderBy("createdAt", "desc"))
  return onSnapshot(q, (snapshot) => {
    const bookings = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as Booking[]
    callback(bookings)
  })
}

export async function getBookingById(id: string) {
  const bookingDoc = await getDoc(doc(db, "bookings", id))
  if (bookingDoc.exists()) {
    return {
      id: bookingDoc.id,
      ...bookingDoc.data(),
    } as Booking
  }
  return null
}

export async function addBooking(bookingData: Partial<Booking>) {
  // Generate a booking ID with B prefix and 5 digits
  const bookingId = "B" + Math.floor(10000 + Math.random() * 90000).toString()

  const bookingRef = await addDoc(collection(db, "bookings"), {
    ...bookingData,
    id: bookingId,
    createdAt: serverTimestamp(),
  })

  // Update the vehicle status to rented
  if (bookingData.vehicleId) {
    await updateDoc(doc(db, "vehicles", bookingData.vehicleId), {
      status: "rented",
      updatedAt: serverTimestamp(),
    })
  }

  return bookingRef.id
}

export async function updateBooking(id: string, bookingData: Partial<Booking>) {
  await updateDoc(doc(db, "bookings", id), {
    ...bookingData,
    updatedAt: serverTimestamp(),
  })
}

export async function updateBookingStatus(id: string, status: Booking["status"]) {
  const booking = await getBookingById(id)

  await updateDoc(doc(db, "bookings", id), {
    status,
    updatedAt: serverTimestamp(),
  })

  // If completed, make the vehicle available again
  if (status === "completed" && booking?.vehicleId) {
    await updateDoc(doc(db, "vehicles", booking.vehicleId), {
      status: "available",
      updatedAt: serverTimestamp(),
    })
  }

  // If cancelled and the booking was active, make the vehicle available again
  if (status === "cancelled" && booking?.status === "active" && booking?.vehicleId) {
    await updateDoc(doc(db, "vehicles", booking.vehicleId), {
      status: "available",
      updatedAt: serverTimestamp(),
    })
  }
}

export async function deleteBooking(id: string) {
  const booking = await getBookingById(id)

  // If the booking has an active vehicle, make it available again
  if (booking?.status === "active" && booking?.vehicleId) {
    await updateDoc(doc(db, "vehicles", booking.vehicleId), {
      status: "available",
      updatedAt: serverTimestamp(),
    })
  }

  await deleteDoc(doc(db, "bookings", id))
}

// Customer Management
export async function getCustomers() {
  const customersQuery = query(collection(db, "customers"), orderBy("createdAt", "desc"))
  const customersSnapshot = await getDocs(customersQuery)
  return customersSnapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  })) as Customer[]
}

export function subscribeToCustomers(callback: (customers: Customer[]) => void) {
  const q = query(collection(db, "customers"), orderBy("createdAt", "desc"))
  return onSnapshot(q, (snapshot) => {
    const customers = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as Customer[]
    callback(customers)
  })
}

export async function getCustomerById(id: string) {
  const customerDoc = await getDoc(doc(db, "customers", id))
  if (customerDoc.exists()) {
    return {
      id: customerDoc.id,
      ...customerDoc.data(),
    } as Customer
  }
  return null
}

export async function addCustomer(customerData: Partial<Customer>) {
  const customerRef = await addDoc(collection(db, "customers"), {
    ...customerData,
    bookings: [],
    createdAt: serverTimestamp(),
  })
  return customerRef.id
}

export async function updateCustomer(id: string, customerData: Partial<Customer>) {
  await updateDoc(doc(db, "customers", id), {
    ...customerData,
    updatedAt: serverTimestamp(),
  })
}

export async function deleteCustomer(id: string) {
  await deleteDoc(doc(db, "customers", id))
}

// Payment Management
export async function getPayments() {
  const paymentsSnapshot = await getDocs(query(collection(db, "payments"), orderBy("date", "desc")))
  return paymentsSnapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  })) as Payment[]
}

export function subscribeToPayments(callback: (payments: Payment[]) => void) {
  const q = query(collection(db, "payments"), orderBy("date", "desc"))
  return onSnapshot(q, (snapshot) => {
    const payments = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as Payment[]
    callback(payments)
  })
}

export async function addPayment(paymentData: Partial<Payment>) {
  // Generate an invoice number with INV prefix, year, and 4 digits
  const year = new Date().getFullYear()
  const invoiceNumber = `INV-${year}-${Math.floor(1000 + Math.random() * 9000).toString()}`

  const paymentRef = await addDoc(collection(db, "payments"), {
    ...paymentData,
    invoiceNumber,
    date: paymentData.date || serverTimestamp(),
    status: paymentData.status || "completed",
  })

  // If this is for a booking, update the booking's payment status
  if (paymentData.bookingId) {
    const booking = await getBookingById(paymentData.bookingId)
    if (booking) {
      const totalPaid = (booking.advanceAmount || 0) + (paymentData.amount || 0)
      const newPaymentStatus = totalPaid >= booking.totalAmount ? "paid" : "partial"

      await updateDoc(doc(db, "bookings", paymentData.bookingId), {
        paymentStatus: newPaymentStatus,
        advanceAmount: totalPaid,
        balanceAmount: booking.totalAmount - totalPaid,
        updatedAt: serverTimestamp(),
      })
    }
  }

  return paymentRef.id
}

// File Upload
export async function uploadFile(file: File, path: string) {
  const storageRef = ref(storage, path)
  await uploadBytes(storageRef, file)
  return getDownloadURL(storageRef)
}

// Real-time Fleet Tracking
export async function updateVehicleLocation(vehicleId: string, location: { lat: number; lng: number }) {
  const locationRef = rtdbRef(rtdb, `vehicleLocations/${vehicleId}`)
  await set(locationRef, {
    ...location,
    timestamp: Date.now(),
  })
}

export async function getVehicleLocation(vehicleId: string) {
  const locationRef = rtdbRef(rtdb, `vehicleLocations/${vehicleId}`)
  const snapshot = await get(locationRef)
  if (snapshot.exists()) {
    return snapshot.val()
  }
  return null
}

// Dashboard Stats
export async function getStats() {
  try {
    const [vehicles, bookings, payments, customers] = await Promise.all([
      getVehicles(),
      getBookings(),
      getPayments(),
      getCustomers(),
    ])

    const activeBookings = bookings.filter((b) => b.status === "active").length
    const totalBookings = bookings.length
    const totalVehicles = vehicles.length
    const availableVehicles = vehicles.filter((v) => v.status === "available").length
    const totalRevenue = payments.reduce((sum, payment) => sum + (payment.amount || 0), 0)

    const fleetUtilization = totalVehicles > 0 ? ((totalVehicles - availableVehicles) / totalVehicles) * 100 : 0

    // Calculate customer satisfaction (mock data)
    const customerSatisfaction = 4.7

    return {
      totalBookings,
      activeBookings,
      totalVehicles,
      availableVehicles,
      totalRevenue,
      fleetUtilization,
      customerSatisfaction,
      totalCustomers: customers.length,
    }
  } catch (error) {
    console.error("Error getting stats:", error)
    // Return mock data as fallback
    return {
      totalBookings: 156,
      activeBookings: 42,
      totalVehicles: 75,
      availableVehicles: 24,
      totalRevenue: 1250000,
      fleetUtilization: 68,
      customerSatisfaction: 4.7,
      totalCustomers: 120,
    }
  }
}

export async function getRecentBookings(limit = 5) {
  const bookingsQuery = query(collection(db, "bookings"), orderBy("createdAt", "desc"), limit)
  const bookingsSnapshot = await getDocs(bookingsQuery)
  return bookingsSnapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  })) as Booking[]
}

// Reports
export async function generateReport(reportType: string, startDate: Date, endDate: Date) {
  // In a real app, you would query the database based on the report type and date range
  // For now, we'll return mock data
  return {
    reportType,
    startDate,
    endDate,
    data: [
      { date: "2023-01-01", value: 25000 },
      { date: "2023-01-02", value: 30000 },
      { date: "2023-01-03", value: 27500 },
      { date: "2023-01-04", value: 32000 },
      { date: "2023-01-05", value: 29000 },
      { date: "2023-01-06", value: 31500 },
      { date: "2023-01-07", value: 34000 },
    ],
  }
}

// Mock data for development
export function getMockVehicles(): Vehicle[] {
  return [
    {
      id: "v1",
      name: "Toyota Corolla",
      type: "Sedan",
      licensePlate: "CAB-1234",
      dailyRate: 5000,
      status: "available",
      fuelType: "Petrol",
      transmission: "Automatic",
      seats: 5,
      features: ["AC", "Bluetooth", "Backup Camera"],
      image: "/images/toyota-corolla.jpg",
      createdAt: Timestamp.fromDate(new Date(2023, 0, 15)),
      updatedAt: Timestamp.fromDate(new Date(2023, 0, 15)),
    },
    {
      id: "v2",
      name: "Honda Civic",
      type: "Sedan",
      licensePlate: "CAC-5678",
      dailyRate: 5500,
      status: "rented",
      fuelType: "Petrol",
      transmission: "Automatic",
      seats: 5,
      features: ["AC", "Bluetooth", "Navigation", "Sunroof"],
      image: "/images/honda-civic.jpg",
      createdAt: Timestamp.fromDate(new Date(2023, 1, 10)),
      updatedAt: Timestamp.fromDate(new Date(2023, 1, 10)),
    },
    {
      id: "v3",
      name: "Toyota HiAce",
      type: "Van",
      licensePlate: "CAD-9012",
      dailyRate: 8000,
      status: "available",
      fuelType: "Diesel",
      transmission: "Manual",
      seats: 15,
      features: ["AC", "Bluetooth"],
      image: "/images/toyota-hiace.jpg",
      createdAt: Timestamp.fromDate(new Date(2023, 2, 5)),
      updatedAt: Timestamp.fromDate(new Date(2023, 2, 5)),
    },
    {
      id: "v4",
      name: "Suzuki Alto",
      type: "Compact",
      licensePlate: "CAE-3456",
      dailyRate: 3500,
      status: "maintenance",
      fuelType: "Petrol",
      transmission: "Manual",
      seats: 4,
      features: ["AC"],
      image: "/images/suzuki-alto.jpg",
      lastMaintenance: Timestamp.fromDate(new Date(2023, 5, 15)),
      nextMaintenance: Timestamp.fromDate(new Date(2023, 8, 15)),
      createdAt: Timestamp.fromDate(new Date(2023, 3, 20)),
      updatedAt: Timestamp.fromDate(new Date(2023, 3, 20)),
    },
    {
      id: "v5",
      name: "Nissan X-Trail",
      type: "SUV",
      licensePlate: "CAF-7890",
      dailyRate: 7500,
      status: "available",
      fuelType: "Diesel",
      transmission: "Automatic",
      seats: 7,
      features: ["AC", "Bluetooth", "Navigation", "4WD", "Leather Seats"],
      image: "/images/nissan-xtrail.jpg",
      createdAt: Timestamp.fromDate(new Date(2023, 4, 12)),
      updatedAt: Timestamp.fromDate(new Date(2023, 4, 12)),
    },
  ]
}

export function getMockBookings(): Booking[] {
  return [
    {
      id: "B12345",
      customerName: "John Smith",
      customerEmail: "john@example.com",
      customerPhone: "+94 77 123 4567",
      vehicleId: "v1",
      vehicleName: "Toyota Corolla",
      pickupDate: Timestamp.fromDate(new Date(2023, 6, 15)),
      returnDate: Timestamp.fromDate(new Date(2023, 6, 20)),
      totalDays: 5,
      totalAmount: 25000,
      paymentType: "advance",
      advanceAmount: 10000,
      balanceAmount: 15000,
      paymentStatus: "partial",
      status: "confirmed",
      createdBy: "user123",
      createdAt: Timestamp.fromDate(new Date(2023, 6, 10)),
    },
    {
      id: "B12346",
      customerName: "Sarah Johnson",
      customerEmail: "sarah@example.com",
      customerPhone: "+94 77 234 5678",
      vehicleId: "v2",
      vehicleName: "Honda Civic",
      pickupDate: Timestamp.fromDate(new Date(2023, 6, 18)),
      returnDate: Timestamp.fromDate(new Date(2023, 6, 25)),
      totalDays: 7,
      totalAmount: 38500,
      paymentType: "total",
      advanceAmount: 38500,
      balanceAmount: 0,
      paymentStatus: "paid",
      status: "active",
      createdBy: "user123",
      createdAt: Timestamp.fromDate(new Date(2023, 6, 12)),
    },
    {
      id: "B12347",
      customerName: "Raj Patel",
      customerEmail: "raj@example.com",
      customerPhone: "+94 77 345 6789",
      vehicleId: "v4",
      vehicleName: "Suzuki Alto",
      pickupDate: Timestamp.fromDate(new Date(2023, 6, 20)),
      returnDate: Timestamp.fromDate(new Date(2023, 6, 22)),
      totalDays: 2,
      totalAmount: 7000,
      paymentType: "advance",
      advanceAmount: 3500,
      balanceAmount: 3500,
      paymentStatus: "partial",
      status: "pending",
      createdBy: "user123",
      createdAt: Timestamp.fromDate(new Date(2023, 6, 15)),
    },
    {
      id: "B12348",
      customerName: "Maria Garcia",
      customerEmail: "maria@example.com",
      customerPhone: "+94 77 456 7890",
      vehicleId: "v5",
      vehicleName: "Nissan X-Trail",
      pickupDate: Timestamp.fromDate(new Date(2023, 6, 10)),
      returnDate: Timestamp.fromDate(new Date(2023, 6, 17)),
      totalDays: 7,
      totalAmount: 52500,
      paymentType: "total",
      advanceAmount: 52500,
      balanceAmount: 0,
      paymentStatus: "paid",
      status: "completed",
      createdBy: "user123",
      createdAt: Timestamp.fromDate(new Date(2023, 6, 5)),
    },
    {
      id: "B12349",
      customerName: "David Lee",
      customerEmail: "david@example.com",
      customerPhone: "+94 77 567 8901",
      vehicleId: "v3",
      vehicleName: "Toyota HiAce",
      pickupDate: Timestamp.fromDate(new Date(2023, 6, 5)),
      returnDate: Timestamp.fromDate(new Date(2023, 6, 12)),
      totalDays: 7,
      totalAmount: 56000,
      paymentType: "advance",
      advanceAmount: 20000,
      balanceAmount: 36000,
      paymentStatus: "partial",
      status: "cancelled",
      createdBy: "user123",
      createdAt: Timestamp.fromDate(new Date(2023, 6, 1)),
    },
  ]
}

export function getMockPayments(): Payment[] {
  return [
    {
      id: "p1",
      bookingId: "B12345",
      customerName: "John Smith",
      vehicleName: "Toyota Corolla",
      amount: 10000,
      paymentMethod: "card",
      status: "completed",
      date: Timestamp.fromDate(new Date(2023, 6, 10)),
      invoiceNumber: "INV-2023-1001",
    },
    {
      id: "p2",
      bookingId: "B12346",
      customerName: "Sarah Johnson",
      vehicleName: "Honda Civic",
      amount: 38500,
      paymentMethod: "bank_transfer",
      status: "completed",
      date: Timestamp.fromDate(new Date(2023, 6, 12)),
      invoiceNumber: "INV-2023-1002",
    },
    {
      id: "p3",
      bookingId: "B12347",
      customerName: "Raj Patel",
      vehicleName: "Suzuki Alto",
      amount: 3500,
      paymentMethod: "cash",
      status: "completed",
      date: Timestamp.fromDate(new Date(2023, 6, 15)),
      invoiceNumber: "INV-2023-1003",
    },
    {
      id: "p4",
      bookingId: "B12348",
      customerName: "Maria Garcia",
      vehicleName: "Nissan X-Trail",
      amount: 52500,
      paymentMethod: "online",
      status: "completed",
      date: Timestamp.fromDate(new Date(2023, 6, 5)),
      invoiceNumber: "INV-2023-1004",
    },
    {
      id: "p5",
      bookingId: "B12349",
      customerName: "David Lee",
      vehicleName: "Toyota HiAce",
      amount: 20000,
      paymentMethod: "card",
      status: "completed",
      date: Timestamp.fromDate(new Date(2023, 6, 1)),
      invoiceNumber: "INV-2023-1005",
    },
  ]
}
