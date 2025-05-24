"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Loader2 } from "lucide-react"

export default function Home() {
  const router = useRouter()

  useEffect(() => {
    // Simulate SSO authentication check
    const checkAuth = setTimeout(() => {
      // Redirect to login if not authenticated
      router.push("/login")
    }, 1500)

    return () => clearTimeout(checkAuth)
  }, [router])

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4 bg-gray-50">
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold">Hệ Thống Kiểm Tra Thiết Bị</CardTitle>
          <CardDescription>Đang kiểm tra trạng thái đăng nhập...</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col items-center justify-center py-8">
          <Loader2 className="h-12 w-12 animate-spin text-primary" />
        </CardContent>
        <CardFooter className="text-center text-sm text-muted-foreground">
          Bạn sẽ được chuyển hướng đến trang đăng nhập nếu chưa xác thực.
        </CardFooter>
      </Card>
    </main>
  )
}
