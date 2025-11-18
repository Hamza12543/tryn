"use client"

import {useState} from "react"
import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card"
import {Tabs, TabsContent, TabsList, TabsTrigger} from "@/components/ui/tabs"
import UserOrders from "@/components/custom/dashboard/user-orders"
import {UserProfile} from "@/components/custom/dashboard/user-profile"
import {UserStats} from "@/components/custom/dashboard/user-stats"
import {QuickActions} from "@/components/custom/dashboard/quick-actions"
import {Package, User, CreditCard, Star, Sparkles} from "lucide-react"

export default function DashboardPage() {
  const [activeTab, setActiveTab] = useState("orders")

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 relative overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-blue-400/20 to-purple-400/20 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-tr from-indigo-400/20 to-pink-400/20 rounded-full blur-3xl"></div>
      </div>

      <div className="relative container mx-auto px-4 py-8">
        {/* Enhanced Header */}
        <div className="mb-12 text-center">
          <div className="inline-flex items-center gap-2 mb-4">
            <div className="p-2 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg">
              <Sparkles className="h-6 w-6 text-white" />
            </div>
            <span className="text-sm font-medium text-blue-600 bg-blue-50 px-3 py-1 rounded-full">Welcome back!</span>
          </div>
          <h1 className="text-5xl font-bold bg-gradient-to-r from-gray-900 via-blue-900 to-purple-900 bg-clip-text text-transparent mb-3">
            My Dashboard
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Here&apos;s your personalized overview. Track orders, manage your profile, and discover new features.
          </p>
        </div>

        {/* Enhanced Stats Cards */}
        {/* <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <UserStats />
        </div> */}

        {/* Enhanced Main Content */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-8">
          <TabsList className="grid w-full grid-cols-4 bg-white/80 backdrop-blur-sm shadow-lg border border-white/20 rounded-xl p-1">
            {/* <TabsTrigger
              value="overview"
              className="flex items-center gap-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-600 data-[state=active]:to-purple-600 data-[state=active]:text-white data-[state=active]:shadow-lg transition-all duration-300"
            >
              <Package className="h-4 w-4" />
              Overview
            </TabsTrigger> */}
            <TabsTrigger
              value="orders"
              className="flex items-center gap-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-600 data-[state=active]:to-purple-600 data-[state=active]:text-white data-[state=active]:shadow-lg transition-all duration-300"
            >
              <CreditCard className="h-4 w-4" />
              My Orders
            </TabsTrigger>
            <TabsTrigger
              value="profile"
              className="flex items-center gap-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-600 data-[state=active]:to-purple-600 data-[state=active]:text-white data-[state=active]:shadow-lg transition-all duration-300"
            >
              <User className="h-4 w-4" />
              Profile
            </TabsTrigger>
            {/* <TabsTrigger
              value="reviews"
              className="flex items-center gap-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-600 data-[state=active]:to-purple-600 data-[state=active]:text-white data-[state=active]:shadow-lg transition-all duration-300"
            >
              <Star className="h-4 w-4" />
              Reviews
            </TabsTrigger> */}
          </TabsList>

          {/* <TabsContent value="overview" className="space-y-8">
            <div className="grid gap-8 md:grid-cols-2">
              <Card className="bg-white/80 backdrop-blur-sm shadow-xl border border-white/20 hover:shadow-2xl transition-all duration-300 group">
                <CardHeader className="pb-4">
                  <CardTitle className="flex items-center gap-3 text-xl">
                    <div className="p-2 bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg group-hover:scale-110 transition-transform duration-300">
                      <Package className="h-5 w-5 text-white" />
                    </div>
                    Recent Orders
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <UserOrders />
                </CardContent>
              </Card>

              <Card className="bg-white/80 backdrop-blur-sm shadow-xl border border-white/20 hover:shadow-2xl transition-all duration-300 group">
                <CardHeader className="pb-4">
                  <CardTitle className="flex items-center gap-3 text-xl">
                    <div className="p-2 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-lg group-hover:scale-110 transition-transform duration-300">
                      <Star className="h-5 w-5 text-white" />
                    </div>
                    Recent Reviews
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-12 text-gray-500">
                    <div className="relative">
                      <Star className="h-16 w-16 mx-auto mb-4 text-gray-300" />
                      <div className="absolute inset-0 bg-gradient-to-r from-yellow-400 to-orange-400 rounded-full blur-xl opacity-20"></div>
                    </div>
                    <p className="text-lg font-medium mb-2">No reviews yet</p>
                    <p className="text-sm">Start shopping to leave reviews!</p>
                  </div>
                </CardContent>
              </Card>
            </div>

           
            <QuickActions />
          </TabsContent> */}

          <TabsContent value="orders">
            <Card className="bg-white/80 backdrop-blur-sm shadow-xl border border-white/20">
              <CardHeader>
                <CardTitle className="flex items-center gap-3 text-2xl">
                  <div className="p-3 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl">
                    <CreditCard className="h-6 w-6 text-white" />
                  </div>
                  My Orders
                </CardTitle>
              </CardHeader>
              <CardContent>
                <UserOrders />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="profile">
            <UserProfile />
          </TabsContent>

          {/* <TabsContent value="reviews">
            <Card className="bg-white/80 backdrop-blur-sm shadow-xl border border-white/20">
              <CardHeader>
                <CardTitle className="flex items-center gap-3 text-2xl">
                  <div className="p-3 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-xl">
                    <Star className="h-6 w-6 text-white" />
                  </div>
                  My Reviews
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-16 text-gray-500">
                  <div className="relative mb-6">
                    <Star className="h-20 w-20 mx-auto text-gray-300" />
                    <div className="absolute inset-0 bg-gradient-to-r from-yellow-400 to-orange-400 rounded-full blur-2xl opacity-20"></div>
                  </div>
                  <p className="text-xl font-medium mb-3">No reviews yet</p>
                  <p className="text-base">Start shopping to leave reviews for products you love!</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent> */}
        </Tabs>
      </div>
    </div>
  )
}
