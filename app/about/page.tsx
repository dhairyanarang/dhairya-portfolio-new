import type { Metadata } from 'next'
import AboutContent from './AboutContent'

export const metadata: Metadata = {
  title: 'About — Dhairya Narang',
  description: 'Designer. Problem Solver. Product Builder.',
}

export default function AboutPage() {
  return <AboutContent />
}
