"use client"

import { useState, useEffect } from "react"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Bell, Menu, Settings, User, LogOut } from "lucide-react"
import { Sidebar } from "./sidebar"
import { useAuth } from "@/lib/auth-provider"
import { signOut } from "firebase/auth"
import { auth } from "@/lib/firebase"
import { useRouter } from "next/navigation"
import { useToast } from "@/components/ui/use-toast"
import { Badge } from "@/components/ui/badge"
import { getUnreadCount, getMockNotifications, markAsRead, type Notification } from "@/lib/notification-service"
import { formatDistanceToNow } from "date-fns"

export function Header() {
  const pathname = usePathname()
  const { user } = useAuth()
  const router = useRouter()
  const { toast } = useToast()
  const [unreadCount, setUnreadCount] = useState(0)
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [showNotifications, setShowNotifications] = useState(false)

  useEffect(() => {
    // Get initial unread count and notifications
    setUnreadCount(getUnreadCount())
    setNotifications(getMockNotifications().slice(0, 5)) // Get only the 5 most recent

    // Poll for new notifications every 30 seconds
    const interval = setInterval(() => {
      setUnreadCount(getUnreadCount())
      setNotifications(getMockNotifications().slice(0, 5))
    }, 30000)

    return () => clearInterval(interval)
  }, [])

  const handleSignOut = async () => {
    try {
      await signOut(auth)
      toast({
        title: "Logged out successfully",
      })
      router.push("/")
    } catch (error) {
      toast({
        title: "Error signing out",
        variant: "destructive",
      })
    }
  }

  const handleNotificationClick = (notification: Notification) => {
    // Mark as read
    if (!notification.read) {
      markAsRead(notification.id)
      setUnreadCount(getUnreadCount())
      setNotifications(getMockNotifications().slice(0, 5))
    }

    // Navigate to link if available
    if (notification.link) {
      router.push(notification.link)
      setShowNotifications(false)
    }
  }

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "info":
        return <div className="h-2 w-2 rounded-full bg-blue-500" />
      case "success":
        return <div className="h-2 w-2 rounded-full bg-green-500" />
      case "warning":
        return <div className="h-2 w-2 rounded-full bg-amber-500" />
      case "error":
        return <div className="h-2 w-2 rounded-full bg-red-500" />
      default:
        return <div className="h-2 w-2 rounded-full bg-gray-500" />
    }
  }

  const getPageTitle = () => {
    if (pathname === "/dashboard") return "Dashboard"

    const segments = pathname.split("/").filter(Boolean)
    if (segments.length >= 2) {
      // Capitalize the last segment
      const lastSegment = segments[segments.length - 1]
      return lastSegment.charAt(0).toUpperCase() + lastSegment.slice(1)
    }

    return "Dashboard"
  }

  return (
    <header className="sticky top-0 z-30 flex h-14 items-center gap-4 border-b bg-background px-4 sm:px-6">
      <Sheet>
        <SheetTrigger asChild>
          <Button variant="outline" size="icon" className="md:hidden">
            <Menu className="h-5 w-5" />
            <span className="sr-only">Toggle Menu</span>
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="w-64 p-0">
          <Sidebar />
        </SheetContent>
      </Sheet>
      <div className="flex-1">
        <h1 className="text-lg font-semibold">{getPageTitle()}</h1>
      </div>
      <div className="flex items-center gap-2">
        <DropdownMenu open={showNotifications} onOpenChange={setShowNotifications}>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="icon" className="relative">
              <Bell className="h-5 w-5" />
              {unreadCount > 0 && (
                <Badge
                  variant="destructive"
                  className="absolute -right-1 -top-1 h-5 w-5 rounded-full p-0 flex items-center justify-center text-[10px]"
                >
                  {unreadCount}
                </Badge>
              )}
              <span className="sr-only">Notifications</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-80">
            <DropdownMenuLabel className="flex items-center justify-between">
              <span>Notifications</span>
              {unreadCount > 0 && (
                <Badge variant="secondary" className="ml-2">
                  {unreadCount} unread
                </Badge>
              )}
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            {notifications.length > 0 ? (
              <>
                {notifications.map((notification) => (
                  <DropdownMenuItem
                    key={notification.id}
                    className={`flex items-start gap-2 p-3 cursor-pointer ${!notification.read ? "bg-primary/5" : ""}`}
                    onClick={() => handleNotificationClick(notification)}
                  >
                    <div className="mt-1">{getNotificationIcon(notification.type)}</div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <p className={`text-xs ${!notification.read ? "font-semibold" : "font-medium"}`}>
                          {notification.title}
                        </p>
                        <span className="text-[10px] text-muted-foreground">
                          {formatDistanceToNow(notification.createdAt, { addSuffix: true })}
                        </span>
                      </div>
                      <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{notification.message}</p>
                    </div>
                  </DropdownMenuItem>
                ))}
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  className="justify-center text-center"
                  onClick={() => {
                    router.push("/dashboard/advanced/notifications")
                    setShowNotifications(false)
                  }}
                >
                  View all notifications
                </DropdownMenuItem>
              </>
            ) : (
              <div className="py-4 text-center text-sm text-muted-foreground">No notifications</div>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="icon" className="rounded-full">
              <Avatar className="h-8 w-8">
                <AvatarImage src="/placeholder.svg" alt="User" />
                <AvatarFallback>{user?.email?.charAt(0).toUpperCase() || "U"}</AvatarFallback>
              </Avatar>
              <span className="sr-only">User menu</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>My Account</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => router.push("/dashboard/profile")}>
              <User className="mr-2 h-4 w-4" />
              Profile
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => router.push("/dashboard/settings")}>
              <Settings className="mr-2 h-4 w-4" />
              Settings
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleSignOut}>
              <LogOut className="mr-2 h-4 w-4" />
              Log out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  )
}
