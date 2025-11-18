import {NextResponse} from "next/server"
import type {NextRequest} from "next/server"
import {getToken} from "next-auth/jwt"

export async function middleware(request: NextRequest) {
  const {pathname} = request.nextUrl

  // Role-based protection for /admin/*
  if (pathname.startsWith("/admin")) {
    const token = await getToken({req: request})
    if (!token) {
      const loginUrl = new URL("/login", request.url)
      loginUrl.searchParams.set("callbackUrl", pathname)
      return NextResponse.redirect(loginUrl)
    }
    if (token.role !== "ADMIN") {
      return NextResponse.redirect(new URL("/dashboard", request.url))
    }
    const response = NextResponse.next()
    response.headers.set("x-is-admin", "true")
    return response
  }

  // Role-based protection for /dashboard/*
  if (pathname.startsWith("/dashboard")) {
    const token = await getToken({req: request})
    if (!token) {
      const loginUrl = new URL("/login", request.url)
      loginUrl.searchParams.set("callbackUrl", pathname)
      return NextResponse.redirect(loginUrl)
    }
    if (token.role !== "CUSTOMER") {
      return NextResponse.redirect(new URL("admin/orders", request.url))
    }
  }
  
  // Allow guest checkout - explicitly skip middleware for checkout path
  if (pathname.startsWith("/checkout")) {
    return NextResponse.next()
  }

  // Redirect authenticated users away from auth pages
  const authRoutes = ["/login", "/signup"]
  const isAuthRoute = authRoutes.some((route) => pathname.startsWith(route))

  if (isAuthRoute) {
    const token = await getToken({req: request})
    if (token) {
      if (token.role === "ADMIN") {
        return NextResponse.redirect(new URL("admin/orders", request.url))
      } else {
        return NextResponse.redirect(new URL("/dashboard", request.url))
      }
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
}
