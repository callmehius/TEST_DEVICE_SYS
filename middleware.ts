import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export function middleware(request: NextRequest) {
  // Get the pathname
  const path = request.nextUrl.pathname

  // Public paths that don't require authentication
  const isPublicPath = path === "/login" || path === "/"

  // Check if user is authenticated
  // For demo purposes, we'll set a cookie when user logs in
  const isAuthenticated = request.cookies.has("auth_token")

  // If the path is public and user is authenticated, redirect to appropriate page
  if (isPublicPath && isAuthenticated) {
    // Get user role from cookie
    const userRole = request.cookies.get("user_role")?.value || "user"

    // Redirect based on role
    if (userRole === "admin") {
      return NextResponse.redirect(new URL("/admin", request.url))
    } else {
      return NextResponse.redirect(new URL("/device-check", request.url))
    }
  }

  // If the path requires authentication and user is not authenticated, redirect to login
  if (!isPublicPath && !isAuthenticated) {
    return NextResponse.redirect(new URL("/login", request.url))
  }

  // If user is trying to access admin pages but doesn't have admin role
  if (path.startsWith("/admin") && isAuthenticated) {
    const userRole = request.cookies.get("user_role")?.value || "user"
    if (userRole !== "admin") {
      return NextResponse.redirect(new URL("/device-check", request.url))
    }
  }

  return NextResponse.next()
}

// See "Matching Paths" below to learn more
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    "/((?!_next/static|_next/image|favicon.ico).*)",
  ],
}
