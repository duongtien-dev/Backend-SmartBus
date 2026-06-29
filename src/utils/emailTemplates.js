const SITE_NAME = 'Smart Bus';
const SITE_TAGLINE = 'Xe bus thông minh';

function getOtpEmailHtml(otp) {
    return `
<!DOCTYPE html>
<html lang="vi">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Mã xác nhận - ${SITE_NAME}</title>
</head>
<body style="margin:0; padding:0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #f3f4f6;">
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background-color: #f3f4f6; padding: 40px 20px;">
    <tr>
        <td align="center">
        <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width: 480px; background-color: #ffffff; border-radius: 12px; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -2px rgba(0, 0, 0, 0.1); overflow: hidden;">
            <!-- Header -->
            <tr>
            <td style="background: linear-gradient(135deg, #0ea5e9 0%, #0369a1 100%); padding: 28px 32px; text-align: center;">
                <h1 style="margin: 0; font-size: 24px; font-weight: 700; color: #ffffff; letter-spacing: -0.5px;">${SITE_NAME}</h1>
                <p style="margin: 6px 0 0 0; font-size: 13px; color: rgba(255,255,255,0.9);">${SITE_TAGLINE}</p>
                </td>
            </td>
            </tr>
            <!-- Content -->
            <tr>
                <td style="padding: 32px;">
                <p style="margin: 0 0 8px 0; font-size: 16px; color: #374151; font-weight: 600;">Mã xác nhận đăng ký tài khoản</p>
                <p style="margin: 0 0 20px 0; font-size: 14px; color: #6b7280; line-height: 1.5;">Vui lòng nhập mã bên dưới để hoàn tất đăng ký.</p>
                <table role="presentation" width="100%" cellspacing="0" cellpadding="0">
                    <tr>
                    <td align="center" style="padding: 16px 0;">
                        <span style="display: inline-block; font-size: 28px; font-weight: 700; letter-spacing: 8px; color: #0369a1; background-color: #e0f2fe; padding: 16px 24px; border-radius: 8px; border: 2px dashed #0ea5e9;">${otp}</span>
                    </td>
                    </tr>
                </table>
                <p style="margin: 20px 0 0 0; font-size: 13px; color: #9ca3af;">Mã có hiệu lực trong vòng <strong>1 phút</strong>. Không chia sẻ mã này với bất kỳ ai.</p>
                </td>
            </tr>
            <!-- Footer -->
            <tr>
                <td style="padding: 20px 32px; background-color: #f9fafb; border-top: 1px solid #e5e7eb;">
                <p style="margin: 0; font-size: 12px; color: #9ca3af; text-align: center;">© ${new Date().getFullYear()} ${SITE_NAME}. ${SITE_TAGLINE}.</p>
                </td>
            </tr>
            </table>
        </td>
    </tr>
    </table>
</body>
</html>
`.trim();
}

function getForgotPasswordOtpEmailHtml(otp) {
    return `
<!DOCTYPE html>
<html lang="vi">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Đặt lại mật khẩu - ${SITE_NAME}</title>
</head>
<body style="margin:0; padding:0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #f3f4f6;">
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background-color: #f3f4f6; padding: 40px 20px;">
        <tr>
            <td align="center">
                <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width: 480px; background-color: #ffffff; border-radius: 12px; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -2px rgba(0, 0, 0, 0.1); overflow: hidden;">
                    <!-- Header -->
                    <tr>
                        <td style="background: linear-gradient(135deg, #0ea5e9 0%, #0369a1 100%); padding: 28px 32px; text-align: center;">
                            <h1 style="margin: 0; font-size: 24px; font-weight: 700; color: #ffffff; letter-spacing: -0.5px;">${SITE_NAME}</h1>
                            <p style="margin: 6px 0 0 0; font-size: 13px; color: rgba(255,255,255,0.9);">${SITE_TAGLINE}</p>
                        </td>
                    </tr>
                    <!-- Content -->
                    <tr>
            <td style="padding: 32px;">
            <p style="margin: 0 0 8px 0; font-size: 16px; color: #374151; font-weight: 600;">Mã xác nhận đặt lại mật khẩu</p>
            <p style="margin: 0 0 20px 0; font-size: 14px; color: #6b7280; line-height: 1.5;">Bạn đã yêu cầu đặt lại mật khẩu. Nhập mã bên dưới để tiếp tục.</p>
            <table role="presentation" width="100%" cellspacing="0" cellpadding="0">
                <tr>
                    <td align="center" style="padding: 16px 0;">
                        <span style="display: inline-block; font-size: 28px; font-weight: 700; letter-spacing: 8px; color: #0369a1; background-color: #e0f2fe; padding: 16px 24px; border-radius: 8px; border: 2px dashed #0ea5e9;">${otp}</span>
                    </td>
                </tr>
            </table>
            <p style="margin: 20px 0 0 0; font-size: 13px; color: #9ca3af;">Mã có hiệu lực trong vòng <strong>2 phút</strong>. Không chia sẻ mã này với bất kỳ ai.</p>
            </td>
            </tr>
        </table>
        </td>
    </tr>
    </table>
</body>
</html>
`.trim();
}

module.exports = { getOtpEmailHtml, getForgotPasswordOtpEmailHtml, SITE_NAME, SITE_TAGLINE };
