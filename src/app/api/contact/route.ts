import { NextRequest, NextResponse } from 'next/server'
import { sendEmail } from '@/lib/email'

export async function POST(req: NextRequest) {
  const { name, email, subject, message } = await req.json() as {
    name?: string; email?: string; subject?: string; message?: string
  }

  if (!name || !email || !message || message.length < 20) {
    return NextResponse.json({ error: 'Invalid form data' }, { status: 400 })
  }

  try {
    await sendEmail({
      to: process.env.EMAIL_REPLY_TO ?? 'support@filecurrent.com',
      subject: `[Contact] ${subject ?? 'General'} — from ${name}`,
      html: `
        <p><strong>From:</strong> ${name} (${email})</p>
        <p><strong>Subject:</strong> ${subject ?? 'General'}</p>
        <p><strong>Message:</strong></p>
        <p>${message.replace(/\n/g, '<br>')}</p>
      `,
    })
    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json({ error: 'Send failed' }, { status: 500 })
  }
}
