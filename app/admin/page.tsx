import {DashboardOverview} from "@/components/admin/dashboard-overview"
import {RecentOrders} from "@/components/admin/recent-orders"
import {TopProducts} from "@/components/admin/top-products"
import {SalesChart} from "@/components/admin/sales-chart"
import {RevenueStats} from "@/components/admin/revenue-stats"

export default function AdminDashboard() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground">
            Welcome back! Here&apos;s what&apos;s happening with your store today.
          </p>
        </div>
      </div>

      <RevenueStats />

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7">
        <div className="col-span-4">
          <SalesChart />
        </div>
        <div className="col-span-3">
          <TopProducts />
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7">
        <div className="col-span-4">
          <RecentOrders />
        </div>
        <div className="col-span-3">
          <DashboardOverview />
        </div>
      </div>
    </div>
  )
}
