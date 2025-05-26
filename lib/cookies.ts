import CryptoJS from "crypto-js"

const SECRET_KEY = "Supper@#$VanlangK3y" // Có thể tách ra .env nếu muốn

// ✅ Ghi cookie (chỉ mã hóa nếu không phải email)
export function setCookie(
  name: string,
  value: string,
  days: number,
  secure: boolean = false,
  sameSite: "Lax" | "Strict" | "None" = "Lax"
) {
  let expires = ""
  if (days) {
    const date = new Date()
    date.setTime(date.getTime() + days * 864e5)
    expires = "; expires=" + date.toUTCString()
  }

  // ❗ Không mã hóa nếu là email
  const finalValue =
    name === "email"
      ? value
      : CryptoJS.AES.encrypt(value, SECRET_KEY).toString()

  const cookieParts = [
    `${name}=${encodeURIComponent(finalValue || "")}`,
    expires,
    "path=/",
    sameSite ? `SameSite=${sameSite}` : "",
    secure ? "Secure" : ""
  ]

  document.cookie = cookieParts.filter(Boolean).join("; ")
}

// ✅ Đọc cookie (giải mã nếu không phải email)
export function getCookie(name: string): string | null {
  const nameEQ = name + "="
  const ca = document.cookie.split(";")
  for (let i = 0; i < ca.length; i++) {
    let c = ca[i]
    while (c.charAt(0) === " ") c = c.substring(1)
    if (c.indexOf(nameEQ) === 0) {
      try {
        const raw = decodeURIComponent(c.substring(nameEQ.length))

        // ❗ Không giải mã nếu là email
        if (name === "email") return raw

        const bytes = CryptoJS.AES.decrypt(raw, SECRET_KEY)
        return bytes.toString(CryptoJS.enc.Utf8)
      } catch (e) {
        console.error(`❌ Lỗi giải mã cookie "${name}":`, e)
        return null
      }
    }
  }
  return null
}

// ✅ Xóa cookie
export function eraseCookie(name: string) {
  document.cookie = `${name}=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;`
}
