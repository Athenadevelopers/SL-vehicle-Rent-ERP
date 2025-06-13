"use client"

import { useEffect, useState } from "react"
import { Line, LineChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"

export function BookingsChart() {
  const [data, setData] = useState([])

  useEffect(() => {
    // This would normally fetch from Firebase
    const mockData = [
      {
        name: "Week 1",
        completed: 12,
        cancelled: 2,
        pending: 5,
      },
      {
        name: "Week 2",
        completed: 15,
        cancelled: 1,
        pending: 7,
      },
      {
        name: "Week 3",
        completed: 18,
        cancelled: 3,
        pending: 4,
      },
      {
        name: "Week 4",
        completed: 20,
        cancelled: 2,
        pending: 6,
      },
      {
        name: "Week 5",
        completed: 22,
        cancelled: 1,
        pending: 8,
      },
      {
        name: "Week 6",
        completed: 25,
        cancelled: 2,
        pending: 5,
      },
    ]

    setData(mockData)
  }, [])

  return (
    <div className="h-[400px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Line type="monotone" dataKey="completed" name="Completed Bookings" stroke="#009E60" strokeWidth={2} />
          <Line type="monotone" dataKey="cancelled" name="Cancelled Bookings" stroke="#8D153A" strokeWidth={2} />
          <Line type="monotone" dataKey="pending" name="Pending Bookings" stroke="#FFBE29" strokeWidth={2} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}
