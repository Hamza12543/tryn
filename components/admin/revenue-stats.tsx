import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card"
import {Badge} from "@/components/ui/badge"
import {DollarSign, ShoppingCart, Users, TrendingUp, TrendingDown} from "lucide-react"

const stats = [
  {
    title: "Total Revenue",
    value: "$45,231.89",
    change: "+20.1%",
    changeType: "positive" as const,
    icon: DollarSign,
    description: "vs last month",
  },
  {
    title: "Orders",
    value: "2,350",
    change: "+180.1%",
    changeType: "positive" as const,
    icon: ShoppingCart,
    description: "vs last month",
  },
  {
    title: "Customers",
    value: "1,234",
    change: "+19%",
    changeType: "positive" as const,
    icon: Users,
    description: "vs last month",
  },
  {
    title: "Conversion Rate",
    value: "3.24%",
    change: "-1.2%",
    changeType: "negative" as const,
    icon: TrendingUp,
    description: "vs last month",
  },
]

export function RevenueStats() {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat) => (
        <Card key={stat.title}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
            <stat.icon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stat.value}</div>
            <div className="flex items-center space-x-2 text-xs text-muted-foreground">
              <Badge variant={stat.changeType === "positive" ? "default" : "secondary"} className="text-xs">
                {stat.changeType === "positive" ? (
                  <TrendingUp className="mr-1 h-3 w-3" />
                ) : (
                  <TrendingDown className="mr-1 h-3 w-3" />
                )}
                {stat.change}
              </Badge>
              <span>{stat.description}</span>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
