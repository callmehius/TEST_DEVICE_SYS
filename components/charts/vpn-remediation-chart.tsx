"use client"

import {
  Area,
  AreaChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  CartesianGrid,
  Legend,
} from "@/components/ui/chart"

// Mock data for VPN remediation success rates
const data = [
  { date: "01/05", automatic: 75, manual: 42, failed: 25 },
  { date: "02/05", automatic: 76, manual: 43, failed: 24 },
  { date: "03/05", automatic: 77, manual: 44, failed: 23 },
  { date: "04/05", automatic: 76, manual: 45, failed: 24 },
  { date: "05/05", automatic: 77, manual: 44, failed: 23 },
  { date: "06/05", automatic: 78, manual: 45, failed: 22 },
  { date: "07/05", automatic: 77, manual: 44, failed: 23 },
  { date: "08/05", automatic: 78, manual: 45, failed: 22 },
  { date: "09/05", automatic: 79, manual: 46, failed: 21 },
  { date: "10/05", automatic: 78, manual: 45, failed: 22 },
  { date: "11/05", automatic: 79, manual: 46, failed: 21 },
  { date: "12/05", automatic: 80, manual: 47, failed: 20 },
  { date: "13/05", automatic: 79, manual: 46, failed: 21 },
  { date: "14/05", automatic: 78, manual: 45, failed: 22 },
]

export function VpnRemediationChart() {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <AreaChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 10 }}>
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
                      <span className="text-[0.70rem] uppercase text-muted-foreground">Tự động</span>
                      <span className="font-bold">{payload[0].value}%</span>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-[0.70rem] uppercase text-muted-foreground">Thủ công</span>
                      <span className="font-bold">{payload[1].value}%</span>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-[0.70rem] uppercase text-muted-foreground">Thất bại</span>
                      <span className="font-bold">{payload[2].value}%</span>
                    </div>
                  </div>
                </div>
              )
            }
            return null
          }}
        />
        <Legend />
        <Area
          type="monotone"
          dataKey="automatic"
          name="Tự động khắc phục"
          stroke="#16a34a"
          fill="#16a34a"
          fillOpacity={0.2}
          stackId="1"
        />
        <Area
          type="monotone"
          dataKey="manual"
          name="Hướng dẫn thủ công"
          stroke="#f59e0b"
          fill="#f59e0b"
          fillOpacity={0.2}
          stackId="2"
        />
        <Area
          type="monotone"
          dataKey="failed"
          name="Không khắc phục"
          stroke="#dc2626"
          fill="#dc2626"
          fillOpacity={0.2}
          stackId="3"
        />
      </AreaChart>
    </ResponsiveContainer>
  )
}
