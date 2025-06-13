"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useToast } from "@/components/ui/use-toast"
import { Save, CreditCard, Mail, MessageSquare, Map, AlertTriangle } from "lucide-react"

export default function IntegrationsPage() {
  const { toast } = useToast()
  const [saving, setSaving] = useState(false)

  // Payment gateway settings
  const [stripeEnabled, setStripeEnabled] = useState(true)
  const [stripePublicKey, setStripePublicKey] = useState("pk_test_51...")
  const [stripeSecretKey, setStripeSecretKey] = useState("sk_test_51...")

  const [razorpayEnabled, setRazorpayEnabled] = useState(false)
  const [razorpayKeyId, setRazorpayKeyId] = useState("")
  const [razorpayKeySecret, setRazorpayKeySecret] = useState("")

  // Email service settings
  const [sendgridEnabled, setSendgridEnabled] = useState(true)
  const [sendgridApiKey, setSendgridApiKey] = useState("SG....")
  const [sendgridFromEmail, setSendgridFromEmail] = useState("info@slvehiclerental.com")
  const [sendgridFromName, setSendgridFromName] = useState("SL Vehicle Rental")

  // SMS service settings
  const [twilioEnabled, setTwilioEnabled] = useState(true)
  const [twilioAccountSid, setTwilioAccountSid] = useState("AC...")
  const [twilioAuthToken, setTwilioAuthToken] = useState("...")
  const [twilioFromNumber, setTwilioFromNumber] = useState("+1234567890")

  // Maps service settings
  const [googleMapsEnabled, setGoogleMapsEnabled] = useState(true)
  const [googleMapsApiKey, setGoogleMapsApiKey] = useState("AIza...")

  const handleSaveSettings = async () => {
    setSaving(true)

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500))

    setSaving(false)

    toast({
      title: "Settings saved",
      description: "Your integration settings have been saved successfully.",
    })
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Integrations</h1>
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

      <Tabs defaultValue="payment">
        <TabsList>
          <TabsTrigger value="payment">Payment Gateways</TabsTrigger>
          <TabsTrigger value="email">Email Service</TabsTrigger>
          <TabsTrigger value="sms">SMS Service</TabsTrigger>
          <TabsTrigger value="maps">Maps & Location</TabsTrigger>
        </TabsList>

        <TabsContent value="payment" className="space-y-6 pt-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <CreditCard className="mr-2 h-5 w-5 text-primary" />
                Stripe
              </CardTitle>
              <CardDescription>Accept credit card payments through Stripe.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="stripe-enabled">Enable Stripe</Label>
                  <p className="text-sm text-muted-foreground">Allow customers to pay with credit cards via Stripe</p>
                </div>
                <Switch id="stripe-enabled" checked={stripeEnabled} onCheckedChange={setStripeEnabled} />
              </div>

              {stripeEnabled && (
                <div className="space-y-4 pt-4">
                  <div className="space-y-2">
                    <Label htmlFor="stripe-public-key">Publishable Key</Label>
                    <Input
                      id="stripe-public-key"
                      value={stripePublicKey}
                      onChange={(e) => setStripePublicKey(e.target.value)}
                      type="password"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="stripe-secret-key">Secret Key</Label>
                    <Input
                      id="stripe-secret-key"
                      value={stripeSecretKey}
                      onChange={(e) => setStripeSecretKey(e.target.value)}
                      type="password"
                    />
                  </div>

                  <div className="flex items-center text-sm text-amber-600">
                    <AlertTriangle className="mr-2 h-4 w-4" />
                    <span>Never share your secret key. It should only be stored securely on the server.</span>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <CreditCard className="mr-2 h-5 w-5 text-primary" />
                Razorpay
              </CardTitle>
              <CardDescription>Accept payments through Razorpay (popular in India).</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="razorpay-enabled">Enable Razorpay</Label>
                  <p className="text-sm text-muted-foreground">Allow customers to pay via Razorpay</p>
                </div>
                <Switch id="razorpay-enabled" checked={razorpayEnabled} onCheckedChange={setRazorpayEnabled} />
              </div>

              {razorpayEnabled && (
                <div className="space-y-4 pt-4">
                  <div className="space-y-2">
                    <Label htmlFor="razorpay-key-id">Key ID</Label>
                    <Input
                      id="razorpay-key-id"
                      value={razorpayKeyId}
                      onChange={(e) => setRazorpayKeyId(e.target.value)}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="razorpay-key-secret">Key Secret</Label>
                    <Input
                      id="razorpay-key-secret"
                      value={razorpayKeySecret}
                      onChange={(e) => setRazorpayKeySecret(e.target.value)}
                      type="password"
                    />
                  </div>

                  <div className="flex items-center text-sm text-amber-600">
                    <AlertTriangle className="mr-2 h-4 w-4" />
                    <span>Never share your key secret. It should only be stored securely on the server.</span>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="email" className="space-y-6 pt-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Mail className="mr-2 h-5 w-5 text-primary" />
                SendGrid
              </CardTitle>
              <CardDescription>Send transactional emails through SendGrid.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="sendgrid-enabled">Enable SendGrid</Label>
                  <p className="text-sm text-muted-foreground">Use SendGrid for sending emails</p>
                </div>
                <Switch id="sendgrid-enabled" checked={sendgridEnabled} onCheckedChange={setSendgridEnabled} />
              </div>

              {sendgridEnabled && (
                <div className="space-y-4 pt-4">
                  <div className="space-y-2">
                    <Label htmlFor="sendgrid-api-key">API Key</Label>
                    <Input
                      id="sendgrid-api-key"
                      value={sendgridApiKey}
                      onChange={(e) => setSendgridApiKey(e.target.value)}
                      type="password"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="sendgrid-from-email">From Email</Label>
                    <Input
                      id="sendgrid-from-email"
                      value={sendgridFromEmail}
                      onChange={(e) => setSendgridFromEmail(e.target.value)}
                      type="email"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="sendgrid-from-name">From Name</Label>
                    <Input
                      id="sendgrid-from-name"
                      value={sendgridFromName}
                      onChange={(e) => setSendgridFromName(e.target.value)}
                    />
                  </div>

                  <div className="flex items-center text-sm">
                    <Button variant="outline" size="sm">
                      Test Email
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="sms" className="space-y-6 pt-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <MessageSquare className="mr-2 h-5 w-5 text-primary" />
                Twilio
              </CardTitle>
              <CardDescription>Send SMS notifications through Twilio.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="twilio-enabled">Enable Twilio</Label>
                  <p className="text-sm text-muted-foreground">Use Twilio for sending SMS notifications</p>
                </div>
                <Switch id="twilio-enabled" checked={twilioEnabled} onCheckedChange={setTwilioEnabled} />
              </div>

              {twilioEnabled && (
                <div className="space-y-4 pt-4">
                  <div className="space-y-2">
                    <Label htmlFor="twilio-account-sid">Account SID</Label>
                    <Input
                      id="twilio-account-sid"
                      value={twilioAccountSid}
                      onChange={(e) => setTwilioAccountSid(e.target.value)}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="twilio-auth-token">Auth Token</Label>
                    <Input
                      id="twilio-auth-token"
                      value={twilioAuthToken}
                      onChange={(e) => setTwilioAuthToken(e.target.value)}
                      type="password"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="twilio-from-number">From Number</Label>
                    <Input
                      id="twilio-from-number"
                      value={twilioFromNumber}
                      onChange={(e) => setTwilioFromNumber(e.target.value)}
                    />
                  </div>

                  <div className="flex items-center text-sm">
                    <Button variant="outline" size="sm">
                      Test SMS
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="maps" className="space-y-6 pt-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Map className="mr-2 h-5 w-5 text-primary" />
                Google Maps
              </CardTitle>
              <CardDescription>Integrate Google Maps for location tracking and navigation.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="google-maps-enabled">Enable Google Maps</Label>
                  <p className="text-sm text-muted-foreground">Use Google Maps for location services</p>
                </div>
                <Switch id="google-maps-enabled" checked={googleMapsEnabled} onCheckedChange={setGoogleMapsEnabled} />
              </div>

              {googleMapsEnabled && (
                <div className="space-y-4 pt-4">
                  <div className="space-y-2">
                    <Label htmlFor="google-maps-api-key">API Key</Label>
                    <Input
                      id="google-maps-api-key"
                      value={googleMapsApiKey}
                      onChange={(e) => setGoogleMapsApiKey(e.target.value)}
                      type="password"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Enabled Services</Label>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          id="maps-javascript"
                          className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                          defaultChecked
                        />
                        <Label htmlFor="maps-javascript">Maps JavaScript API</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          id="maps-directions"
                          className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                          defaultChecked
                        />
                        <Label htmlFor="maps-directions">Directions API</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          id="maps-geocoding"
                          className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                          defaultChecked
                        />
                        <Label htmlFor="maps-geocoding">Geocoding API</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          id="maps-places"
                          className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                          defaultChecked
                        />
                        <Label htmlFor="maps-places">Places API</Label>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
