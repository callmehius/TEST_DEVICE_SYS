"use client"

import {
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  CartesianGrid,
  Legend,
} from "@/components/ui/chart"

// Mock data for VPN trend chart
const data = [
  { date: "01/05", daily: 12, weekly: 85, monthly: 320 },
  { date: "02/05", daily: 19, weekly: 87, monthly: 315 },
  { date: "03/05", daily: 15, weekly: 90, monthly: 310 },
  { date: "04/05", daily: 11, weekly: 95, monthly: 305 },
  { date: "05/05", daily: 18, weekly: 100, monthly: 300 },
  { date: "06/05", daily: 24, weekly: 105, monthly: 295 },
  { date: "07/05", daily: 28, weekly: 110, monthly: 290 },
  { date: "08/05", daily: 22, weekly: 115, monthly: 285 },
  { date: "09/05", daily: 20, weekly: 120, monthly: 280 },
  { date: "10/05", daily: 25, weekly: 125, monthly: 275 },
  { date: "11/05", daily: 31, weekly: 130, monthly: 270 },
  { date: "12/05", daily: 35, weekly: 135, monthly: 265 },
  { date: "13/05", daily: 30, weekly: 140, monthly: 260 },
  { date: "14/05", daily: 29, weekly: 145, monthly: 255 },
  { date: "15/05", daily: 33, weekly: 150, monthly: 250 },
  { date: "16/05", daily: 38, weekly: 155, monthly: 245 },
  { date: "17/05", daily: 35, weekly: 160, monthly: 240 },
  { date: "18/05", daily: 32, weekly: 165, monthly: 235 },
  { date: "19/05", daily: 30, weekly: 170, monthly: 230 },
  { date: "20/05", daily: 34, weekly: 175, monthly: 225 },
]

export function VpnTrendChart() {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <LineChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 10 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
        <XAxis dataKey="date" />
        <YAxis />
        <Tooltip
          content={({ active, payload, label }) => {
            if (active && payload && payload.length) {
              return (
                <div className="rounded-lg border bg-background p-2 shadow-sm">
                  <div className="grid grid-cols-2 gap-2">
                    <div className="flex flex-col">
                      <span className="text-[0.70rem] uppercase text-muted-foreground">Ngày</span>
                      <span className="font-bold text-muted-foreground">{label}</span>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-[0.70rem] uppercase text-muted-foreground">Hàng ngày</span>
                      <span className="font-bold">{payload[0].value}</span>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-[0.70rem] uppercase text-muted-foreground">Hàng tuần</span>
                      <span className="font-bold">{payload[1].value}</span>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-[0.70rem] uppercase text-muted-foreground">Hàng tháng</span>
                      <span className="font-bold">{payload[2].value}</span>
                    </div>
                  </div>
                </div>
              )
            }
            return null
          }}
        />
        <Legend />
        <Line
          type="monotone"
          dataKey="daily"
          name="Hàng ngày"
          stroke="#2563eb"
          strokeWidth={2}
          dot={{ r: 4 }}
          activeDot={{ r: 6 }}
        />
        <Line
          type="monotone"
          dataKey="weekly"
          name="Hàng tuần"
          stroke="#16a34a"
          strokeWidth={2}
          dot={{ r: 4 }}
          activeDot={{ r: 6 }}
        />
        <Line
          type="monotone"
          dataKey="monthly"
          name="Hàng tháng"
          stroke="#dc2626"
          strokeWidth={2}
          dot={{ r: 4 }}
          activeDot={{ r: 6 }}
        />
      </LineChart>
    </ResponsiveContainer>
  )
}
