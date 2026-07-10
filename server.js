// Minimal zero-dependency static file server for Railway.
// - Listens on the port Railway provides (process.env.PORT)
// - Optional password gate: set BASIC_AUTH_USER and BASIC_AUTH_PASS in Railway
//   (if either is unset, the site is open to anyone with the link)
const http = require("http");
const fs = require("fs");
const path = require("path");

const ROOT = __dirname;
const PORT = process.env.PORT || 3000;
const USER = process.env.BASIC_AUTH_USER || "";
const PASS = process.env.BASIC_AUTH_PASS || "";
const AUTH_ON = USER && PASS;

const TYPES = {
  ".html": "text/html; charset=utf-8", ".css": "text/css; charset=utf-8",
  ".js": "text/javascript; charset=utf-8", ".json": "application/json",
  ".png": "image/png", ".jpg": "image/jpeg", ".jpeg": "image/jpeg",
  ".svg": "image/svg+xml", ".ico": "image/x-icon", ".webp": "image/webp",
  ".woff": "font/woff", ".woff2": "font/woff2", ".pdf": "application/pdf",
  ".txt": "text/plain; charset=utf-8", ".map": "application/json"
};

function unauthorized(res) {
  res.writeHead(401, { "WWW-Authenticate": 'Basic realm="Prestige (beta)"' });
  res.end("Authentication required");
}

const server = http.createServer((req, res) => {
  // Optional password gate
  if (AUTH_ON) {
    const h = req.headers.authorization || "";
    const [scheme, encoded] = h.split(" ");
    if (scheme !== "Basic" || !encoded) return unauthorized(res);
    const [u, p] = Buffer.from(encoded, "base64").toString().split(":");
    if (u !== USER || p !== PASS) return unauthorized(res);
  }

  // Resolve path safely (no traversal outside ROOT)
  let urlPath = decodeURIComponent((req.url || "/").split("?")[0]);
  if (urlPath === "/" || urlPath === "") urlPath = "/index.html";
  let filePath = path.normalize(path.join(ROOT, urlPath));
  if (!filePath.startsWith(ROOT)) { res.writeHead(403); return res.end("Forbidden"); }

  fs.stat(filePath, (err, stat) => {
    if (err || stat.isDirectory()) {
      // try directory index, else 404
      const idx = path.join(filePath, "index.html");
      if (!err && stat.isDirectory() && fs.existsSync(idx)) return send(idx, res);
      res.writeHead(404, { "Content-Type": "text/html; charset=utf-8" });
      return res.end("<h1>404</h1><p>Not found</p>");
    }
    send(filePath, res);
  });
});

function send(filePath, res) {
  const ext = path.extname(filePath).toLowerCase();
  res.writeHead(200, { "Content-Type": TYPES[ext] || "application/octet-stream" });
  fs.createReadStream(filePath).pipe(res);
}

server.listen(PORT, "0.0.0.0", () => console.log("Prestige site running on port " + PORT));
