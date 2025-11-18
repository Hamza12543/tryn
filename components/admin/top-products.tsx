import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card"
import {TrendingUp} from "lucide-react"

const topProducts = [
  {
    id: 1,
    name: "Wireless Headphones",
    category: "Electronics",
    sales: 1234,
    revenue: 12340,
    growth: "+12.5%",
  },
  {
    id: 2,
    name: "Smart Watch",
    category: "Electronics",
    sales: 987,
    revenue: 9870,
    growth: "+8.2%",
  },
  {
    id: 3,
    name: "Running Shoes",
    category: "Sports",
    sales: 756,
    revenue: 7560,
    growth: "+15.3%",
  },
  {
    id: 4,
    name: "Coffee Maker",
    category: "Home",
    sales: 543,
    revenue: 5430,
    growth: "+5.7%",
  },
  {
    id: 5,
    name: "Bluetooth Speaker",
    category: "Electronics",
    sales: 432,
    revenue: 4320,
    growth: "+9.1%",
  },
]

export function TopProducts() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Top Products</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {topProducts.map((product, index) => (
            <div key={product.id} className="flex items-center space-x-4">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-100 text-sm font-medium text-blue-600">
                {index + 1}
              </div>
              <div className="flex-1 space-y-1">
                <p className="text-sm font-medium leading-none">{product.name}</p>
                <p className="text-xs text-muted-foreground">{product.category}</p>
              </div>
              <div className="text-right">
                <p className="text-sm font-medium">${product.revenue.toLocaleString()}</p>
                <div className="flex items-center space-x-1 text-xs text-muted-foreground">
                  <TrendingUp className="h-3 w-3" />
                  <span>{product.growth}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
