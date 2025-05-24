"use client"

import { useState } from "react"
import { MapPin } from "lucide-react"

export function VpnGeographicMap() {
  const [activePoint, setActivePoint] = useState<string | null>(null)

  // Mock data for VPN server locations
  const locations = [
    { id: "sg", name: "Singapore", x: 76.5, y: 55, size: 28.5 },
    { id: "us", name: "Hoa Kỳ", x: 20, y: 40, size: 22.3 },
    { id: "jp", name: "Nhật Bản", x: 82, y: 40, size: 15.7 },
    { id: "hk", name: "Hồng Kông", x: 78, y: 45, size: 12.4 },
    { id: "de", name: "Đức", x: 50, y: 35, size: 8.6 },
    { id: "uk", name: "Anh", x: 47, y: 32, size: 7.2 },
    { id: "ca", name: "Canada", x: 18, y: 32, size: 5.3 },
  ]

  return (
    <div className="relative h-full w-full bg-gray-100 rounded-lg overflow-hidden">
      {/* World map background */}
      <div className="absolute inset-0 bg-[url('/placeholder.svg?height=500&width=800')] bg-cover bg-center opacity-30"></div>

      {/* Map points */}
      {locations.map((location) => (
        <div
          key={location.id}
          className="absolute"
          style={{
            left: `${location.x}%`,
            top: `${location.y}%`,
            transform: "translate(-50%, -50%)",
          }}
          onMouseEnter={() => setActivePoint(location.id)}
          onMouseLeave={() => setActivePoint(null)}
        >
          <div
            className={`flex items-center justify-center rounded-full bg-primary text-primary-foreground transition-all duration-300 cursor-pointer ${
              activePoint === location.id ? "scale-125" : ""
            }`}
            style={{
              width: `${Math.max(20, location.size * 1.5)}px`,
              height: `${Math.max(20, location.size * 1.5)}px`,
            }}
          >
            <MapPin className="h-4 w-4" />
          </div>

          {/* Tooltip */}
          {activePoint === location.id && (
            <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-2 z-10 bg-white rounded-md shadow-lg p-2 text-sm min-w-[120px]">
              <div className="font-medium">{location.name}</div>
              <div className="text-xs text-muted-foreground">{location.size}% kết nối</div>
            </div>
          )}

          {/* Pulse animation */}
          <div
            className="absolute inset-0 rounded-full bg-primary animate-ping opacity-30"
            style={{
              animationDuration: `${3 + Math.random() * 2}s`,
            }}
          ></div>
        </div>
      ))}

      {/* Legend */}
      <div className="absolute bottom-4 right-4 bg-white/90 p-3 rounded-md shadow-md">
        <div className="text-sm font-medium mb-2">Tỷ lệ kết nối VPN</div>
        <div className="flex items-center gap-2">
          <div className="h-4 w-4 rounded-full bg-primary"></div>
          <span className="text-xs">Cao (20%+)</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="h-3 w-3 rounded-full bg-primary"></div>
          <span className="text-xs">Trung bình (10-20%)</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="h-2 w-2 rounded-full bg-primary"></div>
          <span className="text-xs">Thấp (&lt;10%)</span>
        </div>
      </div>
    </div>
  )
}
