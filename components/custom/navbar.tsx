"use client"

import {Menu, Search, ShoppingCart, User, Settings, LogOut, Package, LogIn, UserPlus} from "lucide-react"
import Link from "next/link"
import {useState} from "react"
import clsx from "clsx"
import {useSession, signOut} from "next-auth/react"

import {Button} from "@/components/ui/button"
import {Sheet, SheetContent, SheetTrigger} from "@/components/ui/sheet"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {Avatar, AvatarFallback, AvatarImage} from "@/components/ui/avatar"
import CartButton from "./CartButton"

const navigationItems = [
  {name: "Home", href: "/", active: true},
  {name: "Shop", href: "/shop", active: false},
  {name: "Sale", href: "/sale", active: false},
  {name: "Tryn Rewards", href: "/rewards", active: false},
  {name: "Wholesale", href: "/whole-sale-inquiry", active: false},
]

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const {data: session, status} = useSession()
  const user = session?.user
  const isAuthenticated = status === "authenticated"

  return (
    <header className="w-full bg-white">
      <div className="flex h-16 items-center justify-between px-4 md:px-6 lg:px-8">
        {/* Logo */}
        <div className="flex items-center">
          <Link href="/" className="text-2xl font-bold text-black">
            TRYN
          </Link>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-1">
          {navigationItems.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className={clsx(
                "px-4 py-2 text-sm font-medium transition-colors",
                item.active ? "bg-primary text-white" : "text-[#252F34] hover:text-white hover:bg-primary"
              )}
            >
              {item.name}
            </Link>
          ))}
        </nav>

        {/* Right Side Icons */}
        <div className="flex items-center space-x-2">
          {/* Desktop Icons - Hidden on mobile */}
          <div className="hidden md:flex items-center space-x-2">
            <Button variant="ghost" size="icon" className="h-9 w-9">
              <Search className="h-5 w-5" />
              <span className="sr-only">Search</span>
            </Button>
            <CartButton />

            {/* User Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="h-9 w-9">
                  <User className="h-5 w-5" />
                  <span className="sr-only">Account</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end" forceMount>
                {isAuthenticated ? (
                  <>
                    <DropdownMenuLabel className="font-normal">
                      <div className="flex flex-col space-y-1">
                        <p className="text-sm font-medium leading-none">{user?.name || "Account"}</p>
                        <p className="text-xs leading-none text-muted-foreground">{user?.email || ""}</p>
                      </div>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild>
                      <Link href="/dashboard" className="flex items-center">
                        <Package className="mr-2 h-4 w-4" />
                        <span>My Dashboard</span>
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Settings className="mr-2 h-4 w-4" />
                      <span>Settings</span>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => signOut({callbackUrl: "/login"})}>
                      <LogOut className="mr-2 h-4 w-4" />
                      <span>Log out</span>
                    </DropdownMenuItem>
                  </>
                ) : (
                  <>
                    <DropdownMenuLabel className="font-normal">
                      <div className="flex flex-col space-y-1">
                        <p className="text-sm font-medium leading-none">Account</p>
                        <p className="text-xs leading-none text-muted-foreground">Sign in to access your account</p>
                      </div>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild>
                      <Link href="/login" className="flex items-center">
                        <LogIn className="mr-2 h-4 w-4" />
                        <span>Sign In</span>
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href="/signup" className="flex items-center">
                        <UserPlus className="mr-2 h-4 w-4" />
                        <span>Sign Up</span>
                      </Link>
                    </DropdownMenuItem>
                  </>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* Mobile Icons - Show cart on mobile */}
          <div className="flex md:hidden items-center space-x-2">
            <Button variant="ghost" size="icon" className="relative h-9 w-9">
              <ShoppingCart className="h-5 w-5" />
              <span className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-black text-xs text-white flex items-center justify-center">
                0
              </span>
              <span className="sr-only">Shopping cart</span>
            </Button>
          </div>

          {/* Mobile Menu Button - Always visible on mobile */}
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden h-9 w-9 hover:bg-gray-100">
                <Menu className="h-5 w-5 text-black" />
                <span className="sr-only">Toggle menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[300px] sm:w-[400px] border-l-0" title="Navigation Menu">
              <div className="flex flex-col space-y-4 mt-6">
                {/* Mobile Navigation Links */}
                <nav className="flex flex-col space-y-2">
                  {navigationItems.map((item) => (
                    <Link
                      key={item.name}
                      href={item.href}
                      onClick={() => setIsOpen(false)}
                      className={clsx(
                        "px-4 py-3 text-base font-medium transition-colors",
                        item.active ? "bg-primary text-white" : "text-[#252F34] hover:text-white hover:bg-primary"
                      )}
                    >
                      {item.name}
                    </Link>
                  ))}
                </nav>

                {/* Mobile User Section */}
                <div className="pt-6 border-t">
                  {isAuthenticated ? (
                    <>
                      <div className="flex items-center space-x-3 mb-4">
                        <Avatar className="h-10 w-10">
                          <AvatarImage src={user?.image || "/avatars/default.jpg"} alt={user?.name || "User"} />
                          <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white">
                            {user?.name
                              ? user.name
                                  .split(" ")
                                  .map((n) => n[0])
                                  .join("")
                              : "U"}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="text-sm font-medium">{user?.name || "Account"}</p>
                          <p className="text-xs text-gray-500">{user?.email || ""}</p>
                        </div>
                      </div>
                      <div className="flex flex-col space-y-2">
                        <Link
                          href="/dashboard"
                          onClick={() => setIsOpen(false)}
                          className="flex items-center px-4 py-2 text-sm font-medium text-[#252F34] hover:text-white hover:bg-primary transition-colors"
                        >
                          <Package className="mr-3 h-4 w-4" />
                          My Dashboard
                        </Link>
                        <button
                          onClick={() => {
                            setIsOpen(false)
                            signOut({callbackUrl: "/login"})
                          }}
                          className="flex items-center px-4 py-2 text-sm font-medium text-[#252F34] hover:text-white hover:bg-primary transition-colors"
                        >
                          <Settings className="mr-3 h-4 w-4" />
                          Settings
                        </button>
                        <button
                          onClick={() => {
                            setIsOpen(false)
                            signOut({callbackUrl: "/login"})
                          }}
                          className="flex items-center px-4 py-2 text-sm font-medium text-[#252F34] hover:text-white hover:bg-primary transition-colors"
                        >
                          <LogOut className="mr-3 h-4 w-4" />
                          Log out
                        </button>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="flex items-center space-x-3 mb-4">
                        <Avatar className="h-10 w-10">
                          <AvatarFallback className="bg-gradient-to-br from-gray-400 to-gray-600 text-white">
                            U
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="text-sm font-medium">Account</p>
                          <p className="text-xs text-gray-500">Sign in to access your account</p>
                        </div>
                      </div>
                      <div className="flex flex-col space-y-2">
                        <Link
                          href="/login"
                          onClick={() => setIsOpen(false)}
                          className="flex items-center px-4 py-2 text-sm font-medium text-[#252F34] hover:text-white hover:bg-primary transition-colors"
                        >
                          <LogIn className="mr-3 h-4 w-4" />
                          Sign In
                        </Link>
                        <Link
                          href="/signup"
                          onClick={() => setIsOpen(false)}
                          className="flex items-center px-4 py-2 text-sm font-medium text-[#252F34] hover:text-white hover:bg-primary transition-colors"
                        >
                          <UserPlus className="mr-3 h-4 w-4" />
                          Sign Up
                        </Link>
                      </div>
                    </>
                  )}
                </div>

                {/* Mobile Icons */}
                <div className="flex items-center justify-center space-x-4 pt-6 border-t">
                  <Button variant="ghost" size="icon" className="h-10 w-10">
                    <Search className="h-5 w-5" />
                    <span className="sr-only">Search</span>
                  </Button>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  )
}
