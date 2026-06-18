import type { Metadata } from 'next'
import OneKeyContent from './OneKeyContent'

export const metadata: Metadata = {
  title: 'OneKey — AI Second Brain · Dhairya Narang',
  description: 'Designing a voice-first second brain that captures, organizes and acts on thoughts across mobile, Apple Watch and Mac — a 0→1 multi-device AI product covering product vision, the core experience loop, and building beyond design.',
}

export default function OneKeyPage() {
  return <OneKeyContent />
}
