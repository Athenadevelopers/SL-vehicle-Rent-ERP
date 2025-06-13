"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Download, FileText } from "lucide-react"
import { RevenueChart } from "@/components/dashboard/reports/revenue-chart"

export default function RevenueReportPage() {
  const [period, setPeriod] = useState("monthly")

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Revenue Reports</h1>
        <div className="flex items-center gap-2">
          <Button variant="outline" className="flex items-center gap-2">
            <Download className="h-4 w-4" />
            Export
          </Button>
          <Button variant="outline" className="flex items-center gap-2">
            <FileText className="h-4 w-4" />
            Print
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Revenue Analysis</CardTitle>
              <CardDescription>Analyze revenue trends over time.</CardDescription>
            </div>
            <Select value={period} onValueChange={setPeriod}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select period" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="weekly">Weekly</SelectItem>
                <SelectItem value="monthly">Monthly</SelectItem>
                <SelectItem value="quarterly">Quarterly</SelectItem>
                <SelectItem value="yearly">Yearly</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="overview" className="space-y-4">
            <TabsList>
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="by-vehicle">By Vehicle</TabsTrigger>
              <TabsTrigger value="by-customer">By Customer</TabsTrigger>
              <TabsTrigger value="by-location">By Location</TabsTrigger>
            </TabsList>
            <TabsContent value="overview" className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">Rs. 1,245,300</div>
                    <p className="text-xs text-muted-foreground">+20.1% from last period</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Average Daily Revenue</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">Rs. 41,510</div>
                    <p className="text-xs text-muted-foreground">+5.4% from last period</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Revenue per Vehicle</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">Rs. 62,265</div>
                    <p className="text-xs text-muted-foreground">+12.3% from last period</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Profit Margin</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">32.5%</div>
                    <p className="text-xs text-muted-foreground">+2.1% from last period</p>
                  </CardContent>
                </Card>
              </div>
              <div className="h-[400px]">
                <RevenueChart />
              </div>
            </TabsContent>
            <TabsContent value="by-vehicle" className="space-y-4">
              <div className="h-[400px]">
                <RevenueChart />
              </div>
            </TabsContent>
            <TabsContent value="by-customer" className="space-y-4">
              <div className="h-[400px]">
                <RevenueChart />
              </div>
            </TabsContent>
            <TabsContent value="by-location" className="space-y-4">
              <div className="h-[400px]">
                <RevenueChart />
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}
