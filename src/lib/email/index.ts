import 'server-only'
import { BrevoClient } from '@getbrevo/brevo'

const client = new BrevoClient({ apiKey: process.env.BREVO_API_KEY ?? '' })

export const FROM_EMAIL = process.env.EMAIL_FROM_ADDRESS ?? 'noreply@filecurrent.com'
export const FROM_NAME = process.env.EMAIL_FROM_NAME ?? 'FileCurrent'

export async function sendEmail({
  to,
  subject,
  html,
  replyTo,
  fromName,
}: {
  to: string
  subject: string
  html: string
  replyTo?: string
  fromName?: string
}) {
  const replyToEmail = replyTo ?? process.env.EMAIL_REPLY_TO ?? 'support@filecurrent.com'
  const senderName = fromName ?? FROM_NAME
  console.log('[email] Brevo sending to:', to, '| from:', FROM_EMAIL, '| sender:', senderName, '| subject:', subject)
  const result = await client.transactionalEmails.sendTransacEmail({
    to: [{ email: to }],
    sender: { name: senderName, email: FROM_EMAIL },
    subject,
    htmlContent: html,
    replyTo: { email: replyToEmail },
  })
  console.log('[email] Brevo sent successfully, messageId:', (result as { messageId?: string }).messageId)
  return result
}

export function buildSenderName(businessName: string | null | undefined, fullName: string | null | undefined): string {
  const name = businessName?.trim() || fullName?.trim() || 'Your service provider'
  return `${name} via FileCurrent`
}
