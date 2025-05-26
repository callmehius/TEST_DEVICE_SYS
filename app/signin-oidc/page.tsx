"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { setCookie } from "@/lib/cookies"

export default function SsoCallbackPage() {
  const router = useRouter()

  useEffect(() => {
    // ✅ Lấy code bằng window.location vì useSearchParams có thể delay
    const query = new URLSearchParams(window.location.search)
    const code = query.get("code")
    const state = query.get("state")

    console.log("🔑 Mã code:", code)
    if (!code) {
      alert("Không tìm thấy mã code trong URL.")
      router.push("/")
      return
    }

    const exchangeCode = async () => {
      try {
        console.log("📡 Gửi mã code tới backend:", code)

        const res = await fetch("https://localhost:7217/api/Auth/sso-callback", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ code }),
          credentials: "include",
        })

        const result = await res.json()
        console.log("✅ Phản hồi từ server:", result)
        debugger
        if (!result.token || !result.role) {
          throw new Error("Phản hồi không hợp lệ từ backend")
        }

        setCookie("auth_token", result.token, 7)
        setCookie("user_role", result.role, 7)
        setCookie("email", result.email, 7)

        console.log("🍪 Cookie sau khi lưu:", document.cookie)

        router.push(result.role === "admin" ? "/admin" : "/device-check")
      } catch (err) {
        console.error("❌ Lỗi xác thực SSO:", err)
        alert("Xác thực thất bại.")
        router.push("/")
      }
    }

    exchangeCode()
  }, [router])

  return (
    <div className="p-4 text-center">
      Đang xác thực tài khoản SSO...
    </div>
  )
}
