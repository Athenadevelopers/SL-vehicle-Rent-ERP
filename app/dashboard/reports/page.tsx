"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { RevenueChart } from "@/components/dashboard/reports/revenue-chart"
import { BookingsChart } from "@/components/dashboard/reports/bookings-chart"
import { VehicleUtilizationChart } from "@/components/dashboard/reports/vehicle-utilization-chart"
import { CustomerAcquisitionChart } from "@/components/dashboard/reports/customer-acquisition-chart"
import { DetailedReport } from "@/components/dashboard/reports/detailed-report"
import { ExportOptions } from "@/components/dashboard/reports/export-options"
import { PdfPreview } from "@/components/dashboard/reports/pdf-preview"
import { exportToPDF, exportToExcel, printData } from "@/lib/export-utils"
import { useToast } from "@/components/ui/use-toast"
import { FileText, BarChart, Calendar, Car, Users, Download } from "lucide-react"
import Link from "next/link"

export default function ReportsPage() {
  const { toast } = useToast()
  const [activeTab, setActiveTab] = useState("overview")
  const [showPdfPreview, setShowPdfPreview] = useState(false)
  const [selectedReport, setSelectedReport] = useState<string | null>(null)

  const handleExport = (format: "pdf" | "excel" | "print") => {
    // Example data for export
    const headers = ["Date", "Vehicle", "Customer", "Amount", "Status"]
    const data = [
      ["2023-07-01", "Toyota Corolla", "John Smith", "Rs. 25,000", "Completed"],
      ["2023-07-05", "Honda Civic", "Sarah Johnson", "Rs. 38,500", "Completed"],
      ["2023-07-10", "Nissan X-Trail", "Maria Garcia", "Rs. 52,500", "Completed"],
      ["2023-07-15", "Toyota Corolla", "David Lee", "Rs. 30,000", "Active"],
      ["2023-07-20", "Suzuki Alto", "Raj Patel", "Rs. 7,000", "Pending"],
    ]

    const exportOptions = {
      title: "Booking Report",
      filename: "booking-report",
      headers,
      data,
      dateRange: "July 1, 2023 - July 31, 2023",
      summary: [
        { label: "Total Bookings", value: "5" },
        { label: "Total Revenue", value: "Rs. 153,000" },
        { label: "Average Booking Value", value: "Rs. 30,600" },
      ],
    }

    try {
      if (format === "pdf") {
        exportToPDF(exportOptions)
      } else if (format === "excel") {
        exportToExcel(exportOptions)
      } else if (format === "print") {
        printData(exportOptions)
      }

      toast({
        title: "Report exported successfully",
        description: `The report has been exported in ${format.toUpperCase()} format.`,
      })
    } catch (error) {
      console.error("Error exporting report:", error)
      toast({
        title: "Error exporting report",
        description: "There was an error exporting the report. Please try again.",
        variant: "destructive",
      })
    }
  }

  const handleShowPdfPreview = (reportType: string) => {
    setSelectedReport(reportType)
    setShowPdfPreview(true)
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Reports</h1>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => handleExport("pdf")}>
            <FileText className="mr-2 h-4 w-4" />
            Export PDF
          </Button>
          <Button variant="outline" onClick={() => handleExport("excel")}>
            <Download className="mr-2 h-4 w-4" />
            Export Excel
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Link href="/dashboard/reports/revenue">
          <Card className="hover:shadow-md transition-shadow cursor-pointer">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
              <BarChart className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">Rs. 1,245,000</div>
              <p className="text-xs text-muted-foreground">+20.1% from last month</p>
            </CardContent>
          </Card>
        </Link>
        <Link href="/dashboard/reports/fleet">
          <Card className="hover:shadow-md transition-shadow cursor-pointer">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Vehicle Utilization</CardTitle>
              <Car className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">78%</div>
              <p className="text-xs text-muted-foreground">+5.4% from last month</p>
            </CardContent>
          </Card>
        </Link>
        <Link href="/dashboard/reports/customers">
          <Card className="hover:shadow-md transition-shadow cursor-pointer">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">New Customers</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">+48</div>
              <p className="text-xs text-muted-foreground">+12.3% from last month</p>
            </CardContent>
          </Card>
        </Link>
        <Link href="/dashboard/reports/financial">
          <Card className="hover:shadow-md transition-shadow cursor-pointer">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Bookings</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">156</div>
              <p className="text-xs text-muted-foreground">+8.2% from last month</p>
            </CardContent>
          </Card>
        </Link>
      </div>

      <Tabs defaultValue="overview" value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="revenue">Revenue</TabsTrigger>
          <TabsTrigger value="bookings">Bookings</TabsTrigger>
          <TabsTrigger value="vehicles">Vehicles</TabsTrigger>
          <TabsTrigger value="customers">Customers</TabsTrigger>
        </TabsList>
        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Revenue Overview</CardTitle>
                <CardDescription>Monthly revenue for the current year</CardDescription>
              </CardHeader>
              <CardContent className="h-[300px]">
                <RevenueChart />
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Booking Trends</CardTitle>
                <CardDescription>Monthly bookings for the current year</CardDescription>
              </CardHeader>
              <CardContent className="h-[300px]">
                <BookingsChart />
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Vehicle Utilization</CardTitle>
                <CardDescription>Utilization rate by vehicle type</CardDescription>
              </CardHeader>
              <CardContent className="h-[300px]">
                <VehicleUtilizationChart />
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Customer Acquisition</CardTitle>
                <CardDescription>New customers by month</CardDescription>
              </CardHeader>
              <CardContent className="h-[300px]">
                <CustomerAcquisitionChart />
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        <TabsContent value="revenue" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Revenue Report</CardTitle>
                  <CardDescription>Detailed revenue breakdown</CardDescription>
                </div>
                <ExportOptions
                  onExportPdf={() => handleShowPdfPreview("revenue")}
                  onExportExcel={() => handleExport("excel")}
                  onPrint={() => handleExport("print")}
                />
              </div>
            </CardHeader>
            <CardContent>
              <DetailedReport type="revenue" />
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="bookings" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Bookings Report</CardTitle>
                  <CardDescription>Detailed bookings breakdown</CardDescription>
                </div>
                <ExportOptions
                  onExportPdf={() => handleShowPdfPreview("bookings")}
                  onExportExcel={() => handleExport("excel")}
                  onPrint={() => handleExport("print")}
                />
              </div>
            </CardHeader>
            <CardContent>
              <DetailedReport type="bookings" />
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="vehicles" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Vehicle Report</CardTitle>
                  <CardDescription>Detailed vehicle performance breakdown</CardDescription>
                </div>
                <ExportOptions
                  onExportPdf={() => handleShowPdfPreview("vehicles")}
                  onExportExcel={() => handleExport("excel")}
                  onPrint={() => handleExport("print")}
                />
              </div>
            </CardHeader>
            <CardContent>
              <DetailedReport type="vehicles" />
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="customers" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Customer Report</CardTitle>
                  <CardDescription>Detailed customer analytics</CardDescription>
                </div>
                <ExportOptions
                  onExportPdf={() => handleShowPdfPreview("customers")}
                  onExportExcel={() => handleExport("excel")}
                  onPrint={() => handleExport("print")}
                />
              </div>
            </CardHeader>
            <CardContent>
              <DetailedReport type="customers" />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {showPdfPreview && selectedReport && (
        <PdfPreview reportType={selectedReport} onClose={() => setShowPdfPreview(false)} />
      )}
    </div>
  )
}
