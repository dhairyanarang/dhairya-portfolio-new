import type { Metadata } from 'next'
import { Space_Grotesk } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import './globals.css'
import CustomCursor from './components/CustomCursor'

// Note: Microsoft Clarity (session recording) was removed — its DOM-mutation
// recording fought the home canvas's constant GSAP transforms and caused visible
// jank in Chrome. Vercel Analytics below is a lightweight page-view beacon with
// no recording, so it doesn't touch performance.

const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  weight: ['400', '500', '700'],
  variable: '--font-space-grotesk',
})

export const metadata: Metadata = {
  // Absolute base for OG/canonical URLs. Update if the production domain differs.
  metadataBase: new URL('https://dhairya.work'),
  title: 'Dhairya Narang — Design',
  description: "Designing products. Exploring AI. Building what's next.",
  // opengraph-image.png / twitter-image.png in /app are picked up automatically
  // for the image; these add the title/description/card type for rich previews.
  openGraph: {
    title: 'Dhairya Narang — Design',
    description: "Designing products. Exploring AI. Building what's next.",
    url: '/',
    siteName: 'Dhairya Narang',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Dhairya Narang — Design',
    description: "Designing products. Exploring AI. Building what's next.",
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={`${spaceGrotesk.variable}`}>
        {children}
        <CustomCursor />
        <Analytics />
      </body>
    </html>
  )
}
