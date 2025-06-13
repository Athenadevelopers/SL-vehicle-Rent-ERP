"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import {
  BarChart,
  Calendar,
  Car,
  CreditCard,
  Home,
  LogOut,
  Settings,
  Users,
  Map,
  Bell,
  FileText,
  PenToolIcon as Tool,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { signOut } from "firebase/auth"
import { auth } from "@/lib/firebase"
import { useRouter } from "next/navigation"
import { useToast } from "@/components/ui/use-toast"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"

export function Sidebar() {
  const pathname = usePathname()
  const router = useRouter()
  const { toast } = useToast()

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

  const mainLinks = [
    { name: "Dashboard", href: "/dashboard", icon: Home },
    { name: "Vehicles", href: "/dashboard/vehicles", icon: Car },
    { name: "Bookings", href: "/dashboard/bookings", icon: Calendar },
    { name: "Customers", href: "/dashboard/customers", icon: Users },
    { name: "Payments", href: "/dashboard/payments", icon: CreditCard },
  ]

  const reportLinks = [
    { name: "Revenue", href: "/dashboard/reports/revenue" },
    { name: "Fleet Utilization", href: "/dashboard/reports/fleet" },
    { name: "Customer Analytics", href: "/dashboard/reports/customers" },
    { name: "Financial Reports", href: "/dashboard/reports/financial" },
  ]

  const settingLinks = [
    { name: "General", href: "/dashboard/settings" },
    { name: "Users & Permissions", href: "/dashboard/settings/users" },
    { name: "Notifications", href: "/dashboard/settings/notifications" },
    { name: "Integrations", href: "/dashboard/settings/integrations" },
  ]

  const advancedLinks = [
    { name: "Fleet Tracking", href: "/dashboard/advanced/tracking", icon: Map },
    { name: "Notifications", href: "/dashboard/advanced/notifications", icon: Bell },
    { name: "Documents", href: "/dashboard/advanced/documents", icon: FileText },
    { name: "Maintenance", href: "/dashboard/advanced/maintenance", icon: Tool },
  ]

  return (
    <div className="hidden border-r bg-background md:block w-64">
      <div className="flex h-full flex-col">
        <div className="flex h-14 items-center border-b px-4">
          <Link href="/" className="flex items-center gap-2 font-semibold">
            <Car className="h-6 w-6 text-primary" />
            <span>SL Vehicle Rental</span>
          </Link>
        </div>
        <div className="flex-1 overflow-auto py-2">
          <nav className="grid items-start px-2 text-sm font-medium">
            {mainLinks.map((link) => {
              const Icon = link.icon
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    "flex items-center gap-3 rounded-lg px-3 py-2 transition-all hover:text-primary",
                    pathname === link.href ? "bg-primary/10 text-primary" : "text-muted-foreground",
                  )}
                >
                  <Icon className="h-4 w-4" />
                  {link.name}
                </Link>
              )
            })}

            <Accordion type="single" collapsible className="w-full">
              <AccordionItem value="reports" className="border-none">
                <AccordionTrigger className="flex items-center gap-3 rounded-lg px-3 py-2 transition-all hover:text-primary text-muted-foreground hover:no-underline">
                  <div className="flex items-center gap-3">
                    <BarChart className="h-4 w-4" />
                    <span>Reports</span>
                  </div>
                </AccordionTrigger>
                <AccordionContent>
                  <div className="grid gap-1 pl-9">
                    {reportLinks.map((link) => (
                      <Link
                        key={link.href}
                        href={link.href}
                        className={cn(
                          "flex items-center gap-3 rounded-lg px-3 py-1 text-sm transition-all hover:text-primary",
                          pathname === link.href ? "bg-primary/10 text-primary" : "text-muted-foreground",
                        )}
                      >
                        {link.name}
                      </Link>
                    ))}
                  </div>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="advanced" className="border-none">
                <AccordionTrigger className="flex items-center gap-3 rounded-lg px-3 py-2 transition-all hover:text-primary text-muted-foreground hover:no-underline">
                  <div className="flex items-center gap-3">
                    <Tool className="h-4 w-4" />
                    <span>Advanced</span>
                  </div>
                </AccordionTrigger>
                <AccordionContent>
                  <div className="grid gap-1 pl-9">
                    {advancedLinks.map((link) => (
                      <Link
                        key={link.href}
                        href={link.href}
                        className={cn(
                          "flex items-center gap-3 rounded-lg px-3 py-1 text-sm transition-all hover:text-primary",
                          pathname === link.href ? "bg-primary/10 text-primary" : "text-muted-foreground",
                        )}
                      >
                        {link.name}
                      </Link>
                    ))}
                  </div>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="settings" className="border-none">
                <AccordionTrigger className="flex items-center gap-3 rounded-lg px-3 py-2 transition-all hover:text-primary text-muted-foreground hover:no-underline">
                  <div className="flex items-center gap-3">
                    <Settings className="h-4 w-4" />
                    <span>Settings</span>
                  </div>
                </AccordionTrigger>
                <AccordionContent>
                  <div className="grid gap-1 pl-9">
                    {settingLinks.map((link) => (
                      <Link
                        key={link.href}
                        href={link.href}
                        className={cn(
                          "flex items-center gap-3 rounded-lg px-3 py-1 text-sm transition-all hover:text-primary",
                          pathname === link.href ? "bg-primary/10 text-primary" : "text-muted-foreground",
                        )}
                      >
                        {link.name}
                      </Link>
                    ))}
                  </div>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </nav>
        </div>
        <div className="mt-auto p-4">
          <Button variant="outline" className="w-full justify-start gap-2" onClick={handleSignOut}>
            <LogOut className="h-4 w-4" />
            Log out
          </Button>
        </div>
      </div>
    </div>
  )
}
