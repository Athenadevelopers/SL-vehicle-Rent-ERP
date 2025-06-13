"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Search, MoreHorizontal, Calendar, CheckCircle, AlertTriangle, Clock } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { DatePicker } from "@/components/ui/date-picker"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/components/ui/use-toast"
import { useAuth } from "@/lib/auth-provider"
import { format, addDays, isBefore, isAfter } from "date-fns"
import {
  getVehicles,
  scheduleVehicleMaintenance,
  completeVehicleMaintenance,
  updateVehicle,
  type Vehicle,
} from "@/lib/firebase-db"

export default function MaintenancePage() {
  const router = useRouter()
  const { toast } = useToast()
  const { user } = useAuth()
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [vehicles, setVehicles] = useState<Vehicle[]>([])
  const [loading, setLoading] = useState(true)

  // Maintenance scheduling
  const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | null>(null)
  const [maintenanceDate, setMaintenanceDate] = useState<Date>(addDays(new Date(), 1))
  const [maintenanceNotes, setMaintenanceNotes] = useState("")
  const [isScheduling, setIsScheduling] = useState(false)
  const [isCompleting, setIsCompleting] = useState(false)
  const [completionNotes, setCompletionNotes] = useState("")
  const [showScheduleDialog, setShowScheduleDialog] = useState(false)
  const [showCompleteDialog, setShowCompleteDialog] = useState(false)

  useEffect(() => {
    if (!user) return

    const fetchVehicles = async () => {
      try {
        const vehiclesData = await getVehicles()
        setVehicles(vehiclesData)
      } catch (error) {
        console.error("Error fetching vehicles:", error)
        toast({
          title: "Error loading vehicles",
          description: "There was an error loading the vehicles. Please try again.",
          variant: "destructive",
        })
      } finally {
        setLoading(false)
      }
    }

    fetchVehicles()
  }, [user, toast])

  const filteredVehicles = vehicles.filter((vehicle) => {
    // Apply search filter
    const matchesSearch =
      vehicle.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      vehicle.licensePlate.toLowerCase().includes(searchQuery.toLowerCase()) ||
      vehicle.type.toLowerCase().includes(searchQuery.toLowerCase())

    // Apply status filter
    let matchesStatus = true
    if (statusFilter === "due") {
      matchesStatus = vehicle.nextMaintenance && isBefore(vehicle.nextMaintenance.toDate(), new Date())
    } else if (statusFilter === "upcoming") {
      matchesStatus =
        vehicle.nextMaintenance &&
        isAfter(vehicle.nextMaintenance.toDate(), new Date()) &&
        isBefore(vehicle.nextMaintenance.toDate(), addDays(new Date(), 30))
    } else if (statusFilter === "maintenance") {
      matchesStatus = vehicle.status === "maintenance"
    } else if (statusFilter !== "all") {
      matchesStatus = vehicle.status === statusFilter
    }

    return matchesSearch && matchesStatus
  })

  const getMaintenanceStatus = (vehicle: Vehicle) => {
    if (vehicle.status === "maintenance") {
      return (
        <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">
          In Maintenance
        </Badge>
      )
    }

    if (!vehicle.nextMaintenance) {
      return (
        <Badge variant="outline" className="bg-gray-50 text-gray-700 border-gray-200">
          Not Scheduled
        </Badge>
      )
    }

    const nextDate = vehicle.nextMaintenance.toDate()
    const today = new Date()

    if (isBefore(nextDate, today)) {
      return (
        <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">
          Overdue
        </Badge>
      )
    }

    if (isBefore(nextDate, addDays(today, 7))) {
      return (
        <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200">
          Due Soon
        </Badge>
      )
    }

    if (isBefore(nextDate, addDays(today, 30))) {
      return (
        <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
          Upcoming
        </Badge>
      )
    }

    return (
      <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
        Scheduled
      </Badge>
    )
  }

  const handleScheduleMaintenance = async () => {
    if (!selectedVehicle) return

    try {
      setIsScheduling(true)

      // Update vehicle status to maintenance if the date is today
      const isToday = new Date().toDateString() === maintenanceDate.toDateString()

      if (isToday) {
        await updateVehicle(selectedVehicle.id, {
          status: "maintenance",
          nextMaintenance: null,
        })

        toast({
          title: "Vehicle marked for maintenance",
          description: `${selectedVehicle.name} has been marked as in maintenance.`,
        })
      } else {
        await scheduleVehicleMaintenance(selectedVehicle.id, maintenanceDate)

        toast({
          title: "Maintenance scheduled",
          description: `Maintenance for ${selectedVehicle.name} has been scheduled for ${format(maintenanceDate, "dd MMM yyyy")}.`,
        })
      }

      // Refresh vehicles list
      const updatedVehicles = await getVehicles()
      setVehicles(updatedVehicles)

      // Reset form
      setSelectedVehicle(null)
      setMaintenanceDate(addDays(new Date(), 1))
      setMaintenanceNotes("")
      setShowScheduleDialog(false)
    } catch (error) {
      console.error("Error scheduling maintenance:", error)
      toast({
        title: "Error scheduling maintenance",
        description: "There was an error scheduling the maintenance. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsScheduling(false)
    }
  }

  const handleCompleteMaintenance = async () => {
    if (!selectedVehicle) return

    try {
      setIsCompleting(true)

      await completeVehicleMaintenance(selectedVehicle.id, completionNotes)

      toast({
        title: "Maintenance completed",
        description: `Maintenance for ${selectedVehicle.name} has been marked as completed.`,
      })

      // Refresh vehicles list
      const updatedVehicles = await getVehicles()
      setVehicles(updatedVehicles)

      // Reset form
      setSelectedVehicle(null)
      setCompletionNotes("")
      setShowCompleteDialog(false)
    } catch (error) {
      console.error("Error completing maintenance:", error)
      toast({
        title: "Error completing maintenance",
        description: "There was an error marking the maintenance as completed. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsCompleting(false)
    }
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Vehicle Maintenance</h1>
        <Button className="bg-primary hover:bg-primary/90" onClick={() => setShowScheduleDialog(true)}>
          <Calendar className="mr-2 h-4 w-4" />
          Schedule Maintenance
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Maintenance Schedule</CardTitle>
          <CardDescription>View and manage vehicle maintenance schedules.</CardDescription>
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
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Vehicles</SelectItem>
                  <SelectItem value="due">Maintenance Due</SelectItem>
                  <SelectItem value="upcoming">Upcoming Maintenance</SelectItem>
                  <SelectItem value="maintenance">In Maintenance</SelectItem>
                  <SelectItem value="available">Available</SelectItem>
                  <SelectItem value="rented">Rented</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <Tabs defaultValue="all" className="mt-6">
            <TabsList>
              <TabsTrigger value="all">All Vehicles</TabsTrigger>
              <TabsTrigger value="due">Due Maintenance</TabsTrigger>
              <TabsTrigger value="history">Maintenance History</TabsTrigger>
            </TabsList>
            <TabsContent value="all" className="mt-4">
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Vehicle</TableHead>
                      <TableHead>License Plate</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Last Maintenance</TableHead>
                      <TableHead>Next Maintenance</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {loading ? (
                      <TableRow>
                        <TableCell colSpan={7} className="h-24 text-center">
                          <div className="flex justify-center items-center h-full">
                            <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
                          </div>
                        </TableCell>
                      </TableRow>
                    ) : filteredVehicles.length > 0 ? (
                      filteredVehicles.map((vehicle) => (
                        <TableRow key={vehicle.id}>
                          <TableCell className="font-medium">{vehicle.name}</TableCell>
                          <TableCell>{vehicle.licensePlate}</TableCell>
                          <TableCell>{vehicle.type}</TableCell>
                          <TableCell>
                            {vehicle.lastMaintenance
                              ? format(vehicle.lastMaintenance.toDate(), "dd MMM yyyy")
                              : "No record"}
                          </TableCell>
                          <TableCell>
                            {vehicle.nextMaintenance
                              ? format(vehicle.nextMaintenance.toDate(), "dd MMM yyyy")
                              : "Not scheduled"}
                          </TableCell>
                          <TableCell>{getMaintenanceStatus(vehicle)}</TableCell>
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
                                <DropdownMenuItem
                                  onClick={() => {
                                    setSelectedVehicle(vehicle)
                                    setShowScheduleDialog(true)
                                  }}
                                >
                                  <Calendar className="mr-2 h-4 w-4" />
                                  Schedule Maintenance
                                </DropdownMenuItem>
                                {vehicle.status === "maintenance" && (
                                  <DropdownMenuItem
                                    onClick={() => {
                                      setSelectedVehicle(vehicle)
                                      setShowCompleteDialog(true)
                                    }}
                                  >
                                    <CheckCircle className="mr-2 h-4 w-4" />
                                    Complete Maintenance
                                  </DropdownMenuItem>
                                )}
                                <DropdownMenuSeparator />
                                <DropdownMenuItem onClick={() => router.push(`/dashboard/vehicles/${vehicle.id}`)}>
                                  <Clock className="mr-2 h-4 w-4" />
                                  View Maintenance History
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={7} className="h-24 text-center">
                          No vehicles found.
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            </TabsContent>
            <TabsContent value="due" className="mt-4">
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Vehicle</TableHead>
                      <TableHead>License Plate</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Last Maintenance</TableHead>
                      <TableHead>Next Maintenance</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {!loading ? (
                      vehicles
                        .filter((v) => v.nextMaintenance && isBefore(v.nextMaintenance.toDate(), new Date()))
                        .map((vehicle) => (
                          <TableRow key={vehicle.id}>
                            <TableCell className="font-medium">{vehicle.name}</TableCell>
                            <TableCell>{vehicle.licensePlate}</TableCell>
                            <TableCell>{vehicle.type}</TableCell>
                            <TableCell>
                              {vehicle.lastMaintenance
                                ? format(vehicle.lastMaintenance.toDate(), "dd MMM yyyy")
                                : "No record"}
                            </TableCell>
                            <TableCell>
                              <span className="text-destructive font-medium">
                                {format(vehicle.nextMaintenance!.toDate(), "dd MMM yyyy")}
                              </span>
                            </TableCell>
                            <TableCell>
                              <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">
                                Overdue
                              </Badge>
                            </TableCell>
                            <TableCell className="text-right">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => {
                                  setSelectedVehicle(vehicle)
                                  setMaintenanceDate(new Date())
                                  setShowScheduleDialog(true)
                                }}
                              >
                                <AlertTriangle className="mr-2 h-4 w-4 text-destructive" />
                                Start Maintenance
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={7} className="h-24 text-center">
                          <div className="flex justify-center items-center h-full">
                            <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
                          </div>
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            </TabsContent>
            <TabsContent value="history" className="mt-4">
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Vehicle</TableHead>
                      <TableHead>License Plate</TableHead>
                      <TableHead>Maintenance Date</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Notes</TableHead>
                      <TableHead>Performed By</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {/* In a real app, you would fetch maintenance history records */}
                    <TableRow>
                      <TableCell colSpan={7} className="h-24 text-center">
                        Maintenance history records will be displayed here.
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Schedule Maintenance Dialog */}
      <Dialog open={showScheduleDialog} onOpenChange={setShowScheduleDialog}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Schedule Maintenance</DialogTitle>
            <DialogDescription>
              Schedule maintenance for a vehicle. The vehicle will be marked as unavailable during maintenance.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="vehicle">Select Vehicle</Label>
              <Select
                value={selectedVehicle?.id || ""}
                onValueChange={(value) => {
                  const vehicle = vehicles.find((v) => v.id === value)
                  setSelectedVehicle(vehicle || null)
                }}
              >
                <SelectTrigger id="vehicle">
                  <SelectValue placeholder="Select a vehicle" />
                </SelectTrigger>
                <SelectContent>
                  {vehicles.map((vehicle) => (
                    <SelectItem key={vehicle.id} value={vehicle.id}>
                      {vehicle.name} - {vehicle.licensePlate}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="maintenance-date">Maintenance Date</Label>
              <DatePicker
                id="maintenance-date"
                date={maintenanceDate}
                onDateChange={setMaintenanceDate}
                minDate={new Date()}
              />
              <p className="text-sm text-muted-foreground">
                {maintenanceDate.toDateString() === new Date().toDateString()
                  ? "Vehicle will be marked as in maintenance immediately."
                  : "Vehicle will be scheduled for maintenance on this date."}
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="maintenance-notes">Notes</Label>
              <Textarea
                id="maintenance-notes"
                placeholder="Enter maintenance details or instructions"
                value={maintenanceNotes}
                onChange={(e) => setMaintenanceNotes(e.target.value)}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowScheduleDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleScheduleMaintenance} disabled={!selectedVehicle || isScheduling}>
              {isScheduling ? (
                <>
                  <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-background border-t-transparent"></div>
                  Scheduling...
                </>
              ) : (
                "Schedule Maintenance"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Complete Maintenance Dialog */}
      <Dialog open={showCompleteDialog} onOpenChange={setShowCompleteDialog}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Complete Maintenance</DialogTitle>
            <DialogDescription>
              Mark the vehicle maintenance as completed. The vehicle will be available for booking again.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            {selectedVehicle && (
              <div className="rounded-lg border p-4 space-y-3">
                <div className="flex justify-between">
                  <span className="font-medium">Vehicle:</span>
                  <span>{selectedVehicle.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium">License Plate:</span>
                  <span>{selectedVehicle.licensePlate}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium">Type:</span>
                  <span>{selectedVehicle.type}</span>
                </div>
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="completion-notes">Maintenance Notes</Label>
              <Textarea
                id="completion-notes"
                placeholder="Enter details about the maintenance performed"
                value={completionNotes}
                onChange={(e) => setCompletionNotes(e.target.value)}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowCompleteDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleCompleteMaintenance} disabled={!selectedVehicle || isCompleting}>
              {isCompleting ? (
                <>
                  <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-background border-t-transparent"></div>
                  Completing...
                </>
              ) : (
                "Complete Maintenance"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
