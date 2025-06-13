"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Download, FileText } from "lucide-react"
import { CustomerAcquisitionChart } from "@/components/dashboard/reports/customer-acquisition-chart"

export default function CustomerReportPage() {
  const [period, setPeriod] = useState("monthly")

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Customer Analytics</h1>
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
              <CardTitle>Customer Analysis</CardTitle>
              <CardDescription>Analyze customer behavior and trends.</CardDescription>
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
              <TabsTrigger value="acquisition">Acquisition</TabsTrigger>
              <TabsTrigger value="retention">Retention</TabsTrigger>
              <TabsTrigger value="demographics">Demographics</TabsTrigger>
            </TabsList>
            <TabsContent value="overview" className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Total Customers</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">1,245</div>
                    <p className="text-xs text-muted-foreground">+85 from last period</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">New Customers</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">85</div>
                    <p className="text-xs text-muted-foreground">+12 from last period</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Repeat Customers</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">68%</div>
                    <p className="text-xs text-muted-foreground">+3.2% from last period</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Avg. Customer Value</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">Rs. 45,200</div>
                    <p className="text-xs text-muted-foreground">+Rs. 2,300 from last period</p>
                  </CardContent>
                </Card>
              </div>
              <div className="h-[400px]">
                <CustomerAcquisitionChart />
              </div>
            </TabsContent>
            <TabsContent value="acquisition" className="space-y-4">
              <div className="h-[400px]">
                <CustomerAcquisitionChart />
              </div>
            </TabsContent>
            <TabsContent value="retention" className="space-y-4">
              <div className="h-[400px]">
                <CustomerAcquisitionChart />
              </div>
            </TabsContent>
            <TabsContent value="demographics" className="space-y-4">
              <div className="h-[400px]">
                <CustomerAcquisitionChart />
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}
