const EmailTemplate = (otp) => {
  return `
    <!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>Your OTP - Cyber Sentiene</title>
</head>
<body style="font-family: Arial, sans-serif; background-color: #f2f2f2; padding: 20px; margin: 0;">
  <div style="max-width: 500px; margin: auto; background-color: #ffffff; padding: 30px; border-radius: 8px; text-align: center; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">

    <h2 style="color: #333;">Cyber Sentiene</h2>

    <p style="font-size: 16px; color: #444;">Hello,</p>

    <p style="font-size: 16px; color: #444;">
      This is your OTP from <strong>Cyber Sentiene</strong>:
    </p>

    <div style="font-size: 28px; font-weight: bold; letter-spacing: 6px; padding: 12px 20px; background-color: #f0f0f0; display: inline-block; border-radius: 5px; margin: 20px 0; color: #000;">
      ${otp}
    </div>

    <p style="font-size: 14px; color: #666;">
      This OTP is valid for only <strong>1–2 minutes</strong>.
    </p>

    <p style="font-size: 13px; color: #999;">Please do not share it with anyone.</p>

  </div>
</body>
</html>
  `;
};

module.exports = EmailTemplate;
