"use client"

import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { FileText, Download, Printer, ChevronDown } from "lucide-react"

interface ExportOptionsProps {
  onExportPdf: () => void
  onExportExcel: () => void
  onPrint: () => void
}

export function ExportOptions({ onExportPdf, onExportExcel, onPrint }: ExportOptionsProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="flex items-center gap-2">
          <Download className="h-4 w-4" />
          Export
          <ChevronDown className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={onExportPdf} className="flex items-center gap-2 cursor-pointer">
          <FileText className="h-4 w-4" />
          Export as PDF
        </DropdownMenuItem>
        <DropdownMenuItem onClick={onExportExcel} className="flex items-center gap-2 cursor-pointer">
          <Download className="h-4 w-4" />
          Export as Excel
        </DropdownMenuItem>
        <DropdownMenuItem onClick={onPrint} className="flex items-center gap-2 cursor-pointer">
          <Printer className="h-4 w-4" />
          Print Report
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
