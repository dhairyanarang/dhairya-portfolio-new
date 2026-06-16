import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  // Pin the Turbopack workspace root to this project. A stray lockfile in a
  // parent directory was making Next.js infer the wrong root, which broke
  // dev-mode CSS hot-reloading (globals.css edits weren't being recompiled).
  turbopack: {
    root: __dirname,
  },
}

export default nextConfig
