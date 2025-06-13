"use client"

import { useEffect, useState } from "react"
import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts"

export function VehicleStatusChart() {
  const [data, setData] = useState([])

  useEffect(() => {
    // This would normally fetch from Firebase
    const mockData = [
      { name: "Available", value: 45, color: "#10B981" },
      { name: "Rented", value: 25, color: "#F59E0B" },
      { name: "Maintenance", value: 5, color: "#EF4444" },
    ]

    setData(mockData)
  }, [])

  return (
    <div className="h-[240px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={80}
            paddingAngle={2}
            dataKey="value"
            label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
            labelLine={false}
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip formatter={(value) => [`${value} vehicles`, ""]} />
        </PieChart>
      </ResponsiveContainer>
    </div>
  )
}
