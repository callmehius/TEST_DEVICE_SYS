// app/api/ip2location/route.ts
export async function GET() {
    try {
      // 1. Lấy IP người dùng
      const ipRes = await fetch("https://api.ipify.org?format=json")
      const ipData = await ipRes.json()
      const userIP = ipData.ip
  
      // 2. Gọi API IP2Location từ server
      const res = await fetch(`https://api.ip2location.io/?key=7DB9F0A65A8580FD8D70FD1504A73791&ip=${userIP}`)
      const data = await res.json()
  
      return Response.json({ success: true, ip: userIP, data })
    } catch (error) {
      return Response.json({ success: false, error: "Failed to fetch IP info" }, { status: 500 })
    }
  }
  