'use client'

import { useState } from 'react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { LogoFull } from '@/components/logo/LogoMark'

export default function SignupPage() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [emailSent, setEmailSent] = useState(false)

  const handleGoogleSignIn = async () => {
    const supabase = createClient()
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `https://www.filecurrent.com/auth/callback`,
        queryParams: {
          access_type: 'offline',
          prompt: 'consent',
        },
      },
    })
    if (error) console.error('Google sign in error:', error)
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    if (password.length < 6) {
      setError('Password must be at least 6 characters')
      return
    }
    setLoading(true)
    try {
      const supabase = createClient()
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: { data: { full_name: name } },
      })
      if (error) { setError(error.message); return }
      setEmailSent(true)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#F6F9FC] flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-sm border border-[#E6EBF1] p-8">
        <div className="flex justify-center mb-8">
          <LogoFull size={36} />
        </div>

        {emailSent ? (
          <div className="text-center py-4">
            <div className="w-16 h-16 bg-[#F0EFFF] rounded-full flex items-center justify-center mx-auto mb-4">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
                <path d="M20 4H4C2.9 4 2 4.9 2 6V18C2 19.1 2.9 20 4 20H20C21.1 20 22 19.1 22 18V6C22 4.9 21.1 4 20 4Z"
                  stroke="#635BFF" strokeWidth="1.5" strokeLinecap="round"/>
                <path d="M22 6L12 13L2 6"
                  stroke="#635BFF" strokeWidth="1.5" strokeLinecap="round"/>
              </svg>
            </div>
            <h2 className="text-xl font-bold text-[#0A2540] mb-2">Check your email</h2>
            <p className="text-[#425466] text-sm leading-relaxed">
              We sent a confirmation link to your email address.
              Click it to activate your account and start your 5-day free trial.
            </p>
            <p className="text-[#8898AA] text-xs mt-4">
              Didn&apos;t receive it? Check your spam folder or{' '}
              <button
                onClick={() => setEmailSent(false)}
                className="text-[#635BFF] underline"
              >
                try again
              </button>
            </p>
          </div>
        ) : (
          <>
            <h1 className="text-2xl font-bold text-[#0A2540] mb-1">Start your free trial</h1>
            <p className="text-[#8898AA] text-sm mb-6">5 days of full access. No credit card required.</p>

            <button
              onClick={handleGoogleSignIn}
              className="w-full flex items-center justify-center gap-3 border border-[#E6EBF1] rounded-lg py-2.5 px-4 text-[#0A2540] font-medium text-sm hover:bg-[#F6F9FC] transition-colors mb-4"
            >
              <svg width="18" height="18" viewBox="0 0 24 24">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
              </svg>
              Continue with Google
            </button>

            <div className="flex items-center gap-3 mb-4">
              <div className="flex-1 h-px bg-[#E6EBF1]"/>
              <span className="text-xs text-[#8898AA]">or sign up with email</span>
              <div className="flex-1 h-px bg-[#E6EBF1]"/>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-1.5">
                <Label htmlFor="name">Full Name</Label>
                <Input
                  id="name"
                  type="text"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  placeholder="Jane Smith"
                  required
                  autoComplete="name"
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  required
                  autoComplete="email"
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="Min. 6 characters"
                  required
                  autoComplete="new-password"
                />
              </div>

              {error && (
                <p className="text-sm text-destructive bg-destructive/10 rounded-md px-3 py-2">
                  {error}
                </p>
              )}

              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? 'Creating account…' : 'Start Free Trial'}
              </Button>
            </form>

            <p className="text-center text-sm text-[#8898AA] mt-4">
              Already have an account?{' '}
              <Link href="/login" className="text-[#635BFF] font-medium hover:underline">
                Sign in
              </Link>
            </p>
            <p className="text-center text-xs text-[#8898AA] mt-3">
              5 days full access. No credit card required.
            </p>
          </>
        )}
      </div>
    </div>
  )
}
