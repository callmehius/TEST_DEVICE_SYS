import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export function middleware(request: NextRequest) {
  debugger
  const path = request.nextUrl.pathname
  const isPublicPath = path === "/login" || path === "/" || path === "/signin-oidc"


  const token = request.cookies.get("auth_token")?.value
  const role = request.cookies.get("user_role")?.value

  const isAuthenticated = Boolean(token)

  // 🧪 Debug khi cần
  // console.log("⛔️ Middleware check:", { path, isAuthenticated, role })

  // ✅ Nếu user đã đăng nhập và đang vào /login hoặc /
  if (isPublicPath && isAuthenticated) {
    if (role === "admin") {
      return NextResponse.redirect(new URL("/admin", request.url))
    } else {
      return NextResponse.redirect(new URL("/device-check", request.url))
    }
  }

  // ✅ Nếu chưa login và vào trang không công khai
  if (!isPublicPath && !isAuthenticated) {
    return NextResponse.redirect(new URL("/login", request.url))
  }

  // ✅ Nếu là trang admin nhưng user không phải admin
  if (path.startsWith("/admin") && role !== "admin") {
    return NextResponse.redirect(new URL("/device-check", request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
}
