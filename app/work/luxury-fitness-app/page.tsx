import type { Metadata } from 'next'
import EraContent from './EraContent'

export const metadata: Metadata = {
  title: 'Luxury Fitness App · Dhairya Narang',
  description: 'Designing a luxury fitness experience that makes consistency feel rewarding — a 2-week sprint case study covering product thinking, visual design, and developer collaboration.',
}

export default function EraPage() {
  return <EraContent />
}
