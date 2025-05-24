"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Loader2 } from "lucide-react"
import { setCookie } from "@/lib/cookies"

export default function LoginPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")

  // Check if already logged in
  useEffect(() => {
    // For demo purposes, check if auth cookie exists
    const hasAuthCookie = document.cookie.includes("auth_token=")
    if (hasAuthCookie) {
      // Check role
      const isAdmin = document.cookie.includes("user_role=admin")
      if (isAdmin) {
        router.push("/admin")
      } else {
        router.push("/device-check")
      }
    }
  }, [router])

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    // Simulate SSO authentication
    setTimeout(() => {
      setIsLoading(false)

      // For demo purposes:
      // If username contains "admin", redirect to admin dashboard
      // Otherwise, redirect to device check
      const isAdmin = username.toLowerCase().includes("admin")
      const role = isAdmin ? "admin" : "user"

      // Set cookies instead of localStorage
      setCookie("auth_token", "demo_token_" + Date.now(), 7) // 7 days expiry
      setCookie("user_role", role, 7)

      if (isAdmin) {
        router.push("/admin")
      } else {
        router.push("/device-check")
      }
    }, 1500)
  }

  const handleSSOLogin = () => {
    setIsLoading(true)

    // Simulate SSO authentication
    setTimeout(() => {
      setIsLoading(false)

      // For demo purposes, randomly assign admin or user role
      // In a real app, this would come from the SSO provider
      const isAdmin = Math.random() > 0.8 // 20% chance to be admin
      const role = isAdmin ? "admin" : "user"

      // Set cookies instead of localStorage
      setCookie("auth_token", "demo_token_" + Date.now(), 7) // 7 days expiry
      setCookie("user_role", role, 7)

      if (isAdmin) {
        router.push("/admin")
      } else {
        router.push("/device-check")
      }
    }, 1500)
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4 bg-gray-50">
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold">Đăng Nhập</CardTitle>
          <CardDescription>Đăng nhập để tiếp tục sử dụng hệ thống</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="username">Tên đăng nhập</Label>
              <Input
                id="username"
                placeholder="Nhập tên đăng nhập"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Mật khẩu</Label>
              <Input
                id="password"
                type="password"
                placeholder="Nhập mật khẩu"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Đang đăng nhập...
                </>
              ) : (
                "Đăng nhập"
              )}
            </Button>
          </form>

          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-200"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="bg-white px-2 text-gray-500">Hoặc</span>
            </div>
          </div>

          <Button variant="outline" className="w-full" onClick={handleSSOLogin} disabled={isLoading}>
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Đang xử lý...
              </>
            ) : (
              "Đăng nhập với SSO"
            )}
          </Button>
        </CardContent>
        <CardFooter className="text-center text-sm text-muted-foreground">
          Hệ thống sẽ tự động chuyển hướng sau khi đăng nhập thành công.
        </CardFooter>
      </Card>
    </main>
  )
}
