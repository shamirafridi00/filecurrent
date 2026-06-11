import { emailLayout, emailButton } from '../layout'

/**
 * Sent to a client inviting them to fill out an intake form. The CTA opens the
 * public form at /intake/[token].
 */
export function intakeFormEmail({
  clientName,
  freelancerName,
  freelancerBusiness,
  formTitle,
  formDescription,
  formUrl,
}: {
  clientName: string
  freelancerName: string
  freelancerBusiness: string | null
  formTitle: string
  formDescription?: string | null
  formUrl: string
}): string {
  const sender = freelancerBusiness || freelancerName

  const body = `
    <h2 style="margin:0 0 8px;color:#111827;font-size:20px;">${formTitle}</h2>
    <p style="color:#6B7280;margin:0 0 20px;font-size:14px;line-height:1.6;">
      Hi ${clientName}, ${sender} would like you to fill out a quick form to get
      your project started.${formDescription ? ` ${formDescription}` : ''}
    </p>

    <p style="color:#6B7280;margin:0 0 4px;font-size:13px;line-height:1.6;">
      It only takes a couple of minutes.
    </p>

    ${emailButton(formUrl, 'Fill Out the Form')}

    <p style="color:#9CA3AF;margin:20px 0 0;font-size:12px;line-height:1.6;">
      If the button doesn't work, copy and paste this link into your browser:<br>
      <a href="${formUrl}" style="color:#635BFF;">${formUrl}</a>
    </p>`

  return emailLayout({
    previewText: `${sender} sent you a form: ${formTitle}`,
    body,
    senderName: sender,
  })
}
