import { Prescription } from "../models/prescriptionModel.js";
import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

export const addPrescription = async (req, res) => {
  try {
    const { doctorName, doctorEmail, patientName, patientEmail, meetingMode, disease, cause, medicine, meetingDate } = req.body;

    // Save prescription to database
    const newPrescription = new Prescription({
      doctorName,
      doctorEmail, 
      patientName,
      patientEmail,
      meetingMode,
      disease,
      cause,
      medicine,
      meetingDate,
    });

    await newPrescription.save();

    // Send email to patient
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER, 
        pass: process.env.EMAIL_PASS,
      },
    });

    const mailOptions = {
      from: doctorEmail, 
      to: patientEmail,
      subject: "Your Prescription Details",
      text: `Dear ${patientName},

Doctor: ${doctorName}
Meeting Mode: ${meetingMode}
Disease: ${disease}
Cause: ${cause}
Medicine: ${medicine}
Meeting Date: ${meetingDate}

Best regards,
Dr. ${doctorName}`,
    };

    await transporter.sendMail(mailOptions);

    res.status(201).json({ success: true, message: "Prescription saved and email sent successfully!" });
  } catch (error) {
    console.error("Error:", error.message);
    res.status(500).json({ success: false, message: "Error processing prescription" });
  }
};
