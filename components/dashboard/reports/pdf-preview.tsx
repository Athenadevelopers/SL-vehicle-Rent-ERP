"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { exportToPDF } from "@/lib/export-utils"
import { FileText, Printer, X } from "lucide-react"

interface PdfPreviewProps {
  reportType: string
  onClose: () => void
}

export function PdfPreview({ reportType, onClose }: PdfPreviewProps) {
  const [loading, setLoading] = useState(true)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)

  useEffect(() => {
    // In a real app, this would generate a preview of the PDF
    // For now, we'll just simulate it with a timeout
    const timer = setTimeout(() => {
      // This would be a URL to a generated PDF preview
      setPreviewUrl("/placeholder.svg?height=800&width=600")
      setLoading(false)
    }, 1000)

    return () => clearTimeout(timer)
  }, [reportType])

  const handleExport = () => {
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
      title: `${reportType.charAt(0).toUpperCase() + reportType.slice(1)} Report`,
      filename: `${reportType}-report`,
      headers,
      data,
      dateRange: "July 1, 2023 - July 31, 2023",
      summary: [
        { label: "Total Bookings", value: "5" },
        { label: "Total Revenue", value: "Rs. 153,000" },
        { label: "Average Booking Value", value: "Rs. 30,600" },
      ],
    }

    exportToPDF(exportOptions)
    onClose()
  }

  const handlePrint = () => {
    window.print()
  }

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl h-[80vh] flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <span>{reportType.charAt(0).toUpperCase() + reportType.slice(1)} Report Preview</span>
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </DialogTitle>
        </DialogHeader>
        <div className="flex-1 overflow-auto border rounded-md p-4 bg-muted/50">
          {loading ? (
            <div className="flex h-full items-center justify-center">
              <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
            </div>
          ) : (
            <iframe src={previewUrl || ""} className="w-full h-full" title="PDF Preview" />
          )}
        </div>
        <DialogFooter className="mt-4">
          <div className="flex gap-2">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button variant="outline" onClick={handlePrint} disabled={loading}>
              <Printer className="mr-2 h-4 w-4" />
              Print
            </Button>
            <Button onClick={handleExport} disabled={loading}>
              <FileText className="mr-2 h-4 w-4" />
              Export PDF
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
