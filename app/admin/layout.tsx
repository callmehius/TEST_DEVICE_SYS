import type React from "react"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Admin Dashboard - Kiểm Tra Tương Thích Thiết Bị",
  description: "Trang quản trị hệ thống kiểm tra tương thích thiết bị",
}

export default function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return <div className="min-h-screen bg-gray-100">{children}</div>
}
