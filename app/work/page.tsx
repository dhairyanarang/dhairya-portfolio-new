import type { Metadata } from 'next'
import WorkContent from './WorkContent'

export const metadata: Metadata = {
  title: 'Projects — Dhairya Narang',
  description: 'Selected work — case studies across a variety of industries.',
}

export default function WorkPage() {
  return <WorkContent />
}
