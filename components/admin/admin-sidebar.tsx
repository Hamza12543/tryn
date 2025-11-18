"use client"

import Link from "next/link"
import {usePathname} from "next/navigation"
import {cn} from "@/lib/utils"
import {Button} from "@/components/ui/button"
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  Users,
  Settings,
  BarChart3,
  FileText,
  LogOut,
  Menu,
  Tag,
} from "lucide-react"
import {useState} from "react"
import {Avatar, AvatarFallback, AvatarImage} from "@/components/ui/avatar"
import {useSession, signOut} from "next-auth/react"

const sidebarItems = [
  // {
  //   title: "Dashboard",
  //   href: "/admin",
  //   icon: LayoutDashboard,
  // },
  {
    title: "Orders",
    href: "/admin/orders",
    icon: ShoppingCart,
  },
  {
    title: "Products",
    href: "/admin/products",
    icon: Package,
  },
  {
    title: "Categories",
    href: "/admin/categories",
    icon: Tag,
  },
  // {
  //   title: "Orders",
  //   href: "/admin/orders",
  //   icon: ShoppingCart,
  // },
  {
    title: "Customers",
    href: "/admin/customers",
    icon: Users,
  },

  {
    title: "Coupons",
    href: "/admin/coupon",
    icon: Users,
  },

  // {
  //   title: "Analytics",
  //   href: "/admin/analytics",
  //   icon: BarChart3,
  // },
  // {
  //   title: "Reports",
  //   href: "/admin/reports",
  //   icon: FileText,
  // },
  // {
  //   title: "Settings",
  //   href: "/admin/settings",
  //   icon: Settings,
  // },
]

export function AdminSidebar() {
  const pathname = usePathname()
  const [isCollapsed, setIsCollapsed] = useState(false)
  const {data: session} = useSession()
  const user = session?.user

  return (
    <div className={cn("flex flex-col border-r bg-white transition-all duration-300", isCollapsed ? "w-20" : "w-64")}>
      <div className="flex h-16 items-center justify-between border-b px-4">
        {!isCollapsed && <h1 className="text-xl font-bold text-gray-900">Admin Panel</h1>}
        <Button variant="ghost" size="sm" onClick={() => setIsCollapsed(!isCollapsed)} className="h-8 w-8 p-0">
          <Menu className="h-4 w-4" />
        </Button>
      </div>

      <nav className="flex-1 space-y-1 p-4">
        {sidebarItems.map((item) => {
          const isActive = pathname === item.href
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                isActive ? "bg-blue-50 text-blue-700" : "text-gray-700 hover:bg-gray-100"
              )}
            >
              <item.icon
                className={cn(isCollapsed ? "h-14 w-14 mx-auto stroke-[2.5px] text-gray-900" : "h-5 w-5 mr-3")}
              />
              {!isCollapsed && item.title}
            </Link>
          )
        })}
      </nav>

      <div className="border-t p-4">
        <div className="flex items-center space-x-3">
          <Avatar className={cn(isCollapsed ? "h-10 w-10" : "h-8 w-8")}>
            <AvatarImage src={user?.image || "/avatars/default.jpg"} alt={user?.name || "Admin"} />
            <AvatarFallback>
              {user?.name
                ? user.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")
                : "AD"}
            </AvatarFallback>
          </Avatar>
          {!isCollapsed && (
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-900">{user?.name || "Admin User"}</p>
              <p className="text-xs text-gray-500">{user?.email || "admin@example.com"}</p>
            </div>
          )}
        </div>
        {!isCollapsed && (
          <Button
            variant="ghost"
            size="sm"
            className="mt-3 w-full justify-start"
            onClick={() => signOut({callbackUrl: "/login"})}
          >
            <LogOut className="mr-2 h-4 w-4" />
            Sign out
          </Button>
        )}
        {isCollapsed && (
          <Button
            variant="ghost"
            size="sm"
            className="mt-3 w-full h-16 p-0 flex items-center justify-center hover:bg-gray-100"
            title="Sign out"
            onClick={() => signOut({callbackUrl: "/login"})}
          >
            <LogOut className="h-12 w-12 stroke-[2.5px] text-gray-900" />
          </Button>
        )}
      </div>
    </div>
  )
}
