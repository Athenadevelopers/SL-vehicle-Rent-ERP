"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Search,
  Plus,
  MoreHorizontal,
  Car,
  Calendar,
  Settings,
  FileText,
  AlertTriangle,
  CheckCircle,
  Wrench,
  Upload,
} from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { useRouter } from "next/navigation"
import { useToast } from "@/components/ui/use-toast"
import Image from "next/image"

interface Vehicle {
  id: string
  name: string
  type: string
  licensePlate: string
  status: "available" | "rented" | "maintenance" | "unavailable"
  dailyRate: number
  fuelType: string
  transmission: string
  seats: number
  mileage: number
  lastService: string
  nextService: string
  image: string
}

export default function VehiclesPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [searchQuery, setSearchQuery] = useState("")
  const [typeFilter, setTypeFilter] = useState("all")
  const [statusFilter, setStatusFilter] = useState("all")
  const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | null>(null)
  const [isMaintenanceDialogOpen, setIsMaintenanceDialogOpen] = useState(false)
  const [isAddVehicleDialogOpen, setIsAddVehicleDialogOpen] = useState(false)
  const [isServiceDialogOpen, setIsServiceDialogOpen] = useState(false)
  const [maintenanceNotes, setMaintenanceNotes] = useState("")
  const [maintenanceType, setMaintenanceType] = useState("regular")
  const [estimatedDays, setEstimatedDays] = useState("1")
  const [loading, setLoading] = useState(false)

  // New vehicle state
  const [newVehicle, setNewVehicle] = useState({
    name: "",
    type: "sedan",
    licensePlate: "",
    status: "available",
    dailyRate: 0,
    fuelType: "petrol",
    transmission: "automatic",
    seats: 5,
    mileage: 0,
    image: "/images/toyota-corolla.jpg",
  })

  // Service state
  const [serviceDetails, setServiceDetails] = useState({
    type: "oil_change",
    date: new Date().toISOString().split("T")[0],
    cost: 0,
    notes: "",
  })

  // Mock data
  const vehicles: Vehicle[] = [
    {
      id: "v1",
      name: "Toyota Corolla",
      type: "Sedan",
      licensePlate: "CAB-1234",
      status: "available",
      dailyRate: 5000,
      fuelType: "Petrol",
      transmission: "Automatic",
      seats: 5,
      mileage: 45000,
      lastService: "2023-04-15",
      nextService: "2023-10-15",
      image: "/images/toyota-corolla.jpg",
    },
    {
      id: "v2",
      name: "Honda Civic",
      type: "Sedan",
      licensePlate: "CAC-5678",
      status: "rented",
      dailyRate: 5500,
      fuelType: "Petrol",
      transmission: "Automatic",
      seats: 5,
      mileage: 32000,
      lastService: "2023-05-20",
      nextService: "2023-11-20",
      image: "/images/honda-civic.jpg",
    },
    {
      id: "v3",
      name: "Toyota HiAce",
      type: "Van",
      licensePlate: "VAB-3456",
      status: "maintenance",
      dailyRate: 8000,
      fuelType: "Diesel",
      transmission: "Manual",
      seats: 12,
      mileage: 78000,
      lastService: "2023-03-10",
      nextService: "2023-09-10",
      image: "/images/toyota-hiace.jpg",
    },
    {
      id: "v4",
      name: "Suzuki Alto",
      type: "Compact",
      licensePlate: "CAD-7890",
      status: "available",
      dailyRate: 3500,
      fuelType: "Petrol",
      transmission: "Manual",
      seats: 4,
      mileage: 28000,
      lastService: "2023-06-05",
      nextService: "2023-12-05",
      image: "/images/suzuki-alto.jpg",
    },
    {
      id: "v5",
      name: "Nissan X-Trail",
      type: "SUV",
      licensePlate: "SUV-1234",
      status: "available",
      dailyRate: 7500,
      fuelType: "Diesel",
      transmission: "Automatic",
      seats: 7,
      mileage: 52000,
      lastService: "2023-02-25",
      nextService: "2023-08-25",
      image: "/images/nissan-xtrail.jpg",
    },
  ]

  const filteredVehicles = vehicles.filter((vehicle) => {
    // Apply search filter
    const matchesSearch =
      vehicle.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      vehicle.licensePlate.toLowerCase().includes(searchQuery.toLowerCase())

    // Apply type filter
    const matchesType = typeFilter === "all" || vehicle.type.toLowerCase() === typeFilter.toLowerCase()

    // Apply status filter
    const matchesStatus = statusFilter === "all" || vehicle.status === statusFilter

    return matchesSearch && matchesType && matchesStatus
  })

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "available":
        return (
          <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
            Available
          </Badge>
        )
      case "rented":
        return (
          <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
            Rented
          </Badge>
        )
      case "maintenance":
        return (
          <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">
            Maintenance
          </Badge>
        )
      case "unavailable":
        return (
          <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">
            Unavailable
          </Badge>
        )
      default:
        return <Badge variant="outline">Unknown</Badge>
    }
  }

  const handleMaintenanceSubmit = () => {
    if (selectedVehicle) {
      setLoading(true)

      // Simulate API call
      setTimeout(() => {
        toast({
          title: "Vehicle sent to maintenance",
          description: `${selectedVehicle.name} (${selectedVehicle.licensePlate}) has been scheduled for maintenance.`,
        })
        setIsMaintenanceDialogOpen(false)
        setMaintenanceNotes("")
        setMaintenanceType("regular")
        setEstimatedDays("1")
        setLoading(false)
      }, 1000)
    }
  }

  const handleAddVehicle = () => {
    setLoading(true)

    // Simulate API call
    setTimeout(() => {
      toast({
        title: "Vehicle added successfully",
        description: `${newVehicle.name} (${newVehicle.licensePlate}) has been added to your fleet.`,
      })
      setIsAddVehicleDialogOpen(false)
      setNewVehicle({
        name: "",
        type: "sedan",
        licensePlate: "",
        status: "available",
        dailyRate: 0,
        fuelType: "petrol",
        transmission: "automatic",
        seats: 5,
        mileage: 0,
        image: "/images/toyota-corolla.jpg",
      })
      setLoading(false)
    }, 1000)
  }

  const handleAddService = () => {
    if (selectedVehicle) {
      setLoading(true)

      // Simulate API call
      setTimeout(() => {
        toast({
          title: "Service record added",
          description: `Service record for ${selectedVehicle.name} (${selectedVehicle.licensePlate}) has been added successfully.`,
        })
        setIsServiceDialogOpen(false)
        setServiceDetails({
          type: "oil_change",
          date: new Date().toISOString().split("T")[0],
          cost: 0,
          notes: "",
        })
        setLoading(false)
      }, 1000)
    }
  }

  const handleStatusChange = (vehicle: Vehicle, newStatus: "available" | "rented" | "maintenance" | "unavailable") => {
    setSelectedVehicle(vehicle)

    if (newStatus === "maintenance") {
      setIsMaintenanceDialogOpen(true)
    } else {
      setLoading(true)

      // Simulate API call
      setTimeout(() => {
        toast({
          title: `Vehicle status updated to ${newStatus}`,
          description: `${vehicle.name} (${vehicle.licensePlate}) status has been updated.`,
        })
        setLoading(false)
      }, 1000)
    }
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Vehicles</h1>
        <Button className="bg-primary hover:bg-primary/90" onClick={() => setIsAddVehicleDialogOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Add Vehicle
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Vehicle Fleet</CardTitle>
          <CardDescription>Manage your vehicle inventory and status.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div className="flex w-full max-w-sm items-center space-x-2">
              <Search className="h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search vehicles..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full"
              />
            </div>
            <div className="flex flex-col gap-4 sm:flex-row">
              <Select value={typeFilter} onValueChange={setTypeFilter}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Filter by type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="sedan">Sedan</SelectItem>
                  <SelectItem value="suv">SUV</SelectItem>
                  <SelectItem value="van">Van</SelectItem>
                  <SelectItem value="compact">Compact</SelectItem>
                </SelectContent>
              </Select>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="available">Available</SelectItem>
                  <SelectItem value="rented">Rented</SelectItem>
                  <SelectItem value="maintenance">Maintenance</SelectItem>
                  <SelectItem value="unavailable">Unavailable</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <Tabs defaultValue="all" className="mt-6">
            <TabsList>
              <TabsTrigger value="all">All Vehicles</TabsTrigger>
              <TabsTrigger value="available">Available</TabsTrigger>
              <TabsTrigger value="rented">Rented</TabsTrigger>
              <TabsTrigger value="maintenance">Maintenance</TabsTrigger>
            </TabsList>
            <TabsContent value="all" className="mt-4">
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Vehicle</TableHead>
                      <TableHead>License Plate</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Daily Rate</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredVehicles.length > 0 ? (
                      filteredVehicles.map((vehicle) => (
                        <TableRow key={vehicle.id}>
                          <TableCell className="font-medium">
                            <div className="flex items-center gap-3">
                              <div className="h-10 w-16 relative rounded overflow-hidden">
                                <Image
                                  src={vehicle.image || "/placeholder.svg"}
                                  alt={vehicle.name}
                                  fill
                                  className="object-cover"
                                />
                              </div>
                              {vehicle.name}
                            </div>
                          </TableCell>
                          <TableCell>{vehicle.licensePlate}</TableCell>
                          <TableCell>{vehicle.type}</TableCell>
                          <TableCell>{getStatusBadge(vehicle.status)}</TableCell>
                          <TableCell>Rs. {vehicle.dailyRate?.toLocaleString() || "0"}</TableCell>
                          <TableCell className="text-right">
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon">
                                  <MoreHorizontal className="h-4 w-4" />
                                  <span className="sr-only">Open menu</span>
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                <DropdownMenuItem onClick={() => router.push(`/dashboard/vehicles/${vehicle.id}`)}>
                                  <Car className="mr-2 h-4 w-4" />
                                  View Details
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => router.push(`/dashboard/vehicles/${vehicle.id}/edit`)}>
                                  <Settings className="mr-2 h-4 w-4" />
                                  Edit Vehicle
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuLabel>Status Actions</DropdownMenuLabel>
                                {vehicle.status !== "available" && (
                                  <DropdownMenuItem onClick={() => handleStatusChange(vehicle, "available")}>
                                    <CheckCircle className="mr-2 h-4 w-4" />
                                    Mark as Available
                                  </DropdownMenuItem>
                                )}
                                {vehicle.status !== "rented" && (
                                  <DropdownMenuItem onClick={() => handleStatusChange(vehicle, "rented")}>
                                    <Calendar className="mr-2 h-4 w-4" />
                                    Mark as Rented
                                  </DropdownMenuItem>
                                )}
                                {vehicle.status !== "maintenance" && (
                                  <DropdownMenuItem onClick={() => handleStatusChange(vehicle, "maintenance")}>
                                    <Wrench className="mr-2 h-4 w-4" />
                                    Send to Maintenance
                                  </DropdownMenuItem>
                                )}
                                {vehicle.status !== "unavailable" && (
                                  <DropdownMenuItem onClick={() => handleStatusChange(vehicle, "unavailable")}>
                                    <AlertTriangle className="mr-2 h-4 w-4" />
                                    Mark as Unavailable
                                  </DropdownMenuItem>
                                )}
                                <DropdownMenuSeparator />
                                <DropdownMenuItem
                                  onClick={() => {
                                    setSelectedVehicle(vehicle)
                                    setIsServiceDialogOpen(true)
                                  }}
                                >
                                  <Wrench className="mr-2 h-4 w-4" />
                                  Add Service Record
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                  onClick={() => router.push(`/dashboard/vehicles/${vehicle.id}/maintenance-history`)}
                                >
                                  <FileText className="mr-2 h-4 w-4" />
                                  Maintenance History
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                  onClick={() => router.push(`/dashboard/vehicles/${vehicle.id}/booking-history`)}
                                >
                                  <Calendar className="mr-2 h-4 w-4" />
                                  Booking History
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={6} className="h-24 text-center">
                          No vehicles found.
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            </TabsContent>
            <TabsContent value="available">
              {/* Available vehicles content - similar to "all" but filtered */}
            </TabsContent>
            <TabsContent value="rented">{/* Rented vehicles content - similar to "all" but filtered */}</TabsContent>
            <TabsContent value="maintenance">
              {/* Maintenance vehicles content - similar to "all" but filtered */}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Add Vehicle Dialog */}
      <Dialog open={isAddVehicleDialogOpen} onOpenChange={setIsAddVehicleDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Add New Vehicle</DialogTitle>
            <DialogDescription>Enter the details of the new vehicle to add to your fleet.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Vehicle Name</Label>
                <Input
                  id="name"
                  value={newVehicle.name}
                  onChange={(e) => setNewVehicle({ ...newVehicle, name: e.target.value })}
                  placeholder="e.g. Toyota Corolla"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="type">Vehicle Type</Label>
                <Select
                  value={newVehicle.type}
                  onValueChange={(value) => setNewVehicle({ ...newVehicle, type: value })}
                >
                  <SelectTrigger id="type">
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="sedan">Sedan</SelectItem>
                    <SelectItem value="suv">SUV</SelectItem>
                    <SelectItem value="van">Van</SelectItem>
                    <SelectItem value="compact">Compact</SelectItem>
                    <SelectItem value="tuk-tuk">Tuk-Tuk</SelectItem>
                    <SelectItem value="motorcycle">Motorcycle</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="licensePlate">License Plate</Label>
                <Input
                  id="licensePlate"
                  value={newVehicle.licensePlate}
                  onChange={(e) => setNewVehicle({ ...newVehicle, licensePlate: e.target.value })}
                  placeholder="e.g. CAB-1234"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="dailyRate">Daily Rate (Rs.)</Label>
                <Input
                  id="dailyRate"
                  type="number"
                  value={newVehicle.dailyRate || ""}
                  onChange={(e) => setNewVehicle({ ...newVehicle, dailyRate: Number(e.target.value) })}
                  placeholder="e.g. 5000"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="fuelType">Fuel Type</Label>
                <Select
                  value={newVehicle.fuelType}
                  onValueChange={(value) => setNewVehicle({ ...newVehicle, fuelType: value })}
                >
                  <SelectTrigger id="fuelType">
                    <SelectValue placeholder="Select fuel type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="petrol">Petrol</SelectItem>
                    <SelectItem value="diesel">Diesel</SelectItem>
                    <SelectItem value="hybrid">Hybrid</SelectItem>
                    <SelectItem value="electric">Electric</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="transmission">Transmission</Label>
                <Select
                  value={newVehicle.transmission}
                  onValueChange={(value) => setNewVehicle({ ...newVehicle, transmission: value })}
                >
                  <SelectTrigger id="transmission">
                    <SelectValue placeholder="Select transmission" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="automatic">Automatic</SelectItem>
                    <SelectItem value="manual">Manual</SelectItem>
                    <SelectItem value="cvt">CVT</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="seats">Number of Seats</Label>
                <Input
                  id="seats"
                  type="number"
                  value={newVehicle.seats || ""}
                  onChange={(e) => setNewVehicle({ ...newVehicle, seats: Number(e.target.value) })}
                  placeholder="e.g. 5"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="mileage">Current Mileage (km)</Label>
                <Input
                  id="mileage"
                  type="number"
                  value={newVehicle.mileage || ""}
                  onChange={(e) => setNewVehicle({ ...newVehicle, mileage: Number(e.target.value) })}
                  placeholder="e.g. 45000"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="image">Vehicle Image</Label>
              <div className="flex items-center gap-4">
                <div className="h-20 w-32 relative rounded overflow-hidden border">
                  <Image
                    src={newVehicle.image || "/placeholder.svg"}
                    alt="Vehicle preview"
                    fill
                    className="object-cover"
                  />
                </div>
                <Button variant="outline" className="flex items-center gap-2">
                  <Upload className="h-4 w-4" />
                  Upload Image
                </Button>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddVehicleDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleAddVehicle} disabled={loading}>
              {loading ? "Adding..." : "Add Vehicle"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Maintenance Dialog */}
      <Dialog open={isMaintenanceDialogOpen} onOpenChange={setIsMaintenanceDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Send Vehicle to Maintenance</DialogTitle>
            <DialogDescription>
              {selectedVehicle &&
                `Enter maintenance details for ${selectedVehicle.name} (${selectedVehicle.licensePlate}).`}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="maintenanceType">Maintenance Type</Label>
              <Select value={maintenanceType} onValueChange={setMaintenanceType}>
                <SelectTrigger id="maintenanceType">
                  <SelectValue placeholder="Select maintenance type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="regular">Regular Service</SelectItem>
                  <SelectItem value="repair">Repair</SelectItem>
                  <SelectItem value="inspection">Inspection</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="estimatedDays">Estimated Days</Label>
              <Input
                id="estimatedDays"
                type="number"
                value={estimatedDays}
                onChange={(e) => setEstimatedDays(e.target.value)}
                placeholder="e.g. 3"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="maintenanceNotes">Notes</Label>
              <Textarea
                id="maintenanceNotes"
                value={maintenanceNotes}
                onChange={(e) => setMaintenanceNotes(e.target.value)}
                placeholder="Enter maintenance details..."
                rows={4}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsMaintenanceDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleMaintenanceSubmit} disabled={loading}>
              {loading ? "Submitting..." : "Submit"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Service Record Dialog */}
      <Dialog open={isServiceDialogOpen} onOpenChange={setIsServiceDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Add Service Record</DialogTitle>
            <DialogDescription>
              {selectedVehicle && `Add a service record for ${selectedVehicle.name} (${selectedVehicle.licensePlate}).`}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="serviceType">Service Type</Label>
              <Select
                value={serviceDetails.type}
                onValueChange={(value) => setServiceDetails({ ...serviceDetails, type: value })}
              >
                <SelectTrigger id="serviceType">
                  <SelectValue placeholder="Select service type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="oil_change">Oil Change</SelectItem>
                  <SelectItem value="tire_rotation">Tire Rotation</SelectItem>
                  <SelectItem value="brake_service">Brake Service</SelectItem>
                  <SelectItem value="air_filter">Air Filter Replacement</SelectItem>
                  <SelectItem value="full_service">Full Service</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="serviceDate">Service Date</Label>
              <Input
                id="serviceDate"
                type="date"
                value={serviceDetails.date}
                onChange={(e) => setServiceDetails({ ...serviceDetails, date: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="serviceCost">Cost (Rs.)</Label>
              <Input
                id="serviceCost"
                type="number"
                value={serviceDetails.cost || ""}
                onChange={(e) => setServiceDetails({ ...serviceDetails, cost: Number(e.target.value) })}
                placeholder="e.g. 5000"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="serviceNotes">Notes</Label>
              <Textarea
                id="serviceNotes"
                value={serviceDetails.notes}
                onChange={(e) => setServiceDetails({ ...serviceDetails, notes: e.target.value })}
                placeholder="Enter service details..."
                rows={3}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsServiceDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleAddService} disabled={loading}>
              {loading ? "Adding..." : "Add Service Record"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
