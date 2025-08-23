// server.js
const express = require("express");
const bodyParser = require("body-parser");
const nodemailer = require("nodemailer");
const cors = require("cors");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 5000;

// ========================
// Middleware
// ========================
app.use(bodyParser.json());
app.use(cors());

// ✅ Serve static frontend (HTML, CSS, JS, JSON)
app.use(express.static(path.join(__dirname, "../frontend")));

// ========================
// Nodemailer setup
// ========================
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "theemenenttimes@gmail.com",      // ✅ your Gmail
    pass: "mouozxbqysbflmzi"               // ✅ app password (keep secret!)
  }
});

// ========================
// Email API route
// ========================
app.post("/send", (req, res) => {
  const { name, email, department, subject, message } = req.body;

  if (!name || !email || !department || !subject || !message) {
    return res.status(400).json({ error: "All fields are required." });
  }

  const mailOptions = {
    from: `"${name}" <${email}>`,
    to: "theemenenttimes@gmail.com",
    subject: `[${department}] ${subject}`,
    text: `From: ${name} (${email})\n\n${message}`
  };

  transporter.sendMail(mailOptions, (err, info) => {
    if (err) {
      console.error("❌ Email send error:", err);
      return res.status(500).json({ error: "Error sending message." });
    }
    console.log("✅ Email sent:", info.response);
    res.json({ success: "Message sent successfully!" });
  });
});

// ========================
// Serve index.html (fallback)
// ========================
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "../frontend/index.html"));
});

// ========================
// Start server
// ========================
app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
