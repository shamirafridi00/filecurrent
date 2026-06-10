import { emailLayout } from '../layout'

export function paymentReminderEmail({
  clientName,
  freelancerName,
  businessName,
  invoiceNumber,
  amount,
  dueDate,
  daysOverdue,
  invoiceUrl,
  shareToken,
  stage,
}: {
  clientName: string
  freelancerName: string
  businessName: string | null
  invoiceNumber: string
  amount: string
  dueDate: string
  daysOverdue: number
  invoiceUrl: string
  shareToken: string
  stage: 'before_due' | 'on_due' | 'overdue'
}): string {
  const sender = businessName || freelancerName

  const { heading, intro, tone } = getStageContent(stage, daysOverdue, invoiceNumber, amount, dueDate, sender)

  const previewText = stage === 'before_due'
    ? `Reminder: Invoice ${invoiceNumber} for ${amount} due ${dueDate}`
    : stage === 'on_due'
    ? `Payment due today: Invoice ${invoiceNumber} — ${amount}`
    : `Overdue: Invoice ${invoiceNumber} — ${amount} was due ${dueDate}`

  const body = `
    <h2 style="margin:0 0 8px;color:#111827;font-size:20px;">${heading}</h2>
    <p style="color:#6B7280;margin:0 0 24px;font-size:15px;line-height:1.6;">
      Hi ${clientName},<br><br>${intro}
    </p>

    <div style="border:1px solid ${tone.borderColor};background:${tone.bgColor};border-radius:8px;padding:20px;margin-bottom:24px;">
      <table width="100%" cellpadding="0" cellspacing="0">
        <tr>
          <td>
            <p style="margin:0 0 4px;color:#6B7280;font-size:12px;text-transform:uppercase;letter-spacing:0.05em;">Invoice</p>
            <p style="margin:0;color:#111827;font-size:16px;font-weight:600;">${invoiceNumber}</p>
          </td>
          <td style="text-align:right;">
            <p style="margin:0 0 4px;color:#6B7280;font-size:12px;text-transform:uppercase;letter-spacing:0.05em;">Amount Due</p>
            <p style="margin:0;color:${tone.amountColor};font-size:22px;font-weight:700;">${amount}</p>
          </td>
        </tr>
      </table>
      ${stage !== 'before_due' ? `
      <div style="margin-top:12px;padding-top:12px;border-top:1px solid ${tone.borderColor};">
        <p style="margin:0;color:${tone.amountColor};font-size:13px;font-weight:600;">
          ${stage === 'on_due' ? `Due today` : `${daysOverdue} day${daysOverdue !== 1 ? 's' : ''} overdue (was due ${dueDate})`}
        </p>
      </div>` : `
      <div style="margin-top:12px;padding-top:12px;border-top:1px solid ${tone.borderColor};">
        <p style="margin:0;color:#6B7280;font-size:13px;">Due date: ${dueDate}</p>
      </div>`}
    </div>

    <div style="text-align:center;margin:28px 0;">
      <a href="${invoiceUrl}"
         style="display:inline-block;background:${tone.headerColor};color:#ffffff;padding:14px 32px;border-radius:8px;text-decoration:none;font-size:16px;font-weight:600;">
        View &amp; Pay Invoice &rarr;
      </a>
    </div>`

  return emailLayout({
    previewText,
    body,
    footerText: `Sent by ${sender} via FileCurrent. <a href="${process.env.NEXT_PUBLIC_APP_URL}/i/${shareToken}/unsubscribe" style="color:#9CA3AF;">Unsubscribe from reminders for this invoice</a>`,
  })
}

// Tone escalates with how late the invoice is:
// before/on due → friendly · ≤7 days late → direct · >7 days late → firm.
function getStageContent(
  stage: 'before_due' | 'on_due' | 'overdue',
  daysOverdue: number,
  invoiceNumber: string,
  amount: string,
  dueDate: string,
  sender: string
) {
  if (stage === 'before_due') {
    return {
      heading: `Heads-up: Invoice ${invoiceNumber} due soon`,
      intro: `Just a friendly note that Invoice ${invoiceNumber} for ${amount} comes due on ${dueDate}. No action needed if you've already arranged payment.`,
      tone: { headerColor: '#635BFF', borderColor: '#D1FAE5', bgColor: '#F0FDF4', amountColor: '#065F46' },
    }
  }
  if (stage === 'on_due') {
    return {
      heading: `Invoice ${invoiceNumber} is due today`,
      intro: `A quick reminder that Invoice ${invoiceNumber} for ${amount} is due today. Here's the link in case it got buried.`,
      tone: { headerColor: '#D97706', borderColor: '#FDE68A', bgColor: '#FFFBEB', amountColor: '#92400E' },
    }
  }
  if (daysOverdue <= 3) {
    return {
      heading: `Friendly nudge: Invoice ${invoiceNumber}`,
      intro: `Just a friendly nudge &mdash; Invoice ${invoiceNumber} for ${amount} was due on ${dueDate}. Here's the link if it got buried in your inbox.`,
      tone: { headerColor: '#D97706', borderColor: '#FDE68A', bgColor: '#FFFBEB', amountColor: '#92400E' },
    }
  }
  if (daysOverdue <= 7) {
    return {
      heading: `Overdue: Invoice ${invoiceNumber}`,
      intro: `Invoice ${invoiceNumber} for ${amount} is now ${daysOverdue} days overdue. Please arrange payment at your earliest convenience. If you have any questions, just reply to this email.`,
      tone: { headerColor: '#DC2626', borderColor: '#FECACA', bgColor: '#FEF2F2', amountColor: '#991B1B' },
    }
  }
  return {
    heading: `Overdue notice: Invoice ${invoiceNumber}`,
    intro: `Invoice ${invoiceNumber} for ${amount} remains unpaid ${daysOverdue} days after its due date. This invoice may be subject to late fees if not settled promptly. If there is a dispute or issue, please contact ${sender} directly by replying to this email.`,
    tone: { headerColor: '#7F1D1D', borderColor: '#FECACA', bgColor: '#FEF2F2', amountColor: '#991B1B' },
  }
}
