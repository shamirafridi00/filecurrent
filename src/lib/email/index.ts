import 'server-only'
import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

export const FROM = process.env.EMAIL_FROM ?? 'FileCurrent <onboarding@resend.dev>'
export const REPLY_TO = process.env.EMAIL_REPLY_TO ?? 'support@filecurrent.io'

export async function sendEmail({
  to,
  subject,
  html,
  attachments,
}: {
  to: string
  subject: string
  html: string
  attachments?: { filename: string; content: Buffer }[]
}) {
  const { data, error } = await resend.emails.send({
    from: FROM,
    to,
    replyTo: REPLY_TO,
    subject,
    html,
    attachments: attachments?.map((a) => ({
      filename: a.filename,
      content: a.content,
    })),
  })
  if (error) {
    console.error('Email send failed:', error)
    throw new Error(`Email failed: ${error.message}`)
  }
  return data
}
