"use client"

import { useState } from "react"
import { AlertTriangle, Check, Network, Shield, ArrowRight, ExternalLink } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

interface DetectionModalProps {
  open: boolean
  onClose: () => void
  hasStaticIP: boolean
  hasVPN: boolean
  onFixAutomatically: () => void
  onContinueAnyway: () => void
}

export function DetectionModal({
  open,
  onClose,
  hasStaticIP,
  hasVPN,
  onFixAutomatically,
  onContinueAnyway,
}: DetectionModalProps) {
  const [activeTab, setActiveTab] = useState<string>(hasStaticIP ? "static-ip" : "vpn")
  const [fixing, setFixing] = useState<boolean>(false)
  const [fixed, setFixed] = useState<boolean>(false)

  const handleFixAutomatically = () => {
    setFixing(true)
    // Simulate fixing process
    setTimeout(() => {
      setFixing(false)
      setFixed(true)
      // Simulate completion
      setTimeout(() => {
        onFixAutomatically()
      }, 1500)
    }, 2000)
  }

  return (
    <Dialog open={open} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center justify-center mb-2">
            <div className="h-12 w-12 rounded-full bg-yellow-100 flex items-center justify-center">
              <AlertTriangle className="h-6 w-6 text-yellow-600" />
            </div>
          </div>
          <DialogTitle className="text-center text-xl">
            {hasStaticIP && hasVPN
              ? "Phát hiện IP tĩnh và VPN"
              : hasStaticIP
                ? "Phát hiện IP tĩnh"
                : "Phát hiện kết nối VPN"}
          </DialogTitle>
          <DialogDescription className="text-center">
            Hệ thống đã phát hiện cấu hình mạng có thể ảnh hưởng đến quá trình kiểm tra
          </DialogDescription>
        </DialogHeader>

        {!fixed ? (
          <>
            <div className="bg-yellow-50 p-4 rounded-lg mb-4">
              <div className="flex items-start">
                <AlertTriangle className="h-5 w-5 text-yellow-600 mt-0.5 mr-2 flex-shrink-0" />
                <div>
                  <h4 className="font-medium text-yellow-800">Vấn đề phát hiện:</h4>
                  <ul className="mt-1 list-disc list-inside text-sm space-y-1 text-yellow-700">
                    {hasStaticIP && (
                      <li>
                        IP tĩnh có thể gây ra vấn đề kết nối với máy chủ kiểm tra và ảnh hưởng đến quá trình làm bài
                      </li>
                    )}
                    {hasVPN && (
                      <li>
                        Kết nối VPN có thể làm chậm kết nối, gây mất kết nối đột ngột hoặc bị chặn bởi hệ thống bảo mật
                      </li>
                    )}
                  </ul>
                </div>
              </div>
            </div>

            {hasStaticIP && hasVPN && (
              <Tabs defaultValue={activeTab} onValueChange={setActiveTab} className="mb-4">
                <TabsList className="grid grid-cols-2">
                  <TabsTrigger value="static-ip">IP Tĩnh</TabsTrigger>
                  <TabsTrigger value="vpn">VPN</TabsTrigger>
                </TabsList>
                <TabsContent value="static-ip" className="pt-4">
                  <div className="space-y-4">
                    <div className="flex items-center gap-3 bg-gray-50 p-3 rounded-lg">
                      <Network className="h-8 w-8 text-gray-500" />
                      <div>
                        <h3 className="font-medium">IP tĩnh được phát hiện</h3>
                        <p className="text-sm text-gray-500">
                          Thiết bị của bạn đang sử dụng địa chỉ IP cố định thay vì tự động
                        </p>
                      </div>
                    </div>
                    <div className="rounded-lg border overflow-hidden">
                      <div className="bg-gray-50 p-3 border-b">
                        <h3 className="font-medium">Hình ảnh minh họa IP tĩnh</h3>
                      </div>
                      <div className="p-4 flex justify-center">
                        <div className="relative h-[200px] w-full max-w-[300px] bg-gray-100 rounded flex items-center justify-center">
                          <div className="text-center p-4">
                            <Network className="h-10 w-10 text-gray-400 mx-auto mb-2" />
                            <p className="text-sm text-gray-500">Hình ảnh minh họa IP tĩnh</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </TabsContent>
                <TabsContent value="vpn" className="pt-4">
                  <div className="space-y-4">
                    <div className="flex items-center gap-3 bg-gray-50 p-3 rounded-lg">
                      <Shield className="h-8 w-8 text-gray-500" />
                      <div>
                        <h3 className="font-medium">Kết nối VPN được phát hiện</h3>
                        <p className="text-sm text-gray-500">
                          Thiết bị của bạn đang sử dụng mạng riêng ảo (VPN) để kết nối internet
                        </p>
                      </div>
                    </div>
                    <div className="rounded-lg border overflow-hidden">
                      <div className="bg-gray-50 p-3 border-b">
                        <h3 className="font-medium">Hình ảnh minh họa kết nối VPN</h3>
                      </div>
                      <div className="p-4 flex justify-center">
                        <div className="relative h-[200px] w-full max-w-[300px] bg-gray-100 rounded flex items-center justify-center">
                          <div className="text-center p-4">
                            <Shield className="h-10 w-10 text-gray-400 mx-auto mb-2" />
                            <p className="text-sm text-gray-500">Hình ảnh minh họa kết nối VPN</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            )}

            {!hasVPN && hasStaticIP && (
              <div className="space-y-4 mb-4">
                <div className="flex items-center gap-3 bg-gray-50 p-3 rounded-lg">
                  <Network className="h-8 w-8 text-gray-500" />
                  <div>
                    <h3 className="font-medium">IP tĩnh được phát hiện</h3>
                    <p className="text-sm text-gray-500">
                      Thiết bị của bạn đang sử dụng địa chỉ IP cố định thay vì tự động
                    </p>
                  </div>
                </div>
                <div className="rounded-lg border overflow-hidden">
                  <div className="bg-gray-50 p-3 border-b">
                    <h3 className="font-medium">Hình ảnh minh họa IP tĩnh</h3>
                  </div>
                  <div className="p-4 flex justify-center">
                    <div className="relative h-[200px] w-full max-w-[300px] bg-gray-100 rounded flex items-center justify-center">
                      <div className="text-center p-4">
                        <Network className="h-10 w-10 text-gray-400 mx-auto mb-2" />
                        <p className="text-sm text-gray-500">Hình ảnh minh họa IP tĩnh</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {hasVPN && !hasStaticIP && (
              <div className="space-y-4 mb-4">
                <div className="flex items-center gap-3 bg-gray-50 p-3 rounded-lg">
                  <Shield className="h-8 w-8 text-gray-500" />
                  <div>
                    <h3 className="font-medium">Kết nối VPN được phát hiện</h3>
                    <p className="text-sm text-gray-500">
                      Thiết bị của bạn đang sử dụng mạng riêng ảo (VPN) để kết nối internet
                    </p>
                  </div>
                </div>
                <div className="rounded-lg border overflow-hidden">
                  <div className="bg-gray-50 p-3 border-b">
                    <h3 className="font-medium">Hình ảnh minh họa kết nối VPN</h3>
                  </div>
                  <div className="p-4 flex justify-center">
                    <div className="relative h-[200px] w-full max-w-[300px] bg-gray-100 rounded flex items-center justify-center">
                      <div className="text-center p-4">
                        <Shield className="h-10 w-10 text-gray-400 mx-auto mb-2" />
                        <p className="text-sm text-gray-500">Hình ảnh minh họa kết nối VPN</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            <div className="space-y-4">
              <div className="flex flex-col gap-2">
                <Button
                  onClick={handleFixAutomatically}
                  className="bg-yellow-600 hover:bg-yellow-700 gap-2"
                  disabled={fixing}
                >
                  {fixing ? (
                    <>
                      <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                      Đang xử lý...
                    </>
                  ) : (
                    <>
                      <Check className="h-4 w-4" />
                      Tự động khắc phục vấn đề
                    </>
                  )}
                </Button>
                <Button variant="outline" onClick={onClose} className="gap-2">
                  <ExternalLink className="h-4 w-4" />
                  Xem hướng dẫn thủ công
                </Button>
                <Button variant="ghost" onClick={onContinueAnyway} className="text-gray-500 gap-2">
                  <ArrowRight className="h-4 w-4" />
                  Tiếp tục mà không sửa
                </Button>
              </div>
            </div>
          </>
        ) : (
          <div className="py-6 flex flex-col items-center justify-center">
            <div className="h-16 w-16 rounded-full bg-green-100 flex items-center justify-center mb-4">
              <Check className="h-8 w-8 text-green-600" />
            </div>
            <h3 className="text-xl font-medium text-center">Đã khắc phục thành công!</h3>
            <p className="text-center text-gray-500 mt-2 mb-6">
              Cấu hình mạng của bạn đã được thiết lập về chế độ tự động.
            </p>
            <Button onClick={onClose} className="bg-green-600 hover:bg-green-700">
              Tiếp tục
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}
