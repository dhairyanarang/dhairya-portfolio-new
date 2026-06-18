import type { Metadata } from 'next'
import OneKeyContent from './OneKeyContent'

export const metadata: Metadata = {
  title: 'OneKey — AI Second Brain · Dhairya Narang',
  description: 'Designing a voice-first second brain for founders and knowledge workers — a 0→1 AI-native productivity product covering AI product thinking, workflows, and founder collaboration.',
}

export default function OneKeyPage() {
  return <OneKeyContent />
}
