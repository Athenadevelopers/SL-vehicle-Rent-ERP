"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/components/ui/use-toast"
import { Save, Mail, MessageSquare, Bell } from "lucide-react"

export default function NotificationSettingsPage() {
  const { toast } = useToast()
  const [saving, setSaving] = useState(false)

  // Email notification settings
  const [emailBookings, setEmailBookings] = useState(true)
  const [emailPayments, setEmailPayments] = useState(true)
  const [emailReminders, setEmailReminders] = useState(true)
  const [emailMaintenance, setEmailMaintenance] = useState(true)

  // SMS notification settings
  const [smsBookings, setSmsBookings] = useState(true)
  const [smsPayments, setSmsPayments] = useState(true)
  const [smsReminders, setSmsReminders] = useState(true)
  const [smsMaintenance, setSmsMaintenance] = useState(false)

  // In-app notification settings
  const [appBookings, setAppBookings] = useState(true)
  const [appPayments, setAppPayments] = useState(true)
  const [appReminders, setAppReminders] = useState(true)
  const [appMaintenance, setAppMaintenance] = useState(true)

  // Email templates
  const [bookingConfirmationTemplate, setBookingConfirmationTemplate] = useState(
    `Dear {{customerName}},

Your booking has been confirmed with the following details:

Booking ID: {{bookingId}}
Vehicle: {{vehicleName}}
Pickup Date: {{pickupDate}}
Return Date: {{returnDate}}
Total Amount: ₹{{totalAmount}}
Payment Status: {{paymentStatus}}

Thank you for choosing SL Vehicle Rental.

Regards,
SL Vehicle Rental Team`,
  )

  const [paymentReceiptTemplate, setPaymentReceiptTemplate] = useState(
    `Dear {{customerName}},

We have received your payment of ₹{{amount}} for booking #{{bookingId}}.

Invoice Number: {{invoiceNumber}}
Amount: ₹{{amount}}
Date: {{date}}

Thank you for choosing SL Vehicle Rental.

Regards,
SL Vehicle Rental Team`,
  )

  const [reminderTemplate, setReminderTemplate] = useState(
    `Dear {{customerName}},

This is a reminder for your upcoming {{type}} of {{vehicleName}}.

Booking ID: {{bookingId}}
Vehicle: {{vehicleName}}
{{type}} Date: {{date}}

{{additionalInfo}}

Thank you for choosing SL Vehicle Rental.

Regards,
SL Vehicle Rental Team`,
  )

  const handleSaveSettings = async () => {
    setSaving(true)

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500))

    setSaving(false)

    toast({
      title: "Settings saved",
      description: "Your notification settings have been saved successfully.",
    })
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Notification Settings</h1>
        <Button onClick={handleSaveSettings} disabled={saving}>
          {saving ? (
            <>
              <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-background border-t-transparent"></div>
              Saving...
            </>
          ) : (
            <>
              <Save className="mr-2 h-4 w-4" />
              Save Settings
            </>
          )}
        </Button>
      </div>

      <Tabs defaultValue="channels">
        <TabsList>
          <TabsTrigger value="channels">Notification Channels</TabsTrigger>
          <TabsTrigger value="templates">Email Templates</TabsTrigger>
        </TabsList>

        <TabsContent value="channels" className="space-y-6 pt-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Mail className="mr-2 h-5 w-5 text-primary" />
                Email Notifications
              </CardTitle>
              <CardDescription>Configure which email notifications are sent to customers and staff.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="email-bookings">Booking Confirmations</Label>
                  <p className="text-sm text-muted-foreground">
                    Send email confirmation when a booking is created or updated
                  </p>
                </div>
                <Switch id="email-bookings" checked={emailBookings} onCheckedChange={setEmailBookings} />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="email-payments">Payment Receipts</Label>
                  <p className="text-sm text-muted-foreground">Send email receipt when a payment is processed</p>
                </div>
                <Switch id="email-payments" checked={emailPayments} onCheckedChange={setEmailPayments} />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="email-reminders">Pickup/Return Reminders</Label>
                  <p className="text-sm text-muted-foreground">Send email reminders for upcoming pickups and returns</p>
                </div>
                <Switch id="email-reminders" checked={emailReminders} onCheckedChange={setEmailReminders} />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="email-maintenance">Maintenance Alerts</Label>
                  <p className="text-sm text-muted-foreground">Send email alerts for vehicle maintenance</p>
                </div>
                <Switch id="email-maintenance" checked={emailMaintenance} onCheckedChange={setEmailMaintenance} />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <MessageSquare className="mr-2 h-5 w-5 text-primary" />
                SMS Notifications
              </CardTitle>
              <CardDescription>Configure which SMS notifications are sent to customers and staff.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="sms-bookings">Booking Confirmations</Label>
                  <p className="text-sm text-muted-foreground">
                    Send SMS confirmation when a booking is created or updated
                  </p>
                </div>
                <Switch id="sms-bookings" checked={smsBookings} onCheckedChange={setSmsBookings} />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="sms-payments">Payment Receipts</Label>
                  <p className="text-sm text-muted-foreground">Send SMS receipt when a payment is processed</p>
                </div>
                <Switch id="sms-payments" checked={smsPayments} onCheckedChange={setSmsPayments} />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="sms-reminders">Pickup/Return Reminders</Label>
                  <p className="text-sm text-muted-foreground">Send SMS reminders for upcoming pickups and returns</p>
                </div>
                <Switch id="sms-reminders" checked={smsReminders} onCheckedChange={setSmsReminders} />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="sms-maintenance">Maintenance Alerts</Label>
                  <p className="text-sm text-muted-foreground">Send SMS alerts for vehicle maintenance</p>
                </div>
                <Switch id="sms-maintenance" checked={smsMaintenance} onCheckedChange={setSmsMaintenance} />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Bell className="mr-2 h-5 w-5 text-primary" />
                In-App Notifications
              </CardTitle>
              <CardDescription>Configure which in-app notifications are shown to staff.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="app-bookings">Booking Notifications</Label>
                  <p className="text-sm text-muted-foreground">Show notifications for new and updated bookings</p>
                </div>
                <Switch id="app-bookings" checked={appBookings} onCheckedChange={setAppBookings} />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="app-payments">Payment Notifications</Label>
                  <p className="text-sm text-muted-foreground">Show notifications for new payments</p>
                </div>
                <Switch id="app-payments" checked={appPayments} onCheckedChange={setAppPayments} />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="app-reminders">Reminder Notifications</Label>
                  <p className="text-sm text-muted-foreground">Show notifications for upcoming pickups and returns</p>
                </div>
                <Switch id="app-reminders" checked={appReminders} onCheckedChange={setAppReminders} />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="app-maintenance">Maintenance Notifications</Label>
                  <p className="text-sm text-muted-foreground">Show notifications for vehicle maintenance</p>
                </div>
                <Switch id="app-maintenance" checked={appMaintenance} onCheckedChange={setAppMaintenance} />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="templates" className="space-y-6 pt-4">
          <Card>
            <CardHeader>
              <CardTitle>Booking Confirmation Template</CardTitle>
              <CardDescription>Edit the email template sent when a booking is confirmed.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="booking-template">Email Body</Label>
                  <Textarea
                    id="booking-template"
                    value={bookingConfirmationTemplate}
                    onChange={(e) => setBookingConfirmationTemplate(e.target.value)}
                    className="min-h-[200px] font-mono text-sm"
                  />
                </div>
                <div>
                  <h4 className="text-sm font-medium mb-2">Available Variables:</h4>
                  <div className="text-sm text-muted-foreground space-y-1">
                    <p>
                      <code>{"{{customerName}}"}</code> - Customer's name
                    </p>
                    <p>
                      <code>{"{{bookingId}}"}</code> - Booking ID
                    </p>
                    <p>
                      <code>{"{{vehicleName}}"}</code> - Vehicle name
                    </p>
                    <p>
                      <code>{"{{pickupDate}}"}</code> - Pickup date
                    </p>
                    <p>
                      <code>{"{{returnDate}}"}</code> - Return date
                    </p>
                    <p>
                      <code>{"{{totalAmount}}"}</code> - Total booking amount
                    </p>
                    <p>
                      <code>{"{{paymentStatus}}"}</code> - Payment status
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Payment Receipt Template</CardTitle>
              <CardDescription>Edit the email template sent when a payment is processed.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="payment-template">Email Body</Label>
                  <Textarea
                    id="payment-template"
                    value={paymentReceiptTemplate}
                    onChange={(e) => setPaymentReceiptTemplate(e.target.value)}
                    className="min-h-[200px] font-mono text-sm"
                  />
                </div>
                <div>
                  <h4 className="text-sm font-medium mb-2">Available Variables:</h4>
                  <div className="text-sm text-muted-foreground space-y-1">
                    <p>
                      <code>{"{{customerName}}"}</code> - Customer's name
                    </p>
                    <p>
                      <code>{"{{bookingId}}"}</code> - Booking ID
                    </p>
                    <p>
                      <code>{"{{amount}}"}</code> - Payment amount
                    </p>
                    <p>
                      <code>{"{{invoiceNumber}}"}</code> - Invoice number
                    </p>
                    <p>
                      <code>{"{{date}}"}</code> - Payment date
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Reminder Template</CardTitle>
              <CardDescription>Edit the email template sent for pickup and return reminders.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="reminder-template">Email Body</Label>
                  <Textarea
                    id="reminder-template"
                    value={reminderTemplate}
                    onChange={(e) => setReminderTemplate(e.target.value)}
                    className="min-h-[200px] font-mono text-sm"
                  />
                </div>
                <div>
                  <h4 className="text-sm font-medium mb-2">Available Variables:</h4>
                  <div className="text-sm text-muted-foreground space-y-1">
                    <p>
                      <code>{"{{customerName}}"}</code> - Customer's name
                    </p>
                    <p>
                      <code>{"{{bookingId}}"}</code> - Booking ID
                    </p>
                    <p>
                      <code>{"{{vehicleName}}"}</code> - Vehicle name
                    </p>
                    <p>
                      <code>{"{{type}}"}</code> - "pickup" or "return"
                    </p>
                    <p>
                      <code>{"{{date}}"}</code> - Pickup or return date
                    </p>
                    <p>
                      <code>{"{{additionalInfo}}"}</code> - Additional information
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
