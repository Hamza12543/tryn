"use client"

import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card"
import {Badge} from "@/components/ui/badge"
import {CheckCircle, Clock, Package, Truck, Home} from "lucide-react"

interface OrderTrackingProps {
  orderId: string
  status: "pending" | "processing" | "shipped" | "delivered" | "cancelled"
  trackingNumber?: string
}

const trackingSteps = [
  {
    id: "pending",
    label: "Order Placed",
    icon: Clock,
    description: "Your order has been received",
  },
  {
    id: "processing",
    label: "Processing",
    icon: Package,
    description: "We're preparing your order",
  },
  {
    id: "shipped",
    label: "Shipped",
    icon: Truck,
    description: "Your order is on the way",
  },
  {
    id: "delivered",
    label: "Delivered",
    icon: Home,
    description: "Your order has been delivered",
  },
]

const statusOrder = ["pending", "processing", "shipped", "delivered"]

export function OrderTracking({orderId, status, trackingNumber}: OrderTrackingProps) {
  const currentStepIndex = statusOrder.indexOf(status)

  return (
    <Card className="bg-white shadow-lg border-0">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Truck className="h-5 w-5 text-blue-600" />
          Order Tracking
        </CardTitle>
        <div className="text-sm text-gray-600">
          Order #{orderId}
          {trackingNumber && (
            <div className="mt-1">
              <span className="font-medium">Tracking:</span> {trackingNumber}
            </div>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {trackingSteps.map((step, index) => {
            const StepIcon = step.icon
            const isCompleted = index <= currentStepIndex
            const isCurrent = index === currentStepIndex

            return (
              <div key={step.id} className="flex items-start space-x-4">
                <div className="flex-shrink-0">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center ${
                      isCompleted ? "bg-green-100 text-green-600" : "bg-gray-100 text-gray-400"
                    }`}
                  >
                    {isCompleted ? <CheckCircle className="h-5 w-5" /> : <StepIcon className="h-5 w-5" />}
                  </div>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center space-x-2">
                    <p className={`text-sm font-medium ${isCompleted ? "text-gray-900" : "text-gray-500"}`}>
                      {step.label}
                    </p>
                    {isCurrent && (
                      <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                        Current
                      </Badge>
                    )}
                  </div>
                  <p className="text-xs text-gray-500 mt-1">{step.description}</p>
                </div>
              </div>
            )
          })}
        </div>

        {status === "cancelled" && (
          <div className="mt-6 p-4 bg-red-50 rounded-lg">
            <div className="flex items-center space-x-2">
              <div className="w-6 h-6 rounded-full bg-red-100 flex items-center justify-center">
                <span className="text-red-600 text-sm font-bold">×</span>
              </div>
              <div>
                <p className="text-sm font-medium text-red-900">Order Cancelled</p>
                <p className="text-xs text-red-700">This order has been cancelled</p>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
