import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

const transporter = nodemailer.createTransport({
  host: process.env.MAIL_HOST,
  port: process.env.MAIL_PORT,
  secure: true,
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASS,
  },
});

const sendEmail = async (email, verificationToken) => {
  const verificationLink = `${process.env.BASE_URL}/api/auth/verify/${verificationToken}`;

  const mailOptions = {
    from: process.env.MAIL_USER,
    to: email,
    subject: "Email verification",
    html: `
      <h1>Welcome to Our App</h1>
      <p>Click the link below to verify your email address:</p>
      <a href="${verificationLink}">Verify Email</a>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
  } catch (error) {
    console.error("Error sending verification email:", error);
  }
};

export default sendEmail;
