import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { createReadStream, readFileSync, readdirSync, statSync, writeFileSync } from "node:fs";
import { createRequire } from "node:module";
import path from "node:path";

const require = createRequire(import.meta.url);
const builder = createRequire(require.resolve("electron-builder"));
const appBuilder = createRequire(builder.resolve("app-builder-lib"));
const asar = appBuilder("@electron/asar");
const root = path.resolve("dist/desktop");
const executable = path.join(root, "XueGuYin-0.2.0-rc.2-win-x64-portable.exe");
const archive = path.join(root, "win-unpacked/resources/app.asar");
const files = asar.listPackage(archive).map((file) => file.replaceAll("\\", "/"));
assert.deepEqual(files.sort(), ["/assets.mjs", "/icon.ico", "/main.mjs", "/package.json", "/storage.mjs"]);
for (const file of ["assets.mjs", "main.mjs", "storage.mjs", "icon.ico"]) {
  assert.equal(Buffer.compare(asar.extractFile(archive, file), readFileSync(path.join("desktop", file))), 0, `Stale packaged file: ${file}`);
}
const web = path.join(root, "win-unpacked/resources/web");
const assets = readdirSync(web, { recursive: true }).filter((file) => statSync(path.join(web, file)).isFile());
assert(assets.includes("index.html"));
assert(assets.some((file) => file.endsWith(".webp")));
assert(assets.some((file) => file.endsWith(".wav")));
const hash = createHash("sha256");
for await (const chunk of createReadStream(executable)) hash.update(chunk);
const result = {
  executable: path.relative(process.cwd(), executable),
  bytes: statSync(executable).size,
  sha256: hash.digest("hex"),
  asarBytes: statSync(archive).size,
  asarFiles: files,
  sourceMatchesPackagedCode: true,
  staticFiles: assets.length,
  staticBytes: assets.reduce((sum, file) => sum + statSync(path.join(web, file)).size, 0),
};
writeFileSync(new URL("./artifact.json", import.meta.url), JSON.stringify(result, null, 2) + "\n");
console.log(JSON.stringify(result, null, 2));
