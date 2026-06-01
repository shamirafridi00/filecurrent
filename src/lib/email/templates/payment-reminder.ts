export function paymentReminderEmail({
  clientName,
  freelancerName,
  businessName,
  invoiceNumber,
  amount,
  dueDate,
  daysOverdue,
  invoiceUrl,
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
  stage: 'before_due' | 'on_due' | 'overdue'
}): string {
  const sender = businessName || freelancerName

  const { heading, intro, tone } = getStageContent(stage, daysOverdue, invoiceNumber, amount, dueDate, sender)

  return `<!DOCTYPE html>
<html>
<body style="margin:0;padding:0;background:#f4f4f4;font-family:Arial,sans-serif;">
  <div style="max-width:600px;margin:40px auto;background:#ffffff;border-radius:8px;overflow:hidden;box-shadow:0 1px 3px rgba(0,0,0,0.1);">
    <div style="background:${tone.headerColor};padding:24px 32px;">
      <span style="color:#ffffff;font-size:18px;font-weight:700;">${sender}</span>
    </div>
    <div style="padding:32px;">
      <h2 style="margin:0 0 8px;color:#111827;font-size:20px;">${heading}</h2>
      <p style="color:#6B7280;margin:0 0 24px;font-size:15px;line-height:1.6;">
        Hi ${clientName},<br><br>${intro}
      </p>

      <div style="border:1px solid ${tone.borderColor};background:${tone.bgColor};border-radius:8px;padding:20px;margin-bottom:24px;">
        <div style="display:flex;justify-content:space-between;align-items:center;">
          <div>
            <p style="margin:0 0 4px;color:#6B7280;font-size:12px;text-transform:uppercase;letter-spacing:0.05em;">Invoice</p>
            <p style="margin:0;color:#111827;font-size:16px;font-weight:600;">${invoiceNumber}</p>
          </div>
          <div style="text-align:right;">
            <p style="margin:0 0 4px;color:#6B7280;font-size:12px;text-transform:uppercase;letter-spacing:0.05em;">Amount Due</p>
            <p style="margin:0;color:${tone.amountColor};font-size:22px;font-weight:700;">${amount}</p>
          </div>
        </div>
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
          View &amp; Pay Invoice →
        </a>
      </div>

      <hr style="border:none;border-top:1px solid #E5E7EB;margin:28px 0;">
      <p style="color:#9CA3AF;font-size:12px;text-align:center;margin:0;">
        Sent by ${sender} via FileCurrent.<br>
        <a href="${invoiceUrl}?unsubscribe=1" style="color:#9CA3AF;">Unsubscribe from reminders for this invoice</a>
      </p>
    </div>
  </div>
</body>
</html>`
}

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
      heading: `Friendly reminder: Invoice ${invoiceNumber} due soon`,
      intro: `Just a heads-up that invoice ${invoiceNumber} for ${amount} is coming due on ${dueDate}. No action needed if you've already arranged payment — we just wanted to give you advance notice.`,
      tone: { headerColor: '#0F766E', borderColor: '#D1FAE5', bgColor: '#F0FDF4', amountColor: '#065F46' },
    }
  }
  if (stage === 'on_due') {
    return {
      heading: `Payment due today: Invoice ${invoiceNumber}`,
      intro: `This is a reminder that invoice ${invoiceNumber} for ${amount} is due today. Please arrange payment at your earliest convenience.`,
      tone: { headerColor: '#D97706', borderColor: '#FDE68A', bgColor: '#FFFBEB', amountColor: '#92400E' },
    }
  }
  if (daysOverdue <= 7) {
    return {
      heading: `Overdue: Invoice ${invoiceNumber}`,
      intro: `Invoice ${invoiceNumber} for ${amount} was due on ${dueDate} and remains unpaid. Please arrange payment as soon as possible. If you have any questions, please reply to this email.`,
      tone: { headerColor: '#DC2626', borderColor: '#FECACA', bgColor: '#FEF2F2', amountColor: '#991B1B' },
    }
  }
  return {
    heading: `OVERDUE NOTICE: Invoice ${invoiceNumber}`,
    intro: `Invoice ${invoiceNumber} for ${amount} is now ${daysOverdue} days past due. Please arrange immediate payment to avoid further action. If there is a dispute or issue, please contact ${sender} directly by replying to this email.`,
    tone: { headerColor: '#7F1D1D', borderColor: '#FECACA', bgColor: '#FEF2F2', amountColor: '#991B1B' },
  }
}
