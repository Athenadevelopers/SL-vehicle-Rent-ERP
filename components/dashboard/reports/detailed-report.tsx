"use client"

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { format } from "date-fns"
import { CalendarIcon, Search } from "lucide-react"
import { cn } from "@/lib/utils"

interface DetailedReportProps {
  type: "revenue" | "bookings" | "vehicles" | "customers"
}

export function DetailedReport({ type }: DetailedReportProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [dateRange, setDateRange] = useState<{ from: Date | undefined; to: Date | undefined }>({
    from: undefined,
    to: undefined,
  })
  const [statusFilter, setStatusFilter] = useState("all")

  // Mock data for different report types
  const getReportData = () => {
    switch (type) {
      case "revenue":
        return [
          {
            id: "R1",
            date: "2023-07-01",
            source: "Booking #B1",
            customer: "John Smith",
            amount: 25000,
            status: "completed",
          },
          {
            id: "R2",
            date: "2023-07-05",
            source: "Booking #B2",
            customer: "Sarah Johnson",
            amount: 38500,
            status: "completed",
          },
          {
            id: "R3",
            date: "2023-07-10",
            source: "Booking #B4",
            customer: "Maria Garcia",
            amount: 52500,
            status: "completed",
          },
          {
            id: "R4",
            date: "2023-07-15",
            source: "Booking #B6",
            customer: "David Lee",
            amount: 30000,
            status: "pending",
          },
          {
            id: "R5",
            date: "2023-07-20",
            source: "Booking #B3",
            customer: "Raj Patel",
            amount: 7000,
            status: "pending",
          },
        ]
      case "bookings":
        return [
          {
            id: "B1",
            date: "2023-07-01",
            vehicle: "Toyota Corolla",
            customer: "John Smith",
            amount: 25000,
            status: "completed",
          },
          {
            id: "B2",
            date: "2023-07-05",
            vehicle: "Honda Civic",
            customer: "Sarah Johnson",
            amount: 38500,
            status: "completed",
          },
          {
            id: "B3",
            date: "2023-07-20",
            vehicle: "Suzuki Alto",
            customer: "Raj Patel",
            amount: 7000,
            status: "pending",
          },
          {
            id: "B4",
            date: "2023-07-10",
            vehicle: "Nissan X-Trail",
            customer: "Maria Garcia",
            amount: 52500,
            status: "completed",
          },
          {
            id: "B5",
            date: "2023-07-25",
            vehicle: "Toyota HiAce",
            customer: "Ahmed Khan",
            amount: 48000,
            status: "active",
          },
        ]
      case "vehicles":
        return [
          {
            id: "V1",
            name: "Toyota Corolla",
            type: "Sedan",
            bookings: 12,
            revenue: 120000,
            utilization: "78%",
          },
          {
            id: "V2",
            name: "Honda Civic",
            type: "Sedan",
            bookings: 10,
            revenue: 110000,
            utilization: "65%",
          },
          {
            id: "V3",
            name: "Toyota HiAce",
            type: "Van",
            bookings: 8,
            revenue: 160000,
            utilization: "52%",
          },
          {
            id: "V4",
            name: "Suzuki Alto",
            type: "Compact",
            bookings: 15,
            revenue: 75000,
            utilization: "85%",
          },
          {
            id: "V5",
            name: "Nissan X-Trail",
            type: "SUV",
            bookings: 9,
            revenue: 135000,
            utilization: "60%",
          },
        ]
      case "customers":
        return [
          {
            id: "C1",
            name: "John Smith",
            bookings: 3,
            totalSpent: 75000,
            lastBooking: "2023-07-01",
            status: "active",
          },
          {
            id: "C2",
            name: "Sarah Johnson",
            bookings: 2,
            totalSpent: 77000,
            lastBooking: "2023-07-05",
            status: "active",
          },
          {
            id: "C3",
            name: "Raj Patel",
            bookings: 1,
            totalSpent: 7000,
            lastBooking: "2023-07-20",
            status: "new",
          },
          {
            id: "C4",
            name: "Maria Garcia",
            bookings: 4,
            totalSpent: 210000,
            lastBooking: "2023-07-10",
            status: "active",
          },
          {
            id: "C5",
            name: "David Lee",
            bookings: 2,
            totalSpent: 86000,
            lastBooking: "2023-06-15",
            status: "inactive",
          },
        ]
      default:
        return []
    }
  }

  const reportData = getReportData()

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "completed":
        return (
          <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
            Completed
          </Badge>
        )
      case "pending":
        return (
          <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">
            Pending
          </Badge>
        )
      case "active":
        return (
          <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
            Active
          </Badge>
        )
      case "inactive":
        return (
          <Badge variant="outline" className="bg-gray-50 text-gray-700 border-gray-200">
            Inactive
          </Badge>
        )
      case "new":
        return (
          <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200">
            New
          </Badge>
        )
      default:
        return <Badge variant="outline">Unknown</Badge>
    }
  }

  const renderReportTable = () => {
    switch (type) {
      case "revenue":
        return (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Source</TableHead>
                <TableHead>Customer</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {reportData.map((item: any) => (
                <TableRow key={item.id}>
                  <TableCell className="font-medium">{item.id}</TableCell>
                  <TableCell>{item.date}</TableCell>
                  <TableCell>{item.source}</TableCell>
                  <TableCell>{item.customer}</TableCell>
                  <TableCell>Rs. {item.amount.toLocaleString()}</TableCell>
                  <TableCell>{getStatusBadge(item.status)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )
      case "bookings":
        return (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Vehicle</TableHead>
                <TableHead>Customer</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {reportData.map((item: any) => (
                <TableRow key={item.id}>
                  <TableCell className="font-medium">{item.id}</TableCell>
                  <TableCell>{item.date}</TableCell>
                  <TableCell>{item.vehicle}</TableCell>
                  <TableCell>{item.customer}</TableCell>
                  <TableCell>Rs. {item.amount.toLocaleString()}</TableCell>
                  <TableCell>{getStatusBadge(item.status)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )
      case "vehicles":
        return (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Vehicle</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Bookings</TableHead>
                <TableHead>Revenue</TableHead>
                <TableHead>Utilization</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {reportData.map((item: any) => (
                <TableRow key={item.id}>
                  <TableCell className="font-medium">{item.id}</TableCell>
                  <TableCell>{item.name}</TableCell>
                  <TableCell>{item.type}</TableCell>
                  <TableCell>{item.bookings}</TableCell>
                  <TableCell>Rs. {item.revenue.toLocaleString()}</TableCell>
                  <TableCell>{item.utilization}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )
      case "customers":
        return (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Customer</TableHead>
                <TableHead>Bookings</TableHead>
                <TableHead>Total Spent</TableHead>
                <TableHead>Last Booking</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {reportData.map((item: any) => (
                <TableRow key={item.id}>
                  <TableCell className="font-medium">{item.id}</TableCell>
                  <TableCell>{item.name}</TableCell>
                  <TableCell>{item.bookings}</TableCell>
                  <TableCell>Rs. {item.totalSpent.toLocaleString()}</TableCell>
                  <TableCell>{item.lastBooking}</TableCell>
                  <TableCell>{getStatusBadge(item.status)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )
      default:
        return null
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="flex w-full max-w-sm items-center space-x-2">
          <Search className="h-4 w-4 text-muted-foreground" />
          <Input
            placeholder={`Search ${type}...`}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full"
          />
        </div>
        <div className="flex flex-col gap-4 sm:flex-row">
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "w-[240px] justify-start text-left font-normal",
                  !dateRange.from && !dateRange.to && "text-muted-foreground",
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {dateRange.from ? (
                  dateRange.to ? (
                    <>
                      {format(dateRange.from, "LLL dd, y")} - {format(dateRange.to, "LLL dd, y")}
                    </>
                  ) : (
                    format(dateRange.from, "LLL dd, y")
                  )
                ) : (
                  "Select date range"
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="end">
              <Calendar
                initialFocus
                mode="range"
                defaultMonth={dateRange.from}
                selected={dateRange}
                onSelect={setDateRange}
                numberOfMonths={2}
              />
            </PopoverContent>
          </Popover>
          {(type === "revenue" || type === "bookings") && (
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="active">Active</SelectItem>
              </SelectContent>
            </Select>
          )}
        </div>
      </div>

      <div className="rounded-md border">{renderReportTable()}</div>

      <div className="flex justify-between items-center">
        <div className="text-sm text-muted-foreground">
          Showing {reportData.length} of {reportData.length} entries
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="sm" disabled>
            Previous
          </Button>
          <Button variant="outline" size="sm" className="px-4 bg-primary/5">
            1
          </Button>
          <Button variant="outline" size="sm" disabled>
            Next
          </Button>
        </div>
      </div>
    </div>
  )
}
