export function contractSignatureRequestEmail({
  freelancerName,
  clientName,
  contractTitle,
  projectAmount,
  signingUrl,
}: {
  freelancerName: string
  clientName: string
  contractTitle: string
  projectAmount: string
  signingUrl: string
}): string {
  return `<!DOCTYPE html>
<html>
<body style="margin:0;padding:0;background:#f4f4f4;font-family:Arial,sans-serif;">
  <div style="max-width:600px;margin:40px auto;background:#ffffff;border-radius:8px;overflow:hidden;box-shadow:0 1px 3px rgba(0,0,0,0.1);">
    <div style="background:#635BFF;padding:28px 32px;">
      <span style="color:#ffffff;font-size:20px;font-weight:700;">FileCurrent</span>
    </div>
    <div style="padding:32px;">
      <h2 style="margin:0 0 8px;color:#111827;font-size:22px;">You have a contract to sign</h2>
      <p style="color:#6B7280;margin:0 0 24px;font-size:15px;">
        ${freelancerName} has sent you a contract for your review and signature.
      </p>
      <div style="border:1px solid #E5E7EB;border-radius:8px;padding:20px;margin-bottom:24px;">
        <p style="margin:0 0 6px;color:#6B7280;font-size:12px;text-transform:uppercase;letter-spacing:0.05em;">Contract</p>
        <p style="margin:0 0 4px;color:#111827;font-size:18px;font-weight:600;">${contractTitle}</p>
        <p style="margin:0;color:#635BFF;font-size:16px;font-weight:500;">${projectAmount}</p>
      </div>
      <div style="text-align:center;margin:28px 0;">
        <a href="${signingUrl}"
           style="display:inline-block;background:#635BFF;color:#ffffff;padding:14px 32px;border-radius:8px;text-decoration:none;font-size:16px;font-weight:600;">
          Review &amp; Sign Contract
        </a>
      </div>
      <p style="color:#9CA3AF;font-size:13px;text-align:center;">
        Or copy this link: <a href="${signingUrl}" style="color:#635BFF;">${signingUrl}</a>
      </p>
      <hr style="border:none;border-top:1px solid #E5E7EB;margin:28px 0;">
      <p style="color:#9CA3AF;font-size:12px;text-align:center;margin:0;">
        This contract was sent via FileCurrent.<br>
        By signing, you agree electronically under the ESIGN Act (15 U.S.C. § 7001).
      </p>
    </div>
  </div>
</body>
</html>`
}
