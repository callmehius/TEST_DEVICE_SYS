"use client"

import { Bar, BarChart, ResponsiveContainer, Tooltip, XAxis, YAxis, CartesianGrid, Legend } from "@/components/ui/chart"

// Mock data for VPN vs Static IP comparison
const data = [
  { date: "01/05", vpn: 85, staticIp: 65 },
  { date: "02/05", vpn: 87, staticIp: 68 },
  { date: "03/05", vpn: 90, staticIp: 70 },
  { date: "04/05", vpn: 95, staticIp: 72 },
  { date: "05/05", vpn: 100, staticIp: 75 },
  { date: "06/05", vpn: 105, staticIp: 78 },
  { date: "07/05", vpn: 110, staticIp: 80 },
  { date: "08/05", vpn: 115, staticIp: 82 },
  { date: "09/05", vpn: 120, staticIp: 85 },
  { date: "10/05", vpn: 125, staticIp: 87 },
  { date: "11/05", vpn: 130, staticIp: 90 },
  { date: "12/05", vpn: 135, staticIp: 92 },
  { date: "13/05", vpn: 140, staticIp: 95 },
  { date: "14/05", vpn: 145, staticIp: 97 },
]

export function VpnComparisonChart() {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 10 }}>
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
                      <span className="text-[0.70rem] uppercase text-muted-foreground">VPN</span>
                      <span className="font-bold">{payload[0].value}</span>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-[0.70rem] uppercase text-muted-foreground">IP tĩnh</span>
                      <span className="font-bold">{payload[1].value}</span>
                    </div>
                  </div>
                </div>
              )
            }
            return null
          }}
        />
        <Legend />
        <Bar dataKey="vpn" name="VPN" fill="#3b82f6" radius={[4, 4, 0, 0]} />
        <Bar dataKey="staticIp" name="IP tĩnh" fill="#f59e0b" radius={[4, 4, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  )
}
