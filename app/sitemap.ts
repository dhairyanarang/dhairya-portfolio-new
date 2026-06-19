import type { MetadataRoute } from 'next'

// Generates /sitemap.xml — a list of pages for search engines. Pure SEO metadata;
// does not affect any page's look or behaviour.
export default function sitemap(): MetadataRoute.Sitemap {
  const base = 'https://dhairya.work'
  const routes = [
    '',
    '/about',
    '/work',
    '/work/luxury-fitness-app',
    '/work/onekey',
    '/work/ono',
    '/work/myroom',
  ]
  const now = new Date()
  return routes.map((path) => ({
    url: `${base}${path}`,
    lastModified: now,
    changeFrequency: 'monthly',
    priority: path === '' ? 1 : 0.8,
  }))
}
