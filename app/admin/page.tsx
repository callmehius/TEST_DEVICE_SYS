"use client"

import { useState } from "react"
import {
  BarChart3,
  Shield,
  Network,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Search,
  Download,
  RefreshCw,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { AdminLayout } from "@/components/admin-layout"

// Mock data for the dashboard
const stats = [
  { title: "Tổng số kiểm tra", value: "1,234", icon: BarChart3, change: "+12%", changeType: "positive" },
  { title: "Phát hiện VPN", value: "256", icon: Shield, change: "-5%", changeType: "positive" },
  { title: "Phát hiện IP tĩnh", value: "189", icon: Network, change: "+8%", changeType: "negative" },
  { title: "Vấn đề chưa xử lý", value: "45", icon: AlertTriangle, change: "-15%", changeType: "positive" },
]

const recentChecks = [
  {
    id: "CHK-1234",
    user: "Nguyễn Văn A",
    time: "10:30 AM, 20/05/2025",
    device: "Windows 11",
    ip: "192.168.1.100",
    status: "success",
    issues: [],
  },
  {
    id: "CHK-1233",
    user: "Trần Thị B",
    time: "10:15 AM, 20/05/2025",
    device: "macOS 14.1",
    ip: "192.168.1.101",
    status: "warning",
    issues: ["VPN"],
  },
  {
    id: "CHK-1232",
    user: "Lê Văn C",
    time: "10:00 AM, 20/05/2025",
    device: "Android 13",
    ip: "192.168.1.102",
    status: "warning",
    issues: ["IP tĩnh"],
  },
  {
    id: "CHK-1231",
    user: "Phạm Thị D",
    time: "09:45 AM, 20/05/2025",
    device: "iOS 17",
    ip: "192.168.1.103",
    status: "error",
    issues: ["VPN", "IP tĩnh"],
  },
  {
    id: "CHK-1230",
    user: "Hoàng Văn E",
    time: "09:30 AM, 20/05/2025",
    device: "Windows 10",
    ip: "192.168.1.104",
    status: "success",
    issues: [],
  },
]

export default function AdminDashboard() {
  const [searchQuery, setSearchQuery] = useState("")
  const [activeFilter, setActiveFilter] = useState("all")

  const filteredChecks = recentChecks.filter((check) => {
    // Apply search filter
    const matchesSearch =
      check.user.toLowerCase().includes(searchQuery.toLowerCase()) ||
      check.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      check.ip.toLowerCase().includes(searchQuery.toLowerCase())

    // Apply status filter
    const matchesFilter =
      activeFilter === "all" ||
      (activeFilter === "issues" && check.issues.length > 0) ||
      (activeFilter === "vpn" && check.issues.includes("VPN")) ||
      (activeFilter === "static" && check.issues.includes("IP tĩnh")) ||
      (activeFilter === "success" && check.status === "success")

    return matchesSearch && matchesFilter
  })

  return (
    <AdminLayout title="Dashboard Admin">
      <div className="grid gap-6">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, index) => (
            <Card key={index}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">{stat.title}</p>
                    <h3 className="text-2xl font-bold mt-1">{stat.value}</h3>
                  </div>
                  <div
                    className={`p-2 rounded-full ${
                      stat.title.includes("VPN")
                        ? "bg-blue-100"
                        : stat.title.includes("IP")
                          ? "bg-yellow-100"
                          : stat.title.includes("Vấn đề")
                            ? "bg-red-100"
                            : "bg-green-100"
                    }`}
                  >
                    <stat.icon
                      className={`h-5 w-5 ${
                        stat.title.includes("VPN")
                          ? "text-blue-600"
                          : stat.title.includes("IP")
                            ? "text-yellow-600"
                            : stat.title.includes("Vấn đề")
                              ? "text-red-600"
                              : "text-green-600"
                      }`}
                    />
                  </div>
                </div>
                <div className="mt-4">
                  <span
                    className={`text-xs font-medium ${
                      stat.changeType === "positive" ? "text-green-600" : "text-red-600"
                    }`}
                  >
                    {stat.change} so với tuần trước
                  </span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Main Content Tabs */}
        <Tabs defaultValue="recent" className="space-y-4">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <TabsList>
              <TabsTrigger value="recent">Kiểm tra gần đây</TabsTrigger>
              <TabsTrigger value="reports">Báo cáo</TabsTrigger>
              <TabsTrigger value="settings">Cài đặt</TabsTrigger>
            </TabsList>

            <div className="flex items-center gap-2 w-full sm:w-auto">
              <div className="relative flex-1 sm:flex-initial">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Tìm kiếm..."
                  className="pl-8 w-full sm:w-[250px]"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <Button variant="outline" size="icon">
                <RefreshCw className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="icon">
                <Download className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <TabsContent value="recent" className="space-y-4">
            <Card>
              <CardHeader className="pb-3">
                <div className="flex justify-between items-center">
                  <CardTitle>Danh sách kiểm tra gần đây</CardTitle>
                  <div className="flex gap-2">
                    <Button
                      variant={activeFilter === "all" ? "default" : "outline"}
                      size="sm"
                      onClick={() => setActiveFilter("all")}
                    >
                      Tất cả
                    </Button>
                    <Button
                      variant={activeFilter === "issues" ? "default" : "outline"}
                      size="sm"
                      onClick={() => setActiveFilter("issues")}
                    >
                      Có vấn đề
                    </Button>
                    <Button
                      variant={activeFilter === "vpn" ? "default" : "outline"}
                      size="sm"
                      onClick={() => setActiveFilter("vpn")}
                    >
                      VPN
                    </Button>
                    <Button
                      variant={activeFilter === "static" ? "default" : "outline"}
                      size="sm"
                      onClick={() => setActiveFilter("static")}
                    >
                      IP tĩnh
                    </Button>
                  </div>
                </div>
                <CardDescription>Danh sách các lần kiểm tra thiết bị gần đây và trạng thái của chúng.</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>ID</TableHead>
                      <TableHead>Người dùng</TableHead>
                      <TableHead>Thời gian</TableHead>
                      <TableHead>Thiết bị</TableHead>
                      <TableHead>Địa chỉ IP</TableHead>
                      <TableHead>Trạng thái</TableHead>
                      <TableHead>Hành động</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredChecks.length > 0 ? (
                      filteredChecks.map((check) => (
                        <TableRow key={check.id}>
                          <TableCell className="font-medium">{check.id}</TableCell>
                          <TableCell>{check.user}</TableCell>
                          <TableCell>{check.time}</TableCell>
                          <TableCell>{check.device}</TableCell>
                          <TableCell>{check.ip}</TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              {check.status === "success" ? (
                                <Badge variant="outline" className="bg-green-50 text-green-700 hover:bg-green-50">
                                  <CheckCircle className="h-3.5 w-3.5 mr-1" />
                                  Thành công
                                </Badge>
                              ) : check.status === "warning" ? (
                                <Badge variant="outline" className="bg-yellow-50 text-yellow-700 hover:bg-yellow-50">
                                  <AlertTriangle className="h-3.5 w-3.5 mr-1" />
                                  Cảnh báo
                                </Badge>
                              ) : (
                                <Badge variant="outline" className="bg-red-50 text-red-700 hover:bg-red-50">
                                  <XCircle className="h-3.5 w-3.5 mr-1" />
                                  Lỗi
                                </Badge>
                              )}

                              {check.issues.includes("VPN") && (
                                <Badge variant="outline" className="bg-blue-50 text-blue-700 hover:bg-blue-50">
                                  <Shield className="h-3.5 w-3.5 mr-1" />
                                  VPN
                                </Badge>
                              )}

                              {check.issues.includes("IP tĩnh") && (
                                <Badge variant="outline" className="bg-orange-50 text-orange-700 hover:bg-orange-50">
                                  <Network className="h-3.5 w-3.5 mr-1" />
                                  IP tĩnh
                                </Badge>
                              )}
                            </div>
                          </TableCell>
                          <TableCell>
                            <Button variant="ghost" size="sm">
                              Chi tiết
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={7} className="text-center py-6 text-muted-foreground">
                          Không tìm thấy kết quả phù hợp
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </CardContent>
              <CardFooter className="flex justify-between">
                <div className="text-sm text-muted-foreground">
                  Hiển thị {filteredChecks.length} trong tổng số {recentChecks.length} kết quả
                </div>
                <div className="flex gap-1">
                  <Button variant="outline" size="sm" disabled>
                    Trước
                  </Button>
                  <Button variant="outline" size="sm">
                    1
                  </Button>
                  <Button variant="outline" size="sm" disabled>
                    Sau
                  </Button>
                </div>
              </CardFooter>
            </Card>
          </TabsContent>

          <TabsContent value="reports" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Báo cáo thống kê</CardTitle>
                <CardDescription>
                  Thống kê về tình trạng kiểm tra thiết bị và các vấn đề phát hiện được.
                </CardDescription>
              </CardHeader>
              <CardContent className="h-[400px] flex items-center justify-center">
                <div className="text-center">
                  <BarChart3 className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-lg font-medium">Biểu đồ thống kê</h3>
                  <p className="text-sm text-muted-foreground mt-2">
                    Biểu đồ thống kê về tình trạng kiểm tra thiết bị sẽ được hiển thị ở đây.
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="settings" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Cài đặt hệ thống</CardTitle>
                <CardDescription>Quản lý cài đặt cho hệ thống kiểm tra thiết bị.</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid gap-2">
                    <h3 className="text-lg font-medium">Cài đặt kiểm tra VPN</h3>
                    <div className="grid gap-4">
                      <div className="flex items-center justify-between border p-4 rounded-lg">
                        <div>
                          <h4 className="font-medium">Phát hiện VPN tự động</h4>
                          <p className="text-sm text-muted-foreground">
                            Tự động phát hiện kết nối VPN khi người dùng truy cập hệ thống
                          </p>
                        </div>
                        <div className="flex items-center h-5">
                          <input
                            id="vpn-detection"
                            type="checkbox"
                            defaultChecked
                            className="h-4 w-4 rounded border-gray-300"
                          />
                        </div>
                      </div>

                      <div className="flex items-center justify-between border p-4 rounded-lg">
                        <div>
                          <h4 className="font-medium">Chặn truy cập khi phát hiện VPN</h4>
                          <p className="text-sm text-muted-foreground">
                            Chặn người dùng truy cập hệ thống khi phát hiện kết nối VPN
                          </p>
                        </div>
                        <div className="flex items-center h-5">
                          <input id="vpn-block" type="checkbox" className="h-4 w-4 rounded border-gray-300" />
                        </div>
                      </div>

                      <div className="flex items-center justify-between border p-4 rounded-lg">
                        <div>
                          <h4 className="font-medium">Cho phép tự động khắc phục</h4>
                          <p className="text-sm text-muted-foreground">
                            Cho phép hệ thống tự động khắc phục vấn đề VPN khi phát hiện
                          </p>
                        </div>
                        <div className="flex items-center h-5">
                          <input
                            id="vpn-auto-fix"
                            type="checkbox"
                            defaultChecked
                            className="h-4 w-4 rounded border-gray-300"
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="grid gap-2">
                    <h3 className="text-lg font-medium">Cài đặt kiểm tra IP tĩnh</h3>
                    <div className="grid gap-4">
                      <div className="flex items-center justify-between border p-4 rounded-lg">
                        <div>
                          <h4 className="font-medium">Phát hiện IP tĩnh tự động</h4>
                          <p className="text-sm text-muted-foreground">
                            Tự động phát hiện IP tĩnh khi người dùng truy cập hệ thống
                          </p>
                        </div>
                        <div className="flex items-center h-5">
                          <input
                            id="static-ip-detection"
                            type="checkbox"
                            defaultChecked
                            className="h-4 w-4 rounded border-gray-300"
                          />
                        </div>
                      </div>

                      <div className="flex items-center justify-between border p-4 rounded-lg">
                        <div>
                          <h4 className="font-medium">Chặn truy cập khi phát hiện IP tĩnh</h4>
                          <p className="text-sm text-muted-foreground">
                            Chặn người dùng truy cập hệ thống khi phát hiện IP tĩnh
                          </p>
                        </div>
                        <div className="flex items-center h-5">
                          <input id="static-ip-block" type="checkbox" className="h-4 w-4 rounded border-gray-300" />
                        </div>
                      </div>

                      <div className="flex items-center justify-between border p-4 rounded-lg">
                        <div>
                          <h4 className="font-medium">Cho phép tự động khắc phục</h4>
                          <p className="text-sm text-muted-foreground">
                            Cho phép hệ thống tự động khắc phục vấn đề IP tĩnh khi phát hiện
                          </p>
                        </div>
                        <div className="flex items-center h-5">
                          <input
                            id="static-ip-auto-fix"
                            type="checkbox"
                            defaultChecked
                            className="h-4 w-4 rounded border-gray-300"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-end gap-2">
                <Button variant="outline">Hủy</Button>
                <Button>Lưu thay đổi</Button>
              </CardFooter>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </AdminLayout>
  )
}
