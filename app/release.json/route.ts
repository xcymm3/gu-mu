import { releaseMeta } from "@/lib/xue-gu-yin/release";

export const dynamic = "force-static";

export function GET() {
  return new Response(
    JSON.stringify({
      version: releaseMeta.version,
      channel: releaseMeta.channel,
      gitSha: process.env.VERCEL_GIT_COMMIT_SHA ?? process.env.GITHUB_SHA ?? "local",
    }),
    { headers: { "Content-Type": "application/json; charset=utf-8" } },
  );
}
