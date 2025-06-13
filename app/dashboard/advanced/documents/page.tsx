"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
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
import { Textarea } from "@/components/ui/textarea"
import {
  Search,
  Plus,
  FileText,
  Download,
  Eye,
  FileEdit,
  Trash2,
  Upload,
  AlertTriangle,
  Calendar,
  Car,
  Users,
  FileCheck,
} from "lucide-react"
import { format, addDays, addMonths, isBefore, parseISO } from "date-fns"
import { useToast } from "@/components/ui/use-toast"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Calendar as CalendarComponent } from "@/components/ui/calendar"
import { cn } from "@/lib/utils"

type DocumentType =
  | "vehicle_registration"
  | "insurance"
  | "maintenance"
  | "driver_license"
  | "contract"
  | "invoice"
  | "receipt"
  | "other"

interface Document {
  id: string
  name: string
  type: DocumentType
  relatedTo: string
  relatedType: "vehicle" | "customer" | "booking" | "company"
  expiryDate?: string
  uploadDate: string
  fileSize: string
  fileType: string
  status: "active" | "expired" | "expiring_soon"
  notes?: string
  url: string
}

export default function DocumentsPage() {
  const [documents, setDocuments] = useState<Document[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [filterType, setFilterType] = useState("all")
  const [filterStatus, setFilterStatus] = useState("all")
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [newDocument, setNewDocument] = useState<Partial<Document>>({
    name: "",
    type: "vehicle_registration",
    relatedTo: "",
    relatedType: "vehicle",
    notes: "",
    fileType: "pdf",
  })
  const [expiryDate, setExpiryDate] = useState<Date | undefined>(undefined)
  const { toast } = useToast()

  useEffect(() => {
    const fetchDocuments = async () => {
      setLoading(true)
      try {
        // In a real app, this would fetch from Firebase
        // For now, we'll use mock data
        const mockDocuments: Document[] = [
          {
            id: "doc1",
            name: "Toyota Corolla Registration",
            type: "vehicle_registration",
            relatedTo: "Toyota Corolla (CAB-1234)",
            relatedType: "vehicle",
            expiryDate: format(addMonths(new Date(), 3), "yyyy-MM-dd"),
            uploadDate: format(addDays(new Date(), -30), "yyyy-MM-dd"),
            fileSize: "1.2 MB",
            fileType: "pdf",
            status: "active",
            notes: "Annual registration document",
            url: "#",
          },
          {
            id: "doc2",
            name: "Honda Civic Insurance",
            type: "insurance",
            relatedTo: "Honda Civic (CAC-5678)",
            relatedType: "vehicle",
            expiryDate: format(addDays(new Date(), 5), "yyyy-MM-dd"),
            uploadDate: format(addDays(new Date(), -60), "yyyy-MM-dd"),
            fileSize: "2.5 MB",
            fileType: "pdf",
            status: "expiring_soon",
            notes: "Comprehensive insurance policy",
            url: "#",
          },
          {
            id: "doc3",
            name: "Amal Perera Driver License",
            type: "driver_license",
            relatedTo: "Amal Perera",
            relatedType: "customer",
            expiryDate: format(addMonths(new Date(), 8), "yyyy-MM-dd"),
            uploadDate: format(addDays(new Date(), -15), "yyyy-MM-dd"),
            fileSize: "0.8 MB",
            fileType: "jpg",
            status: "active",
            url: "#",
          },
          {
            id: "doc4",
            name: "Toyota HiAce Maintenance Record",
            type: "maintenance",
            relatedTo: "Toyota HiAce (VAB-3456)",
            relatedType: "vehicle",
            uploadDate: format(addDays(new Date(), -7), "yyyy-MM-dd"),
            fileSize: "1.5 MB",
            fileType: "pdf",
            status: "active",
            notes: "Regular maintenance service record",
            url: "#",
          },
          {
            id: "doc5",
            name: "Rental Contract - Nimal Silva",
            type: "contract",
            relatedTo: "Booking #B12345",
            relatedType: "booking",
            expiryDate: format(addDays(new Date(), -2), "yyyy-MM-dd"),
            uploadDate: format(addDays(new Date(), -10), "yyyy-MM-dd"),
            fileSize: "1.1 MB",
            fileType: "pdf",
            status: "expired",
            notes: "Signed rental agreement",
            url: "#",
          },
          {
            id: "doc6",
            name: "Company Registration",
            type: "other",
            relatedTo: "SL Vehicle Rental",
            relatedType: "company",
            expiryDate: format(addMonths(new Date(), 10), "yyyy-MM-dd"),
            uploadDate: format(addDays(new Date(), -90), "yyyy-MM-dd"),
            fileSize: "3.2 MB",
            fileType: "pdf",
            status: "active",
            notes: "Company registration certificate",
            url: "#",
          },
          {
            id: "doc7",
            name: "Invoice #INV-2023-056",
            type: "invoice",
            relatedTo: "Booking #B12346",
            relatedType: "booking",
            uploadDate: format(addDays(new Date(), -5), "yyyy-MM-dd"),
            fileSize: "0.5 MB",
            fileType: "pdf",
            status: "active",
            url: "#",
          },
        ]

        setDocuments(mockDocuments)
      } catch (error) {
        console.error("Error fetching documents:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchDocuments()
  }, [])

  const handleAddDocument = () => {
    const newDoc: Document = {
      id: `doc${documents.length + 1}`,
      name: newDocument.name || "",
      type: (newDocument.type as DocumentType) || "other",
      relatedTo: newDocument.relatedTo || "",
      relatedType: (newDocument.relatedType as "vehicle" | "customer" | "booking" | "company") || "vehicle",
      expiryDate: expiryDate ? format(expiryDate, "yyyy-MM-dd") : undefined,
      uploadDate: format(new Date(), "yyyy-MM-dd"),
      fileSize: "1.0 MB", // Mock file size
      fileType: newDocument.fileType || "pdf",
      status: expiryDate && isBefore(expiryDate, addDays(new Date(), 7)) ? "expiring_soon" : "active",
      notes: newDocument.notes,
      url: "#", // Mock URL
    }

    setDocuments([newDoc, ...documents])
    setIsAddDialogOpen(false)
    setNewDocument({
      name: "",
      type: "vehicle_registration",
      relatedTo: "",
      relatedType: "vehicle",
      notes: "",
      fileType: "pdf",
    })
    setExpiryDate(undefined)

    toast({
      title: "Document added",
      description: "The document has been added successfully.",
    })
  }

  const handleDeleteDocument = (id: string) => {
    setDocuments(documents.filter((doc) => doc.id !== id))
    toast({
      title: "Document deleted",
      description: "The document has been deleted successfully.",
    })
  }

  const getDocumentTypeIcon = (type: DocumentType) => {
    switch (type) {
      case "vehicle_registration":
        return <Car className="h-4 w-4" />
      case "insurance":
        return <FileCheck className="h-4 w-4" />
      case "maintenance":
        return <FileText className="h-4 w-4" />
      case "driver_license":
        return <Users className="h-4 w-4" />
      case "contract":
        return <FileText className="h-4 w-4" />
      case "invoice":
        return <FileText className="h-4 w-4" />
      case "receipt":
        return <FileText className="h-4 w-4" />
      default:
        return <FileText className="h-4 w-4" />
    }
  }

  const getDocumentStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return (
          <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
            Active
          </Badge>
        )
      case "expired":
        return (
          <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">
            Expired
          </Badge>
        )
      case "expiring_soon":
        return (
          <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">
            Expiring Soon
          </Badge>
        )
      default:
        return <Badge variant="outline">Unknown</Badge>
    }
  }

  const filteredDocuments = documents.filter((document) => {
    const matchesSearch =
      document.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      document.relatedTo.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesType = filterType === "all" || document.type === filterType
    const matchesStatus = filterStatus === "all" || document.status === filterStatus

    return matchesSearch && matchesType && matchesStatus
  })

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
        <h1 className="text-3xl font-bold">Document Management</h1>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-primary hover:bg-primary/90">
              <Plus className="mr-2 h-4 w-4" />
              Upload Document
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>Upload New Document</DialogTitle>
              <DialogDescription>Upload a new document to the system.</DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Document Name</Label>
                  <Input
                    id="name"
                    value={newDocument.name}
                    onChange={(e) => setNewDocument({ ...newDocument, name: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="type">Document Type</Label>
                  <Select
                    value={newDocument.type}
                    onValueChange={(value) => setNewDocument({ ...newDocument, type: value as DocumentType })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="vehicle_registration">Vehicle Registration</SelectItem>
                      <SelectItem value="insurance">Insurance</SelectItem>
                      <SelectItem value="maintenance">Maintenance Record</SelectItem>
                      <SelectItem value="driver_license">Driver License</SelectItem>
                      <SelectItem value="contract">Contract</SelectItem>
                      <SelectItem value="invoice">Invoice</SelectItem>
                      <SelectItem value="receipt">Receipt</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="relatedType">Related To</Label>
                  <Select
                    value={newDocument.relatedType}
                    onValueChange={(value) =>
                      setNewDocument({
                        ...newDocument,
                        relatedType: value as "vehicle" | "customer" | "booking" | "company",
                      })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select related type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="vehicle">Vehicle</SelectItem>
                      <SelectItem value="customer">Customer</SelectItem>
                      <SelectItem value="booking">Booking</SelectItem>
                      <SelectItem value="company">Company</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="relatedTo">Related Entity</Label>
                  <Input
                    id="relatedTo"
                    value={newDocument.relatedTo}
                    onChange={(e) => setNewDocument({ ...newDocument, relatedTo: e.target.value })}
                    placeholder="e.g., Vehicle ID, Customer Name"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="expiryDate">Expiry Date (if applicable)</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full justify-start text-left font-normal",
                          !expiryDate && "text-muted-foreground",
                        )}
                      >
                        <Calendar className="mr-2 h-4 w-4" />
                        {expiryDate ? format(expiryDate, "PPP") : <span>Pick a date</span>}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <CalendarComponent mode="single" selected={expiryDate} onSelect={setExpiryDate} initialFocus />
                    </PopoverContent>
                  </Popover>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="fileType">File Type</Label>
                  <Select
                    value={newDocument.fileType}
                    onValueChange={(value) => setNewDocument({ ...newDocument, fileType: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select file type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pdf">PDF</SelectItem>
                      <SelectItem value="jpg">JPG</SelectItem>
                      <SelectItem value="png">PNG</SelectItem>
                      <SelectItem value="doc">DOC</SelectItem>
                      <SelectItem value="xls">XLS</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="notes">Notes</Label>
                <Textarea
                  id="notes"
                  value={newDocument.notes}
                  onChange={(e) => setNewDocument({ ...newDocument, notes: e.target.value })}
                  placeholder="Add any additional notes about this document"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="file">Upload File</Label>
                <div className="flex items-center justify-center w-full">
                  <label
                    htmlFor="file-upload"
                    className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 dark:bg-gray-800 dark:border-gray-600 dark:hover:bg-gray-700"
                  >
                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                      <Upload className="w-8 h-8 mb-3 text-gray-400" />
                      <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
                        <span className="font-semibold">Click to upload</span> or drag and drop
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">PDF, JPG, PNG, DOC, XLS (MAX. 10MB)</p>
                    </div>
                    <input id="file-upload" type="file" className="hidden" />
                  </label>
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleAddDocument} className="bg-primary hover:bg-primary/90">
                Upload Document
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Documents</CardTitle>
          <CardDescription>Manage all documents related to vehicles, customers, and bookings.</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="all" className="mb-6">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <TabsList>
                <TabsTrigger value="all">All Documents</TabsTrigger>
                <TabsTrigger value="vehicle">Vehicle</TabsTrigger>
                <TabsTrigger value="customer">Customer</TabsTrigger>
                <TabsTrigger value="expiring">Expiring Soon</TabsTrigger>
              </TabsList>
              <div className="flex flex-col gap-4 sm:flex-row">
                <div className="flex w-full max-w-sm items-center space-x-2">
                  <Search className="h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search documents..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full"
                  />
                </div>
                <Select value={filterType} onValueChange={setFilterType}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Filter by type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Types</SelectItem>
                    <SelectItem value="vehicle_registration">Registration</SelectItem>
                    <SelectItem value="insurance">Insurance</SelectItem>
                    <SelectItem value="maintenance">Maintenance</SelectItem>
                    <SelectItem value="driver_license">Driver License</SelectItem>
                    <SelectItem value="contract">Contract</SelectItem>
                    <SelectItem value="invoice">Invoice</SelectItem>
                    <SelectItem value="receipt">Receipt</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={filterStatus} onValueChange={setFilterStatus}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Filter by status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="expired">Expired</SelectItem>
                    <SelectItem value="expiring_soon">Expiring Soon</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <TabsContent value="all">
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Related To</TableHead>
                      <TableHead>Upload Date</TableHead>
                      <TableHead>Expiry Date</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredDocuments.length > 0 ? (
                      filteredDocuments.map((document) => (
                        <TableRow key={document.id}>
                          <TableCell className="font-medium">
                            <div className="flex items-center gap-2">
                              {getDocumentTypeIcon(document.type)}
                              <span>{document.name}</span>
                            </div>
                          </TableCell>
                          <TableCell>
                            {document.type.charAt(0).toUpperCase() + document.type.slice(1).replace("_", " ")}
                          </TableCell>
                          <TableCell>{document.relatedTo}</TableCell>
                          <TableCell>{format(parseISO(document.uploadDate), "MMM dd, yyyy")}</TableCell>
                          <TableCell>
                            {document.expiryDate ? format(parseISO(document.expiryDate), "MMM dd, yyyy") : "N/A"}
                          </TableCell>
                          <TableCell>{getDocumentStatusBadge(document.status)}</TableCell>
                          <TableCell className="text-right">
                            <div className="flex justify-end gap-2">
                              <Button variant="ghost" size="icon">
                                <Eye className="h-4 w-4" />
                                <span className="sr-only">View</span>
                              </Button>
                              <Button variant="ghost" size="icon">
                                <Download className="h-4 w-4" />
                                <span className="sr-only">Download</span>
                              </Button>
                              <Button variant="ghost" size="icon">
                                <FileEdit className="h-4 w-4" />
                                <span className="sr-only">Edit</span>
                              </Button>
                              <Button variant="ghost" size="icon" onClick={() => handleDeleteDocument(document.id)}>
                                <Trash2 className="h-4 w-4" />
                                <span className="sr-only">Delete</span>
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={7} className="h-24 text-center">
                          No documents found.
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            </TabsContent>

            <TabsContent value="vehicle">
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Vehicle</TableHead>
                      <TableHead>Upload Date</TableHead>
                      <TableHead>Expiry Date</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredDocuments.filter((d) => d.relatedType === "vehicle").length > 0 ? (
                      filteredDocuments
                        .filter((d) => d.relatedType === "vehicle")
                        .map((document) => (
                          <TableRow key={document.id}>
                            <TableCell className="font-medium">
                              <div className="flex items-center gap-2">
                                {getDocumentTypeIcon(document.type)}
                                <span>{document.name}</span>
                              </div>
                            </TableCell>
                            <TableCell>
                              {document.type.charAt(0).toUpperCase() + document.type.slice(1).replace("_", " ")}
                            </TableCell>
                            <TableCell>{document.relatedTo}</TableCell>
                            <TableCell>{format(parseISO(document.uploadDate), "MMM dd, yyyy")}</TableCell>
                            <TableCell>
                              {document.expiryDate ? format(parseISO(document.expiryDate), "MMM dd, yyyy") : "N/A"}
                            </TableCell>
                            <TableCell>{getDocumentStatusBadge(document.status)}</TableCell>
                            <TableCell className="text-right">
                              <div className="flex justify-end gap-2">
                                <Button variant="ghost" size="icon">
                                  <Eye className="h-4 w-4" />
                                  <span className="sr-only">View</span>
                                </Button>
                                <Button variant="ghost" size="icon">
                                  <Download className="h-4 w-4" />
                                  <span className="sr-only">Download</span>
                                </Button>
                                <Button variant="ghost" size="icon">
                                  <FileEdit className="h-4 w-4" />
                                  <span className="sr-only">Edit</span>
                                </Button>
                                <Button variant="ghost" size="icon" onClick={() => handleDeleteDocument(document.id)}>
                                  <Trash2 className="h-4 w-4" />
                                  <span className="sr-only">Delete</span>
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={7} className="h-24 text-center">
                          No vehicle documents found.
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            </TabsContent>

            <TabsContent value="customer">
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Customer</TableHead>
                      <TableHead>Upload Date</TableHead>
                      <TableHead>Expiry Date</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredDocuments.filter((d) => d.relatedType === "customer").length > 0 ? (
                      filteredDocuments
                        .filter((d) => d.relatedType === "customer")
                        .map((document) => (
                          <TableRow key={document.id}>
                            <TableCell className="font-medium">
                              <div className="flex items-center gap-2">
                                {getDocumentTypeIcon(document.type)}
                                <span>{document.name}</span>
                              </div>
                            </TableCell>
                            <TableCell>
                              {document.type.charAt(0).toUpperCase() + document.type.slice(1).replace("_", " ")}
                            </TableCell>
                            <TableCell>{document.relatedTo}</TableCell>
                            <TableCell>{format(parseISO(document.uploadDate), "MMM dd, yyyy")}</TableCell>
                            <TableCell>
                              {document.expiryDate ? format(parseISO(document.expiryDate), "MMM dd, yyyy") : "N/A"}
                            </TableCell>
                            <TableCell>{getDocumentStatusBadge(document.status)}</TableCell>
                            <TableCell className="text-right">
                              <div className="flex justify-end gap-2">
                                <Button variant="ghost" size="icon">
                                  <Eye className="h-4 w-4" />
                                  <span className="sr-only">View</span>
                                </Button>
                                <Button variant="ghost" size="icon">
                                  <Download className="h-4 w-4" />
                                  <span className="sr-only">Download</span>
                                </Button>
                                <Button variant="ghost" size="icon">
                                  <FileEdit className="h-4 w-4" />
                                  <span className="sr-only">Edit</span>
                                </Button>
                                <Button variant="ghost" size="icon" onClick={() => handleDeleteDocument(document.id)}>
                                  <Trash2 className="h-4 w-4" />
                                  <span className="sr-only">Delete</span>
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={7} className="h-24 text-center">
                          No customer documents found.
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            </TabsContent>

            <TabsContent value="expiring">
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Related To</TableHead>
                      <TableHead>Expiry Date</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredDocuments.filter((d) => d.status === "expiring_soon" || d.status === "expired").length >
                    0 ? (
                      filteredDocuments
                        .filter((d) => d.status === "expiring_soon" || d.status === "expired")
                        .map((document) => (
                          <TableRow key={document.id}>
                            <TableCell className="font-medium">
                              <div className="flex items-center gap-2">
                                {document.status === "expired" ? (
                                  <AlertTriangle className="h-4 w-4 text-red-500" />
                                ) : (
                                  <AlertTriangle className="h-4 w-4 text-yellow-500" />
                                )}
                                <span>{document.name}</span>
                              </div>
                            </TableCell>
                            <TableCell>
                              {document.type.charAt(0).toUpperCase() + document.type.slice(1).replace("_", " ")}
                            </TableCell>
                            <TableCell>{document.relatedTo}</TableCell>
                            <TableCell>
                              {document.expiryDate ? format(parseISO(document.expiryDate), "MMM dd, yyyy") : "N/A"}
                            </TableCell>
                            <TableCell>{getDocumentStatusBadge(document.status)}</TableCell>
                            <TableCell className="text-right">
                              <div className="flex justify-end gap-2">
                                <Button variant="ghost" size="icon">
                                  <Eye className="h-4 w-4" />
                                  <span className="sr-only">View</span>
                                </Button>
                                <Button variant="ghost" size="icon">
                                  <Download className="h-4 w-4" />
                                  <span className="sr-only">Download</span>
                                </Button>
                                <Button variant="ghost" size="icon">
                                  <FileEdit className="h-4 w-4" />
                                  <span className="sr-only">Edit</span>
                                </Button>
                                <Button variant="ghost" size="icon" onClick={() => handleDeleteDocument(document.id)}>
                                  <Trash2 className="h-4 w-4" />
                                  <span className="sr-only">Delete</span>
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={6} className="h-24 text-center">
                          No expiring documents found.
                        </TableCell>
                      </TableRow>
                    )}
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
