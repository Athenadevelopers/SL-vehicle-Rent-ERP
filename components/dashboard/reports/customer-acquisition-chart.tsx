"use client"

import { useEffect, useState } from "react"
import { Area, AreaChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"

export function CustomerAcquisitionChart() {
  const [data, setData] = useState([])

  useEffect(() => {
    // This would normally fetch from Firebase
    const mockData = [
      {
        name: "Jan",
        newCustomers: 15,
        returningCustomers: 25,
      },
      {
        name: "Feb",
        newCustomers: 18,
        returningCustomers: 28,
      },
      {
        name: "Mar",
        newCustomers: 22,
        returningCustomers: 32,
      },
      {
        name: "Apr",
        newCustomers: 20,
        returningCustomers: 35,
      },
      {
        name: "May",
        newCustomers: 25,
        returningCustomers: 40,
      },
      {
        name: "Jun",
        newCustomers: 30,
        returningCustomers: 45,
      },
    ]

    setData(mockData)
  }, [])

  return (
    <div className="h-[400px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Area
            type="monotone"
            dataKey="newCustomers"
            name="New Customers"
            stroke="#FF7700"
            fill="#FF7700"
            fillOpacity={0.3}
          />
          <Area
            type="monotone"
            dataKey="returningCustomers"
            name="Returning Customers"
            stroke="#009E60"
            fill="#009E60"
            fillOpacity={0.3}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  )
}
