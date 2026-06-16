import type { Metadata } from 'next'
import { Space_Grotesk } from 'next/font/google'
import './globals.css'

const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  weight: ['400', '500', '700'],
  variable: '--font-space-grotesk',
})

export const metadata: Metadata = {
  title: 'Dhairya Narang — Design',
  description: "Designing products. Exploring AI. Building what's next.",
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
      </body>
    </html>
  )
}
