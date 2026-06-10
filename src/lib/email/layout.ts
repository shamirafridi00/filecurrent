export function emailLayout({
  previewText = '',
  body,
  footerText = '',
  senderName,
}: {
  previewText?: string
  body: string
  footerText?: string
  /** Freelancer name/business — used for the "You received this email because…" footer. */
  senderName?: string
}): string {
  const footer =
    footerText ||
    (senderName
      ? `You received this email because ${senderName} uses FileCurrent &middot; <a href="https://filecurrent.com" style="color:#9CA3AF;text-decoration:underline;">filecurrent.com</a>`
      : 'FileCurrent &middot; <a href="https://filecurrent.com" style="color:#635BFF;text-decoration:none;">filecurrent.com</a>')

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width,initial-scale=1">
  <title>FileCurrent</title>
</head>
<body style="margin:0;padding:0;background:#F6F9FC;font-family:Georgia,'Times New Roman',serif;">
  ${previewText ? `<div style="display:none;max-height:0;overflow:hidden;font-size:1px;line-height:1px;color:#F6F9FC;max-width:0;">
    ${previewText}&nbsp;&#8204;&#8204;&#8204;&#8204;&#8204;&#8204;&#8204;&#8204;&#8204;&#8204;&#8204;&#8204;&#8204;&#8204;&#8204;&#8204;&#8204;&#8204;
  </div>` : ''}
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#F6F9FC;padding:40px 16px;">
    <tr><td align="center">
      <table width="100%" cellpadding="0" cellspacing="0" style="max-width:600px;">

        <!-- Header -->
        <tr>
          <td style="background:#635BFF;border-radius:8px 8px 0 0;padding:20px 32px;">
            <span style="color:#ffffff;font-size:18px;font-weight:700;letter-spacing:-0.3px;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Arial,sans-serif;">FileCurrent</span>
          </td>
        </tr>

        <!-- Body -->
        <tr>
          <td style="background:#ffffff;padding:32px;border-left:1px solid #E6EBF1;border-right:1px solid #E6EBF1;font-family:Georgia,'Times New Roman',serif;">
            ${body}
          </td>
        </tr>

        <!-- Footer -->
        <tr>
          <td style="background:#F9FAFB;border:1px solid #E6EBF1;border-top:none;border-radius:0 0 8px 8px;padding:16px 32px;">
            <p style="margin:0;font-size:12px;color:#9CA3AF;text-align:center;line-height:1.6;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Arial,sans-serif;">
              ${footer}
            </p>
          </td>
        </tr>

      </table>
    </td></tr>
  </table>
</body>
</html>`
}

/** Standard primary CTA button used across all transactional emails. */
export function emailButton(href: string, label: string): string {
  return `
    <div style="text-align:center;margin:28px 0;">
      <a href="${href}"
         style="display:inline-block;background:#635BFF;color:#ffffff;padding:12px 24px;border-radius:6px;text-decoration:none;font-size:15px;font-weight:600;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Arial,sans-serif;">
        ${label}
      </a>
    </div>`
}
