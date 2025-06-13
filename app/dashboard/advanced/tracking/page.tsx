"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { getVehicles, getVehicleLocation } from "@/lib/firebase-db"
import { Car, MapPin, Navigation, LocateFixed, Clock, Fuel, AlertTriangle } from "lucide-react"

type Vehicle = {
  id: string
  name: string
  licensePlate: string
  status: "available" | "rented" | "maintenance"
  type: string
}

type VehicleLocation = {
  lat: number
  lng: number
  timestamp: number
  speed: number
  heading: number
  fuelLevel: number
  driverName?: string
  address?: string
}

export default function FleetTrackingPage() {
  const [vehicles, setVehicles] = useState<Vehicle[]>([])
  const [selectedVehicle, setSelectedVehicle] = useState<string | null>(null)
  const [vehicleLocation, setVehicleLocation] = useState<VehicleLocation | null>(null)
  const [loading, setLoading] = useState(true)
  const [mapLoaded, setMapLoaded] = useState(false)

  useEffect(() => {
    const fetchVehicles = async () => {
      try {
        const data = await getVehicles()
        setVehicles(data)
        if (data.length > 0) {
          setSelectedVehicle(data[0].id)
        }
      } catch (error) {
        console.error("Error fetching vehicles:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchVehicles()
  }, [])

  useEffect(() => {
    if (selectedVehicle) {
      const fetchLocation = async () => {
        try {
          const location = await getVehicleLocation(selectedVehicle)
          setVehicleLocation(location)
          setMapLoaded(true)
        } catch (error) {
          console.error("Error fetching vehicle location:", error)
        }
      }

      fetchLocation()

      // Set up polling for real-time updates
      const interval = setInterval(fetchLocation, 30000) // Update every 30 seconds
      return () => clearInterval(interval)
    }
  }, [selectedVehicle])

  // Mock data for demonstration
  const mockVehicles: Vehicle[] = [
    {
      id: "v1",
      name: "Toyota Corolla",
      licensePlate: "CAB-1234",
      status: "rented",
      type: "car",
    },
    {
      id: "v2",
      name: "Honda Civic",
      licensePlate: "CAC-5678",
      status: "rented",
      type: "car",
    },
    {
      id: "v3",
      name: "Toyota HiAce",
      licensePlate: "VAB-3456",
      status: "rented",
      type: "van",
    },
  ]

  const mockLocation: VehicleLocation = {
    lat: 6.9271,
    lng: 79.8612,
    timestamp: Date.now(),
    speed: 45,
    heading: 90,
    fuelLevel: 65,
    driverName: "Amal Perera",
    address: "Galle Road, Colombo 03, Sri Lanka",
  }

  const displayVehicles = vehicles.length > 0 ? vehicles : mockVehicles
  const displayLocation = vehicleLocation || mockLocation
  const selectedVehicleData = displayVehicles.find((v) => v.id === selectedVehicle)

  const formatTimestamp = (timestamp: number) => {
    return new Date(timestamp).toLocaleString()
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "available":
        return "outline"
      case "rented":
        return "default"
      case "maintenance":
        return "secondary"
      default:
        return "default"
    }
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
        <h1 className="text-3xl font-bold">Fleet Tracking</h1>
        <Button className="bg-primary hover:bg-primary/90">
          <Navigation className="mr-2 h-4 w-4" />
          Track All Vehicles
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <Card className="md:col-span-1">
          <CardHeader>
            <CardTitle>Vehicle Selection</CardTitle>
            <CardDescription>Select a vehicle to track its location.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Select value={selectedVehicle || ""} onValueChange={setSelectedVehicle}>
              <SelectTrigger>
                <SelectValue placeholder="Select a vehicle" />
              </SelectTrigger>
              <SelectContent>
                {displayVehicles
                  .filter((vehicle) => vehicle.status === "rented")
                  .map((vehicle) => (
                    <SelectItem key={vehicle.id} value={vehicle.id}>
                      {vehicle.name} ({vehicle.licensePlate})
                    </SelectItem>
                  ))}
              </SelectContent>
            </Select>

            {selectedVehicleData && (
              <div className="space-y-4 mt-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Car className="h-5 w-5 text-primary" />
                    <span className="font-medium">{selectedVehicleData.name}</span>
                  </div>
                  <Badge variant={getStatusColor(selectedVehicleData.status)}>{selectedVehicleData.status}</Badge>
                </div>
                <div className="text-sm text-muted-foreground">
                  <p>License Plate: {selectedVehicleData.licensePlate}</p>
                  <p>Type: {selectedVehicleData.type.charAt(0).toUpperCase() + selectedVehicleData.type.slice(1)}</p>
                  {displayLocation.driverName && <p>Driver: {displayLocation.driverName}</p>}
                </div>

                <div className="space-y-2 border-t pt-4">
                  <h4 className="text-sm font-medium">Current Location</h4>
                  <div className="flex items-center gap-2 text-sm">
                    <MapPin className="h-4 w-4 text-primary" />
                    <span>{displayLocation.address || "Location data not available"}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    <span>Last updated: {formatTimestamp(displayLocation.timestamp)}</span>
                  </div>
                </div>

                <div className="space-y-2 border-t pt-4">
                  <h4 className="text-sm font-medium">Vehicle Status</h4>
                  <div className="grid grid-cols-2 gap-2">
                    <div className="flex items-center gap-2 text-sm">
                      <Navigation className="h-4 w-4 text-muted-foreground" />
                      <span>Speed: {displayLocation.speed} km/h</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <LocateFixed className="h-4 w-4 text-muted-foreground" />
                      <span>Heading: {displayLocation.heading}°</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Fuel className="h-4 w-4 text-muted-foreground" />
                      <span>Fuel: {displayLocation.fuelLevel}%</span>
                    </div>
                    {displayLocation.fuelLevel < 20 && (
                      <div className="flex items-center gap-2 text-sm text-destructive">
                        <AlertTriangle className="h-4 w-4" />
                        <span>Low Fuel</span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex justify-between pt-4">
                  <Button variant="outline" size="sm">
                    View History
                  </Button>
                  <Button size="sm" className="bg-primary hover:bg-primary/90">
                    Contact Driver
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Live Map</CardTitle>
            <CardDescription>Real-time location tracking of selected vehicle.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="relative h-[500px] w-full rounded-md border bg-muted">
              {mapLoaded ? (
                <div className="absolute inset-0 flex items-center justify-center">
                  <p className="text-muted-foreground">
                    Map would be displayed here with vehicle location at coordinates: {displayLocation.lat.toFixed(4)},{" "}
                    {displayLocation.lng.toFixed(4)}
                  </p>
                </div>
              ) : (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Active Fleet Overview</CardTitle>
          <CardDescription>Current status of all active vehicles in your fleet.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {displayVehicles
              .filter((vehicle) => vehicle.status === "rented")
              .map((vehicle) => (
                <div
                  key={vehicle.id}
                  className={`rounded-lg border p-4 ${
                    selectedVehicle === vehicle.id ? "border-primary bg-primary/5" : ""
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Car className="h-5 w-5 text-primary" />
                      <span className="font-medium">{vehicle.name}</span>
                    </div>
                    <Badge variant={getStatusColor(vehicle.status)}>{vehicle.status}</Badge>
                  </div>
                  <p className="mt-1 text-sm text-muted-foreground">{vehicle.licensePlate}</p>
                  <div className="mt-2 flex items-center gap-2 text-sm">
                    <MapPin className="h-4 w-4 text-primary" />
                    <span>Colombo, Sri Lanka</span>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    className="mt-4 w-full"
                    onClick={() => setSelectedVehicle(vehicle.id)}
                  >
                    {selectedVehicle === vehicle.id ? "Currently Tracking" : "Track Vehicle"}
                  </Button>
                </div>
              ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
