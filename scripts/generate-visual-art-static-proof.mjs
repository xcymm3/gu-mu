import { execFileSync } from "node:child_process";
import { createHash } from "node:crypto";
import fs from "node:fs";
import path from "node:path";

import { formalVisualAssetManifest } from "../lib/xue-gu-yin/assets.ts";

const taskId = "visual-art-expansion-v1";
const repoRoot = process.cwd();
const taskRoot = path.join(repoRoot, ".agent", "tasks", taskId);
const rawRoot = path.join(taskRoot, "raw");
const sheetRoot = path.join(rawRoot, "contact-sheets");
const generationPath = path.join(rawRoot, "art-generation.json");
const entries = Object.values(formalVisualAssetManifest);

if (entries.length !== 56) throw new Error(`Expected 56 formal assets, received ${entries.length}.`);
fs.mkdirSync(sheetRoot, { recursive: true });

const generation = JSON.parse(fs.readFileSync(generationPath, "utf8"));
const generatedByKey = new Map(generation.assets.map((asset) => [asset.key, asset]));
const inventory = [];
const hashes = new Map();
const auditLines = [
  `task_id=${taskId}`,
  `generated_at=${new Date().toISOString()}`,
  `asset_count=${entries.length}`,
];

for (const asset of entries) {
  const relativePath = asset.src.replace(/^\//, "public/");
  const absolutePath = path.join(repoRoot, ...relativePath.split("/"));
  if (!fs.existsSync(absolutePath)) throw new Error(`Missing formal asset: ${relativePath}`);
  const buffer = fs.readFileSync(absolutePath);
  const sha256 = createHash("sha256").update(buffer).digest("hex").toUpperCase();
  const identify = execFileSync("magick", [
    "identify",
    "-format",
    "%m|%w|%h|%[channels]",
    absolutePath,
  ], { encoding: "utf8" }).trim();
  const [format, widthText, heightText, channels] = identify.split("|");
  const width = Number(widthText);
  const height = Number(heightText);
  const bytes = buffer.byteLength;
  const trace = generatedByKey.get(asset.key);

  if (format !== "WEBP") throw new Error(`${asset.key} is ${format}, expected WEBP.`);
  if (width !== asset.width || height !== asset.height) {
    throw new Error(`${asset.key} is ${width}x${height}, expected ${asset.width}x${asset.height}.`);
  }
  if (bytes > asset.maxBytes) throw new Error(`${asset.key} exceeds ${asset.maxBytes} bytes (${bytes}).`);
  if (!trace || trace.final_path.replaceAll("\\", "/") !== relativePath) {
    throw new Error(`${asset.key} is missing an exact art-generation trace.`);
  }
  if (hashes.has(sha256)) throw new Error(`${asset.key} duplicates ${hashes.get(sha256)} (${sha256}).`);
  hashes.set(sha256, asset.key);

  inventory.push({
    key: asset.key,
    category: asset.category,
    path: relativePath,
    alt: asset.alt,
    purpose: asset.purpose,
    trigger: asset.trigger,
    format,
    width,
    height,
    channels,
    alpha_required: asset.alpha,
    bytes,
    max_bytes: asset.maxBytes,
    sha256,
    imagegen_trace: "raw/art-generation.json",
  });
  auditLines.push(`${asset.key}\t${relativePath}\t${format}\t${width}x${height}\t${channels}\t${bytes}\t${sha256}`);
}

const totalBytes = inventory.reduce((sum, asset) => sum + asset.bytes, 0);
fs.writeFileSync(path.join(rawRoot, "asset-inventory.json"), `${JSON.stringify({
  task_id: taskId,
  generated_at: new Date().toISOString(),
  count: inventory.length,
  total_bytes: totalBytes,
  unique_sha256_count: hashes.size,
  assets: inventory,
}, null, 2)}\n`);
fs.writeFileSync(path.join(rawRoot, "image-audit.txt"), `${auditLines.join("\n")}\n`);

const runtimeReferenceReport = {
  task_id: taskId,
  generated_at: new Date().toISOString(),
  manifest_source: "lib/xue-gu-yin/assets.ts#formalVisualAssetManifest",
  count: inventory.length,
  references: inventory.map(({ key, category, path: assetPath, trigger }) => ({
    key,
    category,
    path: assetPath,
    trigger,
    runtime_observation_source: category === "character"
      ? "raw/character-runtime-matrix.json"
      : category === "cg"
        ? "raw/cg-runtime-matrix.json"
        : category === "ui"
          ? "raw/ui-runtime-report.json"
          : "raw/effect-runtime-matrix.json",
  })),
};
fs.writeFileSync(path.join(rawRoot, "runtime-reference-report.json"), `${JSON.stringify(runtimeReferenceReport, null, 2)}\n`);

const sheetSettings = {
  character: { file: "characters.png", geometry: "180x270+10+24", tile: "6x5" },
  cg: { file: "cg.png", geometry: "300x169+10+24", tile: "4x4" },
  ui: { file: "ui.png", geometry: "400x225+12+24", tile: "3x1" },
  effect: { file: "effects.png", geometry: "260x260+10+24", tile: "4x2" },
};
const sheetManifest = {
  task_id: taskId,
  generated_at: new Date().toISOString(),
  generator: "scripts/generate-visual-art-static-proof.mjs",
  sheets: {},
};

for (const [category, settings] of Object.entries(sheetSettings)) {
  const sources = inventory.filter((asset) => asset.category === category);
  const output = path.join(sheetRoot, settings.file);
  const args = ["montage"];
  for (const source of sources) {
    args.push("-label", source.key, path.join(repoRoot, ...source.path.split("/")));
  }
  args.push(
    "-background", "#111116",
    "-fill", "#f1e4cb",
    "-stroke", "none",
    "-font", "Arial",
    "-pointsize", "13",
    "-thumbnail", settings.geometry.split("+")[0],
    "-tile", settings.tile,
    "-geometry", settings.geometry,
    output,
  );
  execFileSync("magick", args, { stdio: "inherit" });
  sheetManifest.sheets[category] = {
    file: `raw/contact-sheets/${settings.file}`,
    tile: settings.tile,
    geometry: settings.geometry,
    cells: sources.map((source, index) => ({ index, key: source.key, source: source.path, sha256: source.sha256 })),
  };
}

fs.writeFileSync(path.join(sheetRoot, "manifest.json"), `${JSON.stringify(sheetManifest, null, 2)}\n`);
console.log(`PASS: audited ${inventory.length} unique formal assets (${totalBytes} bytes) and generated four contact sheets.`);
