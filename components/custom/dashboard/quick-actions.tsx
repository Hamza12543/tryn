"use client"

import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card"
import {Button} from "@/components/ui/button"
import {ShoppingBag, Heart, MessageSquare, Gift, CreditCard, Truck, Star} from "lucide-react"
import Link from "next/link"

const quickActions = [
  {
    title: "Continue Shopping",
    description: "Browse our latest products",
    icon: ShoppingBag,
    href: "/shop",
    color: "text-blue-600",
    bgColor: "bg-gradient-to-br from-blue-500 to-blue-600",
    hoverColor: "hover:from-blue-600 hover:to-blue-700",
  },
  {
    title: "Wishlist",
    description: "View your saved items",
    icon: Heart,
    href: "/wishlist",
    color: "text-red-600",
    bgColor: "bg-gradient-to-br from-red-500 to-pink-600",
    hoverColor: "hover:from-red-600 hover:to-pink-700",
  },
  {
    title: "Support",
    description: "Get help with your orders",
    icon: MessageSquare,
    href: "/help",
    color: "text-green-600",
    bgColor: "bg-gradient-to-br from-green-500 to-emerald-600",
    hoverColor: "hover:from-green-600 hover:to-emerald-700",
  },
  {
    title: "Track Package",
    description: "Check delivery status",
    icon: Truck,
    href: "/tracking",
    color: "text-purple-600",
    bgColor: "bg-gradient-to-br from-purple-500 to-indigo-600",
    hoverColor: "hover:from-purple-600 hover:to-indigo-700",
  },
  {
    title: "Write Review",
    description: "Share your experience",
    icon: Star,
    href: "/reviews",
    color: "text-yellow-600",
    bgColor: "bg-gradient-to-br from-yellow-500 to-orange-500",
    hoverColor: "hover:from-yellow-600 hover:to-orange-600",
  },
  {
    title: "Payment Methods",
    description: "Manage your cards",
    icon: CreditCard,
    href: "/payment-methods",
    color: "text-indigo-600",
    bgColor: "bg-gradient-to-br from-indigo-500 to-purple-600",
    hoverColor: "hover:from-indigo-600 hover:to-purple-700",
  },
]

export function QuickActions() {
  return (
    <Card className="bg-white/80 backdrop-blur-sm shadow-xl border border-white/20 hover:shadow-2xl transition-all duration-300 group">
      <CardHeader className="pb-6">
        <CardTitle className="flex items-center gap-3 text-2xl">
          <div className="p-3 bg-gradient-to-r from-purple-500 to-pink-600 rounded-xl group-hover:scale-110 transition-transform duration-300">
            <Gift className="h-6 w-6 text-white" />
          </div>
          Quick Actions
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {quickActions.map((action, index) => {
            const ActionIcon = action.icon

            return (
              <Link key={action.title} href={action.href}>
                <Button
                  variant="outline"
                  className="w-full h-auto p-6 flex flex-col items-start space-y-4 bg-white/60 backdrop-blur-sm border border-white/30 hover:bg-white hover:shadow-xl hover:scale-105 transition-all duration-300 group/action relative overflow-hidden"
                  style={{
                    animationDelay: `${index * 100}ms`,
                  }}
                >
                  {/* Gradient overlay */}
                  <div
                    className={`absolute inset-0 ${action.bgColor} opacity-0 group-hover/action:opacity-5 transition-opacity duration-300`}
                  ></div>

                  <div className="relative z-10 flex items-center gap-4 w-full">
                    <div
                      className={`p-3 rounded-xl ${action.bgColor} shadow-lg group-hover/action:scale-110 transition-transform duration-300`}
                    >
                      <ActionIcon className="h-6 w-6 text-white" />
                    </div>
                    <div className="text-left flex-1">
                      <p className="font-semibold text-gray-900 group-hover/action:text-gray-800 transition-colors duration-300">
                        {action.title}
                      </p>
                      <p className="text-sm text-gray-500 group-hover/action:text-gray-600 transition-colors duration-300">
                        {action.description}
                      </p>
                    </div>
                  </div>

                  {/* Decorative corner */}
                  <div
                    className={`absolute top-0 right-0 w-12 h-12 ${action.bgColor} opacity-10 rounded-bl-full`}
                  ></div>
                </Button>
              </Link>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}
