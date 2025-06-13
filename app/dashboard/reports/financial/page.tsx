"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Download, FileText } from "lucide-react"
import { RevenueChart } from "@/components/dashboard/reports/revenue-chart"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

export default function FinancialReportPage() {
  const [period, setPeriod] = useState("monthly")

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Financial Reports</h1>
        <div className="flex items-center gap-2">
          <Button variant="outline" className="flex items-center gap-2">
            <Download className="h-4 w-4" />
            Export
          </Button>
          <Button variant="outline" className="flex items-center gap-2">
            <FileText className="h-4 w-4" />
            Print
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Financial Analysis</CardTitle>
              <CardDescription>Comprehensive financial reports and analysis.</CardDescription>
            </div>
            <Select value={period} onValueChange={setPeriod}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select period" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="weekly">Weekly</SelectItem>
                <SelectItem value="monthly">Monthly</SelectItem>
                <SelectItem value="quarterly">Quarterly</SelectItem>
                <SelectItem value="yearly">Yearly</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="profit-loss" className="space-y-4">
            <TabsList>
              <TabsTrigger value="profit-loss">Profit & Loss</TabsTrigger>
              <TabsTrigger value="balance-sheet">Balance Sheet</TabsTrigger>
              <TabsTrigger value="cash-flow">Cash Flow</TabsTrigger>
              <TabsTrigger value="expenses">Expenses</TabsTrigger>
            </TabsList>
            <TabsContent value="profit-loss" className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">Rs. 1,245,300</div>
                    <p className="text-xs text-muted-foreground">+20.1% from last period</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Total Expenses</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">Rs. 840,150</div>
                    <p className="text-xs text-muted-foreground">+15.3% from last period</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Net Profit</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">Rs. 405,150</div>
                    <p className="text-xs text-muted-foreground">+32.5% from last period</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Profit Margin</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">32.5%</div>
                    <p className="text-xs text-muted-foreground">+2.1% from last period</p>
                  </CardContent>
                </Card>
              </div>
              <div className="h-[400px]">
                <RevenueChart />
              </div>
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Category</TableHead>
                      <TableHead>Amount (Rs.)</TableHead>
                      <TableHead>% of Total</TableHead>
                      <TableHead>YoY Change</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <TableRow>
                      <TableCell className="font-medium">Vehicle Rentals</TableCell>
                      <TableCell>1,125,300</TableCell>
                      <TableCell>90.4%</TableCell>
                      <TableCell className="text-green-600">+18.5%</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-medium">Additional Services</TableCell>
                      <TableCell>85,000</TableCell>
                      <TableCell>6.8%</TableCell>
                      <TableCell className="text-green-600">+32.1%</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-medium">Late Fees</TableCell>
                      <TableCell>35,000</TableCell>
                      <TableCell>2.8%</TableCell>
                      <TableCell className="text-green-600">+15.2%</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-medium">Total Revenue</TableCell>
                      <TableCell className="font-bold">1,245,300</TableCell>
                      <TableCell className="font-bold">100%</TableCell>
                      <TableCell className="font-bold text-green-600">+20.1%</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-medium">Vehicle Maintenance</TableCell>
                      <TableCell>320,150</TableCell>
                      <TableCell>38.1%</TableCell>
                      <TableCell className="text-red-600">+22.3%</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-medium">Staff Salaries</TableCell>
                      <TableCell>280,000</TableCell>
                      <TableCell>33.3%</TableCell>
                      <TableCell className="text-red-600">+10.0%</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-medium">Operational Costs</TableCell>
                      <TableCell>240,000</TableCell>
                      <TableCell>28.6%</TableCell>
                      <TableCell className="text-red-600">+15.4%</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-medium">Total Expenses</TableCell>
                      <TableCell className="font-bold">840,150</TableCell>
                      <TableCell className="font-bold">100%</TableCell>
                      <TableCell className="font-bold text-red-600">+15.3%</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-medium">Net Profit</TableCell>
                      <TableCell className="font-bold">405,150</TableCell>
                      <TableCell className="font-bold">32.5%</TableCell>
                      <TableCell className="font-bold text-green-600">+32.5%</TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </div>
            </TabsContent>
            <TabsContent value="balance-sheet" className="space-y-4">
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Item</TableHead>
                      <TableHead>Amount (Rs.)</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <TableRow>
                      <TableCell className="font-medium">Assets</TableCell>
                      <TableCell></TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="pl-8">Cash and Cash Equivalents</TableCell>
                      <TableCell>2,450,000</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="pl-8">Accounts Receivable</TableCell>
                      <TableCell>350,000</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="pl-8">Vehicle Fleet</TableCell>
                      <TableCell>12,500,000</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="pl-8">Property and Equipment</TableCell>
                      <TableCell>3,200,000</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-medium">Total Assets</TableCell>
                      <TableCell className="font-bold">18,500,000</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-medium">Liabilities</TableCell>
                      <TableCell></TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="pl-8">Accounts Payable</TableCell>
                      <TableCell>280,000</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="pl-8">Vehicle Loans</TableCell>
                      <TableCell>5,200,000</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="pl-8">Other Liabilities</TableCell>
                      <TableCell>420,000</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-medium">Total Liabilities</TableCell>
                      <TableCell className="font-bold">5,900,000</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-medium">Equity</TableCell>
                      <TableCell></TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="pl-8">Owner's Capital</TableCell>
                      <TableCell>10,000,000</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="pl-8">Retained Earnings</TableCell>
                      <TableCell>2,600,000</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-medium">Total Equity</TableCell>
                      <TableCell className="font-bold">12,600,000</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-medium">Total Liabilities and Equity</TableCell>
                      <TableCell className="font-bold">18,500,000</TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </div>
            </TabsContent>
            <TabsContent value="cash-flow" className="space-y-4">
              <div className="h-[400px]">
                <RevenueChart />
              </div>
            </TabsContent>
            <TabsContent value="expenses" className="space-y-4">
              <div className="h-[400px]">
                <RevenueChart />
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}
