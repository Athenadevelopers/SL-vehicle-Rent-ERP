import { jsPDF } from "jspdf"
import autoTable from "jspdf-autotable"
import * as XLSX from "xlsx"

interface ExportOptions {
  title: string
  filename: string
  headers: string[]
  data: any[][]
  orientation?: "portrait" | "landscape"
  logo?: string
  companyName?: string
  companyAddress?: string
  dateRange?: string
  summary?: { label: string; value: string }[]
}

// Function to export data to PDF
export const exportToPDF = (options: ExportOptions) => {
  const {
    title,
    filename,
    headers,
    data,
    orientation = "portrait",
    logo,
    companyName = "SL Vehicle Rental",
    companyAddress = "123 Main Street, Colombo, Sri Lanka",
    dateRange,
    summary,
  } = options

  // Create a new PDF document
  const doc = new jsPDF({
    orientation,
    unit: "mm",
    format: "a4",
  })

  // Set font
  doc.setFont("helvetica")

  // Add logo if provided
  if (logo) {
    doc.addImage(logo, "PNG", 14, 10, 30, 30)
  }

  // Add company name and title
  doc.setFontSize(20)
  doc.text(companyName, 14, logo ? 50 : 20)

  doc.setFontSize(16)
  doc.text(title, 14, logo ? 60 : 30)

  // Add company address
  doc.setFontSize(10)
  doc.setTextColor(100)
  doc.text(companyAddress, 14, logo ? 65 : 35)

  // Add date range if provided
  if (dateRange) {
    doc.text(`Period: ${dateRange}`, 14, logo ? 70 : 40)
  }

  // Add date of generation
  const today = new Date()
  doc.text(`Generated on: ${today.toLocaleDateString()}`, 14, logo ? 75 : 45)

  // Add summary if provided
  if (summary && summary.length > 0) {
    let yPos = logo ? 85 : 55

    doc.setFontSize(12)
    doc.setTextColor(0)
    doc.text("Summary:", 14, yPos)

    yPos += 5
    doc.setFontSize(10)

    summary.forEach((item) => {
      yPos += 5
      doc.text(`${item.label}: ${item.value}`, 20, yPos)
    })

    yPos += 10
  }

  // Add table with data
  autoTable(doc, {
    head: [headers],
    body: data,
    startY: summary ? (logo ? 110 : 80) : logo ? 85 : 55,
    theme: "grid",
    headStyles: {
      fillColor: [79, 70, 229],
      textColor: 255,
      fontStyle: "bold",
    },
    alternateRowStyles: {
      fillColor: [240, 240, 240],
    },
  })

  // Add page number
  const pageCount = doc.internal.getNumberOfPages()
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i)
    doc.setFontSize(10)
    doc.setTextColor(100)
    doc.text(`Page ${i} of ${pageCount}`, doc.internal.pageSize.getWidth() - 30, doc.internal.pageSize.getHeight() - 10)
  }

  // Add footer
  doc.setFontSize(8)
  doc.setTextColor(100)
  doc.text(
    `© ${new Date().getFullYear()} SL Vehicle Rental. All rights reserved.`,
    14,
    doc.internal.pageSize.getHeight() - 10,
  )

  // Save the PDF
  doc.save(`${filename}.pdf`)
}

// Function to export data to Excel
export const exportToExcel = (options: ExportOptions) => {
  const { title, filename, headers, data } = options

  // Create a new workbook
  const wb = XLSX.utils.book_new()

  // Create worksheet with headers and data
  const wsData = [headers, ...data]
  const ws = XLSX.utils.aoa_to_sheet(wsData)

  // Set column widths
  const colWidths = headers.map((header) => ({ wch: Math.max(header.length, 10) }))
  ws["!cols"] = colWidths

  // Add the worksheet to the workbook
  XLSX.utils.book_append_sheet(wb, ws, title)

  // Generate Excel file and trigger download
  XLSX.writeFile(wb, `${filename}.xlsx`)
}

// Function to print data
export const printData = (options: ExportOptions) => {
  const { title, headers, data, companyName = "SL Vehicle Rental", dateRange } = options

  // Create a new window for printing
  const printWindow = window.open("", "_blank")

  if (!printWindow) {
    alert("Please allow pop-ups to print this report.")
    return
  }

  // Generate HTML content for printing
  const htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <title>${title}</title>
      <style>
        body {
          font-family: Arial, sans-serif;
          margin: 20px;
        }
        h1 {
          color: #4f46e5;
        }
        table {
          width: 100%;
          border-collapse: collapse;
          margin-top: 20px;
        }
        th {
          background-color: #4f46e5;
          color: white;
          padding: 8px;
          text-align: left;
        }
        td {
          padding: 8px;
          border-bottom: 1px solid #ddd;
        }
        tr:nth-child(even) {
          background-color: #f2f2f2;
        }
        .header {
          margin-bottom: 20px;
        }
        .footer {
          margin-top: 30px;
          font-size: 12px;
          color: #666;
          text-align: center;
        }
        @media print {
          .no-print {
            display: none;
          }
        }
      </style>
    </head>
    <body>
      <div class="header">
        <h1>${companyName}</h1>
        <h2>${title}</h2>
        ${dateRange ? `<p>Period: ${dateRange}</p>` : ""}
        <p>Generated on: ${new Date().toLocaleDateString()}</p>
      </div>
      
      <table>
        <thead>
          <tr>
            ${headers.map((header) => `<th>${header}</th>`).join("")}
          </tr>
        </thead>
        <tbody>
          ${data
            .map(
              (row) => `
            <tr>
              ${row.map((cell) => `<td>${cell}</td>`).join("")}
            </tr>
          `,
            )
            .join("")}
        </tbody>
      </table>
      
      <div class="footer">
        <p>© ${new Date().getFullYear()} ${companyName}. All rights reserved.</p>
      </div>
      
      <div class="no-print" style="text-align: center; margin-top: 20px;">
        <button onclick="window.print()">Print</button>
        <button onclick="window.close()">Close</button>
      </div>
    </body>
    </html>
  `

  // Write HTML to the new window and trigger print
  printWindow.document.open()
  printWindow.document.write(htmlContent)
  printWindow.document.close()

  // Wait for content to load before printing
  setTimeout(() => {
    printWindow.print()
  }, 500)
}
