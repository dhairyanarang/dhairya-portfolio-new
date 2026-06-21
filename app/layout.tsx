import type { Metadata } from 'next'
import { Space_Grotesk } from 'next/font/google'
import Script from 'next/script'
import './globals.css'
import CustomCursor from './components/CustomCursor'

// Microsoft Clarity project id (free analytics + session recordings). This id is
// public — it ships in the client script — so it's fine to hardcode.
const CLARITY_ID = 'xamtxthgrb'

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
        {CLARITY_ID && (
          <Script id="ms-clarity" strategy="afterInteractive">
            {`(function(c,l,a,r,i,t,y){c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);})(window,document,"clarity","script","${CLARITY_ID}");`}
          </Script>
        )}
      </body>
    </html>
  )
}
