"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Download, FileText } from "lucide-react"
import { VehicleUtilizationChart } from "@/components/dashboard/reports/vehicle-utilization-chart"

export default function FleetReportPage() {
  const [period, setPeriod] = useState("monthly")

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Fleet Utilization Reports</h1>
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
              <CardTitle>Fleet Utilization Analysis</CardTitle>
              <CardDescription>Analyze vehicle utilization and performance.</CardDescription>
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
              <TabsTrigger value="by-category">By Category</TabsTrigger>
              <TabsTrigger value="maintenance">Maintenance</TabsTrigger>
            </TabsList>
            <TabsContent value="overview" className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Fleet Utilization Rate</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">78.5%</div>
                    <p className="text-xs text-muted-foreground">+5.2% from last period</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Average Rental Duration</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">4.2 days</div>
                    <p className="text-xs text-muted-foreground">+0.3 days from last period</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Maintenance Downtime</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">3.8%</div>
                    <p className="text-xs text-muted-foreground">-1.2% from last period</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Idle Vehicles</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">4</div>
                    <p className="text-xs text-muted-foreground">-2 from last period</p>
                  </CardContent>
                </Card>
              </div>
              <div className="h-[400px]">
                <VehicleUtilizationChart />
              </div>
            </TabsContent>
            <TabsContent value="by-vehicle" className="space-y-4">
              <div className="h-[400px]">
                <VehicleUtilizationChart />
              </div>
            </TabsContent>
            <TabsContent value="by-category" className="space-y-4">
              <div className="h-[400px]">
                <VehicleUtilizationChart />
              </div>
            </TabsContent>
            <TabsContent value="maintenance" className="space-y-4">
              <div className="h-[400px]">
                <VehicleUtilizationChart />
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}
