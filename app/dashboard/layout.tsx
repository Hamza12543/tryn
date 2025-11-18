import type {Metadata} from "next"

export const metadata: Metadata = {
  title: "Dashboard | TRYN",
  description: "Manage your account, view orders, and update your profile",
}

export default function DashboardLayout({children}: {children: React.ReactNode}) {
  return <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">{children}</div>
}
