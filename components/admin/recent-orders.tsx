import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card"
import {Badge} from "@/components/ui/badge"
import {Avatar, AvatarFallback, AvatarImage} from "@/components/ui/avatar"

const recentOrders = [
  {
    id: "ORD-001",
    customer: "John Doe",
    email: "john@example.com",
    amount: 299.99,
    status: "completed" as const,
    date: "2024-01-15",
    items: 3,
  },
  {
    id: "ORD-002",
    customer: "Jane Smith",
    email: "jane@example.com",
    amount: 149.99,
    status: "processing" as const,
    date: "2024-01-15",
    items: 2,
  },
  {
    id: "ORD-003",
    customer: "Mike Johnson",
    email: "mike@example.com",
    amount: 89.99,
    status: "shipped" as const,
    date: "2024-01-14",
    items: 1,
  },
  {
    id: "ORD-004",
    customer: "Sarah Wilson",
    email: "sarah@example.com",
    amount: 199.99,
    status: "pending" as const,
    date: "2024-01-14",
    items: 4,
  },
  {
    id: "ORD-005",
    customer: "David Brown",
    email: "david@example.com",
    amount: 399.99,
    status: "completed" as const,
    date: "2024-01-13",
    items: 2,
  },
]

const statusColors = {
  completed: "bg-green-100 text-green-800",
  processing: "bg-blue-100 text-blue-800",
  shipped: "bg-purple-100 text-purple-800",
  pending: "bg-yellow-100 text-yellow-800",
}

export function RecentOrders() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Orders</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {recentOrders.map((order) => (
            <div key={order.id} className="flex items-center space-x-4">
              <Avatar className="h-9 w-9">
                <AvatarImage src={`/avatars/${order.customer.toLowerCase().replace(" ", "-")}.png`} />
                <AvatarFallback>
                  {order.customer
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 space-y-1">
                <p className="text-sm font-medium leading-none">{order.customer}</p>
                <p className="text-xs text-muted-foreground">{order.email}</p>
              </div>
              <div className="text-right">
                <p className="text-sm font-medium">${order.amount}</p>
                <p className="text-xs text-muted-foreground">{order.items} items</p>
              </div>
              <Badge className={statusColors[order.status]}>{order.status}</Badge>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
