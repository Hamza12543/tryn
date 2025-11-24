import type {Metadata} from "next"
import {Geist, Geist_Mono} from "next/font/google"
import "./globals.css"
import AnnouncementBanner from "@/components/custom/announcement-banner"
import Navbar from "@/components/custom/navbar"
import {Suspense} from "react"
import Footer from "@/components/custom/footer"
import {headers} from "next/headers"
import {Toaster} from "sonner"
import {Providers} from "@/components/providers"

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
})

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
})

export const metadata: Metadata = {
  title: "TRYN - The best place to buy gym products",
  description: "TRYN - The best place to buy gym products",
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const headersList = headers()
  const isAdminRoute = headersList.get("x-is-admin") === "true"

  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased ${isAdminRoute ? "admin" : ""}`}>
        <Providers>
          {!isAdminRoute && (
            <>
              <AnnouncementBanner />
              <Suspense fallback={<div className="h-16 border-b bg-white" />}>
                <Navbar />
              </Suspense>
            </>
          )}
          {children}
          {!isAdminRoute && (
            <Suspense fallback={<div className="h-16 border-t bg-white" />}>
              <Footer />
            </Suspense>
          )}
          <Toaster />
        </Providers>
      </body>
    </html>
  )
}
