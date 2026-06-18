import type { Metadata } from 'next'
import MyRoomContent from './MyRoomContent'

export const metadata: Metadata = {
  title: 'MyRoom — Trust-first Accommodation · Dhairya Narang',
  description: 'A research-driven, trust-first accommodation platform for people moving to new cities — turning user psychology into a transparent, commute-first, confidence-driven consumer experience.',
}

export default function MyRoomPage() {
  return <MyRoomContent />
}
