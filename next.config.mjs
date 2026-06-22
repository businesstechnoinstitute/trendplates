// When deploying to GitHub Pages the site is served from /<repo>/, so we set a
// base path at build time via PAGES_BASE_PATH (the workflow provides it).
// Locally it's empty, so `npm run dev` works at the root as normal.
const basePath = process.env.PAGES_BASE_PATH || "";

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  output: "export", // static HTML export for GitHub Pages
  images: { unoptimized: true },
  trailingSlash: true,
  basePath: basePath || undefined,
  assetPrefix: basePath || undefined,
  // Exposed to the client so asset paths (e.g. /logos/*) resolve under basePath.
  env: { NEXT_PUBLIC_BASE_PATH: basePath },
};

export default nextConfig;
