"use client"

import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card"
import {Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis} from "recharts"

const data = [
  {month: "Jan", sales: 4000, orders: 2400},
  {month: "Feb", sales: 3000, orders: 1398},
  {month: "Mar", sales: 2000, orders: 9800},
  {month: "Apr", sales: 2780, orders: 3908},
  {month: "May", sales: 1890, orders: 4800},
  {month: "Jun", sales: 2390, orders: 3800},
  {month: "Jul", sales: 3490, orders: 4300},
  {month: "Aug", sales: 4000, orders: 2400},
  {month: "Sep", sales: 3000, orders: 1398},
  {month: "Oct", sales: 2000, orders: 9800},
  {month: "Nov", sales: 2780, orders: 3908},
  {month: "Dec", sales: 1890, orders: 4800},
]

export function SalesChart() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Sales Overview</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={350}>
          <LineChart data={data}>
            <XAxis dataKey="month" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
            <YAxis
              stroke="#888888"
              fontSize={12}
              tickLine={false}
              axisLine={false}
              tickFormatter={(value) => `$${value}`}
            />
            <Tooltip />
            <Line type="monotone" dataKey="sales" stroke="#8884d8" strokeWidth={2} dot={false} />
            <Line type="monotone" dataKey="orders" stroke="#82ca9d" strokeWidth={2} dot={false} />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}
