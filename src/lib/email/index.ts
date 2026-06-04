import 'server-only'
import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

export const FROM = process.env.EMAIL_FROM ?? 'FileCurrent <noreply@filecurrent.com>'
export const REPLY_TO = process.env.EMAIL_REPLY_TO ?? 'support@filecurrent.com'

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
  console.log('[email] Sending to:', to, '| from:', FROM, '| subject:', subject)
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
    console.error('[email] Resend error:', JSON.stringify(error))
    throw new Error(`Email failed: ${error.message}`)
  }
  console.log('[email] Sent successfully, id:', data?.id)
  return data
}
