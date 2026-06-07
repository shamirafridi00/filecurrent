export function emailLayout({
  previewText = '',
  body,
  footerText = '',
}: {
  previewText?: string
  body: string
  footerText?: string
}): string {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width,initial-scale=1">
  <title>FileCurrent</title>
</head>
<body style="margin:0;padding:0;background:#F3F4F6;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Arial,sans-serif;">
  ${previewText ? `<div style="display:none;max-height:0;overflow:hidden;font-size:1px;line-height:1px;color:#F3F4F6;max-width:0;">
    ${previewText}&nbsp;&#8204;&#8204;&#8204;&#8204;&#8204;&#8204;&#8204;&#8204;&#8204;&#8204;&#8204;&#8204;&#8204;&#8204;&#8204;&#8204;&#8204;&#8204;
  </div>` : ''}
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#F3F4F6;padding:40px 16px;">
    <tr><td align="center">
      <table width="100%" cellpadding="0" cellspacing="0" style="max-width:600px;">

        <!-- Header -->
        <tr>
          <td style="background:#635BFF;border-radius:8px 8px 0 0;padding:20px 32px;">
            <span style="color:#ffffff;font-size:18px;font-weight:700;letter-spacing:-0.3px;">FileCurrent</span>
          </td>
        </tr>

        <!-- Body -->
        <tr>
          <td style="background:#ffffff;padding:32px;border-left:1px solid #E5E7EB;border-right:1px solid #E5E7EB;">
            ${body}
          </td>
        </tr>

        <!-- Footer -->
        <tr>
          <td style="background:#F9FAFB;border:1px solid #E5E7EB;border-top:none;border-radius:0 0 8px 8px;padding:16px 32px;">
            <p style="margin:0;font-size:12px;color:#9CA3AF;text-align:center;line-height:1.6;">
              ${footerText || 'FileCurrent &middot; <a href="https://filecurrent.com" style="color:#635BFF;text-decoration:none;">filecurrent.com</a>'}
            </p>
          </td>
        </tr>

      </table>
    </td></tr>
  </table>
</body>
</html>`
}
