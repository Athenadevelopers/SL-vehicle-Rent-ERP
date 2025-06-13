"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Plus, MoreHorizontal, Search, FileEdit, Trash2, Eye, Mail, Phone } from "lucide-react"
import { getCustomers } from "@/lib/firebase-db"
import { useToast } from "@/components/ui/use-toast"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"

type Customer = {
  id: string
  fullName: string
  email: string
  phone: string
  totalBookings: number
  totalSpent: number
  loyaltyPoints: number
  status: "active" | "inactive"
  createdAt: any // This could be a string or a Firebase Timestamp
}

export default function CustomersPage() {
  const [customers, setCustomers] = useState<Customer[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const { toast } = useToast()

  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        const data = await getCustomers()
        setCustomers(data)
      } catch (error) {
        console.error("Error fetching customers:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchCustomers()
  }, [])

  // If no data from Firebase yet, show mock data
  const mockCustomers: Customer[] = [
    {
      id: "c1",
      fullName: "Amal Perera",
      email: "amal@example.com",
      phone: "+94 71 234 5678",
      totalBookings: 5,
      totalSpent: 75000,
      loyaltyPoints: 750,
      status: "active",
      createdAt: "2023-01-15",
    },
    {
      id: "c2",
      fullName: "Nimal Silva",
      email: "nimal@example.com",
      phone: "+94 77 345 6789",
      totalBookings: 3,
      totalSpent: 45000,
      loyaltyPoints: 450,
      status: "active",
      createdAt: "2023-02-20",
    },
    {
      id: "c3",
      fullName: "Kamala Jayawardena",
      email: "kamala@example.com",
      phone: "+94 76 456 7890",
      totalBookings: 1,
      totalSpent: 15000,
      loyaltyPoints: 150,
      status: "active",
      createdAt: "2023-05-10",
    },
    {
      id: "c4",
      fullName: "Sunil Rathnayake",
      email: "sunil@example.com",
      phone: "+94 70 567 8901",
      totalBookings: 2,
      totalSpent: 28000,
      loyaltyPoints: 280,
      status: "inactive",
      createdAt: "2023-03-05",
    },
    {
      id: "c5",
      fullName: "Priya Fernando",
      email: "priya@example.com",
      phone: "+94 75 678 9012",
      totalBookings: 4,
      totalSpent: 60000,
      loyaltyPoints: 600,
      status: "active",
      createdAt: "2023-02-12",
    },
  ]

  const displayCustomers = customers.length > 0 ? customers : mockCustomers

  const filteredCustomers = displayCustomers.filter((customer) => {
    return (
      customer.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      customer.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      customer.phone.toLowerCase().includes(searchQuery.toLowerCase())
    )
  })

  // Function to format Firebase timestamp or date string
  const formatDate = (dateValue: any): string => {
    if (!dateValue) return "N/A"

    // Check if it's a Firebase Timestamp (has seconds and nanoseconds)
    if (dateValue && typeof dateValue === "object" && "seconds" in dateValue) {
      // Convert Firebase timestamp to JS Date
      return new Date(dateValue.seconds * 1000).toLocaleDateString()
    }

    // If it's already a string, return it
    if (typeof dateValue === "string") {
      return dateValue
    }

    // If it's a Date object
    if (dateValue instanceof Date) {
      return dateValue.toLocaleDateString()
    }

    // Fallback
    return "Unknown date"
  }

  if (loading) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Customers</h1>
        <Dialog>
          <DialogTrigger asChild>
            <Button className="bg-primary hover:bg-primary/90">
              <Plus className="mr-2 h-4 w-4" />
              Add Customer
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>Add New Customer</DialogTitle>
              <DialogDescription>Enter the details of the new customer.</DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="fullName">Full Name</Label>
                  <Input id="fullName" placeholder="John Doe" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" type="email" placeholder="john@example.com" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input id="phone" placeholder="+94 71 234 5678" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="nic">NIC Number</Label>
                  <Input id="nic" placeholder="123456789V" />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="address">Address</Label>
                <Input id="address" placeholder="123 Main St, Colombo" />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline">Cancel</Button>
              <Button className="bg-primary hover:bg-primary/90">Add Customer</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Customer Management</CardTitle>
          <CardDescription>View and manage your customer database.</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="all" className="mb-6">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <TabsList>
                <TabsTrigger value="all">All Customers</TabsTrigger>
                <TabsTrigger value="active">Active</TabsTrigger>
                <TabsTrigger value="inactive">Inactive</TabsTrigger>
                <TabsTrigger value="vip">VIP</TabsTrigger>
              </TabsList>
              <div className="flex w-full max-w-sm items-center space-x-2">
                <Search className="h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search customers..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full"
                />
              </div>
            </div>

            <TabsContent value="all">
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Customer</TableHead>
                      <TableHead>Contact</TableHead>
                      <TableHead>Bookings</TableHead>
                      <TableHead>Total Spent</TableHead>
                      <TableHead>Loyalty Points</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredCustomers.map((customer) => (
                      <TableRow key={customer.id}>
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <Avatar>
                              <AvatarFallback>{customer.fullName.charAt(0)}</AvatarFallback>
                            </Avatar>
                            <div>
                              <p className="font-medium">{customer.fullName}</p>
                              <p className="text-xs text-muted-foreground">
                                Customer since {formatDate(customer.createdAt)}
                              </p>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex flex-col space-y-1">
                            <div className="flex items-center gap-1">
                              <Mail className="h-3 w-3 text-muted-foreground" />
                              <span className="text-sm">{customer.email}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Phone className="h-3 w-3 text-muted-foreground" />
                              <span className="text-sm">{customer.phone}</span>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>{customer.totalBookings}</TableCell>
                        <TableCell>Rs. {customer.totalSpent?.toLocaleString() || "0"}</TableCell>
                        <TableCell>{customer.loyaltyPoints}</TableCell>
                        <TableCell>
                          <Badge variant={customer.status === "active" ? "outline" : "secondary"}>
                            {customer.status}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon">
                                <MoreHorizontal className="h-4 w-4" />
                                <span className="sr-only">Open menu</span>
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem className="flex items-center gap-2">
                                <Eye className="h-4 w-4" />
                                <span>View Profile</span>
                              </DropdownMenuItem>
                              <DropdownMenuItem className="flex items-center gap-2">
                                <FileEdit className="h-4 w-4" />
                                <span>Edit</span>
                              </DropdownMenuItem>
                              <DropdownMenuItem className="flex items-center gap-2">
                                <Mail className="h-4 w-4" />
                                <span>Send Email</span>
                              </DropdownMenuItem>
                              <DropdownMenuItem className="flex items-center gap-2 text-destructive focus:text-destructive">
                                <Trash2 className="h-4 w-4" />
                                <span>Delete</span>
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </TabsContent>

            <TabsContent value="active">
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Customer</TableHead>
                      <TableHead>Contact</TableHead>
                      <TableHead>Bookings</TableHead>
                      <TableHead>Total Spent</TableHead>
                      <TableHead>Loyalty Points</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredCustomers
                      .filter((customer) => customer.status === "active")
                      .map((customer) => (
                        <TableRow key={customer.id}>
                          <TableCell>
                            <div className="flex items-center gap-3">
                              <Avatar>
                                <AvatarFallback>{customer.fullName.charAt(0)}</AvatarFallback>
                              </Avatar>
                              <div>
                                <p className="font-medium">{customer.fullName}</p>
                                <p className="text-xs text-muted-foreground">
                                  Customer since {formatDate(customer.createdAt)}
                                </p>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex flex-col space-y-1">
                              <div className="flex items-center gap-1">
                                <Mail className="h-3 w-3 text-muted-foreground" />
                                <span className="text-sm">{customer.email}</span>
                              </div>
                              <div className="flex items-center gap-1">
                                <Phone className="h-3 w-3 text-muted-foreground" />
                                <span className="text-sm">{customer.phone}</span>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>{customer.totalBookings}</TableCell>
                          <TableCell>Rs. {customer.totalSpent?.toLocaleString() || "0"}</TableCell>
                          <TableCell>{customer.loyaltyPoints}</TableCell>
                          <TableCell>
                            <Badge variant="outline">{customer.status}</Badge>
                          </TableCell>
                          <TableCell className="text-right">
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon">
                                  <MoreHorizontal className="h-4 w-4" />
                                  <span className="sr-only">Open menu</span>
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem className="flex items-center gap-2">
                                  <Eye className="h-4 w-4" />
                                  <span>View Profile</span>
                                </DropdownMenuItem>
                                <DropdownMenuItem className="flex items-center gap-2">
                                  <FileEdit className="h-4 w-4" />
                                  <span>Edit</span>
                                </DropdownMenuItem>
                                <DropdownMenuItem className="flex items-center gap-2">
                                  <Mail className="h-4 w-4" />
                                  <span>Send Email</span>
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </TableCell>
                        </TableRow>
                      ))}
                  </TableBody>
                </Table>
              </div>
            </TabsContent>

            <TabsContent value="inactive">
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Customer</TableHead>
                      <TableHead>Contact</TableHead>
                      <TableHead>Bookings</TableHead>
                      <TableHead>Total Spent</TableHead>
                      <TableHead>Loyalty Points</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredCustomers
                      .filter((customer) => customer.status === "inactive")
                      .map((customer) => (
                        <TableRow key={customer.id}>
                          <TableCell>
                            <div className="flex items-center gap-3">
                              <Avatar>
                                <AvatarFallback>{customer.fullName.charAt(0)}</AvatarFallback>
                              </Avatar>
                              <div>
                                <p className="font-medium">{customer.fullName}</p>
                                <p className="text-xs text-muted-foreground">
                                  Customer since {formatDate(customer.createdAt)}
                                </p>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex flex-col space-y-1">
                              <div className="flex items-center gap-1">
                                <Mail className="h-3 w-3 text-muted-foreground" />
                                <span className="text-sm">{customer.email}</span>
                              </div>
                              <div className="flex items-center gap-1">
                                <Phone className="h-3 w-3 text-muted-foreground" />
                                <span className="text-sm">{customer.phone}</span>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>{customer.totalBookings}</TableCell>
                          <TableCell>Rs. {customer.totalSpent?.toLocaleString() || "0"}</TableCell>
                          <TableCell>{customer.loyaltyPoints}</TableCell>
                          <TableCell>
                            <Badge variant="secondary">{customer.status}</Badge>
                          </TableCell>
                          <TableCell className="text-right">
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon">
                                  <MoreHorizontal className="h-4 w-4" />
                                  <span className="sr-only">Open menu</span>
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem className="flex items-center gap-2">
                                  <Eye className="h-4 w-4" />
                                  <span>View Profile</span>
                                </DropdownMenuItem>
                                <DropdownMenuItem className="flex items-center gap-2">
                                  <FileEdit className="h-4 w-4" />
                                  <span>Edit</span>
                                </DropdownMenuItem>
                                <DropdownMenuItem className="flex items-center gap-2">
                                  <Mail className="h-4 w-4" />
                                  <span>Send Email</span>
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </TableCell>
                        </TableRow>
                      ))}
                  </TableBody>
                </Table>
              </div>
            </TabsContent>

            <TabsContent value="vip">
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Customer</TableHead>
                      <TableHead>Contact</TableHead>
                      <TableHead>Bookings</TableHead>
                      <TableHead>Total Spent</TableHead>
                      <TableHead>Loyalty Points</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredCustomers
                      .filter((customer) => customer.loyaltyPoints >= 500)
                      .map((customer) => (
                        <TableRow key={customer.id}>
                          <TableCell>
                            <div className="flex items-center gap-3">
                              <Avatar>
                                <AvatarFallback>{customer.fullName.charAt(0)}</AvatarFallback>
                              </Avatar>
                              <div>
                                <p className="font-medium">{customer.fullName}</p>
                                <p className="text-xs text-muted-foreground">
                                  Customer since {formatDate(customer.createdAt)}
                                </p>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex flex-col space-y-1">
                              <div className="flex items-center gap-1">
                                <Mail className="h-3 w-3 text-muted-foreground" />
                                <span className="text-sm">{customer.email}</span>
                              </div>
                              <div className="flex items-center gap-1">
                                <Phone className="h-3 w-3 text-muted-foreground" />
                                <span className="text-sm">{customer.phone}</span>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>{customer.totalBookings}</TableCell>
                          <TableCell>Rs. {customer.totalSpent?.toLocaleString() || "0"}</TableCell>
                          <TableCell>{customer.loyaltyPoints}</TableCell>
                          <TableCell>
                            <Badge variant={customer.status === "active" ? "outline" : "secondary"}>
                              {customer.status}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-right">
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon">
                                  <MoreHorizontal className="h-4 w-4" />
                                  <span className="sr-only">Open menu</span>
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem className="flex items-center gap-2">
                                  <Eye className="h-4 w-4" />
                                  <span>View Profile</span>
                                </DropdownMenuItem>
                                <DropdownMenuItem className="flex items-center gap-2">
                                  <FileEdit className="h-4 w-4" />
                                  <span>Edit</span>
                                </DropdownMenuItem>
                                <DropdownMenuItem className="flex items-center gap-2">
                                  <Mail className="h-4 w-4" />
                                  <span>Send Email</span>
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </TableCell>
                        </TableRow>
                      ))}
                  </TableBody>
                </Table>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}
