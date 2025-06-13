"use client"

import { useEffect, useState } from "react"
import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip, Legend } from "recharts"

export function VehicleUtilizationChart() {
  const [data, setData] = useState([])

  useEffect(() => {
    // This would normally fetch from Firebase
    const mockData = [
      { name: "Cars", value: 45, color: "#FF7700" },
      { name: "Vans", value: 25, color: "#009E60" },
      { name: "Tuk-Tuks", value: 20, color: "#FFBE29" },
      { name: "Motorcycles", value: 10, color: "#8D153A" },
    ]

    setData(mockData)
  }, [])

  return (
    <div className="h-[400px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={100}
            outerRadius={140}
            paddingAngle={2}
            dataKey="value"
            label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip formatter={(value) => [`${value}%`, "Utilization"]} />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </div>
  )
}
