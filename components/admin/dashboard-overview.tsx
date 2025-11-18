import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card"
import {Users, Package, DollarSign} from "lucide-react"

const quickStats = [
  {
    title: "Active Users",
    value: "2,847",
    icon: Users,
    change: "+12%",
    color: "text-blue-600",
  },
  {
    title: "Inventory Items",
    value: "1,234",
    icon: Package,
    change: "+5%",
    color: "text-green-600",
  },
  {
    title: "Avg. Order Value",
    value: "$89.50",
    icon: DollarSign,
    change: "+8%",
    color: "text-purple-600",
  },
]

const recentActivity = [
  {
    id: 1,
    action: "New order placed",
    description: "Order #ORD-006 for $299.99",
    time: "2 minutes ago",
    type: "order" as const,
  },
  {
    id: 2,
    action: "Product restocked",
    description: "Wireless Headphones - 50 units added",
    time: "15 minutes ago",
    type: "inventory" as const,
  },
  {
    id: 3,
    action: "Customer registered",
    description: "New customer: emma@example.com",
    time: "1 hour ago",
    type: "customer" as const,
  },
  {
    id: 4,
    action: "Payment received",
    description: "Payment for order #ORD-005",
    time: "2 hours ago",
    type: "payment" as const,
  },
]

const activityColors = {
  order: "text-blue-600",
  inventory: "text-green-600",
  customer: "text-purple-600",
  payment: "text-yellow-600",
}

export function DashboardOverview() {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Quick Stats</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {quickStats.map((stat) => (
              <div key={stat.title} className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <stat.icon className={`h-5 w-5 ${stat.color}`} />
                  <div>
                    <p className="text-sm font-medium">{stat.title}</p>
                    <p className="text-xs text-muted-foreground">{stat.change} from last week</p>
                  </div>
                </div>
                <p className="text-lg font-bold">{stat.value}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recentActivity.map((activity) => (
              <div key={activity.id} className="flex items-start space-x-3">
                <div className={`mt-1 h-2 w-2 rounded-full ${activityColors[activity.type].replace("text-", "bg-")}`} />
                <div className="flex-1 space-y-1">
                  <p className="text-sm font-medium">{activity.action}</p>
                  <p className="text-xs text-muted-foreground">{activity.description}</p>
                  <p className="text-xs text-muted-foreground">{activity.time}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
