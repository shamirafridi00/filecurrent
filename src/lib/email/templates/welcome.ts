import { emailLayout } from '../layout'

export function welcomeEmail({
  fullName,
  trialDaysLeft,
  dashboardUrl,
}: {
  fullName: string
  trialDaysLeft: number
  dashboardUrl: string
}): string {
  const firstName = fullName.split(' ')[0] || fullName

  const body = `
    <h2 style="margin:0 0 8px;color:#111827;font-size:22px;">Welcome to FileCurrent, ${firstName}!</h2>
    <p style="color:#6B7280;margin:0 0 24px;font-size:15px;line-height:1.6;">
      Your ${trialDaysLeft}-day free trial has started. Send your first contract or invoice today.
    </p>

    <div style="border:1px solid #E5E7EB;border-radius:8px;padding:20px;margin-bottom:28px;">
      <table width="100%" cellpadding="0" cellspacing="0">
        <tr>
          <td style="padding:8px 0;border-bottom:1px solid #F3F4F6;">
            <span style="color:#635BFF;font-size:16px;margin-right:10px;">&#9998;</span>
            <span style="color:#111827;font-size:14px;font-weight:500;">Contracts with e-signature</span>
          </td>
        </tr>
        <tr>
          <td style="padding:8px 0;border-bottom:1px solid #F3F4F6;">
            <span style="color:#635BFF;font-size:16px;margin-right:10px;">&#128181;</span>
            <span style="color:#111827;font-size:14px;font-weight:500;">Professional invoices</span>
          </td>
        </tr>
        <tr>
          <td style="padding:8px 0;">
            <span style="color:#635BFF;font-size:16px;margin-right:10px;">&#128276;</span>
            <span style="color:#111827;font-size:14px;font-weight:500;">Automated payment reminders</span>
          </td>
        </tr>
      </table>
    </div>

    <div style="text-align:center;margin:28px 0;">
      <a href="${dashboardUrl}"
         style="display:inline-block;background:#635BFF;color:#ffffff;padding:14px 32px;border-radius:8px;text-decoration:none;font-size:16px;font-weight:600;">
        Go to Dashboard &rarr;
      </a>
    </div>`

  return emailLayout({
    previewText: `Your ${trialDaysLeft}-day free trial has started — send your first invoice today`,
    body,
    footerText: 'Questions? Reply to this email &mdash; we read every one.',
  })
}
