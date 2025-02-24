import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

export const paymentSuccess = async (req, res) => {
  const { name, email, doctorEmail, doctorName } = req.body;

  try {
    // Nodemailer transporter setup
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER, // Your Gmail
        pass: process.env.EMAIL_PASS, // Your App Password
      },
    });

    // Email to Doctor (Existing code)
    const doctorMailOptions = {
      from: process.env.EMAIL_USER,
      to: doctorEmail,
      subject: "New Payment Received",
      text: `Dear Doctor,

You have received a new payment.

Client Details:
- Name: ${name}
- Email: ${email}

Please note:
- You are required to create a Zoom meeting ID and send the link to the user. 
- It is your responsibility to send the link at a time convenient to you.

Best regards,
Your Admin`,
    };

    // Email to User (New addition)
    const userMailOptions = {
      from: process.env.EMAIL_USER,
      to: email, // Send email to user
      subject: "Payment Successful - Your Consultation",
      text: `Dear ${name},

Your payment has been successfully processed.

Doctor Email: ${doctorEmail}

Your consultation with the doctor is scheduled. You will receive a Zoom meeting link directly from the doctor at the suitable time. Thank you for choosing our services!"

Best regards,
Your Admin`,
    };

    // Send emails
    await transporter.sendMail(doctorMailOptions);
    await transporter.sendMail(userMailOptions);

    res.status(200).json({ success: true, message: "Emails sent successfully!" });
  } catch (error) {
    console.error("Email sending failed:", error.message); // Log error message
    res.status(500).json({ success: false, message: "Failed to send email." });
  }
};
