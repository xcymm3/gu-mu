import { spawnSync } from "node:child_process";

const pnpmEntrypoint = process.env.npm_execpath;
const command = pnpmEntrypoint ? process.execPath : process.platform === "win32" ? "pnpm.cmd" : "pnpm";
const args = pnpmEntrypoint
  ? [pnpmEntrypoint, "exec", "playwright", "test", ...process.argv.slice(2)]
  : ["exec", "playwright", "test", ...process.argv.slice(2)];

const result = spawnSync(command, args, {
  env: { ...process.env, DEADLINE_CARL_EVIDENCE: "1" },
  stdio: "inherit",
});

if (result.error) throw result.error;
process.exit(result.status ?? 1);
