import type { Metadata } from 'next'
import EraContent from './EraContent'

export const metadata: Metadata = {
  title: 'Luxury Fitness App · Dhairya Narang',
  description: 'Designing a premium fitness experience for serious strength training — a 2-week sprint case study covering product thinking, prioritization, and developer collaboration.',
}

export default function EraPage() {
  return <EraContent />
}
