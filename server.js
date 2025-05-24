const { createServer } = require("https");
const { parse } = require("url");
const next = require("next");
const fs = require("fs");
const os = require("os");

const dev = process.env.NODE_ENV !== "production";
const app = next({ dev });
const handle = app.getRequestHandler();

// Đọc chứng chỉ SSL
const httpsOptions = {
  key: fs.readFileSync("./localhost-key.pem"),
  cert: fs.readFileSync("./localhost.pem"),
};

// Hàm lấy IP LAN
function getLocalExternalIP() {
  const interfaces = os.networkInterfaces();
  for (let name in interfaces) {
    for (let iface of interfaces[name]) {
      if (iface.family === "IPv4" && !iface.internal) {
        return iface.address;
      }
    }
  }
  return "localhost";
}

app.prepare().then(() => {
  createServer(httpsOptions, (req, res) => {
    const parsedUrl = parse(req.url, true);
    handle(req, res, parsedUrl);
  }).listen(3001, '0.0.0.0', () => {
    const ip = getLocalExternalIP();
    console.log("✅ HTTPS server running at:");
    console.log("   ➤ Local:   https://localhost:3001");
    console.log(`   ➤ Network: https://${ip}:3001`);
  });
});
