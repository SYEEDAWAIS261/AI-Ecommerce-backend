const express = require("express");
const router = express.Router();
const nodemailer = require("nodemailer");

// POST /api/contact
router.post("/", async (req, res) => {
  const { username, email, subject, textarea } = req.body;

  if (!username || !email || !subject || !textarea) {
    return res.status(400).json({ success: false, message: "All fields are required" });
  }

  try {
    const transporter = nodemailer.createTransport({
      host: "smtp.mail.me.com",
      port: 587,
      secure: false,
      auth: {
        user: "awaisshah14101@icloud.com",
        pass: "ljcu-emro-echq-nlnr", // App-specific password (never share this publicly)
      },
    });

    const mailOptions = {
  from: `"Website Contact Form" <awaisshah14101@icloud.com>`, // ✅ Must match SMTP auth user
  to: "awaisshah14101@icloud.com", // your receiving address
  replyTo: email, // ✅ This is where you can receive replies from user
  subject: `New Contact Form Message - ${subject}`,
  text: `You have a new message from your website contact form:\n\nName: ${username}\nEmail: ${email}\n\nMessage:\n${textarea}`,
};


    const info = await transporter.sendMail(mailOptions);
    console.log("✅ Email sent:", info.messageId);

    res.status(200).json({ success: true, message: "Message sent successfully" });
  } catch (error) {
    console.error("❌ Error sending email:", error);
    res.status(500).json({ success: false, message: "Failed to send message" });
  }
});

module.exports = router;
