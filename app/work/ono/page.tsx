import type { Metadata } from 'next'
import OnoContent from './OnoContent'

export const metadata: Metadata = {
  title: 'ONO — Agri-commerce Ecosystem · Dhairya Narang',
  description: 'Designing connected experiences for India’s agri-commerce ecosystem — an 8-month embedded role across ONO’s mOS and CASH products, focused on systems thinking and platform design.',
}

export default function OnoPage() {
  return <OnoContent />
}
