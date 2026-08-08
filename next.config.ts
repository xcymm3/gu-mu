import type { NextConfig } from "next";

const isGitHubPages = process.env.GITHUB_ACTIONS === "true";
const customDomain = process.env.CUSTOM_DOMAIN;

const nextConfig: NextConfig = {
  output: "export",
  trailingSlash: true,
  basePath: isGitHubPages && !customDomain ? "/gu-mu" : "",
};

export default nextConfig;
