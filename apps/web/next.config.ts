/**
 * @file Next.js configuration for the Phase 1 bootstrap task.
 * @author PopoY
 * @created 2026-06-04
 */
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  transpilePackages: ["@poco-scrum/domain", "@poco-scrum/shared"]
};

export default nextConfig;
