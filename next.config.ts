import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  // Disabled because React StrictMode double-mounts components in dev, which
  // disposes and loses the WebGL context of the react-three-fiber lanyard
  // (THREE.WebGLRenderer: Context Lost → the 3D card "drops in then vanishes").
  // Production never double-mounts, so this only affects the dev experience.
  reactStrictMode: false,

  // Pin the Turbopack workspace root to this project. A stray lockfile in a
  // parent directory was making Next.js infer the wrong root, which broke
  // dev-mode CSS hot-reloading (globals.css edits weren't being recompiled).
  turbopack: {
    root: __dirname,
  },
}

export default nextConfig
