"use client"

import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card"
import {Package, CreditCard, Star, TrendingUp} from "lucide-react"

const stats = [
  {
    title: "Total Orders",
    value: "12",
    icon: Package,
    color: "text-blue-600",
    bgColor: "bg-gradient-to-br from-blue-500 to-blue-600",
    change: "+2 this month",
    changeColor: "text-green-600",
  },
  {
    title: "Total Spent",
    value: "$1,247",
    icon: CreditCard,
    color: "text-green-600",
    bgColor: "bg-gradient-to-br from-green-500 to-emerald-600",
    change: "+$89 this month",
    changeColor: "text-green-600",
  },
  {
    title: "Reviews Given",
    value: "8",
    icon: Star,
    color: "text-yellow-600",
    bgColor: "bg-gradient-to-br from-yellow-500 to-orange-500",
    change: "+3 this month",
    changeColor: "text-green-600",
  },
  {
    title: "Loyalty Points",
    value: "1,250",
    icon: TrendingUp,
    color: "text-purple-600",
    bgColor: "bg-gradient-to-br from-purple-500 to-indigo-600",
    change: "+150 this month",
    changeColor: "text-green-600",
  },
]

export function UserStats() {
  return (
    <>
      {stats.map((stat, index) => (
        <Card
          key={stat.title}
          className="bg-white/80 backdrop-blur-sm shadow-xl border border-white/20 hover:shadow-2xl transition-all duration-300 group overflow-hidden relative"
          style={{
            animationDelay: `${index * 100}ms`,
          }}
        >
          {/* Gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-br from-transparent via-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3 relative z-10">
            <CardTitle className="text-sm font-medium text-gray-600 group-hover:text-gray-900 transition-colors duration-300">
              {stat.title}
            </CardTitle>
            <div
              className={`p-3 rounded-xl ${stat.bgColor} shadow-lg group-hover:scale-110 transition-transform duration-300`}
            >
              <stat.icon className="h-5 w-5 text-white" />
            </div>
          </CardHeader>
          <CardContent className="relative z-10">
            <div className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent mb-2">
              {stat.value}
            </div>
            <p className={`text-sm font-medium ${stat.changeColor} flex items-center gap-1`}>
              <span className="text-xs">↗</span>
              {stat.change}
            </p>
          </CardContent>

          {/* Decorative corner */}
          <div className={`absolute top-0 right-0 w-16 h-16 ${stat.bgColor} opacity-10 rounded-bl-full`}></div>
        </Card>
      ))}
    </>
  )
}
