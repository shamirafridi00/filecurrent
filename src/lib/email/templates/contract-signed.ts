export function contractSignedEmail({
  signerName,
  contractTitle,
  signedAt,
  dashboardUrl,
  toFreelancer,
}: {
  signerName: string
  contractTitle: string
  signedAt: string
  dashboardUrl: string
  toFreelancer: boolean
}): string {
  const heading = toFreelancer
    ? `✅ ${signerName} signed your contract`
    : `✅ You signed "${contractTitle}"`

  const body = toFreelancer
    ? `${signerName} has reviewed and signed <strong>${contractTitle}</strong>. The signed contract and audit trail are attached to this email.`
    : `You have successfully signed <strong>${contractTitle}</strong>. A copy of the signed document is attached for your records.`

  return `<!DOCTYPE html>
<html>
<body style="margin:0;padding:0;background:#f4f4f4;font-family:Arial,sans-serif;">
  <div style="max-width:600px;margin:40px auto;background:#ffffff;border-radius:8px;overflow:hidden;box-shadow:0 1px 3px rgba(0,0,0,0.1);">
    <div style="background:#635BFF;padding:28px 32px;">
      <span style="color:#ffffff;font-size:20px;font-weight:700;">FileCurrent</span>
    </div>
    <div style="padding:32px;">
      <h2 style="margin:0 0 16px;color:#111827;font-size:22px;">${heading}</h2>
      <p style="color:#6B7280;margin:0 0 24px;font-size:15px;line-height:1.6;">${body}</p>
      <div style="border:1px solid #D1FAE5;background:#F0FDF4;border-radius:8px;padding:20px;margin-bottom:24px;">
        <p style="margin:0 0 6px;color:#6B7280;font-size:12px;text-transform:uppercase;letter-spacing:0.05em;">Signed Document</p>
        <p style="margin:0 0 4px;color:#111827;font-size:16px;font-weight:600;">${contractTitle}</p>
        <p style="margin:0;color:#6B7280;font-size:13px;">Signed by ${signerName} on ${signedAt}</p>
      </div>
      <div style="text-align:center;margin:28px 0;">
        <a href="${dashboardUrl}"
           style="display:inline-block;background:#635BFF;color:#ffffff;padding:14px 32px;border-radius:8px;text-decoration:none;font-size:16px;font-weight:600;">
          ${toFreelancer ? 'View in FileCurrent →' : 'View Signed Document →'}
        </a>
      </div>
      <hr style="border:none;border-top:1px solid #E5E7EB;margin:28px 0;">
      <p style="color:#9CA3AF;font-size:12px;text-align:center;margin:0;">
        This document was signed electronically via FileCurrent.<br>
        Compliant with the ESIGN Act (15 U.S.C. § 7001 et seq.).
      </p>
    </div>
  </div>
</body>
</html>`
}
