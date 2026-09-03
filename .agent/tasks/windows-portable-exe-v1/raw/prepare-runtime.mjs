// One-off recovery for this machine's stalled Node downloads. No TLS/checksum bypass.
import { createHash } from "node:crypto";
import { createReadStream } from "node:fs";
import { copyFile, mkdir, readFile } from "node:fs/promises";
import { dirname, join } from "node:path";

const filename = "electron-v44.1.1-win32-x64.zip";
const archive = join(process.cwd(), "dist/desktop-tooling", filename);
const checksums = JSON.parse(await readFile("node_modules/electron/checksums.json", "utf8"));
const hash = createHash("sha256");
for await (const chunk of createReadStream(archive)) hash.update(chunk);
const digest = hash.digest("hex");
if (checksums[filename] !== digest) throw new Error("Runtime checksum mismatch; refusing to cache");
const cacheKey = createHash("sha256").update("https://github.com/electron/electron/releases/download/v44.1.1").digest("hex");
const destination = join(process.env.LOCALAPPDATA, "electron/Cache", cacheKey, filename);
await mkdir(dirname(destination), { recursive: true });
await copyFile(archive, destination);
console.log(JSON.stringify({ source: archive, checksum: digest, destination }, null, 2));
