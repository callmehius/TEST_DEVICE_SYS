"use client"

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

  // Kiểm tra cookie và tự động redirect nếu đã đăng nhập
useEffect(() => {
  const allCookies = document.cookie
  const hasAuthCookie = allCookies.includes("auth_token=")

  if (hasAuthCookie) {
    const isAdmin = allCookies.includes("user_role=admin")
    router.push(isAdmin ? "/admin" : "/device-check")
    return
  }

  // 🆕 Check nếu có mã `code` từ Azure redirect về
  const urlParams = new URLSearchParams(window.location.search)
  const code = urlParams.get("code")

  if (code) {
    console.log("🔁 Nhận được code từ Azure:", code)
    setIsLoading(true)

    fetch("https://hoclieudethi.vlu.edu.vn/api/Auth/sso-callback", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ code })
    })
      .then(res => res.json())
      .then(data => {
        if (data?.token) {
          // 🧠 Có thể lưu token vào localStorage nếu dùng Authorization header
          setCookie("auth_token", data.token, 7)
          setCookie("user_role", data.role, 7)
          console.log("✅ Đăng nhập SSO thành công:", data)

          router.push(data.role === "admin" ? "/admin" : "/device-check")
        } else {
          alert("❌ Không lấy được token từ SSO")
        }
      })
      .catch(err => {
        console.error("❌ Lỗi khi gọi sso-callback:", err)
        alert("Lỗi xác thực")
      })
      .finally(() => setIsLoading(false))
  }
}, [router])


  // Xử lý đăng nhập thường
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    setTimeout(() => {
      const isAdmin = username.toLowerCase().includes("admin")
      const role = isAdmin ? "admin" : "user"

      // Đặt cookie (dùng JS để chắc chắn có)
      setCookie("auth_token", "demo_token_" + Date.now(), 7)
      setCookie("user_role", role, 7)

      console.log("✅ Cookie sau login thường:", document.cookie)

      router.push(isAdmin ? "/admin" : "/device-check")
      setIsLoading(false)
    }, 1500)
  }

  // Xử lý đăng nhập SSO
  const handleSSOLogin = async () => {
    setIsLoading(true)
    try {
      const res = await fetch("https://hoclieudethi.vlu.edu.vn/api/Auth/sso-url", {
        method: "GET",
        headers: {
          "Accept": "application/json"
        }
      })
      const text = await res.text()

      console.log("📦 Raw response:", text)
      console.log("🔍 Status:", res.status)
      console.log("🔍 Content-Type:", res.headers.get("content-type"))

      const data = JSON.parse(text)

      // Điều hướng người dùng đến Azure AD để đăng nhập
      window.location.href = data.ssoUrl
    } catch (err) {
      console.error("❌ Lỗi khi gọi API hoặc JSON parse:", err)
      alert("Không thể khởi tạo đăng nhập SSO")
      setIsLoading(false)
    }
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4 bg-gray-50">
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold">Đăng Nhập</CardTitle>
          <CardDescription>Đăng nhập để tiếp tục sử dụng hệ thống</CardDescription>
        </CardHeader>
        <CardContent>

          <Button variant="outline" className="w-full" onClick={handleSSOLogin} disabled={isLoading}>
            {isLoading ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Đang xử lý...</> : "Đăng nhập với tài khoản VLU"}
          </Button>
        </CardContent>
        <CardFooter className="text-center text-sm text-muted-foreground">
          Hệ thống sẽ tự động chuyển hướng sau khi đăng nhập thành công.
        </CardFooter>
      </Card>
    </main>
  )
}
