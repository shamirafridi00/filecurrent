import { createClient } from '@/lib/supabase/server'
import { adminClient } from '@/lib/supabase/admin'
import { NextResponse } from 'next/server'
import { sendEmail } from '@/lib/email'
import { welcomeEmail } from '@/lib/email/templates/welcome'
import { TRIAL_DAYS } from '@/lib/constants'

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')
  const error = searchParams.get('error')
  const errorDescription = searchParams.get('error_description')

  if (error) {
    console.error('OAuth error:', error, errorDescription)
    return NextResponse.redirect(
      `${origin}/login?error=${encodeURIComponent(errorDescription ?? error)}`
    )
  }

  if (code) {
    const supabase = createClient()
    const { data: sessionData, error: exchangeError } = await supabase.auth.exchangeCodeForSession(code)

    if (exchangeError) {
      console.error('Exchange error:', exchangeError)
      return NextResponse.redirect(
        `${origin}/login?error=${encodeURIComponent(exchangeError.message)}`
      )
    }

    // Send welcome email for new users (profile created within last 60 seconds)
    const user = sessionData?.user
    if (user?.email) {
      try {
        const { data: profile } = await adminClient
          .from('profiles')
          .select('created_at, full_name')
          .eq('id', user.id)
          .single()

        if (profile) {
          const ageMs = Date.now() - new Date(profile.created_at).getTime()
          if (ageMs < 60_000) {
            const fullName = profile.full_name || user.user_metadata?.full_name || user.email.split('@')[0]
            sendEmail({
              to: user.email,
              subject: `Welcome to FileCurrent — your ${TRIAL_DAYS}-day trial has started`,
              html: welcomeEmail({
                fullName,
                trialDaysLeft: TRIAL_DAYS,
                dashboardUrl: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard`,
              }),
            }).catch(() => {})
          }
        }
      } catch {
        // non-critical
      }
    }

    return NextResponse.redirect(`${origin}/dashboard`)
  }

  return NextResponse.redirect(`${origin}/login?error=no_code`)
}
