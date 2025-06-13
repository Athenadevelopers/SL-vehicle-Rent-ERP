"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Switch } from "@/components/ui/switch"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/components/ui/use-toast"
import { useAuth } from "@/lib/auth-provider"
import { Building, Mail, Phone, MapPin, Globe, Upload, Save } from "lucide-react"

export default function SettingsPage() {
  const router = useRouter()
  const { toast } = useToast()
  const { user } = useAuth()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  // Company settings
  const [companyName, setCompanyName] = useState("SL Vehicle Rental")
  const [companyEmail, setCompanyEmail] = useState("info@slvehiclerental.com")
  const [companyPhone, setCompanyPhone] = useState("+94 77 123 4567")
  const [companyAddress, setCompanyAddress] = useState("123 Main Street, Colombo, Sri Lanka")
  const [companyWebsite, setCompanyWebsite] = useState("www.slvehiclerental.com")
  const [companyLogo, setCompanyLogo] = useState("/logo.png")

  // Notification settings
  const [emailNotifications, setEmailNotifications] = useState(true)
  const [smsNotifications, setSmsNotifications] = useState(true)
  const [bookingConfirmations, setBookingConfirmations] = useState(true)
  const [paymentReceipts, setPaymentReceipts] = useState(true)
  const [reminderNotifications, setReminderNotifications] = useState(true)

  // Invoice settings
  const [invoicePrefix, setInvoicePrefix] = useState("INV")
  const [invoiceFooterText, setInvoiceFooterText] = useState("Thank you for choosing SL Vehicle Rental!")
  const [taxRate, setTaxRate] = useState("15")
  const [currencySymbol, setCurrencySymbol] = useState("₹")

  // System settings
  const [language, setLanguage] = useState("en")
  const [dateFormat, setDateFormat] = useState("DD/MM/YYYY")
  const [timeFormat, setTimeFormat] = useState("12h")
  const [theme, setTheme] = useState("light")

  useEffect(() => {
    if (!user) return

    // In a real app, you would fetch settings from the database
    // For now, we'll just simulate loading
    const timeout = setTimeout(() => {
      setLoading(false)
    }, 1000)

    return () => clearTimeout(timeout)
  }, [user])

  const handleSaveSettings = async () => {
    setSaving(true)

    // In a real app, you would save settings to the database
    // For now, we'll just simulate saving
    setTimeout(() => {
      setSaving(false)
      toast({
        title: "Settings saved",
        description: "Your settings have been saved successfully.",
      })
    }, 1500)
  }

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      // In a real app, you would upload the file to storage
      // For now, we'll just simulate uploading
      const reader = new FileReader()
      reader.onload = () => {
        setCompanyLogo(reader.result as string)
      }
      reader.readAsDataURL(file)
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
        <h1 className="text-3xl font-bold">Settings</h1>
        <Button onClick={handleSaveSettings} disabled={saving}>
          {saving ? (
            <>
              <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-background border-t-transparent"></div>
              Saving...
            </>
          ) : (
            <>
              <Save className="mr-2 h-4 w-4" />
              Save All Settings
            </>
          )}
        </Button>
      </div>

      <Tabs defaultValue="company">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="company">Company</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="invoice">Invoice</TabsTrigger>
          <TabsTrigger value="system">System</TabsTrigger>
        </TabsList>

        <TabsContent value="company" className="space-y-4 pt-4">
          <Card>
            <CardHeader>
              <CardTitle>Company Information</CardTitle>
              <CardDescription>Update your company details and branding.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex flex-col md:flex-row gap-6">
                <div className="w-full md:w-2/3 space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="company-name">Company Name</Label>
                    <div className="relative">
                      <Building className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="company-name"
                        value={companyName}
                        onChange={(e) => setCompanyName(e.target.value)}
                        className="pl-10"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="company-email">Email</Label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="company-email"
                          type="email"
                          value={companyEmail}
                          onChange={(e) => setCompanyEmail(e.target.value)}
                          className="pl-10"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="company-phone">Phone</Label>
                      <div className="relative">
                        <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="company-phone"
                          value={companyPhone}
                          onChange={(e) => setCompanyPhone(e.target.value)}
                          className="pl-10"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="company-address">Address</Label>
                    <div className="relative">
                      <MapPin className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Textarea
                        id="company-address"
                        value={companyAddress}
                        onChange={(e) => setCompanyAddress(e.target.value)}
                        className="min-h-[80px] pl-10"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="company-website">Website</Label>
                    <div className="relative">
                      <Globe className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="company-website"
                        value={companyWebsite}
                        onChange={(e) => setCompanyWebsite(e.target.value)}
                        className="pl-10"
                      />
                    </div>
                  </div>
                </div>

                <div className="w-full md:w-1/3 space-y-4">
                  <div className="space-y-2">
                    <Label>Company Logo</Label>
                    <div className="flex flex-col items-center gap-4">
                      <div className="h-32 w-32 rounded-lg border flex items-center justify-center overflow-hidden">
                        {companyLogo ? (
                          <img
                            src={companyLogo || "/placeholder.svg"}
                            alt="Company Logo"
                            className="h-full w-full object-contain"
                          />
                        ) : (
                          <Building className="h-12 w-12 text-muted-foreground" />
                        )}
                      </div>
                      <div className="flex items-center gap-2">
                        <Label
                          htmlFor="logo-upload"
                          className="cursor-pointer inline-flex h-9 items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50"
                        >
                          <Upload className="mr-2 h-4 w-4" />
                          Upload Logo
                        </Label>
                        <Input
                          id="logo-upload"
                          type="file"
                          accept="image/*"
                          onChange={handleLogoUpload}
                          className="hidden"
                        />
                        {companyLogo && (
                          <Button variant="outline" size="sm" onClick={() => setCompanyLogo("")}>
                            Remove
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notifications" className="space-y-4 pt-4">
          <Card>
            <CardHeader>
              <CardTitle>Notification Settings</CardTitle>
              <CardDescription>Configure how and when notifications are sent.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Notification Channels</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="email-notifications">Email Notifications</Label>
                      <p className="text-sm text-muted-foreground">Receive notifications via email</p>
                    </div>
                    <Switch
                      id="email-notifications"
                      checked={emailNotifications}
                      onCheckedChange={setEmailNotifications}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="sms-notifications">SMS Notifications</Label>
                      <p className="text-sm text-muted-foreground">Receive notifications via SMS</p>
                    </div>
                    <Switch id="sms-notifications" checked={smsNotifications} onCheckedChange={setSmsNotifications} />
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-medium">Notification Types</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="booking-confirmations">Booking Confirmations</Label>
                      <p className="text-sm text-muted-foreground">
                        Send confirmation when a booking is created or updated
                      </p>
                    </div>
                    <Switch
                      id="booking-confirmations"
                      checked={bookingConfirmations}
                      onCheckedChange={setBookingConfirmations}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="payment-receipts">Payment Receipts</Label>
                      <p className="text-sm text-muted-foreground">Send receipt when a payment is processed</p>
                    </div>
                    <Switch id="payment-receipts" checked={paymentReceipts} onCheckedChange={setPaymentReceipts} />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="reminder-notifications">Reminders</Label>
                      <p className="text-sm text-muted-foreground">Send reminders for upcoming pickups and returns</p>
                    </div>
                    <Switch
                      id="reminder-notifications"
                      checked={reminderNotifications}
                      onCheckedChange={setReminderNotifications}
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-medium">Email Templates</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Button variant="outline">Edit Booking Confirmation Template</Button>
                  <Button variant="outline">Edit Payment Receipt Template</Button>
                  <Button variant="outline">Edit Reminder Template</Button>
                  <Button variant="outline">Edit Cancellation Template</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="invoice" className="space-y-4 pt-4">
          <Card>
            <CardHeader>
              <CardTitle>Invoice Settings</CardTitle>
              <CardDescription>Customize your invoice format and content.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="invoice-prefix">Invoice Number Prefix</Label>
                    <Input
                      id="invoice-prefix"
                      value={invoicePrefix}
                      onChange={(e) => setInvoicePrefix(e.target.value)}
                      placeholder="INV"
                    />
                    <p className="text-sm text-muted-foreground">Example: {invoicePrefix}-2023-0001</p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="tax-rate">Tax Rate (%)</Label>
                    <Input
                      id="tax-rate"
                      type="number"
                      min="0"
                      max="100"
                      value={taxRate}
                      onChange={(e) => setTaxRate(e.target.value)}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="currency-symbol">Currency Symbol</Label>
                    <Select value={currencySymbol} onValueChange={setCurrencySymbol}>
                      <SelectTrigger id="currency-symbol">
                        <SelectValue placeholder="Select currency symbol" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="₹">₹ (Indian Rupee)</SelectItem>
                        <SelectItem value="$">$ (US Dollar)</SelectItem>
                        <SelectItem value="€">€ (Euro)</SelectItem>
                        <SelectItem value="£">£ (British Pound)</SelectItem>
                        <SelectItem value="¥">¥ (Japanese Yen)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="invoice-footer">Invoice Footer Text</Label>
                    <Textarea
                      id="invoice-footer"
                      value={invoiceFooterText}
                      onChange={(e) => setInvoiceFooterText(e.target.value)}
                      className="min-h-[120px]"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Invoice Template</Label>
                    <div className="grid grid-cols-2 gap-4">
                      <Button variant="outline">Edit Template</Button>
                      <Button variant="outline">Preview Template</Button>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="system" className="space-y-4 pt-4">
          <Card>
            <CardHeader>
              <CardTitle>System Settings</CardTitle>
              <CardDescription>Configure general system settings and preferences.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="language">Language</Label>
                    <Select value={language} onValueChange={setLanguage}>
                      <SelectTrigger id="language">
                        <SelectValue placeholder="Select language" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="en">English</SelectItem>
                        <SelectItem value="si">Sinhala</SelectItem>
                        <SelectItem value="ta">Tamil</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="date-format">Date Format</Label>
                    <Select value={dateFormat} onValueChange={setDateFormat}>
                      <SelectTrigger id="date-format">
                        <SelectValue placeholder="Select date format" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="DD/MM/YYYY">DD/MM/YYYY</SelectItem>
                        <SelectItem value="MM/DD/YYYY">MM/DD/YYYY</SelectItem>
                        <SelectItem value="YYYY-MM-DD">YYYY-MM-DD</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="time-format">Time Format</Label>
                    <Select value={timeFormat} onValueChange={setTimeFormat}>
                      <SelectTrigger id="time-format">
                        <SelectValue placeholder="Select time format" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="12h">12-hour (AM/PM)</SelectItem>
                        <SelectItem value="24h">24-hour</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="theme">Theme</Label>
                    <Select value={theme} onValueChange={setTheme}>
                      <SelectTrigger id="theme">
                        <SelectValue placeholder="Select theme" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="light">Light</SelectItem>
                        <SelectItem value="dark">Dark</SelectItem>
                        <SelectItem value="system">System</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-medium">Data Management</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Button variant="outline">Export All Data</Button>
                  <Button variant="outline">Backup Database</Button>
                  <Button variant="outline" className="text-destructive">
                    Reset System
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
