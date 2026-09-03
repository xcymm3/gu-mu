import { realpathSync, statSync } from "node:fs";
import { isAbsolute, relative, resolve, sep } from "node:path";
import { pathToFileURL } from "node:url";

export const GAME_URL = "xueguyin://game/";

export function isGameUrl(value) {
  try {
    const url = new URL(value);
    return url.protocol === "xueguyin:" && url.host === "game" && !url.username && !url.password;
  } catch {
    return false;
  }
}

function isInside(root, file) {
  const child = relative(root, file);
  return child !== "" && child !== ".." && !child.startsWith(`..${sep}`) && !isAbsolute(child);
}

export function findExportedFile(root, pathname) {
  let decoded;
  try {
    decoded = decodeURIComponent(pathname);
  } catch {
    return null;
  }
  // Reject encoded traversal, Windows separators, drive paths and NTFS streams.
  if (!decoded.startsWith("/") || /[\\:\0]/.test(decoded) || decoded.split("/").includes("..")) return null;
  const name = decoded === "/" ? "index.html" : decoded.slice(1);
  const realRoot = realpathSync(root);
  for (const suffix of ["", ".html", "/index.html"]) {
    const file = resolve(realRoot, `${name}${suffix}`);
    if (!isInside(realRoot, file)) continue;
    try {
      const realFile = realpathSync(file);
      if (isInside(realRoot, realFile) && statSync(realFile).isFile()) return realFile;
    } catch {
      // Static exports may use either page.html or page/index.html.
    }
  }
  return null;
}

export function createAssetHandler(root, fetchFile) {
  return async (request) => {
    if (!isGameUrl(request.url)) return new Response(null, { status: 403 });
    if (!["GET", "HEAD"].includes(request.method)) return new Response(null, { status: 405 });
    const file = findExportedFile(root, new URL(request.url).pathname);
    if (!file) return new Response(null, { status: 404 });
    const response = await fetchFile(pathToFileURL(file).href);
    const headers = new Headers(response.headers);
    // Next's exported hydration uses inline scripts. No remote origins or eval are allowed.
    headers.set("Content-Security-Policy", "default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' data: blob:; media-src 'self' blob:; connect-src 'self'; font-src 'self'; object-src 'none'; frame-src 'none'; base-uri 'none'; form-action 'none'");
    headers.set("X-Content-Type-Options", "nosniff");
    return new Response(request.method === "HEAD" ? null : response.body, { status: response.status, headers });
  };
}
