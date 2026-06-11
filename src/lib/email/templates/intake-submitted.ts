import { emailLayout, emailButton } from '../layout'

/**
 * Sent to the freelancer when a client submits one of their intake forms.
 * The CTA opens the form's responses viewer so they can read the answers.
 */
export function intakeSubmittedEmail({
  freelancerName,
  clientName,
  formTitle,
  responsesUrl,
  createdClient,
}: {
  freelancerName: string
  clientName: string
  formTitle: string
  responsesUrl: string
  createdClient: boolean
}): string {
  const body = `
    <h2 style="margin:0 0 8px;color:#111827;font-size:20px;">New intake form response</h2>
    <p style="color:#6B7280;margin:0 0 24px;font-size:14px;line-height:1.6;">
      Hi ${freelancerName}, <strong>${clientName}</strong> just submitted your
      intake form. The details are saved to your dashboard.
    </p>

    <div style="border:1px solid #E5E7EB;border-radius:8px;padding:20px;margin-bottom:20px;">
      <p style="margin:0 0 4px;color:#6B7280;font-size:12px;text-transform:uppercase;letter-spacing:0.05em;">Form</p>
      <p style="margin:0 0 12px;color:#111827;font-size:15px;font-weight:600;">${formTitle}</p>
      <p style="margin:0 0 4px;color:#6B7280;font-size:12px;text-transform:uppercase;letter-spacing:0.05em;">Submitted by</p>
      <p style="margin:0;color:#111827;font-size:15px;font-weight:600;">${clientName}</p>
    </div>

    ${createdClient ? `
    <p style="color:#374151;font-size:13px;margin:0 0 4px;line-height:1.6;">
      A client record was created automatically from this submission.
    </p>` : ''}

    ${emailButton(responsesUrl, 'View Response')}`

  return emailLayout({
    previewText: `${clientName} submitted your intake form "${formTitle}"`,
    body,
    senderName: freelancerName,
  })
}
