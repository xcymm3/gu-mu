import { createReadStream, statSync } from "node:fs";
import { createServer } from "node:http";
import { extname, resolve, sep } from "node:path";

const host = "127.0.0.1";
const port = 4173;
const contentTypes = {
  ".css": "text/css; charset=utf-8",
  ".html": "text/html; charset=utf-8",
  ".ico": "image/x-icon",
  ".js": "text/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".ogg": "audio/ogg",
  ".png": "image/png",
  ".svg": "image/svg+xml",
  ".webp": "image/webp",
  ".woff2": "font/woff2",
};

function findExportedFile(root, pathname) {
  const relativePath = pathname === "/" ? "index.html" : decodeURIComponent(pathname).slice(1);
  const candidates = [relativePath, `${relativePath}.html`, `${relativePath}${sep}index.html`];

  for (const candidate of candidates) {
    const filePath = resolve(root, candidate);
    if (filePath !== root && !filePath.startsWith(`${root}${sep}`)) continue;
    try {
      if (statSync(filePath).isFile()) return filePath;
    } catch {
      // Try the next static-export path form.
    }
  }

  return null;
}

export async function startStaticServer() {
  const root = resolve("out");
  const sockets = new Set();
  const server = createServer((request, response) => {
    if (request.method !== "GET" && request.method !== "HEAD") {
      response.writeHead(405).end();
      return;
    }

    let filePath;
    try {
      filePath = findExportedFile(
        root,
        new URL(request.url ?? "/", `http://${host}`).pathname,
      );
    } catch {
      response.writeHead(400).end();
      return;
    }

    if (!filePath) {
      response.writeHead(404).end();
      return;
    }

    response.writeHead(200, {
      "Content-Type": contentTypes[extname(filePath)] ?? "application/octet-stream",
    });
    if (request.method === "HEAD") response.end();
    else createReadStream(filePath).pipe(response);
  });

  server.on("connection", (socket) => {
    sockets.add(socket);
    socket.once("close", () => sockets.delete(socket));
  });

  await new Promise((resolveListen, rejectListen) => {
    const handleError = (error) => rejectListen(error);
    server.once("error", handleError);
    server.listen(port, host, () => {
      server.off("error", handleError);
      resolveListen();
    });
  });
  console.log(`Serving Next.js static export at http://${host}:${port}`);

  return async () => {
    for (const socket of sockets) socket.destroy();
    await new Promise((resolveClose, rejectClose) => {
      server.close((error) => {
        if (error) rejectClose(error);
        else resolveClose();
      });
    });
  };
}
