const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const nodemailer = require("nodemailer");
require("dotenv").config();
// const mailgun = require("mailgun-js");

const app = express();
app.use(bodyParser.json());
app.use(cors());

// Configure your Gmail SMTP settings
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL,
    pass: process.env.APP_PASS,
  },
});

app.get("/", (req, res) => {
  res.send("this is hikals company laptop.");
});

app.post("/send-emails", async (req, res) => {
  try {
    const emailData = req.body;

    console.log("emailData: ", emailData);

    if (!Array.isArray(emailData) || emailData.length === 0) {
      return res.status(400).json({ error: "Invalid or empty email data." });
    }

    const emailPromises = emailData?.map(
      async ([recipientEmail, subject, body]) => {
        console.log("Recipient Email:", recipientEmail);

        const data = {
          from: '"Hikal Agency" <ubaidathikal@gmail.com>', // Replace with your Gmail email
          to: recipientEmail,
          subject,
          text: body,
        };

        try {
          const result = await transporter.sendMail(data);
          console.log("Email sent:", result);
          return { candidateEmail: recipientEmail, success: true };
        } catch (error) {
          console.error("Error sending email:", error);
          return { candidateEmail: recipientEmail, success: false };
        }
      }
    );

    const results = await Promise.all(emailPromises);
    res.json(results);
  } catch (error) {
    console.error("Error sending emails:", error);
    res.status(500).json({ error: "An error occurred while sending emails." });
  }
});

// const ip = "192.168.18.41";
const PORT = process.env.PORT || 9000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

// app.listen(PORT, ip, () => {
//   console.log(`Server is running on http://${ip}:${PORT}`);
// });
