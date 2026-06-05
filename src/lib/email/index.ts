import 'server-only'
import { BrevoClient } from '@getbrevo/brevo'

const client = new BrevoClient({ apiKey: process.env.BREVO_API_KEY ?? '' })

export const FROM_EMAIL = process.env.EMAIL_FROM_ADDRESS ?? 'noreply@filecurrent.com'
export const FROM_NAME = process.env.EMAIL_FROM_NAME ?? 'FileCurrent'

export async function sendEmail({
  to,
  subject,
  html,
}: {
  to: string
  subject: string
  html: string
}) {
  console.log('[email] Sending to:', to, '| subject:', subject)
  const result = await client.transactionalEmails.sendTransacEmail({
    to: [{ email: to }],
    sender: { name: FROM_NAME, email: FROM_EMAIL },
    subject,
    htmlContent: html,
    replyTo: { email: process.env.EMAIL_REPLY_TO ?? 'support@filecurrent.com' },
  })
  console.log('[email] Sent successfully, messageId:', result.messageId)
  return result
}
