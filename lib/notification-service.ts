import { toast } from "@/components/ui/use-toast"
import { Date } from "firebase/firestore"

export interface Notification {
  id: string
  title: string
  message: string
  type: "info" | "success" | "warning" | "error"
  read: boolean
  createdAt: Date
  link?: string
}

export interface BookingConfirmation {
  customerName: string
  customerEmail: string
  customerPhone: string
  bookingId: string
  vehicleName: string
  pickupDate: string
  returnDate: string
  totalAmount: number
  paymentStatus: string
}

// Mock notifications for demo
const mockNotifications: Notification[] = [
  {
    id: "n1",
    title: "New Booking",
    message: "A new booking has been created for Toyota Corolla",
    type: "info",
    read: false,
    createdAt: new Date(Date.now() - 1000 * 60 * 5), // 5 minutes ago
    link: "/dashboard/bookings/B12345",
  },
  {
    id: "n2",
    title: "Payment Received",
    message: "Payment of ₹5,000 received for booking #B12345",
    type: "success",
    read: false,
    createdAt: new Date(Date.now() - 1000 * 60 * 30), // 30 minutes ago
    link: "/dashboard/payments/p1",
  },
  {
    id: "n3",
    title: "Maintenance Due",
    message: "Toyota HiAce is due for maintenance tomorrow",
    type: "warning",
    read: true,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2 hours ago
    link: "/dashboard/advanced/maintenance",
  },
  {
    id: "n4",
    title: "Booking Cancelled",
    message: "Booking #B12349 has been cancelled",
    type: "error",
    read: true,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24), // 1 day ago
    link: "/dashboard/bookings/B12349",
  },
  {
    id: "n5",
    title: "Vehicle Returned",
    message: "Honda Civic has been returned and is now available",
    type: "success",
    read: true,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 48), // 2 days ago
    link: "/dashboard/vehicles/v2",
  },
]

// Get all notifications
export function getMockNotifications(): Notification[] {
  return [...mockNotifications]
}

// Get unread notifications count
export function getUnreadCount(): number {
  return mockNotifications.filter((n) => !n.read).length
}

// Mark notification as read
export function markAsRead(id: string): void {
  const notification = mockNotifications.find((n) => n.id === id)
  if (notification) {
    notification.read = true
  }
}

// Mark all notifications as read
export function markAllAsRead(): void {
  mockNotifications.forEach((n) => {
    n.read = true
  })
}

// Send email notification
export async function sendEmail(to: string, subject: string, body: string): Promise<boolean> {
  // In a real app, you would integrate with an email service like SendGrid, Mailgun, etc.
  console.log(`Sending email to ${to}:`, { subject, body })

  // Simulate API call
  await new Promise((resolve) => setTimeout(resolve, 500))

  // For demo purposes, always return success
  return true
}

// Send SMS notification
export async function sendSMS(to: string, message: string): Promise<boolean> {
  // In a real app, you would integrate with an SMS service like Twilio, Nexmo, etc.
  console.log(`Sending SMS to ${to}:`, message)

  // Simulate API call
  await new Promise((resolve) => setTimeout(resolve, 500))

  // For demo purposes, always return success
  return true
}

// Send booking confirmation
export async function sendBookingConfirmation(booking: BookingConfirmation): Promise<void> {
  try {
    // Prepare email content
    const emailSubject = `Booking Confirmation - ${booking.bookingId}`
    const emailBody = `
      Dear ${booking.customerName},
      
      Your booking has been confirmed with the following details:
      
      Booking ID: ${booking.bookingId}
      Vehicle: ${booking.vehicleName}
      Pickup Date: ${booking.pickupDate}
      Return Date: ${booking.returnDate}
      Total Amount: ₹${booking.totalAmount.toLocaleString()}
      Payment Status: ${booking.paymentStatus}
      
      Thank you for choosing SL Vehicle Rental.
      
      Regards,
      SL Vehicle Rental Team
    `

    // Prepare SMS content
    const smsMessage = `SL Vehicle Rental: Your booking #${booking.bookingId} for ${booking.vehicleName} is confirmed. Pickup: ${booking.pickupDate}. Total: ₹${booking.totalAmount.toLocaleString()}.`

    // Send notifications
    await Promise.all([
      sendEmail(booking.customerEmail, emailSubject, emailBody),
      sendSMS(booking.customerPhone, smsMessage),
    ])

    // Add to notifications
    mockNotifications.unshift({
      id: `n${Date.now()}`,
      title: "Booking Confirmation Sent",
      message: `Confirmation sent to ${booking.customerName} for ${booking.vehicleName}`,
      type: "success",
      read: false,
      createdAt: new Date(),
      link: `/dashboard/bookings/${booking.bookingId}`,
    })

    // Show toast notification
    toast({
      title: "Confirmation Sent",
      description: `Booking confirmation sent to ${booking.customerName}`,
    })
  } catch (error) {
    console.error("Error sending booking confirmation:", error)

    // Show error toast
    toast({
      title: "Error Sending Confirmation",
      description: "There was an error sending the booking confirmation.",
      variant: "destructive",
    })
  }
}

// Send payment receipt
export async function sendPaymentReceipt(
  email: string,
  phone: string,
  name: string,
  amount: number,
  invoiceNumber: string,
  bookingId: string,
): Promise<void> {
  try {
    // Prepare email content
    const emailSubject = `Payment Receipt - ${invoiceNumber}`
    const emailBody = `
      Dear ${name},
      
      We have received your payment of ₹${amount.toLocaleString()} for booking #${bookingId}.
      
      Invoice Number: ${invoiceNumber}
      Amount: ₹${amount.toLocaleString()}
      Date: ${new Date().toLocaleDateString()}
      
      Thank you for choosing SL Vehicle Rental.
      
      Regards,
      SL Vehicle Rental Team
    `

    // Prepare SMS content
    const smsMessage = `SL Vehicle Rental: Payment of ₹${amount.toLocaleString()} received for booking #${bookingId}. Invoice: ${invoiceNumber}. Thank you!`

    // Send notifications
    await Promise.all([sendEmail(email, emailSubject, emailBody), sendSMS(phone, smsMessage)])

    // Add to notifications
    mockNotifications.unshift({
      id: `n${Date.now()}`,
      title: "Payment Receipt Sent",
      message: `Receipt for ₹${amount.toLocaleString()} sent to ${name}`,
      type: "success",
      read: false,
      createdAt: new Date(),
      link: `/dashboard/payments/${invoiceNumber}`,
    })

    // Show toast notification
    toast({
      title: "Receipt Sent",
      description: `Payment receipt sent to ${name}`,
    })
  } catch (error) {
    console.error("Error sending payment receipt:", error)

    // Show error toast
    toast({
      title: "Error Sending Receipt",
      description: "There was an error sending the payment receipt.",
      variant: "destructive",
    })
  }
}

// Send reminder notification
export async function sendReminder(
  email: string,
  phone: string,
  name: string,
  bookingId: string,
  vehicleName: string,
  date: string,
  type: "pickup" | "return",
): Promise<void> {
  try {
    // Prepare email content
    const emailSubject = `Reminder: ${type === "pickup" ? "Vehicle Pickup" : "Vehicle Return"} - ${bookingId}`
    const emailBody = `
      Dear ${name},
      
      This is a reminder for your upcoming ${type === "pickup" ? "vehicle pickup" : "vehicle return"}.
      
      Booking ID: ${bookingId}
      Vehicle: ${vehicleName}
      ${type === "pickup" ? "Pickup" : "Return"} Date: ${date}
      
      ${
        type === "pickup"
          ? "Please bring your ID and payment method for any remaining balance."
          : "Please ensure the vehicle is returned with a full tank of fuel."
      }
      
      Thank you for choosing SL Vehicle Rental.
      
      Regards,
      SL Vehicle Rental Team
    `

    // Prepare SMS content
    const smsMessage = `SL Vehicle Rental: Reminder for ${type === "pickup" ? "pickup" : "return"} of ${vehicleName} on ${date}. Booking #${bookingId}.`

    // Send notifications
    await Promise.all([sendEmail(email, emailSubject, emailBody), sendSMS(phone, smsMessage)])

    // Add to notifications
    mockNotifications.unshift({
      id: `n${Date.now()}`,
      title: `${type === "pickup" ? "Pickup" : "Return"} Reminder Sent`,
      message: `Reminder sent to ${name} for ${vehicleName}`,
      type: "info",
      read: false,
      createdAt: new Date(),
      link: `/dashboard/bookings/${bookingId}`,
    })

    // Show toast notification
    toast({
      title: "Reminder Sent",
      description: `${type === "pickup" ? "Pickup" : "Return"} reminder sent to ${name}`,
    })
  } catch (error) {
    console.error("Error sending reminder:", error)

    // Show error toast
    toast({
      title: "Error Sending Reminder",
      description: "There was an error sending the reminder notification.",
      variant: "destructive",
    })
  }
}

// Send maintenance notification
export async function sendMaintenanceNotification(
  vehicleName: string,
  licensePlate: string,
  date: Date,
): Promise<void> {
  try {
    // Add to notifications
    mockNotifications.unshift({
      id: `n${Date.now()}`,
      title: "Maintenance Scheduled",
      message: `${vehicleName} (${licensePlate}) is scheduled for maintenance on ${date.toLocaleDateString()}`,
      type: "warning",
      read: false,
      createdAt: new Date(),
      link: "/dashboard/advanced/maintenance",
    })

    // Show toast notification
    toast({
      title: "Maintenance Scheduled",
      description: `${vehicleName} scheduled for maintenance on ${date.toLocaleDateString()}`,
    })
  } catch (error) {
    console.error("Error sending maintenance notification:", error)

    // Show error toast
    toast({
      title: "Error",
      description: "There was an error scheduling maintenance.",
      variant: "destructive",
    })
  }
}
