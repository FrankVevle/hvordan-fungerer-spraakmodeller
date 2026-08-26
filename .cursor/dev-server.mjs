// Zero-dependency local dev server for Cloud Agent environments.
// Serves the static site from the repository root and routes POST /api/chat
// to the existing Vercel-style handler in api/chat.js, mirroring `vercel dev`
// without requiring a Vercel login. cleanUrls behaviour matches vercel.json.
import { createServer } from "node:http";
import { readFile, stat } from "node:fs/promises";
import { extname, join, normalize, resolve } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const ROOT = resolve(fileURLToPath(new URL("..", import.meta.url)));
const PORT = Number(process.env.PORT) || 3000;
const HOST = process.env.HOST || "0.0.0.0";

const MIME = {
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".mjs": "text/javascript; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".gif": "image/gif",
  ".ico": "image/x-icon",
  ".webp": "image/webp",
  ".woff": "font/woff",
  ".woff2": "font/woff2",
  ".map": "application/json; charset=utf-8",
};

function safePath(urlPath) {
  const decoded = decodeURIComponent(urlPath.split("?")[0]);
  const clean = normalize(decoded).replace(/^(\.\.[/\\])+/, "");
  const full = resolve(join(ROOT, clean));
  return full.startsWith(ROOT) ? full : null;
}

async function tryFile(path) {
  try {
    const info = await stat(path);
    if (info.isFile()) return path;
    if (info.isDirectory()) {
      const index = join(path, "index.html");
      const idxInfo = await stat(index).catch(() => null);
      if (idxInfo?.isFile()) return index;
    }
  } catch {
    /* fall through */
  }
  return null;
}

async function resolveStatic(urlPath) {
  const base = safePath(urlPath === "/" ? "/index.html" : urlPath);
  if (!base) return null;
  let found = await tryFile(base);
  if (found) return found;
  // cleanUrls: /kapittel-1 -> kapittel-1.html
  if (!extname(base)) {
    found = await tryFile(`${base}.html`);
    if (found) return found;
  }
  return null;
}

function readBody(req) {
  return new Promise((resolvePromise, reject) => {
    const chunks = [];
    let size = 0;
    req.on("data", (chunk) => {
      size += chunk.length;
      if (size > 1_000_000) {
        reject(new Error("payload_too_large"));
        req.destroy();
        return;
      }
      chunks.push(chunk);
    });
    req.on("end", () => resolvePromise(Buffer.concat(chunks).toString("utf8")));
    req.on("error", reject);
  });
}

// Adapt Node's ServerResponse to the Vercel-style res.status().json() API.
function wrapRes(res) {
  res.status = (code) => {
    res.statusCode = code;
    return res;
  };
  res.json = (obj) => {
    res.setHeader("Content-Type", "application/json; charset=utf-8");
    res.end(JSON.stringify(obj));
    return res;
  };
  return res;
}

async function handleApiChat(req, res) {
  const raw = await readBody(req).catch(() => "");
  req.body = raw;
  const mod = await import(pathToFileURL(join(ROOT, "api", "chat.js")).href);
  return mod.default(req, wrapRes(res));
}

const server = createServer(async (req, res) => {
  try {
    const url = req.url || "/";
    if (url.split("?")[0] === "/api/chat") {
      await handleApiChat(req, res);
      return;
    }

    const file = await resolveStatic(url);
    if (!file) {
      res.statusCode = 404;
      res.setHeader("Content-Type", "text/html; charset=utf-8");
      res.end("<h1>404 Not Found</h1>");
      return;
    }

    const data = await readFile(file);
    res.statusCode = 200;
    res.setHeader("Content-Type", MIME[extname(file)] || "application/octet-stream");
    res.setHeader("Cache-Control", "no-cache");
    res.end(data);
  } catch (err) {
    res.statusCode = 500;
    res.setHeader("Content-Type", "text/plain; charset=utf-8");
    res.end(`Server error: ${err?.message || "unknown"}`);
  }
});

server.listen(PORT, HOST, () => {
  const keyState = process.env.OPENAI_API_KEY ? "live (OPENAI_API_KEY set)" : "simulation (no OPENAI_API_KEY)";
  console.log(`Dev server running at http://${HOST}:${PORT}`);
  console.log(`Serving static site from ${ROOT}`);
  console.log(`/api/chat mode: ${keyState}`);
});
