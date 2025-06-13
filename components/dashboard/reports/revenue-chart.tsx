"use client"

import { useEffect, useState } from "react"
import { Bar, BarChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"

export function RevenueChart() {
  const [data, setData] = useState([])

  useEffect(() => {
    // This would normally fetch from Firebase
    const mockData = [
      {
        name: "Jan",
        cars: 80000,
        vans: 50000,
        tuktuks: 20000,
        motorcycles: 10000,
      },
      {
        name: "Feb",
        cars: 90000,
        vans: 60000,
        tuktuks: 25000,
        motorcycles: 15000,
      },
      {
        name: "Mar",
        cars: 100000,
        vans: 70000,
        tuktuks: 30000,
        motorcycles: 20000,
      },
      {
        name: "Apr",
        cars: 95000,
        vans: 65000,
        tuktuks: 28000,
        motorcycles: 18000,
      },
      {
        name: "May",
        cars: 110000,
        vans: 75000,
        tuktuks: 35000,
        motorcycles: 25000,
      },
      {
        name: "Jun",
        cars: 120000,
        vans: 80000,
        tuktuks: 40000,
        motorcycles: 30000,
      },
    ]

    setData(mockData)
  }, [])

  return (
    <div className="h-[400px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis tickFormatter={(value) => `Rs.${value / 1000}k`} />
          <Tooltip formatter={(value) => [`Rs. ${value.toLocaleString()}`, ""]} />
          <Legend />
          <Bar dataKey="cars" name="Cars" fill="#FF7700" />
          <Bar dataKey="vans" name="Vans" fill="#009E60" />
          <Bar dataKey="tuktuks" name="Tuk-Tuks" fill="#FFBE29" />
          <Bar dataKey="motorcycles" name="Motorcycles" fill="#8D153A" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
