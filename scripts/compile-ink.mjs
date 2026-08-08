import { mkdir, readFile, writeFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { Compiler } from "inkjs/full";

const input = resolve("stories/gu-tomb.ink");
const output = resolve("lib/gu-tomb/gu-tomb.ink.generated.ts");
const source = await readFile(input, "utf8");
const story = new Compiler(source).Compile();

await mkdir(dirname(output), { recursive: true });
await writeFile(output, `// Generated from stories/gu-tomb.ink. Do not edit directly.\nconst story = ${JSON.stringify(story.ToJson())};\nexport default story;\n`, "utf8");
