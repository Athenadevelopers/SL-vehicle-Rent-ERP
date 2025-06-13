"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useAuth } from "@/lib/auth-provider"
import { useEffect, useState } from "react"
import { getStats } from "@/lib/firebase-db"
import { Calendar, Car, CreditCard, TrendingUp, Percent, Star } from "lucide-react"
import { DashboardChart } from "@/components/dashboard/dashboard-chart"
import { RecentBookings } from "@/components/dashboard/recent-bookings"
import { VehicleStatusChart } from "@/components/dashboard/vehicle-status-chart"
import { Button } from "@/components/ui/button"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"

export default function DashboardPage() {
  const { user } = useAuth()
  const [stats, setStats] = useState({
    totalBookings: 0,
    activeBookings: 0,
    totalVehicles: 0,
    totalRevenue: 0,
    fleetUtilization: 0,
    customerSatisfaction: 0,
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchStats = async () => {
      if (user) {
        try {
          const data = await getStats()
          setStats(data)
        } catch (error) {
          console.error("Error fetching stats:", error)
        } finally {
          setLoading(false)
        }
      }
    }

    fetchStats()
  }, [user])

  if (loading) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <p className="text-muted-foreground">Welcome back, {user?.displayName || "User"}!</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card className="hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Bookings</CardTitle>
            <Calendar className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalBookings}</div>
            <p className="text-xs text-muted-foreground flex items-center gap-1">
              <TrendingUp className="h-3 w-3 text-green-500" />
              +20% from last month
            </p>
          </CardContent>
        </Card>
        <Card className="hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Rentals</CardTitle>
            <Car className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.activeBookings}</div>
            <p className="text-xs text-muted-foreground flex items-center gap-1">
              <TrendingUp className="h-3 w-3 text-green-500" />
              +5% from last week
            </p>
          </CardContent>
        </Card>
        <Card className="hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Fleet Utilization</CardTitle>
            <Percent className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.fleetUtilization}%</div>
            <Progress value={stats.fleetUtilization} className="h-2 mt-2" />
          </CardContent>
        </Card>
        <Card className="hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <CreditCard className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">Rs. {stats.totalRevenue.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground flex items-center gap-1">
              <TrendingUp className="h-3 w-3 text-green-500" />
              +15% from last month
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-7">
        <Card className="col-span-7 md:col-span-5">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Revenue Overview</CardTitle>
                <CardDescription>Monthly revenue for the current year</CardDescription>
              </div>
              <Tabs defaultValue="revenue">
                <TabsList>
                  <TabsTrigger value="revenue">Revenue</TabsTrigger>
                  <TabsTrigger value="bookings">Bookings</TabsTrigger>
                </TabsList>
              </Tabs>
            </div>
          </CardHeader>
          <CardContent>
            <DashboardChart />
          </CardContent>
        </Card>
        <Card className="col-span-7 md:col-span-2">
          <CardHeader>
            <CardTitle>Vehicle Status</CardTitle>
            <CardDescription>Current fleet status</CardDescription>
          </CardHeader>
          <CardContent className="flex justify-center">
            <VehicleStatusChart />
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Recent Bookings</CardTitle>
                <CardDescription>Latest vehicle bookings</CardDescription>
              </div>
              <Button variant="outline" size="sm">
                View All
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <RecentBookings />
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Customer Satisfaction</CardTitle>
                <CardDescription>Based on recent reviews</CardDescription>
              </div>
              <div className="flex items-center gap-1">
                <Star className="h-5 w-5 fill-primary text-primary" />
                <span className="font-bold">{stats.customerSatisfaction}</span>
                <span className="text-sm text-muted-foreground">/5</span>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { name: "5 Stars", percentage: 70 },
                { name: "4 Stars", percentage: 20 },
                { name: "3 Stars", percentage: 7 },
                { name: "2 Stars", percentage: 2 },
                { name: "1 Star", percentage: 1 },
              ].map((rating) => (
                <div key={rating.name} className="space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">{rating.name}</span>
                    <span className="text-sm font-medium">{rating.percentage}%</span>
                  </div>
                  <Progress value={rating.percentage} className="h-2" />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
