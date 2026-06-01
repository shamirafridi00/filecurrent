export function invoiceOpenedEmail({
  clientName,
  invoiceNumber,
  amount,
  openedAt,
  dashboardUrl,
}: {
  clientName: string
  invoiceNumber: string
  amount: string
  openedAt: string
  dashboardUrl: string
}): string {
  return `<!DOCTYPE html>
<html>
<body style="margin:0;padding:0;background:#f4f4f4;font-family:Arial,sans-serif;">
  <div style="max-width:520px;margin:40px auto;background:#ffffff;border-radius:8px;overflow:hidden;box-shadow:0 1px 3px rgba(0,0,0,0.1);">
    <div style="background:#0F766E;padding:20px 28px;">
      <span style="color:#ffffff;font-size:18px;font-weight:700;">FileCurrent</span>
    </div>
    <div style="padding:28px;">
      <h2 style="margin:0 0 8px;color:#111827;font-size:18px;">👀 ${clientName} opened your invoice</h2>
      <p style="color:#6B7280;margin:0 0 20px;font-size:14px;line-height:1.6;">
        Good news — ${clientName} just viewed your invoice for <strong>${amount}</strong>.
      </p>
      <div style="border:1px solid #E5E7EB;border-radius:6px;padding:16px;margin-bottom:20px;">
        <p style="margin:0 0 4px;color:#6B7280;font-size:12px;text-transform:uppercase;letter-spacing:0.05em;">Invoice</p>
        <p style="margin:0 0 8px;color:#111827;font-size:15px;font-weight:600;">${invoiceNumber} · ${amount}</p>
        <p style="margin:0;color:#6B7280;font-size:13px;">Opened at ${openedAt}</p>
      </div>
      <div style="text-align:center;">
        <a href="${dashboardUrl}"
           style="display:inline-block;background:#0F766E;color:#ffffff;padding:12px 28px;border-radius:8px;text-decoration:none;font-size:14px;font-weight:600;">
          View Invoice →
        </a>
      </div>
      <hr style="border:none;border-top:1px solid #E5E7EB;margin:24px 0;">
      <p style="color:#9CA3AF;font-size:12px;text-align:center;margin:0;">
        FileCurrent · Invoice activity notification
      </p>
    </div>
  </div>
</body>
</html>`
}
