import type { Metadata } from 'next'
import { NotFoundContent } from '@/components/landing/NotFoundContent'

export const metadata: Metadata = {
  title: 'Page not found — FileCurrent',
  description: "The page you're looking for doesn't exist or has moved.",
}

export default function NotFound() {
  return <NotFoundContent />
}
