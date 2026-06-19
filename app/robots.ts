import type { MetadataRoute } from 'next'

// Generates /robots.txt — tells search engines they may crawl everything and
// points them at the sitemap. Does not affect any page's look or behaviour.
export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: '*', allow: '/' },
    sitemap: 'https://dhairya.work/sitemap.xml',
  }
}
