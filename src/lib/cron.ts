import type { NextRequest } from 'next/server'

export function verifyCronSecret(req: NextRequest): boolean {
  const auth = req.headers.get('authorization') ?? ''
  const secret = process.env.CRON_SECRET ?? ''

  // Accept "Bearer <secret>" format (both Vercel cron and manual calls)
  return auth === `Bearer ${secret}`
}
