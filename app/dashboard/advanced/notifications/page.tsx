"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Bell, Check, Info, AlertTriangle, AlertCircle, CheckCircle, Clock, Calendar } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"
import { useAuth } from "@/lib/auth-provider"
import { formatDistanceToNow } from "date-fns"
import { getMockNotifications, markAsRead, markAllAsRead, type Notification } from "@/lib/notification-service"

export default function NotificationsPage() {
  const router = useRouter()
  const { toast } = useToast()
  const { user } = useAuth()
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!user) return

    // Get notifications
    const fetchNotifications = () => {
      try {
        const notificationsData = getMockNotifications()
        setNotifications(notificationsData)
      } catch (error) {
        console.error("Error fetching notifications:", error)
        toast({
          title: "Error loading notifications",
          description: "There was an error loading your notifications. Please try again.",
          variant: "destructive",
        })
      } finally {
        setLoading(false)
      }
    }

    fetchNotifications()

    // Poll for new notifications every 30 seconds
    const interval = setInterval(fetchNotifications, 30000)

    return () => clearInterval(interval)
  }, [user, toast])

  const handleMarkAsRead = (id: string) => {
    markAsRead(id)
    setNotifications(getMockNotifications())

    toast({
      title: "Notification marked as read",
      description: "The notification has been marked as read.",
    })
  }

  const handleMarkAllAsRead = () => {
    markAllAsRead()
    setNotifications(getMockNotifications())

    toast({
      title: "All notifications marked as read",
      description: "All notifications have been marked as read.",
    })
  }

  const handleNotificationClick = (notification: Notification) => {
    // Mark as read
    if (!notification.read) {
      markAsRead(notification.id)
      setNotifications(getMockNotifications())
    }

    // Navigate to link if available
    if (notification.link) {
      router.push(notification.link)
    }
  }

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "info":
        return <Info className="h-5 w-5 text-blue-500" />
      case "success":
        return <CheckCircle className="h-5 w-5 text-green-500" />
      case "warning":
        return <AlertTriangle className="h-5 w-5 text-amber-500" />
      case "error":
        return <AlertCircle className="h-5 w-5 text-red-500" />
      default:
        return <Bell className="h-5 w-5 text-gray-500" />
    }
  }

  const unreadNotifications = notifications.filter((n) => !n.read)
  const readNotifications = notifications.filter((n) => n.read)

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Notifications</h1>
        {unreadNotifications.length > 0 && (
          <Button variant="outline" onClick={handleMarkAllAsRead}>
            <Check className="mr-2 h-4 w-4" />
            Mark All as Read
          </Button>
        )}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Notifications</CardTitle>
          <CardDescription>
            View and manage your notifications.
            {unreadNotifications.length > 0 && (
              <Badge variant="secondary" className="ml-2">
                {unreadNotifications.length} unread
              </Badge>
            )}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="all">
            <TabsList>
              <TabsTrigger value="all">All</TabsTrigger>
              <TabsTrigger value="unread">
                Unread
                {unreadNotifications.length > 0 && (
                  <Badge variant="secondary" className="ml-2">
                    {unreadNotifications.length}
                  </Badge>
                )}
              </TabsTrigger>
              <TabsTrigger value="read">Read</TabsTrigger>
            </TabsList>
            <TabsContent value="all" className="mt-4">
              {loading ? (
                <div className="flex justify-center items-center h-40">
                  <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
                </div>
              ) : notifications.length > 0 ? (
                <div className="space-y-4">
                  {notifications.map((notification) => (
                    <div
                      key={notification.id}
                      className={`flex items-start gap-4 p-4 rounded-lg border cursor-pointer transition-colors ${
                        notification.read ? "bg-background hover:bg-muted/50" : "bg-primary/5 hover:bg-primary/10"
                      }`}
                      onClick={() => handleNotificationClick(notification)}
                    >
                      <div className="mt-1">{getNotificationIcon(notification.type)}</div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <h4 className={`text-sm font-medium ${!notification.read && "font-semibold"}`}>
                            {notification.title}
                          </h4>
                          <span className="text-xs text-muted-foreground">
                            {formatDistanceToNow(notification.createdAt, { addSuffix: true })}
                          </span>
                        </div>
                        <p className="text-sm text-muted-foreground mt-1">{notification.message}</p>
                        {notification.link && (
                          <div className="mt-2">
                            <span className="text-xs text-primary">View details</span>
                          </div>
                        )}
                      </div>
                      {!notification.read && (
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-6 w-6"
                          onClick={(e) => {
                            e.stopPropagation()
                            handleMarkAsRead(notification.id)
                          }}
                        >
                          <Check className="h-4 w-4" />
                          <span className="sr-only">Mark as read</span>
                        </Button>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center h-40 text-center">
                  <Bell className="h-8 w-8 text-muted-foreground mb-2" />
                  <h3 className="text-lg font-medium">No notifications</h3>
                  <p className="text-sm text-muted-foreground">You don't have any notifications at the moment.</p>
                </div>
              )}
            </TabsContent>
            <TabsContent value="unread" className="mt-4">
              {loading ? (
                <div className="flex justify-center items-center h-40">
                  <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
                </div>
              ) : unreadNotifications.length > 0 ? (
                <div className="space-y-4">
                  {unreadNotifications.map((notification) => (
                    <div
                      key={notification.id}
                      className="flex items-start gap-4 p-4 rounded-lg border cursor-pointer transition-colors bg-primary/5 hover:bg-primary/10"
                      onClick={() => handleNotificationClick(notification)}
                    >
                      <div className="mt-1">{getNotificationIcon(notification.type)}</div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <h4 className="text-sm font-semibold">{notification.title}</h4>
                          <span className="text-xs text-muted-foreground">
                            {formatDistanceToNow(notification.createdAt, { addSuffix: true })}
                          </span>
                        </div>
                        <p className="text-sm text-muted-foreground mt-1">{notification.message}</p>
                        {notification.link && (
                          <div className="mt-2">
                            <span className="text-xs text-primary">View details</span>
                          </div>
                        )}
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6"
                        onClick={(e) => {
                          e.stopPropagation()
                          handleMarkAsRead(notification.id)
                        }}
                      >
                        <Check className="h-4 w-4" />
                        <span className="sr-only">Mark as read</span>
                      </Button>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center h-40 text-center">
                  <CheckCircle className="h-8 w-8 text-muted-foreground mb-2" />
                  <h3 className="text-lg font-medium">All caught up!</h3>
                  <p className="text-sm text-muted-foreground">You have no unread notifications.</p>
                </div>
              )}
            </TabsContent>
            <TabsContent value="read" className="mt-4">
              {loading ? (
                <div className="flex justify-center items-center h-40">
                  <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
                </div>
              ) : readNotifications.length > 0 ? (
                <div className="space-y-4">
                  {readNotifications.map((notification) => (
                    <div
                      key={notification.id}
                      className="flex items-start gap-4 p-4 rounded-lg border cursor-pointer transition-colors bg-background hover:bg-muted/50"
                      onClick={() => handleNotificationClick(notification)}
                    >
                      <div className="mt-1">{getNotificationIcon(notification.type)}</div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <h4 className="text-sm font-medium">{notification.title}</h4>
                          <span className="text-xs text-muted-foreground">
                            {formatDistanceToNow(notification.createdAt, { addSuffix: true })}
                          </span>
                        </div>
                        <p className="text-sm text-muted-foreground mt-1">{notification.message}</p>
                        {notification.link && (
                          <div className="mt-2">
                            <span className="text-xs text-primary">View details</span>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center h-40 text-center">
                  <Clock className="h-8 w-8 text-muted-foreground mb-2" />
                  <h3 className="text-lg font-medium">No read notifications</h3>
                  <p className="text-sm text-muted-foreground">You haven't read any notifications yet.</p>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Notification Settings</CardTitle>
          <CardDescription>Configure your notification preferences.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-6 md:grid-cols-2">
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Email Notifications</h3>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label htmlFor="email-bookings" className="text-sm font-medium">
                    Booking Confirmations
                  </label>
                  <input
                    type="checkbox"
                    id="email-bookings"
                    className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                    defaultChecked
                  />
                </div>
                <div className="flex items-center justify-between">
                  <label htmlFor="email-payments" className="text-sm font-medium">
                    Payment Receipts
                  </label>
                  <input
                    type="checkbox"
                    id="email-payments"
                    className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                    defaultChecked
                  />
                </div>
                <div className="flex items-center justify-between">
                  <label htmlFor="email-reminders" className="text-sm font-medium">
                    Pickup/Return Reminders
                  </label>
                  <input
                    type="checkbox"
                    id="email-reminders"
                    className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                    defaultChecked
                  />
                </div>
                <div className="flex items-center justify-between">
                  <label htmlFor="email-maintenance" className="text-sm font-medium">
                    Maintenance Alerts
                  </label>
                  <input
                    type="checkbox"
                    id="email-maintenance"
                    className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                    defaultChecked
                  />
                </div>
              </div>
            </div>
            <div className="space-y-4">
              <h3 className="text-lg font-medium">SMS Notifications</h3>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label htmlFor="sms-bookings" className="text-sm font-medium">
                    Booking Confirmations
                  </label>
                  <input
                    type="checkbox"
                    id="sms-bookings"
                    className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                    defaultChecked
                  />
                </div>
                <div className="flex items-center justify-between">
                  <label htmlFor="sms-payments" className="text-sm font-medium">
                    Payment Receipts
                  </label>
                  <input
                    type="checkbox"
                    id="sms-payments"
                    className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                    defaultChecked
                  />
                </div>
                <div className="flex items-center justify-between">
                  <label htmlFor="sms-reminders" className="text-sm font-medium">
                    Pickup/Return Reminders
                  </label>
                  <input
                    type="checkbox"
                    id="sms-reminders"
                    className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                    defaultChecked
                  />
                </div>
                <div className="flex items-center justify-between">
                  <label htmlFor="sms-maintenance" className="text-sm font-medium">
                    Maintenance Alerts
                  </label>
                  <input
                    type="checkbox"
                    id="sms-maintenance"
                    className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                    defaultChecked
                  />
                </div>
              </div>
            </div>
          </div>
          <div className="mt-6">
            <Button>Save Notification Settings</Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Scheduled Notifications</CardTitle>
          <CardDescription>View and manage upcoming scheduled notifications.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="px-4 py-3 text-left text-sm font-medium">Type</th>
                  <th className="px-4 py-3 text-left text-sm font-medium">Recipient</th>
                  <th className="px-4 py-3 text-left text-sm font-medium">Scheduled For</th>
                  <th className="px-4 py-3 text-left text-sm font-medium">Status</th>
                  <th className="px-4 py-3 text-right text-sm font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b">
                  <td className="px-4 py-3 text-sm">
                    <div className="flex items-center">
                      <Calendar className="mr-2 h-4 w-4 text-blue-500" />
                      <span>Pickup Reminder</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-sm">John Smith</td>
                  <td className="px-4 py-3 text-sm">Tomorrow, 9:00 AM</td>
                  <td className="px-4 py-3 text-sm">
                    <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                      Scheduled
                    </Badge>
                  </td>
                  <td className="px-4 py-3 text-sm text-right">
                    <Button variant="ghost" size="sm">
                      Cancel
                    </Button>
                  </td>
                </tr>
                <tr className="border-b">
                  <td className="px-4 py-3 text-sm">
                    <div className="flex items-center">
                      <Calendar className="mr-2 h-4 w-4 text-blue-500" />
                      <span>Return Reminder</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-sm">Sarah Johnson</td>
                  <td className="px-4 py-3 text-sm">Jul 25, 2023, 9:00 AM</td>
                  <td className="px-4 py-3 text-sm">
                    <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                      Scheduled
                    </Badge>
                  </td>
                  <td className="px-4 py-3 text-sm text-right">
                    <Button variant="ghost" size="sm">
                      Cancel
                    </Button>
                  </td>
                </tr>
                <tr>
                  <td className="px-4 py-3 text-sm">
                    <div className="flex items-center">
                      <AlertTriangle className="mr-2 h-4 w-4 text-amber-500" />
                      <span>Maintenance Alert</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-sm">All Staff</td>
                  <td className="px-4 py-3 text-sm">Jul 30, 2023, 8:00 AM</td>
                  <td className="px-4 py-3 text-sm">
                    <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                      Scheduled
                    </Badge>
                  </td>
                  <td className="px-4 py-3 text-sm text-right">
                    <Button variant="ghost" size="sm">
                      Cancel
                    </Button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
