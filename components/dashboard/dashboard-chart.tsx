"use client"

import { useEffect, useState } from "react"
import { Bar, BarChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"

export function DashboardChart() {
  const [data, setData] = useState([])

  useEffect(() => {
    // This would normally fetch from Firebase
    const mockData = [
      { name: "Jan", total: 120000 },
      { name: "Feb", total: 150000 },
      { name: "Mar", total: 200000 },
      { name: "Apr", total: 180000 },
      { name: "May", total: 250000 },
      { name: "Jun", total: 300000 },
      { name: "Jul", total: 280000 },
      { name: "Aug", total: 320000 },
      { name: "Sep", total: 290000 },
      { name: "Oct", total: 350000 },
      { name: "Nov", total: 380000 },
      { name: "Dec", total: 400000 },
    ]

    setData(mockData)
  }, [])

  return (
    <ResponsiveContainer width="100%" height={350}>
      <BarChart data={data}>
        <XAxis dataKey="name" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
        <YAxis
          stroke="#888888"
          fontSize={12}
          tickLine={false}
          axisLine={false}
          tickFormatter={(value) => `Rs.${value / 1000}k`}
        />
        <Tooltip formatter={(value: number) => [`Rs. ${value.toLocaleString()}`, "Revenue"]} />
        <Bar dataKey="total" fill="currentColor" radius={[4, 4, 0, 0]} className="fill-primary" />
      </BarChart>
    </ResponsiveContainer>
  )
}
